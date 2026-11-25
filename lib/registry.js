// Loads seed + owner-verified + approved community entries and exposes query helpers.
const fs = require('fs');
const path = require('path');
const core = require('./core');
const store = require('./store');

function readSeed(dir) {
  return JSON.parse(fs.readFileSync(path.join(dir, 'seed.json'), 'utf8'));
}

function loadOwnerRecords(dir) {
  const d = path.join(dir, 'owner');
  if (!fs.existsSync(d)) return [];
  return fs.readdirSync(d).filter((f) => f.endsWith('.json')).map((f) => store.readJson(path.join(d, f), null)).filter(Boolean);
}

// Merge reported seed entries with owner-verified records. Owner files override
// reported entries listed in rec.supersedes (SPEC §7.1). community is optional.
function assemble(seed, ownerRecs, community = []) {
  const owners = ownerRecs.map(store.ownerToEntry);
  const superseded = {};
  for (const o of owners) for (const id of o.supersedes || []) superseded[id] = o.id;
  const reported = seed.entries.map((e) => (superseded[e.id] ? { ...e, superseded_by: superseded[e.id] } : e));
  const entries = [...owners, ...reported.filter((e) => !e.superseded_by), ...community];
  return {
    dataset: seed.dataset, version: seed.version, generated: seed.generated, notice: seed.notice,
    count: entries.length, entries, superseded: reported.filter((e) => e.superseded_by),
  };
}

function load() {
  return assemble(readSeed(store.dataDir()), store.listOwners(), store.approvedCommunityEntries());
}

// For the static site: seed + committed owner files only (no local moderation queue).
function loadPublished(dir) {
  return assemble(readSeed(dir), loadOwnerRecords(dir), []);
}

module.exports = {
  ACTIVITIES: core.ACTIVITIES, DISCLAIMER: core.DISCLAIMER, TERMS_URL: core.TERMS_URL, withNotice: core.withNotice,
  load, loadPublished, loadOwnerRecords, assemble,
  search: (db, q) => core.search(db.entries, q),
  get: (db, id) => db.entries.find((e) => e.id === id) || db.superseded.find((e) => e.id === id) || null,
  check: (db, q) => core.check(db.entries, q),
  stats: (db) => ({ ...core.stats(db.entries), superseded_reported: db.superseded.length }),
};
