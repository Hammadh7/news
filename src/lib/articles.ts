import { getDb } from "./db";
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

function rowToArticle(row: Record<string, unknown>): Article {
  return {
    slug: row.slug as string,
    title: row.title as string,
    subtitle: row.subtitle as string,
    author: row.author as string,
    date:
      row.date instanceof Date
        ? row.date.toISOString()
        : String(row.date),
    section: row.section as string,
    tags: (row.tags as string[]) || [],
    image: row.image as string,
    imageCaption: (row.image_caption as string) || "",
    featured: row.featured as boolean,
    breaking: row.breaking as boolean,
    content: row.content as string,
    excerpt: row.excerpt as string,
  };
}

export async function getAllArticles(): Promise<Article[]> {
  try {
    const sql = getDb();
    const rows = await sql`SELECT * FROM articles ORDER BY date DESC`;
    return rows.map(rowToArticle);
  } catch {
    return [];
  }
}

export async function getArticleBySlug(
  slug: string
): Promise<Article | null> {
  try {
    const sql = getDb();
    const rows = await sql`SELECT * FROM articles WHERE slug = ${slug}`;
    return rows.length > 0 ? rowToArticle(rows[0]) : null;
  } catch {
    return null;
  }
}

export async function getArticleHtml(content: string): Promise<string> {
  const result = await remark().use(html).process(content);
  return result.toString();
}

export async function getArticlesBySection(
  section: string
): Promise<Article[]> {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT * FROM articles
      WHERE LOWER(section) = LOWER(${section})
      ORDER BY date DESC
    `;
    return rows.map(rowToArticle);
  } catch {
    return [];
  }
}

export async function getFeaturedArticles(): Promise<Article[]> {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT * FROM articles WHERE featured = TRUE ORDER BY date DESC
    `;
    return rows.map(rowToArticle);
  } catch {
    return [];
  }
}

export async function getBreakingNews(): Promise<Article[]> {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT * FROM articles WHERE breaking = TRUE ORDER BY date DESC
    `;
    return rows.map(rowToArticle);
  } catch {
    return [];
  }
}

export function generateSlug(title: string, section?: string): string {
  let slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .substring(0, 80)
    .replace(/-$/, "");

  if (!slug || slug.length < 3) {
    const date = new Date();
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const id = Math.random().toString(36).substring(2, 8);
    const prefix = section || "article";
    slug = `${prefix}-${dateStr}-${id}`;
  }

  return slug;
}

export async function saveArticle(article: Article): Promise<void> {
  const slug = article.slug || generateSlug(article.title, article.section);
  const excerpt =
    article.excerpt ||
    article.content.replace(/[#*_\[\]]/g, "").substring(0, 200) + "...";

  const sql = getDb();
  await sql`
    INSERT INTO articles (slug, title, subtitle, author, date, section, tags,
                          image, image_caption, featured, breaking, content, excerpt)
    VALUES (${slug}, ${article.title}, ${article.subtitle || ""}, ${article.author},
            ${article.date}, ${article.section}, ${article.tags || []},
            ${article.image || ""}, ${article.imageCaption || ""},
            ${article.featured || false}, ${article.breaking || false},
            ${article.content}, ${excerpt})
    ON CONFLICT (slug) DO UPDATE SET
      title = EXCLUDED.title,
      subtitle = EXCLUDED.subtitle,
      author = EXCLUDED.author,
      section = EXCLUDED.section,
      tags = EXCLUDED.tags,
      image = EXCLUDED.image,
      image_caption = EXCLUDED.image_caption,
      featured = EXCLUDED.featured,
      breaking = EXCLUDED.breaking,
      content = EXCLUDED.content,
      excerpt = EXCLUDED.excerpt
  `;
}

export async function deleteArticle(slug: string): Promise<boolean> {
  try {
    const sql = getDb();
    const result = await sql`DELETE FROM articles WHERE slug = ${slug}`;
    return (result as unknown[]).length >= 0;
  } catch {
    return false;
  }
}
