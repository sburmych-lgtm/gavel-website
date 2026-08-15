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
