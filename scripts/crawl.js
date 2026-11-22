#!/usr/bin/env node
// Refresher: (1) crawl /.well-known/place-rules.json for listed domains, (2) re-check seed source links,
// (3) flag expired / expiring / temporary / starting rules. Writes data/owner/*, data/link_check.json, data/refresh-report.{json,md}.
// Usage: node scripts/crawl.js [--domains file] [--no-links] [--today YYYY-MM-DD]
const fs = require('fs');
const path = require('path');
const store = require('../lib/store');
const verify = require('../lib/verify');
const core = require('../lib/core');

const args = process.argv.slice(2);
const arg = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const DATA = store.dataDir();
const today = arg('--today', new Date().toISOString().slice(0, 10));

async function crawlDomains(file) {
  const out = [];
  if (!fs.existsSync(file)) return out;
  const domains = fs.readFileSync(file, 'utf8').split('\n').map((l) => l.replace(/#.*/, '').trim()).filter(Boolean);
  for (const raw of domains) {
    let domain;
    try { domain = verify.normalizeDomain(raw); } catch (e) { out.push({ domain: raw, ok: false, error: e.message }); continue; }
    const prev = store.getOwner(domain);
    let r;
    try { r = await verify.fetchRulesFile(domain); } catch (e) { r = { ok: false, error: e.name === 'AbortError' ? 'timeout' : e.message }; }
    if (r.ok) {
      const changed = !prev || JSON.stringify(prev.file) !== JSON.stringify(r.doc);
      store.saveOwner({ ...(prev || {}), domain, method: prev && prev.method && !prev.method.includes('crawled') ? prev.method : 'well-known (crawled)',
        verified_at: prev && prev.verified_at || new Date().toISOString(), fetched_at: new Date().toISOString(),
        file_url: r.url, file: r.doc, stale: false, last_error: null, supersedes: prev && prev.supersedes || [] });
      out.push({ domain, ok: true, changed, url: r.url });
    } else {
      if (prev) store.saveOwner({ ...prev, stale: true, last_error: r.error, last_attempt: new Date().toISOString() });
      out.push({ domain, ok: false, error: r.error, marked_stale: !!prev });
    }
  }
  return out;
}

async function checkLinks(entries) {
  const prev = store.readJson(path.join(DATA, 'link_check.json'), {});
  const urls = [...new Set(entries.map((e) => e.source && e.source.url).filter(Boolean))];
  const res = {};
  const one = async (u) => {
    const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 20000);
    let status;
    try {
      const r = await fetch(u, { signal: ctl.signal, redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/130 Safari/537.36' } });
      status = r.status; try { await r.body?.cancel(); } catch {}
    } catch (e) { status = e.name === 'AbortError' ? 'timeout' : 'error'; }
    finally { clearTimeout(t); }
    const before = prev[u] && (prev[u].status ?? prev[u]);
    res[u] = { status, checked_at: new Date().toISOString(), previous: before ?? null, changed: before != null && String(before) !== String(status) };
  };
  for (let i = 0; i < urls.length; i += 8) await Promise.all(urls.slice(i, i + 8).map(one));
  store.writeJson(path.join(DATA, 'link_check.json'), res);
  return res;
}

function lifecycleReport(entries, links, day = today) {
  const today = day;
  const addDays = (d, n) => { const x = new Date(d + 'T00:00:00Z'); x.setUTCDate(x.getUTCDate() + n); return x.toISOString().slice(0, 10); };
  const soon = addDays(today, 30), reviewBefore = addDays(today, -90);
  const rep = { generated: new Date().toISOString(), today, expired: [], expiring_30d: [], temporary_open_ended: [], not_yet_in_force: [],
    now_in_force_check_status: [], review_due_90d: [], broken_links: [], owner_stale: [] };
  for (const e of entries) {
    const item = { id: e.id, name: e.name, expires: e.expires || undefined, effective_from: e.effective_from || undefined, note: e.lifecycle_note || undefined, source: e.source && e.source.url };
    if (e.expires && e.expires < today) rep.expired.push(item);
    else if (e.expires && e.expires <= soon) rep.expiring_30d.push(item);
    if (e.temporary && !e.expires) rep.temporary_open_ended.push(item);
    if (e.effective_from && e.effective_from > today) rep.not_yet_in_force.push(item);
    if (e.status === 'starts_soon' && (!e.effective_from || e.effective_from <= today)) rep.now_in_force_check_status.push(item);
    if (e.retrieved && e.retrieved.slice(0, 10) < reviewBefore) rep.review_due_90d.push(item);
    const l = links && e.source && links[e.source.url];
    if (l && !(l.status >= 200 && l.status < 400)) rep.broken_links.push({ ...item, status: l.status });
    if (e.stale) rep.owner_stale.push(item);
  }
  return rep;
}

function toMarkdown(rep, crawl) {
  const sec = (t, a, f) => `\n## ${t} (${a.length})\n` + (a.length ? a.map((x) => `- ${f(x)}`).join('\n') : '- none') + '\n';
  return `# OpenPlaceRules refresh report\n\nGenerated ${rep.generated} (registry date ${rep.today}).\n` +
    sec('Crawled owner domains', crawl, (c) => `${c.domain}: ${c.ok ? (c.changed ? 'updated' : 'unchanged') : 'FAILED — ' + c.error + (c.marked_stale ? ' (marked stale)' : '')}`) +
    sec('Expired — re-check source, then update or retire', rep.expired, (x) => `${x.name} — expired ${x.expires}. ${x.note || ''} ${x.source}`) +
    sec('Expiring within 30 days', rep.expiring_30d, (x) => `${x.name} — expires ${x.expires}. ${x.source}`) +
    sec('Temporary with no end date — re-check regularly', rep.temporary_open_ended, (x) => `${x.name}. ${x.note || ''} ${x.source}`) +
    sec('Not yet in force', rep.not_yet_in_force, (x) => `${x.name} — from ${x.effective_from}. ${x.source}`) +
    sec('Marked "starts soon" with no future start date — confirm status', rep.now_in_force_check_status, (x) => `${x.name}. ${x.note || ''} ${x.source}`) +
    sec('Not re-checked in 90 days', rep.review_due_90d, (x) => `${x.name}`) +
    sec('Source links not returning 2xx/3xx to a script (often bot-blocking; open in a browser)', rep.broken_links, (x) => `${x.status} — ${x.name} — ${x.source}`) +
    sec('Owner files unreachable (treated as unknown until fixed)', rep.owner_stale, (x) => `${x.name}`);
}

async function main() {
  const crawl = await crawlDomains(arg('--domains', path.join(DATA, 'crawl-domains.txt')));
  const seed = JSON.parse(fs.readFileSync(path.join(DATA, 'seed.json'), 'utf8'));
  const links = args.includes('--no-links') ? store.readJson(path.join(DATA, 'link_check.json'), null) : await checkLinks(seed.entries);
  const owners = store.listOwners().map((o) => ({ ...store.ownerToEntry(o), stale: o.stale }));
  const rep = { ...lifecycleReport([...seed.entries, ...owners], links), crawl };
  store.writeJson(path.join(DATA, 'refresh-report.json'), rep);
  fs.writeFileSync(path.join(DATA, 'refresh-report.md'), toMarkdown(rep, crawl));
  const n = (k) => rep[k].length;
  console.log(`crawled ${crawl.length} domains (${crawl.filter((c) => c.ok).length} ok); expired ${n('expired')}, expiring ${n('expiring_30d')}, temporary ${n('temporary_open_ended')}, not yet in force ${n('not_yet_in_force')}, link problems ${n('broken_links')}`);
}
if (require.main === module) main().catch((e) => { console.error(e); process.exit(1); });
module.exports = { crawlDomains, checkLinks, lifecycleReport, toMarkdown };
