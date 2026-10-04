# @@org.name@@ `@@repo.name@@` — Project Instructions

This is the **brand and static-media asset repository** for @@org.name@@ (`@@org.github@@/@@repo.name@@`). See `README.md` for structure and render scripts.

**Governance applies to all work here.** Read `.claude/skills/doc-governance/SKILL.md` first. Standards (L0) live in `@@standardsRepo@@` (`@@standardsPath@@`).

@@#region siblings@@
## Sibling repositories — this repo follows, it never leads

@@#if hasSiblings@@
@@#each siblings as s@@
- **`@@s.name@@`** (`@@s.path@@`) — @@s.description@@@@#if s.hasOwns@@ Owns: @@s.ownsList@@.@@/if@@@@#if s.followed@@ **This repo follows that one, not the reverse.**@@/if@@
@@/each@@

**Never modify a sibling's files from inside this repo.** If the source of truth (mark geometry, palette, copy) must change, it changes in the owning repo first; update this repo afterward. Copy and scripts for campaigns live with the owner — this repo holds only rendered outputs.
@@else@@
No sibling repositories are registered.
@@/if@@
@@/region@@

## Rules

- Brand tokens and logo geometry are **copied from the owning repo**, never invented here. Record the source file and revision next to each copy.
- Derived files (PNG renders) are regenerated from source (SVG/HTML) by script — never hand-edited.
- Always update `CHANGELOG.md`; run `bash bin/statutory-integrity.sh` before declaring done.

## Git workflow

Identical to every @@org.name@@ repo: branch from `develop`, PR to `develop`, only `develop` → `main`; Conventional Commits; commit/push only when asked.
@@#if rules.noAiAttribution@@
No AI attribution in commits or PR descriptions — the `commit-msg` hook blocks it.
@@/if@@
Install hooks once per clone: `bash bin/install-hooks.sh`.
