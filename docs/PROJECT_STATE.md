# PROJECT STATE

_Last updated: 2026-08-18 · checkpoint CP-15_

## Current stage

Production frontend candidate v1 on isolated branch
`production/frontend-v1-grok`. Awaiting **human review** before any merge to
`main` or production deploy.

## Last completed checkpoint

CP-15 — client-requested production frontend changes implemented on the
isolated branch.

Approved prototype baseline: tag `client-approved-prototype-v1` @ `cac608a`.

Rollback for this candidate: that tag / `main`. Do not treat this branch as
live production.

## Latest commit SHA

See `git log -1 --format=%H`. Recorded per checkpoint in `WORKLOG.md`.

## What works

- Everything listed under CP-13/CP-14 still holds (Astro static frontend,
  media pipeline, fonts, Before/After, SEO/noindex preview, contact seam).
- Home achievement strip matches the client edit (26 / 16 / 2× / 4).
- Session price is 700 ₴ with «Перше тренування — 400 ₴» as a subordinate line.
- Medical exclusion is visible in FAQ, not in the pricing block.
- Formats portrait is the client `Page_5_edit.jpg` derivative.
- Water section plays one of three client videos at a time, muted by default,
  with a visible sound toggle and viewport pause.
- Contact form copies the typed Ukrainian message, then opens Telegram or
  Instagram Direct. It never claims a server submission.

## What is incomplete

Not in this pass: production backend, CRM, booking, shop, payments, real-domain
configuration, merge to `main`, production hosting cutover.

## Blockers

None for review of this candidate. Merge and production deploy require a human.

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

**HUMAN REVIEW** of branch `production/frontend-v1-grok`.

Do **not** merge to `main`. Do **not** overwrite the existing Railway
deployment.

Local preview: `npm run preview` → http://127.0.0.1:4321/

## Preview: intro + canoe scroll

Branch `claude/scroll-canoe-backdrop` now also plays **IMG_1851** as the
first-visit open (fade last 0,62 s, fly into `.hdr-brand`), then the
scroll-driven canoe backdrop. Session key `ig-open-1851`. Production `main`
untouched. Preview:
https://motion-lab-intro-preview-production.up.railway.app
