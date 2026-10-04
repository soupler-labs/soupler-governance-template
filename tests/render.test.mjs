import test from 'node:test';
import assert from 'node:assert/strict';
import { render, applyRegions, RenderError } from '../src/render.mjs';

test('substitutes nested paths and leaves GitHub expressions alone', () => {
  assert.equal(render('a @@x.y@@ ${{ github.ref }} ${VAR}', { x: { y: 'B' } }), 'a B ${{ github.ref }} ${VAR}');
});
test('unknown variable is a hard error, never silent', () => {
  assert.throws(() => render('@@nope@@', {}), RenderError);
});
test('if / else / negation / equality', () => {
  const t = '@@#if a@@A@@else@@B@@/if@@|@@#if !a@@N@@/if@@|@@#if k == "v"@@E@@/if@@';
  assert.equal(render(t, { a: true, k: 'v' }), 'A||E');
  assert.equal(render(t, { a: false, k: 'x' }), 'B|N|');
});
test('empty list is falsy', () => {
  assert.equal(render('@@#if l@@yes@@else@@no@@/if@@', { l: [] }), 'no');
});
test('each iterates with alias in scope and can read outer scope', () => {
  assert.equal(render('@@#each l as i@@[@@i.n@@@@o@@]@@/each@@', { o: '!', l: [{ n: 1 }, { n: 2 }] }), '[1!][2!]');
});
test('block tags alone on a line leave no blank lines', () => {
  const out = render('a\n@@#if x@@\nb\n@@/if@@\nc\n', { x: true });
  assert.equal(out, 'a\nb\nc\n');
  assert.equal(render('a\n@@#if x@@\nb\n@@/if@@\nc\n', { x: false }), 'a\nc\n');
});
test('unclosed block is an error', () => {
  assert.throws(() => render('@@#if a@@x', { a: 1 }), RenderError);
});
test('regions render markers and applyRegions only touches them', () => {
  const r1 = render('top\n@@#region r@@\nv1\n@@/region@@\nbottom\n', {});
  const edited = r1.replace('top', 'MY EDIT').replace('bottom', 'MY BOTTOM');
  const r2 = render('top\n@@#region r@@\nv2\n@@/region@@\nbottom\n', {});
  const { text, changed } = applyRegions(edited, r2);
  assert.deepEqual(changed, ['r']);
  assert.match(text, /MY EDIT/);
  assert.match(text, /MY BOTTOM/);
  assert.match(text, /v2/);
  assert.doesNotMatch(text, /v1/);
});
