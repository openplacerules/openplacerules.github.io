// Ownership verification: /.well-known file, <meta> tag, or DNS TXT. No dependencies.
const dns = require('dns');
const net = require('net');
const { validate } = require('./validate');

const MAX_BYTES = 64 * 1024;
const TIMEOUT_MS = 10000;

function normalizeDomain(d) {
  d = String(d || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/\.$/, '');
  if (!/^(?=.{1,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(d)) throw new Error('invalid domain: ' + d);
  if (net.isIP(d)) throw new Error('IP addresses are not accepted');
  return d;
}

// Local development/testing: map a domain to a mock base URL, e.g. PLACE_RULES_DEV_MAP='{"cafe.test":"http://127.0.0.1:9100"}'
function devMap() { try { return JSON.parse(process.env.PLACE_RULES_DEV_MAP || '{}'); } catch { return {}; } }
function baseUrlFor(domain, opts = {}) {
  const m = { ...devMap(), ...(opts.domainMap || {}) };
  return m[domain] || `https://${domain}`;
}

async function fetchText(url, opts = {}) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), opts.timeoutMs || TIMEOUT_MS);
  try {
    const res = await (opts.fetchImpl || fetch)(url, { signal: ctl.signal, redirect: 'follow', headers: { 'User-Agent': 'OpenPlaceRules-verifier/0.3 (+https://openplacerules.github.io)' } });
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length > MAX_BYTES) throw new Error(`response larger than ${MAX_BYTES} bytes`);
    return { status: res.status, text: buf.toString('utf8'), contentType: res.headers.get('content-type') || '' };
  } finally { clearTimeout(t); }
}

async function fetchRulesFile(domain, opts = {}) {
  const url = baseUrlFor(domain, opts) + '/.well-known/place-rules.json';
  const r = await fetchText(url, opts);
  if (r.status !== 200) return { ok: false, url, error: `HTTP ${r.status}` };
  let doc;
  try { doc = JSON.parse(r.text); } catch { return { ok: false, url, error: 'not valid JSON' }; }
  const v = validate(doc);
  return { ok: v.valid, url, doc, errors: v.errors, error: v.valid ? null : 'schema: ' + v.errors.slice(0, 5).join('; ') };
}

async function checkWellKnown(domain, token, opts) {
  const f = await fetchRulesFile(domain, opts);
  if (!f.ok) return { ok: false, method: 'well-known', detail: f.error, url: f.url };
  const got = f.doc.verification && f.doc.verification.token;
  if (got !== token) return { ok: false, method: 'well-known', detail: 'file found and valid, but verification.token does not match the claim token', url: f.url };
  return { ok: true, method: 'well-known', detail: 'token found in /.well-known/place-rules.json', url: f.url, doc: f.doc };
}

function findMetaToken(html) {
  const tags = html.match(/<meta\b[^>]*>/gi) || [];
  for (const t of tags) {
    const name = (t.match(/\bname\s*=\s*["']?([^"'\s>]+)/i) || [])[1];
    if (name && name.toLowerCase() === 'place-rules-verification') return (t.match(/\bcontent\s*=\s*["']([^"']*)["']/i) || [])[1] || null;
  }
  return null;
}
async function checkMeta(domain, token, opts) {
  const url = baseUrlFor(domain, opts) + '/';
  const r = await fetchText(url, opts);
  if (r.status !== 200) return { ok: false, method: 'meta', detail: `HTTP ${r.status}`, url };
  const got = findMetaToken(r.text);
  if (!got) return { ok: false, method: 'meta', detail: 'no <meta name="place-rules-verification"> tag on home page', url };
  if (got !== token) return { ok: false, method: 'meta', detail: 'meta tag present but token does not match', url };
  return { ok: true, method: 'meta', detail: 'token found in home page meta tag', url };
}

async function checkDns(domain, token, opts = {}) {
  const name = `_place-rules.${domain}`;
  let records;
  try {
    if (opts.resolveTxt) records = await opts.resolveTxt(name);
    else {
      const r = new dns.promises.Resolver({ timeout: 5000, tries: 2 });
      if (opts.dnsServers) r.setServers(opts.dnsServers);
      records = await r.resolveTxt(name);
    }
  } catch (e) { return { ok: false, method: 'dns', detail: `TXT lookup failed for ${name}: ${e.code || e.message}` }; }
  const flat = records.map((chunks) => (Array.isArray(chunks) ? chunks.join('') : String(chunks)));
  if (flat.includes(`place-rules-verification=${token}`)) return { ok: true, method: 'dns', detail: `TXT ${name} matches` };
  return { ok: false, method: 'dns', detail: `no TXT "place-rules-verification=<token>" at ${name}` };
}

async function verifyDomain(domain, token, opts = {}) {
  domain = normalizeDomain(domain);
  const methods = opts.method ? [opts.method] : ['well-known', 'meta', 'dns'];
  const attempts = [];
  for (const m of methods) {
    let r;
    try {
      r = m === 'well-known' ? await checkWellKnown(domain, token, opts) : m === 'meta' ? await checkMeta(domain, token, opts) : await checkDns(domain, token, opts);
    } catch (e) { r = { ok: false, method: m, detail: e.name === 'AbortError' ? 'timeout' : e.message }; }
    attempts.push(r);
    if (r.ok) return { ok: true, domain, method: m, attempts };
  }
  return { ok: false, domain, attempts };
}

module.exports = { normalizeDomain, baseUrlFor, fetchRulesFile, checkWellKnown, checkMeta, checkDns, verifyDomain, findMetaToken };
