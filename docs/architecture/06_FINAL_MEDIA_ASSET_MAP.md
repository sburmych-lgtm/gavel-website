# 06 · FINAL MEDIA ASSET MAP

Every role below was assigned after inspecting the file at full resolution or
through frame grids — not from filenames and not from prior audit descriptions.

Source library is read-only. `scripts/build-media.sh` is the only writer of
`public/media/`.

## Shipped

| Source | Intrinsic | Derivative | Role |
|---|---|---|---|
| `Video/Canoe_ocean_16-9.mp4` | 1280×720 h264 10.0s | `hero-desktop.mp4` 1600×900, 3.7 MB | Desktop hero, full-bleed loop |
| `Video/Canoe_Ocean-Main.mp4` | 720×1280 h264 50.5s | `hero-mobile.mp4` 720×1280 8s, 1.5 MB | Mobile hero, window 2.0–10.0s |
| `Video/Self_Presentation.MOV` | 2160×3840 hevc 48.4s | 6 of 11 shots in `coach-montage.mp4` | Coach montage — see below |
| `Video/SelfTrainFitness_new1.MOV` | 1080×1920 hevc 46.1s | 1 shot | cable crossover |
| `Video/SelfTrainFitness_new2.MOV` | 2160×3840 hevc 33.6s | 1 shot | machine work |
| `Video/Biceps_mirror.mp4` | 720×1280 h264 13.8s | 1 shot | window-light curl |
| `Video/Fitness_traine_girl.mp4` | 720×1280 h264 14.0s | 1 shot | coaching a client — **released by the client 15.08.2026** |
| `Video/Dragonboat_canoe.mp4` | 1024×576 h264 31.8s | `dragonboat.mp4` 10s, 3.4 MB | Athlete story — real team racing |
| `Video/Canoe_lake.mp4` | 610×1084 h264 25.5s | `water-calm.mp4` 608×1080 9s, 2.4 MB | Contact section, calm closing water |
| `Video/FUN!!!Canoe-Dog.mp4` | 1280×720 h264 3.7s | `dog.mp4` 640×360, 237 KB | Footer easter egg |
| `Photo/On_Beach.JPG` | 1122×1402 | via `astro:assets` | Coach portrait — the strongest asset in the project |
| `Photo/In_Gym.JPG` | 1122×1402 | via `astro:assets` | Formats section; OG image source |
| `Photo/Canoe2.JPG` | 1122×1402 | via `astro:assets` | Athlete story lead — mid-stroke, frozen spray |
| `Photo/Canoe1.JPG` | 928×1152 | via `astro:assets` | Athlete story secondary |
| `Photo/Champion.jpg` | 1055×1406 | via `astro:assets` | Credentials, framed as a document |
| `Photo/Certificates.jpg` | 1280×721 | via `astro:assets` | Credentials thumbnail |
| `Photo/Logo_gold_version.jpg` | 1280×853 | `logo-gold.png` 470×300 rgba | Brand mark, header and footer |
| `before-after/Real Photos/1_before.png` | 1086×1448 | `result-1-before.jpg` 900×1200 | **Featured slider, before** |
| `before-after/Real Photos/1_after.png` | 1088×1445 | `result-1-after.jpg` 900×1200 | **Featured slider, after** |
| `2_before-after.jpg` | 2560×2064 | `result-2.jpg` w1100 | Supporting proof |
| `3_before-after.jpg` | 1280×780 | `result-3.jpg` w1100 | Supporting proof — has burnt-in ДО/ПІСЛЯ, so UI labels are suppressed on this card |
| `4_before-after.jpg` | 1811×2160 | `result-4.jpg` w1000 | Supporting proof — strongest visible change |
| `6_before-after.JPG` | 768×1280 | `result-6.jpg` w760 | Supporting proof — most disciplined comparison |

### The Coach montage

`coach-montage.mp4` — 810×1440, 18.9s, 4.4 MB, silent, looping. Eleven shots
from six real sources, crossfaded at 0.4s, each colour-corrected into one
look. Built by `scripts/build-montage.mjs`, run separately from
`build-media.sh` because it decodes several 4K HEVC spans.

