#!/usr/bin/env python3
"""For each US state in the Delivery Tech Watch table, collect the official statute links that its state page cites,
then fetch each official link and keep the first one whose text mentions delivery devices. Output: research/dtw/official_links.json"""
import json, re, subprocess, html, sys, time
STATES = ["Arizona","Arkansas","District of Columbia","Florida","Georgia","Idaho","Indiana","Iowa","Louisiana","Maryland","Mississippi","Missouri",
          "Nevada","New Hampshire","North Carolina","Ohio","Oklahoma","Pennsylvania","Tennessee","Texas","Utah","Virginia","Washington","West Virginia","Wisconsin"]
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36"
BAD = ("deliverytechwatch", "google", "legiscan", "mirror", "news", "times", "post", "fonts", "twitter", "facebook", "starship", "wikipedia", "reuters", "axios")
KEY = re.compile(r"personal delivery device|mobile carrying device|delivery device|personal delivery|mobile delivery", re.I)
def get(url):
    r = subprocess.run(["curl", "-sL", "-m", "30", "-A", UA, url], capture_output=True)
    return r.stdout
def text(b):
    if b[:4] == b"%PDF":
        r = subprocess.run(["pdftotext", "-", "-"], input=b, capture_output=True); return r.stdout.decode(errors="ignore")
    t = b.decode(errors="ignore"); t = re.sub(r"<script.*?</script>|<style.*?</style>", " ", t, flags=re.S)
    return html.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", t)))
out = {}
for st in STATES:
    slug = st.lower().replace(" ", "-")
    page = get(f"https://deliverytechwatch.com/states/{slug}").decode(errors="ignore")
    links = [l for l in dict.fromkeys(re.findall(r'href="(https?://[^"]+)"', page)) if not any(b in l.lower() for b in BAD)]
    res = {"dtw": f"https://deliverytechwatch.com/states/{slug}", "candidates": links, "official": None, "snippet": None}
    for l in links:
        t = text(get(l)); m = KEY.search(t)
        if m:
            res["official"] = l; res["snippet"] = t[max(0, m.start()-150): m.end()+200]; break
        time.sleep(0.3)
    out[st] = res
    print(st, "->", res["official"], file=sys.stderr)
json.dump(out, open("research/dtw/official_links.json", "w"), indent=1, ensure_ascii=False)
