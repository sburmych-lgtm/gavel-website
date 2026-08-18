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

  // mobile CTA: gold as the client asked, but muted against --gold and
  // smaller than a standard .btn
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
      const gold = px(getComputedStyle(document.documentElement).getPropertyValue("--gold").trim());
      return { bg: px(cs.backgroundColor), gold,
               h: Math.round(a.getBoundingClientRect().height),
               shown: document.querySelector("[data-sticky]").classList.contains("is-in") };
    });
    // still recognisably gold: red-dominant and warm
    const isGold = c.bg[0] > 150 && c.bg[0] > c.bg[2] + 80;
    // but dimmer than the full-strength token, by a small margin
    const dim = (c.gold[0] - c.bg[0]) / c.gold[0];
    const muted = dim > 0.02 && dim <= 0.15;
    const smaller = c.h < 48;
    isGold && muted && c.shown && smaller
      ? ok(`${name}: sticky CTA gold, muted ${(dim*100).toFixed(0)}% vs --gold, ${c.h}px tall (standard 48)`)
      : bad(`${name}: gold=${isGold} muted=${muted} (${(dim*100).toFixed(1)}%) smaller=${smaller} h=${c.h} shown=${c.shown} bg=${c.bg}`);
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
// contact routes to both of the trainer's channels, and no build vocabulary
// survives anywhere in the rendered text
{
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto(URL, { waitUntil: "networkidle" });

  const links = await p.evaluate(() =>
    [...document.querySelectorAll("#contact a[href]")].map((a) => a.getAttribute("href")));
  const hasTg = links.some((h) => h.includes("t.me/"));
  const hasIg = links.some((h) => /instagram\.com|ig\.me/.test(h));
  hasTg && hasIg
    ? ok(`contact: routes to both channels (${links.filter((h) => h.includes("t.me/") || h.includes("instagram.com")).join(" , ")})`)
    : bad(`contact: telegram=${hasTg} instagram=${hasIg} — ${links.join(" , ")}`);

  const body = await p.locator("body").innerText();
  const jargon = ["датасет", "прототип", "placeholder", "lorem", "todo"];
  const found = jargon.filter((t) => body.toLowerCase().includes(t));
  found.length === 0
    ? ok("copy: no build vocabulary in rendered text")
    : bad(`copy: build vocabulary present — ${found.join(", ")}`);

  // the form must hand off for real, and must never claim it sent anything
  await p.context().grantPermissions(["clipboard-read", "clipboard-write"]);
  await p.locator("#f-name").fill("Тест");
  await p.locator("#f-goal").fill("Схуднути");
  await p.locator("#f-contact").fill("@test");
  const [popup] = await Promise.all([
    p.waitForEvent("popup", { timeout: 5000 }).catch(() => null),
    p.locator('[data-go="tg"]').click(),
  ]);
  await p.waitForTimeout(600);
  const opened = !!popup && popup.url().includes("t.me/");
  const status = (await p.locator("[data-contact-status]").innerText()).trim();
  opened && /скопійовано|вручну/i.test(status)
    ? ok(`contact form: opened the chat, reported "${status}"`)
    : bad(`contact form: opened=${opened} status="${status}"`);
  /надіслан|відправлен/i.test(status)
    ? bad("contact form: claims a message was sent")
    : ok("contact form: makes no false send claim");

  const clip = await p.evaluate(() => navigator.clipboard.readText()).catch(() => "");
  const expectedBits = ["Привіт! Хочу записатися на консультацію.", "Ім'я: Тест", "Моя ціль: Схуднути", "Зручний спосіб зв'язку: @test"];
  expectedBits.every((s) => clip.includes(s))
    ? ok("contact form: clipboard carries the typed fields")
    : bad(`contact form: clipboard mismatch — "${clip}"`);

  const igHref = await p.locator('[data-go="ig"]').getAttribute("href");
  /ig\.me\/m\/gavel_man/.test(igHref || "")
    ? ok(`contact form: Instagram Direct href ${igHref}`)
    : bad(`contact form: Instagram href is not Direct — ${igHref}`);

  await p.close();
}

