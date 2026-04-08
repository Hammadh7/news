import { getAllArticles } from "@/lib/articles";
import { siteConfig } from "@/lib/config";
import ArticleCard from "@/components/ArticleCard";
import AdPlaceholder from "@/components/AdPlaceholder";
import Link from "next/link";

export const revalidate = 60;

export default async function HomePage() {
  const allArticles = await getAllArticles();
  const featured = allArticles.filter((a) => a.featured);
  const breaking = allArticles.filter((a) => a.breaking);

  // Group articles by section for section blocks
  const sectionGroups = siteConfig.sections
    .filter((s) => s.slug !== "/")
    .map((section) => ({
      ...section,
      articles: allArticles.filter(
        (a) => a.section.toLowerCase() === section.slug.toLowerCase()
      ),
    }))
    .filter((s) => s.articles.length > 0);

  if (allArticles.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-3xl font-bold text-gray-900 mb-4">
          Welcome to {siteConfig.name}
        </h2>
        <p className="text-gray-500 font-sans text-lg mb-8">
          No articles published yet. Go to the admin panel to start publishing.
        </p>
        <Link
          href="/admin"
          className="inline-block bg-black text-white px-6 py-3 font-sans text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors"
        >
          Open Admin Panel
        </Link>
      </div>
    );
  }

  const heroArticle = featured[0] || allArticles[0];
  const sideArticles = (featured.length > 1 ? featured.slice(1, 3) : allArticles.slice(1, 3));
  const restArticles = allArticles.filter(
    (a) => a.slug !== heroArticle?.slug && !sideArticles.find((s) => s.slug === a.slug)
  );

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Breaking News Ticker */}
      {breaking.length > 0 && (
        <div className="bg-red-700 text-white py-2 -mx-4 px-4 mb-6 overflow-hidden">
          <div className="flex items-center gap-4">
            <span className="flex-shrink-0 text-xs font-sans font-bold uppercase tracking-wider bg-white text-red-700 px-2 py-0.5">
              Breaking
            </span>
            <div className="overflow-hidden flex-1">
              <div className="ticker-animate whitespace-nowrap">
                {breaking.map((article, i) => (
                  <Link
                    key={article.slug}
                    href={`/article/${article.slug}`}
                    className="text-sm font-sans hover:underline"
                  >
                    {article.title}
                    {i < breaking.length - 1 && (
                      <span className="mx-6 text-red-300">|</span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section - NYT Grid */}
      <section className="py-6 border-b border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main hero */}
          <div className="lg:col-span-2">
            <ArticleCard article={heroArticle} variant="hero" />
          </div>

          {/* Side stories */}
          <div className="flex flex-col gap-4">
            {sideArticles.map((article, i) => (
              <div key={article.slug}>
                <ArticleCard article={article} variant="column" />
                {i < sideArticles.length - 1 && (
                  <div className="border-b border-gray-100 mt-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <AdPlaceholder size="banner" />

      {/* Latest News Grid */}
      <section className="py-8 border-b border-gray-200">
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-black inline-block">
          Latest News
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {restArticles.slice(0, 6).map((article) => (
            <ArticleCard
              key={article.slug}
              article={article}
              variant="column"
            />
          ))}
        </div>
      </section>

      {/* Section Blocks */}
      {sectionGroups.slice(0, 6).map((section, idx) => (
        <section key={section.slug} className="py-8 border-b border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl font-bold text-gray-900 pb-1 border-b-2 border-black">
              {section.name}
            </h2>
            <Link
              href={`/section/${section.slug}`}
              className="text-xs font-sans font-medium uppercase tracking-wider text-gray-500 hover:text-black transition-colors"
            >
              More &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {section.articles.slice(0, 4).map((article) => (
              <ArticleCard
                key={article.slug}
                article={article}
                variant="compact"
              />
            ))}
          </div>

          {idx === 1 && <AdPlaceholder size="inline" />}
        </section>
      ))}

      {/* More stories */}
      {restArticles.length > 6 && (
        <section className="py-8">
          <h2 className="font-serif text-xl font-bold text-gray-900 mb-6 pb-1 border-b-2 border-black inline-block">
            More Stories
          </h2>
          <div className="space-y-4">
            {restArticles.slice(6, 12).map((article) => (
              <div key={article.slug} className="border-b border-gray-100 pb-4">
                <ArticleCard article={article} variant="standard" />
              </div>
            ))}
          </div>
        </section>
      )}

      <AdPlaceholder size="banner" />
    </div>
  );
}