Frame 0 is also the poster, and that fixed the shot order: an earlier cut
opened on the lake and left «Хто я» represented by a photograph of water. It
now opens on the one clean full-face standing moment in the source, at 11.7s,
after the burnt-in captions end.

810 wide is still 1.2× the panel's 340 CSS px at 2× DPR; 1080×1920 looked
identical in the frame and cost 7.8 MB against 4.4.

### Hero encoding note

The landscape source is 1280×720. Rather than let the browser bilinear-scale it
across a 2560px viewport, it is resampled once to 1600×900 with Lanczos and a
light unsharp pass. 1600 is the point where the sharpening gain stops paying for
the byte cost. A dark gradient scrim covers the remaining softness.

Prior audits forbade a full-bleed hero on the arithmetic that the *vertical*
source upscales 2×. That arithmetic is right and no longer applies — this is a
different, natively landscape file that did not exist when they were written.

### Before/After registration

The featured pair is not camera-registered: different rooms, different framing,
subject at different scale. A wipe across un-normalised images reads as a
glitch. Landmarks were measured in both sources and the pair re-cropped so the
shoulder line and waistband sit at a common canvas Y.

```
           source       shoulders  waistband  torso  scale  cropY  cropX
before   1086×1448         206        630      424   1.321    15    165
after    1088×1445         490       1044      554   1.011   241     99
shared canvas 900×1200, waistband pinned to y=812
```

Crop and scale only — no body retouching, ever. Verified by rendering a 50%
wipe and checking seam continuity.

Faces in both files **are** blurred. The prior audits' claim that they are not
is stale; it referred to superseded `blurface`/`blureface` files that no longer
exist.

## Held — needs a human decision

_None._ `Fitness_traine_girl.mp4` was released by the client on 15.08.2026 and
now appears in the Coach montage.

## Rejected, with reason

| Source | Reason |
|---|---|
| `Photo/SelfPhoto/*` (76 files) | One redundant session, 853×1280. `In_Gym.JPG` is already its best frame at higher resolution. Shipping near-duplicates would build exactly the generic card grid the brief warns against. |
| `SelfTrainFitness_old.mp4` | Amateur, low quality; superseded by new1/new2 in the montage. |
| `Athletic_coach_paddling_water_*.mp4` | AI-generated. Offered for the montage by the client but not used — `Canoe_lake.mp4` covers the same water beat with real footage. One line to add if wanted. |
| `Coach_training_client_in_gym_*.mp4` | AI-generated. |
| `Animation_1/Warrior_striking_logo_*.mp4`, `Animation_1/1–5.png` | Poseidon and trident mythology — banned outright by the brief. |
| `Animation_1/Antigravity_Final/*` | Splash intros. Banned. Noted for the record: `Intro_Final.mp4` carries the title card «Сила, викована веслом.», the direct ancestor of the mandated H1 — useful provenance, unusable asset. |
| `before-after/Архів/Грок/*` (20 files) | AI-generated fake clients. Never on a public URL. |
| `5_before.JPG` / `5_after.JPG` | 391×437 and 315×360. Too small to render honestly at any useful size. |
| `Photo/Logo.jpg` | Black-on-white variant; unusable on a dark page. The gold variant is the brand asset. |

## Delivery rules

- Photographs go through `astro:assets`, which emits AVIF and WebP with a JPEG
  fallback, `srcset`/`sizes`, and intrinsic `width`/`height` on every tag.
- Below-fold media is `loading="lazy"` and `preload="none"`.
- The hero poster carries `fetchpriority="high"` and is the LCP candidate. **The
  LCP element is never a video frame.**
- No video ships with an audio track — every derivative is encoded `-an`.
- The 105 MB HEVC source is never served under any circumstance.
- Every image has factual Ukrainian alt text describing what is actually in the
  frame. Decorative media is `aria-hidden` and out of the tab order.
