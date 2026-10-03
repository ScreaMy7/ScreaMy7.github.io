// Social share images (og:image). Same generative art as the on-page cover, plus the title,
// rasterised to PNG at build time because X and LinkedIn don't render SVG previews.
//
// The art is drawn from makeCover() as geometry only. Text goes through satori, which turns
// glyphs into paths using the bundled font, so the PNG looks the same on any build machine
// (sharp's own SVG text rendering would depend on whatever fonts the CI runner has).

import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import satori from 'satori';
import sharp from 'sharp';
import { makeCover, COVER_W, COVER_H } from './cover';
import { SITE } from '../consts';

export const OG_W = COVER_W;
export const OG_H = COVER_H;

const require = createRequire(import.meta.url);
const fontFile = (weight: number) =>
  readFile(require.resolve(`@fontsource/space-grotesk/files/space-grotesk-latin-${weight}-normal.woff`));

let fonts: Promise<{ name: string; data: Buffer; weight: 500 | 700; style: 'normal' }[]> | undefined;
const loadFonts = () =>
  (fonts ??= Promise.all([fontFile(500), fontFile(700)]).then(([regular, bold]) => [
    { name: 'Space Grotesk', data: regular, weight: 500, style: 'normal' },
    { name: 'Space Grotesk', data: bold, weight: 700, style: 'normal' },
  ]));

/** The cover art as a standalone SVG, without any <text> (mirrors GeneratedCover.astro). */
function artSvg(title: string, tags: string[]) {
  const c = makeCover(title, tags);
  const accent = `hsl(${c.hue1} 95% 68%)`;
  const accent2 = `hsl(${c.hue2} 95% 70%)`;
  let body = '';

  if (c.pattern === 'network') {
    body += c.edges
      .map((e) => `<line x1="${e.x1}" y1="${e.y1}" x2="${e.x2}" y2="${e.y2}" stroke="url(#line)" stroke-opacity="${e.o}" stroke-width="1.5"/>`)
      .join('');
    body += c.nodes.map((n) => `<circle cx="${n.x}" cy="${n.y}" r="${n.r}" fill="${accent}" fill-opacity="0.85"/>`).join('');
  }
  if (c.pattern === 'hexdump') {
    // Each byte as a faint block instead of glyphs; highlighted bytes as on the page.
    for (const row of c.hexRows) {
      for (let i = 0; i < 16; i++) {
        const x = 60 + (10 + i * 3) * 15.6 - 3;
        const hot = row.hot.includes(i);
        body += `<rect x="${x}" y="${row.y - 24}" width="37" height="32" rx="4" fill="${hot ? accent : '#ffffff'}" fill-opacity="${hot ? 0.35 : 0.06}"/>`;
      }
    }
  }
  if (c.pattern === 'radar') {
    body += c.rings
      .map((r) => `<circle cx="${c.center.x}" cy="${c.center.y}" r="${r.r}" fill="none" stroke="${accent}" stroke-opacity="${r.o}" stroke-width="1.5"/>`)
      .join('');
    const a = (c.sweep * Math.PI) / 180;
    body += `<line x1="${c.center.x}" y1="${c.center.y}" x2="${c.center.x + 700 * Math.cos(a)}" y2="${c.center.y + 700 * Math.sin(a)}" stroke="${accent2}" stroke-width="3" stroke-opacity="0.9"/>`;
    body += `<circle cx="${c.center.x}" cy="${c.center.y}" r="7" fill="${accent2}"/>`;
  }
  if (c.pattern === 'waves') {
    body += `<g fill="none" stroke="url(#line)" stroke-width="2">${c.waves.map((w) => `<path d="${w.d}" stroke-opacity="${w.o}"/>`).join('')}</g>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_W}" height="${OG_H}" viewBox="0 0 ${COVER_W} ${COVER_H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="hsl(${c.hue1} 28% 14%)"/><stop offset="1" stop-color="hsl(${c.hue2} 32% 9%)"/>
    </linearGradient>
    ${c.glows
      .map(
        (g, i) => `<radialGradient id="g${i}">
      <stop offset="0" stop-color="hsl(${g.hue} 95% 60%)" stop-opacity="0.55"/><stop offset="1" stop-color="hsl(${g.hue} 95% 60%)" stop-opacity="0"/>
    </radialGradient>`
      )
      .join('')}
    <linearGradient id="line" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${accent}"/><stop offset="1" stop-color="${accent2}"/>
    </linearGradient>
    <linearGradient id="scrim" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#16191f" stop-opacity="0.92"/><stop offset="0.75" stop-color="#16191f" stop-opacity="0.55"/><stop offset="1" stop-color="#16191f" stop-opacity="0.2"/>
    </linearGradient>
  </defs>
  <rect width="${COVER_W}" height="${COVER_H}" fill="url(#bg)"/>
  ${c.glows.map((g, i) => `<circle cx="${g.cx}" cy="${g.cy}" r="${g.r}" fill="url(#g${i})"/>`).join('')}
  ${body}
  <rect width="${COVER_W}" height="${COVER_H}" fill="url(#scrim)"/>
</svg>`;
}

// Minimal element builder for satori (it takes React-shaped objects; no React needed).
type Node = { type: string; props: { style?: Record<string, unknown>; children?: unknown } };
const h = (type: string, style: Record<string, unknown>, children?: unknown): Node => ({
  type,
  props: { style, children },
});

/** Title, kicker and footer, as a transparent SVG with text converted to paths. */
async function textSvg(title: string, kicker: string, label: string) {
  const size = title.length <= 45 ? 72 : title.length <= 80 ? 60 : 50;
  return satori(
    h('div', { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', height: '100%', padding: '64px 72px' }, [
      h('div', { display: 'flex', fontSize: 30, fontWeight: 500, color: '#ff8a4c', letterSpacing: 1 }, kicker),
      h('div', { display: 'flex', fontSize: size, fontWeight: 700, color: '#f1ebd9', lineHeight: 1.12, maxWidth: 1000 }, title),
      h('div', { display: 'flex', justifyContent: 'space-between', fontSize: 28, fontWeight: 500, color: 'rgba(241,235,217,0.75)' }, [
        h('div', { display: 'flex' }, new URL(SITE.url).host),
        h('div', { display: 'flex', color: '#6ee7c7' }, label),
      ]),
    ]),
    { width: OG_W, height: OG_H, fonts: await loadFonts() }
  );
}

/** A 1200×630 PNG share image for a page. */
export async function renderOgImage({ title, kicker, tags = [] }: { title: string; kicker: string; tags?: string[] }) {
  const label = tags[0] ? `#${tags[0]}` : '';
  const [art, text] = await Promise.all([artSvg(title, tags), textSvg(title, kicker, label)]);
  return sharp(Buffer.from(art))
    .composite([{ input: Buffer.from(text) }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}
