# L0-005 · GitHub Governance Standard

---
| Field | Value |
|---|---|
| Document ID | L0-005-github-governance-standard-v1 |
| Layer | L0 — Foundation Standards |
| Status | Final |
| Version | v1 |
| Created | @@date@@ |
| Last Updated | @@date@@ |
| Owner | @@org.owner@@ |
| Reviewers | @@org.owner@@ |
| Copyright | © @@year@@ @@org.copyright@@. All rights reserved. |
| License | @@org.license@@ |
---

## Purpose

The mandatory branch model, protection, PR and release rules that keep the repositories honest. Technical enforcement lives in `.github/governance/rulesets/` and the workflows named below.

## 1 · Branch model

| Branch | Purpose | Access |
|---|---|---|
| `main` | Production. Receives **only** `develop`. | PR only, merge commits |
| `develop` | Integration. All work lands here first. | PR only, squash/rebase, linear |
| `<type>/<slug>` | One logical change (`feat fix tech infra docs chore`) | author |

Naming and the three-tier ID rule: L0-002 §4. Hotfixes branch from `develop`.

## 2 · Pull requests

- Title is a Conventional Commit (`feat(auth): …`); a `develop` → `main` promotion starts with `@@rules.releasePrTitle@@:`.
- Body uses `.github/pull_request_template.md`. `## Docs update` must contain `- Status: UPDATED|EXEMPT` and a real `- Notes:` line — CI (`PR Metadata`) parses it literally. Blank is not an answer.
- One logical change per PR. A PR touching `.github/workflows/` is also reviewed for pipeline impact.
- All required checks green: @@#each checks as c@@`@@c@@` @@/each@@.

## 3 · Enforcement map

| Rule | Mechanism |
|---|---|
| PR-only, force-push blocked, merge methods | rulesets |
| Required checks | rulesets (`required_status_checks`) — **names must equal the CI job names** |
| `main` only from `develop` | `branch-policy.yml` |
| Doc registration and freshness | `bin/statutory-integrity.sh` via `pr-governance.yml` |
| PR title and Docs-update block | `pr-governance.yml` → `PR Metadata` |
| Commit format @@#if rules.noAiAttribution@@and no AI attribution @@/if@@ | `.githooks/commit-msg` (install: `bash bin/install-hooks.sh`) |
| Secrets | `pre-commit` + `secret-scan.yml` (gitleaks) |

A guard that is only a convention will be broken; every rule above has a mechanism. When adding a rule, add its mechanism in the same change or record in Version history that it is convention-only.

## 4 · Releases

SemVer (L0-002 §5). `develop` is green → promotion PR → merge commit → tag `main` → `CHANGELOG.md` entry exists for the tag.

@@#if has.L6@@
## 5 · Remediation governance

Security/compliance findings and defect classes follow the remediation track: **Audit → Plan → Execution (TIC + WE) → L7 row**, tracked by the docs and the PR(s) — not by labels nobody applies. Reference the audit ID inline in commits/PRs.
@@/if@@

## Version history

| Version | Date | Author | Summary of changes |
|---|---|---|---|
| v1 | @@date@@ | @@org.name@@ | Initial release from soupler-governance-template v@@template.version@@ |
