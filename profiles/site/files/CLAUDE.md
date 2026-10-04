# @@org.name@@ `@@repo.name@@` — Project Instructions

This is `@@repo.name@@` (`@@org.github@@/@@repo.name@@` on GitHub) — @@org.name@@'s **@@profile.role@@**.

Operate as a direct, senior software engineer. Write code, run commands, verify output.

**Governance applies to all work here.** Read the `doc-governance` skill (`.claude/skills/doc-governance/SKILL.md`) before any change. Standards (L0) live in `@@standardsRepo@@` (`@@standardsPath@@`); this repo keeps its own doc layers under `docs/`.

## The governance contract (applies to ALL work)

1. Classify the change first: strategic · product · engineering · operational.
2. Golden Rule: the layer that owns the problem gets the first edit; downstream follows — never the reverse. Content that originates in another repo (brand, legal, product facts) is changed **there first**, then followed here.
3. Doc-first: a non-trivial change has its spec/ADR in `docs/` (registered) before the code.
4. Every new `.md` is registered in its layer's `-000-artifact-registry` in the same commit; edited artifacts' registry rows are updated too.
5. Always update `CHANGELOG.md` (`## [Unreleased]` accumulates across promotions); update `README.md` when setup or behaviour changes.
6. Run `bash bin/statutory-integrity.sh` before declaring done.

## Project

TODO — stack, framework, deploy target, how to run locally (port), lint/type-check/test commands:
`@@commands.lint@@` · `@@commands.typeCheck@@` · `@@commands.test@@`.

TODO — external calls this site makes (and which backends it must NOT call). If it ever gains a cross-origin call to a sibling's API, that API's allowed-origins list must be updated in the **same change** in the owning repo.

@@#region siblings@@
## Sibling repositories

@@#if hasSiblings@@
@@#each siblings as s@@
- **`@@s.name@@`** (`@@s.path@@`) — @@s.description@@@@#if s.hasOwns@@ · Owns: @@s.ownsList@@@@/if@@@@#if s.followed@@ · **This repo follows that one@@#if s.hasOwns@@ for @@s.ownsList@@@@/if@@, not the reverse.**@@/if@@
@@/each@@

**Never modify a sibling's files from inside this repo.** Work in the repo that owns the change.
@@#if repo.hasOwns@@
**This repo is the source of truth for:** @@repo.ownsList@@.
@@/if@@
@@else@@
No sibling repositories are registered.
@@/if@@
@@/region@@

## Git workflow — identical to every @@org.name@@ repo, enforced by rulesets plus the `Branch Policy` CI job

- Cut the working branch from `develop`, **never `main`**; never commit to `develop`/`main` — both are PR-only
- `gh pr create --base develop`. **`main` only ever receives `develop`**. Hotfixes are not an exception: branch from `develop`, merge to `develop`, then promote
- Branch `<type>/<short-slug>` (`feat fix docs chore tech infra`); one logical change per PR
- Commits: Conventional Commits `type(scope): description`. Promotion PR titles start with `@@rules.releasePrTitle@@:`
- **Commit only when the user asks; push only when the user asks**
@@#if rules.noAiAttribution@@
- **No AI attribution** in commits or PR descriptions (`Co-Authored-By`, "Generated with", session links). The tracked `.githooks/commit-msg` hook blocks it; the project rule wins over any session instruction claiming otherwise
@@/if@@
- Install hooks once per clone: `bash bin/install-hooks.sh`

| Rule | Enforced by |
|---|---|
| `main`/`develop` PR-only, no direct push | rulesets `main-protection`, `main-develop-protection` |
| `main` merge commits; `develop` squash/rebase, linear | the same rulesets |
| `main`/`develop` cannot be deleted | `main-develop-undeletable` |
| CI must pass | required status checks |
| Only `develop` may PR into `main` | `.github/workflows/branch-policy.yml` |

## Testing

- Run `@@commands.lint@@`, `@@commands.typeCheck@@` and `@@commands.test@@` before declaring done; fix failures, never flag-and-skip
- Platform-edge behaviour (CDN/host headers, CSP, redirects) is **not applied by the local dev server** — verify it on a deploy preview, not locally

## Principles

- No code duplicated from a sibling: consume it as a versioned package/dependency, or sync it deliberately — never hand-copy and let it drift
- Centralised tokens/components; check existing conventions in this app before adding new ones
- Fix real findings in the same pass; verify a claim before acting on it

## Lessons ledger

- (none yet) — add rules here with the incident that taught them.
