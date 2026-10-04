# @@org.name@@ `@@repo.name@@` — Project Instructions

This is the **brand and static-media asset repository** for @@org.name@@ (`@@org.github@@/@@repo.name@@`). It is the **source of truth** for the brand identity: @@#if repo.hasOwns@@@@repo.ownsList@@@@else@@logos, palette, fonts and brand media@@/if@@. Every other @@org.name@@ repository takes its brand from here — never the reverse.

**Governance applies to all work here.** Read `.claude/skills/doc-governance/SKILL.md` first. Standards (L0) live in `@@standardsRepo@@` (`@@standardsPath@@`).

## What lives here

Keep this map current; it is what agents navigate by. The folder tree is in `README.md`.

| Path | Contents |
|---|---|
| `@@org.slug@@-assets/01-brand/logos/svg/*-primary.svg` | The approved logos (full, mark). **Source of truth** - add them here |
| `@@org.slug@@-assets/01-brand/logos/svg/` (others) | Generated: mono-black, mono-white, favicon. Never hand-edited |
| `@@org.slug@@-assets/01-brand/logos/png/` | Rendered PNGs. Never hand-edited |
| `@@org.slug@@-assets/02-social-media/`, `03-app-store/`, `04-documents/` | Structure for templates and renders: instagram, linkedin, youtube, app-store listing (`source/` raw captures, `iphone/`, `ipad/` outputs), print documents |
| `rendering/src/` | `generate-logo-variants.mjs`, `render-svgs.mjs` |

## Working here

- **SVG (or HTML) sources are the truth; PNG renders are derived** — regenerate them by script, never hand-edit a render.
- After adding or changing a primary SVG: `pnpm install` (first time) then `pnpm render:logos` - it regenerates the mono variants and favicon and renders every PNG. Commit the SVGs and PNGs together.
- Logo SVGs should contain outlined shapes only (no live text) so they render identically with no font installed.
- Record where every asset came from (original artwork, date, how it was produced) in `README.md`.
- Always update `CHANGELOG.md`; run `bash bin/statutory-integrity.sh` before declaring done.

@@#region siblings@@
## Sibling repositories

@@#if hasSiblings@@
@@#each siblings as s@@
- **`@@s.name@@`** (`@@s.path@@`) — @@s.description@@@@#if s.followed@@ · **This repo follows that one for what it owns** (@@s.ownsList@@).@@/if@@@@#if s.followsThis@@ · **It takes its brand from this repo.**@@/if@@
@@/each@@

**Never modify a sibling's files from inside this repo.** A brand change is made **here first**; then each repo that follows this one is updated separately, in its own repository, and its PR cites the change made here.
@@else@@
No sibling repositories are registered.
@@/if@@
@@/region@@

## Rules

- This repo owns the brand. When the mark, palette or fonts change here, say which repositories must follow and update them afterward — a brand change is not done until its followers are.
- Anything this repo itself consumes from a sibling (if the list above says it follows one) is copied, not invented, with its source and revision recorded.

## Git workflow

Identical to every @@org.name@@ repo: branch from `develop`, PR to `develop`, only `develop` → `main`; Conventional Commits; commit/push only when asked.
@@#if rules.noAiAttribution@@
No AI attribution in commits or PR descriptions — the `commit-msg` hook blocks it.
@@/if@@
Install hooks once per clone: `bash bin/install-hooks.sh`.
