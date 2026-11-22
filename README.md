# OpenPlaceRules

Live site: **https://openplacerules.github.io**. Planned custom domain: **https://openplacerules.org** (not registered yet; see `docs/custom-domain.md`). Spec file path stays `/.well-known/place-rules.json`, spec id `place-rules/0.1`.

**Launch summary.** Camera glasses, AI assistants, delivery robots and drones are arriving faster than the rules for using them.
Courts, schools, pools, gyms, theatres, museums, parks and cities are already writing those rules, but only as PDFs, signs and news stories that no device can read.
OpenPlaceRules is an open, robots.txt-style file (`/.well-known/place-rules.json`) where any place can publish whether
camera glasses, recording, AI capture, robots and drones are **allowed / restricted / prohibited**, by zone and time.
Owners prove they control the place with a meta tag or a DNS record. Alongside the file there is a free public registry, a map, and an API and MCP server that AI agents and devices can ask:
*"Can I record here?"* The registry is seeded with 249 real rules taken from public sources (33 jurisdictions incl. the EU; 77 in Asia, 28 in Thailand; 221 from official sources).

> Every seed entry is **reported, unverified by owner** and links to its source; owner-verified files override them. Not legal advice.

## What's new in v0.2
* **Owner verification + "claim your place"** (`lib/verify.js`, `web/claim.html`, `POST /api/claims`, `POST /api/claims/:id/verify`):
  the owner proves domain control with the `verification.token` in `/.well-known/place-rules.json`, a `<meta name="place-rules-verification">` tag,
  or DNS TXT `_place-rules.<domain>`. Owner-verified entries override reported ones (the reported entry gets `superseded_by`). If the owner file later
  becomes unreachable the owner entry is marked stale and the answer is "unknown" rather than a guess (SPEC §7.1).
* **Crawler / refresher** (`scripts/crawl.js`): fetches owner files for domains in `data/crawl-domains.txt`, validates them, updates owner records,
  re-checks every source link (`data/link_check.json`), and writes `data/refresh-report.md` flagging expired, expiring (30 days), temporary,
  not-yet-in-force, review-due and broken-link entries. Its first real run caught Punjab's 30-day ban expiring; the 30-day extension was then verified and recorded.
* **Lifecycle fields**: `effective_from`, `expires`, `temporary`, `lifecycle_note`. Only in-force/temporary entries decide `check`.
* **Submissions** (`web/submit.html` → `POST /api/submissions` → `data/moderation/queue.jsonl`), moderated with `node scripts/moderate.js list|approve|reject`.
* **Geometry**: circle (`radius_m`) and GeoJSON Polygon/MultiPolygon in the spec, schema, `check` API and map (67 entries; jurisdiction boundaries from OpenStreetMap).
* **Seed 55 → 151**: Thailand (palaces, national parks, airports), Japan, Singapore, Hong Kong, Korea, Cambodia, India, Malaysia; 25 US state delivery-robot laws with boundaries; more drone and AI-capture rules.
* **Static edition** (`node scripts/build_static.js` → `dist/`): API-free site for free static hosting; the map runs `check()` in the browser.
* **Tests** for core, validator, verifier (mock HTTP + mock DNS), crawler, API (full claim flow), MCP, static build, plus a Python jsonschema cross-check.
* **Licences**: code MIT, spec CC-BY-4.0, data ODbL 1.0 (required by the OSM-derived boundaries); copyright © 2026 The OpenPlaceRules contributors. See `LICENSE`, `licenses/`, `data/ATTRIBUTION.md`.

## v0.4: growth layer (2026-11-22)
* `npm run site` = `build_static.js` + `build_growth.js` + `render_share_cards.js`, all into `dist/`.
* One indexable page per place (`/p/<id>/`: the search question as the title, the answer, the source, JSON-LD, a share card, LINE/X/WhatsApp share, badge, embed), 33 jurisdiction pages (`/c/<cc>/`), `/places/`, `/stats/`, `/changes/` + Atom `changes.xml`.
* Venue tools: `/new/` (place-rules.json generator with templates and validation), `/sign.html` (printable A4/A5/sticker door sign, EN/TH/NL, QR), static `/claim.html` and `/submit.html` (pre-filled GitHub issue), badges in `/badge/`, `/embed.js` widget.
* For agents and journalists: `/llms.txt`, `/llms-full.txt`, `/data/places.csv`, `/data/stats.json`, `/data/bundle-<date>.json`, and a deploy-ready read-only API worker (`deploy/worker/`, `node scripts/build_worker.js`).