// Pricing: new session price, intro line, medical exclusion moved off the block
{
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto(URL, { waitUntil: "networkidle" });
  const block = await p.locator("#pricing").innerText();
  block.includes("700") && block.includes("Перше тренування — 400 ₴")
    ? ok("pricing: 700 ₴ with introductory 400 ₴")
    : bad(`pricing: missing new session prices — ${block.slice(0, 240)}`);
  block.includes("Не працюю з людьми, яким медично протипоказані")
    ? bad("pricing: medical exclusion is still in the pricing block")
    : ok("pricing: medical exclusion removed from the pricing block");
  const faq = await p.locator("#faq").innerText();
  faq.includes("медично протипоказані")
    ? ok("faq: medical exclusion remains on the page")
    : bad("faq: medical exclusion missing from the page");

  const proof = await p.locator(".proof").innerText();
  const proofNeed = ["26", "років у спорті", "років тренерської діяльності", "2×", "майстер спорту України — каное та Dragonboat", "титули: Україна, Європа, Євро-Азіатські ігри; призер ЧС"];
  const proofMissing = proofNeed.filter((s) => !proof.includes(s));
  proofMissing.length === 0
    ? ok("home: achievement strip matches the client edit")
    : bad(`home: achievement strip missing ${proofMissing.join(" | ")}`);
  await p.close();
}

// Water: one active playback, sound arbitration, pause when off-screen
{
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto(URL, { waitUntil: "networkidle" });
  await p.addStyleTag({ content: "html{scroll-behavior:auto !important}" });
  await p.locator("[data-water-stage]").scrollIntoViewIfNeeded();
  await p.waitForTimeout(400);
  await p.waitForFunction(() =>
    [...document.querySelectorAll("[data-water-stage] video")].some((v) => v.currentSrc),
    { timeout: 5000 },
  ).catch(() => {});

  const slots = p.locator("[data-water-item]");
  const n = await slots.count();
  n === 3 ? ok("water: three coordinated slots") : bad(`water: ${n} slots, expected 3`);

  const playing = () => p.evaluate(() =>
    [...document.querySelectorAll("[data-water-stage] video")].map((v) => ({
      paused: v.paused,
      muted: v.muted,
      src: v.currentSrc.split("/").pop() || "",
    })));

  const s0 = await playing();
  const live0 = s0.filter((v) => !v.paused && v.src);
  live0.length <= 1 && s0.every((v) => v.muted)
    ? ok(`water: at most one playing, all muted (${live0.map((v) => v.src).join(",") || "none yet"})`)
    : bad(`water: simultaneous playback — ${JSON.stringify(s0)}`);

  await slots.nth(1).click();
  await p.waitForFunction(() => {
    const vs = [...document.querySelectorAll("[data-water-stage] video")];
    return vs[1] && !vs[1].paused;
  }, { timeout: 4000 }).catch(() => {});
  const s1 = await playing();
  const live1 = s1.filter((v) => !v.paused);
  live1.length === 1 && s1[1] && !s1[1].paused && s1[0].paused && s1[2].paused
    ? ok("water: selecting another slot pauses the others")
    : bad(`water: switch state ${JSON.stringify(s1)}`);

  await slots.nth(1).locator("[data-av-sound]").click();
  await p.waitForTimeout(300);
  const s2 = await playing();
  const unmuted = s2.filter((v) => !v.muted);
  unmuted.length === 1 && !s2[1].muted && s2[0].muted && s2[2].muted
    ? ok("water: only the active clip can unmute")
    : bad(`water: sound arbitration ${JSON.stringify(s2)}`);

  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(700);
  const s3 = await playing();
  s3.every((v) => v.paused)
    ? ok("water: all clips pause when the section leaves the viewport")
    : bad(`water: still playing off-screen — ${JSON.stringify(s3)}`);

  await p.close();
}

// the H1 must extract as three words for a crawler that does not run CSS
{
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  const res = await p.goto(URL, { waitUntil: "domcontentloaded" });
  const html = await res.text();
  const m = /<h1[^>]*>([\s\S]*?)<\/h1>/.exec(html);
  const raw = m ? m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() : "";
  raw === "СИЛА ВИКОВАНА ВОДОЮ"
    ? ok(`h1 raw extraction: "${raw}"`)
    : bad(`h1 raw extraction: "${raw}" — must read as three separate words`);
  await p.close();
}

await b.close();
console.log(`\n${fails} failure(s)`);
process.exit(fails ? 1 : 0);
