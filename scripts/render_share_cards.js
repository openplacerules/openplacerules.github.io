#!/usr/bin/env node
// Optional: renders dist/p/<id>/card.html into card.png with headless Chrome and points that page's og:image/twitter:image at it,
// so every shared place link unfurls as its own "PROHIBITED / RESTRICTED" card. Run after build_static + build_growth.
// Usage: node scripts/render_share_cards.js [dist] [--chrome=/usr/bin/google-chrome] [--limit=N]. Local only; uploads nothing.
'use strict';
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const args = process.argv.slice(2), opt = (k, d) => (args.find((a) => a.startsWith(`--${k}=`)) || '').split('=')[1] || d;
const out = path.resolve(args.find((a) => !a.startsWith('--')) || path.join(__dirname, '..', 'dist'));
const SITE = (process.env.SITE_URL || 'https://openplacerules.github.io').replace(/\/$/, '');
const chrome = opt('chrome', ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'].find((c) => fs.existsSync(c)));
if (!chrome) { console.error('No Chrome/Chromium found; pass --chrome=PATH'); process.exit(1); }
const ids = fs.readdirSync(path.join(out, 'p')).filter((id) => fs.existsSync(path.join(out, 'p', id, 'card.html'))).slice(0, Number(opt('limit', 1e9)));
let n = 0;
for (const id of ids) {
  const dir = path.join(out, 'p', id), png = path.join(dir, 'card.png');
  execFileSync(chrome, ['--headless=new', '--no-sandbox', '--disable-gpu', '--hide-scrollbars', '--window-size=1200,630', `--screenshot=${png}`, 'file://' + path.join(dir, 'card.html')], { stdio: 'ignore' });
  if (!fs.existsSync(png)) continue;
  const f = path.join(dir, 'index.html');
  fs.writeFileSync(f, fs.readFileSync(f, 'utf8').split(`${SITE}/og.png`).join(`${SITE}/p/${id}/card.png`)); n++;
}
console.log(`share cards: ${n}/${ids.length} rendered`);
