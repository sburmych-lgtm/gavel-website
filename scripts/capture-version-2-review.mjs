import { chromium } from "playwright";
import { mkdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { createServer } from "node:http";
import { join, extname, resolve } from "node:path";

const PORT = 4325;
const DIST = resolve("dist");
const OUT = resolve("review/version-2");
mkdirSync(OUT, { recursive: true });

const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".mp4": "video/mp4",
};

const server = createServer((req, res) => {
  let u = req.url ? req.url.split("?")[0] : "/";
  if (u.endsWith("/")) u += "index.html";
  const file = join(DIST, u);
  if (existsSync(file) && statSync(file).isFile()) {
    const ext = extname(file);
    res.writeHead(200, {
      "Content-Type": MIME[ext] || "application/octet-stream",
      "Access-Control-Allow-Origin": "*",
    });
    res.end(readFileSync(file));
  } else {
    res.writeHead(404);
    res.end("Not found");
  }
});

await new Promise((resolve) => server.listen(PORT, "127.0.0.1", resolve));
console.log(`Server listening on http://127.0.0.1:${PORT}`);

const browser = await chromium.launch();

const VIEWPORTS = [
  { name: "1440", w: 1440, h: 900, dpr: 2 },
  { name: "375", w: 375, h: 812, dpr: 2 },
];

const SECTIONS = [
  "hero",
  "proof",
  "fit",
  "method",
  "results",
  "formats",
  "pricing",
  "coach",
  "athlete",
  "credentials",
  "faq",
  "contact",
];

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.w, height: vp.h },
    deviceScaleFactor: vp.dpr,
  });

  await ctx.addInitScript(() => {
    try {
      sessionStorage.setItem("ig-open-1851-m5", "1");
    } catch {}
  });

  const page = await ctx.newPage();
  await page.goto(`http://127.0.0.1:${PORT}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);

  const totalH = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < totalH; y += 400) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(60);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);

  await page.screenshot({
    path: join(OUT, `${vp.name}-full-page.png`),
    fullPage: true,
  });
  console.log(`✓ ${vp.name}-full-page.png`);

  for (const s of SECTIONS) {
    const el = await page.$(`#${s}`);
    if (el) {
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(150);
      await el.screenshot({ path: join(OUT, `${vp.name}-${s}.png`) });
      console.log(`✓ ${vp.name}-${s}.png`);
    }
  }

  await ctx.close();
}

const ctxReduced = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
  reducedMotion: "reduce",
});
await ctxReduced.addInitScript(() => {
  try {
    sessionStorage.setItem("ig-open-1851-m5", "1");
  } catch {}
});
const pageRed = await ctxReduced.newPage();
await pageRed.goto(`http://127.0.0.1:${PORT}`, { waitUntil: "networkidle" });
await pageRed.waitForTimeout(400);
await pageRed.screenshot({ path: join(OUT, `1440-reduced-motion-hero.png`) });
console.log(`✓ 1440-reduced-motion-hero.png`);
await ctxReduced.close();

await browser.close();
server.close();
console.log("All review screenshots captured successfully in review/version-2/");
