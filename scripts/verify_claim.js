#!/usr/bin/env node
// Verify an owner-claim GitHub issue (SPEC §7) and, on success, import the
// owner's /.well-known/place-rules.json as a committed owner-verified record.
//
// Usage:
//   node scripts/verify_claim.js --body-file issue.md [--title "..."] [--data-dir data] [--import] [--result-file out.json]
//   node scripts/verify_claim.js --issue-json issue.json [--data-dir data] [--import] [--result-file out.json]
//
// Does not talk to GitHub itself. The workflow comments, labels, and opens a PR.
'use strict';
const fs = require('fs');
const path = require('path');
const verify = require('../lib/verify');
const store = require('../lib/store');

const TOKEN_RE = /^[A-Za-z0-9_-]{16,128}$/;
const CLAIM_URL = 'https://openplacerules.org/claim.html';
const SPEC_URL = 'https://openplacerules.org/spec.html';

function stripValue(v) {
  v = String(v || '').trim();
  v = v.replace(/^`+|`+$/g, '').trim();
  const md = v.match(/^\[([^\]]+)\]\([^)]+\)$/);
  if (md) v = md[1].trim();
  return v.replace(/\s+/g, ' ').trim();
}

function field(body, names) {
  const text = String(body || '');
  for (const n of names) {
    const re = new RegExp('^\\s*' + n + '[ \\t]*:[ \\t]*(.*)$', 'im');
    const m = text.match(re);
    if (m) {
      const v = stripValue(m[1]);
      if (v) return v;
    }
  }
  return '';
}

// Pull domain, token and optional registry id from a claim issue body.
// Accepts the pre-filled /claim.html text and both issue templates.
function parseClaim(body, title) {
  const text = String(body || '');
  let domain = field(text, ['Domain', 'Official email or domain for this place']);
  if (!domain) {
    const m = text.match(/our domain is:[ \t]*(\S+)/i);
    if (m) domain = stripValue(m[1]);
  }
  if (domain && domain.includes('@') && !domain.includes(' ')) domain = domain.split('@').pop();
  // a bare domain typed after "Domain:" may include a trailing period
  if (domain) domain = domain.replace(/[.,;]+$/, '').toLowerCase();

  let token = field(text, ['Token \\(from the claim page\\)', 'Token']);
  if (!token) {
    const m = text.match(/\b((?:opr|pr)-[A-Za-z0-9_-]{14,})\b/);
    if (m) token = m[1];
  }

  let entry_id = field(text, ['Place / registry entry \\(optional\\)', 'Registry (?:entry|id)', 'entry_id', 'Id']);
  if (entry_id && /^https?:\/\//i.test(entry_id)) {
    const m = entry_id.match(/\/p\/([^/]+)\/?/);
    if (m) entry_id = decodeURIComponent(m[1]);
  }
  if (!entry_id && title) {
    const m = String(title).match(/Claim this entry:\s*.+\(([^)]+)\)\s*$/i);
    if (m) entry_id = stripValue(m[1]);
  }
  if (entry_id && /^(n\/?a|none|optional|\(optional\))$/i.test(entry_id)) entry_id = '';

  return {
    domain: domain || null,
    token: token || null,
    entry_id: entry_id || null,
  };
}

function hostnameOf(urlOrHost) {
  if (!urlOrHost) return '';
  const s = String(urlOrHost).trim();
  try {
    const u = new URL(s.includes('://') ? s : 'https://' + s);
    return u.hostname.replace(/^www\./i, '').toLowerCase();
  } catch { return ''; }
}

// True when the claimed domain is the same site as a source or place URL
// (or a parent/subdomain of it). Used to decide if we can auto-supersede.
function domainRelated(domain, urlOrHost) {
  const a = String(domain || '').replace(/^www\./i, '').toLowerCase();
  const b = hostnameOf(urlOrHost);
  if (!a || !b) return false;
  return a === b || a.endsWith('.' + b) || b.endsWith('.' + a);
}

function findSeedEntry(dataDir, id) {
  if (!id) return null;
  try {
    const seed = JSON.parse(fs.readFileSync(path.join(dataDir, 'seed.json'), 'utf8'));
    return (seed.entries || []).find((e) => e.id === id) || null;
  } catch { return null; }
}

function attemptLines(attempts) {
  return (attempts || []).map((a) => `- **${a.method}**: ${a.detail || (a.ok ? 'ok' : 'failed')}${a.url ? ` (${a.url})` : ''}`).join('\n');
}

function missingList(parsed) {
  const missing = [];
  if (!parsed.domain) missing.push('the domain you control (a line starting with `Domain:`)');
  if (!parsed.token) missing.push('the verification token from ' + CLAIM_URL + ' (a line starting with `Token:`)');
  return missing;
}

