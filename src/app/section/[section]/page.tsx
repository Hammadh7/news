import { getArticlesBySection } from "@/lib/articles";
import { siteConfig } from "@/lib/config";
import ArticleCard from "@/components/ArticleCard";
import AdPlaceholder from "@/components/AdPlaceholder";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 60;

interface Props {
  params: { section: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const section = siteConfig.sections.find(
    (s) => s.slug.toLowerCase() === params.section.toLowerCase()
  );
  if (!section) return { title: "Section Not Found" };

  return {
    title: `${section.name} - ${siteConfig.name}`,
    description: `Latest ${section.name} news from ${siteConfig.name}`,
  };
}

export default async function SectionPage({ params }: Props) {
  const section = siteConfig.sections.find(
    (s) => s.slug.toLowerCase() === params.section.toLowerCase()
  );
  if (!section) notFound();

  const articles = await getArticlesBySection(params.section);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-sans text-gray-500 mb-4">
        <Link href="/" className="hover:text-black transition-colors">Home</Link>
        <span>/</span>
        <span className="uppercase tracking-wider">{section.name}</span>
      </div>

      {/* Section header */}
      <div className="border-b-2 border-black mb-8 pb-2">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900">
          {section.name}
        </h1>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 font-sans text-lg">
            No articles in this section yet.
          </p>
          <Link
            href="/"
            className="inline-block mt-4 text-sm font-sans text-gray-600 hover:text-black underline"
          >
            Back to Home
          </Link>
        </div>
      ) : (
        <>
          {/* Hero article */}
          {articles[0] && (
            <div className="mb-8">
              <ArticleCard article={articles[0]} variant="hero" />
            </div>
          )}

          <AdPlaceholder size="banner" />

          {/* Articles grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {articles.slice(1).map((article) => (
              <ArticleCard
                key={article.slug}
                article={article}
                variant="column"
              />
            ))}
          </div>

          {articles.length > 4 && <AdPlaceholder size="inline" />}
        </>
      )}
    </div>
  );
}
