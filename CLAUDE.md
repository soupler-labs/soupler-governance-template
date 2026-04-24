# {{PROJECT_NAME}} — Project Instructions

## Project

TODO — describe what this project does (1–2 sentences).

- **Stack**: TODO — list your stack (e.g. Next.js, Node.js, PostgreSQL)
- **Monorepo**: TODO — list your apps/packages (or delete if single-repo)

## Active Documentation Layers

| Layer | Folder | Purpose |
|---|---|---|
| L0 | `docs/L0-foundation/` | Naming conventions, document templates |
| L1 | `docs/L1-strategy/` | Vision, positioning, business objectives |
| L2 | `docs/L2-product/` | Requirements, PRDs, user stories |
| L2.5 | `docs/L2.5-design-ux/` | UX flows, component specs |
| L2.6 | `docs/L2.6-delivery-stories/` | Sprint backlogs, delivery tracking |
| L3 | `docs/L3-architecture/` | ADRs, system design, API contracts |
| L4 | `docs/L4-infrastructure/` | CI/CD, deployment, cloud configuration |
| L5 | `docs/L5-operations/` | Runbooks, incident response |
| L6 | `docs/L6-remediation/` | SEV audit findings and corrective plans |
| L6.1 | `docs/L6.1-remediation-execution/` | Sprint execution workspaces |
| L7 | `docs/L7-forensics/` | Chain of custody — audit → execution → PRs |

## Governance Rules

- Every new `.md` artifact must be registered in that layer's `-000-artifact-registry` in the same commit
- SIVE (`bin/statutory-integrity.sh`) enforces this on every PR — unregistered files block merge
- Always update `CHANGELOG.md` when making code or doc changes
- Follow the naming convention in `docs/L0-foundation/L0-002-naming-convention-v1.md`

## Behaviour

TODO — describe how you want the AI assistant to work in this project.

Example:
- Work directly — no meta-layer orchestration
- Write code, run commands, verify output
- Classify each change first: strategic (L1), product (L2), engineering (L3), or operational (L0/L4/L5)
- For engineering changes, update the owning L3 artifact when behaviour or contracts change
