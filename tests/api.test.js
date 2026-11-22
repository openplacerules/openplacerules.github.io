const test = require('node:test');
const assert = require('node:assert');
const { tempData } = require('./helpers');
tempData();
const { createServer } = require('../server');
const mock = require('../scripts/mock-sites');

let srv, base, sites;
test.before(async () => {
  sites = await mock.start(mock.defaultSites({}));
  process.env.PLACE_RULES_DEV_MAP = JSON.stringify(sites.map);
  srv = createServer(); await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${srv.address().port}`;
});
test.after(() => { srv.close(); sites.close(); });
const get = async (p) => { const r = await fetch(base + p); return [r.status, await r.json()]; };
const post = async (p, b) => { const r = await fetch(base + p, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b) }); return [r.status, await r.json()]; };

test('stats and search', async () => {
  const [s, st] = await get('/api/stats'); assert.equal(s, 200); assert.ok(st.count >= 150);
  const [, r] = await get('/api/places?q=airport&activity=drones&country=TH'); assert.ok(r.count >= 8);
  const [, one] = await get('/api/places/sistine-chapel'); assert.equal(one.rules.recording, 'prohibited');
  assert.equal((await get('/api/places/nope'))[0], 404);
});
test('check endpoint', async () => {
  const [, c] = await get('/api/check?lat=41.9029&lng=12.4545&activity=recording'); assert.equal(c.answer, 'prohibited');
  const [, u] = await get('/api/check?lat=-45&lng=-150&activity=drones'); assert.equal(u.answer, 'unknown');
  assert.equal((await get('/api/check?lat=x&lng=1'))[0], 400);
});
test('static files and path traversal', async () => {
  assert.equal((await fetch(base + '/')).status, 200);
  assert.equal((await fetch(base + '/lib/core.js')).status, 200);
  assert.equal((await fetch(base + '/spec/SPEC.md')).status, 200);
  assert.notEqual((await fetch(base + '/../../etc/passwd')).status, 200);
});
test('submission validation and moderation queue', async () => {
  const [s1, e1] = await post('/api/submissions', { name: 'X' }); assert.equal(s1, 400); assert.match(e1.error, /source_url/);
  const [s2] = await post('/api/submissions', { name: 'X', summary: 's', source_url: 'javascript:alert(1)', rules: { drones: 'prohibited' } }); assert.equal(s2, 400);
  const [s3, ok] = await post('/api/submissions', { name: 'Test place', summary: 'test', source_url: 'https://example.org/rule', rules: { drones: 'prohibited' }, lat: 1, lng: 1 });
  assert.equal(s3, 201); assert.equal(ok.status, 'pending');
  const store = require('../lib/store');
  assert.equal(store.listSubmissions().length, 1);
  // pending submissions are not in the registry
  assert.equal((await get('/api/check?lat=1&lng=1&activity=drones'))[1].answer, 'unknown');
});
test('claim flow: start, fail, publish token, verify, owner overrides reported entry', async () => {
  const [s, c] = await post('/api/claims', { domain: 'museum.test', entry_id: 'westminster-abbey' });
  assert.equal(s, 201); assert.match(c.token, /^pr-/); assert.ok(c.instructions.dns.includes(c.token));
  const [, before] = await get('/api/check?lat=51.4995&lng=-0.1275&activity=recording');
  assert.equal(before.answer, 'restricted'); assert.equal(before.decided_by, 'reported');
  const [, fail] = await post(`/api/claims/${c.id}/verify`, {}); assert.equal(fail.ok, false);
  sites.sites['museum.test'].home = `<meta name="place-rules-verification" content="${c.token}">`;
  const [, ok] = await post(`/api/claims/${c.id}/verify`, {}); assert.equal(ok.ok, true); assert.equal(ok.method, 'meta');
  const [, after] = await get('/api/check?lat=51.4995&lng=-0.1275&activity=recording');
  assert.equal(after.answer, 'allowed'); assert.equal(after.decided_by, 'owner_verified');
  const [, old] = await get('/api/places/westminster-abbey'); assert.equal(old.superseded_by, 'owner-museum-test');
  assert.equal((await post('/api/claims', { domain: '127.0.0.1' }))[0], 400);
});
test('validate endpoint', async () => {
  const [, v] = await post('/api/validate', require('../spec/examples/park-polygon.json')); assert.equal(v.valid, true);
});
