# Real-browser QA report

Harness: `scripts/qa.mjs` (Playwright + Chromium), run against the **production
build** served by `astro preview`, not the dev server — the dev toolbar injects
its own DOM and would pollute the results.

Evidence: `docs/quality/screens/` — hero and full-page capture at every width,
plus reduced-motion and no-JS full-page captures.
Machine-readable: `docs/quality/qa-report.json`.

**Result: 36 checks, 0 fail, 0 warn.**

## Coverage

| Width | Overflow | Console |
|---|---|---|
| 1920 | none | clean |
| 1440 | none | clean |
| 1024 | none | clean |
| 768 | none | clean |
| 390 | none | clean |
| 320 | none | clean |

| Check | Result |
|---|---|
| H1 exact wording | `СИЛА ВИКОВАНА ВОДОЮ` |
| Exactly one `h1` | yes |
| Slider — arrow keys step 1% | 50 → 52 |
| Slider — shift+arrow steps 10% | 52 → 62 |
| Slider — Home / End | jumps to 0 / 100 |
| Slider — pointer drag | landed 35% from a drag to 35% |
| Slider — clip-path active | `inset(0px 65% 0px 0px)` |
| Focus ring on slider grip | 2px solid |
| Touch targets ≥ 44px | pass |
| Reduced motion — managed video fetched | none (posters only) |
| Reduced motion — content visible | all |
| No-JS — key strings in HTML | 9/9 |
| No-JS — reveal blocks visible | 53/53 |

## Contrast, measured from rendered pixels

| Element | Ratio | Needs |
|---|---:|---:|
| `main h1` | 16.75 | 3 |
| `#fit h2` | 14.68 | 3 |
| `#fit .lead` | 8.02 | 4.5 |
| `#method .eyebrow` | 5.98 | 4.5 |
| `.btn-primary` | 9.18 | 4.5 |
| `#pricing .p-inc` | 12.32 | 4.5 |
| `#method .m-b` | 7.92 | 4.5 |
| `#results .lead` | 7.23 | 4.5 |
| `.q-a p` | 7.23 | 4.5 |
| `.ft-where` | 7.92 | 4.5 |
| hero eyebrow **over video** | 8.19 | 4.5 |

These are measured, not asserted. No WCAG conformance is claimed — that is a
different statement from a set of passing measurements.

---

## Defects found and fixed

Every one of these came out of looking at the render, not out of the checklist.

### 1 · Hero eyebrow unreadable over water — 2.75:1

Teal `--caustic` over mid-tone water. Token maths said nothing useful here
because the text sits on video, not on a background colour, so a
rendered-pixel probe was added to the harness. Strengthening the scrim was not
enough: teal is a mid-tone and no realistic scrim separates it from water
without killing the water.

**Fixed** by using `--foam` for the hero eyebrow, with the gold accent kept as a
28px rule before it. Teal remains the eyebrow colour everywhere the ground is a
solid token (5.98:1). Text over photography needs luminance separation, not hue.
Re-measured: **8.19:1**.

### 2 · Logo rendered as a gold smudge

Two compounding causes. The crop carried ~38% empty padding, so the mark drew at
62% of its box; and the lockup is nearly square with the wordmark overlapping the
monogram's lower third, so at header size the name was ~5px tall.

**Fixed** by cropping to the measured ink bounding box, and by adding a
monogram-only derivative for the header with the name set beside it in the
site's own display face. The full lockup stays in the footer at 56px where it
is legible.

### 3 · Before/After pair not camera-registered

Different rooms, different framing, subject at different scale — a wipe across
them read as a glitch. This is the defect that led two prior audits to
recommend dropping the slider entirely.

**Fixed** by measuring the shoulder line and waistband in both sources,
equalising torso height and pinning the waistband to a shared canvas Y. Crop
and scale only; no body retouching. Verified by rendering a 50% wipe and
checking seam continuity.

### 4 · Coach poster showed the wrong moment

The clip started at 13.5s to avoid the burnt-in captions, but that window
contains only silent demo footage — the poster was Igor bent over a rack, back
half-turned, in a section whose entire job is meeting the person.

**Fixed** by moving the window to 0–12s and *keeping* the captions. The previous
prototype skipped them because it used the clip as a decorative aria-hidden hero
background, where text inside video is meaningless. Here the clip is the Coach
section and the captions introduce him by name and name the venue — they are the
content, and they make muted autoplay comprehensible. A `vignette="soft"`
variant and a lighter grade were added to `MediaFrame` so the vignette does not
wash them out.

### 5 · Two competing portraits in the Coach section

`On_Beach.JPG` sat below the copy at full width, so the section read as two
portraits and the best photograph in the project was buried.

**Fixed** by removing it from Coach and promoting it to the lead image of the
Athlete section, where it gets the largest photo slot on the page.
`Canoe2.JPG` moved to the side column and the weaker `Canoe1.JPG` was dropped.

### 6 · Supporting proof cards heavily letterboxed

Four composites of very different shapes forced into a 4:3 box with
`object-fit: contain` produced thick black bars.

**Fixed** by dropping the forced ratio and using a masonry column layout so each
keeps its own proportions. `6_before-after.JPG` also had white bands baked into
the source (content occupies rows 173–1106 of 1280); those are now cropped in
the media pipeline.

### 7 · Header brand link below the 44px target

**Fixed** — `min-height: 44px` with the mark itself still at 34px.

---

## Two harness bugs worth recording

Both produced confident, wrong readings. Recorded because the next person to
run this will otherwise repeat them.

**Contrast probe reported 5,477,924:1.** Chrome serialises
`color-mix(in oklab, …)` as `oklab(…)`, which a digit regex reads as nonsense.
Replaced with a canvas-based resolver that also composites alpha over the real
ground.

**The scroll walk never scrolled.** `html { scroll-behavior: smooth }` makes
rapid successive `scrollTo` calls cancel one another, so the walk stayed near
the top and the full-page captures showed most of the page as black voids —
42 of 53 reveal blocks apparently hidden.

That reading briefly led to replacing IntersectionObserver with a scroll sweep.
Once the harness forced `scroll-behavior: auto` for the walk, 0 of 53 were
hidden and IntersectionObserver was shown to have been fine all along, so the
change was reverted rather than left in the codebase justified by a false
premise. The only part kept is a genuine guard: if `IntersectionObserver` is
unavailable, everything reveals immediately.
