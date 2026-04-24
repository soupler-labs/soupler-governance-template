# soupler-governance-template

A reusable scaffold for the Soupler L0–L7 documentation governance system.  
Clone this repo (or use it as a GitHub Template) to bootstrap any new project with full documentation governance and CI compliance gates from day one.

---

## What's included

| Path | Purpose |
|---|---|
| `bin/statutory-integrity.sh` | SIVE — enforces doc registration on every PR |
| `bin/init-governance.sh` | Init script — stamps this scaffold into any target directory |
| `.github/workflows/governance.yml` | PR gate: SIVE + PR title/body validation |
| `.github/workflows/ci.yml` | CI pipeline stub: lint → typecheck → secret-scan → test → build → preview deploy |
| `.github/PULL_REQUEST_TEMPLATE.md` | PR template with issue reference requirement |
| `docs/L0-foundation/` | Naming conventions, document template |
| `docs/L1-strategy/` through `docs/L7-forensics/` | Empty layer registries for all 11 layers |
| `CLAUDE.md` | AI assistant instructions template |
| `CHANGELOG.md` | Changelog template |

---

## Option A — Use as a GitHub Template

1. Click **"Use this template"** on GitHub
2. Name your new repo
3. Clone it locally
4. Run `bin/init-governance.sh <your-project-name> .` to inject your project name into all placeholder tokens
5. Fill in the TODOs in `CLAUDE.md`
6. Commit: `git add . && git commit -m "chore: init L0-L7 governance scaffold"`

---

## Option B — Stamp into an existing repo

```bash
# Clone the template anywhere
git clone https://github.com/soupler-labs/soupler-governance-template /tmp/gov-template

# Run the init script pointing at your existing repo
bash /tmp/gov-template/bin/init-governance.sh my-project-name /path/to/my-existing-repo
```

The script skips any file that already exists — safe to run against a repo with existing files.

---

## SIVE — How the governance gate works

`bin/statutory-integrity.sh` is the Statutory Integrity Verification Engine. It:

1. Scans every `docs/L*/` folder
2. Verifies a `-000-artifact-registry` file exists in each folder (hard fail if missing)
3. Verifies every `.md` file in the folder is listed in that registry (hard fail if unregistered)

This runs as a required CI status check on every PR via `governance.yml`. A PR that introduces a new doc without registering it cannot merge.

**To add a new document:**
1. Create the `.md` file in the correct layer folder
2. Add a row for it in that layer's `-000-artifact-registry-v1.md`
3. Commit both in the same PR

---

## Customising the PR title pattern

In `.github/workflows/governance.yml`, the `validate-pr` job checks PR titles against:

```
^\[PROJECT-[0-9]+\] .+
```

Change `PROJECT` to your issue tracker prefix (e.g. `SOUPLER`, `APP`, `ACME`).

---

## Layer overview

| Layer | Code | Purpose |
|---|---|---|
| Foundation | L0 | Naming conventions, document templates, governance standards |
| Strategy | L1 | Vision, positioning, business objectives |
| Product | L2 | Requirements, PRDs, user stories |
| Design & UX | L2.5 | UX flows, component specs, IA |
| Delivery Stories | L2.6 | Sprint backlogs, active delivery tracking |
| Architecture | L3 | ADRs, system design, API contracts, data models |
| Infrastructure | L4 | CI/CD, deployment, cloud configuration |
| Operations | L5 | Runbooks, incident response, monitoring |
| Remediation | L6 | SEV audit findings and corrective plans |
| Remediation Execution | L6.1 | Sprint-level execution workspaces |
| Forensics | L7 | Cross-layer chain of custody |
