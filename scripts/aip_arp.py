#!/usr/bin/env python3
"""Fetch aerodrome reference points (ARP) from official eAIP AD 2.2 pages. Output research/aip/arp.json"""
import re, json, subprocess, html, sys
UA = "Mozilla/5.0 (X11; Linux x86_64) Chrome/124"
PAGES = {}
for icao in ["VTBS","VTBD","VTSP","VTCC","VTSG","VTSM","VTSS","VTBU","VTBL","VTCL","VTCT","VTSE","VTUK","VTUL","VTUO"]:
    PAGES[icao] = f"https://aip.caat.or.th/2026-10-29-AIRAC/html/eAIP/VT-AD-2.{icao}-en-GB.html"
for icao in ["WSSS","WSSL","WSAP","WSAT","WSAG"]:
    PAGES[icao] = f"https://aim-sg.caas.gov.sg/aim-content/uploads/aip/07-SEP-2026/AIP-2/2026-09-03-000000/html/eAIP/SG-AD-2-{icao}-en-GB.html"
PAGES["VHHH"] = "https://www.ais.gov.hk/eaip_20260122/2025-11-27-000000/html/eAIP/VH-AD-2-VHHH-en-US.html"
def dms(s):
    m = re.match(r"(\d{2,3})(\d{2})(\d{2}(?:\.\d+)?)([NSEW])", s)
    d, mi, se, h = m.groups(); v = int(d) + int(mi)/60 + float(se)/3600
    return round(-v if h in "SW" else v, 6)
out = {}
for icao, url in [(k,v) for k,v in PAGES.items() if (len(sys.argv)<2 or k in sys.argv[1:])]:
    b = subprocess.run(["curl","-sL","-m","30","-A",UA,url],capture_output=True).stdout.decode(errors="ignore")
    t = html.unescape(re.sub(r"\s+"," ",re.sub(r"<[^>]+>"," ",b)))
    i = t.lower().find("arp coordinates")
    seg = t[i:i+300] if i >= 0 else ""
    la = re.search(r"\b(\d{6}(?:\.\d+)?[NS])\b", seg); lo = re.search(r"\b(\d{7}(?:\.\d+)?[EW])\b", seg)
    m = (la, lo) if la and lo else None
    name = re.search(r"AD 2\.1\s+AERODROME LOCATION INDICATOR AND NAME\s+(.{0,80})", t)
    out[icao] = {"url": url, "http_len": len(b), "raw": seg[:160], "lat": dms(m[0].group(1)) if m else None, "lng": dms(m[1].group(1)) if m else None,
                 "name": name.group(1).strip() if name else None}
    print(icao, out[icao]["lat"], out[icao]["lng"], "|", seg[:110], file=sys.stderr)
json.dump(out, open("research/aip/arp.json","w"), indent=1)
