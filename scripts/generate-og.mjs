/**
 * generate-og.mjs
 * Generates public/og-default.jpg (1200x630) for Gonca Fide's Astro site.
 *
 * Composition:
 *   1. Deep-green (#1E3320) background
 *   2. Portrait photo (public/images/gonca-fide.jpg) on the right panel (~430px wide)
 *      — resized/cropped to cover, with a soft gradient fade on the left edge
 *   3. SVG text overlay on the left ~670px
 *
 * Run: node scripts/generate-og.mjs
 * Re-runnable: always overwrites output.
 */

import sharp from 'sharp';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const W = 1200;
const H = 630;

const OUT = path.join(ROOT, 'public', 'og-default.jpg');
const PORTRAIT = path.join(ROOT, 'public', 'images', 'gonca-fide.jpg');

// ─── Dimensions ──────────────────────────────────────────────────────────────
const PORTRAIT_W = 430;    // right panel width
const PORTRAIT_X = W - PORTRAIT_W;  // 770

// ─── Colors ──────────────────────────────────────────────────────────────────
const BG        = '#1E3320';
const CREAM     = '#F5F1E8';
const ORANGE    = '#E8924A';
const LIGHT_GREEN = '#C2D8BB';

// ─── Fonts ───────────────────────────────────────────────────────────────────
// sharp/librsvg uses system fonts. Georgia is available on macOS and most Linux
// setups. Plus Jakarta Sans and Cormorant Garamond are woff2 and not directly
// loadable by rsvg, so we fall back to safe system equivalents.
const SERIF = "Georgia, 'Times New Roman', Times, serif";
const SANS  = "'Helvetica Neue', Helvetica, Arial, sans-serif";

// ─── Step 1: Resize/crop portrait to cover a 430×630 panel ──────────────────
const portraitBuf = await sharp(PORTRAIT)
  .resize(PORTRAIT_W, H, { fit: 'cover', position: 'top' })
  .toBuffer();

// ─── Step 2: Build a gradient-fade mask for the portrait left edge ───────────
// We'll composite a dark-to-transparent gradient over the portrait's left edge
// so it blends into the green background seamlessly.
const fadeW = 120;  // width of fade zone
const fadeSvg = `<svg width="${PORTRAIT_W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${BG}" stop-opacity="1"/>
      <stop offset="100%" stop-color="${BG}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="${fadeW}" height="${H}" fill="url(#fade)"/>
</svg>`;

const fadeBuf = await sharp(Buffer.from(fadeSvg)).png().toBuffer();

// Apply the fade overlay onto the portrait
const portraitWithFade = await sharp(portraitBuf)
  .composite([{ input: fadeBuf, top: 0, left: 0 }])
  .toBuffer();

// ─── Step 3: Build SVG text overlay (full 1200×630 canvas, text on left) ────
const MARGIN_L = 72;
const TEXT_MAX_W = 640;

// Vertical layout (approximate baseline positions)
// Eyebrow: y=195
// Name line 1: y=295
// Subtitle: y=360
// Spacer line (decorative): y=400
// Slogan: y=460

const textSvg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <!-- Eyebrow: uppercase tracking, orange -->
  <text
    x="${MARGIN_L}" y="205"
    font-family="${SANS}"
    font-size="16"
    font-weight="600"
    letter-spacing="4"
    fill="${ORANGE}"
    text-anchor="start"
  >CNVC SERTİFİKALI EĞİTMEN</text>

  <!-- Decorative separator under eyebrow -->
  <line
    x1="${MARGIN_L}" y1="222"
    x2="${MARGIN_L + 48}" y2="222"
    stroke="${ORANGE}" stroke-width="2" opacity="0.7"
  />

  <!-- Big name: serif, cream -->
  <text
    x="${MARGIN_L}" y="316"
    font-family="${SERIF}"
    font-size="86"
    font-weight="400"
    fill="${CREAM}"
    text-anchor="start"
  >Gonca Fide</text>

  <!-- Subtitle: sans, light green -->
  <text
    x="${MARGIN_L}" y="374"
    font-family="${SANS}"
    font-size="26"
    font-weight="300"
    fill="${LIGHT_GREEN}"
    letter-spacing="1"
    text-anchor="start"
  >Şiddetsiz İletişim Eğitmeni</text>

  <!-- Decorative rule -->
  <line
    x1="${MARGIN_L}" y1="406"
    x2="${MARGIN_L + 280}" y2="406"
    stroke="${LIGHT_GREEN}" stroke-width="1" opacity="0.4"
  />

  <!-- Slogan: serif italic, orange -->
  <text
    x="${MARGIN_L}" y="458"
    font-family="${SERIF}"
    font-size="40"
    font-style="italic"
    font-weight="400"
    fill="${ORANGE}"
    text-anchor="start"
  >"birbirine bağlar"</text>
</svg>`;

const textBuf = await sharp(Buffer.from(textSvg)).png().toBuffer();

// ─── Step 4: Compose everything ─────────────────────────────────────────────
// Layer order: green bg → portrait (right) with fade → text SVG (full canvas)
await sharp({
  create: {
    width: W,
    height: H,
    channels: 3,
    background: BG,
  }
})
  .composite([
    // Portrait panel — placed at x=PORTRAIT_X, y=0
    {
      input: portraitWithFade,
      top: 0,
      left: PORTRAIT_X,
    },
    // Text overlay — full canvas, transparent background
    {
      input: textBuf,
      top: 0,
      left: 0,
    },
  ])
  .jpeg({ quality: 92, mozjpeg: true })
  .toFile(OUT);

// ─── Step 5: Verify ──────────────────────────────────────────────────────────
const meta = await sharp(OUT).metadata();
const { size: fileBytes } = await import('fs').then(m => m.promises.stat(OUT));

console.log('');
console.log('✓ OG image generated');
console.log(`  Output : ${OUT}`);
console.log(`  Size   : ${W}×${H}  (got ${meta.width}×${meta.height})`);
console.log(`  File   : ${(fileBytes / 1024).toFixed(1)} KB`);
console.log(`  Format : ${meta.format}`);

if (meta.width !== W || meta.height !== H) {
  console.error(`ERROR: expected ${W}×${H}, got ${meta.width}×${meta.height}`);
  process.exit(1);
}
if (fileBytes < 20 * 1024) {
  console.error(`ERROR: file too small (${fileBytes} bytes) — likely corrupt`);
  process.exit(1);
}

console.log('  Status : OK');
