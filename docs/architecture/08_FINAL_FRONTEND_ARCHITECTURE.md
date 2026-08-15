# 08 · FRONTEND ARCHITECTURE

## Stack

**Astro 7, `output: "static"`, TypeScript, plain CSS with custom properties.**

Both prior packages that named a stack landed on Astro independently, and the
reasoning holds: zero JavaScript by default, complete HTML in the server
response — which is the SEO requirement in `13` — and islands only where an
interaction genuinely needs one.

Rejected: **Next.js** — a React runtime for one static page is unjustified.
**Tailwind or any CSS framework** — the token layer is roughly forty
declarations, and a utility framework pulls the result toward the templated look
the brief rules out. **Any animation library** — there are six transitions.

## Layout

```
astro.config.mjs        static output, sitemap integration, site URL
src/
  content/
    index.ts            every string; typed; the single source of truth
    media.ts            asset paths + factual alt text, one place
  styles/
    tokens.css          colour, type scale, space, motion, z-index
    base.css            reset, typography, buttons, a11y primitives
    fonts.css           GENERATED — do not hand-edit
  layouts/
    Base.astro          <head>, meta, JSON-LD, skip link, font preload
  components/
    SiteHeader.astro    nav + mobile overlay + scroll state
    MediaFrame.astro    the framed-media primitive
    AutoVideo.astro     autoplay/loop/pause/reduced-motion/offscreen logic
    BeforeAfter.astro   the mandatory slider
    Reveal.astro        one-shot intersection reveal wrapper
    Stat.astro          mono numeral + label
    StickyCta.astro     mobile-only bottom bar
  sections/
    Hero · Proof · Fit · Method · Results · Formats · Pricing ·
    Coach · Athlete · Credentials · Faq · Contact · SiteFooter
  pages/
    index.astro         composes the sections, nothing else
  lib/
    contact.ts          isolated contact adapter (mock)
    schema.ts           JSON-LD builder, reads from content
scripts/
  build-media.sh        source → public/media (manual)
  fetch-fonts.mjs       woff2 vendoring (manual)
  check-facts.mjs       build guard
  check-assets.mjs      build guard
```

## Rules that keep it maintainable

- **No copy in markup.** Components take content as props from `src/content/`.
- **No asset path in markup.** `src/content/media.ts` maps every file to a role
  and factual alt text, so a media swap is a one-line change.
- **Styles are scoped by default.** Astro scopes component `<style>` blocks;
  only `tokens.css` and `base.css` are global.
- **Sections are dumb.** A section lays out content and composes primitives. Any
  behaviour lives in a component.
- **One primitive, not three variants.** `MediaFrame` carries the framed-media
  grammar the client approved; the Coach panel, the athlete media and the
  credentials document all use it with different props rather than three
  near-identical implementations.

## JavaScript

Three small inline island scripts, no framework runtime, no bundled library:

| Script | Purpose | Bytes |
|---|---|---|
| header | scroll state, overlay toggle, focus trap | ~1.2 KB |
| autovideo | reduced-motion gate, offscreen pause, pause button | ~1.0 KB |
| beforeafter | pointer, keyboard and click-to-position | ~1.4 KB |

All three are progressive: with JavaScript off, the header renders as static
links, videos render as posters, and the slider renders the "after" image with
both labels visible. Nothing disappears.

## Build guards

Two node scripts run before `astro build`, each exiting non-zero on a hit:

- **`check-facts.mjs`** — scans `src/content/` for forbidden strings. Currently:
  `міжнародного класу` (a previous prototype fabricated this credential upgrade),
  plus placeholders like `TODO`, `Lorem`, `300+`. Also asserts the H1 is exactly
  `СИЛА / ВИКОВАНА / ВОДОЮ` and that `IGOR GAVRILEYKO` is the only romanisation.
- **`check-assets.mjs`** — fails if any rejected asset path appears anywhere in
  `src/` or `public/`: the Грок AI before/after set, the two generated clips, the
  Poseidon animations. These must never reach a public URL, and a build failure
  is a stronger guarantee than a review checklist.

## Performance approach

- Fonts self-hosted, `font-display: swap`, the two above-the-fold faces
  preloaded, everything else discovered normally.
- Hero poster is the LCP element with `fetchpriority="high"`; the video is
  `preload="none"` and starts after.
- All below-fold media is lazy.
- Astro emits AVIF and WebP with a JPEG fallback and correct `sizes`.
- No render-blocking third-party request of any kind. Zero external hosts.
