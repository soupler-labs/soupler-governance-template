# Branch Protection Setup

Apply these settings to `main` and `develop` after the first governance scaffold commit lands.

## Required Status Checks

- `verify`

`verify` is the recommended single required check for branch protection. It runs SIVE, strict governance audit, and optional Maven parent validation when `services/pom.xml` exists.

## Required Rules

- Require pull request before merging.
- Require status checks to pass before merging.
- Require branches to be up to date before merging.
- Require conversation resolution before merging.
- Dismiss stale approvals when new commits are pushed.
- Block force pushes.
- Block deletions.

## Optional Review Rules

- Solo founder/bootstrap flow: `0` required approvals, protected by `verify`.
- Team flow: `1` or more required approvals.
- Regulated flow: require CODEOWNERS review for L0, L4, L6, and L7 changes.

## Optional GitHub API Apply

Use after confirming repository admin permissions:

```bash
gh api \
  --method PUT \
  repos/:owner/:repo/branches/main/protection \
  --input .github/governance/branch-protection-main.json
```
