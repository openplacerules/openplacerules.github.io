'use strict';
const test = require('node:test'), assert = require('node:assert');
const { execFileSync } = require('child_process'), fs = require('fs'), os = require('os'), path = require('path');
const root = path.join(__dirname, '..');
const rd = (f) => fs.readFileSync(path.join(root, f), 'utf8');

test('Terms of Use and Privacy Policy exist and are not legal advice', () => {
  assert.match(rd('legal/terms-of-use.md'), /not legal advice/i);
  assert.match(rd('legal/privacy-policy.md'), /PDPA/);
});

test('every web page links Terms and Privacy; forms point to the privacy policy', () => {
  for (const f of ['index.html', 'claim.html', 'submit.html', 'spec.html', 'terms.html', 'privacy.html']) {
    const s = rd('web/' + f);
    assert.match(s, /href="terms\.html"/, f); assert.match(s, /href="privacy\.html"/, f);
  }
  assert.match(rd('web/claim.html'), /never published/); assert.match(rd('web/submit.html'), /never published/);
});

test('static build ships the legal pages, their sources, footers and sitemap entries', () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'pr-legal-'));
  execFileSync('node', [path.join(root, 'scripts/build_static.js'), out]);
  const r = (f) => fs.readFileSync(path.join(out, f), 'utf8');
  for (const f of ['terms.html', 'privacy.html', 'legal.js', 'legal/terms-of-use.md', 'legal/privacy-policy.md']) assert.ok(fs.existsSync(path.join(out, f)), f);
  assert.ok(!fs.existsSync(path.join(out, 'legal/legal-memo.md')), 'internal memo is not published');
  for (const f of ['claim.html', 'submit.html', '404.html']) assert.match(r(f), /terms\.html.*privacy\.html/s, f);
  assert.match(r('sitemap.xml'), /terms\.html/); assert.match(r('sitemap.xml'), /privacy\.html/);
  fs.rmSync(out, { recursive: true, force: true });
});
