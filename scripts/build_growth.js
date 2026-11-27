#!/usr/bin/env node
// Growth layer for the static site. Run AFTER scripts/build_static.js (which wipes the output dir).
// Writes, into the same output dir (default dist/):
//   p/<id>/index.html   one shareable, indexable page per registry entry (SEO + "check this place" link target)
//   p/<id>/badge.svg    embeddable status badge for that place
//   p/<id>/rules.json   that entry as JSON (for agents / embeds)
//   c/<cc>/             "rules in <country>" landing pages;  places/  full index
//   check.html          share link: check.html?lat=..&lng=..&a=camera_glasses  (runs lib/core.js client-side)
//   sign.html           free printable door sign + place-rules.json generator (QR back to the registry)
//   p/<id>/card.html    1200x630 share card (scripts/render_share_cards.js turns it into card.png + og:image)
//   badge/*.svg         generic "publishes OpenPlaceRules" badges
//   sitemap.xml (merged with the one build_static writes), robots.txt Sitemap line if missing, llms.txt
// Nothing is uploaded or published. SITE_URL env sets the canonical origin (default https://openplacerules.org).
'use strict';
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const out = path.resolve(process.argv[2] || path.join(root, 'dist'));
const SITE = (process.env.SITE_URL || 'https://openplacerules.org').replace(/\/$/, '');
const REPO = (process.env.REPO_URL || 'https://github.com/openplacerules/openplacerules.github.io').replace(/\/$/, '');
function correctionHref(e, pageUrl) {
  const title = 'Correction: ' + e.name + ' (' + e.id + ')';
  const body = 'Place: ' + e.name + '\nId: ' + e.id + '\nPage: ' + pageUrl + '\nCurrent source: ' + ((e.source && e.source.url) || '') + '\nCurrent rules: ' + JSON.stringify(e.rules) + '\n\nWhat is wrong?\n\n\nCorrect rule or wording:\n\n\nPublic source that supports the correction:\nhttps://\n';
  return REPO + '/issues/new?labels=correction&title=' + encodeURIComponent(title) + '&body=' + encodeURIComponent(body);
}
function claimEntryHref(e, pageUrl) {
  const title = 'Claim this entry: ' + e.name + ' (' + e.id + ')';
  const body = [
    'I work at this place and want to confirm or correct the registry entry, and/or publish our own place-rules.json.',
    '',
    'Place: ' + e.name,
    'Id: ' + e.id,
    'Page: ' + pageUrl,
    'Current source: ' + ((e.source && e.source.url) || ''),
    'Current rules: ' + JSON.stringify(e.rules),
    '',
    'Your name and role:',
    '',
    'Official email or domain for this place:',
    '',
    'The current entry is (tick one):',
    '- [ ] Accurate — please leave it as reported until we publish our own file',
    '- [ ] Needs a correction (describe below)',
    '',
    'Correction (if any):',
    '',
    'Public source that supports the correction:',
    'https://',
    '',
    'We want to publish our own /.well-known/place-rules.json:',
    '- [ ] Yes — our domain is:',
    '- [ ] Not yet, but we may later',
    '',
    'A generator and door-sign tool is at ' + SITE + '/new/ and ' + SITE + '/sign.html',
    'To prove domain control so the owner file overrides the reported entry, use ' + SITE + '/claim.html?id=' + e.id
  ].join('\n');
  return REPO + '/issues/new?labels=claim&title=' + encodeURIComponent(title) + '&body=' + encodeURIComponent(body);
}

const qrcode = require(path.join(root, 'web/vendor/qrcode.js'));
const core = require(path.join(root, 'lib/core.js')); // shared DISCLAIMER / TERMS_URL / withNotice (legal/terms-of-use.md)
const seed = require(path.join(root, 'lib/registry')).loadPublished(path.join(root, 'data'));
const entries = seed.entries;
const TODAY = new Date().toISOString().slice(0, 10);

const ACTS = ['camera_glasses', 'recording', 'ai_capture', 'robots', 'drones'];
const LABEL = { camera_glasses: 'Camera glasses', recording: 'Recording / photos', ai_capture: 'AI capture', robots: 'Robots', drones: 'Drones' };
const SHORT = { camera_glasses: 'smart glasses', recording: 'recording', ai_capture: 'AI capture', robots: 'robots', drones: 'drones' };
const VERB = { camera_glasses: 'wear Meta glasses or other camera glasses', recording: 'record or take photos', ai_capture: 'use AI camera capture', robots: 'run a robot', drones: 'fly a drone' };
const IN_KINDS = new Set(['jurisdiction', 'airspace', 'park', 'street', 'local_government', 'heritage', 'theme_park']);
const COLOR = { prohibited: '#c0392b', restricted: '#b9770e', allowed: '#1e8449', unspecified: '#7f8c8d' };
const COUNTRY = { TH: 'Thailand', JP: 'Japan', US: 'the United States', GB: 'the United Kingdom', SG: 'Singapore', KR: 'South Korea', NO: 'Norway',
  NL: 'the Netherlands', AU: 'Australia', PK: 'Pakistan', HK: 'Hong Kong', KH: 'Cambodia', FR: 'France', DE: 'Germany', IT: 'Italy', ES: 'Spain',
  CA: 'Canada', VA: 'Vatican City', PE: 'Peru', IE: 'Ireland', NZ: 'New Zealand', IN: 'India', AE: 'the United Arab Emirates', CN: 'China', TW: 'Taiwan', MY: 'Malaysia', VN: 'Vietnam',
  ID: 'Indonesia', PH: 'the Philippines', SE: 'Sweden', DK: 'Denmark', FI: 'Finland', BE: 'Belgium', CH: 'Switzerland', AT: 'Austria', EU: 'the European Union',
  MX: 'Mexico', ZA: 'South Africa', QA: 'Qatar', PL: 'Poland', GR: 'Greece', BR: 'Brazil', PT: 'Portugal', TR: 'Turkey', EG: 'Egypt', AR: 'Argentina',
  CL: 'Chile', KE: 'Kenya', SA: 'Saudi Arabia', JO: 'Jordan', CZ: 'Czechia', HU: 'Hungary', CO: 'Colombia', NG: 'Nigeria', IL: 'Israel', MA: 'Morocco', MO: 'Macao' };
const cname = (cc) => COUNTRY[cc] || cc;
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const write = (rel, body) => { const f = path.join(out, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, body); };
const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const ruleOf = (e, a) => (e.rules && e.rules[a]) || 'unspecified';
// Display copy must never sound like OpenPlaceRules is granting permission.
function displayVal(value) {
  const base = String(value || '').trim().split(/\s/)[0].toLowerCase();
  return { allowed: 'source: permitted', restricted: 'source: restricted', prohibited: 'source: not permitted', unspecified: 'not stated' }[base] || String(value || '');
}
function sourceStates(key, value) {
  const label = key === 'recording' ? 'photography' : (SHORT[key] || LABEL[key] || key);
  const raw = String(value || '').trim();
  if (!raw || raw === 'unspecified') return 'not stated';
  const m = raw.match(/^(allowed|restricted|prohibited)\b(.*)$/i);
  if (!m) return 'Source states: ' + raw;
  const head = {
    allowed: 'Source states ' + label + ' is permitted',
    restricted: 'Source states ' + label + ' is restricted',
    prohibited: 'Source states ' + label + ' is not permitted'
  }[m[1].toLowerCase()];
  const rest = m[2].trim();
  return rest ? head + ' ' + rest : head;
}
const RANK = { unspecified: 0, allowed: 1, restricted: 2, prohibited: 3 };
const headline = (e) => { // the most newsworthy rule on the entry, for titles
  const set = ACTS.filter((a) => e.rules && e.rules[a]);
  set.sort((x, y) => RANK[ruleOf(e, y)] - RANK[ruleOf(e, x)] || ACTS.indexOf(x) - ACTS.indexOf(y));
  return set;
};

function qrSvg(text, px = 4) {
  const q = qrcode(0, 'M'); q.addData(text); q.make();
  const n = q.getModuleCount(), m = 4, size = (n + m * 2) * px; let d = '';
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) d += `M${(c + m) * px},${(r + m) * px}h${px}v${px}h-${px}z`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="QR code"><rect width="100%" height="100%" fill="#fff"/><path d="${d}" fill="#000"/></svg>`;
}

function badgeSvg(left, right, color) { // shields-style, no external fonts
  const w = (s) => Math.round(s.length * 6.6 + 12);
  const lw = w(left), rw = w(right), W = lw + rw;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="20" role="img" aria-label="${esc(left)}: ${esc(right)}"><title>${esc(left)}: ${esc(right)}</title>
<rect rx="3" width="${W}" height="20" fill="#333"/><rect rx="3" x="${lw}" width="${rw}" height="20" fill="${color}"/><rect x="${lw}" width="4" height="20" fill="${color}"/>
<g fill="#fff" font-family="Verdana,DejaVu Sans,sans-serif" font-size="11"><text x="6" y="14">${esc(left)}</text><text x="${lw + 6}" y="14">${esc(right)}</text></g></svg>`;
}

