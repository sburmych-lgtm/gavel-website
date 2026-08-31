# HANDOFF

Enough to continue without reading any chat history.

## What this is

The production-frontend candidate for **IGOR GAVRILEYKO**. Implementation lives
on branch `production/frontend-v1-grok` in worktree
`G:\01_PROJECTS\Web Design\ihor_havryleiko_fitnesstrainer\Production\Cursor_Grok`.
The approved prototype `main` working tree must not be used for these edits.

Human review is required before merge to `main`. Do not overwrite the existing
Railway deployment.

## Where things live

| What | Where |
|---|---|
| This repository | `G:\01_PROJECTS\Web Design\igor_gavrileyko_final_claude` |
| GitHub | `sburmych-lgtm/igor-gavrileyko-final-claude` (private) |
| Architecture package | `…\Assets\Архітектура та пайплайн\FINAL_CLAUDE_CANDIDATE` |
| Mirror of the same | `docs/architecture/` |
| Read-only asset library | `…\ihor_havryleiko_fitnesstrainer\Assets` |
| Railway project | `igor-gavrileyko-final-claude` |

Do not read or modify `FINAL_CODEX_CANDIDATE`, `FINAL_CURSOR_CANDIDATE` or
`FINAL_ANTIGRAVITY_CANDIDATE`.

## Read these, in order

1. `docs/PROJECT_STATE.md` — stage, what works, what does not, next action
2. `docs/DECISIONS.md` — every decision with its reason
3. `CLAUDE.md` — the rules that must not be renegotiated
4. `docs/architecture/` — the frozen design contract

## The five things most likely to be broken by a careless change

1. **The H1 wording.** `«Сила викована водою»` is fixed. Line breaks are free;
   the words are not.
2. **The brand spelling.** `IGOR GAVRILEYKO`, one romanisation everywhere —
   logo, `<title>`, OG tags, JSON-LD.
3. **The credential.** `Майстер спорту України`. Never `міжнародного класу`.
   A previous prototype fabricated that upgrade. `npm run check:facts` fails the
   build on it.
4. **The Before/After registration.** The two source photos are not
   camera-aligned. `scripts/build-media.sh` carries measured crop numbers that
   put the shoulder line and waistband on a common canvas Y. Change a crop and
   the wipe seam visibly breaks — re-verify by rendering a 50% wipe.
5. **Teal as paint.** `--caustic` is light: hairlines, focus rings, underlines.
   The moment it becomes a button fill or a section background, the page starts
   reading as generic AI output. Same for gold beyond one filled action per
   screen.

## Regenerating assets

```bash
bash scripts/build-media.sh     # rewrites public/media/ from the asset library
node scripts/fetch-fonts.mjs    # re-vendors woff2 + regenerates src/styles/fonts.css
```

Neither runs during `npm run build`. Both are manual and their output is
committed.

## Verifying

```bash
npm run check      # facts guard + banned-asset guard + typecheck
npm run build      # static output to dist/
npm run preview    # serve the build
```

QA evidence, including screenshots at every reviewed width, is in
`docs/quality/`.

## Exact next action

**HUMAN REVIEW** of `production/frontend-v1-grok`. Do not merge. Do not
overwrite Railway production.

Preview of intro + canoe scroll: branch `claude/scroll-canoe-backdrop`
(IMG_1851 open, then the scroll-driven canoe backdrop). Deploys to
https://motion-lab-intro-preview-production.up.railway.app — not `main`.
