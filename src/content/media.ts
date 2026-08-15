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
  /* An edited montage, not a raw clip — eleven shots cut from six real
     sources, crossfaded and graded to one look. Built by
     scripts/build-montage.mjs; silent and looping. */
  coach: {
    src: "/media/video/coach-montage.mp4",
    poster: "/media/image/coach-montage-poster.jpg",
    width: 810,
    height: 1440,
    label: "Тренування у залі та на воді",
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

/* The featured pair is registered — shoulder line and waistband pinned to a
   common canvas Y by scripts/build-media.sh. Both faces are blurred in the
   source files. */
export const resultsMedia = {
  featured: {
    before: "/media/image/result-1-before.jpg",
    after: "/media/image/result-1-after.jpg",
    width: 900,
    height: 1200,
    altBefore: "Клієнт до початку роботи, обличчя розмите",
    altAfter: "Той самий клієнт після курсу тренувань, обличчя розмите",
  },
  supporting: [
    {
      src: "/media/image/result-4.jpg",
      alt: "Порівняння до і після: чоловік, вигляд збоку",
      hasBakedLabels: false,
    },
    {
      src: "/media/image/result-2.jpg",
      alt: "Порівняння до і після: чоловік, вигляд зі спини",
      hasBakedLabels: false,
    },
    {
      src: "/media/image/result-6.jpg",
      alt: "Порівняння до і після: клієнтка, вигляд зі спини",
      hasBakedLabels: false,
    },
    {
      /* This file already carries burnt-in ДО/ПІСЛЯ type, so the UI labels
         are suppressed on its card to avoid doubling them. */
      src: "/media/image/result-3.jpg",
      alt: "Порівняння до і після: чоловік, знімок у дзеркалі",
      hasBakedLabels: true,
    },
  ],
} as const;

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
    width: 360,
    height: 203,
    alt: "",
  },
} as const;
