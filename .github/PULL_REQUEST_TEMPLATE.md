## Summary

<!-- Concise summary bullets. -->
- 

## Issues

- Closes #<!-- issue number -->
- Relates to #<!-- optional -->

## Ship Decision

- Review: `<!-- command or reviewer used, e.g. /project:review -->`
- Head SHA: `<!-- replace with current branch head SHA; update on every follow-up commit -->`
- Merge when checks are green

## Test plan

- `<!-- command, e.g. bash bin/statutory-integrity.sh -->`

## Merge notes

- <!-- optional notes / relevant exceptions -->

## Docs update

- Status: `<!-- UPDATED or EXEMPT -->`
- Notes: <!-- list updated docs or explain the exemption -->

> Keep the exact `- Status:` / `- Notes:` bullet format for consistency with governance review.

---

## Self-Review

> Run the relevant review before raising this PR. Record the verdict below.
> If you push follow-up commits after opening the PR, refresh this body before requesting review again.
> CI requires `## Issues` to contain a real issue reference.

### Review Verdict

**Command run**: <!-- e.g. /project:review, /project:audit, /project:plan -->

**Reviewer(s) dispatched**: <!-- e.g. reviewer, architect, security -->

**Ship decision**: <!-- APPROVED / APPROVED WITH CONDITIONS / BLOCKED -->

**Findings addressed** (paste critical/high findings and how you resolved them, or "none"):
```
(findings here)
```

**Residual risks** (use one label per item: `Tracked by #...`, `Waived: ...`, `Operational: ...`, or `none`):
```
(residual risks here)
```

---

## Checklist

### Branch

- [ ] This PR is from a feature branch, not a direct push to `develop` or `main`
- [ ] Branch name follows governance convention: `<type>/<story-id>-<slug>`
- [ ] If this PR changed after opening, Summary, Issues, Ship Decision, Test plan, and Merge notes were refreshed before re-review

### Code

- [ ] All new `.md` artifacts registered in their layer's `-000-artifact-registry`
- [ ] `bash bin/statutory-integrity.sh` passes locally
- [ ] `bash bin/governance-strict-audit.sh` passes locally
- [ ] `CHANGELOG.md` updated
- [ ] Tests added or updated (if applicable)
- [ ] No secrets committed

### Architecture

- [ ] Related L0-L7 artifacts updated or "no doc impact" explained

## Risk and rollback

<!-- Required for runtime, CI, or governance changes. -->

- Risk:
- Rollback:

## Notes for reviewer

<!-- Optional context, screenshots, or follow-up items -->
