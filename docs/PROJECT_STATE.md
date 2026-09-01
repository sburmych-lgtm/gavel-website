# PROJECT STATE

_Last updated: 2026-09-01 · Version 2 Release Candidate (`version-2`)_

## Current stage

Version 2 implementation on branch `version-2` in repository `sburmych-lgtm/gavel-website`.
Production `main` is untouched. Preview deployed to Vercel (noindex preview).

## Last completed checkpoint

**Version 2 upgrade completed across Phases A–D:**
- **Phase A (§1–§6):** Viewport-relative stroke cycle (1.35 desktop / 1.8 mobile), dual-frame alpha interpolation crossfade (LERP = 0.18, desynchronized, zero dead zone), 1024×576 Lanczos 72-frame extraction with DPR backing store (MAX_DPR = 2) & drawCover, pointer:fine damped parallax overscan (inset -20px, 0.06 damping), smooth poster crossfade on ≥8 loaded frames, mask rgba typo fix.
- **Phase B (§7a):** `.backdrop-grade` overlay driven by scroll progress (opacity 0..0.85).
- **Phase C (B1–B9):** Recompressed water-primary (CRF 31, -an, 1.53MB) + lazy loading backdrops, intro once per session + reduced-motion / save-data skip + z-index 10 skip button, full alt/aria-hidden image coverage, keyboard-accessible Before/After slider with visible focus ring, FAQ smooth expand + 45deg rotate + title punctuation fix, mobile sticky CTA hide on #contact, video toggle aria-pressed + high-contrast scrim shadow, seam band verified (RMSE 0.000/255), JSON-LD verified for LocalBusiness & FAQPage.
- **Phase D (Proposals A1–A4):** Dropped section counters `NN / 11` & rationed eyebrows (A1), varied header scaffold & centered Credentials H2 (A2), de-numbered Fit pains & reflowed Athlete bonuses into tonal cards (A3), dropped 01/05 counter & video tile number chips (A4).

## Latest change

**CP-19 (2026-09-02) — co-operation portrait recropped.** `object-position`
`50% 12%` → `50% 60%`, moving the visible window from 2%–85% of the plate to
10%–93% so the wrists clear the bottom edge. See `WORKLOG.md` CP-19.

**CP-18 (2026-09-02) — scroll backdrop back on `Canoe.mov`.** The warmer, hazier
take that ran until 01.09 17:17, with its 47 px letterbox cropped off rather
than restored. 88 frames, loop seam 0.099/255. See `WORKLOG.md` CP-18.

**CP-17 (2026-09-02) — live on gavel.in.ua.** Netlify has production deploys
paused (team out of credits for the billing cycle), so the build was uploaded
as a draft and promoted with `restoreSiteDeploy`. Production now matches
`937f58d`. Git-triggered builds stay blocked until the cycle resets. See
`WORKLOG.md` CP-17.

**CP-16 (2026-09-01) — open film is now IMG_1866.** Third cut, and the first
that needs nothing done to it: matte measured at 0 px on all four sides, so it
is encoded whole at 1280×720. Being a true 16:9 again, the cover band widens
to 4/5–5/2 and 2560×1080 fills instead of letterboxing. See `WORKLOG.md`
CP-16.

**CP-15 (2026-09-01) — the open runs edge to edge.** The landscape film is
cropped to its own picture and fills the window (`cover` between 5/4 and 9/4,
`contain` outside it so the lockup is never clipped). `scrollbar-gutter:
stable` gave way to a `--sbw` flow compensation, which keeps the header still
*and* lets the film reach the right edge. See `WORKLOG.md` CP-15.

**CP-14 (2026-09-01) — dark seams down the sides of the open closed.** The
film mattes its water plate to `#000` while the stage was `--abyss`, and
`scrollbar-gutter: stable` left the reserved gutter showing the page ground
down the right edge. Stage, veil and canvas are the film's black for the
length of the intro. See `WORKLOG.md` CP-14.

**CP-13 (2026-09-01) — new open film on the landscape cut.** `IMG_1865`
replaces `IMG_1851`: liquid-gold splash out of the water, centred front-on
lockup on clean black, 2.83 s instead of 3.83 s. The mid-flight morph stays —
the wordmark is still one line against the header's two — but the swap now
runs at ~140 px rather than ~480 px. Portrait untouched. See `WORKLOG.md`
CP-13.

**CP-12 (2026-09-01) — landscape open now docks like the portrait one.** The
landscape film ends on the wide one-line lockup, the header carries the compact
two-line one, so the flight cross-dissolves between them mid-air with the IG
monograms locked and lands on the header rect exactly. `scrollbar-gutter: stable`
removes the 7.5 px reflow the scroll lock used to cause on classic-scrollbar
desktops. See `WORKLOG.md` CP-12.

## Latest commit SHA

See `git log -1 --format=%H`. Recorded in `WORKLOG.md`.

## What works

- Static Astro build with zero runtime motion dependencies (no GSAP/Motion/Lenis).
- 60/120fps hardware-accelerated canvas backdrop scroll scrub on desktop & mobile.
- Tiered accessibility: `prefers-reduced-motion` and `Save-Data` fallbacks preserve layout and static poster without downloading video sequences.
- 0 horizontal overflow @ 320px, 375px, 390px, 768px, 1024px, 1440px, 1920px.
- Verified seam diff RMSE = 0.000/255 (<= 3/255).
- QA and facts guards pass (26 files, 11 video derivatives, all fonts resolving).

## Open human decisions (for site owner)

1. **1080p Canoe.mov original source:** Current repo assets provide 1024×576 `Canoe.mov`. If a native 1080p/4K master file exists, rerunning `build-media.sh` will extract 1920×1080 frames.
2. **A5 — Navbar logo:** 3D bevel vs flat monochrome icon for header.
3. **A6 — Case order in Results:** Editorial order of client transformations.
4. **A7 — Pricing card highlight:** Selecting target priority tier in pricing.

## Verification & Review Evidence

Full-page and per-section high-res review captures saved in `review/version-2/`.
Preview deployed on Vercel.
