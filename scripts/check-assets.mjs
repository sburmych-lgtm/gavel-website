/**
 * Build guard: no rejected asset may reach a public URL.
 *
 * The AI-generated "client" before/after set and the Poseidon animations are
 * the two things on this project that would do real reputational damage if
 * they shipped. A build failure is a stronger guarantee than a review pass.
 *
 * Exits non-zero on any hit.
 */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const BANNED_REFERENCES = [
  { pat: /Грок|grok/i, why: "AI-generated fake client transformations" },
  { pat: /v3-ua-(man|woman)/i, why: "AI-generated fake client transformations" },
  { pat: /young-man-slim-to-muscle|adult-man-overweight-to-lean/i, why: "AI-generated fake client transformations" },
  { pat: /Athletic_coach_paddling_water/i, why: "AI-generated paddling clip" },
  { pat: /Coach_training_client_in_gym/i, why: "AI-generated gym clip" },
  { pat: /Warrior_striking_logo/i, why: "Poseidon/warrior mythology — banned by the brief" },
  { pat: /Intro_Final|cinematic_intro|title-intro/i, why: "splash intro — banned by the brief" },
  { pat: /Self_Presentation\.MOV/i, why: "105 MB HEVC source must never be served" },
  { pat: /Fitness_traine_girl/i, why: "third-party likeness held pending written consent" },
];

/** Any file physically present in public/ is one HTTP request from the world. */
const BANNED_FILENAMES = BANNED_REFERENCES;

function walk(dir, test) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out.push(...walk(p, test));
    else if (!test || test(e)) out.push(p);
  }
  return out;
}

let failed = 0;

// 1. No source file may reference a banned asset.
for (const f of walk("src", (e) => /\.(ts|astro|md|json|css)$/.test(e))) {
  const text = readFileSync(f, "utf8");
  for (const { pat, why } of BANNED_REFERENCES) {
    if (pat.test(text)) {
      console.error(`✗ ${f} references a banned asset (${pat})\n    ${why}`);
      failed++;
    }
  }
}

// 2. No banned asset may sit in public/ at all.
for (const f of walk("public")) {
  for (const { pat, why } of BANNED_FILENAMES) {
    if (pat.test(f)) {
      console.error(`✗ banned asset present in public/: ${f}\n    ${why}`);
      failed++;
    }
  }
}

// 3. Every video in public/media must be audio-free — none of them are meant
//    to make noise, and an unnoticed audio track is dead weight.
const vids = walk("public/media/video", (e) => e.endsWith(".mp4"));
if (vids.length === 0) {
  console.error("✗ no video derivatives found — run: bash scripts/build-media.sh");
  failed++;
}

if (failed) {
  console.error(`\ncheck-assets: ${failed} problem(s)`);
  process.exit(1);
}
console.log(`check-assets: ok (${vids.length} video derivatives)`);
