# DECISIONS

Numbered, dated, with the reason. A decision is only superseded by a later
numbered entry, never by silent edit.

---

## D-00 · Authority order

1. Current human/client decisions in the brief
2. Current assets and rendered browser reality
3. The trainer dataset (`ihor_havryleiko_dataset.md`)
4. Coherent visual, commercial and technical reasoning
5. Prior synthesis audits (Claude / Codex / Cursor / Antigravity / V3)
6. WDI assurance knowledge

Prior audits are input, not verdict. Where current assets contradict an audit
written before those assets existed, the assets win.

---

## D-01 · Fixed client decisions carried verbatim

Brand spelling `IGOR GAVRILEYKO`. H1 `«Сила викована водою»`. Water/canoe owns
the first impression. A draggable Before/After slider is mandatory. No splash,
no gym-first hero, no mythology, no reference-site orange.

`«Сильніше тіло. Чіткий курс.»`, `«Не на віру — на заміри.»` and
`«Візьму за техніку. Не зламаю.»` are permitted only as secondary copy.

---

## D-02 · Palette is derived from the assets, not chosen

Sampled the real files with `ffmpeg palettegen` rather than picking hexes by
taste. `On_Beach.JPG` yields desaturated steel blues over near-black;
`Canoe2.JPG` yields deep petrol-teal; `Logo_gold_version.jpg` yields a gold
ramp `#915F12 → #F9D76E`.

The page ground, surfaces and water tones come from the photography. The accent
is the logo's gold.

---

## D-03 · Gold is the accent and the primary CTA fill

**The single biggest unresolved conflict in the prior audits.** Cursor mandated
an off-white fill and made ember/orange a release blocker; Antigravity mandated
`#E85D22`, which sits inside Cursor's forbidden family. Claude's package
proposed off-white with rust in reserve.

Resolved by evidence neither had weighted: **the client already owns a gold
logo variant.** Gold is therefore brand equity, not taste. It is not in the
banned orange family — hue ≈ 42° against orange's ≈ 20°. And the mandated H1
says *викована* — forged — which is a metal metaphor, so a metallic accent on
deep water is the thematically exact choice.

Shipped as a matte solid fill only: no gradient, no glow, one filled primary
action per screen. `#E1AE42` on `#060E12` measures 9.7:1.

Retains every prohibition both audits actually cared about — no orange, no
neon cyan, no generic gym red/black.

---

## D-04 · Teal is light, never paint

Both prior audits converged on this independently and they are right. Teal
appears only as hairlines, focus rings, underlines and panel edges. Never a
button fill, never a section background, never a heading colour, never more
than roughly 5% of a viewport.

---

## D-05 · Desktop hero is the landscape source, full-bleed

Cursor and Claude both forbade a full-bleed hero, computing that upscaling the
720×1280 vertical source to a 1440-wide viewport is a 2× upscale with a 65%
crop. That arithmetic is correct — **and it was written before
`Canoe_ocean_16-9.mp4` existed.**

The current landscape source is natively 16:9. A 1:1 detail crop resolves chain
links, foam structure and paddle grain, so it is not a soft upscale of the
vertical file. It is resampled once to 1600×900 with Lanczos and a light
unsharp pass, which is sharper than leaving a 720p file to the browser's
bilinear scaler, and it sits under a dark gradient scrim that hides the
remaining softness on very large displays.

Superseded: the prior "never full-bleed" rule, on new evidence.

---

## D-06 · Mobile hero is the vertical source, 2.0–10.0s

`Canoe_Ocean-Main.mp4` is authentic phone footage. The 17–33s stretch is
unusable — lens spray, camera lurch, blown highlights — which both Cursor and
Claude independently identified and my own frame sampling confirms. The 2–10s
window is clean.

---

## D-07 · The Self_Presentation treatment moves, its grammar does not

The composition the client liked **was the previous prototype's hero**: a 9:16
panel capped at 340px, right-aligned in a 1.15fr/0.85fr grid, 2px radius, 1px
hairline at 20% opacity, no shadow, a cooling colour grade, a two-stop vignette
from an empty `aria-hidden` span, and deliberately no motion.

Water now owns the hero, so the grammar transplants to the Coach section as a
mirrored version of that grid. Every load-bearing value is preserved; only the
slot and the mirror direction change.

