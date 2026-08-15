# CLAUDE.md — working rules for this repository

Read `docs/PROJECT_STATE.md` first. It states the current stage, the last
checkpoint, what works, what does not, and the exact next action.

## Fixed client decisions — do not renegotiate

| Item | Value |
|---|---|
| Brand spelling | `IGOR GAVRILEYKO` — never another romanisation, never mixed |
| H1 | `«Сила викована водою»` — wording fixed; line breaks are free |
| First impression | water / canoe. No gym-first hero, no splash, no mythology |
| Before/After | a draggable slider is mandatory |
| Credential | `Майстер спорту України` — never `міжнародного класу` |

## Content rules

- Client-supplied information is approved first-party content. Do not demand
  third-party sourcing for ordinary statements.
- Never invent: client counts, testimonials, ratings, timelines, kilograms,
  phone numbers, currency conversions, or credentials.
- All copy lives in `src/content/`. No user-facing string belongs in markup.

## Design rules

- Gold `--gold` is the accent and the one primary-CTA fill. Exactly one filled
  primary action per screen.
- Teal `--caustic` is **light, not paint** — hairlines, focus rings, underlines.
  Never a button fill, never a large area, never a heading colour.
- Radius is `2px` everywhere. No pill buttons, no rounded cards.
- No icon sets. Numerals and hairlines carry the structure.
- Animate `opacity` and `transform` only.

## Before changing media

`scripts/build-media.sh` is the only writer of `public/media/`. Change the
script, re-run it, and commit the result — never hand-edit a derivative. The
before/after registration numbers in that script were measured from anatomical
landmarks; if you change a crop, re-verify the wipe seam visually.

## Checkpoint discipline

At every checkpoint: run checks → update `docs/PROJECT_STATE.md` and
`docs/WORKLOG.md` → update `docs/HANDOFF.md` if continuation state changed →
review `git status` and `git diff` → descriptive commit → push.

Never force-push, rewrite history, or hard-reset shared history.
