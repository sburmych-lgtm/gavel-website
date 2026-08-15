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

# The Coach panel is now an edited montage, not a single clip — see
# scripts/build-montage.mjs, which is run separately because it decodes
# several 4K HEVC spans and takes minutes.

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
post "$OUT/video/dragonboat.mp4"   "$OUT/image/dragonboat-poster.jpg"
post "$OUT/video/water-calm.mp4"   "$OUT/image/water-calm-poster.jpg"

# ------------------------------------------------------- before / after
# The featured pair is NOT registered: 1_before is a full-body hallway mirror
# shot (1086x1448), 1_after is a 3/4 studio shot (1088x1445) where the subject
# fills far more of the frame. A wipe slider across un-normalised images reads
# as a glitch, so both are cropped to a common 3:4 head-to-thigh framing and
# emitted at identical dimensions. Only crop and scale — no body retouching.
say "before/after — normalise the featured pair to a shared frame"
BA="$A/before-after/Real Photos"
# Registration is computed from two landmarks measured in each source: the
# shoulder line and the waistband. Equalising the shoulder-to-waist distance
# normalises camera distance, and pinning the waistband to a common canvas Y
# makes the wipe seam continuous. Residual silhouette width difference is real
# (arms down vs. hands on hips) and is left alone.
#
#            source        shoulders  waistband  torso  scale  cropY  cropX
#   before   1086x1448        206        630      424   1.321    15    165
#   after    1088x1445        490       1044      554   1.011   241     99
#   shared canvas 900x1200, waistband pinned to y=812
ffmpeg -y -v error -i "$BA/1_before.png" \
  -vf "crop=681:908:165:15,scale=900:1200:flags=lanczos" -q:v 3 \
  "$OUT/image/result-1-before.jpg"
ffmpeg -y -v error -i "$BA/1_after.png" \
  -vf "crop=890:1187:99:241,scale=900:1200:flags=lanczos" -q:v 3 \
  "$OUT/image/result-1-after.jpg"

say "before/after — supporting composites"
sup(){ ffmpeg -y -v error -i "$1" -vf "scale=$2:-2:flags=lanczos" -q:v 4 "$3"; }
sup "$BA/2_before-after.jpg" 1100 "$OUT/image/result-2.jpg"
sup "$BA/3_before-after.jpg" 1100 "$OUT/image/result-3.jpg"
sup "$BA/4_before-after.jpg" 1000 "$OUT/image/result-4.jpg"
# 6_before-after carries baked white bands top and bottom (measured: the
# content occupies rows 173..1106 of 1280). Cropped so the card is not
# mostly padding.
ffmpeg -y -v error -i "$BA/6_before-after.JPG" \
  -vf "crop=768:934:0:173,scale=760:-2:flags=lanczos" -q:v 4 "$OUT/image/result-6.jpg"

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
ffmpeg -y -v error -i "$A/Photo/Logo_gold_version.jpg" \
  -vf "colorkey=0xFDFDFD:0.22:0.10,crop=603:340:352:105,scale=360:-1:flags=lanczos" \
  "$OUT/image/logo-mark.png"

say "done"
ls -la "$OUT/video" "$OUT/image"
