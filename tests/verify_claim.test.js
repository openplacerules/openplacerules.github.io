'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { parseClaim, processClaim, domainRelated } = require('../scripts/verify_claim');
const registry = require('../lib/registry');
const core = require('../lib/core');

const root = path.join(__dirname, '..');
const fx = (...a) => path.join(__dirname, 'fixtures', 'claims', ...a);
const read = (...a) => fs.readFileSync(fx(...a), 'utf8');
const TOKEN = 'opr-testtoken0123456789';

function tempDir() {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'opr-claim-'));
  fs.copyFileSync(path.join(root, 'data', 'seed.json'), path.join(d, 'seed.json'));
  return d;
}

// Offline fetch/DNS: answers come only from the fixture map. No network.
function optsFor(sites, txt = {}) {
  return {
    fetchImpl: async (url) => {
      const key = String(url);
      const rec = sites[key] || sites[key.replace(/\/$/, '')] || sites[key + '/'];
      if (!rec) return new Response('not in fixture map', { status: 404, headers: { 'content-type': 'text/plain' } });
      return new Response(rec.body, { status: rec.status || 200, headers: { 'content-type': rec.type || 'text/html' } });
    },
    resolveTxt: async (name) => {
      if (!Object.prototype.hasOwnProperty.call(txt, name)) {
        const err = new Error('ENOTFOUND');
        err.code = 'ENOTFOUND';
        throw err;
      }
      return txt[name];
    },
  };
}

const cafeFile = read('valid-file.json');
const museumFile = read('valid-file-no-token.json');
const invalidFile = read('invalid-file.json');
const homeMeta = read('home-meta.html');
const homePlain = read('home-plain.html');

const sites = {
  'https://cafe.test/.well-known/place-rules.json': { body: cafeFile, type: 'application/json' },
  'https://cafe.test/': { body: homePlain },
  'https://museum.test/.well-known/place-rules.json': { body: museumFile, type: 'application/json' },
  'https://museum.test/': { body: homeMeta },
  'https://dnsplace.test/.well-known/place-rules.json': { body: museumFile, type: 'application/json' },
  'https://dnsplace.test/': { body: homePlain },
  'https://broken.test/.well-known/place-rules.json': { body: invalidFile, type: 'application/json' },
  'https://broken.test/': { body: homeMeta },
  'https://gone.test/.well-known/place-rules.json': { body: 'missing', status: 404 },
  'https://gone.test/': { body: 'missing', status: 404 },
  'https://annefrank.org/.well-known/place-rules.json': { body: JSON.stringify({
    spec: 'place-rules/0.1',
    updated: '2026-11-21T09:00:00+01:00',
    place: { name: 'Anne Frank House', url: 'https://www.annefrank.org/', geometry: { type: 'circle', center: [52.3752, 4.8840], radius_m: 40 } },
    rules: { recording: 'restricted', camera_glasses: 'prohibited' },
    verification: { method: 'well-known', token: TOKEN },
  }), type: 'application/json' },
  'https://annefrank.org/': { body: homePlain },
};
const dns = {
  '_place-rules.dnsplace.test': [['place-rules-verification=' + TOKEN]],
  '_place-rules.cafe.test': [['place-rules-verification=wrong-token-000000']],
};
const vopts = optsFor(sites, dns);

test('parseClaim reads /claim.html body and both issue templates', () => {
  const a = parseClaim(read('issue-well-known.md'));
  assert.deepStrictEqual(a, { domain: 'cafe.test', token: TOKEN, entry_id: 'westminster-abbey' });
  const b = parseClaim(read('issue-meta.md'));
  assert.deepStrictEqual(b, { domain: 'museum.test', token: TOKEN, entry_id: null });
  const c = parseClaim(read('issue-claim-entry.md'), 'Claim this entry: Anne Frank House (anne-frank-house)');
  assert.strictEqual(c.domain, null);
  assert.strictEqual(c.token, null);
  assert.strictEqual(c.entry_id, 'anne-frank-house');
  const d = parseClaim('Official email or domain for this place: hello@Venue.Example\nToken: opr-abcdefghijklmnopqrstuv\n');
  assert.strictEqual(d.domain, 'venue.example');
  const e = parseClaim('Domain: `Cafe.Test.`\nToken: `' + TOKEN + '`\nPlace / registry entry (optional): https://openplacerules.org/p/westminster-abbey/\n');
  assert.deepStrictEqual(e, { domain: 'cafe.test', token: TOKEN, entry_id: 'westminster-abbey' });
});

