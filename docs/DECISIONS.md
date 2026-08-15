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
