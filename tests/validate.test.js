const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { validate } = require('../lib/validate');
const ex = path.join(__dirname, '..', 'spec', 'examples');

test('all spec examples and fixtures are valid', () => {
  for (const f of fs.readdirSync(ex)) assert.deepEqual(validate(JSON.parse(fs.readFileSync(path.join(ex, f)))).errors, [], f);
  for (const f of ['cafe.test.json', 'museum.test.json']) assert.ok(validate(require('./fixtures/' + f)).valid, f);
});

const base = () => ({ spec: 'place-rules/0.1', updated: '2026-11-21T00:00:00Z', place: { name: 'x' }, rules: { drones: 'prohibited' } });
const bad = {
  'unknown activity value': (d) => { d.rules.drones = 'maybe'; },
  'unknown activity key': (d) => { d.rules.teleport = 'allowed'; },
  'missing place name': (d) => { delete d.place.name; },
  'wrong spec version': (d) => { d.spec = 'place-rules/9.9'; },
  'open polygon ring': (d) => { d.place.geometry = { type: 'Polygon', coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1]]] }; },
  'lat/lng out of range': (d) => { d.place.geometry = { type: 'circle', center: [95, 0], radius_m: 10 }; },
  'bad hours': (d) => { d.zones = [{ name: 'z', rules: {}, hours: [{ days: ['someday'], from: '25:00', to: '10:00' }] }]; },
  'short token': (d) => { d.verification = { method: 'dns', token: 'abc' }; },
  'extra top-level field': (d) => { d.foo = 1; },
};
for (const [name, mut] of Object.entries(bad)) test('rejects: ' + name, () => { const d = base(); mut(d); assert.equal(validate(d).valid, false); });
