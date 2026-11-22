"""Append phase-4 entries to the existing data/seed.json (does not rebuild phases 1–3).
Geocodes via OpenStreetMap Nominatim, using the same cache as build_seed.py.
"""
import json, os, re, sys, time, unicodedata, urllib.parse, urllib.request
sys.path.insert(0, os.path.dirname(__file__))
import seed_source_phase4
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(ROOT, "data", "geocode_cache.json")
SEED = os.path.join(ROOT, "data", "seed.json")
cache = json.load(open(CACHE)) if os.path.exists(CACHE) else {}
UA = {"User-Agent": "OpenPlaceRules-seed/0.3 (+https://openplacerules.org; low volume)"}
RETRIEVED = "2026-11-22"

def nominatim(params):
    url = "https://nominatim.openstreetmap.org/search?" + urllib.parse.urlencode({**params, "format": "json", "limit": 1})
    r = json.load(urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60))
    time.sleep(1.1)
    return r[0] if r else None

def geocode(q):
    if q in cache:
        return cache[q]
    try:
        r = nominatim({"q": q})
        cache[q] = {"lat": round(float(r["lat"]), 5), "lng": round(float(r["lon"]), 5), "osm_name": r["display_name"]} if r else None
    except Exception as e:
        print("geocode fail", q, e)
        return None
    json.dump(cache, open(CACHE, "w"), indent=1)
    return cache[q]

def slug(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")[:60]

SECONDARY = ["dunya", "times", "guardian", "bbc", "abc news", "dawn", "rte", "joongang", "nation.cymru", "delivery tech", "cuscoperu", "xtour", "seoul window", "phnom penh post"]

seed = json.load(open(SEED))
existing_ids = {e["id"] for e in seed["entries"]}
out = []
for e in seed_source_phase4.E:
    lat = e.get("lat"); lng = e.get("lng"); prec = None; geom = None
    if lat is not None:
        prec = "official_coordinates"
    elif e.get("geo"):
        g = geocode(e["geo"])
        if g:
            lat, lng = g["lat"], g["lng"]
            prec = "landmark" if e["scope"] in ("venue", "zones", "radius") else "representative_point"
        else:
            print("NO GEOCODE", e["name"], e.get("geo"))
    if e.get("radius_m") and lat is not None:
        geom = {"type": "circle", "center": [lat, lng], "radius_m": e["radius_m"]}
    rec = {
        "id": slug(e["name"]),
        "name": e["name"], "kind": e["kind"], "scope": e["scope"],
        "country": e["country"], "region": e.get("region"),
        "location": {"lat": lat, "lng": lng, "precision": prec or "none", "geocode_query": e.get("geo") or e.get("boundary"), "radius_m": e.get("radius_m"), "coordinates_source": e.get("coord_source")},
        "geometry": geom,
        "rules": e["rules"], "zones": e.get("zones", []),
        "summary": e["summary"],
        "effective_or_reported_date": e.get("date"), "status": e["status"],
        "effective_from": e.get("effective_from"),
        "expires": e.get("expires"),
        "temporary": e.get("temporary", False),
        "lifecycle_note": e.get("lifecycle_note"),
        "source": {"url": e["source"], "publisher": e["publisher"], "found_via": e.get("via"),
                   "type": e.get("source_type") or ("secondary" if any(x in e["publisher"].lower() for x in SECONDARY) else "official")},
        "verification": "reported, unverified by owner",
        "retrieved": RETRIEVED,
    }
    if rec["id"] in existing_ids or rec["id"] in {r["id"] for r in out}:
        raise SystemExit(f"duplicate id {rec['id']}")
    out.append(rec)
    print(f"OK {rec['id']}  {rec['location']['lat']},{rec['location']['lng']}  {rec['location']['precision']}")

seed["entries"].extend(out)
seed["count"] = len(seed["entries"])
seed["generated"] = time.strftime("%Y-%m-%dT%H:%M:%S%z")
json.dump(seed, open(SEED, "w"), indent=1, ensure_ascii=False)
print(len(out), "appended;", seed["count"], "total;",
      sum(1 for r in seed["entries"] if r["location"]["lat"] is not None), "with coordinates")
