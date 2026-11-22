// R13: hosted read-only API for a free serverless tier (Cloudflare Workers module syntax; also runs in Node 18+ for tests).
// GET /api/check?lat=&lng=&activity=  GET /api/places?q=&country=&activity=  GET /api/places/:id  GET /api/stats
// Reads the published dataset from the static site (DATA_URL), caches it in memory for 10 minutes, CORS open, no logging of locations.
// scripts/build_worker.js inlines lib/core.js into deploy/worker/dist/worker.js. Nothing is deployed by this repo.
'use strict';
function makeHandler(core, opts) {
  const ttl = (opts && opts.ttlMs) || 600000; let cache = null, at = 0;
  const cors = { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'GET, OPTIONS', 'content-type': 'application/json; charset=utf-8', 'cache-control': 'public, max-age=300' };
  // Every answer carries the shared disclaimer + terms link (core.withNotice, same helper as server.js and the MCP server).
  const json = (body, status) => new Response(JSON.stringify(core.withNotice ? core.withNotice(body) : body, null, 2), { status: status || 200, headers: cors });
  async function data(env) {
    if (cache && Date.now() - at < ttl) return cache;
    const r = await (opts.fetch || fetch)((env && env.DATA_URL) || opts.dataUrl);
    if (!r.ok) throw new Error('dataset unavailable'); cache = await r.json(); at = Date.now(); return cache;
  }
  return async function handle(request, env) {
    const u = new URL(request.url), p = u.pathname.replace(/\/+$/, '') || '/', q = Object.fromEntries(u.searchParams);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method !== 'GET') return json({ error: 'read-only API: GET only' }, 405);
    try {
      const d = await data(env), entries = d.entries;
      if (p === '/api/check') return json(core.check(entries, { lat: q.lat, lng: q.lng, activity: q.activity || 'recording', date: q.date }));
      if (p === '/api/places') { const r = core.search(entries, { q: q.q, activity: q.activity, country: q.country, value: q.value, verified: q.verified, limit: Math.min(Number(q.limit) || 200, 500) }); return json({ count: r.length, entries: r }); } // same shape as server.js
      if (p.startsWith('/api/places/')) { const e = entries.find((x) => x.id === decodeURIComponent(p.slice(12))); return e ? json(e) : json({ error: 'not found' }, 404); }
      if (p === '/api/stats') return json(core.stats(entries));
      if (p === '/api' || p === '/') return json({ name: 'OpenPlaceRules API', endpoints: ['/api/check?lat=&lng=&activity=', '/api/places', '/api/places/:id', '/api/stats'], license: 'data ODbL-1.0', note: 'Not legal advice. Unknown never means allowed.' });
      return json({ error: 'not found' }, 404);
    } catch (e) { return json({ error: String(e.message || e) }, /required|must be/.test(String(e.message)) ? 400 : 503); }
  };
}
if (typeof module === 'object' && module.exports) module.exports = { makeHandler };
