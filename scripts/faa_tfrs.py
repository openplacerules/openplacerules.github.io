#!/usr/bin/env python3
"""Pull current FAA SECURITY TFRs (official FAA TFR API) that have a defined area and last >= 30 days from today,
parse centre/radius or polygon, dates and whether drones are covered. Output research/faa/tfrs.json (used by seed_source_phase3.py)."""
import json, re, html, subprocess, sys, datetime
API = "https://tfr.faa.gov/tfrapi"
def get(url): return subprocess.run(["curl", "-s", "-m", "30", url], capture_output=True).stdout
def dms(s):
    m = re.match(r"(\d+)º(\d+)'(\d+)\"([NSEW])", s.strip()); d, mi, se, h = m.groups()
    v = int(d) + int(mi) / 60 + int(se) / 3600; return round(-v if h in "SW" else v, 6)
def date(s):
    m = re.search(r"([A-Z][a-z]+ \d{2}, \d{4})", s or ""); return datetime.datetime.strptime(m.group(1), "%B %d, %Y").date().isoformat() if m else None
today = datetime.date.fromisoformat(sys.argv[1]) if len(sys.argv) > 1 else datetime.date.today()
out = []
for t in json.loads(get(f"{API}/getTfrList")):
    if t["type"] != "SECURITY" or t["state"] == "USA": continue
    n = t["notam_id"]; d = json.loads(get(f"{API}/getWebText?notamId={n}"))
    txt = re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", d[0]["text"])))
    loc = re.search(r"Location : (.{0,120}?) Beginning", txt)
    b = re.search(r"Beginning Date and Time : (.{0,60}?) Ending Date and Time : (.{0,60}?) Reason", txt)
    start, end = (b.group(1), b.group(2)) if b else (None, None)
    end_d = None if (end or "").startswith("Permanent") else date(end)
    if end_d and (datetime.date.fromisoformat(end_d) - today).days < 30: continue
    rec = {"notam": n, "location": loc.group(1).strip() if loc else t["description"], "start": "immediately" if (start or "").startswith("Effective Immediately") else date(start),
           "end": "permanent" if (end or "").startswith("Permanent") else end_d, "uas_only": "No UAS operations are authorized" in txt,
           "all_aircraft": "No pilots may operate an aircraft" in txt}
    alt = re.search(r"Altitude: (From the surface up to and including [0-9,]+ feet [A-Z]+)", txt); rec["altitude"] = alt.group(1) if alt else None
    circles = re.findall(r"Latitude: ([^,]+), Longitude: ([^)]+)\) Radius: ([0-9.]+) nautical miles", txt)
    poly = re.search(r"Region bounded by: Latitude: Longitude: FRD: (.*?) Altitude", txt)
    if circles:
        la, lo, r = circles[0]; rec.update(lat=dms(la), lng=dms(lo), radius_m=round(float(r) * 1852), n_areas=len(circles))
    elif poly:
        pts = re.findall(r"(\d+º\d+'\d+\"[NS]) (\d+º\d+'\d+\"[EW])", poly.group(1))
        ring = [[dms(lo), dms(la)] for la, lo in pts]
        if ring and ring[0] != ring[-1]: ring.append(ring[0])
        rec.update(polygon=[ring], n_areas=len(re.findall(r"Region bounded by", txt)))
    else:
        continue
    if not (rec["uas_only"] or rec["all_aircraft"]): continue
    out.append(rec); print(n, rec["location"][:60], rec["end"], rec.get("radius_m"), "poly" if "polygon" in rec else "", file=sys.stderr)
json.dump({"retrieved": today.isoformat(), "source": f"{API}/getTfrList", "tfrs": out}, open("research/faa/tfrs.json", "w"), indent=1)
