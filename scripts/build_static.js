#!/usr/bin/env node
// Builds a static, API-free copy of the site into dist/ for free static hosting
// (GitHub Pages, Cloudflare Pages, Netlify...). The map falls back to data/seed.json
// and runs the same check() algorithm client-side (lib/core.js). Nothing is uploaded.
'use strict';
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const out = path.resolve(process.argv[2] || path.join(root, 'dist'));
fs.rmSync(out, { recursive: true, force: true });
const cp = (from, to) => { fs.mkdirSync(path.dirname(path.join(out, to)), { recursive: true }); fs.cpSync(path.join(root, from), path.join(out, to), { recursive: true }); };

cp('web/index.html', 'index.html');
cp('web/style.css', 'style.css');
cp('web/spec.html', 'spec.html');
for (const f of ['terms.html', 'privacy.html', 'legal.js']) cp(`web/${f}`, f);
for (const f of ['terms-of-use.md', 'privacy-policy.md']) cp(`legal/${f}`, `legal/${f}`);
cp('web/vendor', 'vendor');
cp('lib/core.js', 'lib/core.js');
cp('SPEC.md', 'spec/SPEC.md');
cp('spec/place-rules.schema.json', 'spec/place-rules.schema.json');
cp('spec/examples', 'spec/examples');
cp('licenses', 'licenses');
cp('LICENSE', 'LICENSE.txt');

// Registry data: only the published seed (owner records/claims/moderation queue are server-side state).
const seed = JSON.parse(fs.readFileSync(path.join(root, 'data/seed.json'), 'utf8'));
fs.mkdirSync(path.join(out, 'data'), { recursive: true });
fs.writeFileSync(path.join(out, 'data/seed.json'), JSON.stringify(seed));
cp('data/ATTRIBUTION.md', 'data/ATTRIBUTION.md');

// Deployment target (approved name/domain; nothing is deployed by this script).
const SITE = (process.env.SITE_URL || 'https://openplacerules.org').replace(/\/$/, '');
const HOST = new URL(SITE).host;
const today = new Date().toISOString().slice(0, 10);
for (const f of ['favicon.svg', 'favicon.ico', 'favicon-32.png', 'apple-touch-icon.png', 'og.png']) cp(`web/${f}`, f);
const esc = (t) => t.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

// The map page: same file as the local app, marked as the static edition.
const idx = path.join(out, 'index.html');
fs.writeFileSync(idx, fs.readFileSync(idx, 'utf8').replace(' · local preview · ', ' · preview (static edition) · '));
// Hand-written pages use https://openplacerules.org in canonical/OG tags; rewrite to the deploy origin.
for (const f of ['index.html', 'spec.html', 'terms.html', 'privacy.html']) {
  const fp = path.join(out, f);
  fs.writeFileSync(fp, fs.readFileSync(fp, 'utf8').split('https://openplacerules.org').join(SITE));
}

// Pages that need the API get a static notice instead. abs=true uses root-relative asset paths (for 404.html, served at any URL).
const notice = (file, title, desc, body, abs = false) => { const b = abs ? '/' : ''; return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} — OpenPlaceRules</title>
<meta name="description" content="${esc(desc)}">${file ? `\n<link rel="canonical" href="${SITE}/${file}">` : '\n<meta name="robots" content="noindex">'}
<link rel="icon" href="${b}favicon.svg" type="image/svg+xml"><link rel="icon" href="${b}favicon.ico" sizes="48x48"><link rel="apple-touch-icon" href="${b}apple-touch-icon.png">
<meta name="theme-color" content="#111111">
<meta property="og:type" content="website"><meta property="og:site_name" content="OpenPlaceRules"><meta property="og:title" content="${esc(title)} — OpenPlaceRules">
<meta property="og:description" content="${esc(desc)}"><meta property="og:image" content="${SITE}/og.png">${file ? `<meta property="og:url" content="${SITE}/${file}">` : ''}
<meta name="twitter:card" content="summary_large_image">
<link rel="stylesheet" href="${b}style.css"></head><body>
<header><h1><a href="${b || './'}" style="color:#fff;text-decoration:none">OpenPlaceRules</a></h1><span>${title}</span></header>
<main style="max-width:760px;margin:24px auto;padding:0 16px">${body}</main>
<footer class="site-foot"><a href="${b}terms.html">Terms of Use</a> · <a href="${b}privacy.html">Privacy</a> · <a href="${b}data/ATTRIBUTION.md">Data attribution</a> · Not legal advice</footer></body></html>`; };
fs.writeFileSync(path.join(out, 'submit.html'), notice('submit.html', 'Report a place', 'Report a published rule for camera glasses, recording, AI capture, robots or drones, with its source.',
  `<p>This is the static (read-only) edition of the registry. Reports are not accepted here yet.</p>
