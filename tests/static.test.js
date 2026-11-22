'use strict';
const test = require('node:test'), assert = require('node:assert');
const { execFileSync } = require('child_process'), fs = require('fs'), os = require('os'), path = require('path');
const core = require('../lib/core.js');
test('static build produces a self-contained site whose data runs check() client-side', () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'pr-static-'));
  execFileSync('node', [path.join(__dirname, '../scripts/build_static.js'), out]);
  for (const f of ['index.html', 'lib/core.js', 'vendor/leaflet.js', 'data/seed.json', 'spec/SPEC.md', 'spec/place-rules.schema.json', 'LICENSE.txt', 'licenses/ODbL-1.0.txt', 'data/ATTRIBUTION.md', 'claim.html', 'submit.html'])
    assert.ok(fs.existsSync(path.join(out, f)), f);
  assert.ok(!fs.existsSync(path.join(out, 'data/claims.json')));
  const seed = JSON.parse(fs.readFileSync(path.join(out, 'data/seed.json'), 'utf8'));
  assert.ok(seed.entries.length >= 150);
  const r = core.check(seed.entries, { lat: 13.69, lng: 100.75, activity: 'drones' }); // Suvarnabhumi
  assert.strictEqual(r.answer, 'prohibited');
  assert.ok(!/fetch\('api\//.test(fs.readFileSync(path.join(out, 'claim.html'), 'utf8')));
  fs.rmSync(out, { recursive: true, force: true });
});

test('static build is ready for github.io (no CNAME, meta/OG, favicon, robots, sitemap, 404)', () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'pr-static-'));
  execFileSync('node', [path.join(__dirname, '../scripts/build_static.js'), out]);
  const rd = (f) => fs.readFileSync(path.join(out, f), 'utf8');
  for (const f of ['.nojekyll', '_headers', '404.html', 'robots.txt', 'sitemap.xml', 'favicon.svg', 'favicon.ico', 'apple-touch-icon.png', 'og.png', 'spec/examples/index.html'])
    assert.ok(fs.existsSync(path.join(out, f)), f);
  assert.ok(!fs.existsSync(path.join(out, 'CNAME')), 'CNAME is omitted until the custom domain is live');
  assert.match(rd('robots.txt'), /Sitemap: https:\/\/openplacerules\.github\.io\/sitemap\.xml/);
  assert.match(rd('sitemap.xml'), /<loc>https:\/\/openplacerules\.github\.io\/<\/loc>/);
  for (const f of ['index.html', 'spec.html', 'claim.html', 'submit.html']) {
    const h = rd(f);
    assert.match(h, /<title>[^<]*OpenPlaceRules/, f);
    assert.match(h, /property="og:image" content="https:\/\/openplacerules\.github\.io\/og\.png"/, f);
    assert.match(h, /rel="canonical" href="https:\/\/openplacerules\.github\.io\//, f);
    assert.match(h, /rel="icon"/, f);
  }
  assert.match(rd('404.html'), /href="\/style\.css"/);
  assert.ok(!/local preview/.test(rd('index.html')));
  assert.ok(!/Place Rules/.test(rd('index.html') + rd('spec.html') + rd('claim.html')));
  fs.rmSync(out, { recursive: true, force: true });
});

test('WRITE_CNAME=1 emits a CNAME for the custom domain', () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'pr-cname-'));
  const env = Object.assign({}, process.env, { SITE_URL: 'https://openplacerules.org', WRITE_CNAME: '1' });
  execFileSync('node', [path.join(__dirname, '../scripts/build_static.js'), out], { env });
  assert.strictEqual(fs.readFileSync(path.join(out, 'CNAME'), 'utf8').trim(), 'openplacerules.org');
  assert.match(fs.readFileSync(path.join(out, 'sitemap.xml'), 'utf8'), /<loc>https:\/\/openplacerules\.org\/<\/loc>/);
  fs.rmSync(out, { recursive: true, force: true });
});
