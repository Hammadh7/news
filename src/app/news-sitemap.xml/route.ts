import { getAllArticles } from "@/lib/articles";
import { siteConfig } from "@/lib/config";

export const revalidate = 60;

export async function GET() {
  const articles = await getAllArticles();

  // Google News sitemap only includes articles from the last 2 days
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  const recentArticles = articles.filter(
    (a) => new Date(a.date) >= twoDaysAgo
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${recentArticles
  .map(
    (article) => `  <url>
    <loc>${siteConfig.url}/article/${article.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>${siteConfig.name}</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${new Date(article.date).toISOString()}</news:publication_date>
      <news:title>${escapeXml(article.title)}</news:title>
    </news:news>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=60, s-maxage=60",
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
