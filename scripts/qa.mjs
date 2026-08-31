/**
 * Real-browser QA harness.
 *
 * Renders the page at every reviewed width, captures evidence into
 * docs/quality/, and asserts the things that are cheap to get wrong and
 * expensive to miss: horizontal overflow, contrast, focus visibility,
 * keyboard reach, the Before/After interaction, and reduced-motion
 * behaviour.
 *
 *   node scripts/qa.mjs [baseUrl]
 */
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";

const BASE = process.argv[2] ?? "http://localhost:4321";
const OUT = "docs/quality";
const SHOTS = process.env.QA_SHOTS ? `${OUT}/${process.env.QA_SHOTS}` : `${OUT}/screens`;
mkdirSync(SHOTS, { recursive: true });

const WIDTHS = [
  { name: "1920-desktop-xl", w: 1920, h: 1080 },
  { name: "1440-desktop", w: 1440, h: 900 },
  { name: "1024-laptop", w: 1024, h: 768 },
  { name: "768-tablet", w: 768, h: 1024 },
  { name: "390-mobile", w: 390, h: 844 },
  { name: "320-mobile-min", w: 320, h: 640 },
];

const report = [];
const fail = (m) => { report.push({ level: "FAIL", m }); console.error("✗ " + m); };
const warn = (m) => { report.push({ level: "WARN", m }); console.warn("! " + m); };
const ok = (m) => { report.push({ level: "OK", m }); console.log("✓ " + m); };

const browser = await chromium.launch();
const skipIntro = async (ctx) => {
  await ctx.addInitScript(() => {
    try {
      sessionStorage.setItem("ig-open-1851", "1");
      sessionStorage.setItem("ig-open-1851-m2", "1");
      sessionStorage.setItem("ig-open-1851-m3", "1");
    } catch { /* ignore */ }
  });
};

// ------------------------------------------------------------ per width
for (const { name, w, h } of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await skipIntro(ctx);
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));

  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);

  // reveals fire on scroll; walk the page so the full-page shot is not
  // a column of invisible sections
  /* scroll-behavior: smooth makes rapid programmatic scrollTo calls cancel
     one another, so a fast walk never actually moves the page. Force instant
     scrolling for the duration of the walk. */
  await page.addStyleTag({ content: "html{scroll-behavior:auto !important}" });
  await page.evaluate(async () => {
    let last = -1;
    while (last !== document.body.scrollHeight) {
      last = document.body.scrollHeight;
      for (let y = 0; y <= last; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 45));
      }
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(700);

  await page.screenshot({ path: `${SHOTS}/${name}-hero.png` });
  await page.screenshot({ path: `${SHOTS}/${name}-full.png`, fullPage: true });

  // --- horizontal overflow, and which element causes it
  const overflow = await page.evaluate(() => {
    const de = document.documentElement;
    const over = de.scrollWidth - de.clientWidth;
    if (over <= 1) return { over, culprits: [] };
    const culprits = [];
    for (const el of document.querySelectorAll("*")) {
      const r = el.getBoundingClientRect();
      if (r.right > de.clientWidth + 1 || r.left < -1) {
        culprits.push(`${el.tagName.toLowerCase()}.${(el.className || "").toString().split(" ")[0]} right=${Math.round(r.right)}`);
      }
      if (culprits.length > 6) break;
    }
    return { over, culprits };
  });
  if (overflow.over > 1) fail(`${name}: horizontal overflow ${overflow.over}px — ${overflow.culprits.join(", ")}`);
  else ok(`${name}: no horizontal overflow`);

  if (errors.length) fail(`${name}: console errors — ${errors.slice(0, 3).join(" | ")}`);
  else ok(`${name}: no console errors`);

  await ctx.close();
}

