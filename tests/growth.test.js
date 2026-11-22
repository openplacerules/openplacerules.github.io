'use strict';
const test = require('node:test'), assert = require('node:assert');
const { execFileSync } = require('child_process'), fs = require('fs'), os = require('os'), path = require('path');
const root = path.join(__dirname, '..');
const core = require('../lib/core.js');
test('growth layer: one indexable, shareable page per entry, merged sitemap, badges, sign + check pages', () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'pr-growth-'));
  const env = Object.assign({}, process.env, { SITE_URL: 'https://example.test' });
  execFileSync('node', [path.join(root, 'scripts/build_static.js'), out], { env });
  execFileSync('node', [path.join(root, 'scripts/build_growth.js'), out], { env });
  const seed = JSON.parse(fs.readFileSync(path.join(root, 'data/seed.json'), 'utf8'));
  for (const e of seed.entries) {
    const html = fs.readFileSync(path.join(out, 'p', e.id, 'index.html'), 'utf8');
    assert.ok(html.includes(`<link rel="canonical" href="https://example.test/p/${e.id}/">`), e.id);
    assert.ok(html.includes('application/ld+json') && html.includes('og:image'), e.id);
    assert.ok(!/<script[^>]*>[^<]*<\/script>/.test(e.name), 'names are data');
    assert.ok(fs.readFileSync(path.join(out, 'p', e.id, 'badge.svg'), 'utf8').startsWith('<svg'));
    const rj = JSON.parse(fs.readFileSync(path.join(out, 'p', e.id, 'rules.json'), 'utf8'));
    assert.strictEqual(rj.id, e.id); assert.strictEqual(rj.disclaimer, core.DISCLAIMER); assert.strictEqual(rj.terms, core.TERMS_URL);
    assert.ok(html.includes('href="../../terms.html"') && html.includes('not legal advice'), 'disclaimer + terms on ' + e.id);
    assert.ok(!/presale|pre-sale|deflationary|\btoken sale\b|airdrop/i.test(html), 'no token talk');
  }
  const sm = fs.readFileSync(path.join(out, 'sitemap.xml'), 'utf8');
  const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  assert.strictEqual(new Set(locs).size, locs.length, 'no duplicate sitemap URLs');
  assert.ok(locs.includes('https://example.test/spec.html') && locs.includes(`https://example.test/p/${seed.entries[0].id}/`));
  assert.ok(locs.length >= seed.entries.length + 20);
  assert.match(fs.readFileSync(path.join(out, 'robots.txt'), 'utf8'), /Sitemap: https:\/\/example\.test\/sitemap\.xml/);
  for (const f of ['check.html', 'sign.html', 'places/index.html', 'c/th/index.html', 'badge/published.svg', 'badge/verified.svg', 'badge/camera-glasses-prohibited.svg', 'llms.txt', 'llms-full.txt', 'vendor/qrcode.js',
    'new/index.html', 'claim.html', 'submit.html', 'embed.html', 'embed.js', 'changes/index.html', 'changes.xml', 'stats/index.html', 'data/places.csv', 'data/stats.json', 'data/bundle-latest.json', 'lib/validate.browser.js', 'growth/common.js', 'growth/new.js', 'growth/sign.js'])
    assert.ok(fs.existsSync(path.join(out, f)), f);
  assert.ok(!/fetch\('api\//.test(fs.readFileSync(path.join(out, 'check.html'), 'utf8')), 'check page works without the API');
  // a title must not leak raw HTML even if a name contained it
  const evil = fs.readFileSync(path.join(out, 'places/index.html'), 'utf8');
  assert.ok(!evil.includes('<script>alert'), 'escaped');
  // CSV has one row per entry; stats agree with the seed; Atom feed parses as XML-ish and links to place pages
  assert.strictEqual(fs.readFileSync(path.join(out, 'data/places.csv'), 'utf8').trim().split('\n').length, seed.entries.length + 1);
  const st = JSON.parse(fs.readFileSync(path.join(out, 'data/stats.json'), 'utf8'));
  assert.strictEqual(st.entries, seed.entries.length);
  assert.strictEqual(st.jurisdictions, new Set(seed.entries.map((e) => e.country)).size);
  const feed = fs.readFileSync(path.join(out, 'changes.xml'), 'utf8');
  assert.ok(feed.startsWith('<?xml') && feed.includes('<feed') && /<link href="https:\/\/example\.test\/p\//.test(feed));
  // static claim/submit replace the "not accepted here" notices and never call the API
  for (const f of ['claim.html', 'submit.html', 'new/index.html']) {
    const h = fs.readFileSync(path.join(out, f), 'utf8');
    assert.ok(!/fetch\('api\//.test(h) && h.includes('growth/common.js'), f);
  }
  // the browser validator is the same code as lib/validate.js
  const vm = require('vm'), ctx = { window: {}, URL }; vm.createContext(ctx); // browsers provide URL
  vm.runInContext(fs.readFileSync(path.join(out, 'lib/validate.browser.js'), 'utf8'), ctx);
  assert.strictEqual(ctx.window.PlaceRulesValidate(require('../spec/examples/thai-temple.json')).valid, true);
  assert.strictEqual(ctx.window.PlaceRulesValidate({ spec: 'place-rules/0.1' }).valid, false);
  fs.rmSync(out, { recursive: true, force: true });
});
test('hosted API handler (R13) answers check/stats with CORS and rejects bad input', async () => {
  const { makeHandler } = require('../deploy/worker/handler.js');
  const seedText = fs.readFileSync(path.join(root, 'data/seed.json'), 'utf8');
  const h = makeHandler(require('../lib/core.js'), { dataUrl: 'https://x.test/seed.json', fetch: async () => new Response(seedText) });
  let r = await h(new Request('https://api.test/api/check?lat=13.69&lng=100.75&activity=drones'), {});
  assert.strictEqual(r.status, 200); assert.strictEqual((await r.json()).answer, 'prohibited'); assert.strictEqual(r.headers.get('access-control-allow-origin'), '*');
  r = await h(new Request('https://api.test/api/check?lat=nope'), {}); assert.strictEqual(r.status, 400); assert.strictEqual((await r.json()).terms, core.TERMS_URL);
  r = await h(new Request('https://api.test/api/places?country=TH'), {}); { const j = await r.json(); assert.ok(j.count > 0 || j.entries.length > 0); assert.strictEqual(j.disclaimer, core.DISCLAIMER); }
  r = await h(new Request('https://api.test/api/places/nope'), {}); assert.strictEqual(r.status, 404); assert.strictEqual((await r.json()).disclaimer, core.DISCLAIMER);
  r = await h(new Request('https://api.test/api/stats'), {}); assert.strictEqual((await r.json()).count, JSON.parse(seedText).entries.length);
  r = await h(new Request('https://api.test/api/check', { method: 'POST' }), {}); assert.strictEqual(r.status, 405);
});
test('vendored QR encoder produces a scannable-size matrix for a registry URL', () => {
  const qrcode = require(path.join(root, 'web/vendor/qrcode.js'));
  const q = qrcode(0, 'M'); q.addData('https://openplacerules.github.io/p/the-grand-palace-and-wat-phra-kaew-temple-of-the-emerald-buddha/'); q.make();
  assert.ok(q.getModuleCount() >= 21 && q.getModuleCount() <= 57);
});

test('Dutch AP example uses official AP wording; Thai/Dutch translations are marked needs native review', () => {
  const ap = fs.readFileSync(path.join(root, 'spec/examples/nl-ap-huisregels.json'), 'utf8');
  assert.match(ap, /ongemerkt beeld- of geluidsopnamen kunnen worden gemaakt/);
  assert.match(ap, /U hoeft daarvoor geen medische gegevens te verstrekken/);
  assert.ok(!/Camera glasses are not allowed here/.test(ap));
  const { validate } = require('../lib/validate');
  const v = validate(JSON.parse(ap));
  assert.ok(v.valid, (v.errors || []).join('; '));
  const growth = fs.readFileSync(path.join(root, 'scripts/build_growth.js'), 'utf8');
  assert.match(growth, /English \+ ไทย \(needs native review\)/);
  assert.match(growth, /English \+ Nederlands \(needs native review\)/);
  assert.match(growth, /need native review/);
  assert.match(fs.readFileSync(path.join(root, 'web/growth/sign.js'), 'utf8'), /needs native review/);
  assert.match(fs.readFileSync(path.join(root, 'spec/examples/thai-temple.json'), 'utf8'), /needs native review/);
  const news = fs.readFileSync(path.join(root, 'web/growth/new.js'), 'utf8');
  assert.match(news, /ongemerkt beeld- of geluidsopnamen/);
  assert.match(news, /needs native review/);
});

test('claim/report/sign pages point at the public repo; every place page has a prefilled correction issue link', () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'pr-links-'));
  const env = Object.assign({}, process.env, { SITE_URL: 'https://example.test' });
  execFileSync('node', [path.join(root, 'scripts/build_static.js'), out], { env });
  execFileSync('node', [path.join(root, 'scripts/build_growth.js'), out], { env });
  const repo = 'https://github.com/openplacerules/openplacerules.github.io';
  for (const f of ['claim.html', 'submit.html', 'new/index.html', 'sign.html']) {
    const h = fs.readFileSync(path.join(out, f), 'utf8');
    assert.match(h, new RegExp(repo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), f);
    assert.ok(!/github\.com\/openplacerules\/openplacerules"/.test(h), 'no 404 repo in ' + f);
  }
  const seed = JSON.parse(fs.readFileSync(path.join(root, 'data/seed.json'), 'utf8'));
  for (const e of seed.entries) {
    const h = fs.readFileSync(path.join(out, 'p', e.id, 'index.html'), 'utf8');
    assert.match(h, /Report a correction/, e.id);
    assert.ok(h.includes(repo + '/issues/new?labels=correction'), e.id);
    assert.ok(h.includes(encodeURIComponent(e.id)) || h.includes(e.id), 'id in correction link for ' + e.id);
  }
  const terms = fs.readFileSync(path.join(out, 'legal/terms-of-use.md'), 'utf8') + fs.readFileSync(path.join(out, 'legal/privacy-policy.md'), 'utf8');
  assert.ok(!/hello@openplacerules\.org/.test(terms), 'no live hello@ contact');
  assert.match(terms, /github\.com\/openplacerules\/openplacerules\.github\.io\/issues/);
  const wk = JSON.parse(fs.readFileSync(path.join(out, '.well-known/place-rules.json'), 'utf8'));
  assert.ok(!wk.contact.email);
  assert.match(wk.contact.url, /\/issues$/);
  const embed = fs.readFileSync(path.join(out, 'embed.js'), 'utf8');
  assert.match(embed, /openplacerules\.github\.io/);
  assert.ok(!/openplacerules\.org/.test(embed));
  fs.rmSync(out, { recursive: true, force: true });
});
