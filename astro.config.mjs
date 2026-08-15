// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

/**
 * Static output is the whole SEO foundation — every page is complete HTML in
 * the initial response, so Googlebot, Google's AI surfaces, OAI-SearchBot and
 * Claude-SearchBot all get the real content without executing anything.
 *
 * SITE_URL is the one value that changes when a real domain exists. It drives
 * the canonical URL, the sitemap host and the absolute OG image URL.
 * INDEXABLE gates the robots meta tag — the preview must never be indexed
 * ahead of the production domain.
 */
/* The fallback must be a host that actually resolves. It previously omitted
   the `-production` segment, so the canonical, og:url, og:image, the sitemap
   and all nine JSON-LD @id values pointed at a 404 — which breaks social
   previews today and would prevent indexing outright on launch. */
const SITE_URL =
  process.env.SITE_URL ??
  "https://igor-gavrileyko-final-claude-production.up.railway.app";

export default defineConfig({
  site: SITE_URL,
  output: "static",
  integrations: [sitemap()],
  build: { inlineStylesheets: "auto" },
  image: {
    // AVIF and WebP with a JPEG fallback, generated at build time by sharp.
    responsiveStyles: true,
  },
});
