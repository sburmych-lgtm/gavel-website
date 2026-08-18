// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { loadEnv } from "vite";

/**
 * Static output is the whole SEO foundation — every page is complete HTML in
 * the initial response, so Googlebot, Google's AI surfaces, OAI-SearchBot and
 * Claude-SearchBot all get the real content without executing anything.
 *
 * SITE_URL drives the canonical URL, the sitemap host and the absolute OG
 * image URL. Production default is the intended custom domain.
 * INDEXABLE gates the robots meta tag — production builds set it true.
 */
const env = loadEnv("production", process.cwd(), "");
const SITE_URL =
  process.env.SITE_URL ?? env.SITE_URL ?? "https://igor-gavrileyko.com";
const INDEXABLE = process.env.INDEXABLE ?? env.INDEXABLE ?? "true";

export default defineConfig({
  site: SITE_URL,
  output: "static",
  integrations: [sitemap()],
  build: { inlineStylesheets: "auto" },
  vite: {
    define: {
      "import.meta.env.INDEXABLE": JSON.stringify(INDEXABLE),
    },
  },
  image: {
    // AVIF and WebP with a JPEG fallback, generated at build time by sharp.
    responsiveStyles: true,
  },
});
