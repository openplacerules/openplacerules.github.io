#!/usr/bin/env bash
# Renders web/og.png (1200x630 social card) and favicon PNGs from web/favicon.svg with headless Chrome + Pillow. Local only.
set -euo pipefail
cd "$(dirname "$0")/.."
CH="google-chrome --headless=new --no-sandbox --disable-gpu --hide-scrollbars --virtual-time-budget=5000"
$CH --window-size=1200,630 --screenshot="$PWD/web/og.png" "file://$PWD/web/brand/og.html" >/dev/null 2>&1
printf '<html><body style="margin:0;background:transparent"><img src="%s" style="width:512px;height:512px;display:block"></body></html>' "file://$PWD/web/favicon.svg" > /tmp/fav.html
$CH --window-size=512,512 --default-background-color=00000000 --screenshot=/tmp/fav512.png file:///tmp/fav.html >/dev/null 2>&1
python3 - <<'PY'
from PIL import Image
im = Image.open('/tmp/fav512.png').convert('RGBA')
im.resize((180, 180), Image.LANCZOS).save('web/apple-touch-icon.png')
im.resize((32, 32), Image.LANCZOS).save('web/favicon-32.png')
im.save('web/favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)])
PY
echo "brand assets: web/og.png web/favicon.ico web/favicon-32.png web/apple-touch-icon.png"
