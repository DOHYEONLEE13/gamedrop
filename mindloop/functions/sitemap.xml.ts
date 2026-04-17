// Cloudflare Pages Function — dynamic sitemap.xml
// Serves /sitemap.xml with all static routes + every live game (/games/:slug)
// Env vars (optional): SUPABASE_URL, SUPABASE_ANON_KEY (falls back to hardcoded public values)

interface Env {
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
}

const BASE_URL = "https://gamedrop.win";
const FALLBACK_URL = "https://kpgniyvwcqliixslzcam.supabase.co";
const FALLBACK_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwZ25peXZ3Y3FsaWl4c2x6Y2FtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0OTIyMzcsImV4cCI6MjA5MTA2ODIzN30.ryLaiy6r-FsI17wKOMICMhrVFCPnViH2ShSeDX3Yqy8";

interface GameRow {
  slug: string;
  created_at: string;
}

// Static routes (priority/changefreq tuned for intent)
const STATIC_ROUTES: Array<{ path: string; changefreq: string; priority: string }> = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/shorts", changefreq: "daily", priority: "0.9" },
  { path: "/games", changefreq: "daily", priority: "0.9" },
  { path: "/search", changefreq: "weekly", priority: "0.7" },
  { path: "/upload", changefreq: "monthly", priority: "0.6" },
  { path: "/about", changefreq: "monthly", priority: "0.4" },
  { path: "/privacy", changefreq: "yearly", priority: "0.2" },
  { path: "/terms", changefreq: "yearly", priority: "0.2" },
  { path: "/contact", changefreq: "yearly", priority: "0.3" },
];

function escapeXml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function fetchLiveGames(env: Env): Promise<GameRow[]> {
  const supabaseUrl = env.SUPABASE_URL || FALLBACK_URL;
  const anonKey = env.SUPABASE_ANON_KEY || FALLBACK_ANON_KEY;
  // Order by created_at desc, only live rows with slug
  const url = `${supabaseUrl}/rest/v1/games?select=slug,created_at&status=eq.live&order=created_at.desc&limit=5000`;
  try {
    const res = await fetch(url, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        Accept: "application/json",
      },
      // Cloudflare edge caching (5 min) so we don't hammer Supabase on every crawl
      cf: { cacheTtl: 300, cacheEverything: true },
    } as RequestInit);
    if (!res.ok) return [];
    const rows = (await res.json()) as GameRow[];
    return rows.filter((r) => r && typeof r.slug === "string" && r.slug.length > 0);
  } catch {
    return [];
  }
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const games = await fetchLiveGames(env);

  const urls: string[] = [];

  for (const route of STATIC_ROUTES) {
    urls.push(
      `  <url>\n    <loc>${BASE_URL}${route.path}</loc>\n    <changefreq>${route.changefreq}</changefreq>\n    <priority>${route.priority}</priority>\n  </url>`
    );
  }

  for (const game of games) {
    const lastmod = new Date(game.created_at).toISOString().split("T")[0];
    const slug = escapeXml(game.slug);
    urls.push(
      `  <url>\n    <loc>${BASE_URL}/games/${slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`
    );
  }

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      // Serve stale-while-revalidate: CDN caches 10 min, browser 5 min
      "Cache-Control": "public, max-age=300, s-maxage=600, stale-while-revalidate=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
};