const CSS = `body{margin:0;font:16px/1.55 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1c1c1c;background:#f7f7f5}
header{padding:10px 16px;background:#111;color:#fff;display:flex;gap:16px;align-items:baseline;flex-wrap:wrap}header a{color:#9cf}header .brand{color:#fff;font-weight:700;text-decoration:none}
main{max-width:820px;margin:20px auto;padding:0 16px}h1{font-size:26px;line-height:1.25;margin:8px 0}
.rules{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;margin:14px 0}
.rule{border-radius:10px;padding:10px 12px;color:#fff}.rule b{display:block;font-size:13px;opacity:.9;font-weight:600}.rule span{font-size:18px;font-weight:700;text-transform:capitalize}
.prohibited{background:#c0392b}.restricted{background:#b9770e}.allowed{background:#1e8449}.unspecified{background:#95a5a6}
.box{background:#fff;border:1px solid #e3e3e3;border-radius:10px;padding:12px 14px;margin:14px 0}.muted{color:#666;font-size:14px}
.btn{display:inline-block;padding:8px 12px;border-radius:8px;background:#1a5fb4;color:#fff;text-decoration:none;margin:4px 6px 4px 0;font-size:14px;border:0;cursor:pointer;font-family:inherit}
.btn.alt{background:#fff;color:#1a5fb4;border:1px solid #1a5fb4}code,pre{background:#f1f1f1;padding:2px 5px;border-radius:4px;font-size:13px;white-space:pre-wrap;word-break:break-all}
table{border-collapse:collapse;width:100%;font-size:14px}td,th{border-bottom:1px solid #eee;padding:6px 4px;text-align:left;vertical-align:top}
.pill{display:inline-block;padding:0 7px;border-radius:9px;color:#fff;font-size:12px;margin:1px 2px}a{color:#1a5fb4}
footer{max-width:820px;margin:30px auto;padding:0 16px 30px;color:#777;font-size:13px}
#chg-filters{display:flex;flex-wrap:wrap;gap:6px;margin:16px 0 8px}
#chg-filters button{background:#fff;color:#1a5fb4;border:1px solid #1a5fb4;border-radius:999px;padding:6px 12px;font:inherit;font-size:13px;cursor:pointer}
#chg-filters button.on{background:#1a5fb4;color:#fff}
.pill.botw{background:#111;color:#fff}`;

function page({ rel, title, desc, body, jsonld, ogImage = '/og.png', depth }) {
  const up = depth ? '../'.repeat(depth) : './';
  const url = SITE + '/' + rel.replace(/index\.html$/, '');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(desc)}"><link rel="canonical" href="${esc(url)}">
<meta property="og:type" content="website"><meta property="og:site_name" content="OpenPlaceRules"><meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${esc(url)}"><meta property="og:image" content="${SITE}${ogImage}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(desc)}"><meta name="twitter:image" content="${SITE}${ogImage}">
${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, '\\u003c')}</script>` : ''}
<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><meta name="theme-color" content="#111111">
<style>${CSS}</style></head><body>
<header><a class="brand" href="${up}">OpenPlaceRules</a><span style="opacity:.75;font-size:13px">robots.txt for the physical world</span>
<nav style="margin-left:auto;display:flex;gap:12px;font-size:13px;flex-wrap:wrap"><a href="${up}places/">All places</a><a href="${up}changes/">Changes</a><a href="${up}contribute/">Contribute</a><a href="${up}press/">Press</a><a href="${up}new/">Make your file</a><a href="${up}sign.html">Free door sign</a><a href="${up}spec.html">Spec</a></nav></header>
<main>${body}</main>
<footer><p class="disclaimer">${esc(core.DISCLAIMER.replace(/ Terms: \S+$/, ''))}</p><a href="${up}contribute/">Contribute</a> · <a href="${up}credits/">Credits</a> · <a href="${up}terms.html">Terms of Use</a> · <a href="${up}privacy.html">Privacy</a> · <a href="${up}data/ATTRIBUTION.md">Data attribution</a> · Data ODbL-1.0 · spec CC-BY-4.0 · code MIT</footer>
</body></html>`;
}

function shareRow(url, text) {
  const u = encodeURIComponent(url), t = encodeURIComponent(text);
  return `<a class="btn alt" href="https://x.com/intent/post?text=${t}&url=${u}" rel="noopener">Share on X</a>`
    + `<a class="btn alt" href="https://social-plugins.line.me/lineit/share?url=${u}" rel="noopener">LINE</a>`
    + `<a class="btn alt" href="https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}" rel="noopener">WhatsApp</a>`
    + `<button class="btn alt" onclick="navigator.clipboard&&navigator.clipboard.writeText('${esc(url)}');this.textContent='Link copied'">Copy link</button>`;
}

