# PROJECT STATE

_Last updated: 2026-08-31 · preview: mobile intro + darkened-page QA_

## Current stage

Preview of **IMG_1851 intro + canoe-scroll backdrop** on branch
`claude/scroll-canoe-backdrop`. Production `main` is untouched. The Railway
service `motion-lab-intro-preview` is the only deploy target for this work.

CP-15 (`production/frontend-v1-grok`) remains the production-frontend
candidate. Do not merge either branch to `main` without a human.

## Last completed checkpoint

CP-15 — client-requested production frontend changes on
`production/frontend-v1-grok`. Approved prototype baseline: tag
`client-approved-prototype-v1` @ `cac608a`.

This preview line (canoe backdrop → IMG_1851 open → mobile playback) is
separate from that candidate.

## Latest commit SHA

See `git log -1 --format=%H`. Recorded per checkpoint in `WORKLOG.md`.

## What works

- Astro static frontend, media pipeline, fonts, Before/After, SEO/noindex
  preview, contact seam (CP-13–CP-15).
- First-visit open (session key `ig-open-1851-m3`): landscape film is
  **contained** (16:9, never cover-cropped). A blurred poster wash fills the
  letterbox so the bars are water, not empty black. Last 0,62 s the lockup
  flies into `.hdr-brand` from the same box — no size jump.
- Hero / section loops do not start until the intro is gone, so iOS is not
  asked to decode two videos at once.
- QA on the darkened canoe page: 43 checks, 0 fail, 0 warn. Lighthouse 13.4.1
  mobile accessibility 100, best-practices 100, `color-contrast` pass
  (`?skipintro=1` so the overlay is not what gets measured).

## What is incomplete

Not in this pass: production backend, CRM, booking, shop, payments, real-domain
configuration, merge to `main`, production hosting cutover.

## Blockers

None for preview. Merge and production deploy require a human.

## Open human decisions

1. **`3_before-after.jpg`** shows an identifiable face and ships as supporting
   proof; it carries burnt-in «ДО»/«ПІСЛЯ» marketing labels. Confirm consent
   covers web use.
2. **Real domain** — canonical URL, sitemap host and OG absolute URLs are
   config placeholders until a domain exists.
3. **Preview noindex** — keep until human approval (meta + title + robots.txt).
4. **Pricing currency** — the dataset still mixes ₴ and $. Published as
   supplied; no conversion invented.
5. **Instagram Direct** — form handoff uses `https://ig.me/m/gavel_man`. Native
   app behaviour should be checked on a real phone; clipboard paste is the
   reliable fallback.

## Exact next action

On a real phone, open an **incognito / new-tab** visit to
https://motion-lab-intro-preview-production.up.railway.app
(session key `ig-open-1851-m3`).

Do **not** merge to `main`. Do **not** `railway up` the production service.
