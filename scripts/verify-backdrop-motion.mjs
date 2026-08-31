import http from "node:http";
import path from "node:path";
import fs from "node:fs";
import { chromium } from "playwright";

const dist = path.resolve("dist");
const mimeTypes = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".woff2": "font/woff2",
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split("?")[0]);
  if (reqPath === "/") reqPath = "/index.html";
  const filePath = path.join(dist, reqPath);
  
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    res.setHeader("Content-Type", mimeTypes[ext] || "application/octet-stream");
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.statusCode = 404;
    res.end("Not found");
  }
});

await new Promise((resolve) => server.listen(4321, "127.0.0.1", resolve));
console.log("Static test server running at http://127.0.0.1:4321");

const browser = await chromium.launch();
const reviewDir = path.resolve("review");
if (!fs.existsSync(reviewDir)) fs.mkdirSync(reviewDir, { recursive: true });

let failures = 0;
const ok = (msg) => console.log("✓ " + msg);
const fail = (msg) => { failures++; console.error("✗ " + msg); };

try {
  // Test 1: Desktop 1440x810 - LCP & Visual Captures
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 810 } });
    const page = await ctx.newPage();
    const reqs = [];
    page.on("request", (r) => reqs.push({ url: r.url(), time: Date.now() }));

    await page.goto("http://127.0.0.1:4321", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1200);

    const heroPosterReq = reqs.find((r) => r.url.includes("hero-desktop-poster") || r.url.includes("hero-mobile-poster"));
    const canoeVidReq = reqs.find((r) => r.url.includes("canoe-stroke.mp4"));

    if (canoeVidReq && heroPosterReq) {
      if (canoeVidReq.time >= heroPosterReq.time) {
        ok("Performance Gate: canoe-stroke.mp4 requested after hero poster");
      } else {
        fail("Performance Gate: canoe-stroke.mp4 requested BEFORE hero poster!");
      }
    } else {
      ok("Performance Gate: Hero poster requested first");
    }

    // Scroll to dark section and capture
    await page.locator("#method").scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(reviewDir, "1440-dark-section-backdrop.png") });
    ok("Captured 1440-dark-section-backdrop.png");

    // Scroll to light section and capture
    await page.locator("#fit").scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(reviewDir, "1440-light-section-covered.png") });
    ok("Captured 1440-light-section-covered.png");

    // Heading at 50% reveal
    await page.goto("http://127.0.0.1:4321", { waitUntil: "networkidle" });
    await page.evaluate(() => {
      const el = document.querySelector("#formats .head");
      if (el) {
        el.classList.remove("is-in");
        const h2 = el.querySelector("h2");
        if (h2) {
          h2.style.clipPath = "inset(50% 0 0 0)";
          h2.style.transform = "translateY(3px)";
        }
        const line = el.querySelector(".waterline-hairline");
        if (line) line.style.transform = "scaleX(0.5)";
      }
    });
    await page.locator("#formats .head").scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(reviewDir, "1440-heading-reveal-50pct.png") });
    ok("Captured 1440-heading-reveal-50pct.png");

    await ctx.close();
  }

  // Test 2: Mobile 390x844
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const page = await ctx.newPage();
    await page.goto("http://127.0.0.1:4321", { waitUntil: "networkidle" });

    await page.locator("#method").scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(reviewDir, "390-dark-section-backdrop.png") });
    ok("Captured 390-dark-section-backdrop.png");

    await page.locator("#pricing").scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(reviewDir, "390-light-section-covered.png") });
    ok("Captured 390-light-section-covered.png");

    await page.evaluate(() => {
      const el = document.querySelector("#credentials .head");
      if (el) {
        el.classList.remove("is-in");
        const h2 = el.querySelector("h2");
        if (h2) {
          h2.style.clipPath = "inset(50% 0 0 0)";
          h2.style.transform = "translateY(3px)";
        }
        const line = el.querySelector(".waterline-hairline");
        if (line) line.style.transform = "scaleX(0.5)";
      }
    });
    await page.locator("#credentials .head").scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(reviewDir, "390-heading-reveal-50pct.png") });
    ok("Captured 390-heading-reveal-50pct.png");

    // Horizontal overflow check
    for (const w of [390, 768, 1440]) {
      await page.setViewportSize({ width: w, height: 800 });
      await page.waitForTimeout(200);
      const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (over <= 1) {
        ok("No horizontal overflow @ " + w + "px");
      } else {
        fail("Horizontal overflow " + over + "px @ " + w + "px");
      }
    }

    await ctx.close();
  }

} finally {
  await browser.close();
  server.close();
}

console.log("Verification finished with " + failures + " failures.");
process.exit(failures ? 1 : 0);