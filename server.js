// Local server: static web app + JSON API + local claim/submission flows. Usage: node server.js [port]
// Binds to 127.0.0.1 by default. Write endpoints only touch files under the data dir.
const http = require('http');
const fs = require('fs');
const path = require('path');
const reg = require('./lib/registry');
const store = require('./lib/store');
const verify = require('./lib/verify');
const { validate } = require('./lib/validate');
const core = require('./lib/core');

const WEB = path.join(__dirname, 'web');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.xml': 'application/xml', '.md': 'text/markdown; charset=utf-8', '.txt': 'text/plain; charset=utf-8' };
let db = reg.load();
const reload = () => { db = reg.load(); };

function send(res, code, obj) {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(obj, null, 2));
}
function body(req) {
  return new Promise((resolve, reject) => {
    let n = 0; const chunks = [];
    req.on('data', (c) => { n += c.length; if (n > 64 * 1024) { reject(new Error('body too large')); req.destroy(); } else chunks.push(c); });
    req.on('end', () => { try { resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {}); } catch { reject(new Error('invalid JSON body')); } });
  });
}
const API_DOC = () => ({
  name: 'OpenPlaceRules local API', version: db.version,
  read: {
    'GET /api/places?q=&activity=&value=&country=&verified=true&limit=': 'search entries',
    'GET /api/places/:id': 'one entry',
    'GET /api/check?lat=&lng=&activity=recording|camera_glasses|ai_capture|robots|drones[&date=YYYY-MM-DD]': 'allowed | restricted | prohibited | unknown; owner-verified entries override reported ones',
    'GET /api/stats': 'dataset counts', 'GET /api/report': 'last refresh report (expired/expiring/temporary rules, link problems)',
    'GET /data/seed.json': 'full dataset', 'GET /spec/place-rules.schema.json': 'JSON Schema',
  },
  local_write: {
    'POST /api/validate': 'validate a place-rules.json body',
    'POST /api/claims {domain, entry_id?, contact_email?}': 'start a claim; returns token + instructions',
    'GET /api/claims/:id': 'claim status', 'POST /api/claims/:id/verify {method?}': 'run the verifier (well-known, meta, dns)',
    'POST /api/submissions {name, rules, summary, source_url, ...}': 'report a place (goes to moderation queue)',
  },
});
function instructions(c) {
  return {
    well_known: `Publish https://${c.domain}/.well-known/place-rules.json (valid place-rules/0.1) containing "verification": {"method": "well-known", "token": "${c.token}"}`,
    meta: `Or add to the home page <head>: <meta name="place-rules-verification" content="${c.token}">`,
    dns: `Or add a DNS TXT record: _place-rules.${c.domain}  "place-rules-verification=${c.token}"`,
    note: 'Meta and DNS prove control of the domain; the rules themselves are still read from /.well-known/place-rules.json.',
  };
}

