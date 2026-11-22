// File-based local store: owner files, claims, community submissions. Data dir = $PLACE_RULES_DATA or ./data
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function dataDir() { return process.env.PLACE_RULES_DATA || path.join(__dirname, '..', 'data'); }
const p = (...a) => path.join(dataDir(), ...a);
function readJson(f, dflt) { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return dflt; } }
function writeJson(f, obj) { fs.mkdirSync(path.dirname(f), { recursive: true }); const tmp = f + '.tmp'; fs.writeFileSync(tmp, JSON.stringify(obj, null, 1)); fs.renameSync(tmp, f); }
const now = () => new Date().toISOString();

// ---- owner files (verified via claim, or self-published and crawled) ----
function ownerPath(domain) { return p('owner', domain + '.json'); }
function listOwners() {
  const d = p('owner'); if (!fs.existsSync(d)) return [];
  return fs.readdirSync(d).filter((f) => f.endsWith('.json')).map((f) => readJson(path.join(d, f), null)).filter(Boolean);
}
function saveOwner(rec) { writeJson(ownerPath(rec.domain), rec); return rec; }
function getOwner(domain) { return readJson(ownerPath(domain), null); }

// Convert an owner's place-rules file into a registry entry.
function centerOf(g) {
  if (!g) return [null, null];
  if (g.type === 'circle') return g.center;
  const ring = g.type === 'Polygon' ? g.coordinates[0] : g.coordinates[0][0];
  const n = ring.length - 1 || 1; let x = 0, y = 0;
  for (let i = 0; i < n; i++) { x += ring[i][0]; y += ring[i][1]; }
  return [y / n, x / n];
}
function ownerToEntry(rec) {
  const doc = rec.file;
  const g = doc.place.geometry || null;
  const [lat, lng] = centerOf(g);
  return {
    id: 'owner-' + rec.domain.replace(/[^a-z0-9]+/g, '-'),
    name: doc.place.name, kind: 'owner_published', scope: doc.zones && doc.zones.length ? 'zones' : 'venue',
    country: rec.country || null, region: null,
    location: { lat, lng, precision: g ? 'owner_geometry' : 'none', radius_m: g && g.type === 'circle' ? g.radius_m : null },
    geometry: g,
    rules: doc.rules,
    zones: (doc.zones || []).map((z) => ({ zone: z.name, ...z.rules, ...(z.hours ? { hours: z.hours } : {}), ...(z.geometry ? { geometry: z.geometry } : {}) })),
    summary: doc.conditions || 'Rules published by the place owner.',
    exceptions: doc.exceptions, contact: doc.contact,
    effective_or_reported_date: doc.updated, status: 'in_force', expires: doc.expires ? doc.expires.slice(0, 10) : null, temporary: false,
    source: { url: rec.file_url, publisher: rec.domain, type: 'owner', found_via: rec.via || null },
    verification: `verified by owner (${rec.method}, ${String(rec.verified_at).slice(0, 10)})`,
    supersedes: rec.supersedes || [], stale: !!rec.stale,
    retrieved: rec.fetched_at,
  };
}

// ---- claims ----
function listClaims() { return readJson(p('claims.json'), []); }
function saveClaims(c) { writeJson(p('claims.json'), c); }
function newToken() { return 'pr-' + crypto.randomBytes(12).toString('base64url'); }
function createClaim({ domain, entry_id, contact_email }) {
  const claims = listClaims();
  const c = { id: crypto.randomBytes(6).toString('hex'), domain, entry_id: entry_id || null, contact_email: contact_email || null,
    token: newToken(), status: 'pending', created: now(), attempts: [] };
  claims.push(c); saveClaims(claims); return c;
}
function getClaim(id) { return listClaims().find((c) => c.id === id) || null; }
function updateClaim(id, patch) {
  const claims = listClaims(); const i = claims.findIndex((c) => c.id === id); if (i < 0) return null;
  claims[i] = { ...claims[i], ...patch }; saveClaims(claims); return claims[i];
}

// ---- community submissions (moderated) ----
const QUEUE = () => p('moderation', 'queue.jsonl');
function listSubmissions() {
  if (!fs.existsSync(QUEUE())) return [];
  return fs.readFileSync(QUEUE(), 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
}
function writeSubmissions(list) { fs.mkdirSync(path.dirname(QUEUE()), { recursive: true }); fs.writeFileSync(QUEUE(), list.map((s) => JSON.stringify(s)).join('\n') + (list.length ? '\n' : '')); }
function addSubmission(s) {
  const rec = { id: crypto.randomBytes(6).toString('hex'), status: 'pending', submitted: now(), ...s };
  fs.mkdirSync(path.dirname(QUEUE()), { recursive: true });
  fs.appendFileSync(QUEUE(), JSON.stringify(rec) + '\n'); return rec;
}
function setSubmissionStatus(id, status, note) {
  const list = listSubmissions(); const s = list.find((x) => x.id === id); if (!s) return null;
  s.status = status; s.moderated = now(); if (note) s.moderator_note = note; writeSubmissions(list); return s;
}
function approvedCommunityEntries() {
  return listSubmissions().filter((s) => s.status === 'approved').map((s) => ({
    id: 'community-' + s.id, name: s.name, kind: s.kind || 'venue', scope: 'venue', country: s.country || null, region: s.region || null,
    location: { lat: s.lat ?? null, lng: s.lng ?? null, precision: s.lat != null ? 'submitted_point' : 'none', radius_m: null },
    geometry: null, rules: s.rules, zones: [], summary: s.summary,
    effective_or_reported_date: s.date || null, status: 'in_force', expires: null, temporary: false,
    source: { url: s.source_url, publisher: s.source_publisher || new URL(s.source_url).hostname, type: 'community-reported' },
    verification: 'reported (community, moderated), unverified by owner', retrieved: s.moderated,
  }));
}

module.exports = { dataDir, readJson, writeJson, listOwners, saveOwner, getOwner, ownerToEntry, listClaims, createClaim, getClaim, updateClaim,
  listSubmissions, addSubmission, setSubmissionStatus, approvedCommunityEntries };