// ------------------------------------------------- interaction @ desktop
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await skipIntro(ctx);
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });

  // --- h1 exact wording
  const h1 = (await page.locator("main h1").innerText()).replace(/\s+/g, " ").trim();
  if (h1 === "СИЛА ВИКОВАНА ВОДОЮ") ok(`H1 exact: "${h1}"`);
  else fail(`H1 is "${h1}" — must be СИЛА ВИКОВАНА ВОДОЮ`);

  // --- one h1 only, heading order sane
  const heads = await page.evaluate(() =>
    [...document.querySelectorAll("main h1, main h2, main h3")].map((e) => e.tagName));
  const h1n = heads.filter((t) => t === "H1").length;
  h1n === 1 ? ok("exactly one h1") : fail(`${h1n} h1 elements`);

  // --- before/after: keyboard
  const handle = page.locator("[data-ba-handle]");
  await handle.scrollIntoViewIfNeeded();
  await handle.focus();
  const start = await handle.getAttribute("aria-valuenow");
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowRight");
  const afterArrow = await handle.getAttribute("aria-valuenow");
  await page.keyboard.down("Shift");
  await page.keyboard.press("ArrowRight");
  await page.keyboard.up("Shift");
  const afterShift = await handle.getAttribute("aria-valuenow");
  await page.keyboard.press("Home");
  const atHome = await handle.getAttribute("aria-valuenow");

  if (Number(afterArrow) === Number(start) + 2) ok(`slider: arrow keys step 1% (${start}→${afterArrow})`);
  else fail(`slider: arrow keys did not step 1% (${start}→${afterArrow})`);
  if (Number(afterShift) === Number(afterArrow) + 10) ok(`slider: shift+arrow steps 10% (→${afterShift})`);
  else fail(`slider: shift+arrow did not step 10% (${afterArrow}→${afterShift})`);
  // The sweep never reaches 0 or 100 — letting either side vanish reads as a
  // glitch — so Home/End land on the declared min/max.
  const vmin = Number(await handle.getAttribute("aria-valuemin"));
  const vmax = Number(await handle.getAttribute("aria-valuemax"));
  if (Number(atHome) === vmin) ok(`slider: Home jumps to min (${vmin})`);
  else fail(`slider: Home gave ${atHome}, expected ${vmin}`);

  // --- before/after: pointer drag actually moves the clip
  // Grab the handle where it actually is rather than assuming an edge — its
  // resting position depends on the sweep range.
  await page.keyboard.press("End");
  const stageBox = await page.locator("[data-ba-stage]").boundingBox();
  const gripBox = await handle.boundingBox();
  await page.mouse.move(gripBox.x + gripBox.width / 2, gripBox.y + gripBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(stageBox.x + stageBox.width * 0.35, stageBox.y + stageBox.height / 2, { steps: 14 });
  await page.mouse.up();
  const afterDrag = Number(await handle.getAttribute("aria-valuenow"));
  if (afterDrag > 28 && afterDrag < 43) ok(`slider: pointer drag moved to ${afterDrag}%`);
  else fail(`slider: pointer drag landed at ${afterDrag}% (expected ~35%)`);

  // --- case switcher: a thumbnail must swap the pair and re-shape the frame
  const nThumbs = await page.locator("[data-ba-thumb]").count();
  if (nThumbs < 2) fail(`case switcher: only ${nThumbs} thumbnail(s)`);
  else {
    const before0 = await page.locator("[data-ba-before]").getAttribute("src");
    const ratio0 = await page.evaluate(() =>
      getComputedStyle(document.querySelector("[data-ba-stage]")).getPropertyValue("--ratio").trim());
    await page.locator("[data-ba-thumb]").nth(2).click();
    await page.waitForTimeout(250);
    const before1 = await page.locator("[data-ba-before]").getAttribute("src");
    const ratio1 = await page.evaluate(() =>
      getComputedStyle(document.querySelector("[data-ba-stage]")).getPropertyValue("--ratio").trim());
    const sel = await page.locator("[data-ba-thumb]").nth(2).getAttribute("aria-selected");
    const title = await page.locator("[data-ba-title]").innerText();

    before1 && before1 !== before0
      ? ok(`case switcher: ${nThumbs} cases, click swapped pair (${before0?.split("/").pop()} → ${before1.split("/").pop()})`)
      : fail("case switcher: clicking a thumbnail did not swap the pair");
    ratio1 !== ratio0
      ? ok(`case switcher: frame ratio follows the case (${ratio0} → ${ratio1})`)
      : fail(`case switcher: ratio stayed at ${ratio0} — the case would letterbox`);
    sel === "true" ? ok("case switcher: aria-selected tracks the active tab")
                   : fail(`case switcher: aria-selected is ${sel}`);
    title.trim().length > 0 ? ok(`case switcher: caption updated ("${title.trim()}")`)
                            : fail("case switcher: caption did not update");
    // both halves of the new case must be the same size or the wipe tears
    const dims = await page.evaluate(() => {
      const b = document.querySelector("[data-ba-before]");
      const a = document.querySelector("[data-ba-after]");
      return { bw: b.naturalWidth, bh: b.naturalHeight, aw: a.naturalWidth, ah: a.naturalHeight };
    });
    dims.bw === dims.aw && dims.bh === dims.ah
      ? ok(`case switcher: halves match (${dims.bw}x${dims.bh})`)
      : fail(`case switcher: halves differ ${dims.bw}x${dims.bh} vs ${dims.aw}x${dims.ah} — the wipe tears`);
    await page.locator("[data-ba-thumb]").nth(0).click();
    await page.waitForTimeout(200);
  }

  // --- the sweep runs unattended
  // It is paused while off-screen by design, so put it back in view first.
  await page.locator("[data-ba-stage]").scrollIntoViewIfNeeded();
  await page.evaluate(() => document.activeElement && document.activeElement.blur());
  await page.waitForTimeout(400);
  const posA = await page.evaluate(() =>
    getComputedStyle(document.querySelector("[data-ba-stage]")).getPropertyValue("--pos"));
  await page.waitForTimeout(700);
  const posB = await page.evaluate(() =>
    getComputedStyle(document.querySelector("[data-ba-stage]")).getPropertyValue("--pos"));
  const moved = Math.abs(parseFloat(posA) - parseFloat(posB));
  moved > 1
    ? ok(`slider: sweeps unattended (${posA.trim()} → ${posB.trim()})`)
    : fail(`slider: not animating — stayed at ${posA.trim()}`);

  // --- clip-path actually applied
  const clip = await page.evaluate(() =>
    getComputedStyle(document.querySelector("[data-ba-clip]")).clipPath);
  clip && clip !== "none" ? ok(`slider: clip-path active (${clip})`) : fail("slider: no clip-path");

  // --- focus visibility on the handle
  await handle.focus();
  await handle.press("ArrowRight");   // keyboard modality, so :focus-visible applies
  const ring = await page.evaluate(() => {
    const g = document.querySelector(".ba-grip");
    const s = getComputedStyle(g);
    return { w: s.outlineWidth, style: s.outlineStyle };
  });
  parseFloat(ring.w) >= 2 && ring.style !== "none"
    ? ok(`focus ring on slider grip (${ring.w} ${ring.style})`)
    : fail(`focus ring missing on slider grip (${JSON.stringify(ring)})`);

  // --- contrast, measured against what actually rendered
  const contrast = await page.evaluate(() => {
    /* Chrome serialises color-mix(in oklab, …) as oklab(…), which a naive
       digit regex reads as nonsense — it was reporting 5,000,000:1. Resolve
       every colour through a canvas instead, and composite alpha over the
       real ground rather than ignoring it. */
    const cv = document.createElement("canvas");
    cv.width = cv.height = 1;
    const cx = cv.getContext("2d", { willReadFrequently: true });

    const rgba = (color, over) => {
      cx.clearRect(0, 0, 1, 1);
      if (over) { cx.fillStyle = over; cx.fillRect(0, 0, 1, 1); }
      cx.fillStyle = color;
      cx.fillRect(0, 0, 1, 1);
      const [r, g, b] = cx.getImageData(0, 0, 1, 1).data;
      return [r, g, b];
    };

    const lum = ([r, g, b]) => {
      const f = (v) => {
        const s = v / 255;
        return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };

    const ratio = (fg, bg) => {
      const [x, y] = [lum(fg), lum(bg)].sort((p, q) => q - p);
      return (x + 0.05) / (y + 0.05);
    };

    const groundOf = (el) => {
      let n = el;
      while (n && n !== document.documentElement) {
        const bg = getComputedStyle(n).backgroundColor;
        if (bg && !/rgba\(0, 0, 0, 0\)|transparent/.test(bg)) return bg;
        n = n.parentElement;
      }
      return "rgb(6,14,18)";
    };
    const out = [];
    const sel = ["main h1", "#fit h2", "#fit .lead", "#method .eyebrow",
                 ".btn-primary", ".hero-actions .btn-ghost", "#pricing .p-inc",
                 "#method .m-b", ".ft-where", "#results .lead", ".q-a p"];
    for (const s of sel) {
      const el = document.querySelector(s);
      if (!el) continue;
      const cs = getComputedStyle(el);
      const ground = groundOf(el);
      const bg = rgba(ground);
      const fg = rgba(cs.color, ground);
      out.push({
        sel: s,
        size: parseFloat(cs.fontSize),
        weight: cs.fontWeight,
        r: +ratio(fg, bg).toFixed(2),
      });
    }
    return out;
  });
  for (const c of contrast) {
    const large = c.size >= 24 || (c.size >= 18.66 && Number(c.weight) >= 700);
    const need = large ? 3 : 4.5;
    c.r >= need
      ? ok(`contrast ${c.sel}: ${c.r}:1 (needs ${need})`)
      : fail(`contrast ${c.sel}: ${c.r}:1 below ${need}`);
  }

  // --- hero copy sits on video, not on a solid token background, so token
  //     maths says nothing. Sample the actual rendered pixels behind it.
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  const heroPix = await page.evaluate(() => {
    const r = document.querySelector(".hero-eyebrow").getBoundingClientRect();
    return {
      x: Math.max(0, Math.round(r.left)),
      y: Math.max(0, Math.round(r.top)),
      width: Math.round(r.width),
      height: Math.round(r.height),
    };
  });
  const shot = await page.screenshot({ clip: heroPix });
  // decode in-page rather than pulling an image library into the repo
  const heroRatio = await page.evaluate(async (b64) => {
    const img = new Image();
    await new Promise((res) => { img.onload = res; img.src = "data:image/png;base64," + b64; });
    const cv = document.createElement("canvas");
    cv.width = img.width; cv.height = img.height;
    const cx = cv.getContext("2d", { willReadFrequently: true });
    cx.drawImage(img, 0, 0);
    const d = cx.getImageData(0, 0, cv.width, cv.height).data;
    const f = (v) => { const s = v / 255; return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
    const L = (r, g, b) => 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    // brightest pixels are the glyphs, darkest are the ground behind them
    const lums = [];
    for (let i = 0; i < d.length; i += 4) lums.push(L(d[i], d[i + 1], d[i + 2]));
    lums.sort((a, b2) => a - b2);
    const dark = lums[Math.floor(lums.length * 0.15)];
    const light = lums[Math.floor(lums.length * 0.95)];
    return +((light + 0.05) / (dark + 0.05)).toFixed(2);
  }, shot.toString("base64"));
  heroRatio >= 4.5
    ? ok(`hero eyebrow over video: ${heroRatio}:1 measured from rendered pixels`)
    : fail(`hero eyebrow over video: ${heroRatio}:1 measured from rendered pixels — below 4.5`);

  // --- touch targets
  const small = await page.evaluate(() => {
    const bad = [];
    for (const el of document.querySelectorAll("a[href], button, [role=slider], input, textarea")) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      if (r.height < 44 && !el.closest(".hdr-list") && !el.closest(".ft-nav") && !el.closest(".cr-items"))
        bad.push(`${el.tagName.toLowerCase()}.${(el.className || "").toString().split(" ")[0]} ${Math.round(r.width)}x${Math.round(r.height)}`);
    }
    return bad.slice(0, 8);
  });
  small.length ? warn(`targets under 44px: ${small.join(", ")}`) : ok("touch targets ≥44px");

  // --- sound toggle on the coach video
  const snd = page.locator("#coach [data-av-sound]");
  if (await snd.count()) {
    await snd.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    const m0 = await page.evaluate(() => {
      const v = document.querySelector("#coach [data-av-sound]").closest(".av").querySelector("video");
      return v.muted;
    });
    await snd.click();
    await page.waitForTimeout(200);
    const after = await page.evaluate(() => {
      const b = document.querySelector("#coach [data-av-sound]");
      const v = b.closest(".av").querySelector("video");
      return { muted: v.muted, pressed: b.getAttribute("aria-pressed"), label: (b.querySelector("[data-av-label]")||{}).textContent };
    });
    m0 === true && after.muted === false && after.pressed === "true"
      ? ok(`sound toggle: muted → unmuted, aria-pressed true (label "${after.label}")`)
      : fail(`sound toggle: started muted=${m0}, now ${JSON.stringify(after)}`);
    await snd.click();
    await page.waitForTimeout(150);
  } else fail("sound toggle: not found on the coach video");


  await ctx.close();
}

// ------------------------------------------------------- reduced motion
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  await skipIntro(ctx);
  const page = await ctx.newPage();
  const videoReqs = [];
  page.on("request", (r) => { if (/\.mp4/.test(r.url())) videoReqs.push(r.url()); });
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.addStyleTag({ content: "html{scroll-behavior:auto !important}" });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 45));
    }
  });
  await page.waitForTimeout(800);

  // The dog is a plain <video autoplay> in the footer, not an AutoVideo —
  // it is allowed to load. Everything routed through AutoVideo must not.
  const managed = videoReqs.filter((u) => !u.includes("dog.mp4"));
  managed.length === 0
    ? ok("reduced motion: no managed video fetched (posters only)")
    : fail(`reduced motion: fetched ${managed.length} video(s) — ${managed.join(", ")}`);

  const hidden = await page.evaluate(() =>
    [...document.querySelectorAll("[data-reveal]")].filter(
      (e) => getComputedStyle(e).opacity !== "1").length);
  hidden === 0 ? ok("reduced motion: all content visible") : fail(`reduced motion: ${hidden} hidden reveal(s)`);

  await page.screenshot({ path: `${SHOTS}/reduced-motion-full.png`, fullPage: true });
  await ctx.close();
}

