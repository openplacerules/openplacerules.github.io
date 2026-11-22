'use strict';
// Every /api/check and /api/places answer and every MCP tool answer carries the short disclaimer + terms link.
const test = require('node:test'), assert = require('node:assert');
const { spawn } = require('child_process'), path = require('path');
const { tempData } = require('./helpers');
const dir = tempData();
const core = require('../lib/core');
const { createServer } = require('../server');
const TERMS = 'https://openplacerules.org/terms.html';
const hasNotice = (o, what) => { assert.strictEqual(o.terms, TERMS, what); assert.match(o.disclaimer, /not legal advice/, what); assert.ok(o.disclaimer.includes(TERMS), what); };

test('core check() result carries the disclaimer (static map + worker use it)', () => {
  hasNotice(core.check([], { lat: 0, lng: 0, activity: 'drones' }), 'core.check');
  assert.match(core.DISCLAIMER, /unknown does not mean allowed/);
});

test('API: /api/check and /api/places (list, one, not found, bad input) all carry it', async () => {
  const srv = createServer(); await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${srv.address().port}`;
  const get = async (p) => { const r = await fetch(base + p); return [r.status, await r.json()]; };
  try {
    for (const p of ['/api/check?lat=41.9029&lng=12.4545&activity=recording', '/api/check?lat=-45&lng=-150&activity=drones', '/api/check?lat=x&lng=1',
      '/api/places', '/api/places?q=airport&limit=3', '/api/places/sistine-chapel', '/api/places/nope']) {
      const [, body] = await get(p); hasNotice(body, p);
    }
    const [, one] = await get('/api/places/sistine-chapel'); assert.strictEqual(one.rules.recording, 'prohibited'); // entry fields intact
  } finally { srv.close(); }
});

test('MCP: every tool answer has the disclaimer field and a plain "Note:" line', async () => {
  const p = spawn(process.execPath, [path.join(__dirname, '..', 'mcp-server.js')], { env: { ...process.env, PLACE_RULES_DATA: dir } });
  const lines = []; let buf = '';
  p.stdout.on('data', (d) => { buf += d; let i; while ((i = buf.indexOf('\n')) >= 0) { lines.push(JSON.parse(buf.slice(0, i))); buf = buf.slice(i + 1); } });
  const calls = [['check_place_rules', { lat: 35.684, lng: 139.751, activity: 'drones' }], ['search_place_rules', { q: 'court' }],
    ['get_place_rule', { id: 'sistine-chapel' }], ['get_place_rule', { id: 'nope' }], ['validate_place_rules_file', { document: {} }], ['no_such_tool', {}]];
  p.stdin.write(JSON.stringify({ jsonrpc: '2.0', id: 0, method: 'initialize', params: {} }) + '\n');
  calls.forEach(([name, args], i) => p.stdin.write(JSON.stringify({ jsonrpc: '2.0', id: i + 1, method: 'tools/call', params: { name, arguments: args } }) + '\n'));
  await new Promise((r) => { const t = setInterval(() => { if (lines.length > calls.length) { clearInterval(t); r(); } }, 20); });
  p.kill();
  const by = Object.fromEntries(lines.map((l) => [l.id, l]));
  assert.match(by[0].result.instructions, /not legal advice/);
  calls.forEach(([name], i) => {
    const c = by[i + 1].result.content;
    hasNotice(JSON.parse(c[0].text), name);
    assert.ok(c[1].text.startsWith('Note: Information only, not legal advice') && c[1].text.includes(TERMS), name);
  });
  assert.strictEqual(JSON.parse(by[1].result.content[0].text).answer, 'prohibited');
});
