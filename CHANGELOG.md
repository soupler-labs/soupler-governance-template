# Changelog

## [Unreleased]

## [1.0.0] - 2026-10-04

### Added
- `gov` CLI: `new-org`, `add-repo`, `adopt`, `sync`, `github`, `audit`, `profiles`, `doctor`.
- Profiles `product`, `site`, `assets`, `package` layered over a shared `_base`.
- Statutory Integrity gate v2 (`bin/statutory-integrity.mjs`): recursive registration, stale-row and Version/Last-Updated freshness checks, header checks; strict vs adoption mode via `.governance/sive.json`.
- Ten portable L0 standards including engineering principles (modularity, no duplication, single source of truth, centralised tokens, no localhost fallbacks) and generated repo topology.
- Workflows: Branch Policy, PR Governance (SIVE + PR Metadata with `## Docs update` and `release:` titles), Secret Scan, CI seed, post-merge issue closure.
- Rulesets (`main-develop-protection`, `main-protection`, `main-develop-undeletable`) with an idempotent applier; GitHub publishing always requires confirmation.
- Agent layer: governance-first `CLAUDE.md` per profile, `doc-governance` skill, slash commands, SessionStart governance brief.
- Manifest-based `sync` that never overwrites a locally edited file; managed `gov:begin/end` regions in seeded docs.
- Example org configuration.
