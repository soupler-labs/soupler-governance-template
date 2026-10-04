# @@repo.name@@

@@#if repo.description@@@@repo.description@@@@else@@TODO — one paragraph: what this repository is and who it is for.@@/if@@

Part of **@@org.name@@**. Role: @@profile.role@@.

## Governance

This repository follows @@org.name@@'s documentation-governance system. Read `CLAUDE.md` first — it is the contract for both humans and coding agents.

```bash
bash bin/install-hooks.sh          # once per clone: commit-msg + pre-commit hooks
bash bin/statutory-integrity.sh    # the gate CI runs on every PR
```

@@#if has.L0@@
Standards live in `docs/L0-foundation/`. Start with `L0-006-change-propagation-governance-v1.md` (what to edit, in what order).
@@else@@
Standards live in the `@@standardsRepo@@` repository (`@@standardsPath@@`).
@@/if@@

## Contributing

Branch from `develop` (`<type>/<slug>`), open the PR against `develop`, fill in every section of the PR template (including `## Docs update`). Only the `develop` → `main` promotion targets `main`.
