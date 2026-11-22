"""Fetch a URL, extract text (HTML or PDF), print snippets around keywords. Usage: verify_source.py URL kw1 kw2 ..."""
import sys, re, html, subprocess, hashlib, os
url, kws = sys.argv[1], sys.argv[2:]
d = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "research", "verify"); os.makedirs(d, exist_ok=True); h = hashlib.md5(url.encode()).hexdigest()[:10]
raw = os.path.join(d, h + ".raw")
subprocess.run(["curl", "-sL", "-m", "30", "-A", "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/130 Safari/537.36", "-o", raw, url])
b = open(raw, "rb").read()
if b[:4] == b"%PDF":
    t = subprocess.run(["pdftotext", "-layout", raw, "-"], capture_output=True, text=True).stdout
else:
    t = b.decode("utf-8", "ignore"); t = re.sub(r"(?is)<(script|style).*?</\1>", " ", t); t = html.unescape(re.sub(r"<[^>]+>", " ", t))
t = re.sub(r"\s+", " ", t)
open(os.path.join(d, h + ".txt"), "w").write(url + "\n" + t)
print(f"== {url} [{len(t)} chars]")
for k in kws:
    ms = [m.start() for m in re.finditer(k, t, re.I)][:2]
    if not ms: print(f"  [{k}] NOT FOUND")
    for s in ms: print(f"  [{k}] …{t[max(0,s-220):s+260]}…")
