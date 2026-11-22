// Loads seed + owner-verified + approved community entries and exposes query helpers.
const fs = require('fs');
const path = require('path');
const core = require('./core');
const store = require('./store');

function load() {
  const seedFile = path.join(store.dataDir(), 'seed.json');
  const seed = JSON.parse(fs.readFileSync(seedFile, 'utf8'));
  const owners = store.listOwners().map(store.ownerToEntry);
  const superseded = {};
  for (const o of owners) for (const id of o.supersedes || []) superseded[id] = o.id;
  const reported = seed.entries.map((e) => (superseded[e.id] ? { ...e, superseded_by: superseded[e.id] } : e));
  const entries = [...owners, ...reported.filter((e) => !e.superseded_by), ...store.approvedCommunityEntries()];
  return { version: seed.version, entries, superseded: reported.filter((e) => e.superseded_by) };
}
module.exports = {
  ACTIVITIES: core.ACTIVITIES, DISCLAIMER: core.DISCLAIMER, TERMS_URL: core.TERMS_URL, withNotice: core.withNotice, load,
  search: (db, q) => core.search(db.entries, q),
  get: (db, id) => db.entries.find((e) => e.id === id) || db.superseded.find((e) => e.id === id) || null,
  check: (db, q) => core.check(db.entries, q),
  stats: (db) => ({ ...core.stats(db.entries), superseded_reported: db.superseded.length }),
};
