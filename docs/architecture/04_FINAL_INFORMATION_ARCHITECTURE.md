# 04 · FINAL INFORMATION ARCHITECTURE

One page, one URL. Multi-page expansion is deferred until there is real content
and a human SEO brief; see `13`.

## Order

The ordering principle is **evidence before offer, trust before price** — with
one deliberate exception noted below.

| # | Section | Anchor | Ground | Visitor question |
|---|---|---|---|---|
| — | Header | — | glass | — |
| 1 | Hero | `#top` | abyss | Is this for me? |
| 2 | Proof strip | — | deep | Is he credible? |
| 3 | Problem / Fit | `#fit` | **mist** | Does he understand my situation? |
| 4 | Method | `#method` | abyss | What will actually happen? |
| 5 | Results | `#results` | deep | Does it work on real people? |
| 6 | Formats | `#formats` | abyss | How can we work together? |
| 7 | Pricing | `#pricing` | **mist** | What does it cost? |
| 8 | Coach | `#coach` | abyss | Who am I trusting? |
| 9 | Athlete story | `#athlete` | deep | What makes him different? |
| 10 | Credentials | `#credentials` | abyss | Is any of this verifiable? |
| 11 | FAQ | `#faq` | deep | What could stop me? |
| 12 | Contact | `#contact` | abyss | What do I do now? |
| — | Footer | — | abyss | — |

## Why the Coach section sits after pricing

The two prior packages split on this. Claude's put Self_Presentation *before*
pricing — "you meet the person before you see the number." Codex's put it
*after* — authority lands once the commercial decision is understood.

Placed after, for a reason neither stated: **the commercial core must not be
interrupted.** Method → Results → Formats → Pricing is a single argument, and
dropping a 12-second video of the coach in the middle of it breaks the chain
right where the visitor is closest to deciding. Placed after pricing, the Coach
section answers the objection that pricing creates — *is he worth it* — which is
exactly the question a face-to-camera video is good at.

## Navigation

Five links plus one persistent action. Outcome labels, not taxonomy.

```
Метод · Результати · Формати · Ціни · Хто я        [ Консультація ]
```

- The nav CTA is **ghost**, not filled — the hero already owns the one filled
  gold action on that screen.
- Below 1100px the links collapse into a full-screen overlay panel. The overlay
  must not be a clipped `backdrop-filter` containing block; that bug has already
  been hit once on this project.
- The header gains its glass background and hairline only after scrolling past
  60% of the viewport height, so the hero opens clean.
- Mobile gains a sticky bottom CTA bar once the hero CTA leaves the viewport,
  which disables again near `#contact` so it never covers the real form.

## Anchors and links

Every section is an `<section id>` with an `aria-labelledby` pointing at its own
heading. Internal navigation is real `<a href="#…">`, crawlable, and works with
JavaScript disabled.

## Heading hierarchy

Exactly one `<h1>` — the hero. Each section carries one `<h2>`. Cards and FAQ
entries use `<h3>`. Eyebrows are `<p>`, never headings — they are styled labels,
and promoting them would corrupt the outline.

## Rendered-content requirement

All thirteen sections, all headings, all prices and all body copy must be present
in the server response with JavaScript disabled. Reveal animations may enhance;
they may never gate content. This is verified as a quality gate, not assumed.
