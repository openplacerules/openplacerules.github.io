#!/usr/bin/env bash
# Domain availability via RDAP (read-only lookups; nothing is registered). 404 = no registration record (likely available).
for d in "$@"; do
  tld=${d##*.}
  case $tld in
    com|net) url="https://rdap.verisign.com/$tld/v1/domain/$d";;
    org) url="https://rdap.publicinterestregistry.org/rdap/domain/$d";;
    dev|app) url="https://pubapi.registry.google/rdap/domain/$d";;
    *) url="https://rdap.org/domain/$d";;
  esac
  code=$(curl -s -o /tmp/rdap.json -w '%{http_code}' -L -m 20 "$url")
  st="unknown($code)"; [ "$code" = 404 ] && st=AVAILABLE; [ "$code" = 200 ] && st="registered $(python3 -c "import json;d=json.load(open('/tmp/rdap.json'));print([e.get('eventDate','')[:10] for e in d.get('events',[]) if e.get('eventAction')=='registration'][:1])" 2>/dev/null)"
  echo "$d $st"
done
