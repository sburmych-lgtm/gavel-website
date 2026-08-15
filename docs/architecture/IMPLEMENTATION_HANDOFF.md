# IMPLEMENTATION HANDOFF

For whoever builds or continues the frontend.

## Read order

1. `FINAL_DESIGN_CONTRACT.json` — machine-readable, authoritative on values
2. `DESIGN.md` — the visual thesis, which is what the values are *for*
3. `03_FINAL_DESIGN_SYSTEM.md` — tokens, contrast, component grammar
4. `05_FINAL_CONTENT_ARCHITECTURE.md` — the complete copy deck
5. `06_FINAL_MEDIA_ASSET_MAP.md` — what ships, what does not, and why
6. `13_SEO_LOCAL_AI_DISCOVERABILITY.md` — non-optional, built now not later

Where prose and JSON disagree, JSON wins.

## Order of work

Tokens → primitives → sections → **hero last**. `MediaFrame` is the first
component; three sections depend on its grammar.

## The five things that break this if done carelessly

1. **The H1.** `«Сила викована водою»` is fixed by the client. Line breaks are
   free, the words are not.
2. **Teal as paint.** `--caustic` is light — hairlines, focus rings, underlines.
   The moment it fills something, the page reads as a generic dark template.
3. **The Before/After registration.** The two sources are not camera-aligned.
   The crop numbers in `scripts/build-media.sh` were measured from the shoulder
   line and waistband. Change a crop and the wipe seam breaks — re-render a 50%
   wipe and look at it.
4. **The credential.** `Майстер спорту України`, never `міжнародного класу`.
   The build fails on it, but do not rely on that as the only guard.
5. **Rendered-content parity.** Reveals may enhance; they must never gate. All
   copy is in the DOM at first byte or the SEO architecture is void.

## Commands

```bash
npm install
npm run dev        # http://localhost:4321
npm run check      # facts guard + asset guard + astro check
npm run build      # static output to dist/
npm run preview    # serve the build
```

```bash
bash scripts/build-media.sh    # regenerate public/media from the asset library
node scripts/fetch-fonts.mjs   # re-vendor woff2 + regenerate src/styles/fonts.css
```

Both scripts are manual and their output is committed. Neither runs in CI — a
105 MB HEVC transcode has no business in a build.

## Where the copy lives

`src/content/index.ts`. Nothing user-facing belongs in a component. Prices carry
an explicit `currency` field rather than a formatted string, which is what stops
a later edit from silently unifying ₴ and $.

## Where the assets live

`src/content/media.ts` maps every file to a role and factual Ukrainian alt text.
Swapping an asset is a one-line change there, never an edit inside a section.

## Connecting a real backend

Replace the body of `submitContact` in `src/lib/contact.ts`. Contract is in
`09_FINAL_BACKEND_API_ARCHITECTURE.md`. No component changes. Until a real
endpoint returns 201, the UI must keep saying the form is a prototype — a fake
success state is prohibited.

## Going to production

1. Resolve the open decisions in `12_OPEN_HUMAN_DECISIONS.md`
2. Set `SITE_URL` to the real domain and flip `INDEXABLE` to true
3. Verify JSON-LD against the rendered page, not against this document
4. Submit the sitemap and set up Google Business Profile
5. Re-run the full QA matrix on the production host
