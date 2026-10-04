# Contributing

Thank you for your interest. This is an open-source project maintained by **Soupler**. It is licensed under the [Apache License 2.0](LICENSE): you are free to use, modify and redistribute it - including to enforce documentation standards in your own organisation - subject to that license.

## How changes get in

Only the maintainer can push to, approve changes on, or merge into this repository. Everyone else contributes through a fork:

```
your fork: feature branch  ->  PR into develop  ->  maintainer review  ->  develop  ->  (maintainer promotes) main
```

- **Fork** the repository and branch from `develop`: `<type>/<short-slug>` where type is `feat fix docs chore tech infra`.
- **Open your PR against `develop`.** PRs targeting `main` are rejected by the `Branch Policy` check - only the maintainer's `develop` -> `main` promotion goes there.
- Branch protection applies to everyone: direct pushes and force-pushes to `main` and `develop` are refused, every change needs a pull request, the required checks (`Tests`, `PR Title`, and `Branch Policy` for `main`) must pass, and the maintainer must approve.
- First-time contributors' workflow runs need the maintainer's approval before they start.

## Before you open a PR

```bash
pnpm install   # no dependencies, but sets up the package manager
pnpm test      # must pass: it generates real organisations and runs their gates, hooks and sync
```

- **PR title** is a Conventional Commit: `type(scope): short imperative description` (`feat fix docs chore tech infra refactor test ci build perf`).
- **Every behaviour change has a test that fails without it.** Generated output is tested by generating an org and running its gate - not by asserting on strings alone.
- **Update `CHANGELOG.md`.** Bump the `package.json` version when generated output changes (patch: fixes; minor: new files or options; major: existing repos' managed files change meaning).
- **Stay generic.** No company-, product- or person-specific names, repos or examples anywhere - use neutral placeholders such as `Example Org`, `core`, `web`. The test suite checks for this.
- **Keep the generator dependency-free** (Node >= 20, plain ESM) unless there is a compelling reason, discussed in an issue first.
- Read `CLAUDE.md` for the architecture (profiles, managed vs seeded files, the renderer) before changing templates.

## Good first contributions

- A new repository **profile** (`profiles/<name>/profile.json` + `files/`) for a stack not yet covered.
- Improving an L0 standard under `profiles/product/files/docs/L0-foundation/` - bump its header `Version` so `gov sync` advises existing users.
- Hardening the Statutory Integrity gate (`profiles/_base/files/bin/statutory-integrity.mjs`), with a test per new failure mode.

## Licensing of contributions

Unless you state otherwise, any contribution you intentionally submit for inclusion is licensed under the Apache License 2.0, as described in section 5 of the license, without additional terms. By opening a PR you confirm you have the right to submit it under that license. Do not submit code or text you do not have the rights to.

## Reporting problems

- Bugs and ideas: open an issue using the templates.
- **Security vulnerabilities: do not open a public issue** - see [SECURITY.md](SECURITY.md).

## Conduct

Be respectful and constructive. Reviews are about the work. The maintainer may close discussions or block users who are abusive.
