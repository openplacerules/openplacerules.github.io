'use strict';
const test = require('node:test'), assert = require('node:assert');
const core = require('../lib/core.js');
const seed = require('../data/seed.json');
const E = seed.entries;
const byName = (re) => E.filter((e) => re.test(e.name));

test('seed: size and sourcing rules', () => {
  assert.ok(E.length >= 190, `entries ${E.length}`);
  for (const e of E) {
    assert.match(e.source.url, /^https?:\/\//, e.id);
    assert.ok(['official', 'secondary'].includes(e.source.type), e.id);
  }
  // Phase 3 replaced these secondary sources
  assert.ok(!E.some((e) => /xtour|phnom penh post/i.test(e.source.publisher)), 'XTOUR / Phnom Penh Post no longer primary sources');
});

test('seed: Thai and Singapore airport circles use official AIP reference points', () => {
  const th = byName(/9 km drone zone/);
  assert.ok(th.length >= 15);
  for (const e of th) {
    assert.strictEqual(e.location.precision, 'official_coordinates');
    assert.match(e.location.coordinates_source, /aip\.caat\.or\.th/);
    assert.strictEqual(e.geometry.radius_m, 9000);
  }
  for (const e of byName(/5 km drone zone/)) assert.match(e.location.coordinates_source, /aim-sg\.caas\.gov\.sg/);
});

test('seed: Japan Drone Act zones are 1,000 m (Act No. 47 of 2026)', () => {
  const jp = byName(/Drone Act zone/);
  assert.ok(jp.length >= 6);
  for (const e of jp) { assert.strictEqual(e.geometry.radius_m, 1000); assert.match(e.summary, /1,000 m/); }
});

test('seed: FAA TFR polygons and circles answer point checks', () => {
  const mc = byName(/Mcgregor — FAA security TFR/i)[0];
  assert.ok(mc && mc.geometry.type === 'Polygon');
  const inside = core.check(E, { lat: 31.415, lng: -97.465, activity: 'drones' });
  assert.strictEqual(inside.answer, 'prohibited');
  assert.ok(inside.matches.some((m) => m.id === mc.id));
  const far = core.check(E, { lat: 31.20, lng: -97.80, activity: 'drones' });
  assert.ok(!far.matches.some((m) => m.id === mc.id));
  const dl = core.check(E, { lat: 33.8121, lng: -117.9190, activity: 'drones' });
  assert.strictEqual(dl.answer, 'prohibited');
  assert.ok(dl.matches.some((m) => /Disneyland/.test(m.name)));
});

test('seed: Punjab extension end date is derived and labelled', () => {
  const p = byName(/^Punjab province/)[0];
  assert.strictEqual(p.expires, '2026-12-18');
  assert.match(p.lifecycle_note, /derived, not published/);
});