// ----------------------------------------------------------- no-JS parity
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  const text = await page.locator("body").innerText();
  const must = ["Захват", "Проведення", "Вихід", "Курс", "700", "Майстер спорту України",
                "медично протипоказані", "Сила", "ВОДОЮ"];
  const missing = must.filter((m) => !text.includes(m));
  missing.length === 0
    ? ok(`no-JS: all ${must.length} key strings present in rendered HTML`)
    : fail(`no-JS: missing ${missing.join(", ")}`);

  const visible = await page.evaluate(() =>
    [...document.querySelectorAll("[data-reveal]")].filter(
      (e) => getComputedStyle(e).opacity === "1").length);
  const total = await page.evaluate(() => document.querySelectorAll("[data-reveal]").length);
  visible === total
    ? ok(`no-JS: all ${total} reveal blocks visible`)
    : fail(`no-JS: only ${visible}/${total} reveal blocks visible — reveals are gating content`);

  await page.screenshot({ path: `${SHOTS}/no-js-full.png`, fullPage: true });
  await ctx.close();
}

await browser.close();

const fails = report.filter((r) => r.level === "FAIL");
const warns = report.filter((r) => r.level === "WARN");
writeFileSync(
  process.env.QA_SHOTS ? `${OUT}/qa-report-${process.env.QA_SHOTS}.json` : `${OUT}/qa-report.json`,
  JSON.stringify({ base: BASE, widths: WIDTHS, report }, null, 2),
);
console.log(`\n${report.length} checks · ${fails.length} fail · ${warns.length} warn`);
process.exit(fails.length ? 1 : 0);
