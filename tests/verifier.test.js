const test = require('node:test');
const assert = require('node:assert');
const verify = require('../lib/verify');
const mock = require('../scripts/mock-sites');
const dnsmock = require('../lib/dnsmock');

const TOKEN = 'pr-testtoken0123456789';
let sites, dnsSrv;
test.before(async () => {
  sites = await mock.start(mock.defaultSites({ 'cafe.test': TOKEN, 'museum.test': TOKEN }));
  dnsSrv = await dnsmock.start({ '_place-rules.museum.test': [`place-rules-verification=${TOKEN}`], '_place-rules.cafe.test': ['place-rules-verification=wrong-token-000000'] });
});
test.after(() => { sites.close(); dnsSrv.close(); });
const opts = (o = {}) => ({ domainMap: sites.map, dnsServers: [`127.0.0.1:${dnsSrv.port}`], ...o });

test('normalizeDomain', () => {
  assert.equal(verify.normalizeDomain('https://Cafe.Test/path'), 'cafe.test');
  for (const d of ['localhost', '127.0.0.1', 'not a domain', '', 'a..b']) assert.throws(() => verify.normalizeDomain(d), d);
});
test('well-known: token in file verifies', async () => {
  const r = await verify.verifyDomain('cafe.test', TOKEN, opts({ method: 'well-known' }));
  assert.equal(r.ok, true); assert.equal(r.method, 'well-known');
});
test('well-known: wrong token fails with clear reason', async () => {
  const r = await verify.verifyDomain('cafe.test', 'pr-other0000000000000', opts({ method: 'well-known' }));
  assert.equal(r.ok, false); assert.match(r.attempts[0].detail, /does not match/);
});
test('meta tag verifies', async () => {
  const r = await verify.verifyDomain('museum.test', TOKEN, opts({ method: 'meta' }));
  assert.equal(r.ok, true);
  assert.equal(verify.findMetaToken('<meta content="abc" name="place-rules-verification">'), 'abc');
});
test('meta parser handles attribute order and quotes', () => {
  assert.equal(verify.findMetaToken(`<META NAME='place-rules-verification' CONTENT='tok123'>`), 'tok123');
});
test('dns TXT verifies via mock DNS server; wrong TXT fails', async () => {
  assert.equal((await verify.verifyDomain('museum.test', TOKEN, opts({ method: 'dns' }))).ok, true);
  assert.equal((await verify.verifyDomain('cafe.test', TOKEN, opts({ method: 'dns' }))).ok, false);
});
test('auto mode tries all methods and reports each', async () => {
  const r = await verify.verifyDomain('museum.test', TOKEN, opts());
  assert.equal(r.ok, true); assert.equal(r.method, 'meta'); // well-known file has no token, meta matches
  const g = await verify.verifyDomain('gone.test', TOKEN, opts());
  assert.equal(g.ok, false); assert.equal(g.attempts.length, 3);
});
test('invalid file is reported as schema error', async () => {
  const r = await verify.fetchRulesFile('broken.test', opts());
  assert.equal(r.ok, false); assert.match(r.error, /schema/);
});
