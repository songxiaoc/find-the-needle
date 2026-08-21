/**
 * gen-brand-assets.mjs — programmatic brand asset generator (no image API needed)
 *
 * Generates:
 *   public/og-image.png   1200×630  social preview card
 *   public/logo.png       400×80    horizontal wordmark
 *   public/favicon.png    256×256   square emblem
 *   public/favicon.ico    32×32     ICO (browsers request this first)
 *
 * Usage:
 *   node scripts/gen-brand-assets.mjs \
 *     --game "Grow a Garden 2" \
 *     --short "GaG2" \
 *     --domain "grow-a-garden-2.xyz" \
 *     --color "#2BB24C" \
 *     --tagline "Codes, beginner guide, seeds, pets & mutations"
 *
 * Optional emblem PNG:
 *     --emblem path/to/emblem.png
 *   When given, the emblem PNG becomes the favicon (square) and the logo mark
 *   (emblem + wordmark). Without it, falls back to the programmatic SVG glyphs.
 *
 * Run after you set the site name, short name, domain, and accent color.
 */

import { createHash } from 'crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 ? process.argv[i + 1] : fallback;
}

const game = arg('game', 'Example Game');
const short = arg(
  'short',
  game
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
);
const domain = arg('domain', 'example.com');
const color = arg('color', '#6366F1');
const tagline = arg('tagline', `${game} guides, codes &amp; reference`);
const emblemPath = arg('emblem', null);
const emblem =
  emblemPath && existsSync(resolve(emblemPath)) ? resolve(emblemPath) : null;
if (emblemPath && !emblem)
  console.warn(
    `! --emblem ${emblemPath} not found; falling back to programmatic glyphs`
  );

const BG = '#0A0E14';
const SURFACE = '#131A24';
const TEXT = '#E8ECF1';
const DIM = '#94A0AE';
const OUTLINE = '#2A3849';

// Escape & for SVG text content
function esc(s) {
  return s.replace(/&(?!amp;|lt;|gt;|quot;|apos;)/g, '&amp;');
}
function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

