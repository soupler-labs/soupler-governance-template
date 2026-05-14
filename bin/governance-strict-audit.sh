#!/usr/bin/env bash
# Strict Governance Audit
# Verifies registry rows, document headers, nested L6 sessions, and source-artifact indexes.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

python3 - <<'PY'
from pathlib import Path
import re
import sys

root = Path("docs")
errors = []
warnings = []

required_headers = [
    "Document ID",
    "Layer",
    "Status",
    "Version",
    "Created",
    "Last Updated",
    "Owner",
    "Copyright",
    "License",
]

def section_rows(text: str, headings: set[str]) -> list[list[str]]:
    rows = []
    active = False
    for line in text.splitlines():
        if line.startswith("## "):
            active = line.strip() in headings
            continue
        if active and line.startswith("---"):
            active = False
            continue
        if not active:
            continue
        if not line.startswith("|") or line.startswith("|---"):
            continue
        if "Document ID" in line or "Folder" in line:
            continue
        cols = [c.strip() for c in line.strip("|").split("|")]
        if cols and not cols[0].startswith("("):
            rows.append(cols)
    return rows

def header_value(text: str, key: str):
    match = re.search(rf"^{re.escape(key)}:\s*(.+)$", text, re.M)
    if match:
        return match.group(1).strip()
    table_match = re.search(rf"^\|\s*{re.escape(key)}\s*\|\s*(.+?)\s*\|$", text, re.M)
    if table_match:
        return table_match.group(1).strip()
    return None

if not root.exists():
    errors.append("docs/ directory is missing")

for layer_dir in sorted(root.glob("L*")):
    if not layer_dir.is_dir():
        continue

    prefix = layer_dir.name.split("-")[0]
    registry = layer_dir / f"{prefix}-000-artifact-registry-v1.md"
    if not registry.exists():
        errors.append(f"missing registry: {registry}")
        continue

    registry_text = registry.read_text(errors="replace")
    registry_rows = section_rows(registry_text, {"## Registered Artifacts", "## Artifact Registry"})

    for md in sorted(layer_dir.glob("*.md")):
        if md.name == registry.name:
            continue
        if md.stem not in registry_text and md.name != "REMEDIATION_PROTOCOL.md":
            errors.append(f"{md}: not registered in {registry.name}")

        if md.name == "L0-001-master-document-template-v1.md":
            continue

        text = md.read_text(errors="replace")
        for key in required_headers:
            if not header_value(text, key):
                errors.append(f"{md}: missing header field {key}")
        doc_id = header_value(text, "Document ID")
        expected_id = "REMEDIATION_PROTOCOL" if md.name == "REMEDIATION_PROTOCOL.md" else md.stem
        if doc_id and doc_id != expected_id:
            errors.append(f"{md}: Document ID {doc_id} != {expected_id}")

    for row in registry_rows:
        doc_id = row[0]
        if doc_id == "REMEDIATION_PROTOCOL":
            expected = layer_dir / "REMEDIATION_PROTOCOL.md"
        elif layer_dir.name == "L6-remediation" and len(row) >= 3 and row[2].startswith("./"):
            expected = layer_dir / row[2][2:]
        else:
            expected = layer_dir / f"{doc_id}.md"
        if not expected.exists():
            errors.append(f"{registry}: stale registry row {doc_id}; missing {expected}")

    if layer_dir.name == "L6-remediation":
        for md in sorted(layer_dir.glob("R-*/*.md")):
            rel = "./" + str(md.relative_to(layer_dir))
            if md.stem not in registry_text or rel not in registry_text:
                errors.append(f"{md}: nested L6 artifact missing stem/path registry entry")
            text = md.read_text(errors="replace")
            doc_id = header_value(text, "Document ID")
            if doc_id != md.stem:
                errors.append(f"{md}: Document ID {doc_id} != {md.stem}")

    if layer_dir.name in {"L1-strategy", "L3-architecture"}:
        for source_dir in layer_dir.glob("source-artifacts*"):
            has_index = any(
                "source-artifact" in p.stem
                or "source artifact" in p.read_text(errors="replace").lower()
                or "source-artifacts/" in p.read_text(errors="replace")
                for p in layer_dir.glob("*.md")
            )
            if source_dir.exists() and not has_index:
                warnings.append(f"{layer_dir}: source-artifacts exists without source artifact index")

print("")
print("╔══════════════════════════════════════════════════════════╗")
print("║              STRICT GOVERNANCE AUDIT                    ║")
print("╚══════════════════════════════════════════════════════════╝")
print("")
print(f"Layers checked: {sum(1 for p in root.glob('L*') if p.is_dir())}")
print(f"Errors: {len(errors)}")
print(f"Warnings: {len(warnings)}")

for warning in warnings:
    print(f"[WARN] {warning}")
for error in errors:
    print(f"[FAIL] {error}")

if errors:
    print("")
    print("[STRICT] VERDICT: FAIL")
    sys.exit(1)

print("")
print("[STRICT] VERDICT: PASS")
PY