function formatFailure({ parsed, reason, verification, file, extra }) {
  const missing = missingList(parsed || {});
  if (missing.length) {
    return [
      'Thanks for writing in. To publish your own `place-rules.json` as an **owner-verified** registry entry, we still need:',
      '',
      ...missing.map((m) => `- ${m}`),
      '',
      parsed && parsed.entry_id ? `We already have the registry id \`${parsed.entry_id}\`.` : '',
      `The easiest path is ${CLAIM_URL}${parsed && parsed.entry_id ? ('?id=' + parsed.entry_id) : ''}: it generates a token, shows the well-known / meta / DNS steps, and prefills a claim.`,
      'You can edit this issue with those fields and we will re-check automatically.',
    ].filter((l) => l !== '').join('\n');
  }
  const lines = [
    `Thanks for the claim. We were not able to verify domain control for \`${parsed.domain}\` yet.`,
    '',
    reason || 'Here is what we checked:',
    '',
    attemptLines(verification && verification.attempts),
  ];
  if (file) {
    lines.push('');
    if (file.ok) lines.push(`The rules file at ${file.url} was found and is valid. To finish, put the claim token in that file as \`"verification": {"method": "well-known", "token": "<your token>"}\`, or add the meta tag or DNS TXT record described at ${CLAIM_URL}, then edit this issue and we will re-check.`);
    else lines.push(`We also need a valid \`/.well-known/place-rules.json\` (the rules always come from that file, even when the meta tag or DNS record proves the domain). ${file.url ? file.url + ' — ' : ''}${file.error || 'missing or invalid'}. See the ${SPEC_URL} and the generator at https://openplacerules.org/new/.`);
  }
  if (extra) { lines.push(''); lines.push(extra); }
  lines.push('', 'You can edit this issue when the file or DNS record is in place and we will try again.');
  return lines.join('\n');
}

function formatSuccess({ domain, method, fileUrl, ownerId, supersedes, supersedeNeedsReview, seedEntry }) {
  const lines = [
    `Verified: we confirmed control of \`${domain}\` via **${method}**, and the file at ${fileUrl} is a valid \`place-rules/0.1\` document.`,
    '',
    `This will be imported as the owner-verified entry \`${ownerId}\`.`,
  ];
  if (supersedes && supersedes.length) {
    if (supersedeNeedsReview) {
      const src = seedEntry && seedEntry.source && seedEntry.source.url;
      lines.push('');
      lines.push(`You asked to supersede the reported entry \`${supersedes.join(', ')}\`${src ? ` (source: ${src})` : ''}. That source is not clearly on the same domain, so a maintainer will confirm the link before this is merged. The owner file itself will still be added.`);
    } else {
      lines.push(`It will supersede the reported ${supersedes.length === 1 ? 'entry' : 'entries'} \`${supersedes.join('`, `')}\` once the pull request is merged.`);
    }
  }
  lines.push('', 'A pull request will be opened (or updated) with the imported owner file. After it is merged, the place appears on the site and in [`/data/stats.json`](https://openplacerules.org/data/stats.json) as owner-verified.');
  return lines.join('\n');
}

function writeOwnerRecord(dataDir, rec) {
  const dir = path.join(dataDir, 'owner');
  fs.mkdirSync(dir, { recursive: true });
  const dest = path.join(dir, rec.domain + '.json');
  const tmp = dest + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(rec, null, 2) + '\n');
  fs.renameSync(tmp, dest);
  return dest;
}