Clip window 13.5–25.5s: the burnt-in Ukrainian captions end around 12s, and
this window carries face-to-camera, pull-ups and an overhead press.

---

## D-08 · Method is the stroke cycle

`Захват → Проведення → Вихід → Курс` (Catch → Drive → Exit → Recovery).

Codex's package rejected this as a metaphor that "obscures the factual method"
and proposed literal step names instead. Cursor and Claude both adopted it,
Claude calling it "the only device that makes the canoe identity commercially
load-bearing rather than decorative."

Adopted, because the brief explicitly asks that water become commercially
meaningful rather than decorative, and because each phase maps onto a real
dataset item rather than a poetic gloss: Захват is the free consultation and
opórometric baseline, Проведення is programming and technique control, Вихід is
recovery/MFR/posture, Курс is measurement, nutrition and 24/7 support.

Codex's objection is answered by writing the literal meaning next to each phase
name rather than leaving the metaphor to carry the information alone.

---

## D-09 · The Before/After slider is built, and the pair is registered first

The slider is a fixed client decision, so Cursor's and Codex's rejection of it
does not apply. Their underlying observation is still true, though: the pair is
not camera-registered.

Normalised by measuring the shoulder line and waistband in both sources,
equalising torso height and pinning the waistband to a shared canvas Y. Crop
and scale only — no body retouching. Numbers are recorded in
`scripts/build-media.sh`.

The prior audits' claim that these faces are unblurred is **stale**; the
current files are the blurred version, verified visually.

---

## D-10 · Media dropped on inspection

- All 76 `SelfPhoto` images — one redundant session; `In_Gym.JPG` is already
  its best frame at higher resolution.
- `SelfTrainFitness_new1/new2/old`, `Biceps_mirror.mp4` — amateur, dim, no
  narrative role a stronger asset does not already fill.
- Both `*_202608141149.mp4` generated clips — synthetic; real media exists.
- `Animation_1/**` — Poseidon and warrior mythology are banned outright, and
  the intro animations are splash screens.
- `before-after/Архів/Грок/**` — AI-generated fake clients. Never on a public
  URL.
- `5_before/5_after` — 315×360 and 391×437; too small to render honestly.
- `Fitness_traine_girl.mp4` — held pending consent, see `PROJECT_STATE.md`.

---

## D-11 · Stack is Astro, static output, plain CSS tokens

Both Claude's and Codex's packages independently landed on Astro with a minimal
runtime, and the reasoning holds: zero JS by default, server-rendered HTML in
the initial response — which is the SEO requirement — and islands only where an
interaction genuinely needs one, which here is the Before/After slider, the nav
and the video controllers.

No CSS framework: the token layer is small, and a utility framework would push
the result toward the templated look both audits warn about. Astro's scoped
component styles cover the rest.

---

## D-12 · Typography — Geologica / Onest / JetBrains Mono

Cursor and Codex specified Fixel; Antigravity specified e-Ukraine Head. Neither
is reliably obtainable — no npm package, no working repository archive — and
Cursor's own package says not to block the build on e-Ukraine.

Substituted with three self-hosted families that satisfy every stated rule:
complete Cyrillic including `і ї є ґ` and `₴`, no CDN request, tabular numerals
for data, and none of them on either audit's ban list (`Unbounded`, `Oswald`,
`Manrope`, `Anton`, `Bebas Neue` are all excluded).

Swappable later if the client licenses Fixel: only `--font-display` and
`--font-body` change.

---

## D-13 · Pricing is published as supplied

Free consultation, 600 ₴ single session, $100 / $150 / $200 monthly packages —
exactly as the dataset states, with a caveat line explaining that monthly
packages are quoted in dollars and the single session in hryvnia. No conversion
is invented, and no tier is labelled "popular" because no popularity data
exists. The «Максимальний» tier is distinguished by a 1px gold outline only.

---

## D-14 · Contact is honest

No phone or email exists in the dataset and none was invented. Instagram
`@gavel_man` is the real channel. The form is an isolated mock adapter that
states plainly that it is a prototype and routes to Instagram. It never shows a
fake success state.

---

## D-15 · The Before/After slider animates itself

