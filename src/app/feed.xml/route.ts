import { getAllArticles } from "@/lib/articles";
import { siteConfig } from "@/lib/config";

export const revalidate = 60;

export async function GET() {
  const articles = await getAllArticles();
  const recentArticles = articles.slice(0, 20);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <link>${siteConfig.url}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en-in</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteConfig.url}/feed.xml" rel="self" type="application/rss+xml"/>
${recentArticles
  .map(
    (article) => `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${siteConfig.url}/article/${article.slug}</link>
      <guid isPermaLink="true">${siteConfig.url}/article/${article.slug}</guid>
      <description>${escapeXml(article.excerpt)}</description>
      <author>${escapeXml(article.author)}</author>
      <category>${escapeXml(article.section)}</category>
      <pubDate>${new Date(article.date).toUTCString()}</pubDate>
    </item>`
  )
  .join("\n")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml",
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
