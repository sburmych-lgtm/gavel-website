/**
 * Build guard: every preloaded font must exist.
 *
 * Font filenames are content-hashed, so re-vendoring renames them. A preload
 * pointing at a missing file is worse than no preload — the browser opens a
 * connection, waits, and 404s, all on the critical path. This has already
 * happened once.
 */
import { readFileSync, existsSync } from "node:fs";

const html = readFileSync("src/layouts/Base.astro", "utf8");
const css = readFileSync("src/styles/fonts.css", "utf8");

let failed = 0;

for (const m of html.matchAll(/href="(\/fonts\/[^"]+\.woff2)"/g)) {
  const p = `public${m[1]}`;
  if (!existsSync(p)) { console.error(`✗ preloaded font missing: ${m[1]}`); failed++; }
  else if (!css.includes(m[1])) { console.error(`✗ preloaded font not referenced by fonts.css: ${m[1]}`); failed++; }
}

for (const m of css.matchAll(/url\("(\/fonts\/[^"]+\.woff2)"\)/g)) {
  if (!existsSync(`public${m[1]}`)) { console.error(`✗ @font-face src missing: ${m[1]}`); failed++; }
}

if (failed) { console.error(`\ncheck-fonts: ${failed} problem(s)`); process.exit(1); }
console.log("check-fonts: ok");
