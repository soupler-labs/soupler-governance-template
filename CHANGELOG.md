# Changelog

All notable changes to {{PROJECT_NAME}} are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### Added

- Added strict governance audit script for document header, registry, remediation, and source-artifact validation.
- Added docs site generation script and GitHub Pages publishing workflow.
- Added stable `verify` workflow for branch-protection status checks.
- Added governance support issue template, post-merge issue closure workflow, and branch-protection guidance.

### Changed

- Expanded the PR template with ship decision, test evidence, docs update, self-review, and risk sections.
- Reworked CI into governance-first checks with conditional project quality commands.

---

## [0.1.0] — {{DATE}}

### Added

- L0–L7 documentation governance layer scaffold
- Statutory Integrity Verification Engine (`bin/statutory-integrity.sh`)
- GitHub Actions: `governance.yml` (SIVE + PR metadata gate), `ci.yml` (CI pipeline stub)
- PR template (`.github/PULL_REQUEST_TEMPLATE.md`)
- `CLAUDE.md` — AI assistant instructions
- `CHANGELOG.md` — this file

---

[Unreleased]: https://github.com/YOUR_ORG/{{PROJECT_NAME}}/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/YOUR_ORG/{{PROJECT_NAME}}/releases/tag/v0.1.0
