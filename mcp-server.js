#!/usr/bin/env node
// Minimal MCP server (stdio, JSON-RPC 2.0, newline-delimited). No dependencies.
// Tools: check_place_rules, search_place_rules, get_place_rule, validate_place_rules_file
//
// Data: fetches the live registry (https://openplacerules.org/data/seed.json) by default.
// Set PLACE_RULES_DATA to a directory containing seed.json to use local data instead.
// Set PLACE_RULES_OFFLINE=1 to skip the network and use the bundled seed (used by tests).
// Set PLACE_RULES_SEED_URL to fetch a different snapshot. If the live fetch fails, the
// bundled data/seed.json shipped with this repo (or the npm package) is used as a fallback.
const http = require('http');
const https = require('https');
const readline = require('readline');
const reg = require('./lib/registry');
const { validate } = require('./lib/validate');

const LIVE_SEED_URL = 'https://openplacerules.org/data/seed.json';
const UA = 'OpenPlaceRules-mcp/0.3 (+https://openplacerules.org)';

let db = null;
let dataSource = 'pending';

function fetchSeed(url, redirects = 0) {
  return new Promise((resolve, reject) => {
    if (redirects > 5) return reject(new Error('too many redirects'));
    let parsed;
    try { parsed = new URL(url); } catch (e) { return reject(e); }
    const lib = parsed.protocol === 'https:' ? https : http;
    const req = lib.get(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        return fetchSeed(new URL(res.headers.location, url).href, redirects + 1).then(resolve, reject);
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error('HTTP ' + res.statusCode + ' from ' + url));
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        try {
          const seed = JSON.parse(Buffer.concat(chunks).toString('utf8'));
          if (!seed || !Array.isArray(seed.entries)) return reject(new Error('seed is missing entries'));
          resolve(seed);
        } catch (e) { reject(e); }
      });
    });
    req.setTimeout(10000, () => { req.destroy(); reject(new Error('timeout fetching ' + url)); });
    req.on('error', reject);
  });
}

function useLocal(reason) {
  db = reg.load();
  if (process.env.PLACE_RULES_DATA) dataSource = 'local:' + process.env.PLACE_RULES_DATA;
  else dataSource = reason ? 'bundled-fallback (' + reason + ')' : 'bundled';
}

function resolveDb() {
  if (process.env.PLACE_RULES_DATA) { useLocal(); return Promise.resolve(); }
  if (process.env.PLACE_RULES_OFFLINE === '1') { useLocal(); return Promise.resolve(); }
  const url = process.env.PLACE_RULES_SEED_URL || LIVE_SEED_URL;
  return fetchSeed(url).then((seed) => {
    db = { version: seed.version, entries: seed.entries, superseded: [] };
    dataSource = url;
  }).catch((e) => {
    useLocal(e.message);
    process.stderr.write('OpenPlaceRules MCP: live seed unavailable (' + e.message + '); using bundled data.\n');
  });
}

const ready = resolveDb();

const TOOLS = [
  { name: 'check_place_rules',
    description: 'Answer "can I record / wear camera glasses / use AI capture / run a robot / fly a drone here?" for a lat/lng. Returns allowed | restricted | prohibited | unknown with sources. Owner-verified rules override reported ones. Unknown does NOT mean allowed. Reported entries are unverified by the place owner.',
    inputSchema: { type: 'object', required: ['lat', 'lng'], properties: {
      lat: { type: 'number' }, lng: { type: 'number' },
      activity: { type: 'string', enum: reg.ACTIVITIES, default: 'recording' },
      date: { type: 'string', description: 'YYYY-MM-DD; defaults to today' } } } },
  { name: 'search_place_rules',
    description: 'Search the OpenPlaceRules registry by text (name, city, kind such as court/school/pool/park/airport), activity, rule value, country code, or verified=true for owner-verified only.',
    inputSchema: { type: 'object', properties: {
      q: { type: 'string' }, activity: { type: 'string', enum: reg.ACTIVITIES },
      value: { type: 'string', enum: ['allowed', 'restricted', 'prohibited'] }, country: { type: 'string', description: 'ISO 3166-1 alpha-2' },
      verified: { type: 'boolean' }, limit: { type: 'number', default: 20 } } } },
  { name: 'get_place_rule',
    description: 'Get one registry entry by id, including zones, geometry, lifecycle (expires/temporary), source URL and verification status.',
    inputSchema: { type: 'object', required: ['id'], properties: { id: { type: 'string' } } } },
  { name: 'validate_place_rules_file',
    description: 'Validate a /.well-known/place-rules.json document against the place-rules/0.1 spec. Useful when helping a venue write its file.',
    inputSchema: { type: 'object', required: ['document'], properties: { document: { type: 'object' } } } },
];

function out(msg) { process.stdout.write(JSON.stringify(msg) + '\n'); }
function result(id, r) { out({ jsonrpc: '2.0', id, result: r }); }
function error(id, code, message) { out({ jsonrpc: '2.0', id, error: { code, message } }); }
// Every tool answer carries the disclaimer: as a JSON field and as a plain line clients can show the user.
function text(obj, isError = false) { return { content: [{ type: 'text', text: JSON.stringify(reg.withNotice(obj), null, 2) }, { type: 'text', text: 'Note: ' + reg.DISCLAIMER }], isError }; }
function slim(e) { const { geometry, ...rest } = e; return { ...rest, geometry: geometry ? { type: geometry.type, ...(geometry.type === 'circle' ? geometry : { source: geometry.source }) } : null }; }

function callTool(name, a = {}) {
  if (name === 'check_place_rules') return reg.check(db, a);
  if (name === 'search_place_rules') { const r = reg.search(db, { limit: 20, ...a }); return { count: r.length, entries: r.map(slim) }; }
  if (name === 'get_place_rule') { const e = reg.get(db, a.id); return e ? slim(e) : { error: 'not found' }; }
  if (name === 'validate_place_rules_file') return validate(a.document);
  throw new Error('unknown tool ' + name);
}

function handle(line) {
  if (!line.trim()) return;
  let m; try { m = JSON.parse(line); } catch { return error(null, -32700, 'parse error'); }
  const { id, method, params = {} } = m;
  if (id === undefined) return; // notification
  switch (method) {
    case 'initialize':
      return result(id, { protocolVersion: params.protocolVersion || '2025-06-18', capabilities: { tools: {} },
        serverInfo: { name: 'openplacerules', title: 'OpenPlaceRules', version: require('./package.json').version },
        instructions: 'Call check_place_rules before recording, using camera glasses or AI capture, or operating robots/drones at a location. Relay the source and whether the rule is owner-verified or only reported, and pass on the disclaimer: information only, not legal advice; unknown does not mean allowed. Data: ' + dataSource + '. Terms: ' + reg.TERMS_URL });
    case 'ping': return result(id, {});
    case 'tools/list': return result(id, { tools: TOOLS });
    case 'tools/call':
      try { return result(id, text(callTool(params.name, params.arguments))); }
      catch (e) { return result(id, text({ error: e.message }, true)); }
    default: return error(id, -32601, 'method not found: ' + method);
  }
}

let chain = ready;
readline.createInterface({ input: process.stdin }).on('line', (line) => {
  chain = chain.then(() => handle(line)).catch((e) => {
    process.stderr.write('OpenPlaceRules MCP: ' + e.message + '\n');
  });
});
