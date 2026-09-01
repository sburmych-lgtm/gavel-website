# WORKLOG

Newest last. One entry per checkpoint.

---

## CP-00 — repository and continuity scaffold · 2026-08-15

**Done**

- `git init` on `main`; Astro 7.2.2 + sharp installed.
- Re-inspected the complete current asset library recursively (not from
  remembered names). 218 media files across `Photo/`, `Photo/SelfPhoto/`,
  `Video/`, `before-after/`, `Animation_1/`. Confirmed the newest additions are
  `1_before.png`/`1_after.png` (17:00–17:02), `Canoe_ocean_16-9.mp4` (16:36),
  `Canoe_ocean2/3.jpeg` (16:30), `In_Gym.JPG` (16:18), `On_Beach.JPG` (15:53),
  `Canoe1/2.JPG` (15:51).
- Inspected every candidate at full resolution or via frame grids, including
  the 76-image `SelfPhoto` shoot and all previously unviewed clips.
- Ran `scripts/build-media.sh` — all derivatives produced.
- Ran `scripts/fetch-fonts.mjs` — 24 woff2 faces vendored.

**Findings that changed earlier assumptions**

- `Canoe_ocean_16-9.mp4` is 1280×720, but a 1:1 detail crop is genuinely sharp
  (chain links, foam texture, paddle grain resolve). It is usable as a desktop
  hero, resampled once to 1600×900 with a sharpening pass rather than left to
  browser scaling. This overturns the earlier audits' "never full-bleed" rule,
  which was written before this landscape source existed.
- The client's own logo has a **gold** variant. That makes gold brand-owned
  equity rather than a taste choice, and «викована» (forged) is a metal
  metaphor — so metallic gold on deep water is thematically exact. Resolves the
  foam-vs-ember CTA deadlock between the prior audits without picking either.
- The featured Before/After pair is **not registered** — different rooms,
  framings and subject scale. Normalised by measured landmarks; see
  `build-media.sh`.
- Cursor's and Codex's finding that `1_before`/`1_after` faces are unblurred is
  **stale**. The current files are the blurred version; verified visually.
- All 76 `SelfPhoto` images are one redundant session, and `In_Gym.JPG` is
  already its best frame at higher resolution. Dropped the set entirely.
- `Dragonboat_canoe.mp4` contains real team racing footage and had no assigned
  role in any prior audit. Added to the athlete story.
- `Animation_1/Antigravity_Final/Intro_Final.mp4` carries the title card
  «Сила, викована веслом.» — the direct ancestor of the mandated H1. Confirms
  the forged-metal metaphor is intentional brand language. The animation itself
  is rejected (splash intro, and its Poseidon siblings are banned).

**Commit** — see `git log`.

---

## CP-01 — final architecture package · 2026-08-15

17 documents written and mirrored to `FINAL_CLAUDE_CANDIDATE`.

**Conflicts resolved rather than averaged**

- *CTA colour.* Cursor mandated off-white and made ember a release blocker;
  Antigravity mandated `#E85D22`, inside Cursor's forbidden family. Resolved on
  evidence neither weighted: the client owns a gold logo variant, so gold is
  brand equity, hue ≈42° is outside the banned orange family, and «викована»
  is a forging word. Gold at `#E1AE42`, ink text, 9.19:1.
- *Full-bleed hero.* Cursor and Claude both forbade it on correct arithmetic
  about the vertical source. Overturned — the landscape source is a different,
  natively 16:9 file that postdates both audits.
- *Before/After slider.* Cursor and Codex both rejected it. Client decision is
  fixed, so it is built; their underlying registration objection was real and
  is solved by measurement.
- *Method model.* Codex rejected the stroke metaphor as obscuring the factual
  method; Cursor and Claude adopted it. Adopted, with the literal meaning set
  beside each phase name so the metaphor carries no information alone.
- *Self_Presentation placement.* Claude said before pricing, Codex after. After
  — the Method→Results→Formats→Pricing argument must not be interrupted, and
  after pricing the section answers the objection pricing creates.
- *Typography.* Fixel and e-Ukraine Head are not reliably obtainable.
  Substituted Geologica / Onest / JetBrains Mono, which satisfy every stated
  rule including both ban lists.

