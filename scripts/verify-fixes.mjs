/**
 * Targeted regression checks for the 15.08 revision round.
 *
 *   node scripts/verify-fixes.mjs <baseUrl>
 *
 * These sit alongside qa.mjs rather than inside it: qa.mjs is the standing
 * quality gate, this file pins the specific things that were reported broken
 * so they cannot silently regress — the complete header lockup, the mobile
 * menu at both scroll states, the restrained CTA, and the Вода section.
 */
import { chromium } from "playwright";
const URL = process.argv[2];
const b = await chromium.launch();
let fails = 0;
const ok = m => console.log("✓ " + m);
const bad = m => { fails++; console.error("✗ " + m); };

for (const [name, w, h] of [["mobile-390",390,844],["mobile-320",320,640],["tablet-768",768,1024]]) {
  const p = await (await b.newContext({ viewport:{width:w,height:h} })).newPage();
  await p.goto(URL, { waitUntil:"networkidle" });
  await p.addStyleTag({ content:"html{scroll-behavior:auto !important}" });

  // logo fully visible, not clipped by its container
  const logo = await p.evaluate(() => {
    const i = document.querySelector(".hdr-brand img");
    const r = i.getBoundingClientRect();
    const br = i.closest(".hdr-brand").getBoundingClientRect();
    return { natural: i.naturalWidth+"x"+i.naturalHeight, rendered: Math.round(r.width)+"x"+Math.round(r.height),
             clipped: r.height > br.height + 1 || r.width > br.width + 1,
             src: i.getAttribute("src"), complete: i.complete && i.naturalWidth > 0 };
  });
  logo.complete && !logo.clipped && /logo-gold/.test(logo.src)
    ? ok(`${name}: full lockup ${logo.rendered} from ${logo.src.split("/").pop()}, not clipped`)
    : bad(`${name}: logo problem ${JSON.stringify(logo)}`);

  // menu, at top AND scrolled
  for (const [where, y] of [["top",0],["scrolled",2500]]) {
    await p.evaluate(sy => window.scrollTo(0, sy), y);
    await p.waitForTimeout(500);
    await p.click("[data-hdr-toggle]");
    await p.waitForTimeout(400);
    const m = await p.evaluate(() => {
      const panel = document.querySelector("[data-hdr-panel]");
      const r = panel.getBoundingClientRect();
      const links = [...panel.querySelectorAll("a")].filter(a => {
        const lr = a.getBoundingClientRect();
        return lr.height > 0 && lr.top >= 0 && lr.bottom <= innerHeight + 1;
      }).map(a => a.textContent.trim());
      const burger = document.querySelector("[data-hdr-toggle]").getBoundingClientRect();
      const topEl = document.elementFromPoint(burger.x + burger.width/2, burger.y + burger.height/2);
      return { h: Math.round(r.height), vh: innerHeight, links,
               burgerReachable: !!document.querySelector("[data-hdr-toggle]").contains(topEl) || topEl === document.querySelector("[data-hdr-toggle]") };
    });
    m.h >= m.vh - 2 && m.links.length === 6 && m.burgerReachable
      ? ok(`${name} @${where}: menu ${m.h}px full-height, ${m.links.length} items [${m.links.join(", ")}], burger reachable`)
      : bad(`${name} @${where}: ${JSON.stringify(m)}`);
    await p.click("[data-hdr-toggle]");
    await p.waitForTimeout(300);
    const closed = await p.evaluate(() => document.querySelector("[data-hdr-panel]").hidden);
    closed ? ok(`${name} @${where}: menu closes`) : bad(`${name} @${where}: menu did not close`);
  }

  // mobile CTA is not gold
  if (w <= 768) {
    await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight*0.45));
    await p.waitForTimeout(800);
    const c = await p.evaluate(() => {
      const a = document.querySelector("[data-sticky] .btn");
      const cs = getComputedStyle(a);
      const cv = document.createElement("canvas"); cv.width=cv.height=1;
      const cx = cv.getContext("2d");
      const px = col => { cx.clearRect(0,0,1,1); cx.fillStyle=col; cx.fillRect(0,0,1,1);
        const d = cx.getImageData(0,0,1,1).data; return [d[0],d[1],d[2]]; };
      return { bg: px(cs.backgroundColor), border: px(cs.borderTopColor), shown: document.querySelector("[data-sticky]").classList.contains("is-in") };
    });
    // gold is ~#E1AE42 (225,174,66): red-dominant and bright. Azure is blue-dominant.
    const goldish = c.bg[0] > 150 && c.bg[0] > c.bg[2] + 60;
    !goldish && c.shown
      ? ok(`${name}: sticky CTA visible and not gold — bg rgb(${c.bg}), border rgb(${c.border})`)
      : bad(`${name}: CTA gold=${goldish} shown=${c.shown} bg=${c.bg}`);
  }
  await p.close();
}

// Вода section content
{
  const p = await (await b.newContext({ viewport:{width:1440,height:900} })).newPage();
  await p.goto(URL, { waitUntil:"networkidle" });
  const t = await p.locator("#athlete").innerText();
  const must = ["Вода вчить працювати в команді",
                "Каное не пробачає зайвого руху",
                "В нашій команді ти також отримаєш",
                "Dragon Boat та активний відпочинок",
                "Індивідуальні тренування просто неба",
                "Спортивне харчування та підтримка організму"];
  const missing = must.filter(s => !t.includes(s));
  missing.length === 0 ? ok(`Вода section: all ${must.length} required strings present`)
                       : bad(`Вода section missing: ${missing.join(" | ")}`);
  t.includes("Вода вчить міряти") ? bad("old headline still present") : ok("old headline removed");
  // order: canoe line must come after the new headline
  const iH = t.indexOf("Вода вчить працювати"), iC = t.indexOf("Каное не пробачає"), iL = t.indexOf("В нашій команді");
  iH < iC && iC < iL ? ok("Вода: headline → canoe line → offers, in order")
                     : bad(`Вода order wrong: ${iH} / ${iC} / ${iL}`);
  await p.close();
}
await b.close();
console.log(`\n${fails} failure(s)`);
process.exit(fails ? 1 : 0);
