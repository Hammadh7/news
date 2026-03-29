import { list, put, del } from "@vercel/blob";
import { remark } from "remark";
import html from "remark-html";

export interface Article {
  slug: string;
  title: string;
  subtitle: string;
  author: string;
  date: string;
  section: string;
  tags: string[];
  image: string;
  imageCaption: string;
  featured: boolean;
  breaking: boolean;
  content: string;
  htmlContent?: string;
  excerpt: string;
}

const ARTICLES_PREFIX = "articles/";

function articleToJson(article: Article): string {
  return JSON.stringify(article);
}

function jsonToArticle(json: string): Article {
  return JSON.parse(json);
}

export async function getAllArticles(): Promise<Article[]> {
  try {
    const { blobs } = await list({ prefix: ARTICLES_PREFIX });
    if (blobs.length === 0) return [];

    const articles: Article[] = [];
    for (const blob of blobs) {
      try {
        const res = await fetch(blob.url);
        const text = await res.text();
        const article = jsonToArticle(text);
        articles.push(article);
      } catch {
        // skip corrupted blobs
      }
    }

    return articles.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch {
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const { blobs } = await list({ prefix: `${ARTICLES_PREFIX}${slug}.json` });
    if (blobs.length === 0) return null;

    const res = await fetch(blobs[0].url);
    const text = await res.text();
    return jsonToArticle(text);
  } catch {
    return null;
  }
}

export async function getArticleHtml(content: string): Promise<string> {
  const result = await remark().use(html).process(content);
  return result.toString();
}

export async function getArticlesBySection(section: string): Promise<Article[]> {
  const all = await getAllArticles();
  return all.filter((a) => a.section.toLowerCase() === section.toLowerCase());
}

export async function getFeaturedArticles(): Promise<Article[]> {
  const all = await getAllArticles();
  return all.filter((a) => a.featured);
}

export async function getBreakingNews(): Promise<Article[]> {
  const all = await getAllArticles();
  return all.filter((a) => a.breaking);
}

export async function saveArticle(article: Article): Promise<void> {
  const slug =
    article.slug ||
    article.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .substring(0, 100)
      .replace(/-$/, "");

  const data: Article = {
    ...article,
    slug,
    excerpt:
      article.excerpt ||
      article.content.replace(/[#*_\[\]]/g, "").substring(0, 200) + "...",
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (data as any).htmlContent;

  await put(`${ARTICLES_PREFIX}${slug}.json`, articleToJson(data), {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/json",
  });
}

export async function deleteArticle(slug: string): Promise<boolean> {
  try {
    const { blobs } = await list({ prefix: `${ARTICLES_PREFIX}${slug}.json` });
    if (blobs.length === 0) return false;

    await del(blobs[0].url);
    return true;
  } catch {
    return false;
  }
}
