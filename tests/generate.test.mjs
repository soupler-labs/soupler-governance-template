import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { newOrg, walk, sh, gov, example, tmp } from './helpers.mjs';

const org = newOrg();
const read = (...p) => fs.readFileSync(path.join(org, ...p), 'utf8');

test('every generated repo passes its own statutory-integrity gate', () => {
  for (const r of ['platform', 'website', 'assets']) {
    const res = sh('bash', ['bin/statutory-integrity.sh'], { cwd: path.join(org, r) });
    assert.equal(res.status, 0, `${r}: ${res.stdout}${res.stderr}`);
  }
});

test('no unrendered template tokens survive anywhere', () => {
  for (const f of walk(org)) {
    const t = fs.readFileSync(f, 'utf8');
    assert.doesNotMatch(t, /@@[#/]?[a-z]/i, `${f} still contains @@ tokens`);
  }
});

test('product repo has the layers, L0 standards, and agent files', () => {
  for (const p of ['docs/L0-foundation/L0-006-change-propagation-governance-v1.md', 'docs/L0-foundation/L0-009-engineering-principles-v1.md',
    'docs/L3-architecture/L3-000-artifact-registry-v1.md', 'CLAUDE.md', '.claude/skills/doc-governance/SKILL.md', '.claude/settings.json',
    '.githooks/commit-msg', '.github/workflows/branch-policy.yml', '.github/governance/rulesets/main-protection.json']) {
    assert.ok(fs.existsSync(path.join(org, 'platform', p)), p);
  }
  assert.ok(!fs.existsSync(path.join(org, 'platform/docs/L6-remediation')), 'unregulated org gets no L6');
});

test('non-standards repos point at the standards repo instead of copying L0', () => {
  assert.ok(!fs.existsSync(path.join(org, 'website/docs/L0-foundation')));
  assert.match(read('website/CLAUDE.md'), /\.\.\/platform\/docs\/L0-foundation/);
});

test('CLAUDE.md states the governance contract and names siblings', () => {
  const c = read('platform/CLAUDE.md');
  assert.match(c, /Golden Rule/);
  assert.match(c, /Doc-first/i);
  assert.match(c, /bin\/statutory-integrity\.sh/);
  assert.match(c, /`website`/);
  assert.match(read('assets/CLAUDE.md'), /follows, it never leads/);
});

test('rulesets are valid JSON and require every profile check', () => {
  const r = JSON.parse(read('platform/.github/governance/rulesets/main-protection.json'));
  const checks = r.rules.find((x) => x.type === 'required_status_checks').parameters.required_status_checks.map((c) => c.context);
  for (const c of ['Statutory Integrity', 'PR Metadata', 'Quality Checks', 'Tests', 'Secret Scan', 'Branch Policy']) assert.ok(checks.includes(c), c);
  const a = JSON.parse(read('assets/.github/governance/rulesets/main-develop-protection.json'));
  const ac = a.rules.find((x) => x.type === 'required_status_checks').parameters.required_status_checks.map((c) => c.context);
  assert.ok(!ac.includes('Tests'));
});

test('workflow job names equal the required check names', () => {
  const names = new Set();
  for (const f of walk(path.join(org, 'platform/.github/workflows'))) for (const m of fs.readFileSync(f, 'utf8').matchAll(/^\s{4}name: (.+)$/gm)) names.add(m[1].trim());
  for (const c of ['Statutory Integrity', 'PR Metadata', 'Quality Checks', 'Tests', 'Secret Scan', 'Branch Policy']) assert.ok(names.has(c), `no workflow job named "${c}"`);
});

test('the template contains no individual or company-specific examples', () => {
  const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
  const self = new Set([import.meta.url.replace('file://', '')]);
  for (const f of walk(root)) {
    if (self.has(f) || f.includes('/node_modules/')) continue;
    assert.doesNotMatch(fs.readFileSync(f, 'utf8'), /srivastava|sunny|galiaraa|PinGLogo|meridian/i, f);
  }
});

test('a regulated org with a renamed layer folder and a shared package generates and passes its gates', () => {
  const dir = tmp();
  const cfg = path.join(dir, 'c.json');
  fs.writeFileSync(cfg, JSON.stringify({
    org: { name: 'Example Org', regulated: true, standardsRepo: 'core' },
    layerFolders: { L3: 'L3-engineering' },
    repos: [
      { name: 'core', profile: 'product', owns: ['brand tokens'] },
      { name: 'web', profile: 'site', follows: ['core', 'content'] },
      { name: 'media', profile: 'assets', follows: ['core'] },
      { name: 'content', profile: 'package', owns: ['shared copy'] },
    ],
  }));
  const r = gov(['new-org', path.join(dir, 'o'), '--config', cfg]);
  assert.equal(r.status, 0, r.stderr);
  const o = path.join(dir, 'o');
  for (const repo of ['core', 'web', 'media', 'content']) assert.ok(fs.existsSync(path.join(o, repo, 'CLAUDE.md')), repo);
  assert.ok(fs.existsSync(path.join(o, 'core/docs/L3-engineering/L3-000-artifact-registry-v1.md')));
  assert.ok(fs.existsSync(path.join(o, 'core/docs/L7-forensics/L7-001-master-registry-v1.md')));
  const c = fs.readFileSync(path.join(o, 'core/CLAUDE.md'), 'utf8');
  assert.match(c, /L6 \/ L6\.1 \/ L7/);
  assert.match(c, /source of truth for:\*\* brand tokens/);
  for (const repo of ['core', 'web']) assert.equal(sh('bash', ['bin/statutory-integrity.sh'], { cwd: path.join(o, repo) }).status, 0, repo);
});

test('personal-account owners get a repository-admin bypass and owner-only review in the rulesets', () => {
  const dir = tmp();
  const cfg = path.join(dir, 'c.json');
  fs.writeFileSync(cfg, JSON.stringify({ org: { name: 'Solo', bypass: 'repository-admin', codeowners: '@solo', requiredReviews: 1 }, repos: [{ name: 'app', profile: 'product' }] }));
  assert.equal(gov(['new-org', path.join(dir, 'o'), '--config', cfg]).status, 0);
  const r = JSON.parse(fs.readFileSync(path.join(dir, 'o/app/.github/governance/rulesets/main-protection.json'), 'utf8'));
  assert.deepEqual(r.bypass_actors, [{ actor_id: 5, actor_type: 'RepositoryRole', bypass_mode: 'pull_request' }]);
  const pr = r.rules.find((x) => x.type === 'pull_request').parameters;
  assert.equal(pr.require_code_owner_review, true);
  assert.equal(pr.required_approving_review_count, 1);
  const bad = path.join(dir, 'bad.json');
  fs.writeFileSync(bad, JSON.stringify({ org: { name: 'X', bypass: 'everyone' }, repos: [{ name: 'a', profile: 'site' }] }));
  assert.match(gov(['new-org', path.join(dir, 'p'), '--config', bad]).stderr, /org\.bypass must be/);
});
