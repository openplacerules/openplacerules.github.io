const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { tempData } = require('./helpers');
const dir = tempData();
const mock = require('../scripts/mock-sites');
const crawl = require('../scripts/crawl');
const store = require('../lib/store');
const registry = require('../lib/registry');

let sites;
test.before(async () => { sites = await mock.start(mock.defaultSites({})); process.env.PLACE_RULES_DEV_MAP = JSON.stringify(sites.map); });
test.after(() => { sites.close(); delete process.env.PLACE_RULES_DEV_MAP; });

test('crawls listed domains, stores valid files, rejects invalid ones', async () => {
  const f = path.join(dir, 'domains.txt');
  fs.writeFileSync(f, '# test\ncafe.test\nmuseum.test\nbroken.test\ngone.test\nnot_a_domain\n');
  const r = await crawl.crawlDomains(f);
  const by = Object.fromEntries(r.map((x) => [x.domain, x]));
  assert.equal(by['cafe.test'].ok, true); assert.equal(by['museum.test'].ok, true);
  assert.equal(by['broken.test'].ok, false); assert.match(by['broken.test'].error, /schema/);
  assert.equal(by['gone.test'].ok, false); assert.equal(by['not_a_domain'].ok, false);
  assert.ok(store.getOwner('cafe.test')); assert.equal(store.getOwner('broken.test'), null);
  // crawled entries enter the registry as owner-verified and decide the answer at their location
  const db = registry.load();
  const c = registry.check(db, { lat: 13.7465, lng: 100.5348, activity: 'ai_capture' });
  assert.equal(c.answer, 'prohibited'); assert.equal(c.decided_by, 'owner_verified');
});

test('a site that disappears is marked stale and stops deciding', async () => {
  sites.sites['cafe.test'].wellKnown = undefined;
  const f = path.join(dir, 'domains2.txt'); fs.writeFileSync(f, 'cafe.test\n');
  const r = await crawl.crawlDomains(f);
  assert.equal(r[0].marked_stale, true);
  const c = registry.check(registry.load(), { lat: 13.7465, lng: 100.5348, activity: 'ai_capture' });
  assert.equal(c.answer, 'unknown'); assert.equal(c.matches[0].state, 'stale');
});

test('lifecycle report flags expired, temporary and upcoming rules', () => {
  const seed = JSON.parse(fs.readFileSync(path.join(dir, 'seed.json')));
  const rep = crawl.lifecycleReport(seed.entries, { 'https://www.dawn.com/x': { status: 404 } }, '2026-12-25');
  const ids = (k) => rep[k].map((x) => x.id);
  assert.ok(ids('expired').includes('punjab-province-pakistan'));
  assert.ok(ids('temporary_open_ended').includes('senedd-siambr-welsh-parliament-debating-chamber'));
  assert.ok(ids('not_yet_in_force').includes('victoria-schools-students'));
  const rep2 = crawl.lifecycleReport(seed.entries, {}, '2026-12-01');
  assert.ok(rep2.expiring_30d.map((x) => x.id).includes('punjab-province-pakistan'));
  assert.ok(crawl.toMarkdown(rep, []).includes('Expired'));
});
