# Changelog

## [Unreleased]

## [1.2.0] - 2026-10-05

### Changed
- The `assets` profile now makes the repo the **source of truth for the brand** by default (logos, palette, fonts, media). Other repos are told to take their brand from it. Previously it assumed the product repo owned the brand and `assets` followed it.
- `follows` wording in generated `CLAUDE.md` files now says what is followed (`follows that one for <what it owns>`), and sibling lines use a consistent separator.

### Added
- The `assets` profile scaffolds a numbered category tree named after the org (`<slug>-assets/01-brand/logos/{svg,png}`, `02-social-media/{instagram,linkedin,youtube}`, `03-app-store/listing/{source,iphone,ipad}`, `04-documents`), `rendering/src` scripts that derive mono-black, mono-white and favicon variants from the primary logos and render PNGs (`pnpm render:logos`), a `package.json`, and a README with the structure tree.
- `gov sync --config <file>` adopts an updated org config (for example changed ownership) and refreshes every generated section.
- Folder and file names in profiles can contain template variables.
- Profiles can declare `defaultOwns`.

## [1.1.0] - 2026-10-04

### Added
- Apache-2.0 `LICENSE` and `NOTICE`, `CONTRIBUTING.md`, `SECURITY.md`, issue and PR templates, `CODEOWNERS`.
- Repository protection for this repo: rulesets (PR-only, owner approval, required `Tests`/`PR Title`/`Branch Policy`, no force-push or deletion), `Branch Policy` and `PR Title` workflows.
- Generator option `org.bypass` (`organization-admin` | `repository-admin`) so personal GitHub accounts get a valid bypass actor; rulesets now require code-owner review whenever `org.codeowners` is set.

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
