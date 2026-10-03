// Deterministic generative cover art. Same title → same cover, every build.

export const COVER_W = 1200;
export const COVER_H = 630;

function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Pattern = 'network' | 'hexdump' | 'radar' | 'waves';
const PATTERNS: Pattern[] = ['network', 'hexdump', 'radar', 'waves'];

export interface CoverArt {
  uid: string;
  pattern: Pattern;
  hue1: number;
  hue2: number;
  glows: { cx: number; cy: number; r: number; hue: number }[];
  nodes: { x: number; y: number; r: number }[];
  edges: { x1: number; y1: number; x2: number; y2: number; o: number }[];
  hexRows: { y: number; text: string; hot: number[] }[];
  rings: { r: number; o: number }[];
  center: { x: number; y: number };
  sweep: number;
  waves: { d: string; o: number }[];
  label: string;
}

export function makeCover(title: string, tags: string[] = []): CoverArt {
  const seed = hash(title);
  const r = rng(seed);
  const pattern = PATTERNS[seed % PATTERNS.length];
  // Warm family: orange through amber to gold, with mint as the occasional cool
  // counterpoint. Narrow band so covers stay on-palette with the site accents.
  const HUES = [22, 28, 35, 43, 18, 30, 40, 25, 165];
  const hue1 = HUES[Math.floor(r() * HUES.length)] + Math.floor(r() * 8);
  // Second hue is either a nearby warm tone or the mint counterpoint — never the
  // free +20..65 drift, which lands on yellow-green and reads olive.
  const hue2 = r() < 0.35 ? 162 + Math.floor(r() * 10) : (hue1 + 8 + Math.floor(r() * 16)) % 360;

  const glows = Array.from({ length: 3 }, (_, i) => ({
    cx: r() * COVER_W,
    cy: r() * COVER_H,
    r: 220 + r() * 260,
    hue: i % 2 ? hue2 : hue1,
  }));

  // network: random nodes, connect near neighbours
  const nodes: CoverArt['nodes'] = [];
  const edges: CoverArt['edges'] = [];
  if (pattern === 'network') {
    for (let i = 0; i < 26; i++) nodes.push({ x: r() * COVER_W, y: r() * COVER_H, r: 2 + r() * 4 });
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
        if (d < 260) {
          edges.push({ x1: nodes[i].x, y1: nodes[i].y, x2: nodes[j].x, y2: nodes[j].y, o: 0.5 * (1 - d / 260) });
        }
      }
    }
  }

  // hexdump: rows of bytes derived from the title, a few highlighted
  const hexRows: CoverArt['hexRows'] = [];
  if (pattern === 'hexdump') {
    const bytes = new TextEncoder().encode(title.padEnd(16 * 12, title + ' '));
    for (let row = 0; row < 12; row++) {
      const chunk = Array.from(bytes.slice(row * 16, row * 16 + 16));
      const off = (row * 16).toString(16).padStart(8, '0');
      const hex = chunk.map((b) => b.toString(16).padStart(2, '0')).join(' ');
      const hot = chunk.map((_, i) => i).filter(() => r() < 0.12);
      hexRows.push({ y: 70 + row * 42, text: `${off}  ${hex}`, hot });
    }
  }

  // radar: concentric rings around an off-centre point
  const center = { x: COVER_W * (0.55 + r() * 0.35), y: COVER_H * (0.3 + r() * 0.5) };
  const rings: CoverArt['rings'] = [];
  if (pattern === 'radar') {
    for (let i = 1; i <= 9; i++) rings.push({ r: i * 70, o: 0.55 - i * 0.05 });
  }
  const sweep = r() * 360;

  // waves: stacked sine paths
  const waves: CoverArt['waves'] = [];
  if (pattern === 'waves') {
    const amp = 20 + r() * 40;
    const freq = 0.004 + r() * 0.006;
    for (let i = 0; i < 16; i++) {
      const base = 60 + i * 36;
      const phase = i * 0.35 + r() * 0.2;
      let d = `M0 ${base.toFixed(1)}`;
      for (let x = 0; x <= COVER_W; x += 24) {
        const y = base + Math.sin(x * freq + phase) * amp * (0.4 + (i / 16) * 0.8);
        d += ` L${x} ${y.toFixed(1)}`;
      }
      waves.push({ d, o: 0.15 + (i / 16) * 0.45 });
    }
  }

  return {
    uid: `c${seed.toString(36)}`,
    pattern,
    hue1,
    hue2,
    glows,
    nodes,
    edges,
    hexRows,
    rings,
    center,
    sweep,
    waves,
    label: tags[0] ? `#${tags[0]}` : '',
  };
}
