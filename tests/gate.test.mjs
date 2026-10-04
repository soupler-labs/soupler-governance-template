import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { newOrg, sh } from './helpers.mjs';

const sive = (cwd) => sh('bash', ['bin/statutory-integrity.sh'], { cwd });
const fresh = () => path.join(newOrg(), 'platform');

test('SIVE fails on an unregistered document, including inside a subfolder', () => {
  const repo = fresh();
  const sub = path.join(repo, 'docs/L5-operations/runbooks');
  fs.mkdirSync(sub, { recursive: true });
  const src = fs.readFileSync(path.join(repo, 'docs/L5-operations/L5-001-feature-test-playbook-v1.md'), 'utf8').replaceAll('L5-001-feature-test-playbook-v1', 'L5-002-deploy-runbook-v1');
  fs.writeFileSync(path.join(sub, 'L5-002-deploy-runbook-v1.md'), src);
  const r = sive(repo);
  assert.notEqual(r.status, 0);
  assert.match(r.stdout, /L5-002-deploy-runbook-v1\.md: not registered/);
});

test('SIVE fails when a registry row version is stale relative to the file', () => {
  const repo = fresh();
  const f = path.join(repo, 'docs/L0-foundation/L0-006-change-propagation-governance-v1.md');
  fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replace('| Version | v1 |', '| Version | v2 |'));
  const r = sive(repo);
  assert.notEqual(r.status, 0);
  assert.match(r.stdout, /says L0-006-change-propagation-governance-v1 is v1, but the file itself is v2/);
});

test('SIVE fails when the registry date is stale', () => {
  const repo = fresh();
  const f = path.join(repo, 'docs/L3-architecture/L3-001-system-architecture-v1.md');
  fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replace(/\| Last Updated \| [\d-]+ \|/, '| Last Updated | 2031-01-01 |'));
  assert.match(sive(repo).stdout, /last updated .* but the file says 2031-01-01/);
});

test('SIVE fails on a stale registry row pointing at a deleted file', () => {
  const repo = fresh();
  fs.rmSync(path.join(repo, 'docs/L4-infrastructure/L4-001-local-dev-setup-v1.md'));
  assert.match(sive(repo).stdout, /stale row "L4-001-local-dev-setup-v1"/);
});

test('SIVE fails on a Document ID that does not match its filename and on missing header fields', () => {
  const repo = fresh();
  const f = path.join(repo, 'docs/L3-architecture/L3-001-system-architecture-v1.md');
  fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replace('| Document ID | L3-001-system-architecture-v1 |', '| Document ID | wrong |').replace(/\| Owner \|.*\n/, ''));
  const out = sive(repo).stdout;
  assert.match(out, /Document ID "wrong" does not match/);
  assert.match(out, /missing "Owner"/);
});

test('SIVE fails on an empty CHANGELOG and a missing layer registry', () => {
  const repo = fresh();
  fs.writeFileSync(path.join(repo, 'CHANGELOG.md'), '');
  fs.rmSync(path.join(repo, 'docs/L2-product/L2-000-artifact-registry-v1.md'));
  const out = sive(repo).stdout;
  assert.match(out, /CHANGELOG\.md exists but is empty/);
  assert.match(out, /L2-product: no L2-000-artifact-registry/);
});

function commit(repo, message) {
  const env = { ...process.env, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t' };
  const f = path.join(repo, 'msg.txt');
  fs.writeFileSync(f, message);
  return sh('bash', ['.githooks/commit-msg', f], { cwd: repo, env });
}

test('commit-msg accepts conventional commits and rejects free-form subjects', () => {
  const repo = fresh();
  assert.equal(commit(repo, 'feat(auth): add otp\n').status, 0);
  assert.equal(commit(repo, 'fix: r-041 reject expired tokens\n').status, 0);
  assert.notEqual(commit(repo, 'added some stuff\n').status, 0);
  assert.notEqual(commit(repo, '[ABC-1] thing\n').status, 0);
});

test('commit-msg blocks AI attribution footers but allows discussing the tool', () => {
  const repo = fresh();
  for (const footer of ['Co-Authored-By: Claude <noreply@anthropic.com>', 'Claude-Session: abc', '🤖 Generated with [Claude Code](https://claude.com/claude-code)', 'https://claude.ai/code/session_1']) {
    assert.notEqual(commit(repo, `feat(x): y\n\n${footer}\n`).status, 0, footer);
  }
  assert.equal(commit(repo, 'docs(tooling): document how Claude Code reads CLAUDE.md\n').status, 0);
});

test('disabling noAiAttribution removes the attribution check from the hook', async () => {
  const { gov, tmp } = await import('./helpers.mjs');
  const dir = tmp();
  const cfg = path.join(dir, 'c.json');
  fs.writeFileSync(cfg, JSON.stringify({ org: { name: 'Zed' }, rules: { noAiAttribution: false }, repos: [{ name: 'app', profile: 'product' }] }));
  assert.equal(gov(['new-org', path.join(dir, 'o'), '--config', cfg]).status, 0);
  assert.doesNotMatch(fs.readFileSync(path.join(dir, 'o/app/.githooks/commit-msg'), 'utf8'), /Co-Authored-By/);
});

test('generated CI is green on a fresh scaffold: no org-licensed actions, no lockfile-dependent cache', () => {
  const repo = fresh();
  const secret = fs.readFileSync(path.join(repo, '.github/workflows/secret-scan.yml'), 'utf8');
  assert.doesNotMatch(secret, /gitleaks-action/);
  const ci = fs.readFileSync(path.join(repo, '.github/workflows/ci.yml'), 'utf8');
  assert.doesNotMatch(ci, /cache:\s*pnpm/);
  assert.match(ci, /hashFiles\('package\.json'\)/);
});

test('the scaffold commit is authored by the user running the generator, not a made-up identity', () => {
  const repo = fresh();
  const author = sh('git', ['log', '-1', '--format=%an <%ae>'], { cwd: repo }).stdout.trim();
  const configured = `${sh('git', ['config', 'user.name']).stdout.trim()} <${sh('git', ['config', 'user.email']).stdout.trim()}>`;
  assert.doesNotMatch(author, /Soupler Governance/);
  if (!configured.startsWith('<')) assert.equal(author, configured);
});

test('scaffolded repos have main and the integration branch, and finish checked out on the integration branch', () => {
  const repo = fresh();
  const branches = sh('git', ['branch', '--format=%(refname:short)'], { cwd: repo }).stdout.split('\n').filter(Boolean).sort();
  assert.deepEqual(branches, ['develop', 'main']);
  assert.equal(sh('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { cwd: repo }).stdout.trim(), 'develop');
  assert.equal(sh('git', ['config', 'core.hooksPath'], { cwd: repo }).stdout.trim(), '.githooks');
});
