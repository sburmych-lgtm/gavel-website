# DEPLOYMENT

## Preview

| | |
|---|---|
| Type | **PREVIEW / STAGING** — not production |
| Public URL | <https://igor-gavrileyko-final-claude-production.up.railway.app> |
| Railway project | `igor-gavrileyko-final-claude` |
| Project ID | `a80bc7d8-c810-4b8b-a7b5-b7440d1ca039` |
| Service | `igor-gavrileyko-final-claude` |
| Service ID | `fe6ac903-addc-4646-8a33-5de66d12e9fc` |
| Environment | `production` (Railway's default environment name; the deployment is a preview) |
| GitHub | <https://github.com/sburmych-lgtm/igor-gavrileyko-final-claude> (private) |
| Branch | `main` |
| Rollback | `preview-v1-approved-base` @ `dcb9c24` — the version approved before the 15.08 revision round |
| Deployed | 2026-08-15 |

## Build and start

```
builder        NIXPACKS
buildCommand   npm run build      # runs check-facts + check-assets, then astro build
startCommand   npm start          # sirv dist --host 0.0.0.0 --port $PORT --etag
node           22 (.nvmrc)
```

Environment variables set on the service:

| Variable | Value | Why |
|---|---|---|
| `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD` | `1` | Nixpacks runs `npm ci` including devDependencies; Playwright is only needed for local QA and its browsers must not enter the image |
| `NODE_VERSION` | `22` | |

`SITE_URL` and `INDEXABLE` are **not** set, so the build falls back to the
Railway host for canonical/OG URLs and the page ships `noindex, nofollow`.
Both flip together when a real domain exists.

## Two build failures worth recording

**`npm ci --omit=dev` in the build command → EBUSY.** Nixpacks already installs
dependencies in an earlier layer. Re-running `npm ci` tried to `rmdir
node_modules/.cache`, which is a mounted cache volume. Fixed by reducing the
build command to `npm run build`. `@astrojs/sitemap` was moved to
`dependencies` because it is needed at build time.

**`astro preview` → 403 on every request.** It runs Vite's preview server,
which has a Host allowlist and rejected the Railway hostname with
*"Blocked request. This host is not allowed."* It is also documented as a dev
convenience rather than a production server. Replaced with `sirv`, the static
server Astro uses internally — HTTP Range support, etag, no host allowlist.

## Verification performed on the public URL

Not a green build log. The deployed site was driven in a real browser.

- `scripts/qa.mjs` run against the public HTTPS URL: **42 checks, 0 fail,
  0 warn**. Evidence in `docs/quality/deployed/`, machine-readable in
  `docs/quality/qa-report-deployed.json`.
- Rendered at 1920 / 1440 / 1024 / 768 / 390 / 320 — no horizontal overflow,
  no console errors at any width.
- H1 renders exactly `СИЛА ВИКОВАНА ВОДОЮ`.
- Before/After slider driven by pointer drag, arrow keys, shift+arrows and
  Home/End, and confirmed sweeping on its own — all against the live build.
- Case switcher: all five cases swap the pair, reshape the frame, update the
  caption and aria-selected, and both halves match in size.
- Sound toggle on the coach video: muted → unmuted with aria-pressed tracking.
- Hero eyebrow measured **8.29:1** from rendered pixels over the live video.
- Reduced motion: no managed video fetched, all content visible.
- JavaScript disabled: all key strings present, all 53 reveal blocks visible.
- Media, fonts, favicon, robots.txt, sitemap and OG image all return 200 with
  correct content types.
- Video returns **206 Partial Content** with `Accept-Ranges: bytes`, so seeking
  works.
- JSON-LD present and parsed: Person, LocalBusiness/SportsActivityLocation,
  WebSite, WebPage, 4 × Service, OfferCatalog with 5 Offers.
- `noindex, nofollow` confirmed present on the deployed page.

## Known preview limitations

- **`noindex` is deliberate.** A staging URL must not enter an index ahead of
  the real domain.
- **Canonical and OG URLs point at the Railway host**, because no domain
  exists yet. One config value changes both.
- **No cache-control tuning.** `sirv --etag` gives conditional requests but no
  long-lived immutable caching for the hashed `/_astro` assets. Worth adding
  for production; irrelevant for a visual review.
- **The contact form is a mock.** It validates and then states plainly that
  the prototype does not send. It never shows a success state.
- **No backend, CRM, booking or analytics.** Out of scope for this run.
- The coach video is 9.1 MB with audio, lazy and `preload="none"`.
- The desktop hero loop is 3.7 MB. It is `preload="none"` behind a 67 KB
  poster which is the LCP element, but it is worth revisiting for production
  on slow connections.

## Redeploying

```bash
railway up --service igor-gavrileyko-final-claude --detach
railway logs --service igor-gavrileyko-final-claude
```

The repository is linked to the Railway project locally. Deployment is from
the working tree, not from a GitHub integration, so commit and push first so
the deployed artifact matches a known SHA.

## Intro + canoe-scroll preview (not production)

| | |
|---|---|
| Public URL | <https://motion-lab-intro-preview-production.up.railway.app> |
| Service | `motion-lab-intro-preview` |
| Branch | `claude/scroll-canoe-backdrop` |
| Intro session | `ig-open-1851-m4` (incognito to replay) |

Do **not** `railway up` the production service for this work.

```bash
railway up --service motion-lab-intro-preview --detach
```
