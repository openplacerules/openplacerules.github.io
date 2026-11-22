#!/usr/bin/env node
// Local mock websites for testing verification and crawling. Each fake domain lives under a path prefix:
//   http://127.0.0.1:<port>/<domain>/.well-known/place-rules.json   and   http://127.0.0.1:<port>/<domain>/
// Domains use the reserved .test TLD and fictional content. They are TEST FIXTURES, never registry data.
const http = require('http');
const fs = require('fs');
const path = require('path');

function defaultSites(tokens = {}) {
  const fx = (f) => JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'tests', 'fixtures', f), 'utf8'));
  const cafe = fx('cafe.test.json'); if (tokens['cafe.test']) cafe.verification = { method: 'well-known', token: tokens['cafe.test'] };
  return {
    'cafe.test': { wellKnown: cafe, home: '<html><head><title>Cafe</title></head><body>demo</body></html>' },
    'museum.test': { wellKnown: fx('museum.test.json'), home: `<html><head><meta name="place-rules-verification" content="${tokens['museum.test'] || 'none'}"></head></html>` },
    'broken.test': { wellKnownRaw: '{"spec":"place-rules/0.1","rules":{"drones":"maybe"}}', home: '<html></html>' },
    'gone.test': { home: '<html></html>' },
  };
}

function start(sites, port = 0) {
  const srv = http.createServer((req, res) => {
    const [, domain, ...rest] = decodeURIComponent(new URL(req.url, 'http://x').pathname).split('/');
    const sub = '/' + rest.join('/');
    const s = sites[domain];
    if (!s) { res.writeHead(404); return res.end('no such site'); }
    if (sub === '/.well-known/place-rules.json' && (s.wellKnown || s.wellKnownRaw)) {
      res.writeHead(200, { 'Content-Type': 'application/json' }); return res.end(s.wellKnownRaw || JSON.stringify(s.wellKnown));
    }
    if (sub === '/' && s.home) { res.writeHead(200, { 'Content-Type': 'text/html' }); return res.end(s.home); }
    res.writeHead(404); res.end('not found');
  });
  return new Promise((r) => srv.listen(port, '127.0.0.1', () => {
    const base = `http://127.0.0.1:${srv.address().port}`;
    r({ base, port: srv.address().port, map: Object.fromEntries(Object.keys(sites).map((d) => [d, `${base}/${d}`])), sites, close: () => srv.close() });
  }));
}
if (require.main === module) {
  start(defaultSites({ 'cafe.test': process.env.CAFE_TOKEN, 'museum.test': process.env.MUSEUM_TOKEN }), Number(process.argv[2] || 9100))
    .then((m) => console.log(`mock sites on ${m.base}\nexport PLACE_RULES_DEV_MAP='${JSON.stringify(m.map)}'`));
}
module.exports = { start, defaultSites };
