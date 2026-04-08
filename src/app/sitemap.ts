import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/articles";
import { siteConfig } from "@/lib/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getAllArticles();

  const articleUrls: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${siteConfig.url}/article/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const sectionUrls: MetadataRoute.Sitemap = siteConfig.sections
    .filter((s) => s.slug !== "/")
    .map((section) => ({
      url: `${siteConfig.url}/section/${section.slug}`,
      changeFrequency: "hourly",
      priority: 0.7,
    }));

  return [
    {
      url: siteConfig.url,
      changeFrequency: "hourly",
      priority: 1.0,
    },
    ...sectionUrls,
    ...articleUrls,
  ];
}
