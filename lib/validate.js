// Dependency-free validator for place-rules/0.1 files. Mirrors spec/place-rules.schema.json
// (the Python test suite cross-checks both against the same fixtures).
const ACTS = ['camera_glasses', 'recording', 'ai_capture', 'robots', 'drones'];
const VALS = ['allowed', 'restricted', 'prohibited'];
const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const isObj = (x) => x && typeof x === 'object' && !Array.isArray(x);
const isNum = (x) => typeof x === 'number' && Number.isFinite(x);

function validate(doc) {
  const errors = [];
  const err = (p, m) => errors.push(`${p}: ${m}`);
  const only = (o, keys, p) => { for (const k of Object.keys(o)) if (!keys.includes(k)) err(p, `unknown property "${k}"`); };
  const ruleset = (r, p) => {
    if (!isObj(r)) return err(p, 'must be an object');
    only(r, ACTS, p);
    for (const [k, v] of Object.entries(r)) if (ACTS.includes(k) && !VALS.includes(v)) err(`${p}.${k}`, `must be one of ${VALS.join(', ')}`);
  };
  const geometry = (g, p) => {
    if (!isObj(g)) return err(p, 'must be an object');
    if (g.type === 'circle') {
      only(g, ['type', 'center', 'radius_m'], p);
      if (!Array.isArray(g.center) || g.center.length !== 2 || !isNum(g.center[0]) || !isNum(g.center[1]) || Math.abs(g.center[0]) > 90 || Math.abs(g.center[1]) > 180) err(`${p}.center`, 'must be [lat, lng]');
      if (!isNum(g.radius_m) || g.radius_m <= 0) err(`${p}.radius_m`, 'must be a positive number');
    } else if (g.type === 'Polygon' || g.type === 'MultiPolygon') {
      const polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
      if (!Array.isArray(polys) || !polys.length) return err(`${p}.coordinates`, 'must be an array');
      for (const poly of polys) {
        if (!Array.isArray(poly) || !poly.length) { err(`${p}.coordinates`, 'bad polygon'); continue; }
        for (const ring of poly) {
          if (!Array.isArray(ring) || ring.length < 4) { err(`${p}.coordinates`, 'ring needs >= 4 positions'); continue; }
          if (ring.some((pt) => !Array.isArray(pt) || !isNum(pt[0]) || !isNum(pt[1]) || Math.abs(pt[0]) > 180 || Math.abs(pt[1]) > 90)) err(`${p}.coordinates`, 'positions must be [lng, lat]');
          const a = ring[0], b = ring[ring.length - 1];
          if (a && b && (a[0] !== b[0] || a[1] !== b[1])) err(`${p}.coordinates`, 'ring must be closed');
        }
      }
    } else err(`${p}.type`, 'must be circle, Polygon or MultiPolygon');
  };
  const dateTime = (v, p) => { if (typeof v !== 'string' || isNaN(Date.parse(v))) err(p, 'must be an ISO date-time'); };
  const uri = (v, p) => { try { new URL(v); } catch { err(p, 'must be a URI'); } };
  const str = (v, p, max) => { if (typeof v !== 'string') err(p, 'must be a string'); else if (max && v.length > max) err(p, `max ${max} chars`); };

  if (!isObj(doc)) return { valid: false, errors: ['$: must be a JSON object'] };
  only(doc, ['spec', 'updated', 'expires', 'place', 'rules', 'zones', 'conditions', 'exceptions', 'contact', 'source', 'verification'], '$');
  for (const k of ['spec', 'place', 'rules', 'updated']) if (!(k in doc)) err('$', `missing required "${k}"`);
  if ('spec' in doc && doc.spec !== 'place-rules/0.1') err('$.spec', 'must be "place-rules/0.1"');
  if ('updated' in doc) dateTime(doc.updated, '$.updated');
  if ('expires' in doc) dateTime(doc.expires, '$.expires');
  if ('place' in doc) {
    const pl = doc.place;
    if (!isObj(pl)) err('$.place', 'must be an object');
    else {
      only(pl, ['name', 'url', 'address', 'geometry', 'timezone'], '$.place');
      if (!('name' in pl)) err('$.place', 'missing required "name"'); else str(pl.name, '$.place.name');
      if ('url' in pl) uri(pl.url, '$.place.url');
      if ('address' in pl) str(pl.address, '$.place.address');
      if ('timezone' in pl) str(pl.timezone, '$.place.timezone');
      if ('geometry' in pl) geometry(pl.geometry, '$.place.geometry');
    }
  }
  if ('rules' in doc) ruleset(doc.rules, '$.rules');
  if ('zones' in doc) {
    if (!Array.isArray(doc.zones)) err('$.zones', 'must be an array');
    else doc.zones.forEach((z, i) => {
      const p = `$.zones[${i}]`;
      if (!isObj(z)) return err(p, 'must be an object');
      only(z, ['name', 'geometry', 'hours', 'rules', 'note'], p);
      if (!('name' in z)) err(p, 'missing required "name"'); else str(z.name, `${p}.name`);
      if (!('rules' in z)) err(p, 'missing required "rules"'); else ruleset(z.rules, `${p}.rules`);
      if ('geometry' in z) geometry(z.geometry, `${p}.geometry`);
      if ('note' in z) str(z.note, `${p}.note`);
      if ('hours' in z) {
        if (!Array.isArray(z.hours)) err(`${p}.hours`, 'must be an array');
        else z.hours.forEach((h, j) => {
          const hp = `${p}.hours[${j}]`;
          if (!isObj(h)) return err(hp, 'must be an object');
          only(h, ['days', 'from', 'to'], hp);
          if (!Array.isArray(h.days) || !h.days.length || h.days.some((d) => !DAYS.includes(d))) err(`${hp}.days`, 'must be non-empty list of mon..sun');
          if (!/^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(h.from || '')) err(`${hp}.from`, 'must be HH:MM');
          if (!/^([01][0-9]|2[0-4]):[0-5][0-9]$/.test(h.to || '')) err(`${hp}.to`, 'must be HH:MM');
        });
      }
    });
  }
  if ('conditions' in doc) str(doc.conditions, '$.conditions', 500);
  if ('exceptions' in doc) str(doc.exceptions, '$.exceptions', 500);
  if ('source' in doc) uri(doc.source, '$.source');
  if ('contact' in doc) {
    if (!isObj(doc.contact)) err('$.contact', 'must be an object');
    else {
      only(doc.contact, ['email', 'url'], '$.contact');
      if ('email' in doc.contact && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(doc.contact.email)) err('$.contact.email', 'must be an email');
      if ('url' in doc.contact) uri(doc.contact.url, '$.contact.url');
    }
  }
  if ('verification' in doc) {
    const v = doc.verification;
    if (!isObj(v)) err('$.verification', 'must be an object');
    else {
      only(v, ['method', 'token'], '$.verification');
      if ('method' in v && !['well-known', 'meta', 'dns'].includes(v.method)) err('$.verification.method', 'must be well-known, meta or dns');
      if ('token' in v && !/^[A-Za-z0-9_-]{16,128}$/.test(v.token)) err('$.verification.token', 'must be 16-128 chars of A-Za-z0-9_-');
    }
  }
  return { valid: errors.length === 0, errors };
}
module.exports = { validate };
