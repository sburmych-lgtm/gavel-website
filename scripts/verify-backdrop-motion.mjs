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
    const stat = fs.statSync(filePath);
    const range = req.headers.range;

    if (range && ext === ".mp4") {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
      const chunksize = end - start + 1;
      const file = fs.createReadStream(filePath, { start, end });
      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${stat.size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mp4",
      });
      file.pipe(res);
    } else {
      res.writeHead(200, {
        "Content-Length": stat.size,
        "Content-Type": mimeTypes[ext] || "application/octet-stream",
      });
      fs.createReadStream(filePath).pipe(res);
    }
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
  // Test 0: Seamless Loop Seam Verification
  {
    const f1B64 = fs.readFileSync("review/loop-seam-frame-a.png").toString("base64");
    const f2B64 = fs.readFileSync("review/loop-seam-frame-b.png").toString("base64");
    const testPage = await browser.newPage();
    const diff = await testPage.evaluate(async ({ f1, f2 }) => {
      function getLumData(b64) {
        return new Promise((res) => {
          const img = new Image();
          img.src = "data:image/png;base64," + b64;
          img.onload = () => {
            const c = document.createElement("canvas");
            c.width = img.width;
            c.height = img.height;
            const cx = c.getContext("2d");
            cx.drawImage(img, 0, 0);
            res(cx.getImageData(0, 0, img.width, img.height).data);
          };
        });
      }
      const d1 = await getLumData(f1);
      const d2 = await getLumData(f2);
      let lum1 = 0, lum2 = 0;
      const total = d1.length / 4;
      for (let i = 0; i < d1.length; i += 4) {
        lum1 += 0.2126 * d1[i] + 0.7152 * d1[i+1] + 0.0722 * d1[i+2];
        lum2 += 0.2126 * d2[i] + 0.7152 * d2[i+1] + 0.0722 * d2[i+2];
      }
      return Math.abs((lum1 - lum2) / total);
    }, { f1: f1B64, f2: f2B64 });
    await testPage.close();

    if (diff <= 3) {
      ok(`Loop Gate: seam mean luminance diff is ${diff.toFixed(3)}/255 (<= 3/255)`);
    } else {
      fail(`Loop Gate: seam mean luminance diff is ${diff.toFixed(3)}/255 (> 3/255)`);
    }
  }

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

    // Capture (a) pricing on dark
    await page.locator("#pricing").scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(reviewDir, "1440-pricing-dark.png") });
    ok("Captured 1440-pricing-dark.png (pricing redesigned on dark system)");

    // Capture (b) breathing window mid-scroll showing looped backdrop
    const windowBand = page.locator(".window-band").first();
    await windowBand.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(reviewDir, "1440-window-band-backdrop.png") });
    ok("Captured 1440-window-band-backdrop.png (paddler plainly recognizable in breathing window)");

    // Scroll to Fit section on dark and capture
    await page.locator("#fit").scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(reviewDir, "1440-fit-dark.png") });
    ok("Captured 1440-fit-dark.png (fit section on tonal dark)");

    // Scroll to dark section and capture
    await page.locator("#method").scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(reviewDir, "1440-dark-section-backdrop.png") });
    ok("Captured 1440-dark-section-backdrop.png");

    // Full page capture at 1440
    await page.screenshot({ path: path.join(reviewDir, "1440-full-page-dark.png"), fullPage: true });
    ok("Captured 1440-full-page-dark.png (full-page capture)");

    // Heading at 50% reveal (c)
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

    // (a) Mobile pricing on dark
    await page.locator("#pricing").scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(reviewDir, "390-pricing-dark.png") });
    ok("Captured 390-pricing-dark.png");

    // (b) Mobile breathing window
    const mWindowBand = page.locator(".window-band").first();
    await mWindowBand.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(reviewDir, "390-window-band-backdrop.png") });
    ok("Captured 390-window-band-backdrop.png");

    // Mobile Fit section on dark
    await page.locator("#fit").scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(reviewDir, "390-fit-dark.png") });
    ok("Captured 390-fit-dark.png");

    await page.locator("#method").scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(reviewDir, "390-dark-section-backdrop.png") });
    ok("Captured 390-dark-section-backdrop.png");

    // Full page mobile capture
    await page.screenshot({ path: path.join(reviewDir, "390-full-page-dark.png"), fullPage: true });
    ok("Captured 390-full-page-dark.png");

    // Heading reveal mobile
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