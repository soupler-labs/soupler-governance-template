// Minimal template renderer. Delimiters are @@ … @@ rather than {{ … }} because the files we render
// are GitHub Actions workflows and shell scripts, which are full of ${{ … }} and ${…}.
//
//   @@path.to.value@@                       substitution (unknown path = hard error, never silent)
//   @@#if path@@ … @@else@@ … @@/if@@       truthy / !path / path == "x" / path != "x"
//   @@#each list as item@@ … @@/each@@      iteration; `item` is in scope inside the block
//   @@#region name@@ … @@/region@@          a span that `gov sync` keeps current inside seeded files
//
// A block tag alone on its line swallows the whole line, so templates stay readable without
// leaving blank lines in the output.

const BLOCK_TAG = /^[ \t]*(@@(?:#if [^@]+|else|\/if|#each [^@]+|\/each|#region [^@]+|\/region)@@)[ \t]*(?:\r?\n|$)/gm;
const TOKEN = /@@([^@]+?)@@/g;

export class RenderError extends Error {}

function lookup(path, scopes) {
  const parts = path.split('.');
  for (let i = scopes.length - 1; i >= 0; i--) {
    let cur = scopes[i];
    let ok = true;
    for (const p of parts) {
      if (cur !== null && typeof cur === 'object' && p in cur) cur = cur[p];
      else { ok = false; break; }
    }
    if (ok) return { found: true, value: cur };
  }
  return { found: false, value: undefined };
}

function truthy(v) {
  if (Array.isArray(v)) return v.length > 0;
  return Boolean(v);
}

function evalCond(expr, scopes) {
  const e = expr.trim();
  let m = e.match(/^(.+?)\s*(==|!=)\s*"([^"]*)"$/);
  if (m) {
    const { value } = lookup(m[1].trim(), scopes);
    return m[2] === '==' ? String(value ?? '') === m[3] : String(value ?? '') !== m[3];
  }
  if (e.startsWith('!')) return !truthy(lookup(e.slice(1).trim(), scopes).value);
  return truthy(lookup(e, scopes).value);
}

function parse(src, file) {
  const flat = src.replace(BLOCK_TAG, '$1');
  const root = { type: 'root', children: [] };
  const stack = [root];
  let last = 0;
  let m;
  TOKEN.lastIndex = 0;
  const top = () => stack[stack.length - 1];
  while ((m = TOKEN.exec(flat)) !== null) {
    if (m.index > last) top().children.push({ type: 'text', value: flat.slice(last, m.index) });
    last = m.index + m[0].length;
    const body = m[1].trim();
    if (body.startsWith('#if ')) {
      const node = { type: 'if', cond: body.slice(4), then: [], else: [], inElse: false, get children() { return this.inElse ? this.else : this.then; } };
      top().children.push(node);
      stack.push(node);
    } else if (body === 'else') {
      if (top().type !== 'if') throw new RenderError(`${file}: @@else@@ outside @@#if@@`);
      top().inElse = true;
    } else if (body === '/if') {
      if (top().type !== 'if') throw new RenderError(`${file}: unmatched @@/if@@`);
      stack.pop();
    } else if (body.startsWith('#each ')) {
      const em = body.slice(6).match(/^(\S+)\s+as\s+(\w+)$/);
      if (!em) throw new RenderError(`${file}: bad @@#each@@ "${body}" (expected "list as item")`);
      const node = { type: 'each', list: em[1], alias: em[2], children: [] };
      top().children.push(node);
      stack.push(node);
    } else if (body === '/each') {
      if (top().type !== 'each') throw new RenderError(`${file}: unmatched @@/each@@`);
      stack.pop();
    } else if (body.startsWith('#region ')) {
      const node = { type: 'region', name: body.slice(8).trim(), children: [] };
      top().children.push(node);
      stack.push(node);
    } else if (body === '/region') {
      if (top().type !== 'region') throw new RenderError(`${file}: unmatched @@/region@@`);
      stack.pop();
    } else {
      top().children.push({ type: 'var', path: body });
    }
  }
  if (last < flat.length) top().children.push({ type: 'text', value: flat.slice(last) });
  if (stack.length !== 1) throw new RenderError(`${file}: unclosed @@#${stack[stack.length - 1].type}@@ block`);
  return root;
}

function emit(nodes, scopes, file) {
  let out = '';
  for (const n of nodes) {
    if (n.type === 'text') out += n.value;
    else if (n.type === 'var') {
      const { found, value } = lookup(n.path, scopes);
      if (!found) throw new RenderError(`${file}: unknown variable "${n.path}"`);
      if (value !== null && typeof value === 'object') throw new RenderError(`${file}: "${n.path}" is not a scalar`);
      out += String(value);
    } else if (n.type === 'if') {
      out += emit(evalCond(n.cond, scopes) ? n.then : n.else, scopes, file);
    } else if (n.type === 'each') {
      const { found, value } = lookup(n.list, scopes);
      if (!found || !Array.isArray(value)) throw new RenderError(`${file}: "${n.list}" is not a list`);
      for (const item of value) out += emit(n.children, [...scopes, { [n.alias]: item }], file);
    } else if (n.type === 'region') {
      const inner = emit(n.children, scopes, file);
      out += `<!-- gov:begin ${n.name} -->\n${inner.replace(/^\n/, '').replace(/\n*$/, '\n')}<!-- gov:end ${n.name} -->\n`;
    }
  }
  return out;
}

export function render(src, ctx, file = '<template>') {
  return emit(parse(src, file).children, [ctx], file);
}

// Pulls `<!-- gov:begin x -->…<!-- gov:end x -->` spans out of rendered text.
export function extractRegions(text) {
  const regions = {};
  const re = /<!-- gov:begin (\S+) -->\n[\s\S]*?<!-- gov:end \1 -->/g;
  let m;
  while ((m = re.exec(text)) !== null) regions[m[1]] = m[0];
  return regions;
}

// Replaces regions in `local` with the freshly rendered ones. Returns the new text and the names changed.
export function applyRegions(local, rendered) {
  const fresh = extractRegions(rendered);
  const changed = [];
  let out = local;
  for (const [name, block] of Object.entries(fresh)) {
    const re = new RegExp(`<!-- gov:begin ${name} -->\\n[\\s\\S]*?<!-- gov:end ${name} -->`);
    const cur = out.match(re);
    if (cur && cur[0] !== block) {
      out = out.replace(re, () => block);
      changed.push(name);
    }
  }
  return { text: out, changed };
}
