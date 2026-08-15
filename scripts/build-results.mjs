/**
 * Splits the two-up before/after composites into separate halves so every
 * case can drive the slider, not just the one genuine pair.
 *
 *   node scripts/build-results.mjs
 *
 * The client archive is mostly composites — two photographs already pasted
 * side by side in one file. A wipe needs two images, so each one is cut at
 * its seam. The seams are NOT at 50%: they were located by finding the column
 * with the largest mean absolute difference from its neighbour, which is where
 * one photograph ends and the next begins. Cases 3 and 6 have a white divider
 * strip instead, found as the lowest-variance column.
 *
 * Halves within a case are padded to identical dimensions — a wipe across two
 * differently sized images tears at the seam. Padding uses the page ground so
 * the letterbox is invisible against the frame.
 *
 * No body retouching anywhere: crop, pad and scale only.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";

const BA = "G:/01_PROJECTS/Web Design/ihor_havryleiko_fitnesstrainer/Assets/before-after/Real Photos";
const OUT = "public/media/image";
const GROUND = "#0B1A1F";

/**
 * seam   — measured split column, in the source's own pixel space
 * pre    — optional crop applied before splitting (source has baked padding)
 * gap    — pixels trimmed either side of the seam (white divider strips)
 */
const CASES = [
  {
    id: 1,
    kind: "pair",                       // already two separate files
    before: "1_before.png",
    after: "1_after.png",
    cropBefore: "681:908:165:15",
    cropAfter: "890:1187:99:241",
    out: [900, 1200],
    title: "Набір форми",
    sub: "Обличчя приховано на прохання клієнта.",
  },
  {
    id: 4,
    kind: "composite",
    file: "4_before-after.jpg",
    seam: 997,                           // 55.1% — sharp gradient spike
    gap: 2,
    title: "Мінус живіт",
    sub: "Архів тренера, побутова зйомка. Профіль.",
  },
  {
    id: 2,
    kind: "composite",
    file: "2_before-after.jpg",
    seam: 1141,                          // 44.6%
    gap: 2,
    title: "Спина і постава",
    sub: "Архів тренера, побутова зйомка. Вид зі спини.",
  },
  {
    id: 6,
    kind: "composite",
    file: "6_before-after.JPG",
    pre: "768:934:0:173",                // baked white bands top and bottom
    seam: 383,                           // white divider, dead centre
    gap: 6,
    title: "Схуднення й тонус",
    sub: "Той самий ракурс і те саме світло.",
  },
  {
    id: 3,
    kind: "composite",
    file: "3_before-after.jpg",
    seam: 597,                           // 46.6%, white divider
    gap: 5,
    bakedLabels: true,                   // carries its own ДО/ПІСЛЯ type
    title: "Суха вага",
    sub: "Архів тренера. Підписи — на оригіналі знімка.",
  },
];

mkdirSync(OUT, { recursive: true });

const ff = (args) => execFileSync("ffmpeg", ["-y", "-v", "error", ...args], { stdio: "inherit" });
const probe = (f) =>
  execFileSync("ffprobe", ["-v", "error", "-select_streams", "v:0",
    "-show_entries", "stream=width,height", "-of", "csv=p=0:s=x", f])
    .toString().trim().split("x").map(Number);

const manifest = [];

for (const c of CASES) {
  const bOut = `${OUT}/result-${c.id}-before.jpg`;
  const aOut = `${OUT}/result-${c.id}-after.jpg`;

  if (c.kind === "pair") {
    ff(["-i", `${BA}/${c.before}`, "-vf", `crop=${c.cropBefore},scale=${c.out[0]}:${c.out[1]}:flags=lanczos`, "-q:v", "3", bOut]);
    ff(["-i", `${BA}/${c.after}`,  "-vf", `crop=${c.cropAfter},scale=${c.out[0]}:${c.out[1]}:flags=lanczos`,  "-q:v", "3", aOut]);
  } else {
    const src = `${BA}/${c.file}`;
    const [sw, sh] = c.pre ? c.pre.split(":").slice(0, 2).map(Number) : probe(src);
    const pre = c.pre ? `crop=${c.pre},` : "";
    const g = c.gap ?? 0;

    const lw = c.seam - g;
    const rw = sw - c.seam - g;
    // one canvas per case, sized to the wider half so neither is distorted
    const cw = Math.max(lw, rw);
    const box = `scale=${cw}:${sh}:force_original_aspect_ratio=decrease:flags=lanczos,` +
                `pad=${cw}:${sh}:(ow-iw)/2:(oh-ih)/2:color=${GROUND},setsar=1`;

    ff(["-i", src, "-vf", `${pre}crop=${lw}:${sh}:0:0,${box}`, "-q:v", "3", bOut]);
    ff(["-i", src, "-vf", `${pre}crop=${rw}:${sh}:${c.seam + g}:0,${box}`, "-q:v", "3", aOut]);
  }

  const [w, h] = probe(bOut);
  const [w2, h2] = probe(aOut);
  if (w !== w2 || h !== h2) {
    console.error(`  case ${c.id}: halves differ (${w}x${h} vs ${w2}x${h2}) — the wipe would tear`);
    process.exit(1);
  }

  // thumbnail for the case switcher
  ff(["-i", aOut, "-vf", "scale=180:-2:flags=lanczos", "-q:v", "5", `${OUT}/result-${c.id}-thumb.jpg`]);

  manifest.push({ id: c.id, w, h, ratio: +(w / h).toFixed(4), title: c.title, sub: c.sub, bakedLabels: !!c.bakedLabels });
  console.log(`  case ${c.id}  ${w}x${h}  ratio ${(w / h).toFixed(3)}  ${c.title}`);
}

console.log("\nratios for src/content/media.ts:");
console.log(JSON.stringify(manifest, null, 2));
