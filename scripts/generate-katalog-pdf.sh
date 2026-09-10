#!/usr/bin/env bash
# Kurumsal eğitim kataloğunun PDF'ini üretir.
#
# PDF, sayfanın kendisinden basılır — yani /kurumsal/katalog sayfası tek
# kaynaktır ve iki sürüm birbirinden ayrı düşemez. Sayfanın print CSS'i
# menüyü, altbilgiyi ve ekrana özel düğmeleri çıkarır.
#
# Kullanım:  npm run build && bash scripts/generate-katalog-pdf.sh
set -euo pipefail

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
PORT=8765
OUT="public/gonca-fide-kurumsal-katalog.pdf"

[ -d dist ] || { echo "dist/ yok — önce 'npm run build' çalıştırın." >&2; exit 1; }
[ -x "$CHROME" ] || { echo "Chrome bulunamadı: $CHROME" >&2; exit 1; }

python3 -m http.server "$PORT" --directory dist >/dev/null 2>&1 &
SERVER=$!
trap 'kill $SERVER 2>/dev/null || true' EXIT
sleep 1

"$CHROME" --headless --disable-gpu --no-pdf-header-footer \
  --virtual-time-budget=10000 \
  --print-to-pdf="$OUT" "http://localhost:$PORT/kurumsal/katalog/" 2>/dev/null

echo "Yazıldı: $OUT ($(du -h "$OUT" | cut -f1))"
