# SEO audit — 2026-08-15

**Target:** <https://igor-gavrileyko-final-claude-production.up.railway.app>
**Scope:** audit and recommendations only. **Nothing in this document was
implemented.** The site was not modified on the basis of these findings.

Two independent passes against the live deployment — one technical/crawlability,
one on-page/semantic/AI-search — plus direct verification of the critical items.
All values below are measured, not estimated.

---

## Critical

### C-1 · Every canonical signal points at a host that 404s

`astro.config.mjs` falls back to `https://igor-gavrileyko-final-claude.up.railway.app`
— **missing the `-production` segment**. The real host is
`igor-gavrileyko-final-claude-production.up.railway.app`.

Verified directly:

```
rel="canonical" href="https://igor-gavrileyko-final-claude.up.railway.app/"
that host → HTTP 404  (x-railway-fallback: true)
```

That one value feeds `Astro.site`, and therefore the canonical tag, `og:url`,
`og:image`, the sitemap `<loc>`, the `Sitemap:` line in robots.txt, and all nine
JSON-LD `@id` values.

- **Broken today:** `og:image` 404s, so every share to Telegram, Instagram,
  Facebook or Slack renders with no image.
- **Breaks harder on launch:** a canonical pointing at a 404 tells Google the
  real URL is not canonical. Expected result is failure to index at all, plus a
  Search Console sitemap error.

**Fix:** one environment variable — `SITE_URL` on the Railway service (or the
real domain when it exists). No code change needed; the config already reads it.
Rebuild required, since these are baked at build time.

### C-2 · Build vocabulary is live in client-facing copy

Two strings currently shown to visitors:

> «Місячні пакети **в датасеті** вказані в доларах…»
> «Форма **в цьому прототипі** не надсилає повідомлення…»

A prospective client has no concept of a "датасет". This is worse for AI search
than for Google: these are self-referential statements *about the website*,
which is exactly the shape of sentence an answer engine quotes verbatim — "the
site says its contact form doesn't work."

### C-3 · `noindex` — intentional, but it is the launch switch

`INDEXABLE` is unset, so the page ships `noindex, nofollow`. Correct for a
preview. Noted here only because it and C-1 must flip together, and C-1 must be
fixed *first* or the newly indexable page immediately self-cancels.

---

## Important

| # | Finding | Evidence |
|---|---|---|
| I-1 | **Headings carry no topical or geo signal.** Across the H1 and all ten H2s — the highest-weighted text on the page — «Львів», «ціни», «кваліфікація», «Dragon Boat» and «онлайн» appear **zero times**. The real section labels exist but sit in `<span class="eyebrow">`, which carries no heading weight. | H2s are rhetorical: «Заміри, а не обіцянки», «Підтверджено, не заявлено» |
| I-2 | **The H1 reads as one token to non-CSS extractors.** The three lines are sibling `<span>`s with no whitespace, so raw text extraction yields `СИЛАВИКОВАНАВОДОЮ`. Browsers and Googlebot render CSS and read it correctly — but `robots.txt` deliberately invites OAI-SearchBot, Claude-SearchBot and PerplexityBot, most of which consume raw HTML. The single most important brand line is nonsense to exactly the audience that was opted in. | Same issue on the Athlete H2, which also has a full body sentence nested inside the heading |
| I-3 | **No `FAQPage` schema** despite six clean, server-rendered Q&A pairs. Highest-value missing markup on the page: the content already exists in the right shape. Q&A is also the best-chunking content type for retrieval. | `src/sections/Faq.astro` |
| I-4 | **`OfferCatalog` is orphaned.** `#offers` is declared and referenced by nothing — no `hasOfferCatalog`, no `makesOffer`. The five prices are structurally invisible. Offers also lack `itemOffered`, so nothing states what is being sold, and the monthly tiers declare no billing period. | `src/lib/schema.ts` |
| I-5 | **Price value and currency are split into sibling spans.** Text extraction yields `100` and `$` on separate lines. Combined with ₴ and $ mixed in one list, that is a live hallucination vector — a model can produce "600 $". The mixed currency itself is correct and should not be unified; the JSON-LD handles it properly with real `priceCurrency` values. | `<span class="num p-val">100</span><span class="p-cur">$</span>` |
| I-6 | **Zero `cache-control` headers site-wide.** Content-hashed immutable assets get no lifetime, so browsers fall back to heuristic freshness — which is near zero right after each deploy. Returning visitors revalidate ~20 assets per navigation. | verified across HTML, CSS, fonts, video, images |
| I-7 | **≈650 KB of 1.03 MB initial payload is avoidable.** 270 KB footer logo loading eagerly (every other image on the page is lazy — this one was missed); 94 KB of byte-identical duplicate font files (Onest is variable, so its three weights are the same bytes, md5-verified); ~200 KB of below-fold video posters, which `loading="lazy"` does not cover; 238 KB `dog.mp4`, the one video still using `src` + `autoplay`, which makes Chrome override its own `preload="none"`. | measured via Resource Timing, 22 requests |
| I-8 | **Four of five before/after cases exist only inside a `<script>` JSON blob.** Their captions and alt text are absent from the DOM, so ~80% of the proof section's text is invisible to a non-JS crawler. | tab `aria-label`s do carry the titles, so not entirely lost |
| I-9 | **Undated, unscoped competition titles.** «Чемпіон України / Європи / Євро-Азіатських ігор / Призер Чемпіонату світу» — no year, no discipline, no event. Summarisation can compress this into "world champion", the one title he explicitly does not hold. The project already guards hard against the analogous `міжнародного класу` error. | needs client input, not invention |
| I-10 | **`LocalBusiness` lacks the properties that drive local eligibility** — no `telephone`, `priceRange`, `geo`, `openingHoursSpecification`, no `streetAddress`. The venue is a bare `Place` name. `priceRange` is derivable from content already on the page; the rest needs the client. | |
| I-11 | **Non-atomic deploy window.** Observed directly: for a few seconds during a release the origin served old HTML referencing `_astro/…` files that had already been replaced and returned 404 — an unstyled page. Content-hashed filenames exist to make deploys atomic; swapping the directory in place forfeits that. | reproduced during the audit |
| I-12 | **Dragon Boat has no matching search string.** The site writes `Dragonboat` closed-up; demand is for the two-word form and the Cyrillic transliteration. The new section already uses `Dragon Boat` correctly — the remaining closed-up instances are in the formal titles. | `Dragon Boat` now present; «драгонбот» = 0 |

