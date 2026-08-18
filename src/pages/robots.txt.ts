import type { APIRoute } from "astro";

function robotsTxt(sitemapUrl: string) {
  return `# Search visibility and model-training permission are different decisions.
# This file only settles the first one.

User-agent: *
Allow: /

# --- search indexing and user-directed retrieval: allowed ---

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: PerplexityBot
Allow: /

# --- model-training crawlers are deliberately left unlisted: GPTBot,
#     ClaudeBot, CCBot, and Google-Extended (which is Google's AI training and
#     grounding control, NOT its search crawler — Googlebot above is what
#     governs search). Allowing or blocking model training is the site owner's
#     call, not a default anyone else should make on their behalf.

Sitemap: ${sitemapUrl}
`;
}

export const GET: APIRoute = ({ site }) => {
  const sitemapUrl = new URL("sitemap-index.xml", site ?? "https://igor-gavrileyko.com/").href;
  return new Response(robotsTxt(sitemapUrl), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
