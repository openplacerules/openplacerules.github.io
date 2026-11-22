# OpenPlaceRules — v0.1 (draft, revised 2026-11-21)

A tiny, robots.txt-style file that lets any place (a cafe, museum, school, court, park, shop) say in machine-readable form
whether **camera glasses, recording, AI capture, robots and drones** are allowed there.
Devices, apps and AI agents can read it before or on arrival: "can I record here?"

Status: draft for discussion. Nothing here is a law or a legal opinion; the file states the owner's house rules.

## 1. Where the file lives

```
https://<the place's own domain>/.well-known/place-rules.json
```

* Served as `application/json`, UTF-8, over HTTPS, under 64 KB.
* One file per domain. A chain with many sites may publish one file per site at
  `/.well-known/place-rules/<site-id>.json` and list them in the main file as `"sites": [...]` (reserved for v0.2).
* Places without a website can be listed in a registry (see section 7), marked unverified.

## 2. Minimal example

```json
{
  "spec": "place-rules/0.1",
  "updated": "2026-11-21T09:00:00+07:00",
  "place": { "name": "Example Cafe", "geometry": { "type": "circle", "center": [13.7563, 100.5018], "radius_m": 40 } },
  "rules": { "camera_glasses": "restricted", "recording": "restricted", "ai_capture": "prohibited", "drones": "prohibited" },
  "conditions": "Photos of your own table are fine. Do not record staff or other guests without consent.",
  "contact": { "email": "hello@cafe.example" }
}
```

More examples: `spec/examples/` (a museum with zones and evening hours, a school).
Formal schema: `spec/place-rules.schema.json` (JSON Schema 2020-12).

## 3. Activities

| key | covers |
|---|---|
| `camera_glasses` | wearing or using glasses or other wearables that have a camera or microphone |
| `recording` | taking photos, video or audio with any device (phone, camera, glasses) |
| `ai_capture` | sending live camera/microphone input to an AI (scene description, face recognition, live transcription) |
| `robots` | ground robots: delivery robots, humanoids, mobile service robots |
| `drones` | take-off, landing or flight of uncrewed aircraft |

## 4. Values

| value | meaning |
|---|---|
| `allowed` | permitted; normal law and courtesy still apply |
| `restricted` | permitted only under `conditions` (e.g. personal photos only, no flash, ask first) |
| `prohibited` | not permitted (subject to `exceptions`, e.g. approved medical/accessibility devices) |
| *(key omitted)* | **unspecified** — the place makes no claim. Readers MUST NOT treat omitted as allowed. |

## 5. Scope: whole place, zones and times

* `rules` = defaults for the whole place; `place.geometry` = where it applies:
  * circle: `{"type":"circle","center":[lat,lng],"radius_m":40}` (note: `center` is lat,lng for readability), or
  * GeoJSON `Polygon` / `MultiPolygon` with `[lng,lat]` positions and closed rings (first position = last; inner rings are holes).
  Use the smallest shape that is honest: a building footprint, a property line, an airspace circle.
* `zones[]` override the defaults for an area (`geometry` or just a `name` such as "Chapel"), a time (`hours`), or both.
* Resolution: the most specific matching zone wins; if several match equally, **the most restrictive value wins**
  (`prohibited` > `restricted` > `allowed`). `hours` use `place.timezone` (IANA).
* `expires` (optional): after this time readers should refetch and treat the file as stale.
  Use it for temporary rules (e.g. "no camera glasses during the conference, 3–5 June").

## 6. Contact, exceptions, source

* `contact.email` / `contact.url` — where to ask permission or report a problem.
* `exceptions` — plain text (max 500 chars).
* `source` — the human-readable policy page the file reflects.

## 7. Proving ownership (verification)

A registry marks an entry **verified by owner** only if the place's domain proves it, using one of:

1. **well-known** — the file itself is served from `https://<domain>/.well-known/place-rules.json`.
2. **meta tag** — the domain's home page contains
   `<meta name="place-rules-verification" content="<token>">`.
3. **DNS** — a TXT record `_place-rules.<domain>` with value `place-rules-verification=<token>`.

The token is issued by the registry (16–128 chars of `[A-Za-z0-9_-]`) and echoed in `verification.token`.
Everything else in a registry is **reported, unverified by owner** and must carry a source URL.

### 7.1 How a registry uses verification

* An owner-verified file **overrides** every reported entry for the same place (the registry keeps the reported ones as history).
* If the file later becomes unreachable or invalid, the registry marks it **stale** and answers "unknown", not the old rules.
* Meta tag and DNS only prove control of the domain. The rules themselves are always read from `/.well-known/place-rules.json`.

### 7.2 How a point query is answered ("can I record here?")

1. Collect entries whose geometry contains the point (circle: distance ≤ radius; polygon: point-in-polygon).
   Entries that only have a point fall back to a short reach (about 1 km for a venue) and are labelled low confidence.
2. Drop entries that are expired, not yet in force, or stale.
3. If any owner-verified entry matches, decide from those only; otherwise from reported entries.
4. Return the most restrictive matching value, with every match, its source and its verification status.

## 8. Versioning

* `spec` is `place-rules/<major>.<minor>`. Minor versions only add optional fields; readers MUST ignore unknown fields.
  A major bump may change meaning; readers that don't know the major version should treat all rules as unspecified.
* `updated` (required) is the time the owner last changed the rules. Registries keep history by `updated`.

## 9. Reader guidance (devices, apps, AI agents)

* Show the rule to the user, don't silently enforce it. A file is a statement of house rules, not a technical lock.
* Fail safe: if the file is missing, invalid or stale, say "unknown", not "allowed".
* Cache for at most 24 hours (or until `expires`).
* Law always overrides the file (e.g. national drone or privacy law). This spec does not encode law.

## 10. Why this shape

* Same mental model as `robots.txt` / `security.txt`: one obvious URL, owner-controlled, no account needed.
* Five keys and three values keep it writable by hand and readable by any device.
* Zones and hours cover the real cases seen in the seed data (e.g. Westminster Abbey's chapels and services,
  Royal Caribbean's casino/spa areas, the Taj Mahal's main mausoleum).
