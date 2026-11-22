const test = require('node:test');
const assert = require('node:assert');
const core = require('../lib/core');
const seed = require('../data/seed.json');

const sq = { type: 'Polygon', coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]] };
const mk = (o) => ({ id: o.id || 'x', name: o.id || 'x', summary: '', scope: 'venue', rules: {}, zones: [], location: {}, source: {}, ...o });

test('point in polygon and holes', () => {
  assert.equal(core.geometryHit(sq, 0.5, 0.5).hit, true);
  assert.equal(core.geometryHit(sq, 1.5, 0.5).hit, false);
  const holed = { type: 'Polygon', coordinates: [sq.coordinates[0], [[0.4, 0.4], [0.6, 0.4], [0.6, 0.6], [0.4, 0.6], [0.4, 0.4]]] };
  assert.equal(core.geometryHit(holed, 0.5, 0.5).hit, false);
  assert.equal(core.geometryHit({ type: 'MultiPolygon', coordinates: [sq.coordinates] }, 0.2, 0.2).hit, true);
});

test('circle radius', () => {
  const c = { type: 'circle', center: [13.68188, 100.74858], radius_m: 9000 };
  assert.equal(core.geometryHit(c, 13.70, 100.78).hit, true);
  assert.equal(core.geometryHit(c, 13.75, 100.50).hit, false);
});

test('owner-verified overrides reported, even if less strict', () => {
  const reported = mk({ id: 'r', geometry: sq, rules: { recording: 'prohibited' }, verification: 'reported, unverified by owner' });
  const owner = mk({ id: 'o', geometry: sq, rules: { recording: 'allowed' }, verification: 'verified by owner (dns, 2026-11-21)' });
  const r = core.check([reported, owner], { lat: 0.5, lng: 0.5, activity: 'recording' });
  assert.equal(r.answer, 'allowed'); assert.equal(r.decided_by, 'owner_verified');
  assert.equal(r.matches.length, 2);
  assert.equal(core.check([reported], { lat: 0.5, lng: 0.5, activity: 'recording' }).answer, 'prohibited');
});

test('most restrictive reported value wins', () => {
  const a = mk({ id: 'a', geometry: sq, rules: { drones: 'restricted' } });
  const b = mk({ id: 'b', geometry: sq, rules: { drones: 'prohibited' } });
  assert.equal(core.check([a, b], { lat: 0.5, lng: 0.5, activity: 'drones' }).answer, 'prohibited');
});

test('expired, not-yet and stale entries do not decide', () => {
  const exp = mk({ id: 'e', geometry: sq, rules: { camera_glasses: 'prohibited' }, expires: '2026-11-19' });
  const fut = mk({ id: 'f', geometry: sq, rules: { camera_glasses: 'prohibited' }, effective_from: '2027-01-27' });
  const stale = mk({ id: 's', geometry: sq, rules: { camera_glasses: 'allowed' }, stale: true, verification: 'verified by owner (well-known, 2026-01-01)' });
  const r = core.check([exp, fut, stale], { lat: 0.5, lng: 0.5, activity: 'camera_glasses', date: '2026-11-21' });
  assert.equal(r.answer, 'unknown'); assert.equal(r.matches.length, 3);
  assert.deepEqual(r.matches.map((m) => m.state).sort(), ['expired', 'not_yet_in_force', 'stale']);
  assert.equal(core.check([exp], { lat: 0.5, lng: 0.5, activity: 'camera_glasses', date: '2026-11-01' }).answer, 'prohibited');
});

test('bad input rejected', () => {
  assert.throws(() => core.check([], { lat: 'x', lng: 1 }));
  assert.throws(() => core.check([], { lat: 1, lng: 1, activity: 'teleport' }));
});

test('seed data sanity: 150+ entries, every entry sourced and marked unverified', () => {
  assert.ok(seed.entries.length >= 150, `only ${seed.entries.length}`);
  for (const e of seed.entries) {
    assert.match(e.source.url, /^https?:\/\//, e.id);
    assert.equal(e.verification, 'reported, unverified by owner');
    assert.ok(Object.keys(e.rules).length > 0, e.id);
    for (const v of Object.values(e.rules)) assert.ok(core.VALUES.includes(v), e.id);
  }
});

test('real seed queries', () => {
  const E = seed.entries;
  assert.equal(core.check(E, { lat: 13.70, lng: 100.78, activity: 'drones' }).answer, 'prohibited'); // near Suvarnabhumi
  assert.equal(core.check(E, { lat: 40.44, lng: -79.99, activity: 'robots' }).answer, 'restricted'); // Pittsburgh, PA state law polygon
  assert.equal(core.check(E, { lat: 31.52, lng: 74.35, activity: 'camera_glasses', date: '2026-11-21' }).answer, 'prohibited'); // Punjab order (extended)
  assert.equal(core.check(E, { lat: 31.52, lng: 74.35, activity: 'camera_glasses', date: '2027-01-15' }).answer, 'unknown'); // after estimated expiry
});
