"""Builds data/seed.json from scripts/seed_source*.py. Geocodes via OpenStreetMap Nominatim (cached)."""
import json, os, re, sys, time, urllib.parse, urllib.request, unicodedata
sys.path.insert(0, os.path.dirname(__file__))
import seed_source, seed_source_phase2, seed_source_phase3, seed_source_phase4, seed_source_phase5, seed_source_phase6
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(ROOT, "data", "geocode_cache.json")
BCACHE = os.path.join(ROOT, "data", "boundary_cache.json")
cache = json.load(open(CACHE)) if os.path.exists(CACHE) else {}
bcache = json.load(open(BCACHE)) if os.path.exists(BCACHE) else {}
UA = {"User-Agent": "OpenPlaceRules-seed/0.3 (+https://openplacerules.github.io; low volume)"}

def nominatim(params):
    url = "https://nominatim.openstreetmap.org/search?" + urllib.parse.urlencode({**params, "format": "json", "limit": 1})
    r = json.load(urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60))
    time.sleep(1.1)
    return r[0] if r else None

def geocode(q):
    if q in cache: return cache[q]
    try:
        r = nominatim({"q": q})
        cache[q] = {"lat": round(float(r["lat"]), 5), "lng": round(float(r["lon"]), 5), "osm_name": r["display_name"]} if r else None
    except Exception as e:
        print("geocode fail", q, e); return None
    json.dump(cache, open(CACHE, "w"), indent=1)
    return cache[q]

def rnd(c):  # round nested coordinate arrays to 4 dp (~11 m)
    return [rnd(x) for x in c] if isinstance(c[0], list) else [round(c[0], 4), round(c[1], 4)]

def boundary(q):
    """Simplified admin boundary polygon from OSM (GeoJSON, [lng,lat])."""
    if q in bcache: return bcache[q]
    big = "state=" in q or q in ("Thailand", "India", "Japan", "Malaysia", "United Kingdom", "Singapore") or "United States" in q and q.count(",") == 1
    try:
        params = dict(kv.split("=", 1) for kv in q.split("|")) if "=" in q else {"q": q}
        r = nominatim({**params, "polygon_geojson": 1, "polygon_threshold": 0.05 if big else 0.005})
        g = r and r.get("geojson")
        if g and g["type"] in ("Polygon", "MultiPolygon"):
            bcache[q] = {"type": g["type"], "coordinates": rnd(g["coordinates"]), "osm": f'{r["osm_type"]}/{r["osm_id"]}',
                         "center": [round(float(r["lat"]), 5), round(float(r["lon"]), 5)], "osm_name": r["display_name"]}
        else:
            bcache[q] = None
    except Exception as e:
        print("boundary fail", q, e); return None
    json.dump(bcache, open(BCACHE, "w"))
    return bcache[q]

