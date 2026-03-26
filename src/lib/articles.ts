import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const articlesDirectory = path.join(process.cwd(), "content/articles");

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

function ensureArticlesDir() {
  if (!fs.existsSync(articlesDirectory)) {
    fs.mkdirSync(articlesDirectory, { recursive: true });
  }
}

export function getAllArticles(): Article[] {
  ensureArticlesDir();
  const fileNames = fs.readdirSync(articlesDirectory);
  const articles = fileNames
    .filter((f) => f.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      return getArticleBySlug(slug);
    })
    .filter((a): a is Article => a !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return articles;
}

export function getArticleBySlug(slug: string): Article | null {
  ensureArticlesDir();
  const fullPath = path.join(articlesDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title || "",
    subtitle: data.subtitle || "",
    author: data.author || "Staff Reporter",
    date: data.date || new Date().toISOString(),
    section: data.section || "india",
    tags: data.tags || [],
    image: data.image || "",
    imageCaption: data.imageCaption || "",
    featured: data.featured || false,
    breaking: data.breaking || false,
    content,
    excerpt:
      data.excerpt || content.replace(/[#*_\[\]]/g, "").substring(0, 200) + "...",
  };
}

export async function getArticleHtml(content: string): Promise<string> {
  const result = await remark().use(html).process(content);
  return result.toString();
}

export function getArticlesBySection(section: string): Article[] {
  return getAllArticles().filter(
    (a) => a.section.toLowerCase() === section.toLowerCase()
  );
}

export function getFeaturedArticles(): Article[] {
  return getAllArticles().filter((a) => a.featured);
}

export function getBreakingNews(): Article[] {
  return getAllArticles().filter((a) => a.breaking);
}

export function saveArticle(article: Article): void {
  ensureArticlesDir();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { content, htmlContent: _unused, ...frontmatterData } = article;
  const slug = article.slug || article.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const md = matter.stringify(content, {
    ...frontmatterData,
    slug: undefined,
  } as Record<string, unknown>);

  fs.writeFileSync(path.join(articlesDirectory, `${slug}.md`), md);
}

export function deleteArticle(slug: string): boolean {
  const fullPath = path.join(articlesDirectory, `${slug}.md`);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
    return true;
  }
  return false;
}

export function getAllSections(): string[] {
  const articles = getAllArticles();
  const sections = new Set(articles.map((a) => a.section));
  return Array.from(sections);
}

export function getAllTags(): string[] {
  const articles = getAllArticles();
  const tags = new Set(articles.flatMap((a) => a.tags));
  return Array.from(tags);
}
