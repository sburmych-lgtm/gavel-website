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