test('domainRelated matches site hostnames, www, and subdomains', () => {
  assert.ok(domainRelated('annefrank.org', 'https://www.annefrank.org/en/museum/'));
  assert.ok(domainRelated('www.annefrank.org', 'annefrank.org'));
  assert.ok(domainRelated('tickets.annefrank.org', 'https://www.annefrank.org/'));
  assert.ok(!domainRelated('cafe.test', 'https://www.westminster-abbey.org/about/photography-in-the-abbey'));
  assert.ok(!domainRelated('example.org', 'https://not-example.org/'));
});

test('missing domain or token is needs-info, no import, no network', async () => {
  const dir = tempDir();
  const r = await processClaim({ body: read('issue-claim-entry.md'), title: 'Claim this entry: Anne Frank House (anne-frank-house)', dataDir: dir, doImport: true, verifyOpts: vopts });
  assert.strictEqual(r.ok, false);
  assert.strictEqual(r.status, 'needs-info');
  assert.match(r.comment, /Token/);
  assert.match(r.comment, /claim\.html/);
  assert.ok(!fs.existsSync(path.join(dir, 'owner')));
  const r2 = await processClaim({ body: read('issue-missing-token.md'), dataDir: dir, doImport: true, verifyOpts: vopts });
  assert.strictEqual(r2.ok, false);
  assert.match(r2.comment, /token/i);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('well-known token match imports an owner-verified entry and flags a mismatched supersede', async () => {
  const dir = tempDir();
  const r = await processClaim({ body: read('issue-well-known.md'), dataDir: dir, doImport: true, verifyOpts: vopts });
  assert.strictEqual(r.ok, true);
  assert.strictEqual(r.status, 'verified');
  assert.strictEqual(r.method, 'well-known');
  assert.strictEqual(r.domain, 'cafe.test');
  assert.strictEqual(r.owner_id, 'owner-cafe-test');
  assert.deepStrictEqual(r.supersedes, []);
  assert.deepStrictEqual(r.proposed_supersedes, ['westminster-abbey']);
  assert.strictEqual(r.supersede_needs_review, true);
  assert.match(r.comment, /maintainer will confirm/);
  const rec = JSON.parse(fs.readFileSync(path.join(dir, 'owner', 'cafe.test.json'), 'utf8'));
  assert.strictEqual(rec.domain, 'cafe.test');
  assert.strictEqual(rec.file.place.name, 'Demo Cafe (test fixture)');
  assert.deepStrictEqual(rec.proposed_supersedes, ['westminster-abbey']);
  assert.ok(!rec.stale);
  const db = registry.loadPublished(dir);
  assert.strictEqual(registry.stats(db).owner_verified, 1);
  assert.ok(db.entries.some((e) => e.id === 'owner-cafe-test' && /^verified/.test(e.verification)));
  // mismatched id is not applied, so the reported venue stays in the registry until a maintainer confirms
  assert.ok(db.entries.some((e) => e.id === 'westminster-abbey'));
  assert.ok(!db.superseded.some((e) => e.id === 'westminster-abbey'));
  fs.rmSync(dir, { recursive: true, force: true });
});

test('meta tag verifies when the well-known file is valid but has no token', async () => {
  const dir = tempDir();
  const r = await processClaim({ body: read('issue-meta.md'), dataDir: dir, doImport: true, verifyOpts: vopts });
  assert.strictEqual(r.ok, true);
  assert.strictEqual(r.method, 'meta');
  assert.strictEqual(r.supersede_needs_review, false);
  assert.deepStrictEqual(r.supersedes, []);
  assert.strictEqual(registry.stats(registry.loadPublished(dir)).owner_verified, 1);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('DNS TXT verifies, and still requires a valid well-known file', async () => {
  const dir = tempDir();
  const r = await processClaim({ body: read('issue-dns.md'), dataDir: dir, doImport: true, verifyOpts: vopts });
  assert.strictEqual(r.ok, true);
  assert.strictEqual(r.method, 'dns');
  assert.deepStrictEqual(r.supersedes, []);
  assert.deepStrictEqual(r.proposed_supersedes, ['anne-frank-house']);
  assert.strictEqual(r.supersede_needs_review, true);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('matching source hostname auto-supersedes without a review flag', async () => {
  const dir = tempDir();
  const body = 'Domain: annefrank.org\nToken: ' + TOKEN + '\nPlace / registry entry (optional): anne-frank-house\n';
  const r = await processClaim({ body, dataDir: dir, doImport: true, verifyOpts: vopts });
  assert.strictEqual(r.ok, true);
  assert.strictEqual(r.method, 'well-known');
  assert.strictEqual(r.supersede_needs_review, false);
  assert.deepStrictEqual(r.supersedes, ['anne-frank-house']);
  const db = registry.loadPublished(dir);
  assert.ok(db.entries.some((e) => e.id === 'owner-annefrank-org'));
  assert.ok(!db.entries.some((e) => e.id === 'anne-frank-house'));
  assert.ok(db.superseded.some((e) => e.id === 'anne-frank-house'));
  const entry = db.entries.find((e) => e.id === 'owner-annefrank-org');
  assert.strictEqual(entry.country, 'NL');
  assert.strictEqual(registry.stats(db).owner_verified, 1);
  assert.ok(registry.stats(db).count === db.entries.length);
  // a point inside the owner circle is decided by the owner file
  const c = core.check(db.entries, { lat: 52.3752, lng: 4.8840, activity: 'camera_glasses' });
  assert.strictEqual(c.decided_by, 'owner_verified');
  assert.strictEqual(c.answer, 'prohibited');
  fs.rmSync(dir, { recursive: true, force: true });
});

test('meta match is not enough if the well-known file is missing or invalid', async () => {
  const dir = tempDir();
  const broken = await processClaim({
    body: 'Domain: broken.test\nToken: ' + TOKEN + '\n',
    dataDir: dir, doImport: true, verifyOpts: vopts,
  });
  assert.strictEqual(broken.ok, false);
  assert.match(broken.comment, /schema|invalid|well-known/i);
  assert.ok(!fs.existsSync(path.join(dir, 'owner', 'broken.test.json')));

  const gone = await processClaim({
    body: 'Domain: gone.test\nToken: ' + TOKEN + '\n',
    dataDir: dir, doImport: true, verifyOpts: vopts,
  });
  assert.strictEqual(gone.ok, false);
  assert.match(gone.comment, /HTTP 404|missing|well-known/i);
  assert.ok(!fs.existsSync(path.join(dir, 'owner')));
  fs.rmSync(dir, { recursive: true, force: true });
});

test('wrong token on every method is needs-info with specific reasons', async () => {
  const dir = tempDir();
  const r = await processClaim({
    body: 'Domain: cafe.test\nToken: opr-other0000000000000\n',
    dataDir: dir, doImport: true, verifyOpts: vopts,
  });
  assert.strictEqual(r.ok, false);
  assert.match(r.comment, /does not match/);
  assert.match(r.comment, /no <meta/);
  assert.match(r.comment, /TXT/);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('invalid domain or short token is needs-info', async () => {
  const dir = tempDir();
  const ip = await processClaim({ body: 'Domain: 127.0.0.1\nToken: ' + TOKEN + '\n', dataDir: dir, doImport: true, verifyOpts: vopts });
  assert.strictEqual(ip.ok, false);
  assert.match(ip.comment, /domain/i);
  const short = await processClaim({ body: 'Domain: cafe.test\nToken: short-token\n', dataDir: dir, doImport: true, verifyOpts: vopts });
  assert.strictEqual(short.ok, false);
  assert.match(short.comment, /16–128|expected form/);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('unknown registry id still imports the owner file and says so', async () => {
  const dir = tempDir();
  const r = await processClaim({
    body: 'Domain: cafe.test\nToken: ' + TOKEN + '\nPlace / registry entry (optional): not-a-real-id\n',
    dataDir: dir, doImport: true, verifyOpts: vopts,
  });
  assert.strictEqual(r.ok, true);
  assert.deepStrictEqual(r.supersedes, []);
  assert.strictEqual(r.unknown_entry_id, 'not-a-real-id');
  assert.match(r.comment, /not-a-real-id/);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('processClaim does not write when --import is off', async () => {
  const dir = tempDir();
  const r = await processClaim({ body: read('issue-well-known.md'), dataDir: dir, doImport: false, verifyOpts: vopts });
  assert.strictEqual(r.ok, true);
  assert.ok(!fs.existsSync(path.join(dir, 'owner', 'cafe.test.json')));
  fs.rmSync(dir, { recursive: true, force: true });
});
