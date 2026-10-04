# @@org.name@@ Assets

This repository is the **source of truth for @@org.name@@'s brand and static-media assets**: the logo family, social-media templates and renders, app-store listing assets and print documents. Every other @@org.name@@ repository takes its brand from here, never the reverse.

Part of **@@org.name@@**. Role: @@profile.role@@.

@@#region siblings@@
## Related repositories

@@#if hasSiblings@@
@@#each siblings as s@@
- **`@@s.name@@`** (`@@s.path@@`) — @@s.description@@@@#if s.followsThis@@ · takes its brand from this repo@@/if@@
@@/each@@
@@else@@
No sibling repositories are registered.
@@/if@@
@@/region@@

See `CLAUDE.md` for the rules when working here with an AI coding agent.

## What lives here

- `@@org.slug@@-assets/01-brand/logos/` - the canonical logo family (SVG + PNG): primary, mono-black, mono-white, and a favicon
- `@@org.slug@@-assets/02-social-media/` - `instagram/`, `linkedin/`, `youtube/`
- `@@org.slug@@-assets/03-app-store/listing/` - app-store listing screenshots: `source/` (raw captures), `iphone/`, `ipad/` (rendered outputs)
- `@@org.slug@@-assets/04-documents/` - print/PDF documents (HTML source + rendered PDF)
- `rendering/src/` - the scripts that generate and render the above

Folders are added as they are needed; empty ones carry a `.gitkeep` so the structure exists before the content does. Generic templates use `-template` in the filename; campaign-specific instances are named descriptively. Campaign copy and scripts live with the product; only the rendered images live here.

## Logo family

Add the approved artwork as `@@org.slug@@-assets/01-brand/logos/svg/@@org.slug@@-logo-full-primary.svg` and `@@org.slug@@-logo-mark-primary.svg`, then run `pnpm render:logos`. Primary SVGs are the source; everything else is derived.

| File | Use |
|---|---|
| `svg/*-primary.svg` | Approved logos. **Source of truth** |
| `svg/*-mono-black.svg`, `svg/*-mono-white.svg` | Single-colour variants (generated) |
| `svg/favicon.svg` | The mark on a square canvas (generated) |
| `png/` | Rendered PNGs: full at 2400/1200/600, mark at 1024/512/256/64, favicon at 512/180/32, plus a white-background full logo |

TODO - record the palette (hex values) and the provenance of the artwork (original file, date, how it was produced).

## Scripts

- `pnpm generate:logo-variants` - derive the mono-black, mono-white and favicon SVGs from the primary SVGs
- `pnpm render:svg` - render every logo SVG to PNG at each required size (via `@resvg/resvg-js`)
- `pnpm render:logos` - run both

## Local setup

```bash
pnpm install
pnpm render:logos
```

## Structure

```text
assets/
├── @@org.slug@@-assets/
│   ├── 01-brand/logos/{svg,png}/
│   ├── 02-social-media/{instagram,linkedin,youtube}/
│   ├── 03-app-store/listing/{source,iphone,ipad}/
│   └── 04-documents/
└── rendering/src/
    ├── generate-logo-variants.mjs
    └── render-svgs.mjs
```

## Governance

```bash
bash bin/install-hooks.sh          # once per clone: commit-msg + pre-commit hooks
bash bin/statutory-integrity.sh    # the gate CI runs on every PR
```

Standards live in the `@@standardsRepo@@` repository (`@@standardsPath@@`). Branch from `develop` (`<type>/<slug>`), open the PR against `develop`, and fill in every section of the PR template (including `## Docs update`). Only the `develop` -> `main` promotion targets `main`.
