/**
 * Every asset the site uses, mapped to its role and its alt text in one place.
 * Swapping an asset is a one-line change here — never an edit inside a section.
 *
 * Photographs are imported so astro:assets can emit AVIF/WebP with srcset and
 * intrinsic dimensions. Videos live in public/ because they are streamed, not
 * transformed, and are produced by scripts/build-media.sh.
 *
 * Alt text is factual Ukrainian describing what is actually in the frame, not
 * a keyword string.
 */

import onBeach from "../assets/photo/On_Beach.JPG";
import inGym from "../assets/photo/In_Gym.JPG";
import canoe1 from "../assets/photo/Canoe1.JPG";
import canoe2 from "../assets/photo/Canoe2.JPG";
import champion from "../assets/photo/Champion.jpg";
import certificates from "../assets/photo/Certificates.jpg";

export const photos = {
  onBeach: {
    src: onBeach,
    alt: "Ігор Гаврилейко стоїть біля кромки води з веслом для каное в руці",
  },
  inGym: {
    src: inGym,
    alt: "Ігор Гаврилейко усміхається в тренажерному залі фітнес-центру «Пляж»",
  },
  canoe1: {
    src: canoe1,
    alt: "Ігор Гаврилейко веслує в гоночному каное на озері",
  },
  canoe2: {
    src: canoe2,
    alt: "Ігор Гаврилейко у гоночному каное під час гребка, бризки води в повітрі",
  },
  champion: {
    src: champion,
    alt: "Ігор Гаврилейко з медаллю чемпіонату України з веслування на човнах Dragonboat",
  },
  certificates: {
    src: certificates,
    alt: "Сертифікати та дипломи про професійну підготовку",
  },
} as const;

export const videos = {
  heroDesktop: {
    src: "/media/video/hero-desktop.mp4",
    poster: "/media/image/hero-desktop-poster.jpg",
    width: 1600,
    height: 900,
  },
  heroMobile: {
    src: "/media/video/hero-mobile.mp4",
    poster: "/media/image/hero-mobile-poster.jpg",
    width: 720,
    height: 1280,
  },
  /* The client's own finished edit. The only video on the site with an audio
     track, which is why this panel carries a sound toggle instead of a pause
     button. It still autoplays muted — browsers allow nothing else. */
  coach: {
    src: "/media/video/coach.mp4",
    poster: "/media/image/coach-poster.jpg",
    width: 720,
    height: 1280,
    label: "Ігор Гаврилейко — тренування в залі та на воді",
    hasAudio: true,
  },
  dragonboat: {
    src: "/media/video/dragonboat.mp4",
    poster: "/media/image/dragonboat-poster.jpg",
    width: 1024,
    height: 576,
    label: "Команда веслує на човні Dragonboat",
  },
  waterCalm: {
    src: "/media/video/water-calm.mp4",
    poster: "/media/image/water-calm-poster.jpg",
    width: 608,
    height: 1080,
    label: "Спокійна вода озера з носа каное",
  },
  dog: {
    src: "/media/video/dog.mp4",
    width: 640,
    height: 360,
    label: "Пес у каное",
  },
} as const;

/* Every case is a real before/after pair.
   Case 1 came as two separate files and was registered by measured landmarks.
   Cases 4, 2, 6 and 3 arrived as two-up composites and were cut at their
   seams — which are NOT at 50%; see scripts/build-results.mjs. Halves within
   a case share identical dimensions, otherwise the wipe tears at the seam.

   `ratio` drives the frame's aspect per case so nothing is letterboxed: the
   archive shots are far taller than the studio pair. */
export const resultsCases = [
  {
    id: 1,
    before: "/media/image/result-1-before.jpg",
    after: "/media/image/result-1-after.jpg",
    thumb: "/media/image/result-1-thumb.jpg",
    w: 900, h: 1200, ratio: 0.75,
    title: "Набір форми",
    sub: "Обличчя приховано на прохання клієнта.",
    alt: "Порівняння до і після: клієнт, фронтальна стійка, обличчя розмите",
    bakedLabels: false,
  },
  {
    id: 4,
    before: "/media/image/result-4-before.jpg",
    after: "/media/image/result-4-after.jpg",
    thumb: "/media/image/result-4-thumb.jpg",
    w: 994, h: 2160, ratio: 0.4602,
    title: "Мінус живіт",
    sub: "Архів тренера, побутова зйомка. Профіль.",
    alt: "Порівняння до і після: клієнт у профіль",
    bakedLabels: false,
  },
  {
    id: 2,
    before: "/media/image/result-2-before.jpg",
    after: "/media/image/result-2-after.jpg",
    thumb: "/media/image/result-2-thumb.jpg",
    w: 1416, h: 2064, ratio: 0.686,
    title: "Спина і постава",
    sub: "Архів тренера, побутова зйомка. Вид зі спини.",
    alt: "Порівняння до і після: клієнт, вид зі спини",
    bakedLabels: false,
  },
  {
    id: 6,
    before: "/media/image/result-6-before.jpg",
    after: "/media/image/result-6-after.jpg",
    thumb: "/media/image/result-6-thumb.jpg",
    w: 378, h: 934, ratio: 0.4047,
    title: "Схуднення й тонус",
    sub: "Той самий ракурс і те саме світло.",
    alt: "Порівняння до і після: клієнтка, вид зі спини",
    bakedLabels: false,
  },
  {
    /* This one carries its own ДО/ПІСЛЯ type burnt into the photograph, so
       the DOM labels are suppressed on it rather than doubling up. */
    id: 3,
    before: "/media/image/result-3-before.jpg",
    after: "/media/image/result-3-after.jpg",
    thumb: "/media/image/result-3-thumb.jpg",
    w: 678, h: 780, ratio: 0.8692,
    title: "Суха вага",
    sub: "Архів тренера. Підписи — на оригіналі знімка.",
    alt: "Порівняння до і після: клієнт, знімок у дзеркалі",
    bakedLabels: true,
  },
] as const;

export const logo = {
  /* Full lockup — legible from roughly 56px up. Footer. */
  full: {
    src: "/media/image/logo-gold.png",
    width: 480,
    height: 464,
    alt: "IGOR GAVRILEYKO",
  },
  /* Monogram alone. The header sets the name in type beside it, because the
     lockup's wordmark is only ~5px tall at header size and the whole thing
     reads as a gold smudge. */
  mark: {
    src: "/media/image/logo-mark.png",
    width: 430,
    height: 267,
    alt: "",
  },
} as const;
