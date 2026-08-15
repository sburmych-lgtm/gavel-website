/**
 * Builds the Coach-section montage from the raw source library.
 *
 *   node scripts/build-montage.mjs
 *
 * The previous version of this section was a single raw 12s clip: Igor
 * standing still, talking, with burnt-in captions. This replaces it with a cut
 * sequence — the strongest moments across six real sources, crossfaded, colour
 * graded to one look, silent, and built to loop.
 *
 * Shot order is deliberate rather than chronological. It opens on him
 * standing and looking at camera, because frame 0 is also the poster — the
 * still that represents this section before playback and under reduced
 * motion, and "Хто я" cannot be represented by a lake. From there it builds,
 * takes a breath on the water at the midpoint, turns human on the
 * client-coaching shot, and ends on a strength beat so the loop back to the
 * opening portrait reads as a restart rather than a cut.
 *
 * Every source is already ~9:16, so nothing is cropped to fit.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";

const SRC = "G:/01_PROJECTS/Web Design/ihor_havryleiko_fitnesstrainer/Assets/Video";
const OUT_DIR = "public/media/video";
const OUT = `${OUT_DIR}/coach-montage.mp4`;

/* The panel is capped at 340 CSS px, so 810 wide is still 1.2x at 2x DPR.
   1080x1920 looked identical in the frame and cost 7.8 MB against 2.9. */
const W = 810;
const H = 1440;
const FPS = 30;
const XF = 0.4; // crossfade seconds — long enough to read as a dissolve

/**
 * grade: every source has a different white balance — the crossfit zone is
 * cold blue, the mirror gym is warm window light over yellow plates, the lake
 * is green. Without a per-clip correction the cuts flash between colour casts.
 * `sat` and `bs` (blue lift in shadows, half as much in midtones) pull each
 * one toward the site's ocean palette.
 */
const SHOTS = [
  { file: "Self_Presentation.MOV",     ss: 11.7, d: 2.1, sat: 0.86, bs: 0.04, note: "standing, to camera, clean of the burnt-in captions — this frame is also the poster" },
  { file: "Self_Presentation.MOV",     ss: 33.6, d: 2.2, sat: 0.86, bs: 0.04, note: "sled push — hardest beat" },
  { file: "Biceps_mirror.mp4",         ss: 1.6,  d: 2.1, sat: 0.62, bs: 0.07, note: "window light curl; heavy desat kills the yellow plates" },
  { file: "Self_Presentation.MOV",     ss: 18.2, d: 2.0, sat: 0.86, bs: 0.04, note: "hanging knee raise" },
  { file: "SelfTrainFitness_new1.MOV", ss: 8.0,  d: 2.0, sat: 0.84, bs: 0.05, note: "cable crossover" },
  { file: "Canoe_lake.mp4",            ss: 14.0, d: 2.0, sat: 0.80, bs: 0.05, note: "water — the breath at the midpoint" },
  { file: "Self_Presentation.MOV",     ss: 20.4, d: 2.1, sat: 0.86, bs: 0.04, note: "barbell squat" },
  { file: "Fitness_traine_girl.mp4",   ss: 3.0,  d: 2.3, sat: 0.84, bs: 0.05, note: "coaching a client — the human turn" },
  { file: "SelfTrainFitness_new2.MOV", ss: 6.0,  d: 2.0, sat: 0.84, bs: 0.05, note: "machine work" },
  { file: "Self_Presentation.MOV",     ss: 37.6, d: 2.0, sat: 0.86, bs: 0.04, note: "box jump" },
  { file: "Self_Presentation.MOV",     ss: 41.8, d: 2.1, sat: 0.86, bs: 0.04, note: "kettlebells overhead — ends on strength" },
];

for (const s of SHOTS) {
  if (!existsSync(`${SRC}/${s.file}`)) {
    console.error(`missing source: ${s.file}`);
    process.exit(1);
  }
}
mkdirSync(OUT_DIR, { recursive: true });

// ---- inputs: seek per input so only the needed span is decoded
const args = [];
for (const s of SHOTS) {
  args.push("-ss", String(s.ss), "-t", String(s.d), "-i", `${SRC}/${s.file}`);
}

// ---- normalise every segment to one size, fps, pixel format and look
const parts = [];
SHOTS.forEach((s, i) => {
  parts.push(
    `[${i}:v]scale=${W}:${H}:force_original_aspect_ratio=increase:flags=lanczos,` +
      `crop=${W}:${H},fps=${FPS},setsar=1,format=yuv420p,` +
      `eq=saturation=${s.sat}:contrast=1.07:brightness=-0.015,` +
      `colorbalance=bs=${s.bs}:bm=${(s.bs * 0.5).toFixed(3)},` +
      `setpts=PTS-STARTPTS[v${i}]`,
  );
});

// ---- chain the crossfades, tracking the running duration for each offset
let prev = "v0";
let acc = SHOTS[0].d;
for (let i = 1; i < SHOTS.length; i++) {
  const out = i === SHOTS.length - 1 ? "vout" : `x${i}`;
  const offset = (acc - XF).toFixed(3);
  parts.push(`[${prev}][v${i}]xfade=transition=fade:duration=${XF}:offset=${offset}[${out}]`);
  acc = acc - XF + SHOTS[i].d;
  prev = out;
}

args.push(
  "-filter_complex", parts.join(";"),
  "-map", "[vout]",
  "-an",
  "-c:v", "libx264",
  "-profile:v", "high",
  "-pix_fmt", "yuv420p",
  "-crf", "28",
  "-preset", "slow",
  "-movflags", "+faststart",
  "-y", OUT,
);

console.log(`${SHOTS.length} shots → ${acc.toFixed(2)}s`);
SHOTS.forEach((s, i) => console.log(`  ${String(i + 1).padStart(2)}. ${s.file} @${s.ss}s ${s.d}s — ${s.note}`));
console.log("\nencoding…");
execFileSync("ffmpeg", args, { stdio: "inherit" });

// poster from the first frame of the encoded file, so there is no flash on play
execFileSync("ffmpeg", [
  "-v", "error", "-i", OUT, "-frames:v", "1", "-q:v", "4",
  "-y", "public/media/image/coach-montage-poster.jpg",
], { stdio: "inherit" });

console.log(`\n${OUT}`);