// ── OG IMAGE 1200×630 ───────────────────────────────────────────────────────
function ogSvg() {
  const sub = esc(tagline.length > 62 ? tagline.slice(0, 60) + '…' : tagline);
  const words = game.split(' ');
  let line1 = game,
    line2 = '';
  if (game.length > 14 && words.length > 1) {
    const mid = Math.ceil(words.length / 2);
    line1 = words.slice(0, mid).join(' ');
    line2 = words.slice(mid).join(' ');
  }
  const titleY1 = line2 ? 210 : 280;
  const titleY2 = titleY1 + 100;
  const subY = (line2 ? titleY2 : titleY1) + 80;
  const chipY = subY + 60;

  return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${BG}"/>
      <stop offset="100%" stop-color="#0D1520"/>
    </linearGradient>
    <linearGradient id="glow" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${color}" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="0" y="0" width="6" height="630" fill="${color}"/>
  <rect x="0" y="0" width="1200" height="4" fill="${color}" opacity="0.5"/>
  <line x1="0" y1="160" x2="1200" y2="160" stroke="${OUTLINE}" stroke-width="1" opacity="0.4"/>
  <line x1="0" y1="490" x2="1200" y2="490" stroke="${OUTLINE}" stroke-width="1" opacity="0.4"/>
  <rect x="860" y="0" width="340" height="630" fill="${SURFACE}" opacity="0.5"/>
  <rect x="860" y="0" width="340" height="630" fill="url(#glow)"/>
  <text x="60" y="100" font-family="ui-monospace,monospace" font-size="13"
    font-weight="600" letter-spacing="0.16em" fill="${color}">${esc(domain.toUpperCase())}</text>
  <text x="60" y="${titleY1}" font-family="ui-sans-serif,system-ui,sans-serif"
    font-size="88" font-weight="700" fill="${TEXT}" letter-spacing="-0.03em">${esc(line1)}</text>
  ${
    line2
      ? `<text x="60" y="${titleY2}" font-family="ui-sans-serif,system-ui,sans-serif"
    font-size="88" font-weight="700" fill="${color}" letter-spacing="-0.03em">${esc(line2)}</text>`
      : ''
  }
  <text x="60" y="${subY}" font-family="ui-sans-serif,system-ui,sans-serif"
    font-size="22" fill="${DIM}" letter-spacing="-0.01em">${sub}</text>
  <rect x="60" y="${chipY}" width="112" height="32" fill="${SURFACE}" stroke="${OUTLINE}" stroke-width="1"/>
  <text x="116" y="${chipY + 21}" font-family="ui-monospace,monospace" font-size="11"
    font-weight="600" fill="${color}" text-anchor="middle" letter-spacing="0.1em">GUIDES</text>
  <rect x="184" y="${chipY}" width="112" height="32" fill="${SURFACE}" stroke="${OUTLINE}" stroke-width="1"/>
  <text x="240" y="${chipY + 21}" font-family="ui-monospace,monospace" font-size="11"
    font-weight="600" fill="${DIM}" text-anchor="middle" letter-spacing="0.1em">BUILDS</text>
</svg>`;
}

// ── LOGO 400×80 ─────────────────────────────────────────────────────────────
function logoSvg() {
  return `<svg width="400" height="80" viewBox="0 0 400 80" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="80" fill="transparent"/>
  <rect x="0" y="16" width="8" height="48" fill="${color}"/>
  <rect x="14" y="28" width="8" height="36" fill="${color}" opacity="0.6"/>
  <text x="36" y="54" font-family="ui-sans-serif,system-ui,sans-serif"
    font-size="36" font-weight="700" fill="${TEXT}" letter-spacing="-0.03em">${esc(game)}</text>
</svg>`;
}

// ── FAVICON 256×256 ──────────────────────────────────────────────────────────
function faviconSvg() {
  return `<svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
  <rect width="256" height="256" fill="${BG}"/>
  <rect x="0" y="0" width="256" height="8" fill="${color}"/>
  <rect x="0" y="0" width="8" height="256" fill="${color}"/>
  <text x="128" y="168" font-family="ui-sans-serif,system-ui,sans-serif"
    font-size="110" font-weight="800" fill="${color}" text-anchor="middle"
    letter-spacing="-0.04em">${esc(short.slice(0, 2))}</text>
</svg>`;
}

// ── EMBLEM-AWARE BUILDERS ────────────────────────────────────────────────────
// Square favicon PNG at `size`: the AI emblem (cover-cropped) if provided, else SVG glyph.
async function faviconPng(size) {
  if (emblem)
    return sharp(emblem).resize(size, size, { fit: 'cover' }).png().toBuffer();
  return sharp(Buffer.from(faviconSvg())).resize(size, size).png().toBuffer();
}

// Logo 400×80: emblem mark + wordmark when emblem is provided, else SVG wordmark.
async function logoPng() {
  if (!emblem)
    return sharp(Buffer.from(logoSvg())).resize(400, 80).png().toBuffer();
  const mark = await sharp(emblem)
    .resize(64, 64, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
  const wordmark = `<svg width="400" height="80" viewBox="0 0 400 80" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="80" fill="transparent"/>
  <text x="84" y="54" font-family="ui-sans-serif,system-ui,sans-serif"
    font-size="34" font-weight="700" fill="${TEXT}" letter-spacing="-0.03em">${esc(game)}</text>
</svg>`;
  return sharp(Buffer.from(wordmark))
    .composite([{ input: mark, left: 8, top: 8 }])
    .png()
    .toBuffer();
}

// Wrap a PNG buffer in a minimal ICO container.
// ICO format supports embedded PNG natively (since Windows Vista / all modern browsers).
function pngToIco(pngBuf, size) {
  const dataOffset = 6 + 16;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  const dir = Buffer.alloc(16);
  dir.writeUInt8(size >= 256 ? 0 : size, 0);
  dir.writeUInt8(size >= 256 ? 0 : size, 1);
  dir.writeUInt8(0, 2);
  dir.writeUInt8(0, 3);
  dir.writeUInt16LE(1, 4);
  dir.writeUInt16LE(32, 6);
  dir.writeUInt32LE(pngBuf.length, 8);
  dir.writeUInt32LE(dataOffset, 12);
  return Buffer.concat([header, dir, pngBuf]);
}

async function main() {
  const publicDir = join(ROOT, 'public');
  mkdirSync(publicDir, { recursive: true });
  // One approved emblem is composited into OG, favicon, and logo; fallback stays unapproved.
  let og = sharp(Buffer.from(ogSvg())).resize(1200, 630);
  if (emblem) {
    const ogMark = await sharp(emblem)
      .resize(270, 270, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer();
    og = og.composite([{ input: ogMark, left: 895, top: 180 }]);
  } else {
    const fallbackMark = Buffer.from(
      `<svg width="270" height="270" xmlns="http://www.w3.org/2000/svg"><text x="135" y="180" font-family="ui-sans-serif,system-ui,sans-serif" font-size="138" font-weight="800" fill="${color}" opacity="0.22" text-anchor="middle">${esc(short.slice(0, 2))}</text></svg>`
    );
    og = og.composite([{ input: fallbackMark, left: 895, top: 180 }]);
  }
  await og.png().toFile(join(publicDir, 'og-image.png'));
  console.log('✓ public/og-image.png');

  writeFileSync(join(publicDir, 'logo.png'), await logoPng());
  console.log(`✓ public/logo.png${emblem ? ' (emblem mark)' : ''}`);

  writeFileSync(join(publicDir, 'favicon.png'), await faviconPng(256));
  console.log(`✓ public/favicon.png${emblem ? ' (emblem)' : ''}`);

  const ico32 = await faviconPng(32);
  writeFileSync(join(publicDir, 'favicon.ico'), pngToIco(ico32, 32));
  console.log('✓ public/favicon.ico');

  writeFileSync(join(publicDir, 'apple-touch-icon.png'), await faviconPng(180));
  writeFileSync(join(publicDir, 'icon-192.png'), await faviconPng(192));
  writeFileSync(join(publicDir, 'icon-512.png'), await faviconPng(512));
  console.log('✓ public/apple-touch-icon.png + icon-192.png + icon-512.png');

  const sourcePath = emblem || join(publicDir, 'favicon.png');
  const sourceHash = sha256(readFileSync(sourcePath));
  const assetDefs = {
    logo: ['public/logo.png', '/logo.png', 'image/png', 400, 80],
    favicon: ['public/favicon.png', '/favicon.png', 'image/png', 256, 256],
    faviconIco: [
      'public/favicon.ico',
      '/favicon.ico',
      'image/x-icon',
      null,
      null,
    ],
    appleTouchIcon: [
      'public/apple-touch-icon.png',
      '/apple-touch-icon.png',
      'image/png',
      180,
      180,
    ],
    icon192: ['public/icon-192.png', '/icon-192.png', 'image/png', 192, 192],
    icon512: ['public/icon-512.png', '/icon-512.png', 'image/png', 512, 512],
    ogImage: ['public/og-image.png', '/og-image.png', 'image/png', 1200, 630],
  };
  const assets = {};
  for (const [key, [path, url, mediaType, width, height]] of Object.entries(
    assetDefs
  )) {
    const raw = readFileSync(join(ROOT, path));
    assets[key] = {
      path,
      url,
      sha256: sha256(raw),
      sourceSha256: sourceHash,
      mediaType,
    };
    if (width) Object.assign(assets[key], { width, height });
  }
  const manifest = {
    schemaVersion: 2,
    siteName: game,
    identity: {
      symbol: emblem
        ? 'approved generated emblem'
        : 'programmatic fallback glyph',
      primary: color,
      secondary: color,
      background: BG,
    },
    source: {
      path: emblem ? emblemPath : 'public/favicon.png',
      sha256: sourceHash,
      approved: Boolean(emblem),
    },
    assets,
    expectedText: [game],
    forbiddenText: [
      'Game Guide',
      'GG',
      'YOUR-GAME.COM',
      'fan wiki template',
      'Example Game',
      'Placeholder',
    ],
  };
  mkdirSync(join(ROOT, 'WORK/ui'), { recursive: true });
  writeFileSync(
    join(ROOT, 'WORK/ui/brand-manifest.json'),
    JSON.stringify(manifest, null, 2) + '\n'
  );
  console.log(`✓ WORK/ui/brand-manifest.json approved=${Boolean(emblem)}`);

  console.log(
    `\nDone (${emblem ? 'AI emblem' : 'programmatic glyphs'}). Review public/ before deploying.`
  );
  console.log(
    'Re-run: node scripts/gen-brand-assets.mjs --game "..." --color "#..." [--emblem path/to/emblem.png]'
  );
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
