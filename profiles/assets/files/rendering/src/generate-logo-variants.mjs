// Derives the logo family from the two primary SVGs (the approved artwork, vectorised):
//   *-mono-black / *-mono-white  every shape one colour (print, embossing, dark or photo backgrounds)
//   favicon.svg                  the mark centred on a square canvas
// Primary SVGs are the source; everything else is generated - never hand-edit a variant.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..');
const dir = path.join(root, '@@org.slug@@-assets', '01-brand', 'logos', 'svg');

const read = (name) => fs.readFileSync(path.join(dir, name), 'utf8');
const write = (name, text) => { fs.writeFileSync(path.join(dir, name), text); console.log(`wrote ${name}`); };
const recolour = (svg, hex) => svg.replace(/fill="#[0-9a-fA-F]{6}"/g, `fill="${hex}"`);

for (const kind of ['full', 'mark']) {
  const primary = read(`@@org.slug@@-logo-${kind}-primary.svg`);
  write(`@@org.slug@@-logo-${kind}-mono-black.svg`, recolour(primary, '#000000'));
  write(`@@org.slug@@-logo-${kind}-mono-white.svg`, recolour(primary, '#ffffff'));
}

const mark = read('@@org.slug@@-logo-mark-primary.svg');
const [, w, h] = mark.match(/viewBox="0 0 (\d+) (\d+)"/).map(Number);
const side = Math.max(w, h);
const inner = mark.slice(mark.indexOf('<g '), mark.lastIndexOf('</svg>'));
write('favicon.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${side} ${side}" width="${side}" height="${side}" role="img" aria-label="@@org.name@@">` +
  `<g transform="translate(${(side - w) / 2} ${(side - h) / 2})">${inner}</g></svg>\n`);
