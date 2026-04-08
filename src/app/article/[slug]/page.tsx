import { getArticleBySlug, getArticleHtml, getArticlesBySection } from "@/lib/articles";
import { siteConfig } from "@/lib/config";
import ArticleCard from "@/components/ArticleCard";
import AdPlaceholder from "@/components/AdPlaceholder";
import ShareButtons from "@/components/ShareButtons";
import TranslatableArticle from "@/components/TranslatableArticle";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 60;

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  if (!article) return { title: "Article Not Found" };

  const articleUrl = `${siteConfig.url}/article/${article.slug}`;

  return {
    title: article.title,
    description: article.excerpt,
    alternates: {
      canonical: articleUrl,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.date,
      authors: [article.author],
      section: article.section,
      tags: article.tags,
      url: articleUrl,
      siteName: siteConfig.name,
      images: article.image ? [{ url: article.image.startsWith("/") ? `${siteConfig.url}${article.image}` : article.image, alt: article.imageCaption || article.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: article.image ? [article.image.startsWith("/") ? `${siteConfig.url}${article.image}` : article.image] : [],
    },
    keywords: article.tags,
  };
}

export default async function ArticlePage({ params }: Props) {
  const article = await getArticleBySlug(params.slug);
  if (!article) notFound();

  const htmlContent = await getArticleHtml(article.content);
  const relatedArticles = (await getArticlesBySection(article.section))
    .filter((a) => a.slug !== article.slug)
    .slice(0, 4);

  const articleUrl = `${siteConfig.url}/article/${article.slug}`;
  const formattedDate = new Date(article.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: article.image ? [article.image.startsWith("/") ? `${siteConfig.url}${article.image}` : article.image] : [],
    datePublished: article.date,
    dateModified: article.date,
    author: {
      "@type": "Person",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    articleSection: article.section,
    keywords: article.tags.join(", "),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteConfig.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: article.section,
        item: `${siteConfig.url}/section/${article.section}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
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

          <TranslatableArticle
            title={article.title}
            subtitle={article.subtitle}
            htmlContent={htmlContent}
            rawContent={article.content}
          >
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
          </TranslatableArticle>

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
