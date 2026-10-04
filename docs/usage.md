# Usage

Prerequisites: Node ≥ 20, git; `gh` (authenticated) only for `--github`. Check with `node bin/gov.mjs doctor`.

## 0. Interactive (easiest)

```bash
pnpm generate        # same as: node bin/gov.mjs create   (aliases: generate, init)
```

Asks for: organisation name, header owner, GitHub org, the folder to scaffold into, regulated or not, integration branch, AI-attribution rule, then each repository (name, type, description, what it follows, what it is the source of truth for), which repo holds the L0 standards, package manager and Node version, and whether to publish to GitHub. Shows a summary and asks before writing anything; answering `n` at the end writes nothing.

## 1. New organisation (non-interactive)

```bash
cp examples/new-org.governance.json my-org.json     # edit org + repos
node bin/gov.mjs new-org ~/code/my-org --config my-org.json
# or flags:
node bin/gov.mjs new-org ~/code/my-org --name "Example Org" --repos platform:product,website:site,assets:assets --regulated
```

Creates `~/code/my-org/{governance.json, platform/, website/, assets/}`; each repo is `git init`-ed on `main` with one commit, a `develop` branch, hooks path set, and a passing governance gate. Add `--dry-run` to preview.

### Publishing to GitHub (outward-facing — always confirmed)

```bash
node bin/gov.mjs new-org ~/code/my-org --config my-org.json --github      # shows the plan, asks y/N
node bin/gov.mjs new-org … --github --yes                                 # unattended
node bin/gov.mjs github ~/code/my-org/platform                            # rulesets only, for an existing remote
```

Order matters and is handled: create repo → push `main` and `develop` → set default branch → apply rulesets (rulesets would block the initial push if applied first).

## 2. Add a repo later

```bash
node bin/gov.mjs add-repo mobile-kit --profile package --org-dir ~/code/my-org --description "Shared kit"
```

Every sibling's `Sibling repositories` section and `L0-010` topology refresh automatically.

## 3. Adopt into an existing repo

```bash
node bin/gov.mjs adopt ~/code/my-repo --config governance.json --repo platform --dry-run
node bin/gov.mjs adopt ~/code/my-repo --config governance.json --repo platform
```

Writes missing **managed** files; where a managed file already exists and differs, writes `<file>.governance-new` for review and touches nothing. Docs, `CLAUDE.md`, README and CHANGELOG are untouched unless you pass `--docs` (and even then only if absent).

## 4. Keep repos current

```bash
node bin/gov.mjs sync ~/code/my-org/platform --check     # exit 1 on drift (use in a scheduled job)
node bin/gov.mjs sync ~/code/my-org/platform             # apply
```

Rules: untouched managed files update; edited ones become `.governance-new`; `--force` overwrites; seeded files are never rewritten except their `gov:begin/end` regions; improved L0 standards are reported as **ADVISORY** (diff and merge by hand — they carry your registry rows).

## 5. After generating

```bash
cd my-org/platform
bash bin/install-hooks.sh                 # commit-msg + pre-commit
bash bin/statutory-integrity.sh           # the gate CI runs
```

Then fill the `TODO`s in `CLAUDE.md` (project, stack, apps map) — the agent navigates by them.

## Config reference (`governance.json`)

| Key | Meaning |
|---|---|
| `org.name` `github` `owner` `copyright` `license` | identity used in headers and docs (never an individual's name by default) |
| `org.regulated` | adds L6 / L6.1 / L7 (audit, execution, forensics) |
| `org.standardsRepo` | the one repo that holds L0 (default: first `product` repo) |
| `org.defaultBranch` | `develop` (default) or `main` |
| `org.requiredReviews` | approvals required by the rulesets (default 0) |
| `org.codeowners` | e.g. `@example-org/maintainers` → `.github/CODEOWNERS` |
| `layerFolders` | rename a layer folder, e.g. `{ "L3": "L3-engineering" }` |
| `rules.noAiAttribution` | hook + CI block AI attribution (default true) |
| `rules.releasePrTitle` | prefix for `develop`→`main` PRs (default `release`) |
| `rules.requireDocsUpdate` | CI requires the `## Docs update` block (default true) |
| `commands` `stack` | lint/type-check/test/install commands, node/pnpm versions → CI and CLAUDE.md |
| `repos[].profile` | `product` · `site` · `assets` · `package` |
| `repos[].owns` / `follows` | source-of-truth direction, rendered into sibling sections |
| `repos[].layers` | override the profile's layer set |

## Extending

- **New profile**: `profiles/<name>/profile.json` (`role`, `layers`, `regulatedLayers`, `requiredChecks`, `managed`, `conditional`, `exclude`) + `files/`.
- **New standard doc**: add `LL-NNN-slug-v1.md` under the profile's `files/docs/<layer>/` — registries pick it up automatically. Bump its header `Version` when you improve it so `sync` advises.
- **New check**: add the workflow job, its `name` to `requiredChecks`, run tests.
