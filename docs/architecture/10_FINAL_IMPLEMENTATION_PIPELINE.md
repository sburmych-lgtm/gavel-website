# 10 · IMPLEMENTATION PIPELINE

## Checkpoints

| CP | Scope | State |
|---|---|---|
| CP-00 | Repository, continuity scaffold, media pipeline, fonts | done |
| CP-01 | This architecture package, frozen and mirrored | done |
| CP-02 | Astro scaffold, tokens, base layer, content and media modules | |
| CP-03 | Responsive hero and navigation | |
| CP-04 | Fit, Method, Results with the mandatory Before/After slider | |
| CP-05 | Formats, Pricing, Coach panel, Athlete story | |
| CP-06 | Credentials, FAQ, Contact, Footer — complete page | |
| CP-07 | Motion, media optimisation, responsive, a11y, SEO | |
| CP-08 | Real-browser QA and focused remediation | |
| CP-09 | Prototype complete locally | |
| CP-10 | Railway preview deployed and verified on the public URL | |

At each: run checks → update `PROJECT_STATE.md` and `WORKLOG.md` → update
`HANDOFF.md` if continuation state changed → review `git status` and
`git diff` → descriptive commit → push. No batching the run into one commit.

## Build order

**Tokens before components. Components before sections. Hero last.**

The hero is the hardest composition and the easiest to over-invest in. Building
it after the rest means it is designed against a page that already exists,
rather than the page being bent around a hero built in isolation. The previous
prototype's own decision record makes the same point.

`MediaFrame` is the first component, because the Coach panel, the athlete media
and the credentials document all depend on its grammar and it must not be
reinvented three times.

## Media

`scripts/build-media.sh` has already run. It is manual, not part of `npm run
build` — a 105 MB HEVC transcode has no business in CI. Its output is committed.

Never hand-edit anything in `public/media/`. Change the script, re-run, commit.

## Commit convention

Conventional commits, scoped to the checkpoint:

```
feat(hero):     CP-03 responsive water hero + navigation
feat(results):  CP-04 mandatory before/after slider
fix(a11y):      focus ring on the slider handle
chore(media):   re-encode hero at 1600x900
docs(state):    CP-05 checkpoint
```

## Verification per checkpoint

```bash
npm run check     # facts guard, asset guard, astro check
npm run build     # must succeed
```

Then render in a real browser at the widths in `11` before committing anything
that changes layout. Rendered evidence, not intention.

## Stop condition

**CP-10.** Deployment verified on the public URL, then human visual approval.
No production backend, CRM, booking or analytics in this run.
