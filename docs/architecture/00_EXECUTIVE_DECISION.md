# 00 · EXECUTIVE DECISION

**Project:** IGOR GAVRILEYKO — personal trainer, Lviv
**Package:** FINAL_CLAUDE_CANDIDATE
**Status:** frozen for implementation
**Date:** 2026-08-15

---

## The concept in one line

**Strength forged by water** — a coach whose method came off the racing canoe,
who measures instead of promising.

## The decision

Deep ocean ground, brand gold as the single accent, and a page that spends its
first screen on water and every screen after that on selling coaching.

Three things make this candidate what it is:

**1. The palette is derived, not chosen.** Every colour was sampled out of the
actual photographs with `ffmpeg palettegen`. The ground is the near-black of
`On_Beach.JPG`'s shadows; the water tones are `Canoe2.JPG`'s lake; the accent is
the gold ramp inside the client's own logo file. Nothing was picked by taste.

**2. Gold resolves the conflict the prior audits could not.** Cursor mandated an
off-white CTA and made ember a release blocker. Antigravity mandated `#E85D22`,
which sits inside Cursor's forbidden family. The deadlock dissolves once you
notice the client already owns a gold logo variant — so gold is brand equity
rather than preference. It is not in the banned orange family, and «викована»
means *forged*, which is a metal metaphor. Metallic gold on deep water is the
thematically exact answer, and it keeps every prohibition both audits actually
cared about.

**3. Water is made commercially load-bearing.** The canoe is not scenery. The
Method section is the paddling stroke cycle — Захват → Проведення → Вихід →
Курс — with each phase mapped onto a real dataset item. That is the device that
turns "he happens to paddle" into "this is why his coaching is structured the
way it is."

## What changed against the prior audits, and why

| Prior position | Now | Reason |
|---|---|---|
| Never a full-bleed hero — the vertical source upscales 2× | Full-bleed landscape hero | `Canoe_ocean_16-9.mp4` is natively 16:9 and its detail crop is genuinely sharp. The audits predate the file. |
| CTA is off-white (Cursor) / ember (Antigravity) | Brand gold | The client owns a gold logo. Neither audit weighted it. |
| No Before/After slider — pairs are unregistered | Slider, on a registered pair | Client decision is fixed; the registration objection is real and was solved by measurement, not ignored. |
| `1_before`/`1_after` faces are unblurred — release blocker | Resolved | Stale finding. The current files are the blurred version. |
| Self_Presentation belongs in Method | Its own Coach section, after pricing | Trust reads better as its own moment than as a sidebar to the method. |
| Fixel / e-Ukraine Head | Geologica / Onest / JetBrains Mono | Neither specified family is reliably obtainable. The substitutes satisfy every stated rule. |
| 76 SelfPhoto images to curate from | Dropped entirely | One redundant session; `In_Gym.JPG` is already its best frame at higher resolution. |
| `Dragonboat_canoe.mp4` unassigned or held | Athlete story | Real team racing footage. Genuine competitive proof no prior audit placed. |

## Scope of this run

Frontend visual prototype, deployed to a Railway preview, stopping at human
visual approval. No production backend, no CRM, no booking, no analytics.

## What a reviewer should judge

Whether the first screen reads as *water and strength* rather than *a gym
template*; whether the page sells coaching rather than a biography; whether the
Before/After interaction feels honest; and whether the Coach section carries the
same composure the client liked in the previous prototype.
