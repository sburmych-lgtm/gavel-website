# DESIGN

The visual thesis, in the form a designer needs rather than a spec table.

## The idea

**Сила викована водою.** *Викована* is a forging word — heat, hammer, metal. The
client's own logo is gold. So the page is deep water with metal in it: an
ocean-dark ground, cold steel-blues out of the photographs, and a single warm
gold that behaves like a medal rather than a highlighter.

That is the whole system. Everything else follows from it.

## What the page must feel like

Composed, not loud. A man who has spent twenty-six years measuring things does
not sell with exclamation marks. The page should feel like the calm before a
race: dark, wide, quiet, with one bright thing on screen at a time.

The reference for register is a high-end outdoor or sports-equipment brand, not
a local gym flyer and not a SaaS dashboard.

## First screen

Water fills it. The landscape canoe loop runs full-bleed under a dark gradient
that is heaviest at the bottom, where the type sits. The H1 is three lines of
Geologica 800 at up to 92px, tight leading, negative tracking, uppercase —
`СИЛА / ВИКОВАНА / ВОДОЮ`. It is the only thing at that size anywhere on the
page.

Under it: one sentence of offer, one gold button, one ghost button. Above it: a
small mono eyebrow naming the city and the venue, because a local trainer's
first job is to say where he is.

Nothing animates in. The hero is simply there.

On mobile the vertical source takes over, because the vertical footage on a
vertical screen is the one case where the material and the format finally agree.

## The three moves that stop this looking generated

**1. Two-pixel corners.** Everywhere. Rounded cards on a dark gradient is the
exact silhouette of AI output. Sharp corners plus hairlines reads as editorial.

**2. Teal is light, not paint.** The aqua only ever appears as a one-pixel edge,
a focus ring, or an underline on hover. The moment it fills a button or a card,
the page becomes every dark fitness template.

**3. No icons.** Not one. Numerals in mono and hairline rules carry all the
structure. Icon sets are where personality goes to die, and a page about
measurement should show numbers instead of pictograms of numbers.

## Type

Geologica 800 for display — technical, slightly severe, real Cyrillic. Onest for
everything readable. JetBrains Mono for **every numeral in the interface**: the
years, the prices, the phase numbers. That last rule is doing more work than it
looks like. It makes "measurement" a visible property of the page rather than a
claim in the copy.

## The framed panel

The client liked how the previous prototype presented the self-presentation
video: a 9:16 panel, capped small at 340px, right-aligned against large type,
two-pixel corners, a one-pixel aqua hairline, no shadow at all, a cool grade
over the bright gym footage, and a two-stop vignette so the phone video reads as
*composed* rather than dropped in.

That grammar is preserved exactly and promoted into a reusable component. What
changes is the slot: water owns the hero now, so the panel moves to the Coach
section and mirrors — video left, type right — so the page does not repeat the
hero's composition.

The colour grade matters and is easy to lose. The gym footage is bright, blue
and clinical; ungraded it fights the ocean palette. `saturate(.72)
contrast(1.06) brightness(.82)` sits it down into the page.

## Rhythm

Thirteen sections is a long page, so the light bands are placed where brightness
does work rather than on an alternating schedule. Two of them: **Problem/Fit**,
where the visitor recognises themselves and the page should open up and breathe,
and **Pricing**, because a number is easiest to read on light.

Everything else is dark, with the ground shifting quietly between three values
so the run never feels flat.

## Proof

The Before/After slider is the emotional centre of the page and the thing most
likely to look cheap. Two safeguards: the pair is *registered* before it ships —
shoulder line and waistband pinned to the same canvas position, so dragging
shows a body changing rather than a camera moving — and the section says so out
loud. «Обидва кадри зведені за лінією плечей і поясом — змінюється тіло, не
ракурс.» Telling the visitor how the comparison was made is what separates proof
from a before-and-after ad.

## What this page refuses to do

No splash. No scroll-jacking. No parallax. No particles, no WebGL water, no
caustic filters — that was tried and it read as camouflage. No orange. No neon
cyan. No pill buttons. No card grid repeated more than twice. No mythology, no
tridents, no Poseidon. No invented number anywhere.