---

## Optional

- Title is 64 chars and will truncate; the `| IGOR GAVRILEYKO` suffix restates
  the name already at the front.
- No `og:image:alt`, no `apple-touch-icon` or PNG favicon fallback, no manifest.
- No brotli — sirv serves gzip only. ~15–20% left on the table.
- No AVIF anywhere, despite the comment in `astro.config.mjs` claiming it. The
  comment is aspirational; either add the format or correct the comment.
- 404 returns the right status with a completely blank body.
- Sitemap has no `lastmod` and no image/video entries despite declaring both
  namespaces.
- 915 KB of unreferenced files ship in the build (`Canoe1` passthrough,
  `logo-mark.png` from the previous build). No runtime cost.
- `robots.txt` contradicts itself: the comment says training crawlers are left
  unlisted as the owner's call, but `Google-Extended` — Google's AI training and
  grounding control — is explicitly allowed.
- «26 років у спорті» is relative to an unstated present. A start year is
  self-updating; the arithmetic is trivial but the start year is a fact to
  confirm, not derive.

---

## Current strengths

These came back clean and are worth not regressing.

- **Rendered-content parity is perfect.** 100% of commercial content is in the
  server response with zero JavaScript — every price, service, credential, FAQ
  answer and the medical exclusion. This is the foundation everything else rests
  on, and it is genuinely done.
- **Heading hierarchy is structurally sound** — one H1, no skipped levels,
  every section with `aria-labelledby` pointing at its own H2, named landmarks,
  working skip link.
- **Structured data misrepresents nothing.** Prices match visible content
  exactly; `aggregateRating`, `review`, `telephone` and `openingHours` are
  correctly absent rather than invented. That is the failure mode that earns
  manual actions, and it was avoided.
- **Alt text is factual, Ukrainian and describes the actual frame** rather than
  carrying keywords.
- **Entity clarity is high** for who he is, how to contact him, his
  qualifications, and — unusually — who he does *not* work with, which is stated
  twice in mutually corroborating ways.
- Correct `lang`/`charset`/`viewport`, explicit image dimensions with no CLS
  risk, `font-display: swap` on all 24 faces, working ETag revalidation, HTTP/2,
  and video Range requests returning 206.
- The five managed videos use `data-src` + IntersectionObserver +
  reduced-motion guard, which keeps roughly 19.9 MB off the initial load.

---

## Recommended next actions, in order

**1. One environment variable, before anything else.** Set `SITE_URL` on
Railway. It repairs the canonical, OG, sitemap, robots and all nine JSON-LD
`@id`s in a single change, and fixes broken social previews today.

**2. Then, before flipping `INDEXABLE`:** rewrite the two build-vocabulary
strings; resolve the contact form (wire it up or remove it); add `FAQPage`;
link `OfferCatalog` and give Offers an `itemOffered`; fix the run-on headings.

**3. Performance, independent of indexing:** lazy the footer logo and convert it
to WebP, collapse the duplicate variable-font faces, defer below-fold posters,
route `dog.mp4` through `AutoVideo`, add `cache-control`.

**4. Ask the client** — these gate later work and none may be invented: year and
discipline per competition title; the venue's street address and coordinates;
start years behind «26 років»/«16 років»; and the Google Business Profile
decision. On that last point, the honest answer is that **the map pack is not
reachable through on-page work at all** — it requires a GBP, and verification
generally needs a phone number or verifiable address, neither of which exists in
the dataset. The winnable target is the organic local block.

**5. Next phase — two sub-pages, in this order:**
`/vesluvannya-dragon-boat-lviv` (highest ROI: near-zero local competition, a
genuinely differentiated audience, and a Master-of-Sport credential no local
competitor holds — the new Dragon Boat block is already most of its content),
then `/personalni-trenuvannya-lviv`, which also resolves the H1 tension cleanly
by letting the fixed «Сила викована водою» stay on the brand homepage while the
service page gets a plainly descriptive H1.

Do **not** split out Method, Credentials or FAQ — they are worth more as
corroboration than as thin URLs. Do **not** chase «онлайн тренер»: it is
non-local, highly competitive and has no geographic moat.

**6. Highest-value content the site does not have:** a rehabilitation /
back-pain page. The differentiator is already documented in the credentials —
hernia-safe training, MFR, posture work — but exists only as four scattered
bullets and one FAQ line. Real informational demand, near-zero local
competition, and it feeds straight into the personal-training intent.
