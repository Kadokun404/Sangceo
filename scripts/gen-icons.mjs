// Membuat apple-icon.png dan opengraph-image.png dari siluet CEO yang sama
// dengan favicon (src/app/icon.svg). Jalankan: node scripts/gen-icons.mjs
import fs from "node:fs";
import sharp from "sharp";

const INK = "#221a12";
const PAPER = "#f6efe3";
const ACCENT = "#b8860b";

// Bust siluet: kepala terangkat, bahu lebar, dasi emas.
function bust(scale, ox, oy, bleed) {
  return `<g transform="translate(${ox} ${oy}) scale(${scale})">
    <path fill="${INK}" d="M60 20c-9 0-16 7-16 16 0 6 3 11 7 14v6c0 2-2 3-4 4-13 5-22 15-22 30v${30 + bleed}h70v-${30 + bleed}c0-15-9-25-22-30-2-1-4-2-4-4v-6c4-3 7-8 7-14 0-9-7-16-16-16z"/>
    <path fill="${PAPER}" d="M50 62l10 14 10-14-4-2-6 8-6-8z"/>
    <path fill="${ACCENT}" d="M56 66h8l-3 9h-2z"/>
    <path fill="${ACCENT}" d="M59 75h4l2 16-4 6-4-6z"/>
  </g>`;
}

const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs><clipPath id="r"><rect width="120" height="120" rx="24"/></clipPath></defs>
  <rect width="120" height="120" rx="24" fill="${PAPER}"/>
  <g clip-path="url(#r)">${bust(1, 0, 0, 10)}</g>
</svg>`;

const appleSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect width="120" height="120" fill="${PAPER}"/>
  ${bust(1, 0, 0, 10)}
</svg>`;

const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs><clipPath id="c"><rect x="700" y="55" width="440" height="520" rx="36"/></clipPath></defs>
  <rect width="1200" height="630" fill="${PAPER}"/>
  <rect x="700" y="55" width="440" height="520" rx="36" fill="#efe6d4"/>
  <g clip-path="url(#c)">${bust(3.4, 655, 40, 40)}</g>
  <text x="80" y="230" font-family="DejaVu Sans, sans-serif" font-weight="bold" font-size="140" fill="${INK}">sang.ceo</text>
  <text x="84" y="310" font-family="DejaVu Sans, sans-serif" font-size="46" fill="#6b5d49">subdomain &amp; email gratis untuk project kamu</text>
  <text x="84" y="380" font-family="DejaVu Sans, sans-serif" font-size="34" fill="#8a7a62">klaim lewat pull request di GitHub</text>
  <rect x="84" y="430" width="120" height="6" rx="3" fill="${ACCENT}"/>
</svg>`;

fs.mkdirSync("tmp-gen", { recursive: true });
fs.writeFileSync("tmp-gen/icon.svg", iconSvg);
fs.writeFileSync("src/app/icon.svg", iconSvg);
fs.writeFileSync("tmp-gen/apple.svg", appleSvg);
fs.writeFileSync("tmp-gen/og.svg", ogSvg);
await sharp(Buffer.from(appleSvg)).resize(180, 180).png().toFile("src/app/apple-icon.png");
await sharp(Buffer.from(ogSvg)).png().toFile("src/app/opengraph-image.png");
console.log("ikon dibuat: icon.svg, apple-icon.png, opengraph-image.png");