async function handleApi(req, res, p, qs) {
  if (req.method === 'GET') {
    if (p === '/api' || p === '/api/') return send(res, 200, API_DOC());
    if (p === '/api/stats') return send(res, 200, reg.stats(db));
    if (p === '/api/report') return send(res, 200, store.readJson(path.join(store.dataDir(), 'refresh-report.json'), { error: 'no report yet; run node scripts/crawl.js' }));
    if (p === '/api/places') { const r = reg.search(db, qs); return send(res, 200, reg.withNotice({ count: r.length, entries: r })); }
    if (p.startsWith('/api/places/')) { const e = reg.get(db, decodeURIComponent(p.slice(12))); return e ? send(res, 200, reg.withNotice(e)) : send(res, 404, reg.withNotice({ error: 'not found' })); }
    if (p === '/api/check') return send(res, 200, reg.check(db, qs));
    if (p.startsWith('/api/claims/')) {
      const c = store.getClaim(p.split('/')[3]); if (!c) return send(res, 404, { error: 'not found' });
      return send(res, 200, { ...c, instructions: instructions(c) });
    }
    return send(res, 404, { error: 'unknown endpoint' });
  }
  if (req.method !== 'POST') return send(res, 405, { error: 'method not allowed' });
  const b = await body(req);
  if (p === '/api/validate') return send(res, 200, validate(b));
  if (p === '/api/claims') {
    let domain; try { domain = verify.normalizeDomain(b.domain); } catch (e) { return send(res, 400, { error: e.message }); }
    if (b.entry_id && !reg.get(db, b.entry_id)) return send(res, 400, { error: 'unknown entry_id' });
    const c = store.createClaim({ domain, entry_id: b.entry_id, contact_email: b.contact_email });
    return send(res, 201, { ...c, instructions: instructions(c) });
  }
  const m = p.match(/^\/api\/claims\/([a-f0-9]+)\/verify$/);
  if (m) {
    const c = store.getClaim(m[1]); if (!c) return send(res, 404, { error: 'not found' });
    const v = await verify.verifyDomain(c.domain, c.token, { method: b.method });
    const attempts = [...(c.attempts || []), { at: new Date().toISOString(), ok: v.ok, results: v.attempts.map(({ doc, ...x }) => x) }].slice(-10);
    if (!v.ok) { store.updateClaim(c.id, { attempts }); return send(res, 200, { ok: false, attempts: v.attempts.map(({ doc, ...x }) => x) }); }
    // Proof of control succeeded; rules always come from the well-known file.
    const f = await verify.fetchRulesFile(c.domain);
    if (!f.ok) { store.updateClaim(c.id, { attempts, status: 'domain_verified_no_file' }); return send(res, 200, { ok: false, domain_verified: true, error: 'domain control proven, but /.well-known/place-rules.json is missing or invalid: ' + f.error }); }
    const prev = store.getOwner(c.domain) || {};
    const supersedes = [...new Set([...(prev.supersedes || []), ...(c.entry_id ? [c.entry_id] : [])])];
    store.saveOwner({ ...prev, domain: c.domain, method: v.method, verified_at: new Date().toISOString(), fetched_at: new Date().toISOString(),
      file_url: f.url, file: f.doc, stale: false, supersedes, claim_id: c.id });
    store.updateClaim(c.id, { status: 'verified', method: v.method, verified_at: new Date().toISOString(), attempts });
    reload();
    return send(res, 200, { ok: true, method: v.method, entry: reg.get(db, 'owner-' + c.domain.replace(/[^a-z0-9]+/g, '-')) });
  }
  if (p === '/api/submissions') {
    const errs = [];
    if (!b.name || typeof b.name !== 'string' || b.name.length > 200) errs.push('name required (max 200 chars)');
    if (!b.summary || typeof b.summary !== 'string' || b.summary.length > 1000) errs.push('summary required (max 1000 chars)');
    try { const u = new URL(b.source_url); if (!/^https?:$/.test(u.protocol)) throw 0; } catch { errs.push('source_url must be a public http(s) URL'); }
    if (!b.rules || typeof b.rules !== 'object' || !Object.keys(b.rules).length) errs.push('at least one rule required');
    else for (const [k, v] of Object.entries(b.rules)) if (!core.ACTIVITIES.includes(k) || !core.VALUES.includes(v)) errs.push(`bad rule ${k}=${v}`);
    if (b.lat != null && (!Number.isFinite(+b.lat) || Math.abs(+b.lat) > 90)) errs.push('bad lat');
    if (b.lng != null && (!Number.isFinite(+b.lng) || Math.abs(+b.lng) > 180)) errs.push('bad lng');
    if (errs.length) return send(res, 400, { error: errs.join('; ') });
    const pick = ({ name, kind, country, region, summary, source_url, source_publisher, date, rules, submitter_email }) =>
      ({ name, kind, country, region, summary, source_url, source_publisher, date, rules, submitter_email, lat: b.lat != null ? +b.lat : null, lng: b.lng != null ? +b.lng : null });
    const s = store.addSubmission(pick(b));
    return send(res, 201, { ok: true, id: s.id, status: s.status, note: 'Queued for moderation (data/moderation/queue.jsonl). Nothing is published until a moderator approves it.' });
  }
  return send(res, 404, { error: 'unknown endpoint' });
}

function createServer() {
  return http.createServer(async (req, res) => {
    const u = new URL(req.url, 'http://x');
    const p = u.pathname; const qs = Object.fromEntries(u.searchParams);
    try {
      if (p.startsWith('/api')) return await handleApi(req, res, p, qs);
    } catch (err) { const e = { error: err.message }; return send(res, 400, /^\/api\/(check|places)/.test(p) ? reg.withNotice(e) : e); }
    if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, { error: 'method not allowed' });
    let file;
    if (p === '/lib/core.js') file = path.join(__dirname, 'lib', 'core.js');
    else if (p === '/data/seed.json') file = path.join(store.dataDir(), 'seed.json');
    else if (p === '/spec/SPEC.md') file = path.join(__dirname, 'SPEC.md');
    else if (p === '/legal/terms-of-use.md' || p === '/legal/privacy-policy.md') file = path.join(__dirname, p);
    else if (p === '/data/ATTRIBUTION.md') file = path.join(__dirname, 'data', 'ATTRIBUTION.md');
    else if (p.startsWith('/spec/')) file = path.join(__dirname, path.normalize(p));
    else file = path.join(WEB, path.normalize(p === '/' ? '/index.html' : p));
    if (!file.startsWith(__dirname) && !file.startsWith(store.dataDir())) return send(res, 403, { error: 'forbidden' });
    fs.readFile(file, (err, buf) => {
      if (err) return send(res, 404, { error: 'not found' });
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
      res.end(buf);
    });
  });
}
if (require.main === module) {
  const PORT = Number(process.argv[2] || process.env.PORT || 8787);
  const HOST = process.env.HOST || '127.0.0.1';
  createServer().listen(PORT, HOST, () => console.log(`OpenPlaceRules: http://${HOST}:${PORT}  (API: /api)`));
}
module.exports = { createServer };