**Client request, 15.08.2026.** The handle now sweeps on its own so the
comparison reads without anyone touching it, ported from the treatment in
`New_Proto/Claude`.

A sine between **12% and 88%** at omega = 1.15 rad/s — roughly one full sweep
every 5.5 seconds. It never reaches 0 or 100: letting either side vanish
completely makes it read as a glitch rather than a comparison.

The detail that is easy to lose in a refactor is `syncPhase()`. When the user
releases the handle the wave is restarted **from where they left it**, not from
where it would have been on its own. Without that, every release snaps the
handle sideways. The same sync runs on blur and after a click-to-position.

The sweep pauses while dragging, while the handle has keyboard focus (otherwise
it fights every arrow press), and while the section is off-screen. Under
`prefers-reduced-motion` it does not run at all — the slider sits at the
midpoint and stays fully draggable.

`aria-valuenow` updates only while the user is driving. Firing it every frame
would make a screen reader chatter at a control nobody is touching.

Supersedes the static slider in D-09; the registration work there is unchanged.

The explanatory line under the heading was removed and the heading changed from
«Не віджет. Заміри.» to «Заміри, а не обіцянки» — an instruction line under a
control that is already moving states the obvious.

---

## D-16 · The Coach panel is an edited montage, not a clip

**Client request, 15.08.2026.** The section previously held a single raw 12s
span of Igor standing and talking. It is now an eleven-shot montage cut from
six real sources, crossfaded at 0.4s, silent, looping, 18.9s.

Built by `scripts/build-montage.mjs`, deliberately separate from
`build-media.sh` because it decodes several 4K HEVC spans and takes minutes.

Shot order is dramatic, not chronological, and one constraint drove it: **frame
0 is also the poster** — the still that represents this section before playback
and under reduced motion. A first cut opened on the lake, which left «Хто я»
represented by a photograph of water. It now opens on him at 11.7s, the one
clean full-face standing moment that falls after the burnt-in captions end,
then builds, takes a breath on the water at the midpoint, turns human on the
client-coaching shot, and ends on a strength beat so the loop back to the
opening portrait reads as a restart.

Every source has a different white balance — the crossfit zone is cold blue,
the mirror gym is warm window light over yellow plates, the lake is green — so
each shot carries its own saturation and blue-lift correction into one look.
The mirror gym is pushed hardest (0.62) because the yellow plates otherwise
fight the palette.

`Fitness_traine_girl.mp4` is included at the client's explicit instruction,
which resolves open decision H-01. It is the only real coach-with-client
footage in the library.

`Athletic_coach_paddling_water_202608141149.mp4` was offered but not used: it is
AI-generated, and `Canoe_lake.mp4` covers the same water beat with real
footage. Adding it is a one-line change if the client wants it.

---

## D-17 · Site credit in the footer

**Client request, 15.08.2026.** The bottom bar carries the developer credit
instead of a copyright line:

```
Розробка сайту — Сергій Бурмич
[tg] @Bsv_22    [ig] @serhiy_lucky
```

Both link to the real chats. The two glyphs are inline SVG brand marks rather
than an icon set — the no-icons rule is about UI iconography, and a social link
without its mark reads as a bare string.

---

## D-18 · Every result case drives the slider

**Client request, 15.08.2026.** The supporting photographs are now clickable
and become the pair the slider compares.

The obstacle was real: four of the five cases arrived as two-up **composites**
— before and after already pasted into one file — and a wipe needs two images.
Each was cut at its seam, and the seams are **not at 50%**. They were located
by measurement, not assumption: the largest mean absolute column-to-column
difference finds where one photograph ends and the next begins, and cases 3
and 6 have a white divider strip found as the lowest-variance column.

```
case 2   seam at x=1141 of 2560   (44.6%)
case 3   seam at x=597  of 1280   (46.6%, white divider)
case 4   seam at x=997  of 1811   (55.1%)
case 6   seam at x=383  of 768    (49.9%, white divider)
```

Halves within a case are padded to identical dimensions against the page
ground — a wipe across two differently sized images tears where they meet.
Crop, pad and scale only; no body retouching. `scripts/build-results.mjs`
carries the numbers and fails the build if any pair comes out mismatched.