def slug(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")[:60]

SECONDARY = ["dunya", "times", "guardian", "bbc", "abc news", "dawn", "rte", "joongang", "nation.cymru", "delivery tech", "cuscoperu", "xtour", "seoul window", "phnom penh post"]
# Lifecycle metadata for phase-1 entries (from their own sources).
LIFECYCLE = {
    "Punjab province (Pakistan)": {"temporary": True, "effective_from": "2026-10-20", "expires": "2026-12-18", "lifecycle_note": "First 30-day order from 2026-10-20 (Dawn). Extension order issued 2026-11-19 under s.144 CrPC for 30 days, effective immediately, unless withdrawn earlier (Dunya News 2026-11-19; Express Tribune and Pakistan Observer 2026-11-20). Counting 30 days from 19 Nov gives a last day of 18 Dec 2026; the notification text itself was not found online, so the end date is derived, not published. Found by the refresher flagging the first expiry."},
    "Senedd Siambr (Welsh Parliament debating chamber)": {"temporary": True, "lifecycle_note": "Applies until a review is complete; no end date published."},
    "Victoria schools (students)": {"effective_from": "2027-01-28"},
    "Victoria government schools (adults and visitors)": {"effective_from": "2027-01-27"},
    "City of Canterbury Bankstown leisure and aquatic centres": {"lifecycle_note": "Voted 2026-09-15; conditions of entry not yet updated (per VR.org, 2026-11-15)."},
}
out = []
for e in seed_source.E + seed_source_phase2.E + seed_source_phase3.E + seed_source_phase4.E + seed_source_phase5.E + seed_source_phase6.E:
    lat, lng, prec, geom = e.get("lat"), e.get("lng"), None, None
    if lat is not None:
        prec = "official_coordinates"
    elif e.get("geo"):
        g = geocode(e["geo"])
        if g:
            lat, lng = g["lat"], g["lng"]
            prec = "landmark" if e["scope"] in ("venue", "zones", "radius") else "representative_point"
    if e.get("radius_m") and lat is not None:
        geom = {"type": "circle", "center": [lat, lng], "radius_m": e["radius_m"]}
    if e.get("polygon"):
        ring = e["polygon"][0]
        geom = {"type": "Polygon", "coordinates": e["polygon"], "source": e.get("coord_source")}
        if lat is None:
            lng, lat = round(sum(p[0] for p in ring[:-1]) / (len(ring) - 1), 6), round(sum(p[1] for p in ring[:-1]) / (len(ring) - 1), 6)
            prec = "official_coordinates"
    if not e.get("boundary") and e["kind"] == "jurisdiction" and e.get("geo"):
        e = {**e, "boundary": e["geo"]}
    if e.get("boundary"):
        b = boundary(e["boundary"])
        if b:
            geom = {"type": b["type"], "coordinates": b["coordinates"], "source": "OpenStreetMap " + b["osm"] + " (simplified)"}
            if lat is None: lat, lng = b["center"]
            prec = "admin_boundary"
    lc = LIFECYCLE.get(e["name"], {})
    pub = e["publisher"]
    rec = {
        "id": slug(e["name"]),
        "name": e["name"], "kind": e["kind"], "scope": e["scope"],
        "country": e["country"], "region": e.get("region"),
        "location": {"lat": lat, "lng": lng, "precision": prec or "none", "geocode_query": e.get("geo") or e.get("boundary"), "radius_m": e.get("radius_m"), "coordinates_source": e.get("coord_source")},
        "geometry": geom,
        "rules": e["rules"], "zones": e.get("zones", []),
        "summary": e["summary"],
        "effective_or_reported_date": e.get("date"), "status": e["status"],
        "effective_from": lc.get("effective_from", e.get("effective_from")),
        "expires": lc.get("expires", e.get("expires")),
        "temporary": lc.get("temporary", e.get("temporary", False)),
        "lifecycle_note": lc.get("lifecycle_note"),
        "source": {"url": e["source"], "publisher": pub, "found_via": e.get("via"),
                   "type": e.get("source_type") or ("secondary" if any(x in pub.lower() for x in SECONDARY) else "official")},
        "verification": "reported, unverified by owner",
        "retrieved": "2026-11-21",
    }
    out.append(rec)
ids = [r["id"] for r in out]
dups = {i for i in ids if ids.count(i) > 1}
assert not dups, dups
doc = {"dataset": "OpenPlaceRules seed", "version": "0.2.0", "generated": time.strftime("%Y-%m-%dT%H:%M:%S%z"),
       "notice": "Every entry is reported from a public source and is UNVERIFIED BY THE OWNER of the place. Not legal advice. Coordinates for multi-site entries are a representative point only; admin boundaries are simplified OpenStreetMap polygons.",
       "count": len(out), "entries": out}
json.dump(doc, open(os.path.join(ROOT, "data", "seed.json"), "w"), indent=1, ensure_ascii=False)
print(len(out), "entries;", sum(1 for r in out if r["location"]["lat"] is not None), "with coordinates;",
      sum(1 for r in out if r["geometry"]), "with geometry")