// ---------- per-place pages ----------
const byCountry = {};
const urls = ['/', '/places/', '/sign.html', '/check.html', '/spec.html'];
for (const e of entries) {
  (byCountry[e.country] = byCountry[e.country] || []).push(e);
  const rel = `p/${e.id}/index.html`, url = `${SITE}/p/${e.id}/`;
  const acts = headline(e), top = acts[0];
  const verified = /^verified/.test(e.verification || '');
  const L = e.location || {};
  const q = top ? `Can I ${VERB[top]} ${IN_KINDS.has(e.kind) ? 'in' : 'at'} ${e.name}?` : `${e.name}: place rules`;
  const ans = top ? sourceStates(top, ruleOf(e, top)) : 'No rule recorded';
  const title = `${q} ${ans[0].toUpperCase() + ans.slice(1)} · OpenPlaceRules`;
  const desc = `${e.summary} Rules for ${acts.map((a) => SHORT[a]).join(', ') || 'devices'} at ${e.name}${e.region ? ', ' + e.region : ''}, ${cname(e.country)}. Source-linked, open data.`.slice(0, 300);
  const chips = ACTS.map((a) => `<div class="rule ${ruleOf(e, a)}"><b>${LABEL[a]}</b><span>${esc(displayVal(ruleOf(e, a)))}</span></div>`).join('');
  const checkUrl = L.lat != null ? `../../check.html?lat=${L.lat}&lng=${L.lng}&a=${top || 'recording'}` : null;
  const embed = `<a href="${url}"><img src="${url}badge.svg" alt="${esc(e.name)} — ${esc(ans)} (OpenPlaceRules)"></a>`;
  const zones = (e.zones || []).length ? `<div class="box"><b>Zones</b><ul>${e.zones.map((z) => `<li>${esc(z.zone || z.name || z.id || 'zone')}: ${esc(Object.entries(z.rules || z).filter(([k]) => ACTS.includes(k)).map(([k, v]) => sourceStates(k, v)).join('; '))}</li>`).join('')}</ul></div>` : '';
  const life = [e.status && `Status: ${esc(e.status.replace(/_/g, ' '))}`, e.effective_from && `from ${esc(e.effective_from)}`, e.expires && `until ${esc(e.expires)}`, e.temporary && 'temporary rule'].filter(Boolean).join(' · ');
  const jsonld = { '@context': 'https://schema.org', '@type': 'WebPage', name: q, url, description: desc, dateModified: e.retrieved || seed.generated,
    about: Object.assign({ '@type': 'Place', name: e.name, address: { '@type': 'PostalAddress', addressRegion: e.region || undefined, addressCountry: e.country } },
      L.lat != null ? { geo: { '@type': 'GeoCoordinates', latitude: L.lat, longitude: L.lng } } : {}),
    isBasedOn: e.source && e.source.url, license: 'https://opendatacommons.org/licenses/odbl/1-0/' };
  const body = `<p class="muted"><a href="../../c/${e.country.toLowerCase()}/">${esc(cname(e.country))}</a>${e.region ? ' · ' + esc(e.region) : ''} · ${esc(String(e.kind).replace(/_/g, ' '))}</p>
<h1>${esc(q)}</h1>
<p style="font-size:18px">${esc(e.summary)}</p>
<div class="rules">${chips}</div>
<p class="muted">${verified ? '<b>Verified by the place owner.</b>' : 'Reported from a public source, <b>unverified by the owner</b>.'} “Not stated” never means allowed: local law and on-site signs still apply.${life ? '<br>' + life : ''}</p>
${zones}
<div class="box"><b>Source</b>: <a href="${esc(e.source && e.source.url)}" rel="nofollow noopener">${esc((e.source && e.source.publisher) || (e.source && e.source.url))}</a> (${esc((e.source && e.source.type) || 'source')}; retrieved ${esc(e.retrieved || '')})</div>
<p class="muted"><a href="${esc(correctionHref(e, url))}">Report a correction</a> if this entry is wrong or out of date. <a href="${esc(claimEntryHref(e, url))}">Claim this entry</a> if you work here (museum or venue staff): confirm or correct it, and you can publish your own <code>place-rules.json</code>. Both links open a prefilled GitHub issue.</p>
<div class="box"><b>Share this rule</b><br>${shareRow(url, q + ' ' + ans + '.')}
${checkUrl ? `<br><a class="btn" href="${checkUrl}">Check the exact spot</a>` : ''}${L.lat != null ? `<a class="btn" href="../../#${L.lat},${L.lng},14">See it on the map</a>` : ''}</div>
<div class="box"><b>Run this place?</b> Publish your own <code>/.well-known/place-rules.json</code> and verify it; your file overrides anything reported here.
<br><a class="btn" href="../../sign.html?id=${encodeURIComponent(e.id)}">Make a free door sign + rules file</a><a class="btn alt" href="../../claim.html?id=${encodeURIComponent(e.id)}">Claim this place</a></div>
<div class="box"><b>Embed this badge</b> <img src="badge.svg" alt="" style="vertical-align:middle"><pre>${esc(embed)}</pre>
<b>Live widget</b> (updates when the rule changes):<pre>${esc(`<div data-openplacerules data-id="${e.id}"></div>\n<script async src="${SITE}/embed.js"></script>`)}</pre>
<b>For apps &amp; AI agents</b>: <a href="rules.json">rules.json</a> · ${L.lat != null ? `<code>GET /api/check?lat=${L.lat}&amp;lng=${L.lng}&amp;activity=${top || 'recording'}</code> · ` : ''}MCP tool <code>check_place_rules</code></div>`;
  write(rel, page({ rel, title, desc, body, jsonld, depth: 2 }));
  write(`p/${e.id}/badge.svg`, badgeSvg(top ? LABEL[top].split(' /')[0].toLowerCase() : 'place rules', top ? displayVal(ruleOf(e, top)) : 'none', COLOR[top ? ruleOf(e, top) : 'unspecified']));
  write(`p/${e.id}/card.html`, `<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0;width:1200px;height:630px;background:#111;color:#fff;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;padding:60px 70px;box-sizing:border-box;display:flex;flex-direction:column}
.k{font-size:28px;color:#9cf}.q{font-size:${q.length > 70 ? 50 : 60}px;line-height:1.08;font-weight:800;margin:18px 0 26px}.a{display:inline-block;font-size:56px;font-weight:900;padding:10px 30px;border-radius:18px;text-transform:uppercase;align-self:flex-start}
.s{font-size:26px;color:#ccc;margin-top:auto}</style></head><body><div class="k">OpenPlaceRules · ${esc(cname(e.country))}</div><div class="q">${esc(q)}</div>
<div class="a" style="background:${COLOR[top ? ruleOf(e, top) : 'unspecified']}">${esc(top ? displayVal(ruleOf(e, top)) : 'no rule')}</div>
<div class="s">${esc((e.source && e.source.publisher) || '')} · ${verified ? 'verified by owner' : 'source-linked, unverified by owner'} · openplacerules.org</div></body></html>`);
  write(`p/${e.id}/rules.json`, JSON.stringify(core.withNotice(Object.assign({ $schema: `${SITE}/spec/place-rules.schema.json`, registry_url: url }, e)), null, 2));
  urls.push(`/p/${e.id}/`);
}

// ---------- country pages + index ----------
const row = (e, up) => `<tr><td><a href="${up}p/${e.id}/">${esc(e.name)}</a><br><span class="muted">${esc(e.summary)}</span></td><td>${ACTS.filter((a) => e.rules[a]).map((a) => `<span class="pill ${e.rules[a]}">${SHORT[a]}: ${displayVal(e.rules[a])}</span>`).join('')}</td></tr>`;
const countries = Object.keys(byCountry).sort((a, b) => byCountry[b].length - byCountry[a].length);
for (const cc of countries) {
  const list = byCountry[cc].slice().sort((a, b) => a.name.localeCompare(b.name));
  const n = (a) => list.filter((e) => e.rules[a]).length;
  const rel = `c/${cc.toLowerCase()}/index.html`;
  const title = `Smart glasses, recording & drone rules in ${cname(cc)} (${list.length} places) · OpenPlaceRules`;
  const desc = `Where camera glasses, recording, robots and drones are banned or restricted in ${cname(cc)}: ${list.length} source-linked places, updated ${seed.generated ? String(seed.generated).slice(0, 10) : TODAY}.`;
  const body = `<h1>Where are smart glasses, recording and drones restricted in ${esc(cname(cc))}?</h1>
<p>${list.length} places in the open registry: ${ACTS.map((a) => `${n(a)} with ${SHORT[a]} rules`).filter((s) => !s.startsWith('0 ')).join(', ')}. Every entry links to its public source.</p>
<div class="box">${shareRow(SITE + '/' + rel.replace('index.html', ''), `Where smart glasses, recording & drones are restricted in ${cname(cc)}`)}</div>
<table>${list.map((e) => row(e, '../../')).join('')}</table>
<p class="muted">Missing a place? <a href="../../submit.html">Report it</a> or <a href="../../sign.html">make a sign + rules file</a> for your own venue.</p>`;
  write(rel, page({ rel, title, desc, body, depth: 2 }));
  urls.push(`/c/${cc.toLowerCase()}/`);
}
{
  const rel = 'places/index.html';
  const body = `<h1>Every place in the registry (${entries.length})</h1><p>${countries.map((cc) => `<a href="../c/${cc.toLowerCase()}/">${esc(cname(cc))} (${byCountry[cc].length})</a>`).join(' · ')}</p>
<table>${entries.slice().sort((a, b) => a.country.localeCompare(b.country) || a.name.localeCompare(b.name)).map((e) => row(e, '../')).join('')}</table>`;
  write(rel, page({ rel, title: `All ${entries.length} places with smart-glasses, recording, robot & drone rules · OpenPlaceRules`, desc: `Open, source-linked registry of ${entries.length} places in ${countries.length} jurisdictions.`, body, depth: 1 }));
}

// ---------- check.html (the share link) ----------
write('check.html', page({ rel: 'check.html', depth: 0, title: 'Can I record here? · OpenPlaceRules',
  desc: 'Look up source-linked rules for camera glasses, recording, AI capture, robots or drones at any spot.',
  body: `<h1 id="h">Can I record here?</h1><p class="muted" id="where">Pick a spot: use your location, or open a link shared with you.</p>
<p><select id="a" style="padding:8px;border-radius:8px;font:inherit">${ACTS.map((a) => `<option value="${a}">${LABEL[a]}</option>`).join('')}</select>
<button class="btn" id="me">Use my location</button></p>
<div id="out"></div><div class="box" id="share" style="display:none"></div>
<p class="muted">Your location never leaves your device: the whole registry is downloaded and checked in your browser.</p>
<script src="lib/core.js"></script><script>
const LABEL=${JSON.stringify(LABEL)},esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const P=new URLSearchParams(location.search),sel=document.getElementById('a');if(P.get('a')&&LABEL[P.get('a')])sel.value=P.get('a');
let data,pos=P.has('lat')?{lat:+P.get('lat'),lng:+P.get('lng')}:null;
fetch('data/seed.json').then(r=>r.json()).then(d=>{data=d.entries;run()});
sel.onchange=run;document.getElementById('me').onclick=()=>navigator.geolocation.getCurrentPosition(p=>{pos={lat:+p.coords.latitude.toFixed(4),lng:+p.coords.longitude.toFixed(4)};run()},()=>alert('Location unavailable'));
function run(){if(!data||!pos||!Number.isFinite(pos.lat))return;const a=sel.value,r=PlaceRulesCore.check(data,{lat:pos.lat,lng:pos.lng,activity:a});
const col={prohibited:'#c0392b',restricted:'#b9770e',allowed:'#1e8449'}[r.answer]||'#7f8c8d';
const shown={allowed:'source: permitted',restricted:'source: restricted',prohibited:'source: not permitted',unknown:'no rule found'};document.getElementById('h').textContent=(LABEL[a])+' here: '+(shown[r.answer]||r.answer);
document.getElementById('where').textContent=pos.lat+', '+pos.lng+' · confidence: '+r.confidence;
document.getElementById('out').innerHTML='<div class="box" style="border-left:6px solid '+col+'"><p>'+esc(r.explanation)+'</p>'+(r.matches.slice(0,5).map(m=>'<div>• <a href="p/'+encodeURIComponent(m.id)+'/">'+esc(m.name)+'</a>: '+esc(m.value)+' ('+esc(m.state)+')</div>').join(''))+'<p class="muted">'+esc(r.disclaimer)+'</p></div>';
const u=location.origin+location.pathname+'?lat='+pos.lat+'&lng='+pos.lng+'&a='+a,t=LABEL[a]+' here: '+(shown[r.answer]||r.answer);
history.replaceState(null,'','?lat='+pos.lat+'&lng='+pos.lng+'&a='+a);const s=document.getElementById('share');s.style.display='block';
s.innerHTML='<b>Share this check</b><br><a class="btn alt" href="https://x.com/intent/post?text='+encodeURIComponent(t)+'&url='+encodeURIComponent(u)+'">X</a><a class="btn alt" href="https://social-plugins.line.me/lineit/share?url='+encodeURIComponent(u)+'">LINE</a><a class="btn alt" href="https://wa.me/?text='+encodeURIComponent(t+' '+u)+'">WhatsApp</a><a class="btn" href="./#'+pos.lat+','+pos.lng+',15">Map</a>';}
</script>` }));