## v0.3.1: rebrand to OpenPlaceRules and deployment prep (2026-11-22)
* Name **OpenPlaceRules**. Protocol identifiers are unchanged so existing files stay valid: `place-rules/0.1`, `/.well-known/place-rules.json`,
  `place-rules-verification` meta tag, `_place-rules.<domain>` TXT, MCP tool names. Schema `$id` is `https://openplacerules.org/spec/place-rules.schema.json`.
* `dist/` is deploy-ready: canonical + Open Graph/Twitter tags, favicons, `og.png`, robots.txt + sitemap.xml, 404.html,
  `spec/examples/` index, Cloudflare `_headers`. GitHub Pages deploys from `.github/workflows/pages.yml`. A `CNAME` file is not written until the custom domain is live (`WRITE_CNAME=1`; see `docs/custom-domain.md`).
* npm package **@openplacerules/mcp** (bin `openplacerules-mcp`) builds into `packages/mcp/` with `npm run mcp-package`. Its MCP Registry `server.json`
  (`org.openplacerules/mcp`) validates against the 2025-12-11 schema. Not published; see packages/mcp/PUBLISH.md.

## What's new in v0.3 (polish)
* **Official sources replace secondary ones** (secondary 59 → 28): Grand Palace and royal palaces now cite the Bureau of the Royal Household regulation B.E. 2567 itself
  (scanned PDF, clauses 11-12 read from the page images) and the palace's No Drone Zone notice; 22 of 25 US state robot laws and 4 California cities cite the
  official statute/agency/council page (verified to mention delivery devices; `research/dtw/`); Seoul entries cite Seoul's Hangang HQ and MOLIT's Drone One-Stop.
* **Official coordinates**: Thai (15) and Singapore (5) airport circles are centred on the aerodrome reference point from the official eAIPs (`scripts/aip_arp.py`,
  `research/aip/arp.json`; `location.coordinates_source`).
* **Japan 300 m vs 1,000 m resolved**: Act No. 47 of 2026 (in force 2026-07-14) amended the Drone Act to "about 1,000 m" (e-Gov current text; NPA notice). The NPA English
  facilities page still says 300 m and is out of date. All 8 airports MLIT designated (notice 2026-07-03, applied 2026-07-14) are in.
* **Punjab**: extension order issued 2026-11-19 for 30 days; `expires` 2026-12-18 is derived (official notification text not found online) and labelled as such.
* **+43 entries**: 20 FAA security TFRs with official circles/polygons and expiry dates (`scripts/faa_tfrs.py`), national drone rules (US, Canada, Australia, NZ, Taiwan,
  Hong Kong, EASA), 7 more Thai aerodromes, 5 Japanese airports, Seoul Hangang parks, PSAT/SAT School Day/AP exam rules.
* `tests/seed.test.js` (data invariants), `scripts/mcp_demo.js` (agent ↔ MCP demo).

## Commands
```bash
node server.js 8787                  # web + API at http://127.0.0.1:8787  (claim.html, submit.html, spec.html)
npm test                             # node --test tests/*.test.js && python3 tests/test_schema.py
CAFE_TOKEN=<token from claim> node scripts/mock-sites.js 8799   # fake owner sites (cafe.test, museum.test, broken.test, gone.test)
PLACE_RULES_DEV_MAP='{"cafe.test":"http://127.0.0.1:8799/cafe.test"}' node server.js 8787   # claim a mock domain locally
node scripts/crawl.js [--domains file] [--no-links] [--today YYYY-MM-DD]
node scripts/moderate.js list pending
python3 scripts/build_seed.py        # rebuild data/seed.json (Nominatim geocodes + boundaries, cached)
node scripts/build_static.js [outdir]
npm run site                         # static + growth pages + share cards into dist/
node scripts/build_worker.js         # read-only API bundle for a serverless host (not deployed)
node scripts/mcp_demo.js --out mcp-demo-transcript.md               # scripted agent ↔ MCP session
scripts/rdap_check.sh name.org ...   # read-only domain availability lookup
```
Tests and mock sites use `.test` domains and temporary data directories, never the real `data/`.

## What's in the box