async function processClaim({ body, title, dataDir, doImport, verifyOpts }) {
  const parsed = parseClaim(body, title);
  const missing = missingList(parsed);
  if (missing.length) {
    return {
      ok: false, status: 'needs-info', parsed, missing: missing,
      comment: formatFailure({ parsed }),
      labels_add: ['needs-info'], labels_remove: ['verified'],
    };
  }

  let domain;
  try { domain = verify.normalizeDomain(parsed.domain); }
  catch (e) {
    return {
      ok: false, status: 'needs-info', parsed,
      comment: formatFailure({ parsed: { ...parsed, domain: parsed.domain }, reason: 'The domain could not be used: ' + e.message + '.', verification: { attempts: [] } }),
      labels_add: ['needs-info'], labels_remove: ['verified'],
    };
  }
  if (!TOKEN_RE.test(parsed.token)) {
    return {
      ok: false, status: 'needs-info', parsed, domain,
      comment: formatFailure({
        parsed: { ...parsed, domain },
        reason: 'The token is not in the expected form (16–128 characters of `A-Za-z0-9_-`, usually starting with `opr-` or `pr-`). Please copy it from ' + CLAIM_URL + '.',
        verification: { attempts: [] },
      }),
      labels_add: ['needs-info'], labels_remove: ['verified'],
    };
  }

  const opts = verifyOpts || {};
  const verification = await verify.verifyDomain(domain, parsed.token, opts);
  const file = await verify.fetchRulesFile(domain, opts);

  if (!verification.ok || !file.ok) {
    let reason;
    if (verification.ok && !file.ok) {
      reason = `Domain control via **${verification.method}** succeeded, but we also need a valid \`/.well-known/place-rules.json\` (the rules are always read from that file).`;
    } else {
      reason = 'Here is what we checked:';
    }
    return {
      ok: false, status: 'needs-info', parsed, domain, method: verification.method || null,
      verification, file,
      comment: formatFailure({ parsed: { ...parsed, domain }, reason, verification, file }),
      labels_add: ['needs-info'], labels_remove: ['verified'],
    };
  }

  const seedEntry = findSeedEntry(dataDir, parsed.entry_id);
  const prevPath = path.join(dataDir, 'owner', domain + '.json');
  const prev = fs.existsSync(prevPath) ? store.readJson(prevPath, {}) : {};
  const requested = parsed.entry_id && seedEntry ? parsed.entry_id : null;
  const unknownId = parsed.entry_id && !seedEntry ? parsed.entry_id : null;
  let supersedeNeedsReview = false;
  let proposed = [];
  if (requested) {
    const src = seedEntry.source && seedEntry.source.url;
    supersedeNeedsReview = !domainRelated(domain, src);
    if (supersedeNeedsReview) proposed = [requested];
  }
  // Only auto-supersede when the domain clearly belongs to the reported entry.
  // Mismatched ids stay in proposed_supersedes for a maintainer to confirm,
  // so a premature merge cannot drop an unrelated place from the registry.
  const auto = requested && !supersedeNeedsReview ? [requested] : [];
  const supersedes = [...new Set([...(prev.supersedes || []), ...auto])];

  const rec = {
    ...prev,
    domain,
    method: verification.method,
    verified_at: prev.verified_at || new Date().toISOString(),
    fetched_at: new Date().toISOString(),
    file_url: file.url,
    file: file.doc,
    stale: false,
    last_error: null,
    supersedes,
    proposed_supersedes: proposed,
    country: prev.country || (seedEntry && seedEntry.country) || null,
    via: 'github-issue-claim',
  };

  const ownerId = 'owner-' + domain.replace(/[^a-z0-9]+/g, '-');
  const ownerRel = path.join('data', 'owner', domain + '.json');
  if (doImport) writeOwnerRecord(dataDir, rec);

  let extra = '';
  if (unknownId) extra = `The registry id \`${unknownId}\` was not found in the seed, so nothing was marked as superseded. If you meant a different entry, edit the issue with the id from the place page.`;

  const result = {
    ok: true,
    status: 'verified',
    parsed,
    domain,
    method: verification.method,
    file_url: file.url,
    owner_id: ownerId,
    owner_file: ownerRel,
    supersedes,
    proposed_supersedes: proposed,
    supersede_needs_review: supersedeNeedsReview,
    unknown_entry_id: unknownId,
    comment: formatSuccess({
      domain, method: verification.method, fileUrl: file.url, ownerId,
      supersedes: supersedeNeedsReview ? proposed : supersedes,
      supersedeNeedsReview, seedEntry,
    }) + (extra ? '\n\n' + extra : ''),
    labels_add: ['verified'],
    labels_remove: ['needs-info'],
  };
  return result;
}

function parseArgs(argv) {
  const args = { dataDir: path.join(__dirname, '..', 'data'), doImport: false, resultFile: null, body: null, title: '', verifyOpts: {} };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i];
    if (a === '--data-dir') args.dataDir = path.resolve(next());
    else if (a === '--import') args.doImport = true;
    else if (a === '--result-file') args.resultFile = next();
    else if (a === '--body-file') args.body = fs.readFileSync(next(), 'utf8');
    else if (a === '--title') args.title = next();
    else if (a === '--issue-json') {
      const j = JSON.parse(fs.readFileSync(next(), 'utf8'));
      args.body = j.body || '';
      args.title = j.title || args.title;
    } else if (a === '--domain-map') args.verifyOpts.domainMap = JSON.parse(next());
    else if (a === '--help' || a === '-h') args.help = true;
    else throw new Error('unknown argument: ' + a);
  }
  return args;
}

async function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (args.help || args.body == null) {
    console.error('Usage: node scripts/verify_claim.js --body-file FILE|--issue-json FILE [--title TEXT] [--data-dir data] [--import] [--result-file out.json]');
    process.exit(args.help ? 0 : 2);
  }
  const result = await processClaim({
    body: args.body, title: args.title, dataDir: args.dataDir,
    doImport: args.doImport, verifyOpts: args.verifyOpts,
  });
  const out = JSON.stringify(result, null, 2);
  if (args.resultFile) fs.writeFileSync(args.resultFile, out + '\n');
  else console.log(out);
  // Always exit 0 after a handled claim (success or needs-info). The workflow
  // reads the result file. Programming errors still throw.
  return result;
}

if (require.main === module) {
  main().catch((e) => { console.error(e); process.exit(1); });
}

module.exports = { parseClaim, processClaim, domainRelated, hostnameOf, formatFailure, formatSuccess, main };
