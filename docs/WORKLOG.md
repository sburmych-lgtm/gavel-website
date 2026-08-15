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
