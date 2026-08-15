# PROJECT STATE

_Last updated: 2026-08-15 · checkpoint CP-00_

## Current stage

CP-00 — repository and continuity scaffold. Media pipeline and font vendoring
have already run, so the derived assets exist before the first commit.

## Last completed checkpoint

CP-00 (this commit).

## Latest commit SHA

See `git log -1 --format=%H`. Recorded per checkpoint in `WORKLOG.md`.

## What works

- Repository initialised, Astro 7.2.2 + sharp installed.
- `scripts/build-media.sh` runs clean and produces every web derivative from
  the read-only asset library.
- `scripts/fetch-fonts.mjs` vendored 24 self-hosted woff2 faces with full
  Cyrillic and Ukrainian coverage.
- The mandatory Before/After pair is registered: shoulder line and waistband
  align across the wipe seam, verified visually.
- Brand logo extracted from JPEG to transparent PNG, gold on dark verified.

## What is incomplete

Everything downstream of CP-01. No architecture package written yet, no Astro
config, no tokens, no sections, no page, no deployment.

## Blockers

None.

## Open human decisions

1. **`Fitness_traine_girl.mp4`** — the only real coach-with-client footage in
   the library, but it shows an identifiable third party. This is a likeness
   question, not a claim-verification question, so the "client-supplied content
   is approved" rule does not settle it. Not shipped pending written consent.
2. **`3_before-after.jpg`** shows an identifiable face and ships as supporting
   proof; it carries burnt-in «ДО»/«ПІСЛЯ» marketing labels, which indicates it
   was composed for publication. Confirm consent covers web use.
3. **Real domain** — canonical URL, sitemap host and OG absolute URLs are
   config placeholders until a domain exists.
4. **Contact channel** — Instagram `@gavel_man` is the only channel in the
   dataset. No phone or email exists and none was invented.
5. **Pricing currency** — the dataset mixes ₴ and $. Published as supplied with
   a caveat line; no conversion invented.

## Exact next action

CP-01 — write the final architecture package into
`Assets\Архітектура та пайплайн\FINAL_CLAUDE_CANDIDATE`, mirror it into
`docs/architecture/`, commit, push.
