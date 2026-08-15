# 11 · QUALITY GATES

A gate either passes mechanically or is checked by eye against stated evidence.
"Looks fine" is not a gate.

## Blocking — the build fails

| # | Gate | Mechanism |
|---|---|---|
| G-01 | No fabricated credential. `міжнародного класу` must not appear | `check-facts.mjs` |
| G-02 | H1 is exactly `СИЛА / ВИКОВАНА / ВОДОЮ` | `check-facts.mjs` |
| G-03 | `IGOR GAVRILEYKO` is the only Latin romanisation | `check-facts.mjs` |
| G-04 | No placeholder text (`TODO`, `Lorem`, `300+`) in content | `check-facts.mjs` |
| G-05 | No AI-generated client imagery — the Грок set, the two generated clips, the Poseidon animations — referenced anywhere | `check-assets.mjs` |
| G-06 | TypeScript passes | `astro check` |
| G-07 | Production build succeeds | `astro build` |

## Verified by inspection, with evidence in `docs/quality/`

| # | Gate | How |
|---|---|---|
| G-08 | Rendered-content parity — all sections, headings and prices present with JS disabled | grep the built `dist/index.html` |
| G-09 | No horizontal overflow at 320 / 390 / 768 / 1024 / 1440 / 1920 | measure `scrollWidth` vs `clientWidth` in the browser |
| G-10 | Contrast meets the ratios in `03` | computed, then re-checked in the browser |
| G-11 | Keyboard reaches every control; focus is always visible | tab through, screenshot the ring |
| G-12 | Before/After works by pointer, keyboard and click | drive all three in the browser |
| G-13 | Reduced motion suppresses transitions and does not fetch video | emulate the preference, check network |
| G-14 | Hero reads as water on first paint, no layout shift | screenshot at each width |
| G-15 | Every video has a visible pause control | inspect |
| G-16 | Preview build ships `noindex` | check the meta tag on the deployed URL |

## Budgets

| Metric | Target |
|---|---:|
| LCP (poster, not a video frame) | ≤ 2.5s |
| CLS | ≤ 0.1 |
| INP | ≤ 200ms |
| Above-the-fold transfer | ≤ 1.6 MB |
| Hero poster | ≤ 250 KB |
| Desktop hero loop | ≤ 4 MB, `preload="none"` |
| Below-fold video | lazy, `preload="none"` |
| Touch target | ≥ 44 × 44 CSS px |
| Body text | ≥ 16px, measure 62–68ch |

Lab numbers are diagnostic. No WCAG conformance claim is published from this
run — the ratios are a design target met by construction and verified by
measurement, which is a different statement from certified conformance.

## Remediation policy

At most **three focused remediation loops** after the first full browser QA
pass, unless a genuine blocker requires more. Each loop: identify from rendered
evidence, fix, re-render, re-capture. Cosmetic preferences that are not defects
are recorded as open decisions rather than absorbed into a loop.

## What no agent may sign off alone

Final visual approval. Consent for third-party likenesses. Publication of any
regulated claim. Real-domain configuration.
