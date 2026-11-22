// Pure query logic shared by the Node server, the MCP server and the static (browser) build. No dependencies.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.PlaceRulesCore = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  const ACTIVITIES = ['camera_glasses', 'recording', 'ai_capture', 'robots', 'drones'];
  const VALUES = ['allowed', 'restricted', 'prohibited'];
  const RANK = { allowed: 1, restricted: 2, prohibited: 3 };
  // Fallback reach for entries that only have a point (no circle/polygon).
  const DEFAULT_REACH_M = { venue: 1000, zones: 1000, radius: 0, multi_site: 30000, jurisdiction: 40000, organization: 0 };

  function haversine(lat1, lng1, lat2, lng2) {
    const R = 6371000, toR = (d) => (d * Math.PI) / 180;
    const dLat = toR(lat2 - lat1), dLng = toR(lng2 - lng1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toR(lat1)) * Math.cos(toR(lat2)) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(a));
  }
  // Ray casting on a GeoJSON ring of [lng, lat].
  function inRing(lng, lat, ring) {
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [xi, yi] = ring[i], [xj, yj] = ring[j];
      if ((yi > lat) !== (yj > lat) && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  }
  function inPolygon(lng, lat, rings) { // first ring = outer, rest = holes
    if (!inRing(lng, lat, rings[0])) return false;
    for (let k = 1; k < rings.length; k++) if (inRing(lng, lat, rings[k])) return false;
    return true;
  }
  // Does geometry contain the point? Returns {hit, distance_m, method}.
  function geometryHit(geom, lat, lng) {
    if (!geom) return null;
    if (geom.type === 'circle') {
      const d = haversine(lat, lng, geom.center[0], geom.center[1]);
      return { hit: d <= geom.radius_m, distance_m: Math.round(d), method: 'circle' };
    }
    if (geom.type === 'Polygon') return { hit: inPolygon(lng, lat, geom.coordinates), distance_m: 0, method: 'polygon' };
    if (geom.type === 'MultiPolygon') return { hit: geom.coordinates.some((p) => inPolygon(lng, lat, p)), distance_m: 0, method: 'polygon' };
    return null;
  }

  function isOwner(e) { return /^verified/.test(e.verification || ''); }

  // Lifecycle state of an entry on a given date (YYYY-MM-DD).
  function lifecycle(e, today) {
    today = today || new Date().toISOString().slice(0, 10);
    if (e.stale) return 'stale';
    if (e.expires && e.expires < today) return 'expired';
    if (e.effective_from && e.effective_from > today) return 'not_yet_in_force';
    if (e.status === 'starts_soon' && (!e.effective_from || e.effective_from > today)) return 'not_yet_in_force';
    if (e.temporary) return 'temporary';
    return 'in_force';
  }

  function search(entries, { q = '', activity, country, value, verified, limit = 200 } = {}) {
    const terms = String(q).toLowerCase().split(/\s+/).filter(Boolean);
    return entries.filter((e) => {
      const hay = [e.id, e.name, e.summary, e.kind, e.country, e.region, e.source && e.source.publisher].join(' ').toLowerCase();
      if (!terms.every((t) => hay.includes(t))) return false;
      if (activity && !e.rules[activity]) return false;
      if (value && activity && e.rules[activity] !== value) return false;
      if (value && !activity && !Object.values(e.rules).includes(value)) return false;
      if (country && String(e.country).toLowerCase() !== String(country).toLowerCase()) return false;
      if (verified === 'true' || verified === true) { if (!isOwner(e)) return false; }
      return true;
    }).slice(0, Number(limit) || 200);
  }

  // "Can I <activity> here?" Owner-verified entries override reported ones; expired/not-yet entries are listed but don't decide.
  function check(entries, { lat, lng, activity = 'recording', date } = {}) {
    lat = Number(lat); lng = Number(lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) throw new Error('lat and lng are required numbers');
    if (!ACTIVITIES.includes(activity)) throw new Error('activity must be one of ' + ACTIVITIES.join(', '));
    const today = date || new Date().toISOString().slice(0, 10);
    const matches = [];
    for (const e of entries) {
      if (!e.rules[activity]) continue;
      let m = geometryHit(e.geometry, lat, lng);
      let method = m && m.method;
      if (!m) {
        const L = e.location || {};
        if (L.lat == null) continue;
        const reach = L.radius_m || DEFAULT_REACH_M[e.scope] || 0;
        const d = haversine(lat, lng, L.lat, L.lng);
        m = { hit: d <= reach, distance_m: Math.round(d) }; method = 'near_point';
      }
      if (!m.hit) continue;
      matches.push({ e, distance_m: m.distance_m, method, state: lifecycle(e, today) });
    }
    const live = matches.filter((m) => m.state === 'in_force' || m.state === 'temporary');
    const owner = live.filter((m) => isOwner(m.e));
    const deciding = owner.length ? owner : live;
    deciding.sort((a, b) => RANK[b.e.rules[activity]] - RANK[a.e.rules[activity]] || a.distance_m - b.distance_m);
    const top = deciding[0];
    const order = (m) => (isOwner(m.e) ? 0 : 1);
    matches.sort((a, b) => order(a) - order(b) || RANK[b.e.rules[activity]] - RANK[a.e.rules[activity]] || a.distance_m - b.distance_m);
    let confidence = 'none';
    if (top) confidence = isOwner(top.e) ? 'high (verified by owner)'
      : top.method === 'near_point' && top.e.scope !== 'venue' && top.e.scope !== 'zones' ? 'low (location approximate)'
      : top.method === 'near_point' ? 'medium-low (near a reported venue point)'
      : 'medium (inside a mapped boundary; reported, unverified by owner)';
    return {
      query: { lat, lng, activity, date: today },
      answer: top ? top.e.rules[activity] : 'unknown',
      decided_by: top ? (owner.length ? 'owner_verified' : 'reported') : null,
      explanation: top ? `${top.e.name}: ${top.e.summary}`
        : 'No in-force rule in this registry covers this point. Unknown does not mean allowed; local law and on-site signs still apply.',
      confidence,
      matches: matches.map((m) => ({ id: m.e.id, name: m.e.name, value: m.e.rules[activity], state: m.state, match: m.method,
        distance_m: m.distance_m, scope: m.e.scope, zones: m.e.zones, source: m.e.source && m.e.source.url, verification: m.e.verification,
        superseded_by: m.e.superseded_by || undefined })),
      disclaimer: DISCLAIMER, terms: TERMS_URL,
    };
  }

  // Shown with every API / MCP answer (see legal/terms-of-use.md). Keep short: clients relay it to end users.
  const TERMS_URL = 'https://openplacerules.org/terms.html';
  const DISCLAIMER = 'Information only, not legal advice or permission. Reported entries come from public sources and are unverified by the place owner; unknown does not mean allowed. Law and on-site rules prevail. Terms: ' + TERMS_URL;
  function withNotice(obj) { return Object.assign({}, obj, { disclaimer: DISCLAIMER, terms: TERMS_URL }); }

  function stats(entries, today) {
    const by = {}; for (const a of ACTIVITIES) by[a] = entries.filter((e) => e.rules[a]).length;
    const life = {}; for (const e of entries) { const s = lifecycle(e, today); life[s] = (life[s] || 0) + 1; }
    return { count: entries.length, owner_verified: entries.filter(isOwner).length,
      with_coordinates: entries.filter((e) => e.location && e.location.lat != null).length,
      with_geometry: entries.filter((e) => e.geometry).length,
      countries: [...new Set(entries.map((e) => e.country))].sort(), by_activity: by, lifecycle: life };
  }
  return { ACTIVITIES, VALUES, RANK, haversine, inPolygon, geometryHit, lifecycle, isOwner, search, check, stats, DISCLAIMER, TERMS_URL, withNotice };
});
