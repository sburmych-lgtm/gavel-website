# 03 · FINAL DESIGN SYSTEM

## Colour

Every value below was sampled from the real assets with `ffmpeg palettegen`,
then adjusted only for contrast. Provenance is recorded because it is the reason
the palette is defensible.

| Token | Hex | Role | Sampled from |
|---|---|---|---|
| `--abyss` | `#060E12` | page ground | `On_Beach.JPG` shadow `#020506`, `Canoe2.JPG` `#030A0F` |
| `--deep` | `#0B1A1F` | raised surface, nav glass base | `Canoe2.JPG` `#0E2124` |
| `--petrol` | `#123138` | section band, card on dark | `Canoe2.JPG` `#193732` |
| `--caustic` | `#4E9AA0` | **light only** — hairline, focus, underline, panel edge | `ocean169` `#4F797B`, `#487397` |
| `--foam` | `#E9EFF1` | primary text on dark | `On_Beach.JPG` `#CCD7D8` lifted |
| `--mute` | `#93A9B0` | secondary text on dark | `On_Beach.JPG` `#9AB7C4` |
| `--mist` | `#DCE6E8` | the light band ground | `ocean169` `#CAD9E7` |
| `--ink` | `#0A1418` | text on light; text on gold | — |
| `--gold` | `#E1AE42` | accent, primary CTA fill | `Logo_gold_version.jpg` `#E1AE42` |
| `--gold-deep` | `#C8952F` | gold hover, outline | `Logo_gold_version.jpg` `#C88D26` |
| `--danger` | `#B4453A` | form errors only | — |

### Measured contrast

| Pair | Ratio | Requirement |
|---|---:|---|
| `--foam` on `--abyss` | 16.79:1 | AA normal ✓ |
| `--mute` on `--abyss` | 7.93:1 | AA normal ✓ |
| `--caustic` on `--abyss` | 6.01:1 | AA normal ✓ |
| `--gold` on `--abyss` | 9.60:1 | AA normal ✓ |
| `--ink` on `--gold` (primary CTA) | 9.19:1 | AA normal ✓ |
| `--ink` on `--mist` | 14.68:1 | AA normal ✓ |

These are computed WCAG 2.x ratios, verified again in the browser during QA.
They are a design target met by construction, not a conformance claim.

### Usage law

- `--caustic` is **light, not paint**. Hairlines, focus rings, hover underlines,
  panel edges. Never a button fill, never a section background, never a heading
  colour, never more than roughly 5% of a viewport.
- `--gold` is the accent and the one primary-CTA fill. **Exactly one filled gold
  action per screen.** Matte solid only — no gradient, no glow, no bevel.
- Never `#000000` or `#FFFFFF`.
- Forbidden families: orange `#E85D22`/`#FB5607`/`#D9612C`, neon cyan `#22D3EE`,
  generic gym red-black.
- No gradients on type or buttons. No glassmorphism. No coloured shadow bleed.

## Typography

Self-hosted woff2. Full Cyrillic including `і ї є ґ` and `₴`. No CDN request.

| Role | Family | Weight |
|---|---|---|
| Display | Geologica | 800 |
| Body, UI | Onest | 400 / 500 / 600 |
| Data, labels | JetBrains Mono | 500 |

Fixel and e-Ukraine Head were specified by prior audits but are not reliably
obtainable; see `02_FINAL_DECISIONS.md` D-12. Swapping them back later touches
two custom properties.

```
--fs-mono   0.8125rem                                  JetBrains Mono 500, ls .1em, uppercase
--fs-sm     0.875rem
--fs-body   1.0625rem                                  Onest 400, lh 1.65, measure 62-68ch
--fs-lead   clamp(1.125rem, 0.98rem + 0.6vw, 1.375rem) lh 1.55, max 46ch
--fs-h3     clamp(1.25rem,  1.10rem + 0.6vw, 1.5rem)   Onest 600
--fs-h2     clamp(2rem,     1.40rem + 2.6vw, 3.25rem)  Geologica 800, lh 1.02, ls -.015em
--fs-h1     clamp(2.75rem,  1.50rem + 5.6vw, 5.75rem)  Geologica 800, lh .92,  ls -.025em
--fs-num    clamp(1.75rem,  1.30rem + 1.9vw, 2.5rem)   JetBrains Mono 500, tabular
```

**Every numeral in the interface is JetBrains Mono with `tabular-nums`** — years,
prices, phase numbers, measurements. That is what makes "measurement" a visible
property of the page rather than a claim in the copy.

All-caps is reserved for eyebrows, mono labels and nav. Line-height is always
unitless. `text-wrap: balance` on headings.

## Space and layout

```
--max   75rem                          /* 1200px content cap */
--gut   clamp(1.25rem, 4vw, 3.5rem)    /* 20px → 56px page gutter */
--sec   clamp(4.5rem, 9vw, 8rem)       /* 72px → 128px section rhythm */
--r     2px
```

Spacing scale: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 px.

Breakpoints — three, no more: **1100px** desktop, **768px** tablet, **560px**
small. Reviewed at 320 / 390 / 768 / 1024 / 1440 / 1920.

**Radius is 2px everywhere.** No pill buttons, no rounded cards. This is the
single most effective anti-template measure available: rounded cards on a dark
gradient is the exact shape of generated output.

**No icon sets.** Numerals, hairlines and type weight carry the structure.

## Section rhythm

Alternating light and dark every section reads as a template; a single light
band on thirteen sections reads as monotony. The page uses **two light bands**,
placed where brightness does commercial work:

```
Hero            abyss      ┐
Proof strip     deep       │ dark run — identity and credibility
Problem / Fit   MIST       ← light: the visitor recognises themselves
Method          abyss      ┐
Results         deep       │ dark run — evidence
Formats         abyss      ┘
Pricing         MIST       ← light: price is easiest to read on light
Coach           abyss      ┐
Athlete         deep       │ dark run — trust and authority
Credentials     abyss      │
FAQ             deep       │
Contact         abyss      ┘
Footer          abyss
```

Within the dark runs the ground shifts between `--abyss`, `--deep` and
`--petrol` surfaces so the rhythm is felt without a hard flip.

## Components

**Button** — `2px` radius, min height 48px, padding `14px 28px`.
`.btn-primary` is gold fill with ink text. `.btn-ghost` is a 1px `--foam` border
at 40% opacity, transparent fill. One primary per screen.

**MediaFrame** — the reusable framed-media primitive. 1px `--caustic` at 25%,
2px radius, no shadow, `--deep` background while loading, and a two-stop
vignette overlay from an empty `aria-hidden` span. This is the grammar the
client approved in the previous prototype; it is now a component rather than a
one-off. See `07` for the motion attached to it.

**Rule** — 1px `--foam` at 12%. The default separator. Section eyebrows sit
above a rule, never inside a box.

**Stat** — mono numeral at `--fs-num` over an Onest label at `--fs-mono` in
`--mute`. Used in the proof strip and credentials.

## Focus

`outline: 2px solid var(--caustic); outline-offset: 3px`. Never removed, never
replaced by a colour change alone. A visible skip link precedes the nav.
