#!/usr/bin/env bash
# init-governance.sh — Bootstrap L0–L7 documentation governance into a new or existing repo.
#
# Usage:
#   bash init-governance.sh <project-name> [target-directory]
#
# Arguments:
#   project-name       Short identifier used in document headers (e.g. "my-app")
#   target-directory   Where to write the scaffold (default: current directory)
#
# What it does:
#   - Creates docs/L0–L7 layer folders with -000-artifact-registry stubs
#   - Installs bin/statutory-integrity.sh
#   - Installs .github/workflows/governance.yml and ci.yml stubs
#   - Installs .github/PULL_REQUEST_TEMPLATE.md
#   - Installs CLAUDE.md, CHANGELOG.md templates
#   - Skips any file that already exists (safe to re-run)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
TEMPLATE_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

PROJECT_NAME="${1:-}"
TARGET_DIR="${2:-$(pwd)}"

if [ -z "$PROJECT_NAME" ]; then
  echo "Usage: bash init-governance.sh <project-name> [target-directory]"
  echo ""
  echo "  project-name       e.g. my-app, soupler-marketing, galiaraa"
  echo "  target-directory   defaults to current directory"
  exit 1
fi

DATE="$(date +%Y-%m-%d)"

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║              GOVERNANCE SCAFFOLD INIT                   ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo "  Project : $PROJECT_NAME"
echo "  Target  : $TARGET_DIR"
echo "  Date    : $DATE"
echo ""

# ── Helper: copy a template file, replacing {{PROJECT_NAME}} and {{DATE}} ────

install_file() {
  local SRC="$1"
  local DEST="$2"

  if [ -f "$DEST" ]; then
    echo "  [skip]  $DEST (already exists)"
    return
  fi

  mkdir -p "$(dirname "$DEST")"
  sed \
    -e "s/{{PROJECT_NAME}}/$PROJECT_NAME/g" \
    -e "s/{{DATE}}/$DATE/g" \
    "$SRC" > "$DEST"
  echo "  [write] $DEST"
}

# ── Helper: write an inline file ─────────────────────────────────────────────

write_file() {
  local DEST="$1"
  local CONTENT="$2"

  if [ -f "$DEST" ]; then
    echo "  [skip]  $DEST (already exists)"
    return
  fi

  mkdir -p "$(dirname "$DEST")"
  printf '%s\n' "$CONTENT" > "$DEST"
  echo "  [write] $DEST"
}

# ── Layer registry stubs ──────────────────────────────────────────────────────

LAYERS=(
  "L0-foundation"
  "L1-strategy"
  "L2-product"
  "L2.5-design-ux"
  "L2.6-delivery-stories"
  "L3-architecture"
  "L4-infrastructure"
  "L5-operations"
  "L6-remediation"
  "L6.1-remediation-execution"
  "L7-forensics"
)

LAYER_DESCRIPTIONS=(
  "Foundation — naming conventions, document templates, governance standards"
  "Strategy — vision, positioning, business objectives"
  "Product — requirements, PRDs, user stories, feature specs"
  "Design & UX — information architecture, component specs, UX flows"
  "Delivery Stories — sprint backlogs, active delivery tracking"
  "Architecture — ADRs, system design, API contracts, data models"
  "Infrastructure — CI/CD, deployment, cloud configuration"
  "Operations — runbooks, incident response, monitoring"
  "Remediation — SEV audit findings and corrective plans"
  "Remediation Execution — sprint-level execution workspaces"
  "Forensics & Traceability — chain of custody across all sessions"
)

echo "Creating layer registries..."
for i in "${!LAYERS[@]}"; do
  LAYER="${LAYERS[$i]}"
  DESC="${LAYER_DESCRIPTIONS[$i]}"
  LAYER_NUM="${LAYER%%-*}"
  REGISTRY_PATH="$TARGET_DIR/docs/$LAYER/${LAYER_NUM}-000-artifact-registry-v1.md"

  CONTENT="# ${LAYER_NUM}-000-artifact-registry-v1  $LAYER Artifact Registry

