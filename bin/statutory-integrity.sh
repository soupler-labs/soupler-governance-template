#!/usr/bin/env bash
# Statutory Integrity Verification Engine (SIVE)
# Verifies every docs/L*/ layer has a -000-artifact-registry and all .md files are registered.
# Portable: resolves repo root relative to this script regardless of caller directory.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

DOCS_DIR="$REPO_ROOT/docs"
ABORT_FILE="$(mktemp)"
rm -f "$ABORT_FILE"

PASS=0
FAIL=0

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║         STATUTORY INTEGRITY VERIFICATION ENGINE          ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

if [ ! -d "$DOCS_DIR" ]; then
  echo "[SIVE] FAIL: docs/ directory not found at $DOCS_DIR"
  exit 1
fi

for LAYER_DIR in "$DOCS_DIR"/L*/; do
  [ -d "$LAYER_DIR" ] || continue

  LAYER_NAME="$(basename "$LAYER_DIR")"
  REGISTRY_FILE="$(find "$LAYER_DIR" -maxdepth 1 -name '*-000-artifact-registry*' | head -1)"

  if [ -z "$REGISTRY_FILE" ]; then
    echo "[SIVE] FAIL: No -000-artifact-registry found in $LAYER_NAME"
    touch "$ABORT_FILE"
    FAIL=$((FAIL + 1))
    continue
  fi

  echo "[SIVE] Checking $LAYER_NAME (registry: $(basename "$REGISTRY_FILE"))"

  while IFS= read -r MD_FILE; do
    BASENAME="$(basename "$MD_FILE")"
    [[ "$BASENAME" == *"-000-artifact-registry"* ]] && continue

    STEM="${BASENAME%.md}"
    if ! grep -qF "$STEM" "$REGISTRY_FILE"; then
      echo "  [FAIL] Not registered: $BASENAME"
      touch "$ABORT_FILE"
      FAIL=$((FAIL + 1))
    else
      echo "  [OK]   $BASENAME"
      PASS=$((PASS + 1))
    fi
  done < <(find "$LAYER_DIR" -maxdepth 1 -name '*.md' | sort)
done

echo ""
echo "──────────────────────────────────────────────────────────"
echo "  Results: $PASS passed, $FAIL failed"
echo "──────────────────────────────────────────────────────────"

if [ -f "$ABORT_FILE" ]; then
  rm -f "$ABORT_FILE"
  echo "[SIVE] VERDICT: FAIL — resolve all issues above before merging"
  echo ""
  exit 1
fi

echo "[SIVE] VERDICT: PASS — all layers and artifacts in compliance"
echo ""
exit 0
