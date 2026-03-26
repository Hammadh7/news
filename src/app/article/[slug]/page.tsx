import { getArticleBySlug, getArticleHtml, getArticlesBySection } from "@/lib/articles";
import { siteConfig } from "@/lib/config";
import ArticleCard from "@/components/ArticleCard";
import AdPlaceholder from "@/components/AdPlaceholder";
import ShareButtons from "@/components/ShareButtons";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticleBySlug(params.slug);
  if (!article) return { title: "Article Not Found" };

  return {
    title: `${article.title} - ${siteConfig.name}`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.date,
      authors: [article.author],
      images: article.image ? [article.image] : [],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const article = getArticleBySlug(params.slug);
  if (!article) notFound();

  const htmlContent = await getArticleHtml(article.content);
  const relatedArticles = getArticlesBySection(article.section)
    .filter((a) => a.slug !== article.slug)
    .slice(0, 4);

  const articleUrl = `${siteConfig.url}/article/${article.slug}`;
  const formattedDate = new Date(article.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main article content */}
        <article className="lg:col-span-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-sans text-gray-500 mb-4">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
            <span>/</span>
            <Link
              href={`/section/${article.section}`}
              className="hover:text-black transition-colors uppercase tracking-wider"
            >
              {article.section}
            </Link>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-3">
            {article.title}
          </h1>

          {article.subtitle && (
            <p className="text-lg md:text-xl text-gray-600 font-sans leading-relaxed mb-4">
              {article.subtitle}
            </p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 py-4 border-t border-b border-gray-200 mb-6">
            <div className="font-sans">
              <span className="text-sm font-medium text-gray-900">
                {article.author}
              </span>
              <span className="block text-xs text-gray-500">{formattedDate}</span>
            </div>
            <div className="ml-auto">
              <ShareButtons url={articleUrl} title={article.title} />
            </div>
          </div>

          {/* Hero image */}
          {article.image && (
            <figure className="mb-8">
              <img
                src={article.image}
                alt={article.imageCaption || article.title}
                className="w-full aspect-[16/9] object-cover"
              />
              {article.imageCaption && (
                <figcaption className="text-xs text-gray-500 font-sans mt-2 italic">
                  {article.imageCaption}
                </figcaption>
              )}
            </figure>
          )}

          {/* Article body */}
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-sans uppercase tracking-wider"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Bottom share */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <ShareButtons url={articleUrl} title={article.title} />
          </div>
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-4">
          <AdPlaceholder size="sidebar" />

          {relatedArticles.length > 0 && (
            <div className="mt-8">
              <h3 className="font-serif text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-black">
                Related Stories
              </h3>
              <div className="space-y-1">
                {relatedArticles.map((a) => (
                  <div key={a.slug} className="border-b border-gray-100">
                    <ArticleCard article={a} variant="compact" />
                  </div>
                ))}
              </div>
            </div>
          )}

          <AdPlaceholder size="sidebar" />
        </aside>
      </div>
    </div>
  );
}
