# 13 · SEO, LOCAL SEO AND AI-SEARCH DISCOVERABILITY

Both prior synthesis packages left this almost empty — Cursor deliberately
deferred it, Codex reduced it to one line, Antigravity did not mention it. It is
an architectural requirement here, decided now and built now.

## Rendering strategy

**Astro with `output: "static"`.** Every page is fully rendered HTML at build
time. There is no client-side hydration gate on any content.

This is the whole SEO foundation. Retrieval systems — Googlebot, Google's AI
surfaces, OAI-SearchBot, Claude-SearchBot, and anything else standards-compliant
— get the complete page in the initial response.

Hard rule: **no commercial content may exist only inside video, image, canvas or
client-side animation.** Reveal animations start at `opacity: 0` in CSS and are
promoted by an observer, but the text is in the DOM from the first byte. This is
verified by a gate, not assumed:

```bash
npm run build && grep -c "Захват" dist/index.html   # must be ≥ 1
```

## Technical SEO

| Item | Implementation |
|---|---|
| Language | `<html lang="uk">` |
| Title | `Ігор Гаврилейко — персональний тренер у Львові \| IGOR GAVRILEYKO` |
| Description | 155 chars, offer-led, includes city and the free consultation |
| Canonical | absolute, from `SITE_URL` config |
| Open Graph | `og:type=website`, title, description, `og:image` 1200×630, `og:locale=uk_UA` |
| Twitter | `summary_large_image` |
| Robots | `public/robots.txt`, explicit crawler policy below |
| Sitemap | `@astrojs/sitemap`, emitted at `/sitemap-index.xml` |
| URLs | one clean URL, no query params, no trailing-slash ambiguity |
| Headings | exactly one `h1`; one `h2` per section; `h3` for cards and FAQ |
| Images | intrinsic `width`/`height`, factual Ukrainian alt, AVIF/WebP/JPEG `srcset` |
| Navigation | real `<a href="#…">`, crawlable, works without JS |
| Mobile | responsive from 320px, no horizontal overflow |

### OG image

Sourced from `In_Gym.JPG`, not the canoe. A distant paddler seen from behind
does not read at a 1200×630 thumbnail, let alone in a chat citation card. A
clear portrait of the coach does. Rendered at build time to
`/og-image.jpg`.

## Structured data

One JSON-LD block, built from the same content module the page renders from, so
the markup can never drift from the visible text.

```
@graph
├── Person          Ігор Гаврилейко
│                   alternateName "IGOR GAVRILEYKO"
│                   jobTitle "Персональний тренер"
│                   knowsAbout [персональні тренування, реабілітаційний
│                               тренінг, стретчинг, веслування, …]
│                   alumniOf → EducationalOrganization
│                   sameAs [instagram]
│                   worksFor → LocalBusiness
├── LocalBusiness   (@type SportsActivityLocation)
│                   name, areaServed Львів, address addressLocality Львів /
│                   addressCountry UA, no street address — none was supplied
├── WebSite         name, url, inLanguage uk
├── WebPage         about → Person, primaryImageOfPage
└── Service ×4      Персональні / Групові / Онлайн / Веслування
                    provider → Person, areaServed, offers → Offer
                    with the real price and currency
```

**Not emitted, because the data does not exist:** `aggregateRating`, `review`,
`streetAddress`, `telephone`, `openingHours`, `priceRange` as a fabricated band.
Emitting any of those would be inventing facts, and Google penalises structured
data that misrepresents the page.

Offers carry the dataset's real mixed currencies — `UAH` for the single session,
`USD` for the monthly packages. No conversion.

## Local SEO

The page should be understandable for: `персональний тренер Львів`,
`фітнес тренер Львів`, `персональні тренування Львів`, `тренер з реабілітації
Львів`, `personal trainer Lviv`, `онлайн тренер`.

Achieved structurally rather than by repetition:

- City in the `<title>`, the meta description, the hero eyebrow, the footer, the
  formats rows and `LocalBusiness.areaServed`.
- Venue named as supplied — ФЦ «Пляж» (Аквапарк) — in the eyebrow, formats and
  footer.
- Service formats as distinct named rows, each mapped to a `Service` node.
- Online coaching stated as a separate format so non-local intent also resolves.

No keyword stuffing. The city appears where a human would naturally write it.

### Deferred to production

Google Business Profile, Search Console verification, sitemap submission,
real-domain canonical, and `hreflang` if a Russian or English variant is ever
added. Listed in `12_OPEN_HUMAN_DECISIONS.md`.

## AI-search crawler policy

Search visibility and model-training permission are **different decisions** and
the robots file treats them separately. The default shipped here is: allow
search and retrieval, stay silent on training.

```
User-agent: *
Allow: /

# Search and user-directed retrieval — explicitly allowed
User-agent: Googlebot
Allow: /
User-agent: Google-Extended        # Gemini grounding
Allow: /
User-agent: OAI-SearchBot          # ChatGPT Search
Allow: /
User-agent: ChatGPT-User           # user-initiated fetch
Allow: /
User-agent: Claude-SearchBot       # Claude search index
Allow: /
User-agent: Claude-User            # user-initiated fetch
Allow: /
User-agent: PerplexityBot
Allow: /

Sitemap: {SITE_URL}/sitemap-index.xml
```

`GPTBot` and `ClaudeBot` — the training crawlers — are deliberately left
unlisted rather than allowed or blocked, because that is the owner's call and
not a default anyone else should make. It is raised as an open decision.

**The preview deployment ships `noindex`.** A staging URL must never enter an
index ahead of the real domain. The flag is a single build-time config value.

## What this architecture deliberately does not do

No "GEO hacks", no invisible text, no llms.txt speculation, no schema types the
content does not support. The discoverability strategy is: render real HTML,
mark it up honestly, state the city and the services plainly, and do not lie in
JSON-LD.