---
Document ID:   ${LAYER_NUM}-000-artifact-registry-v1
Layer:         $LAYER — $DESC
Status:        Active
Version:       v1
Created:       $DATE
Last Updated:  $DATE
Owner:         TODO — set owner
Copyright:     © $(date +%Y) $PROJECT_NAME. All rights reserved.
License:       Proprietary
---

## Purpose

Registry of all artifacts in the $LAYER layer. Every \`.md\` file in this folder must appear below or SIVE will block the PR.

---

## Registered Artifacts

| Document ID | Title | Status | Version | Notes |
|---|---|---|---|---|
| (none yet) | — | — | — | First artifact will be added here |

---

## Version history

| Version | Date | Author | Summary of changes |
|---|---|---|---|
| v1 | $DATE | $PROJECT_NAME | Registry created |
"

  write_file "$REGISTRY_PATH" "$CONTENT"
done

# ── bin/statutory-integrity.sh ───────────────────────────────────────────────

echo ""
echo "Installing SIVE script..."
install_file "$TEMPLATE_ROOT/bin/statutory-integrity.sh" "$TARGET_DIR/bin/statutory-integrity.sh"
chmod +x "$TARGET_DIR/bin/statutory-integrity.sh" 2>/dev/null || true

# ── .github/workflows ────────────────────────────────────────────────────────

echo ""
echo "Installing GitHub Actions workflows..."
install_file "$TEMPLATE_ROOT/.github/workflows/governance.yml" "$TARGET_DIR/.github/workflows/governance.yml"
install_file "$TEMPLATE_ROOT/.github/workflows/ci.yml" "$TARGET_DIR/.github/workflows/ci.yml"
install_file "$TEMPLATE_ROOT/.github/PULL_REQUEST_TEMPLATE.md" "$TARGET_DIR/.github/PULL_REQUEST_TEMPLATE.md"

# ── L0 foundation documents ──────────────────────────────────────────────────

echo ""
echo "Installing L0 foundation documents..."
install_file "$TEMPLATE_ROOT/docs/L0-foundation/L0-001-master-document-template-v1.md" \
             "$TARGET_DIR/docs/L0-foundation/L0-001-master-document-template-v1.md"
install_file "$TEMPLATE_ROOT/docs/L0-foundation/L0-002-naming-convention-v1.md" \
             "$TARGET_DIR/docs/L0-foundation/L0-002-naming-convention-v1.md"

# ── L7 master registry ───────────────────────────────────────────────────────

echo ""
echo "Installing L7 master registry..."
install_file "$TEMPLATE_ROOT/docs/L7-forensics/L7-000-master-registry-v1.md" \
             "$TARGET_DIR/docs/L7-forensics/L7-000-master-registry-v1.md"

# ── Root files ───────────────────────────────────────────────────────────────

echo ""
echo "Installing root files..."
install_file "$TEMPLATE_ROOT/CLAUDE.md" "$TARGET_DIR/CLAUDE.md"
install_file "$TEMPLATE_ROOT/CHANGELOG.md" "$TARGET_DIR/CHANGELOG.md"

# ── Register L0 docs in their registry ───────────────────────────────────────

echo ""
echo "──────────────────────────────────────────────────────────"
echo "  Done. Next steps:"
echo ""
echo "  1. Edit CLAUDE.md — fill in the TODO sections"
echo "  2. Update L0-000-artifact-registry — register L0-001 and L0-002"
echo "  3. Add governance.yml SIVE job as a required status check in"
echo "     GitHub → Settings → Branches → main branch protection rule"
echo "  4. Commit everything: git add . && git commit -m 'chore: init L0-L7 governance scaffold'"
echo "──────────────────────────────────────────────────────────"
echo ""
