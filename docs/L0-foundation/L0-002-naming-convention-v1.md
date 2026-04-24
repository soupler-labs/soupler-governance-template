# L0-002-naming-convention-v1  Naming Convention & Version Control

---
Document ID:   L0-002-naming-convention-v1
Layer:         L0 — Foundation
Status:        Active
Version:       v1
Created:       {{DATE}}
Last Updated:  {{DATE}}
Owner:         TODO — set owner
Copyright:     © {{YEAR}} {{PROJECT_NAME}}. All rights reserved.
License:       Proprietary
---

## Purpose

Defines the canonical filename convention, document ID format, and version control standard for all artifacts in the L0–L7 governance layer system. Every contributor must follow this standard so that SIVE can verify compliance automatically.

---

## Document ID Format

```
{LAYER_CODE}-{SEQ}-{slug}-v{N}
```

| Part | Description | Example |
|---|---|---|
| `LAYER_CODE` | Layer identifier (`L0`, `L2.6`, `L6.1`, etc.) | `L3` |
| `SEQ` | Three-digit zero-padded sequence number | `001` |
| `slug` | Lowercase kebab-case summary of the artifact | `adr-rate-limiting-strategy` |
| `v{N}` | Version suffix — increment on breaking changes | `v2` |

Full example: `L3-002-adr-rate-limiting-strategy-v1`

---

## Filename Convention

Filename must exactly match the Document ID plus `.md` extension:

```
L3-002-adr-rate-limiting-strategy-v1.md
```

Rules:
- Lowercase only
- Kebab-case (hyphens, no underscores, no spaces)
- No date stamps in the filename (dates live in the header block)

---

## Layer Code Reference

| Layer | Code | Description |
|---|---|---|
| L0 | `L0` | Foundation — naming, templates, governance standards |
| L1 | `L1` | Strategy — vision, positioning, OKRs |
| L2 | `L2` | Product — requirements, PRDs, user stories |
| L2.5 | `L2.5` | Design & UX — flows, components, IA |
| L2.6 | `L2.6` | Delivery Stories — sprint backlogs, delivery tracking |
| L3 | `L3` | Architecture — ADRs, system design, API contracts |
| L4 | `L4` | Infrastructure — CI/CD, deployment, cloud config |
| L5 | `L5` | Operations — runbooks, incident response |
| L6 | `L6` | Remediation — SEV audit findings and corrective plans |
| L6.1 | `L6.1` | Remediation Execution — sprint execution workspaces |
| L7 | `L7` | Forensics & Traceability — chain of custody |

---

## Versioning Rules

- `v1` is the initial published version
- Increment the version (`v2`, `v3`, …) when the document's decisions, contracts, or scope change materially
- Minor editorial fixes (typos, formatting) do not require a version bump — update `Last Updated` in the header only
- Superseded versions are archived; the filename retains the old version suffix (do not rename)
- A new version is a **new file** — old file is marked `Status: Superseded` and updated with a pointer to the successor

---

## Registry Requirement

Every `.md` file in a layer folder (except the `-000-artifact-registry` itself) must be registered in that layer's `{LAYER_CODE}-000-artifact-registry-v1.md`. SIVE enforces this on every PR — unregistered files block merge.

---

## Version history

| Version | Date | Author | Summary of changes |
|---|---|---|---|
| v1 | {{DATE}} | TODO | Standard adopted |