**Added where every prior package was silent** — a full SEO, local SEO and
AI-search architecture (`13`), including a crawler policy that separates search
visibility from model-training permission.

---

## CP-02 … CP-09 — frontend built, browser QA passed · 2026-08-15

Astro 7 static, plain CSS tokens, three small islands, thirteen sections, no
framework runtime. Full build passes both guards. `scripts/qa.mjs` runs 36
checks against the production build at six widths: 0 fail, 0 warn.

Seven defects found by looking at the render, not by the checklist — hero
eyebrow at 2.75:1 over water, logo rendering as a gold smudge, the unregistered
before/after pair, the wrong Coach poster moment, two competing portraits in
the Coach section, letterboxed proof cards, and a sub-44px header target. All
fixed and re-verified. Full detail in `docs/quality/QA_REPORT.md`.

Also recorded there: two harness bugs that produced confident wrong readings.
The contrast probe was mis-parsing Chrome's `oklab()` serialisation of
`color-mix`, and `scroll-behavior: smooth` was cancelling the programmatic
scroll walk, which made it look as though IntersectionObserver was leaving 42
of 53 blocks hidden. It was not — the harness was. The IO replacement written
on that false premise was reverted.

**Media decisions changed by rendered evidence**

- Coach clip moved from 13.5–25.5s to **0–12s**, keeping the burnt-in captions.
  They introduce him by name and name the venue, and they make muted autoplay
  comprehensible. The old window had no face-to-camera frame at all.
- `On_Beach.JPG` promoted from a buried position under the Coach copy to the
  lead image of the Athlete section.
- `Canoe1.JPG` dropped — the weakest of the three water photographs.
- `logo-mark.png` added: the full lockup is unreadable at header size.

---

## CP-10 — Railway preview deployed and verified · 2026-08-15

Public URL: <https://igor-gavrileyko-final-claude-production.up.railway.app>

Two build failures on the way, both recorded in `docs/DEPLOYMENT.md`:
`npm ci --omit=dev` collided with Nixpacks' mounted cache volume (EBUSY), and
`astro preview` 403'd every request because Vite's preview server has a Host
allowlist. Replaced with `sirv`, which is what Astro uses internally and which
serves Range requests correctly — verified 206 on the deployed video.

The full QA harness was re-run against the live HTTPS URL, not just the local
build: 36 checks, 0 fail, 0 warn. Evidence in `docs/quality/deployed/`.

---

## CP-11 — client revision round · 2026-08-15

Previous version frozen on branch `preview-v1-approved-base` @ `dcb9c24`
before any of this landed.

**1 · The Before/After slider animates itself.** Ported from
`New_Proto/Claude`: a sine between 12% and 88%, one sweep every ~5.5s. The part
worth carrying over is `syncPhase()` — on release the wave restarts from where
the user left the handle, not from where it would have been, otherwise every
release snaps sideways. Pauses on drag, on keyboard focus, and off-screen. The
explanatory line was removed and the heading is now «Заміри, а не обіцянки».

**2 · The Coach panel is a montage.** Eleven shots from six real sources,
crossfaded at 0.4s, one unified colour grade, silent, looping, 18.9s. Frame 0
is also the poster, and a first cut opened on the lake — which left «Хто я»
represented by a photograph of water. Reordered to open on the one clean
full-face standing moment in the source, at 11.7s. Built by
`scripts/build-montage.mjs`.

`Fitness_traine_girl.mp4` is in at the client's instruction, resolving H-01.
The AI-generated paddling clip was offered but left out — `Canoe_lake.mp4`
covers the same beat with real footage.

**3 · Footer credit** replaces the copyright line, with Telegram and Instagram
links to the real chats.

QA: 36 checks, 0 fail, both locally and against the deployed URL. One new
assertion added — the sweep must move on its own — and two updated, because
Home/End now land on the declared 12/88 rather than 0/100 and the drag fixture
was grabbing the stage edge instead of the handle.

---

## CP-12 — second client revision round · 2026-08-15

