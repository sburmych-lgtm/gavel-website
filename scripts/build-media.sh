#!/usr/bin/env bash
# Media pipeline — derives every web asset from the read-only Assets library.
#
# Source of truth: G:/01_PROJECTS/Web Design/ihor_havryleiko_fitnesstrainer/Assets
# Never modified. All derivatives land in public/media/.
#
# Run:  bash scripts/build-media.sh
set -euo pipefail

A="G:/01_PROJECTS/Web Design/ihor_havryleiko_fitnesstrainer/Assets"
OUT="public/media"
mkdir -p "$OUT/video" "$OUT/image"

say(){ printf '\n\033[36m▸ %s\033[0m\n' "$1"; }

# ---------------------------------------------------------------- video
# Shared encode profile: no audio track, yuv420p for universal decode,
# faststart so the moov atom is at the front and playback can begin
# before the whole file lands.
enc(){ # enc <in> <out> <ss> <t> <filters> <crf>
  ffmpeg -y -v error -ss "$3" -t "$4" -i "$1" \
    -an -c:v libx264 -profile:v high -pix_fmt yuv420p \
    -vf "$5" -crf "$6" -preset slow -movflags +faststart "$2"
}

say "hero desktop — Canoe_ocean_16-9 (1280x720 source)"
# Lanczos to 1600x900 with a light unsharp. The source is only 720p; letting
# the browser bilinear-scale it to a 2560px viewport is visibly softer than
# resampling once here with a sharpening pass. 1600 is the compromise between
# that gain and the byte cost of a full 1080p encode.
enc "$A/Video/Canoe_ocean_16-9.mp4" "$OUT/video/hero-desktop.mp4" 0 10 \
    "scale=1600:900:flags=lanczos,unsharp=5:5:0.55:5:5:0.0" 25

say "hero mobile — Canoe_Ocean-Main 2.0-10.0s (clean window)"
# 17-33s is unusable: lens spray, camera lurch, blown highlights.
enc "$A/Video/Canoe_Ocean-Main.mp4" "$OUT/video/hero-mobile.mp4" 2 8 \
    "scale=720:1280:flags=lanczos" 26

say "coach — IGOR GAVRILEYKO.MOV (client-supplied edit)"
# This one keeps its AUDIO. Every other video on the site is encoded -an
# because it is decorative; this one is the coach speaking and the panel
# carries a sound toggle. 720 wide is 2x the panel's 340 CSS px.
#
# scripts/build-montage.mjs still exists and still works — it built the
# hand-cut montage this replaced. Left in place in case that treatment is
# ever wanted again; its output is no longer shipped.
ffmpeg -y -v error -i "$A/Video/IGOR GAVRILEYKO.MOV"   -c:v libx264 -profile:v high -pix_fmt yuv420p   -vf "scale=720:1280:flags=lanczos" -crf 29 -preset slow   -c:a aac -b:a 96k -ac 2 -movflags +faststart   "$OUT/video/coach.mp4"

say "athlete — Dragonboat team racing"
enc "$A/Video/Dragonboat_canoe.mp4" "$OUT/video/dragonboat.mp4" 12 10 \
    "scale=1024:576:flags=lanczos" 26

say "calm water — Canoe_lake"
enc "$A/Video/Canoe_lake.mp4" "$OUT/video/water-calm.mp4" 13 9 \
    "scale=608:1080:flags=lanczos" 27

say "footer easter egg — canoe dog"
enc "$A/Video/FUN!!!Canoe-Dog.mp4" "$OUT/video/dog.mp4" 0 3.6 \
    "scale=640:360:flags=lanczos" 27

# ---------------------------------------------------------------- posters
# Every poster is pulled from the ENCODED file, not the source, so frame 0 of
# the poster and frame 0 of the video are pixel-identical and there is no flash
# on playback start.
say "posters"
post(){ ffmpeg -y -v error -i "$1" -frames:v 1 -q:v 4 "$2"; }
post "$OUT/video/hero-desktop.mp4" "$OUT/image/hero-desktop-poster.jpg"
post "$OUT/video/hero-mobile.mp4"  "$OUT/image/hero-mobile-poster.jpg"
post "$OUT/video/coach.mp4"        "$OUT/image/coach-poster.jpg"
post "$OUT/video/dragonboat.mp4"   "$OUT/image/dragonboat-poster.jpg"
post "$OUT/video/water-calm.mp4"   "$OUT/image/water-calm-poster.jpg"

# ------------------------------------------------------- before / after
# The featured pair is NOT registered: 1_before is a full-body hallway mirror
# shot (1086x1448), 1_after is a 3/4 studio shot (1088x1445) where the subject
# fills far more of the frame. A wipe slider across un-normalised images reads
# as a glitch, so both are cropped to a common 3:4 head-to-thigh framing and
# emitted at identical dimensions. Only crop and scale — no body retouching.
# Every before/after case — the one genuine pair AND the four composites that
# had to be cut at their seams — is produced by scripts/build-results.mjs.
# It lives apart from this file because the seams are not at 50% and the
# measurements are worth keeping next to the code that uses them.
#
#   node scripts/build-results.mjs

# ---------------------------------------------------------------- logo
# Both logo files are JPEGs on a white ground. colorkey lifts the white so the
# mark can sit on the deep page colour. The gold version is the brand accent
# source; the black version is unusable on a dark page.
#
# The crop is the measured ink bounding box (x 362..945, y 115..678 of the
# 1280x853 source) plus a small margin. The first attempt carried ~38% empty
# padding, so the mark rendered at 62% of its box and read as a gold blur.
say "logo — key out the white ground"
ffmpeg -y -v error -i "$A/Photo/Logo_gold_version.jpg" \
  -vf "colorkey=0xFDFDFD:0.22:0.10,crop=603:583:352:105,scale=480:-1:flags=lanczos" \
  "$OUT/image/logo-gold.png"

# Header variant: the monogram alone. The full lockup is nearly square with
# the wordmark overlapping the mark's lower third, so at a 34px header height
# the name is ~5px tall and the whole lockup reads as a gold smudge. The
# monogram crops cleanly above the wordmark and stays legible; the header
# sets the name in type beside it instead.
#
# Height 375, not 340. The monogram's strokes and the swoosh beneath them run
# to roughly y=400 of the ink box, so cropping at 340 sliced the bottom off the
# letterforms — visible as a clipped mark in the header. 375 keeps the mark
# whole and still clears the "IGOR" cap line, which starts around y=408.
ffmpeg -y -v error -i "$A/Photo/Logo_gold_version.jpg" \
  -vf "colorkey=0xFDFDFD:0.22:0.10,crop=603:375:352:105,scale=430:-1:flags=lanczos" \
  "$OUT/image/logo-mark.png"

say "done"
ls -la "$OUT/video" "$OUT/image"
