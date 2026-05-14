#!/usr/bin/env bash
# Builds a simple static documentation index for GitHub Pages.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

PROJECT_NAME="${PROJECT_NAME:-$(basename "$REPO_ROOT")}"
OUT_DIR="${OUT_DIR:-public/docs}"
rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"

cat > "$OUT_DIR/index.html" <<HTML
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${PROJECT_NAME} Governance Docs</title>
  <style>
    body { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; margin: 32px; line-height: 1.45; color: #172033; }
    h1 { margin-bottom: 4px; }
    h2 { margin-top: 28px; border-bottom: 1px solid #d8dee9; padding-bottom: 6px; }
    a { color: #185abc; text-decoration: none; }
    a:hover { text-decoration: underline; }
    li { margin: 4px 0; }
    .meta { color: #5f6b7a; }
  </style>
</head>
<body>
  <h1>${PROJECT_NAME} Governance Docs</h1>
  <p class="meta">Generated from governed L0-L7 documentation artifacts.</p>
HTML

while IFS= read -r layer; do
  layer_name="$(basename "$layer")"
  printf '  <h2>%s</h2>\n  <ul>\n' "$layer_name" >> "$OUT_DIR/index.html"
  while IFS= read -r file; do
    rel="${file#docs/}"
    title="$(head -n 1 "$file" | sed 's/^# //')"
    printf '    <li><a href="../../docs/%s">%s</a></li>\n' "$rel" "$title" >> "$OUT_DIR/index.html"
  done < <(find "$layer" -maxdepth 2 -name '*.md' -type f | sort)
  printf '  </ul>\n' >> "$OUT_DIR/index.html"
done < <(find docs -maxdepth 1 -type d -name 'L*' | sort)

cat >> "$OUT_DIR/index.html" <<'HTML'
</body>
</html>
HTML

echo "Built $OUT_DIR/index.html"