**1 · Every result case drives the slider.** The blocker was that four of five
cases arrived as two-up composites, and a wipe needs two images. Each was cut
at its seam — and the seams are not at 50%: 44.6%, 46.6%, 55.1%, 49.9%, found
by measuring the largest column-to-column difference (or the white divider
strip where there is one). Halves are padded to identical dimensions and the
build fails if a pair comes out mismatched.

The frame is now sized from its height, not the column width. Stretching it to
the column and capping the height made the box wider than the photograph, so
`object-fit: cover` cropped a full-body comparison down to a chest.

**2 · Coach panel plays `IGOR GAVRILEYKO.MOV`** — the client's own finished
edit, which is stronger than the montage it replaces. It is the only video on
the site with audio, so the panel carries a sound toggle instead of a pause
button, and the video is no longer `aria-hidden`.

**3 · Footer credit** sits as one line instead of being thrown to opposite
edges.

**4 · Header monogram** was cropped at 340 of the ink box; its strokes run to
~400, so the crop was slicing the letterforms. Now 375.

**5 · Mobile sticky CTA** no longer reappears over the footer credit.
Observing `#contact` alone failed because that section is taller than the
viewport — once it scrolled past, `isIntersecting` went false again. Verified
across five scroll positions including a flick straight to the bottom.

QA is now 42 checks, 0 fail. Six new assertions cover the case switcher (pair
swap, frame ratio, aria-selected, caption, matching half dimensions) and the
sound toggle. Two existing checks had to be reordered rather than changed: the
sound test scrolls to the coach video, which correctly pauses the slider
sweep, and a programmatic focus after a mouse click does not satisfy
`:focus-visible`.

---

## CP-13 — third client revision round · 2026-08-15

Four requested changes, plus two bugs found while fixing them.

**Header logo.** Complete lockup on both breakpoints. Rendered at four sizes
to find where the wordmark becomes readable — 76px desktop, 68px mobile, bar
grown to 6rem.

**Mobile menu.** Root cause was `backdrop-filter` on the header creating a
containing block for the `position: fixed` panel nested inside it: 772px tall
at the top of the page, 71px once scrolled. Panel moved out to be a sibling.
Raising the bar above the overlay then hid the burger, so `--z-header: 60` was
added and the bar drops its glass while open. Separately, the burger's X
rendered as an arrow because `:first-child` matched the screen-reader label
rather than the first bar.

**Mobile CTA.** Azure instead of gold — it sat directly under a large gold
logo and read as an advert.

**Вода section.** New headline, canoe line lifted into the headline
composition, three offers in the Method's row grammar.

QA 42 checks, 0 fail, locally and deployed.

---

## CP-14 — fourth revision round + SEO implementation · 2026-08-15

Rollback point for the previous version: branch `preview-v2-approved-base`
@ `0492d01`.

Four requested fixes: header bar back to 4.5rem with the full lockup scaled to
fit; sticky CTA gold again at 8% muted and 42px; all build vocabulary removed
from client-facing copy; the contact form now hands off to Telegram
`@gavelman` and Instagram `@gavel_man`.

Then the SEO audit's recommendations implemented on the prototype rather than
deferred. Full list in D-28. The headline item was mine to fix: the `SITE_URL`
fallback was missing `-production`, pointing every canonical signal at a 404.

Three bugs surfaced while doing it, each caught by measuring rather than
assuming: preloading fonts whose content-hashed names had changed (now guarded
by `check-fonts.mjs`); the sticky button landing at 49px because padding and
line-height beat `min-height`; and `window.open` being suppressed as a popup
after an `await` spent the user-gesture context — fixed properly by making the
handoff an ordinary link, which also works with JS disabled.

Verification: `qa.mjs` 43 checks and `verify-fixes.mjs` 25 checks, both 0 fail,
locally and against the deployment.

---

## CP-15 — production frontend candidate v1 · 2026-08-18

Isolated branch `production/frontend-v1-grok` from tagged baseline
`client-approved-prototype-v1` @ `cac608a`. Approved `main` was not edited.

Client content/media pass:

- Home achievements: 26 / 16 / 2× / 4 with the requested labels.
- Pricing: session 700 ₴, subordinate line «Перше тренування — 400 ₴»;
  medical exclusion removed from the pricing block and restated under FAQ.
