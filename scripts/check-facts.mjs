/**
 * Build guard: content integrity.
 *
 * A previous prototype on this project silently upgraded the client's
 * credential from "Майстер спорту України" to "міжнародного класу". A review
 * checklist did not catch it. A failing build does.
 *
 * Exits non-zero on any hit.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = "src";

/** Strings that must never appear in shipped content. */
const FORBIDDEN = [
  { needle: "міжнародного класу", why: "fabricated credential upgrade — the dataset says «Майстер спорту України»" },
  { needle: "МСМК", why: "fabricated credential abbreviation" },
  { needle: "Lorem", why: "placeholder text" },
  { needle: "TODO", why: "placeholder marker" },
  { needle: "300+", why: "invented client count" },
  { needle: "Ihor Havryleiko", why: "second Latin romanisation — the brand spelling is IGOR GAVRILEYKO" },
  { needle: "IHOR HAVRYLEIKO", why: "second Latin romanisation — the brand spelling is IGOR GAVRILEYKO" },
  { needle: "blurface", why: "obsolete asset filename" },
  { needle: "blureface", why: "obsolete asset filename" },
];

/** Assertions that must hold. */
const REQUIRED = [
  { needle: '"СИЛА"', why: "H1 line 1 is fixed by the client" },
  { needle: '"ВИКОВАНА"', why: "H1 line 2 is fixed by the client" },
  { needle: '"ВОДОЮ"', why: "H1 line 3 is fixed by the client" },
  { needle: "Майстер спорту України", why: "the real credential must be present" },
  { needle: "медично протипоказані", why: "the medical exclusion must be stated" },
];

function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (/\.(ts|astro|md|json)$/.test(e)) out.push(p);
  }
  return out;
}

/**
 * Comments are where the rules are explained, and an explanation naturally
 * quotes the forbidden string. Scan what ships, not what documents it.
 * Line comments are matched only at the start of a trimmed line so that URLs
 * inside string literals survive.
 */
function stripComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .split("\n")
    .filter((l) => !/^\s*(\/\/|\*)/.test(l))
    .join("\n");
}

const files = walk(ROOT);
const corpus = files.map((f) => ({
  f,
  text: stripComments(readFileSync(f, "utf8")),
}));
const contentOnly = corpus
  .filter((c) => c.f.includes("content"))
  .map((c) => c.text)
  .join("\n");

let failed = 0;

for (const { needle, why } of FORBIDDEN) {
  for (const { f, text } of corpus) {
    // The guard describes its own forbidden strings, so skip itself.
    if (f.includes("check-facts")) continue;
    if (text.includes(needle)) {
      console.error(`✗ forbidden "${needle}" in ${f}\n    ${why}`);
      failed++;
    }
  }
}

for (const { needle, why } of REQUIRED) {
  if (!contentOnly.includes(needle)) {
    console.error(`✗ missing required "${needle}"\n    ${why}`);
    failed++;
  }
}

if (failed) {
  console.error(`\ncheck-facts: ${failed} problem(s)`);
  process.exit(1);
}
console.log(`check-facts: ok (${files.length} files)`);