| path | what |
|---|---|
| `SPEC.md` | the open spec: file location, five activities, three values, zones/hours, contact, ownership verification (well-known / meta tag / DNS TXT), versioning |
| `spec/place-rules.schema.json` | JSON Schema (2020-12) for the file |
| `spec/examples/*.json` | cafe, museum with zones and hours, school, park with polygon + circle zones (all validate against the schema) |
| `data/seed.json` | 249 seed entries (name, kind, scope, country/region, lat/lng + precision, rules, zones, summary, date, status, source URL/publisher/type, verification) |
| `data/link_check.json` | HTTP status of every source URL at build time |
| `scripts/seed_source.py`, `scripts/build_seed.py` | hand-curated entries → geocoded `seed.json` (OpenStreetMap Nominatim, cached in `data/geocode_cache.json`) |
| `lib/core.js` | search / check / lifecycle / geometry (Node + browser) |
| `lib/registry.js`, `lib/store.js` | merges owner, reported and approved community entries; claims, owner records, moderation queue |
| `lib/verify.js`, `lib/validate.js` | ownership verifier (well-known / meta / DNS TXT) and dependency-free file validator |
| `scripts/crawl.js`, `scripts/moderate.js`, `scripts/build_static.js` | refresher, moderation CLI, static build |
| `server.js` | local read-only server: web app + JSON API (Node, zero dependencies) |
| `web/index.html` | map (Leaflet, vendored) + searchable/filterable list + click-the-map "can I … here?" |
| `mcp-server.js` | minimal MCP server (stdio), zero dependencies |
| `screenshot-*.png` | headless-Chrome screenshots: world, Asia, US robot-law boundaries, static edition (Bangkok) |

## Run it

```bash
cd openplacerules   # your clone
node server.js 8787          # open http://127.0.0.1:8787
```
The map tiles load from tile.openstreetmap.org, so the background map needs internet. The data, list and API work offline.

### JSON API (read-only)
```
GET /api                                   endpoint list
GET /api/stats
GET /api/places?q=court&activity=camera_glasses&value=prohibited&country=US&limit=50
GET /api/places/<id>
GET /api/check?lat=41.9029&lng=12.4545&activity=recording
     → {"answer":"prohibited","explanation":"Sistine Chapel: …","confidence":"…","matches":[…]}
GET /data/seed.json                        full dataset
GET /spec/place-rules.schema.json
```
`activity` is one of `camera_glasses | recording | ai_capture | robots | drones`. `answer` is `allowed | restricted | prohibited | unknown`. **Unknown never means allowed.**

### MCP server (for AI agents)
```json
{ "mcpServers": { "openplacerules": { "command": "node", "args": ["/path/to/openplacerules/mcp-server.js"] } } }
// once published (not yet): { "mcpServers": { "openplacerules": { "command": "npx", "args": ["-y", "@openplacerules/mcp"] } } }
```
Tools: `check_place_rules(lat, lng, activity)`, `search_place_rules(q, activity, value, country, limit)`, `get_place_rule(id)`.

### Rebuild the seed
```bash
python3 scripts/build_seed.py     # re-geocodes only new queries (1 req/s, cached)
```

## Seed data: what's in it and how it was collected
* 249 entries in 33 jurisdictions (incl. the Vatican, Hong Kong, Taiwan and the EU): 221 from official sources, 28 secondary (labelled). By activity: camera glasses 38, recording 83, AI capture 6, robots 35, drones 128. 222 have coordinates; 100 have a circle or polygon.
* Entries without coordinates are organization- or nationwide (exam boards, park agencies, etc.) and appear in the list only.
* Smart-glasses entries were found via VR.org's tracker "Where Smart Glasses Are Banned" (updated Nov 15, 2026). Each links the primary or press source that the tracker cites.
  The landmark, drone and robot entries come from official pages (NPS, FAA TFRs, Royal Parks, English Heritage, National Trust, Vatican Museums, Westminster Abbey, Taj Mahal, Toronto, SF Public Works) or from secondary sources, labelled `source.type`.
* Coordinate `precision`: `official_coordinates` (FAA TFR centres), `landmark` (OSM geocode of the venue), `representative_point` (a city or HQ point for multi-site or jurisdiction rules).

## Known gaps
* No entry is owner-verified yet: the claim flow is tested only against local mock sites; `data/crawl-domains.txt` lists no real domains.
* 28 entries still rely on secondary sources (news reports of smart-glasses bans, Delivery Tech Watch for AR/IN/WV and 4 California cities, Angkor via EAC News 2023,
  Gimpo control-zone radius and the P73 radius via Seoul Window).
* Circles are approximations of official zones: Japan's 1,000 m is measured from the facility boundary (circle from a centre point under-covers); CAAS/OneMap and
  CAD Drone Map are authoritative; Hong Kong airport and Gimpo still use geocoded points. Two Thai palaces (Phu Phan, Thaksin) have no coordinates.
* FAA TFRs are a snapshot of 2026-11-21: only security TFRs lasting 30+ days; multi-area NOTAMs draw their first area only. Re-run `scripts/faa_tfrs.py` to refresh.
* Punjab's extension expiry (2026-12-18) is derived from "30 days from 19 Nov 2026"; the notification itself was not found online.
* Some source links return 403/500/503 to scripted requests (see `data/refresh-report.md`); they open in a browser.
* The static edition cannot accept reports or verify claims; the map tiles come from tile.openstreetmap.org, whose usage policy would need a different tile provider for real traffic.
* Not checked: trademarks (only quick web searches), .io domain availability, any legal review.
