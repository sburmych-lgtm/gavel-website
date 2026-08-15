# PROJECT STATE

_Last updated: 2026-08-15 · checkpoint CP-09_

## Current stage

CP-09 — coded visual prototype complete locally and passing browser QA.
Next is the Railway preview deployment.

## Last completed checkpoint

CP-09.

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
- Final architecture package written: 17 documents in `docs/architecture/`,
  mirrored to `Assets\Архітектура та пайплайн\FINAL_CLAUDE_CANDIDATE`.
- Full frontend: thirteen sections, three islands, no framework runtime.
- `npm run build` passes both content guards; static output is 18 MB.
- `npm run qa` — 36 browser checks at six widths, 0 fail, 0 warn.
- Mandatory Before/After slider works by pointer, keyboard and click.
- Reduced motion suppresses transitions and fetches no managed video.
- With JavaScript disabled the whole page still renders, all 53 reveal blocks
  visible and all key strings present.

## What is incomplete

CP-10 only — Railway preview deployment and public-URL verification.

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

CP-10 — deploy to the Railway project `igor-gavrileyko-final-claude`, verify
the public URL in a real browser, write `DEPLOYMENT_URL.txt` and
`docs/DEPLOYMENT.md`, commit and push.