<p>Until a public submission channel is opened, see the <a href="spec.html">spec</a>; every registry entry links to its public source.</p>`));
fs.writeFileSync(path.join(out, 'claim.html'), notice('claim.html', 'Claim your place', 'Publish /.well-known/place-rules.json and verify ownership with the file, a meta tag or a DNS TXT record.',
  `<p>Owners publish rules at <code>https://YOUR-DOMAIN/.well-known/place-rules.json</code> (<a href="spec.html">spec</a>, <a href="spec/place-rules.schema.json">schema</a>, <a href="spec/examples/">examples</a>).</p>
<p>Ownership is verified with the token in that file, a <code>&lt;meta name="place-rules-verification"&gt;</code> tag, or a DNS TXT record at <code>_place-rules.YOUR-DOMAIN</code>. The static edition cannot run verification; the hosted registry will.</p>`));
fs.writeFileSync(path.join(out, '404.html'), notice(null, 'Page not found', 'This page does not exist on OpenPlaceRules.',
  `<p>There is no page at this address.</p>
<p>Try the <a href="/">map</a>, the <a href="/spec.html">spec</a>, the <a href="/spec/place-rules.schema.json">JSON Schema</a> or the <a href="/data/seed.json">full dataset</a>.</p>`, true));
const examples = fs.readdirSync(path.join(out, 'spec/examples')).filter((f) => f.endsWith('.json')).sort();
fs.writeFileSync(path.join(out, 'spec/examples/index.html'), notice(null, 'Example files', 'Example /.well-known/place-rules.json files.',
  `<p>Example <code>/.well-known/place-rules.json</code> files (spec <code>place-rules/0.1</code>):</p><ul>${examples.map((f) => `<li><a href="${f}">${f}</a></li>`).join('')}</ul><p><a href="/spec.html">Back to the spec</a></p>`, true)
  .replace('<meta name="robots" content="noindex">', `<link rel="canonical" href="${SITE}/spec/examples/">`));

// Hosting files: robots, sitemap, Cloudflare Pages headers (GitHub Pages ignores _headers).
// WRITE_CNAME=1 emits a CNAME for the custom domain (set in .github/workflows/pages.yml).
if (process.env.WRITE_CNAME === '1') fs.writeFileSync(path.join(out, 'CNAME'), HOST + '\n');
fs.writeFileSync(path.join(out, '.nojekyll'), '');
// The registry eats its own dogfood: a valid place-rules/0.1 file at the well-known path.
// This is an online project, not a physical venue, so every activity is left unspecified.
const wellKnownDir = path.join(out, '.well-known');
fs.mkdirSync(wellKnownDir, { recursive: true });
const wellKnown = {
  spec: 'place-rules/0.1',
  updated: new Date().toISOString(),
  place: { name: 'OpenPlaceRules', url: SITE },
  rules: {},
  conditions: 'OpenPlaceRules is an online registry and specification, not a physical venue. This file is published so the project uses the format it specifies. Activities are left unspecified; the registry does not set camera, recording, robot or drone rules for a physical site here.',
  contact: { email: 'hello@openplacerules.org', url: 'https://github.com/openplacerules/openplacerules.github.io/issues' },
  source: SITE + '/spec.html',
};
fs.writeFileSync(path.join(wellKnownDir, 'place-rules.json'), JSON.stringify(wellKnown, null, 2) + '\n');
fs.writeFileSync(path.join(wellKnownDir, 'index.html'), notice('.well-known/', 'Well-known files',
  'Machine-readable place rules for OpenPlaceRules itself, at the path the spec defines.',
  `<p>This site publishes its own <code>/.well-known/place-rules.json</code> so the registry uses the format it specifies.</p>
<p>OpenPlaceRules is an online registry, not a physical venue. The file leaves every activity unspecified rather than inventing a policy for a place that is not a site you can visit.</p>
<ul>
<li><a href="place-rules.json"><code>/.well-known/place-rules.json</code></a> (spec <code>place-rules/0.1</code>)</li>
<li><a href="/spec.html">The spec</a> and <a href="/spec/place-rules.schema.json">JSON Schema</a></li>
<li><a href="/spec/examples/">Example files</a> for cafés, museums, schools and the Dutch AP house-rule text</li>
</ul>`, false));
fs.writeFileSync(path.join(out, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
const urls = ['', 'spec.html', 'spec/examples/', 'claim.html', 'submit.html', 'terms.html', 'privacy.html', '.well-known/', '.well-known/place-rules.json'];
fs.writeFileSync(path.join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map((u) => `  <url><loc>${SITE}/${u}</loc><lastmod>${today}</lastmod></url>`).join('\n') + '\n</urlset>\n');
fs.writeFileSync(path.join(out, '_headers'), `/data/*
  Access-Control-Allow-Origin: *
  Cache-Control: public, max-age=3600
/spec/*
  Access-Control-Allow-Origin: *
/.well-known/*
  Access-Control-Allow-Origin: *
  Cache-Control: public, max-age=3600
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
`);

let n = 0; (function walk(d) { for (const f of fs.readdirSync(d, { withFileTypes: true })) f.isDirectory() ? walk(path.join(d, f.name)) : n++; })(out);
console.log(`static site: ${out} (${n} files, ${seed.entries.length} entries)`);
