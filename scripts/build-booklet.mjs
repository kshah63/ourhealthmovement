/**
 * Build the "Know Your Spices" booklet → public/know-your-spices.pdf
 *
 * A one-off asset generator. The resulting PDF is committed to the repo, so this
 * script is NOT part of the site build and its dependencies are intentionally
 * kept out of package.json. To regenerate the booklet after editing the spice
 * guides, install the tools once and run:
 *
 *   npm i -D marked gray-matter playwright-core
 *   node scripts/build-booklet.mjs
 *
 * It reads every guide in src/content/guides with category: spice (in `order`),
 * lays them out over an earthy, editorial template with the fonts embedded, and
 * prints an A4 PDF. A Chromium binary is required; set CHROMIUM_PATH if it isn't
 * discovered automatically under PLAYWRIGHT_BROWSERS_PATH.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { chromium } from 'playwright-core';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const GUIDES = join(ROOT, 'src/content/guides');

// --- locate a Chromium binary -------------------------------------------------
function findChromium() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
  if (existsSync(base)) {
    for (const dir of readdirSync(base)) {
      if (!dir.startsWith('chromium')) continue;
      const exe = join(base, dir, 'chrome-linux', 'chrome');
      if (existsSync(exe)) return exe;
    }
  }
  return undefined; // let playwright try its bundled default
}

// --- fonts (embed as base64 so the PDF is self-contained) ---------------------
const b64 = (p) => readFileSync(p).toString('base64');
const fraunces = b64(join(ROOT, 'node_modules/@fontsource-variable/fraunces/files/fraunces-latin-standard-normal.woff2'));
const hanken = b64(join(ROOT, 'node_modules/@fontsource-variable/hanken-grotesk/files/hanken-grotesk-latin-wght-normal.woff2'));

// --- fern mark (terracotta) ---------------------------------------------------
const FERN = `<svg viewBox="0 0 48 48" width="70" height="70" fill="none" stroke="#b4552f" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><g transform="translate(3 -3.5)"><path d="M25.33 19.16 C25.32 19.10, 25.31 18.91, 25.27 18.78 C25.23 18.65, 25.17 18.52, 25.09 18.4 C25.01 18.28, 24.92 18.17, 24.81 18.07 C24.70 17.97, 24.57 17.88, 24.43 17.81 C24.29 17.74, 24.13 17.68, 23.96 17.65 C23.80 17.62, 23.62 17.61, 23.44 17.62 C23.26 17.63, 23.07 17.67, 22.89 17.73 C22.71 17.79, 22.53 17.88, 22.37 18 C22.21 18.12, 22.05 18.27, 21.91 18.43 C21.77 18.59, 21.65 18.78, 21.56 18.99 C21.47 19.20, 21.40 19.43, 21.36 19.67 C21.32 19.91, 21.31 20.17, 21.34 20.42 C21.37 20.67, 21.44 20.94, 21.54 21.19 C21.64 21.44, 21.79 21.69, 21.96 21.92 C22.14 22.15, 22.35 22.37, 22.59 22.55 C22.83 22.73, 23.12 22.90, 23.42 23.02 C23.72 23.14, 24.05 23.23, 24.39 23.27 C24.73 23.31, 25.10 23.30, 25.46 23.24 C25.82 23.18, 26.20 23.08, 26.55 22.92 C26.90 22.76, 27.26 22.54, 27.58 22.28 C27.89 22.02, 28.19 21.70, 28.44 21.34 C28.69 20.98, 28.91 20.57, 29.06 20.13 C29.21 19.69, 29.33 19.21, 29.36 18.72 C29.39 18.23, 29.36 17.70, 29.26 17.19 C29.16 16.68, 28.99 16.14, 28.74 15.65 C28.49 15.16, 28.16 14.67, 27.76 14.23 C27.36 13.79, 26.89 13.37, 26.36 13.04 C25.83 12.71, 25.23 12.42, 24.6 12.23 C23.97 12.04, 23.27 11.91, 22.57 11.89 C21.87 11.87, 21.12 11.93, 20.39 12.11 C19.66 12.29, 18.91 12.57, 18.22 12.96 C17.53 13.35, 16.84 13.84, 16.24 14.43 C15.64 15.02, 15.09 15.73, 14.64 16.5 C14.20 17.27, 13.81 18.16, 13.57 19.07 C13.33 19.98, 13.20 20.99, 13.21 21.99 C13.23 22.99, 13.36 24.06, 13.66 25.09 C13.96 26.12, 14.40 27.18, 14.99 28.14 C15.58 29.11, 16.33 30.06, 17.21 30.88 C18.09 31.70, 19.13 32.47, 20.26 33.06 C21.39 33.65, 22.6 34.05, 23.99 34.43"/><path d="M23.99 34.43 C24.4 40.43, 26.5 41, 27.5 46"/><circle cx="25.33" cy="19.3" r="1.15" fill="#b4552f" stroke="none"/></g></svg>`;

// --- read spice guides --------------------------------------------------------
const files = readdirSync(GUIDES).filter((f) => f.endsWith('.md'));
const spices = files
  .map((f) => ({ f, ...matter(readFileSync(join(GUIDES, f), 'utf8')) }))
  .filter((g) => g.data.category === 'spice')
  .sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99));

const sections = spices
  .map((g, i) => {
    const body = marked.parse(g.content);
    const season = (g.data.season || [])
      .map((s) => s[0].toUpperCase() + s.slice(1))
      .join(' · ');
    return `<section class="spice${i === 0 ? ' first' : ''}">
      <p class="kicker">Know Your Spices · ${String(i + 1).padStart(2, '0')}</p>
      <h1>${g.data.title}</h1>
      <p class="meta">${[g.data.energetics, season && `In season: ${season}`].filter(Boolean).join('  ·  ')}</p>
      <div class="body">${body}</div>
    </section>`;
  })
  .join('\n');

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'Fraunces';src:url(data:font/woff2;base64,${fraunces}) format('woff2');font-weight:100 900;font-display:block;}
@font-face{font-family:'Hanken';src:url(data:font/woff2;base64,${hanken}) format('woff2');font-weight:100 900;font-display:block;}
@page{size:A4;margin:0;}
*{box-sizing:border-box;margin:0;padding:0;}
html,body{width:210mm;overflow-x:hidden;background:#f4ead6;color:#2a2019;font-family:'Hanken',system-ui,sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
img,svg{max-width:100%;}
.page,.spice{width:210mm;min-height:296mm;overflow:hidden;padding:22mm 22mm;page-break-after:always;break-after:page;position:relative;background:#f4ead6;}
.page:last-child,.spice:last-child{page-break-after:auto;break-after:auto;}

/* cover */
.cover{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;background:linear-gradient(160deg,#f4ead6 0%,#efe2c9 60%,#e8d7b8 100%);}
.cover .mark{margin-bottom:10mm;}
.cover .eyebrow{font-size:11pt;letter-spacing:0.28em;text-transform:uppercase;color:#b4552f;font-weight:700;margin-bottom:6mm;}
.cover h1{font-family:'Fraunces',serif;font-weight:480;font-size:46pt;line-height:1.02;color:#2a2019;letter-spacing:-0.02em;}
.cover h1 em{font-style:italic;color:#b4552f;}
.cover .sub{margin-top:8mm;max-width:130mm;font-size:13pt;line-height:1.5;color:#5c4d3f;}
.cover .brand{position:absolute;bottom:22mm;font-family:'Fraunces',serif;font-size:12pt;color:#566043;letter-spacing:0.02em;}

/* intro */
.intro h2{font-family:'Fraunces',serif;font-weight:480;font-size:26pt;color:#2a2019;margin-bottom:6mm;}
.intro p{font-size:12pt;line-height:1.65;color:#5c4d3f;max-width:150mm;margin-bottom:4mm;}
.intro .note{margin-top:8mm;padding:6mm 7mm;background:#efe2c9;border-left:3px solid #8b9a70;border-radius:2px;font-size:10.5pt;color:#5c4d3f;}

/* spice pages */
.kicker{font-size:9.5pt;letter-spacing:0.18em;text-transform:uppercase;color:#a6741a;font-weight:700;}
.spice h1{font-family:'Fraunces',serif;font-weight:480;font-size:32pt;color:#b4552f;margin-top:3mm;letter-spacing:-0.01em;}
.spice .meta{font-family:'Fraunces',serif;font-style:italic;font-size:12pt;color:#566043;margin-top:2mm;padding-bottom:4mm;border-bottom:1px solid rgba(42,32,25,0.18);}
.body{margin-top:5mm;font-size:10.8pt;line-height:1.55;color:#33291f;}
.body h2{font-family:'Hanken',sans-serif;font-weight:680;font-size:12.5pt;color:#8c3d1f;margin-top:4.5mm;margin-bottom:2mm;letter-spacing:0.01em;}
.body p{margin-bottom:2.5mm;}
.body ul{margin:0 0 2.5mm 5mm;}
.body li{margin-bottom:1.3mm;}
.body li::marker{color:#b4552f;}
.body strong{color:#2a2019;}
.body blockquote{margin:4mm 0;padding-left:5mm;border-left:3px solid #b4552f;font-family:'Fraunces',serif;font-style:italic;font-size:12pt;color:#5c4d3f;}
.spice-foot{position:absolute;bottom:12mm;left:22mm;right:22mm;display:flex;justify-content:space-between;font-size:8.5pt;color:#8a7a68;letter-spacing:0.03em;}

/* closing */
.closing{display:flex;flex-direction:column;justify-content:center;text-align:center;align-items:center;}
.closing h2{font-family:'Fraunces',serif;font-style:italic;font-weight:440;font-size:22pt;color:#2a2019;max-width:150mm;line-height:1.3;}
.closing .disc{margin-top:12mm;max-width:150mm;font-size:9.5pt;line-height:1.6;color:#8a7a68;}
.closing .brand{margin-top:10mm;font-family:'Fraunces',serif;font-size:13pt;color:#b4552f;}
.closing .url{font-size:10pt;color:#566043;margin-top:1mm;}
</style></head><body>

<div class="page cover">
  <div class="mark">${FERN}</div>
  <p class="eyebrow">Our Health Movement</p>
  <h1>Know Your<br><em>Spices</em></h1>
  <p class="sub">A little cabinet of ancient wisdom, gathered from the guides at Our Health Movement. How to use everyday spices, and the traditional and modern thinking behind each.</p>
  <p class="brand">ourhealthmovement.co.uk</p>
</div>

<div class="page intro">
  <h2>The spice cabinet</h2>
  <p>For thousands of years, the spices in your kitchen were the pharmacy. Warming, cooling, digestive, calming, each one was chosen with intention. This little booklet gathers them together: how to cook with them, and the traditional and modern wisdom behind each.</p>
  <p>Start anywhere. Toast a few seeds, warm some milk with turmeric and pepper, or simply notice how a spice makes you feel. That is the whole practice.</p>
  <div class="note"><strong>A note on doses.</strong> These guides celebrate spices as food, the amounts you would cook with. Concentrated extracts and supplements are a different matter and can interact with medications, so check with your practitioner before taking them. Nothing here is medical advice.</div>
</div>

${sections}

<div class="page closing">
  <div class="mark">${FERN}</div>
  <h2>Health is made in our kitchens and our playgrounds, seasonal, unhurried, and deeply connected to the natural world.</h2>
  <p class="disc">Shared for education and inspiration, drawing on traditional practices and their modern study. Not medical advice, and not a substitute for care from a qualified practitioner. Please check with your doctor before making changes, especially if you are pregnant, nursing, taking medication or managing a health condition.</p>
  <p class="brand">Our Health Movement</p>
  <p class="url">ourhealthmovement.co.uk</p>
</div>

</body></html>`;

const browser = await chromium.launch({ executablePath: findChromium() });
const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'networkidle' });
await page.waitForTimeout(200);
await page.pdf({
  path: join(ROOT, 'public/know-your-spices.pdf'),
  format: 'A4',
  printBackground: true,
  scale: 1,
  margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
});
await browser.close();
console.log('wrote public/know-your-spices.pdf for', spices.length, 'spices');
