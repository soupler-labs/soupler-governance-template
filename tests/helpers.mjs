import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

export const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
export const GOV = path.join(ROOT, 'bin/gov.mjs');
export const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'gov-test-'));
export const gov = (args, opts = {}) => spawnSync('node', [GOV, ...args], { encoding: 'utf8', ...opts });
export const sh = (cmd, args, opts = {}) => spawnSync(cmd, args, { encoding: 'utf8', ...opts });
export const example = (name) => path.join(ROOT, 'examples', name);

export function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    if (e.name === '.git' || e.name === 'node_modules') return [];
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}

export function newOrg(config = 'new-org.governance.json') {
  const dir = tmp();
  const r = gov(['new-org', dir, '--config', example(config)]);
  if (r.status !== 0) throw new Error(`new-org failed: ${r.stderr}${r.stdout}`);
  return dir;
}
