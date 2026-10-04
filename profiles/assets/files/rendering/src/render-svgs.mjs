// Renders every logo SVG to transparent PNGs at the sizes each use needs. SVGs contain outlined shapes only
// (no live text), so output is identical on every machine with no font installed.
import fs from 'node:fs';
import path from 'node:path';
import { Resvg } from '@resvg/resvg-js';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..');
const svgDir = path.join(root, '@@org.slug@@-assets', '01-brand', 'logos', 'svg');
const pngDir = path.join(root, '@@org.slug@@-assets', '01-brand', 'logos', 'png');
fs.mkdirSync(pngDir, { recursive: true });

const WIDTHS = { full: [2400, 1200, 600], mark: [1024, 512, 256, 64], favicon: [512, 180, 32] };

function render(svg, width, background) {
  const opts = { fitTo: { mode: 'width', value: width } };
  if (background) opts.background = background;
  return new Resvg(svg, opts).render().asPng();
}

for (const file of fs.readdirSync(svgDir).filter((f) => f.endsWith('.svg')).sort()) {
  const base = file.replace(/\.svg$/, '');
  const kind = base.includes('-full-') ? 'full' : base.includes('-mark-') ? 'mark' : 'favicon';
  const svg = fs.readFileSync(path.join(svgDir, file));
  for (const width of WIDTHS[kind]) {
    fs.writeFileSync(path.join(pngDir, `${base}-${width}.png`), render(svg, width));
    console.log(`wrote ${base}-${width}.png`);
  }
  // The primary full logo also ships on solid white, for places that reject transparency.
  if (base === '@@org.slug@@-logo-full-primary') {
    fs.writeFileSync(path.join(pngDir, `${base}-on-white-2400.png`), render(svg, 2400, '#ffffff'));
    console.log(`wrote ${base}-on-white-2400.png`);
  }
}
