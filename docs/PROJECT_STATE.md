# PROJECT STATE

_Last updated: 2026-08-15 · checkpoint CP-13_

## Current stage

CP-10 — Railway preview deployed and verified on the public URL.
**The run stops here, at the human visual approval gate.**

## Last completed checkpoint

CP-13 — third client revision round deployed and verified.

Rollback point: branch `preview-v1-approved-base` @ `dcb9c24`.

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
- `npm run qa` — 42 browser checks at six widths, 0 fail, 0 warn.
- `npm run qa:fixes <url>` — 21 targeted checks for the header lockup, the
  mobile menu at both scroll states, the CTA treatment and the Вода section.
- Mandatory Before/After slider works by pointer, keyboard and click.
- Reduced motion suppresses transitions and fetches no managed video.
- With JavaScript disabled the whole page still renders, all 53 reveal blocks
  visible and all key strings present.
- Deployed to Railway and re-verified against the live HTTPS URL: 36 checks,
  0 fail, 0 warn. See `docs/DEPLOYMENT.md` and `docs/quality/deployed/`.

## What is incomplete

Nothing in this run's scope. Deliberately not built: production backend, CRM,
booking, analytics, final content lock, real-domain configuration.

## Blockers

None.

## Open human decisions

1. **`3_before-after.jpg`** **`3_before-after.jpg`** shows an identifiable face and ships as supporting
   proof; it carries burnt-in «ДО»/«ПІСЛЯ» marketing labels, which indicates it
   was composed for publication. Confirm consent covers web use.
3. **Real domain** — canonical URL, sitemap host and OG absolute URLs are
   config placeholders until a domain exists.
4. **Contact channel** — Instagram `@gavel_man` is the only channel in the
   dataset. No phone or email exists and none was invented.
5. **Pricing currency** — the dataset mixes ₴ and $. Published as supplied with
   a caveat line; no conversion invented.

## Exact next action

**HUMAN VISUAL APPROVAL** of
<https://igor-gavrileyko-final-claude-production.up.railway.app>

Only after approval: production frontend hardening, final content lock, the
separate backend/API, CRM and booking integrations, and production deployment
on a real domain.