- Formats portrait replaced with a derivative of `Assets/Edits/Page_5_edit.jpg`.
- Water grid: three client videos (`Page_8_editvideo1/3/2`), one active
  playback, viewport pause, per-clip «Звук» toggle, single audio stream.
- Contact: message built from typed fields, sync clipboard copy, Telegram
  `t.me/gavelman`, Instagram Direct `ig.me/m/gavel_man`. No fake send state.

Verification: `npm run check` ok; `npm run build` ok; `qa.mjs` 43 checks,
0 fail, 0 warn; `verify-fixes.mjs` 0 fail. Local preview
`http://127.0.0.1:4321/`. Not merged to `main`. Railway production not
touched.

**Commit** — see `git log`.

---

## Preview — IMG_1851 intro on the canoe-scroll backdrop · 2026-08-31

Ported the approved one-shot open (IMG_1851, last 0,62 s veil fade, fly into
`.hdr-brand`, mobile contain) onto `claude/scroll-canoe-backdrop` @ `ef273c0`.
The canoe canvas idles while `html.is-intro` is set, then scrubbing resumes.
`npm run check` ok. Playwright: intro plays, brand docks, scrollY 900 still
has the backdrop. Production `main` untouched.

---

## Preview — mobile intro cover, playback, darkened QA · 2026-08-31

The live phone screenshot was a 16:9 strip in empty black. Cover fills the
viewport with water; a blurred poster wash is the ground, not `#000`. On
portrait the cropped film is dropped at the hand-off so the full lockup is
readable, then it flies into `.hdr-brand`.

iOS hang: the hero loop was starting under the overlay (one decoder, two
films). Autovideo and the 72 canoe frames now wait until `html.is-intro` is
gone. Intro `play()` is serialised; first tap unlocks instead of skipping;
no per-frame video resize.

QA `scripts/qa.mjs` against the canoe-darkened page: **43 / 0 / 0**. Token
contrast after darkening still clears WCAG (h1 16.75:1, `#fit .lead` 5.62:1,
hero eyebrow pixels 8.43:1). Lighthouse 13.4.1 mobile, page not overlay:
accessibility 100, best-practices 100, `color-contrast` pass. `npm run check`
ok. Production `main` untouched.

---

## Preview — revert mobile cover, keep wash · 2026-08-31

Cover-crop on the phone zoomed the lockup and jumped size at the hand-off.
Rolled back to a contained 16:9 (same box from first frame through dock).
The letterbox is a blurred water wash, not empty black. iOS decoder gating
stays. Session `ig-open-1851-m3`.

---

## Preview — visible canoe letterbox on mobile · 2026-08-31

The film-poster wash was too dark to tell from black. Phones now use the
portrait canoe still behind the 16:9 open. Session `ig-open-1851-m4`.

---

---

## CP-16 (Version 2) — Scroll Upgrade & Audit Polish · 2026-09-01

Branch: `version-2`

**Done:**
- **Phase A — Scroll Mechanics (§1–§6):**
  - `77f7ad6`: Viewport-relative stroke cycle length (`STROKE_VIEWPORTS = 1.35`, mobile `1.8`, debounced resize/orientation handler).
  - `938f478`: Two-frame alpha interpolation with `LERP = 0.18`, `{ alpha: true, desynchronized: true }`, idle threshold `< 0.002`.
  - `d98e740`: Parallax overscan `inset: -20px`, `calc(100% + 40px)`, fine-pointer gating, damped `0.06` inertia in `tick()`.
  - `5689771`: Added 72-frame Lanczos 1024×576 extraction in `build-media.sh`, generated high-res frames, implemented DPR backing store (`sizeCanvas()`, `drawCover()`, `MAX_DPR = 2`), removed canvas fixed width/height and CSS `object-fit: cover`.
  - `fcff945`: Added smooth poster fade (`transition: opacity 600ms`) triggered on `loadedCount >= 8`.
  - `ee8ab8e`: Fixed `rgba(0, 0, 1)` typo to `rgba(0, 0, 0, 1)` in `mask-image` and `-webkit-mask-image`.
- **Phase B — Dramatic Arc (§7a):**
  - `35b769e`: Added `<div class="backdrop-grade" aria-hidden="true"></div>` overlay and scroll-progress opacity drive (`0..0.85`, throttled to `|delta| >= 0.01`).