// ---------- shared client scripts ----------
fs.mkdirSync(path.join(out, 'growth'), { recursive: true });
for (const f of fs.readdirSync(path.join(root, 'web/growth'))) fs.copyFileSync(path.join(root, 'web/growth', f), path.join(out, 'growth', f));
fs.copyFileSync(path.join(root, 'web/growth/embed.js'), path.join(out, 'embed.js'));
write('lib/validate.browser.js', `// Browser build of lib/validate.js (same code, wrapped). Exposes window.PlaceRulesValidate(doc) -> {valid, errors}.\n(function(){var module={exports:{}};\n${fs.readFileSync(path.join(root, 'lib/validate.js'), 'utf8')}\nwindow.PlaceRulesValidate=module.exports.validate;})();\n`);
const scripts = (up, extra) => `<script>window.OPR_SITE=${JSON.stringify(SITE)};window.OPR_REPO=${JSON.stringify(REPO)};</script>
<script src="${up}vendor/qrcode.js"></script><script src="${up}lib/validate.browser.js"></script><script src="${up}growth/common.js"></script>${extra.map((f) => `<script src="${up}growth/${f}"></script>`).join('')}`;
const sel = (id, label, blank = 'not stated') => `<label>${label}<select id="${id}"><option value="">${blank}</option><option>prohibited</option><option>restricted</option><option>allowed</option></select></label>`;
const FORM_CSS = `<style>.f label{display:block;font-weight:600;font-size:14px;margin-top:10px}.f input,.f select,.f textarea{padding:7px;border:1px solid #ccc;border-radius:6px;font:inherit;width:100%;box-sizing:border-box;font-weight:400}
.f textarea{min-height:64px}.g2{display:grid;grid-template-columns:1fr 1fr;gap:8px}.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}.g5{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}
@media(max-width:640px){.g5,.g3{grid-template-columns:1fr 1fr}}.step{font-size:13px;color:#1a5fb4;font-weight:700;text-transform:uppercase;margin-top:16px}</style>`;

// R1: generator
write('new/index.html', page({ rel: 'new/index.html', depth: 1, title: 'Create your place-rules.json: free generator for camera-glasses, recording & drone rules · OpenPlaceRules',
  desc: 'Six questions, one valid /.well-known/place-rules.json. Start from a template (Dutch AP house-rule text, café, gym, Thai temple, event, school), then print a matching door sign.',
  body: `${FORM_CSS}<h1>Make your place-rules.json</h1>
<p>Six questions. You get the file devices and AI agents read, a matching door sign, and a badge. Free, no account, nothing leaves your browser.</p>
<div class="f box"><label>Start from a template<select id="preset"><option value="">(blank)</option><option value="nl_ap">Netherlands: official Dutch AP standard house-rule text (19 Nov 2026; English is unofficial and needs native review)</option>
<option value="cafe">Café / restaurant</option><option value="gym">Gym / pool / changing rooms</option><option value="temple">Thai temple / place of worship (EN + ไทย; Thai wording needs native review)</option><option value="event">Event or conference (temporary)</option><option value="school">School</option></select></label>
<div class="step">1 · The place</div><div class="g2"><label>Name<input id="name" placeholder="Example Café"></label><label>Website domain<input id="dom" placeholder="mycafe.co.th"></label></div>
<label>Address (optional)<input id="addr"></label>
<div class="step">2 · Where it applies</div><div class="g3"><label>Latitude<input id="lat" inputmode="decimal"></label><label>Longitude<input id="lng" inputmode="decimal"></label><label>Radius (m)<input id="rad" value="50" inputmode="numeric"></label></div>
<button class="btn alt" id="me" type="button">Use my location</button> <span class="muted">Optional. Lets apps answer “can I record here?” for this exact spot.</span>
<div class="step">3 · The rules</div><div class="g5">${ACTS.map((a) => sel('r_' + a, LABEL[a])).join('')}</div>
<p class="muted">“Not stated” makes no claim, and readers never treat it as allowed.</p>
<div class="step">4 · Conditions</div><label>What does “restricted” mean here? (any language)<textarea id="cond"></textarea></label>
<div class="step">5 · Exceptions</div><label>e.g. accessibility devices (max 500 characters)<textarea id="exc"></textarea></label>
<div class="step">6 · Contact &amp; timing</div><div class="g2"><label>Contact e-mail<input id="email" type="email"></label><label>Policy page URL<input id="curl" placeholder="https://…"></label></div>
<div class="g3"><label>Temporary? Ends on<input id="exp" type="date"></label><label>Time zone<input id="tz"></label><label>Sign language<select id="lang"><option value="en">English</option><option value="th">English + ไทย (needs native review)</option><option value="nl">English + Nederlands (needs native review)</option></select></label></div>
<label>Source (your public policy page, if any)<input id="src" placeholder="https://…"></label></div>
<div class="box"><b>Your file</b> <span id="status"></span><pre id="out"></pre>
<button class="btn" id="dl">Download place-rules.json</button><a class="btn alt" id="signlink" href="../sign.html">Make the matching door sign</a></div>
<div class="box"><b>Publish it</b> at <code id="where"></code>
<ul><li><b>Any web host / cPanel / Netlify / Cloudflare Pages / GitHub Pages:</b> create a <code>.well-known</code> folder at the site root and upload the file (GitHub Pages also needs a <code>.nojekyll</code> file or an <code>include: [".well-known"]</code> line in <code>_config.yml</code>).</li>
<li><b>WordPress (self-hosted):</b> upload via your host's file manager or SFTP into <code>public_html/.well-known/</code>. On WordPress.com you need a plan that allows file uploads by SFTP.</li>
<li><b>Shopify, Squarespace, Wix:</b> these hosted builders generally don't let you place files under <code>/.well-known/</code>. Use the DNS method on the <a href="../claim.html">claim page</a> to prove the domain is yours and send us the file there, or host it on any domain you control.</li></ul>
Then <a href="../claim.html">claim your place</a> so your file overrides anything reported about you.<br><b>Badge for your site:</b><pre id="badge"></pre></div>
${scripts('../', ['new.js'])}` }));
urls.push('/new/');