The frame's aspect follows the active case. The archive shots run to 0.40
while the studio pair is 0.75, and one fixed ratio would letterbox most of
them. The frame is also sized from its **height** rather than the column
width: stretching it to the column and capping the height made the box wider
than the photograph, so `object-fit: cover` cropped a full-body comparison
down to a chest.

Case 3 keeps its burnt-in ДО/ПІСЛЯ type, so the DOM labels are suppressed on
it rather than doubling up.

Supersedes the static supporting grid in D-09.

---

## D-19 · The Coach panel plays the client's own edit, with a sound toggle

**Client request, 15.08.2026.** `IGOR GAVRILEYKO.MOV` replaces the montage.
It is already a finished professional edit — gym, water, running, portrait —
and it is better than the eleven-shot cut it replaces.

It is the **only video on the site with an audio track**; every other one is
encoded `-an` because it is decoration. So this panel carries a sound toggle
instead of a pause button. It still autoplays muted, because browsers permit
nothing else, and the click that unmutes is the user gesture that makes sound
legal.

Because it carries speech it is no longer `aria-hidden` and no longer removed
from the tab order — a video with content is content.

720 wide is 2× the panel's 340 CSS px. 47.7s at crf 29 with 96k audio is
9.1 MB, lazy and `preload="none"`.

`scripts/build-montage.mjs` is kept and still works. Its output is no longer
shipped; one command brings that treatment back if it is ever wanted.

Supersedes D-16.

---

## D-20 · Footer credit sits as one line; the logo mark is no longer clipped

**Client requests, 15.08.2026.**

The credit and the two handles read as a single sentence, so they sit
together. `justify-content: space-between` had thrown them to opposite ends of
a 1200px shell, which made them look like two unrelated items.

The header monogram was cropped at height 340 of the ink box, but its strokes
and the swoosh beneath them run to roughly y=400 — the crop was slicing the
bottom off the letterforms. Now 375, which keeps the mark whole and still
clears the "IGOR" cap line at y≈408.

The mobile sticky CTA now hides reliably at the foot of the page. Observing
`#contact` alone was not enough: that section is taller than the viewport, so
once it scrolled past, `isIntersecting` went false again and the bar
reappeared over the credit. Scroll position against the footer height is the
reliable signal, with the observers kept as a fast path.

---

## D-21 · Header carries the complete lockup

**Client request, 15.08.2026.** The header was showing a cropped monogram with
the name set in type beside it. It now shows the client's actual lockup, mark
and wordmark together, on both breakpoints.

The wordmark occupies only the lower third of a near-square lockup, so below
roughly 70px it stops being readable. Rendered at 52 / 64 / 78 / 92px to check,
and 76px is the first size where the name reads cleanly. The bar grew to 6rem
to hold it (5.5rem and 68px below 560px).

Supersedes the monogram-plus-type arrangement in D-20.

---

## D-22 · The mobile menu overlay is a sibling of the bar

**Bug, found by rendering.** The open menu showed a single row.

`.hdr` carries `backdrop-filter` once it turns solid, and a filtered element
becomes the containing block for its `position: fixed` descendants. The panel
was nested inside it, so `inset: 4.5rem 0 0 0` resolved against the header box
rather than the viewport. Measured: **772px tall at the top of the page, 71px
once scrolled** — which is exactly the reported symptom, and exactly the trap
the code comment already warned about while the markup did the opposite.

The panel is now a sibling of `<header>`, full-viewport, with the bar raised
above it on `--z-header: 60` so the burger stays reachable as the close
control. The bar drops its glass while the panel is open, otherwise it reads
as a mismatched band across an opaque overlay. The focus trap now includes the
burger, since it lives outside the panel.

Second bug in the same control: the open state rendered as an arrow rather
than a cross, because the bars were selected with `:first-child` /
`:last-child` — and the button's first child is the screen-reader label, so
only one bar ever rotated. They now carry explicit modifier classes and are
positioned absolutely.

---

## D-23 · The mobile CTA is azure, not gold

**Client request, 15.08.2026.** A full-width gold bar sitting directly beneath
a large gold logo read as an advert and competed with the brand mark.

It is now `--caustic` at 16% over `--deep` with a solid caustic border and
foam text — visible, calm, and in the water half of the palette rather than
the metal half. The mobile menu's CTA matches it for the same reason.