- **Phase C — Technical Fixes (DESIGN_AUDIT Section B):**
  - `c9c3ff5`: Recompressed `water-primary.mp4` via ffmpeg (CRF 31, no audio, 1.53MB) and configured lazy loading.
  - `3609a8d`: One-shot intro session gate + instant skip on reduced-motion / save-data + z-index 10 skip button.
  - `b8b95b1`: Audit and full coverage for `alt=""` and `aria-hidden="true"` across images.
  - `54c27d2`: Accessible keyboard slider handle with visible focus outline.
  - `2bc57ab`: Polish FAQ focus state, smooth expand animation, and remove trailing period from FAQ H2.
  - `c99367a`: Hide mobile sticky CTA when `#contact` is in viewport.
  - `a5e377f`: Add `aria-pressed` and high-contrast scrim shadow to video controls.
- **Phase D — Design Proposals (DESIGN_AUDIT Section A):**
  - `e3312f3`: `proposal: drop NN/11 section counters, ration eyebrows` (A1).
  - `2c8633b`: `proposal: vary section header scaffold` (A2).
  - `3cdc003`: `proposal: de-number Fit pains, reflow Athlete bonuses` (A3).
  - `9af0865`: `proposal: drop 01/05 counter and media number chips` (A4).

**Verification Results:**
- Facts guard: 26 files passed.
- Assets check: 11 video derivatives passed.
- Fonts check: all woff2 fonts passed.
- Seam Gate: RMSE = 0.000 / 255 (<= 3/255).
- Horizontal overflow: 0 across 320px, 375px, 390px, 768px, 1440px.
- Review screenshots captured in `review/version-2/`.


---

## CP-12 — desktop open: docking parity with the portrait cut · 2026-09-01

Branch: `version-2`

**Problem**

The portrait open docked cleanly; the landscape one arrived crooked and read as
jerky. Frame-by-frame capture of both (headless Chromium screencast + per-frame
geometry log) gave three separate causes, none of them the easing:

1. **Different artwork.** `open-mark.webp` (the landscape film's last frame) is
   the wide lockup with `IGOR GAVRILEYKO` on ONE line, 603×484. The header
   carries `logo-gold.webp`, the compact two-line lockup, 340×329. Scaling by
   height matched the height and left the flyer 11 px wider than the target,
   then hard-cut one composition to the other. `open-mark-mobile.webp` is
   already the two-line lockup, which is the whole reason portrait looked right.
2. **Scrollbar reflow.** `html.is-intro { overflow: hidden }` removes the
   classic scrollbar, so the viewport is 15 px wider for the length of the
   intro and `.shell` re-centres. Measured: the header lockup jumped **7.50 px**
   left the instant the lock released — right after the flyer had docked onto
   it. Overlay-scrollbar platforms reserve nothing, so mobile never saw it.
3. **Reveal driven by `timeupdate`.** That event fires ~4×/s, so the veil fade
   could start a quarter second late and get cut to zero by the dock.

**Done**

- `SiteIntro.astro`: the flyer is now a box carrying both lockups. The landscape
  flight cross-dissolves the film mark into the header's own artwork mid-flight
  with the two IG monograms locked together (`MONO` / `BRAND.mono` fractions
  measured off the alpha channels), and ends on the header rect exactly.
  Verified landing: flyer `[168.5, 10, 53.7, 52]` vs header
  `[168.5, 10, 53.73, 52]`. Portrait keeps its straight translate + scale.
- Reveal moved from `timeupdate` to rAF; the fade duration is the film's own
  remaining time, so it always lands on the last frame.
- Flight clock scales with the distance the mark is seen to travel
  (`600–820 ms`, landscape ≈ 750 ms) on `cubic-bezier(0.28, 0, 0.06, 1)` — the
  fixed 640 ms made the landscape middle whip while both ends sat still.
- After a morph the flyer rides the stage out at full opacity instead of fading
  separately: the separate fade dropped the gold to ~45 % for a beat while the
  black above it was still clearing.
- `base.css`: `scrollbar-gutter: stable` on `html`. Shift measured again with a
  real 15 px scrollbar: **0.00 px**.
- `base.css` / `SiteIntro.astro`: new `is-intro-landed` class lights the header
  lockup at touchdown while `is-intro` — and with it the backdrop's 192-frame
  preload — stays parked until teardown.
- `Base.astro`: the pre-paint guard read `ig-open-1851-m5` while the component
  wrote `-m8`, so `is-intro` was applied on every load and stripped a tick
  later. Both now read `ig-open-1851-m9`.

**Verification**

- `npm run build` — exit 0 (facts 26 files, assets 11 derivatives, fonts OK).
- Screencast of the full open re-captured at 1440×900 and 390×844: landing
  pixel-exact on desktop, portrait unchanged.

---

## CP-13 — new open film (IMG_1865) on the landscape cut · 2026-09-01

Branch: `version-2`

**Why**

Client supplied a better cut of the same intro. Same beats, stronger
execution: the paddle strike throws a ring of **liquid gold** out of the water
instead of drawing a wireframe outline of the logo on it, and it resolves to a
centred, front-on, evenly lit lockup on clean black rather than an off-centre
one under a lens flare. HEVC master, no Kling watermark, and **2.83 s against
3.83 s** — a full second less before the hero. Encoded output is 776 KB at
2.19 Mbit/s, against 780 KB at 1.63 Mbit/s: same weight, more bits per frame,
one second shorter.

It does **not** solve the composition mismatch — the wordmark is still set on
one line against the header's two — so the mid-flight morph from CP-12 stays.
Portrait is untouched and still plays the IMG_1851 cut.

**Done**

- `build-media.sh`: desktop open now derives from `IMG_1865.MOV`. Dropped the
  `delogo` pass — verified by boosting the last frames 4× that this master
  carries no watermark. Mark crop re-measured: gold ink box on the last frame
  is `(385,201,510,387)`, taken with a 4 px margin as `crop=518:395:381:197`.
- `SiteIntro.astro`: `MARK` follows that crop; `REVEAL_S` 0.62 → 0.50 (the
  flare is gone and the lockup has stopped moving by frame 70 of 85).
- Replaced the derived `MONO` / `BRAND.mono` pair with a single measured
  `BRAND_AT` — where the header artwork has to sit inside the mark for the two
  monograms to coincide, fitted by maximising mask overlap over uniform scale
  and offset. Best IoU **0.693**; an independent-axis fit only reached 0.694,
  so the uniform anchor is kept and no corrective stretch is needed.
- Moved the cross-dissolve from 0.14–0.58 of the flight to **0.46–0.68**. At
  the old offsets the swap happened at ~480 px, where both wordmarks are
  legible at once and it reads as a smear. It now runs from ~140 px down to
  ~80 px, where the wordmark is a gold hairline either way.

**Verification**

- Landing on the new film, 1440×900: brand layer `[168.5, 10, 53.7, 52]`
  against header `[168.5, 10, 53.73, 52]`. Flight 798 ms.
- Largest single-frame film-opacity drop through the reveal: 0.087.
- Portrait unchanged: flyer `[23, 13, 42, 46]`, header `[20, 13, 48, 46]`,
  film still 2.667 s.
- `check-assets` 12 derivatives, `check-facts` 26 files, `check-fonts` ok.

---

## CP-14 — close the two dark seams down the sides of the open · 2026-09-01

Branch: `version-2`

**Problem**

Owner reported vertical bands down both sides at the start of the intro.
Two separate causes, measured on the encoded film and on a screenshot of the
running page:

1. The film's first ~0.75 s is a water plate narrower than the frame, matted
   to pure `#000` — 66 px left and 77 px right of a 1280-wide frame, so about
   100 px a side once scaled up. The stage under it was `--abyss` `#060e12`,
   which is *lighter*, so each matte edge drew a hard vertical rule.
2. `scrollbar-gutter: stable` (CP-12) reserves a 15 px gutter. The stage is
   `position: fixed`, but Chrome still clips it to the root scroller, so it
   stopped short of that gutter and the page ground showed as a 15 px band
   down the right edge — for the whole intro, not just the water.

**Done**

- `.intro` and `.intro-veil` backgrounds `var(--abyss)` → `#000`, matching the
  film's own matte.
- `html.is-intro { background: #000 }` so the reserved gutter paints black
  too. `body` keeps `--abyss`, so nothing changes once the intro tears down.

**Verification**

Screenshot at `ct = 0.32` s, 1600×900, scanned at y = 120 / 405 / 760:
`--abyss`-coloured columns **none** on any row, both extreme columns
`0,0,0`. Across the left matte edge the ramp is 0,0,0 → 3,8,9 → 21,25,26 →
35,39,41 — the plate's own soft edge, no step. Landing unaffected: brand
layer `[168.5, 10, 53.7, 52]` against header `[168.5, 10, 53.73, 52]`;
portrait still `[23, 13, 42, 46]`.

---

## CP-15 — the open runs edge to edge · 2026-09-01

Branch: `version-2`

**Why**

Owner: the film sits in a box, it is 16:9, it should fill the window. CP-14
made both side bands the same black, which stopped them reading as a border,
but the picture still did not reach the edges.

**Done**

- `build-media.sh`: the landscape open is now **cropped to its own picture**,
  `crop=1128:720:72:0`. Measuring every column of every frame, the master's
  water plate runs x=70 to x=1202 and everything outside is matte; the cut
  takes 72..1199, two px inside the plate's soft edge. Horizontal only —
  keeping all 720 rows lets the browser decide how much to crop for the window
  it is in, rather than baking one choice in. Residual matte after the crop:
  **0 px** on every frame (frame 001 reads 16 px only because it is a fade-in
  from black and the whole row sits at brightness 2). Mark crop follows to
  `518:395:309:197`; the produced mark is byte-for-byte the same 518×395 with
  its monogram still at `(26, 4, 465, 325)`, so `BRAND_AT` is unchanged.
- `.intro-film` now always fills the stage, with `object-fit` deciding the
  rest: `contain` as the floor, `cover` between 5/4 and 9/4. The wordmark sits
  at 0.82 of the frame height and the mark at 0.79 of its width, so past 9/4
  the crop starts eating the wordmark off the bottom and below 5/4 it eats the
  mark off the side; outside that band the film letterboxes on black instead.
- `.intro-slot` gained `grid-template: 100% / 100%`. Its implicit auto row left
  the film's `height: 100%` resolving against an indefinite size, so it fell
  back to `auto` and the element took the film's aspect instead of the stage's
  box — 1905×1216 inside a 1905×920 stage.
- `flyerBox()` resolves the drawn picture from the computed `object-fit`
  rather than assuming the element box is the picture: `cover` scales by max
  and crops, `contain` by min and pads, `fill` per axis. MARK is in film
  pixels either way.
- **Dropped `scrollbar-gutter: stable`** (CP-12) for a flow compensation. The
  gutter kept the header still but cost more than it saved: the stage is
  `position: fixed` and Chrome clips it to the scrollport, so the film stopped
  15 px short of the right edge for the whole intro. Now the scrollbar simply
  goes with the lock and the same width is handed back as `padding-right` on
  `body` and on the fixed `.hdr`, from a `--sbw` measured by a probe before
  first paint in `Base.astro`.

**Verification**

With real 15 px scrollbars, holding the water frame at `ct = 0.32`:

| viewport | fit | extreme-left px | extreme-right px | header shift |
|---|---|---|---|---|
| 1920×920 | cover | 102, 98, 60 | 111, 125, 111 | 0.00 px |
| 1600×900 | cover | 191, 98, 78 | 156, 125, 144 | 0.00 px |
| 1440×900 | cover | 191, 98, 75 | 149, 125, 197 | 0.00 px |
| 2560×1080 | contain | 0, 0, 0 | 0, 0, 0 | 0.00 px |

Picture at both physical edges, no band. 2560×1080 is past 9/4 and letterboxes
by design — black on black.

Lockup never clipped: checked at 1920×920, 2560×1080, 1600×900, 1440×900,
1280×800, 3440×1300, 1000×800 and 390×844 — the mark rect is inside the
viewport on every one. Landing: `[416, 10, 53.7, 52]` against header
`[416, 10, 54, 52]` at 1920×920, `[176, 10, 53.7, 52]` against
`[176, 10, 54, 52]` at 1440×900. Portrait untouched at `[23, 13, 42, 46]`.