// R2: sign
write('sign.html', page({ rel: 'sign.html', depth: 0, title: 'Free printable “No camera glasses” door sign with QR (English, ไทย, Nederlands) · OpenPlaceRules',
  desc: 'Print an A4, A5 or sticker sign for camera glasses, recording, AI capture, robots and drones, with a QR code to the machine-readable rules. Free, no sign-up.',
  body: `${FORM_CSS}<style>
@media print{header,footer,.noprint{display:none!important}main{max-width:none;margin:0;padding:0}body{background:#fff}#sign{border:0!important;margin:0!important}}
@page{size:A4;margin:12mm}body[data-size=a5] #sign{max-width:520px}body[data-size=sticker] #sign{max-width:340px;padding:14px}body[data-size=sticker] .sh{font-size:22px}body[data-size=sticker] .sr{font-size:15px}
#sign{background:#fff;border:3px solid #111;border-radius:16px;padding:30px;margin:18px 0;max-width:720px;color:#111}.sh{font-size:40px;font-weight:800;line-height:1.1}.st{font-size:20px;margin:6px 0 16px;color:#333}.st small,.sl small,.sv small{font-size:.75em;font-weight:500}
.sr{display:flex;align-items:center;gap:14px;font-size:24px;padding:10px 0;border-top:1px solid #ddd}.si{font-size:34px;width:44px;text-align:center}.sl{flex:1}.sv{color:#fff;font-weight:800;padding:6px 14px;border-radius:10px;text-align:center;min-width:150px}
.sn{font-size:17px;margin:12px 0 0}.sq{display:flex;gap:14px;align-items:center;margin-top:16px;font-size:13px;color:#333}</style>
<h1 class="noprint">Free door sign</h1><p class="noprint">One sign people can read, one file machines can read, both saying the same thing. Print it, tape it by the door. Made from your <a href="new/">place-rules.json</a>, or start here.</p>
<div class="f box noprint"><div class="g2"><label>Venue name<input id="name" value="Our venue"></label><label>Your website domain (QR points to your rules file)<input id="dom" placeholder="mycafe.co.th"></label></div>
<div class="g5">${ACTS.map((a) => sel('r_' + a, LABEL[a], 'leave off sign')).join('')}</div>
<label>Note on the sign (optional)<input id="note" placeholder="Accessibility devices: please ask staff."></label>
<div class="g2"><label>Language<select id="lang"><option value="en">English</option><option value="th">English + ไทย (needs native review)</option><option value="nl">English + Nederlands (needs native review)</option></select></label>
<label>Size<select id="size"><option value="a4">A4 poster</option><option value="a5">A5 / counter card</option><option value="sticker">Sticker / door label</option></select></label></div></div>
<div id="sign"></div>
<p class="noprint"><button class="btn" id="print">Print</button> <a class="btn alt" href="new/">Make the machine-readable file</a></p>
<p class="muted noprint">For use by the venue itself. A sign made here states your own house rules; it does not create or confirm a legal rule. Thai and Dutch translations are ours and <strong>need native review</strong> before you print many copies or treat them as official wording. The Dutch AP generator template uses the official standard text from the Autoriteit Persoonsgegevens (19 Nov 2026); any English rendering of that text is unofficial and also needs native review.</p>
${scripts('', ['sign.js'])}` }));

// R4: claim + submit (static edition; the Node server in server.js does the same with a real API when hosted)
write('claim.html', page({ rel: 'claim.html', depth: 0, title: 'Claim your place: verify your domain and publish your own rules · OpenPlaceRules',
  desc: 'Prove you run a place (DNS TXT, meta tag or the well-known file) so your own place-rules.json overrides anything reported about you.',
  body: `${FORM_CSS}<h1>Claim your place</h1><p>Your own file always wins over anything we reported. Three steps, no account.</p>
<div class="f box"><label>Your domain<input id="dom" placeholder="mycafe.co.th"></label><label>Registry entry you're claiming (optional)<input id="entry" placeholder="e.g. the id in the page URL /p/&lt;id&gt;/"></label></div>
<div id="steps" style="display:none"><div class="box"><b>1 · Publish your file</b> at <code>https://<span class="d"></span>/.well-known/place-rules.json</code> (<a href="new/">make one</a>). Put this in it: <code>"verification": {"method": "well-known", "token": "<span class="t"></span>"}</code></div>
<div class="box"><b>2 · Or prove the domain another way</b> (useful on Shopify, Squarespace or Wix):<br>
DNS TXT record at <code>_place-rules.<span class="d"></span></code> with value <code>place-rules-verification=<span class="t"></span></code><br>
or in your home page's <code>&lt;head&gt;</code>: <code>&lt;meta name="place-rules-verification" content="<span class="t"></span>"&gt;</code></div>
<div class="box"><b>3 · Check and send</b><br><button class="btn" id="go">Check now</button><div id="result" style="margin:8px 0"></div><div id="send"></div>
<p class="muted">The token is kept in this browser only. A maintainer re-checks your domain server-side before your entry is marked “verified by owner”. Until the hosted registry is live, claims go through the project's public issue tracker.</p></div></div>
${scripts('', ['claim.js'])}` }));
write('submit.html', page({ rel: 'submit.html', depth: 0, title: 'Report a rule for camera glasses, recording, robots or drones · OpenPlaceRules',
  desc: 'Saw a “no smart glasses” sign or a new drone rule? Report it with a public source. Every report is checked before it is published.',
  body: `${FORM_CSS}<h1>Report a rule</h1><p>Seen a sign, a policy or a new law? Every report needs a public source and is checked before it goes in the registry.</p>
<div class="f box"><div class="g2"><label>Place or rule name<input id="name"></label><label>Country code<input id="country" maxlength="2" placeholder="TH"></label></div>
<div class="g2"><label>Latitude<input id="lat"></label><label>Longitude<input id="lng"></label></div>
<div class="g5">${ACTS.map((a) => sel('r_' + a, LABEL[a])).join('')}</div>
<label>What does the rule say?<textarea id="summary"></textarea></label><label>Public source URL<input id="src" placeholder="https://…"></label><label>Your name or handle for credit (optional)<input id="by"></label></div>
<div class="box"><span id="status"></span><div id="send" style="margin-top:8px"></div></div>
${scripts('', ['submit.js'])}` }));

// R5: embed (iframe target) + offline bundle
write('embed.html', `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>OpenPlaceRules embed</title><style>body{margin:0;font:14px/1.4 system-ui,sans-serif;color:#1c1c1c;padding:10px 12px}a{color:#1a5fb4}.v{display:inline-block;color:#fff;font-weight:700;padding:2px 9px;border-radius:8px;text-transform:capitalize}.m{color:#666;font-size:12px}</style></head><body>
<div id="o" class="m">Checking…</div><script src="lib/core.js"></script><script>
const L=${JSON.stringify(LABEL)},C=${JSON.stringify(COLOR)},P=new URLSearchParams(location.search),esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
fetch('data/seed.json').then(r=>r.json()).then(d=>{const o=document.getElementById('o');let h='';
if(P.get('id')){const e=d.entries.find(x=>x.id===P.get('id'));if(!e){o.textContent='Unknown place';return}
h='<b>'+esc(e.name)+'</b><br>'+Object.keys(e.rules).map(a=>L[a]+': <span class="v" style="background:'+C[e.rules[a]]+'">'+e.rules[a]+'</span>').join(' ')+'<br><a target="_blank" rel="noopener" href="p/'+encodeURIComponent(e.id)+'/">Source &amp; details</a>';}
else{const a=L[P.get('a')]?P.get('a'):'camera_glasses',r=PlaceRulesCore.check(d.entries,{lat:+P.get('lat'),lng:+P.get('lng'),activity:a});
var shown={allowed:'source: permitted',restricted:'source: restricted',prohibited:'source: not permitted',unknown:'no rule found'};h='<b>'+L[a]+' here:</b> <span class="v" style="background:'+(C[r.answer]||'#7f8c8d')+'">'+(shown[r.answer]||r.answer)+'</span><br>'+esc(r.explanation).slice(0,180)+'<br><a target="_blank" rel="noopener" href="check.html?lat='+r.query.lat+'&lng='+r.query.lng+'&a='+a+'">Details</a>';}
o.className='';o.innerHTML=h+' <span class="m">· <a target="_blank" rel="noopener" href="./">OpenPlaceRules</a> · not legal advice · <a target="_blank" rel="noopener" href="terms.html">Terms</a></span>';}).catch(()=>{document.getElementById('o').textContent='Rules unavailable'});
</script></body></html>`);
const stamp = String(seed.generated || TODAY).slice(0, 10);
write(`data/bundle-${stamp}.json`, JSON.stringify(Object.assign({ bundle: stamp, license: 'ODbL-1.0', attribution: 'OpenPlaceRules contributors; sources linked per entry' }, seed)));
write('data/bundle-latest.json', JSON.stringify({ latest: `data/bundle-${stamp}.json`, generated: seed.generated, count: entries.length }));