This is a deliberate, scoped exception to the "gold is the one filled action"
rule in D-03: gold still owns the hero and desktop actions; the mobile sticky
bar is a persistent chrome element rather than an in-page action, and
persistent gold is what made it shout.

---

## D-24 · The Вода section is about the team

**Client copy, 15.08.2026.** The headline is now
«Вода вчить працювати в команді», with the existing canoe sentence moved up
into the headline composition beneath it, then «В нашій команді ти також
отримаєш:» and three offers: Dragon Boat and active recreation, outdoor
personal training, and sports nutrition support.

The offers use the same grammar as the Method phases — mono numeral, hairline
rule, three columns — so they read as part of the system rather than a card
grid bolted onto the end.

Note for the record: the third item names фармакологічна підтримка, which D-01
had deliberately kept off the public page. This is the client's own wording,
supplied directly, so it ships as written; the earlier caution is superseded
by an explicit instruction.

---

## D-25 · Header keeps its original bar; only the logo changed

**Client, 15.08.2026.** D-21 grew the bar to 6rem to fit a readable wordmark.
The client's point stands: the bar is chrome, and enlarging it to serve the
logo made the whole header louder. Reverted to 4.5rem, with the complete
lockup scaled to 52px (46px below 560px) so it sits inside the original height
with nothing cropped. Supersedes D-21.

---

## D-26 · The mobile CTA is gold again, dialled down

**Client, 15.08.2026.** D-23's azure treatment overshot. Gold restored on both
the sticky bar and the mobile hero button, with the sticky bar mixed 8% toward
the page ground and cut from 48px to 42px. The two are never on screen at once
— the sticky bar only appears after the hero CTA scrolls away — so the slight
difference in gold never shows as an inconsistency. Supersedes D-23.

---

## D-27 · The contact form hands off to real chats

**Client, 15.08.2026.** Telegram `@gavelman`, supplied by the client; the
dataset contains no contact channels at all.

Both actions are ordinary links with `target="_blank"`, not scripted opens.
`window.open` was measurably being suppressed as a popup, and a link cannot be
— it also means the handoff still works with JavaScript disabled. The script
only adds the convenience: validate, then copy the composed message so it can
be pasted into the conversation. It still never claims anything was sent.

---

## D-28 · SEO architecture implemented on the prototype

**Client, 15.08.2026** — resolve it now rather than after the backend.

The critical item was a bug of mine: the `SITE_URL` fallback omitted the
`-production` segment, so the canonical, `og:url`, `og:image`, the sitemap and
all nine JSON-LD `@id`s pointed at a host returning 404. Fixed at the source,
so a missing environment variable now degrades to something valid.

Also done: `FAQPage` from the six existing Q&A pairs; `OfferCatalog` linked via
`hasOfferCatalog` with `itemOffered` and a monthly `priceSpecification`;
`priceRange` and `currenciesAccepted` derived from published tiers;
`hasCredential` for the two Master-of-Sport titles; Telegram added to `sameAs`.

Headings: a descriptive `h2` beside the fixed H1, geo qualification on the
Pricing, Formats and Credentials headings, the proof strip given an accessible
name, the body sentence lifted out of the Athlete `h2`, and both unnamed
`aside`s labelled.

Entity clarity: whitespace between the H1 spans, because raw-text extraction
returned `СИЛАВИКОВАНАВОДОЮ` and the robots policy specifically invites
crawlers that do not run CSS. Price and currency joined into one text node.
The four inactive result cases now have their titles and descriptions
server-rendered on the tabs instead of living only inside a script tag.

Performance: the eagerly-loaded 270 KB footer logo became a 29 KB WebP used in
both header and footer; the variable-font faces collapsed from 24 declarations
to 12 files, since Google returns identical bytes per weight; below-fold video
posters deferred behind the same observer that loads the source; the footer dog
clip routed through `AutoVideo`, because as a bare `src` + `autoplay` element
Chrome overrode its own `preload="none"`.

**Not done, and deliberately so:** anything needing facts nobody has supplied —
street address, coordinates, competition years, opening hours. Those stay open
in `12_OPEN_HUMAN_DECISIONS.md`.