// R12: CSV + stats for journalists;  R9: adoption counter
const csvq = (v) => { const t = v == null ? '' : String(v); return /[",\n]/.test(t) ? '"' + t.replace(/"/g, '""') + '"' : t; };
write('data/places.csv', ['id,name,kind,country,region,lat,lng,' + ACTS.join(',') + ',status,expires,verification,source_type,source_url,retrieved']
  .concat(entries.map((e) => [e.id, e.name, e.kind, e.country, e.region, e.location && e.location.lat, e.location && e.location.lng, ...ACTS.map((a) => e.rules[a] || ''),
    e.status, e.expires, e.verification, e.source && e.source.type, e.source && e.source.url, e.retrieved].map(csvq).join(','))).join('\n') + '\n');
const ownerVerified = entries.filter((e) => /^verified/.test(e.verification || ''));
const stats = { generated: seed.generated, entries: entries.length, jurisdictions: countries.length, owner_verified: ownerVerified.length,
  official_sources: entries.filter((e) => e.source && e.source.type === 'official').length,
  by_activity: Object.fromEntries(ACTS.map((a) => [a, Object.fromEntries(['prohibited', 'restricted', 'allowed'].map((v) => [v, entries.filter((e) => e.rules[a] === v).length]))])),
  by_jurisdiction: Object.fromEntries(countries.map((cc) => [cc, byCountry[cc].length])) };
write('data/stats.json', JSON.stringify(stats, null, 2));
write('api/stats.json', JSON.stringify(stats, null, 2));
write('stats/index.html', page({ rel: 'stats/index.html', depth: 1, title: `Smart-glasses, recording & drone rules: ${entries.length} places, ${countries.length} jurisdictions · OpenPlaceRules`,
  desc: `Open statistics: ${entries.length} source-linked rules in ${countries.length} jurisdictions; ${ownerVerified.length} places publish their own verified file.`,
  body: `<h1>The numbers</h1><div class="rules"><div class="rule prohibited"><b>Places publishing their own file</b><span>${ownerVerified.length}</span></div>
<div class="rule allowed"><b>Source-linked rules</b><span>${entries.length}</span></div><div class="rule restricted"><b>Jurisdictions</b><span>${countries.length}</span></div><div class="rule unspecified"><b>Official sources</b><span>${stats.official_sources}</span></div></div>
<p>${ownerVerified.length ? `${ownerVerified.length} places publish and verify their own <code>place-rules.json</code>.` : 'No place has published and verified its own file yet. <a href="../new/">Be the first</a>: the first 10 are listed here by name.'}</p>
<table><tr><th>Activity</th><th>prohibited</th><th>restricted</th><th>source: permitted</th></tr>${ACTS.map((a) => `<tr><td>${LABEL[a]}</td>${['prohibited', 'restricted', 'allowed'].map((v) => `<td>${stats.by_activity[a][v]}</td>`).join('')}</tr>`).join('')}</table>
<p>By jurisdiction: ${countries.map((cc) => `<a href="../c/${cc.toLowerCase()}/">${esc(cname(cc))}</a> ${byCountry[cc].length}`).join(' · ')}</p>
<p>Download: <a href="../data/places.csv">places.csv</a> · <a href="../data/stats.json">stats.json</a> · <a href="../data/bundle-${stamp}.json">full bundle (${stamp})</a> · licence ODbL-1.0, please credit “OpenPlaceRules”.</p>` }));
urls.push('/stats/');

const year = String(seed.generated || TODAY).slice(0, 4);
const cgN = entries.filter((e) => e.rules.camera_glasses).length;
const kindTally = (act, val) => {
  const c = {};
  for (const e of entries) if (e.rules[act] === val) c[e.kind] = (c[e.kind] || 0) + 1;
  return Object.entries(c).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
};
const kindList = (rows) => rows.slice(0, 6).map(([k, n]) => `${n} ${k.replace(/_/g, ' ')}`).join(', ');
write('press/index.html', page({ rel: 'press/index.html', depth: 1,
  title: `Press · OpenPlaceRules (${entries.length} places, ${countries.length} jurisdictions)`,
  desc: `Open, source-linked registry of what public sources say about camera glasses, recording, AI capture, robots and drones at a place. ${entries.length} entries in ${countries.length} jurisdictions. Contact hello@openplacerules.org.`,
  jsonld: { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Press · OpenPlaceRules', url: SITE + '/press/', description: 'Press information, statistics, citation and licence for the OpenPlaceRules registry.', isPartOf: { '@type': 'WebSite', name: 'OpenPlaceRules', url: SITE + '/' }, email: 'hello@openplacerules.org' },
  body: `<h1>Press</h1>
<p>OpenPlaceRules is an open registry and a robots.txt-style specification for the physical world. It records what public sources say about camera glasses, recording, AI capture, robots and drones at a place, and it defines a machine-readable file that a place can publish at <code>/.well-known/place-rules.json</code>.</p>
<p>Every registry entry links to its source. Entries are reported from those sources and are unverified by the owner of the place unless marked otherwise. The registry is not legal advice. An omitted activity is unspecified and does not mean permitted.</p>
<h2>Latest figures</h2>
<p class="muted">Taken from the published dataset (generated ${esc(stats.generated)}). These numbers are also at <a href="../data/stats.json"><code>/data/stats.json</code></a> and at the stable URL <a href="../api/stats.json"><code>/api/stats.json</code></a>.</p>
<div class="rules"><div class="rule allowed"><b>Source-linked rules</b><span>${entries.length}</span></div><div class="rule restricted"><b>Jurisdictions</b><span>${countries.length}</span></div><div class="rule unspecified"><b>Official sources</b><span>${stats.official_sources}</span></div><div class="rule prohibited"><b>Owner-verified</b><span>${ownerVerified.length}</span></div></div>
<table><tr><th>Activity</th><th>source: not permitted</th><th>source: restricted</th><th>source: permitted</th></tr>${ACTS.map((a) => `<tr><td>${LABEL[a]}</td>${['prohibited', 'restricted', 'allowed'].map((v) => `<td>${stats.by_activity[a][v]}</td>`).join('')}</tr>`).join('')}</table>
<p>By jurisdiction: ${countries.map((cc) => `<a href="../c/${cc.toLowerCase()}/">${esc(cname(cc))}</a> ${byCountry[cc].length}`).join(' · ')}</p>
<h2>Notable findings</h2>
<ul>
<li>Of ${cgN} entries that state a camera-glasses rule, <b>${stats.by_activity.camera_glasses.prohibited}</b> sources say they are not permitted, ${stats.by_activity.camera_glasses.restricted} say they are restricted, and ${stats.by_activity.camera_glasses.allowed} say they are permitted.${kindTally('camera_glasses', 'prohibited').length ? ' Places where sources say camera glasses are not permitted include ' + kindList(kindTally('camera_glasses', 'prohibited')) + '.' : ''}</li>
<li><b>${stats.by_activity.drones.prohibited}</b> entries report that drones are not permitted, and ${stats.by_activity.drones.restricted} report they are restricted.</li>
<li>${stats.by_activity.recording.prohibited} entries report that photography or recording is not permitted, and ${stats.by_activity.recording.restricted} report it is restricted.</li>
<li>${stats.official_sources} of ${entries.length} entries cite an official source. ${ownerVerified.length ? ownerVerified.length + ' ' + (ownerVerified.length === 1 ? 'place has' : 'places have') + ' published and verified ' + (ownerVerified.length === 1 ? 'its' : 'their') + ' own <code>place-rules.json</code>.' : 'No place has yet published and verified its own <code>place-rules.json</code>.'}</li>
</ul>
<p>See the <a href="../stats/">statistics page</a>, the <a href="../places/">place index</a>, or a jurisdiction page such as <a href="../c/us/">the United States</a>.</p>
<h2>How to cite</h2>
<p>Please credit “OpenPlaceRules” and link to <a href="${SITE}/">${SITE}/</a>, or to the specific place page or dataset you used.</p>
<p>Suggested citation:</p>
<pre>OpenPlaceRules (${year}). Open registry of place rules. ${SITE}/. Data available under ODbL-1.0; specification under CC-BY-4.0.</pre>
<p><a href="https://doi.org/10.5281/zenodo.24586418"><img src="https://zenodo.org/badge/DOI/10.5281/zenodo.24586418.svg" alt="DOI 10.5281/zenodo.24586418"></a></p>
<pre>OpenPlaceRules (2026). OpenPlaceRules registry snapshot (2026-11-27). Zenodo. https://doi.org/10.5281/zenodo.24586418. Data available under ODbL-1.0.</pre>
<p>Dated snapshot for citation and archival reuse: <a href="https://doi.org/10.5281/zenodo.24586418">https://doi.org/10.5281/zenodo.24586418</a> · <a href="https://zenodo.org/records/24586418">Zenodo record</a> · <a href="https://github.com/openplacerules/dataset/releases/latest">Download the dataset</a> (<code>seed.json</code>, <code>places.csv</code>, attribution and the ODbL-1.0 licence). The concept DOI, which always resolves to the latest version, is <a href="https://doi.org/10.5281/zenodo.24586417">10.5281/zenodo.24586417</a>. Live figures stay at the links below.</p>
<p>Machine-readable downloads: <a href="../api/stats.json">/api/stats.json</a> · <a href="../data/stats.json">stats.json</a> · <a href="../data/places.csv">places.csv</a> · <a href="../data/seed.json">full dataset (seed.json)</a> · <a href="../data/bundle-latest.json">latest bundle</a>.</p>
<h2>Licence</h2>
<ul>
<li>Specification: <a href="../licenses/CC-BY-4.0.txt">CC-BY-4.0</a></li>
<li>Data: <a href="../licenses/ODbL-1.0.txt">ODbL-1.0</a> — please credit “OpenPlaceRules” and keep the source links on each entry.</li>
<li>Code: MIT — see the <a href="../LICENSE.txt">licence file</a> for how the three parts fit together.</li>
</ul>
<h2>Contact</h2>
<p>Email <a href="mailto:hello@openplacerules.org">hello@openplacerules.org</a>. To correct an entry or claim a place, use the links on that place’s page or open an issue in the <a href="${REPO}">public repository</a>.</p>` }));
urls.push('/press/');

function basicMd(s) {
  return s.trim().split(/\n{2,}/).map((block) => {
    const t = block.trim();
    if (!t) return '';
    if (/^# /.test(t)) return '';
    const inline = (x) => esc(x)
      .replace(/\[([^\]]+)\]\((https?:[^)]+|mailto:[^)]+)\)/g, '<a href="$2">$1</a>')
      .replace(/\n/g, '<br>');
    if (/^## /.test(t)) return '<h2>' + inline(t.replace(/^## /, '')) + '</h2>';
    return '<p>' + inline(t) + '</p>';
  }).join('\n');
}
const issuesFirst = REPO + '/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22';
const discussions = REPO + '/discussions';
write('contribute/index.html', page({ rel: 'contribute/index.html', depth: 1,
  title: 'Contribute · OpenPlaceRules',
  desc: 'Add a sourced place rule, pick a good first issue, join Discussions, or claim a venue listing on OpenPlaceRules.',
  jsonld: { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Contribute · OpenPlaceRules', url: SITE + '/contribute/', description: 'How to add a sourced rule, claim a place, or pick a good first issue.', isPartOf: { '@type': 'WebSite', name: 'OpenPlaceRules', url: SITE + '/' } },
  body: `<h1>Contribute</h1>
<p>OpenPlaceRules is an open, free registry and file format (<code>/.well-known/place-rules.json</code>) that lets places say whether camera glasses, recording, AI capture, robots and drones are allowed. Every entry cites a public source. The rules are informational, not legal advice. An omitted activity is unspecified and never means permitted.</p>
<h2>Start here</h2>
<p>Community conversation is in <a href="${discussions}">GitHub Discussions</a>. Read the <a href="${discussions}/12">Start here</a> post, then pick a path below. Please follow our <a href="${REPO}/blob/main/CODE_OF_CONDUCT.md">Code of Conduct</a>.</p>
<ul>
<li><b>Add a sourced rule</b> for a place you know, using the <a href="../new/">generator</a>. Open an <a href="${REPO}/issues/new?template=report.md">Add a place rule (with source)</a> issue, a Discussions thread, or a pull request. Sourcing standard: link an official page, sign or document; no guesses.</li>
<li><b>Good first issues</b> — planned, self-contained tasks: <a href="${issuesFirst}">open good first issues</a>.</li>
<li><b>Correct an entry</b> — each place page has “Report a correction”, which opens a <a href="${REPO}/issues/new?template=correction.md">Report a wrong rule</a> issue.</li>
<li><b>Build an integration</b> (MCP, app or glasses SDK) and share it in Discussions, under Show and tell.</li>
<li><b>Run a venue?</b> <a href="../claim.html">Claim your listing</a>: publish <code>/.well-known/place-rules.json</code> and prove you control the domain. The claim page walks through the accepted methods and opens the verification issue for you. More detail is in <a href="${REPO}/blob/main/CONTRIBUTING.md">CONTRIBUTING.md</a>.</li>
</ul>
<h2>Discussions</h2>
<ul>
<li><a href="${discussions}/categories/announcements">Announcements</a> — updates from maintainers</li>
<li><a href="${discussions}/categories/q-a">Q&amp;A</a> — add a place, or ask about an existing entry</li>
<li><a href="${discussions}/categories/ideas">Ideas</a> — spec and schema</li>
<li><a href="${discussions}/categories/show-and-tell">Show and tell</a> — integrations and things you have built (MCP, apps, glasses SDKs)</li>
<li><a href="${discussions}/categories/general">General</a> — venues and owners, including help with a claim</li>
</ul>
<p>Please use the category that fits. Do not post the same text in more than one place.</p>
<h2>Credits</h2>
<p>Merged contributors are listed on the <a href="../credits/">credits page</a> only if they opt in. Code is MIT, the spec CC-BY-4.0 and the data ODbL-1.0.</p>` }));
urls.push('/contribute/');

const creditsMd = fs.readFileSync(path.join(root, 'CREDITS.md'), 'utf8');
write('CREDITS.md', creditsMd);
write('credits/index.html', page({ rel: 'credits/index.html', depth: 1,
  title: 'Credits · OpenPlaceRules',
  desc: 'Opt-in credits for people who contribute to OpenPlaceRules. Names are listed only when the contributor asks.',
  jsonld: { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Credits · OpenPlaceRules', url: SITE + '/credits/', description: 'Opt-in contributor credits for OpenPlaceRules.', isPartOf: { '@type': 'WebSite', name: 'OpenPlaceRules', url: SITE + '/' } },
  body: `<h1>Credits</h1>
${basicMd(creditsMd)}
<p class="muted">This page is built from <a href="${REPO}/blob/main/CREDITS.md">CREDITS.md</a>.</p>` }));
urls.push('/credits/');


// R8: /changes + Atom feed (built from the dataset's own dates, so it needs no runtime state)
const soon = new Date(Date.now() + 60 * 864e5).toISOString().slice(0, 10);
const inForce = (e) => (!e.expires || e.expires >= TODAY) && (!e.effective_from || e.effective_from <= TODAY) && e.status !== 'expired' && e.status !== 'ended';
const expiring = entries.filter((e) => e.expires && e.expires >= TODAY && e.expires <= soon).sort((a, b) => a.expires.localeCompare(b.expires));
const expired = entries.filter((e) => e.expires && e.expires < TODAY).sort((a, b) => b.expires.localeCompare(a.expires));
const upcoming = entries.filter((e) => e.effective_from && e.effective_from > TODAY).sort((a, b) => a.effective_from.localeCompare(b.effective_from));
const recent = entries.filter((e) => e.effective_or_reported_date && e.effective_or_reported_date <= TODAY).sort((a, b) => b.effective_or_reported_date.localeCompare(a.effective_or_reported_date)).slice(0, 40);
const datedProhibited = (needGlasses) => entries.filter((e) => inForce(e) && e.effective_or_reported_date && e.effective_or_reported_date <= TODAY && (needGlasses ? e.rules.camera_glasses === 'prohibited' : ACTS.some((a) => e.rules[a] === 'prohibited'))).sort((a, b) => b.effective_or_reported_date.localeCompare(a.effective_or_reported_date) || a.name.localeCompare(b.name));
const glassBans = datedProhibited(true), anyBans = datedProhibited(false);
const botwPool = glassBans.length ? glassBans : anyBans;
const botwDate = botwPool[0] && botwPool[0].effective_or_reported_date;
const botw = botwDate ? botwPool.filter((e) => e.effective_or_reported_date === botwDate) : [];
const botwIds = new Set(botw.map((e) => e.id));
const tagsOf = (e, bucket) => {
  const t = [];
  if (botwIds.has(e.id)) t.push('botw');
  for (const a of ACTS) if (e.rules[a]) t.push(a);
  if (bucket) t.push(bucket);
  if (e.rules.camera_glasses === 'prohibited' || e.rules.recording === 'prohibited' || e.rules.drones === 'prohibited') t.push('ban');
  return t.join(' ');
};
const li = (e, d, bucket) => `<li data-tags="${tagsOf(e, bucket)}"><a href="../p/${e.id}/">${esc(e.name)}</a> <span class="muted">(${esc(cname(e.country))}${d ? ', ' + esc(d) : ''})</span> ${botwIds.has(e.id) ? '<span class="pill botw">Ban of the Week</span> ' : ''}${ACTS.filter((a) => e.rules[a]).map((a) => `<span class="pill ${e.rules[a]}">${SHORT[a]}: ${displayVal(e.rules[a])}</span>`).join('')}</li>`;
const sect = (h, list, f, bucket) => list.length ? `<section data-section><h2>${h}</h2><ul>${list.map((e) => li(e, f(e), bucket)).join('')}</ul></section>` : '';
const botwBox = botw.length ? `<div class="box" id="ban-of-the-week"><h2 style="margin-top:0">Ban of the Week</h2>
<p class="muted">The most recently dated in-force ${glassBans.length ? 'smart-glasses prohibition' : 'prohibition'} in the registry${botwDate ? ' (reported ' + esc(botwDate) + ')' : ''}. Source-linked, unverified by the owner, and not legal advice. Filter the list below, or <a href="?tag=botw">open this tag</a>.</p>
<ul>${botw.map((e) => li(e, e.effective_or_reported_date, 'botw')).join('')}</ul></div>` : '<div class="box" id="ban-of-the-week"><h2 style="margin-top:0">Ban of the Week</h2><p class="muted">No dated, in-force prohibition is in the registry yet.</p></div>';
const filterJs = `<script>(function(){var btns=[].slice.call(document.querySelectorAll('#chg-filters [data-filter]')),items=[].slice.call(document.querySelectorAll('#chg-list li[data-tags]')),sects=[].slice.call(document.querySelectorAll('#chg-list section[data-section]'));function apply(f){btns.forEach(function(b){b.classList.toggle('on',b.getAttribute('data-filter')===f)});items.forEach(function(li){var tags=(li.getAttribute('data-tags')||'').split(/\\s+/);li.hidden=!(f==='all'||tags.indexOf(f)!==-1)});sects.forEach(function(s){s.hidden=![].slice.call(s.querySelectorAll('li[data-tags]')).some(function(li){return !li.hidden})})}btns.forEach(function(b){b.addEventListener('click',function(){var f=b.getAttribute('data-filter');history.replaceState(null,'','?tag='+encodeURIComponent(f));apply(f)})});var q=new URLSearchParams(location.search).get('tag');apply(q&&btns.some(function(b){return b.getAttribute('data-filter')===q})?q:'all')})();</script>`;
write('changes/index.html', page({ rel: 'changes/index.html', depth: 1, title: 'Smart-glasses & drone ban tracker: new, expiring and expired rules · OpenPlaceRules',
  desc: 'Ban of the Week and a live, source-linked changelog of rules for camera glasses, recording, AI capture, robots and drones: new rules, temporary bans about to expire, and rules that ended.',
  body: `<h1>What changed</h1><p>New, expiring and ended rules, from the registry's own dates. Subscribe: <a href="../changes.xml">Atom/RSS feed</a>.</p>
${botwBox}
<div id="chg-filters" role="tablist" aria-label="Filter changes"><button type="button" data-filter="all">All</button><button type="button" data-filter="botw">Ban of the Week</button><button type="button" data-filter="camera_glasses">Smart glasses</button><button type="button" data-filter="drones">Drones</button><button type="button" data-filter="recording">Recording</button><button type="button" data-filter="expiring">Expiring</button><button type="button" data-filter="ban">All bans</button></div>
<div id="chg-list">${sect('Expiring in the next 60 days', expiring, (e) => 'expires ' + e.expires, 'expiring')}${sect('Coming into force', upcoming, (e) => 'from ' + e.effective_from, 'upcoming')}
${sect('Newest rules', recent, (e) => e.effective_or_reported_date, 'new')}${sect('Ended', expired.slice(0, 20), (e) => 'ended ' + e.expires, 'ended')}</div>
${filterJs}` }));
urls.push('/changes/');
const feedItems = [...expiring.map((e) => ({ e, kind: 'Expiring', d: e.expires })), ...upcoming.map((e) => ({ e, kind: 'Coming into force', d: e.effective_from })), ...recent.map((e) => ({ e, kind: 'New', d: e.effective_or_reported_date }))];
const xml = (t) => esc(t);
write('changes.xml', `<?xml version="1.0" encoding="utf-8"?>\n<feed xmlns="http://www.w3.org/2005/Atom"><title>OpenPlaceRules: rule changes</title><link href="${SITE}/changes/"/><link rel="self" href="${SITE}/changes.xml"/>
<id>${SITE}/changes.xml</id><updated>${new Date(seed.generated || Date.now()).toISOString()}</updated><author><name>OpenPlaceRules</name></author>
${feedItems.map(({ e, kind, d }) => `<entry><title>${xml(kind + ': ' + e.name)}</title><link href="${SITE}/p/${e.id}/"/><id>${SITE}/p/${e.id}/#${slug(kind)}-${d}</id><updated>${d}T00:00:00Z</updated><summary>${xml(e.summary)}</summary></entry>`).join('\n')}
</feed>\n`);

// R3: badges
write('badge/published.svg', badgeSvg('place rules', 'published', '#1a5fb4'));
write('badge/verified.svg', badgeSvg('place rules', 'verified ✓', '#1e8449'));
for (const a of ACTS) for (const v of ['prohibited', 'restricted', 'allowed'])
  write(`badge/${a.replace(/_/g, '-')}-${v}.svg`, badgeSvg(LABEL[a].split(' /')[0].toLowerCase(), displayVal(v), COLOR[v]));
for (const e of ownerVerified) { // per-domain badge for owner-verified places: /badge/<domain>.svg
  const host = e.source && e.source.url ? new URL(e.source.url).host.replace(/^www\./, '') : null;
  if (host) write(`badge/${host}.svg`, badgeSvg('place rules', 'verified ✓', '#1e8449'));
}
// R10: markdown docs for agents
write('llms-full.txt', fs.readFileSync(path.join(root, 'SPEC.md'), 'utf8'));
// ---------- generic badges, share card, sitemap, robots, llms.txt ----------
{ // merge into build_static's sitemap instead of replacing it
  const f = path.join(out, 'sitemap.xml');
  const prev = fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : '';
  const have = new Set([...prev.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
  const add = urls.map((u) => SITE + u).filter((u) => !have.has(u) && !have.has(u.replace(/\/$/, '')));
  const items = [...prev.matchAll(/\s*<url>[\s\S]*?<\/url>/g)].map((m) => m[0].trim()).concat(add.map((u) => `<url><loc>${u}</loc><lastmod>${TODAY}</lastmod></url>`));
  write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  ${items.join('\n  ')}\n</urlset>\n`);
  const r = path.join(out, 'robots.txt'), rt = fs.existsSync(r) ? fs.readFileSync(r, 'utf8') : 'User-agent: *\nAllow: /\n';
  if (!/Sitemap:/i.test(rt)) write('robots.txt', rt + `\nSitemap: ${SITE}/sitemap.xml\n`);
}
write('llms.txt', `# OpenPlaceRules

> robots.txt for the physical world. Open, machine-readable rules reporting what sources say about camera glasses, recording, AI capture, robots and drones at a place. An omitted activity is unspecified and never means allowed. Not legal advice.

Places publish https://<their-domain>/.well-known/place-rules.json. This site also keeps a registry of ${entries.length} source-linked rules in ${countries.length} jurisdictions (${ownerVerified.length} verified by the owner).

## Docs
- [Spec (markdown)](${SITE}/llms-full.txt): the full place-rules/0.1 specification
- [JSON Schema](${SITE}/spec/place-rules.schema.json) and [examples](${SITE}/spec/examples/)

## Data and lookups
- [Check a point](${SITE}/check.html?lat=13.7500&lng=100.4913&a=camera_glasses): ?lat=&lng=&a=camera_glasses|recording|ai_capture|robots|drones
- [Full dataset, ODbL](${SITE}/data/seed.json), [CSV](${SITE}/data/places.csv), [stats](${SITE}/data/stats.json) (stable copy at ${SITE}/api/stats.json)
- [Press page](${SITE}/press/): figures, citation and licence
- [Contribute](${SITE}/contribute/): discussions, good first issues, and how venues claim a place
- [Credits](${SITE}/credits/): opt-in contributor list
- [Changes feed](${SITE}/changes.xml): new, expiring and ended rules
- One page per place: ${SITE}/p/<id>/ (machine copy at ${SITE}/p/<id>/rules.json)
- MCP server (stdio): check_place_rules, search_place_rules, get_place_rule, validate_place_rules_file

## For places
- [Make a file](${SITE}/new/), [print a door sign](${SITE}/sign.html), [claim your place](${SITE}/claim.html)

## Places by jurisdiction
${countries.map((cc) => `- [${cname(cc)}](${SITE}/c/${cc.toLowerCase()}/): ${byCountry[cc].length} places`).join('\n')}
`);
console.log(`growth layer: ${entries.length} place pages, ${countries.length} country pages, ${urls.length} sitemap URLs -> ${out}`);
