import Link from "next/link";

interface Article {
  slug: string;
  title: string;
  subtitle: string;
  author: string;
  date: string;
  section: string;
  image: string;
  excerpt: string;
  featured: boolean;
}

type Variant = "hero" | "standard" | "compact" | "column";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function ArticleCard({
  article,
  variant = "standard",
  className = "",
}: {
  article: Article;
  variant?: Variant;
  className?: string;
}) {
  if (variant === "hero") {
    return (
      <Link href={`/article/${article.slug}`} className={`group block ${className}`}>
        <div className="relative bg-gray-100 aspect-[16/9] md:aspect-[2/1] overflow-hidden">
          {article.image ? (
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <span className="text-gray-400 font-serif text-lg">The Daily Chronicle</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <span className="inline-block px-2 py-0.5 bg-white/90 text-black text-[10px] font-sans font-bold uppercase tracking-wider mb-3">
              {article.section}
            </span>
            <h2 className="font-serif text-2xl md:text-4xl font-bold text-white leading-tight mb-2">
              {article.title}
            </h2>
            {article.subtitle && (
              <p className="text-gray-200 text-sm md:text-base font-sans leading-relaxed max-w-2xl">
                {article.subtitle}
              </p>
            )}
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link href={`/article/${article.slug}`} className={`group block py-3 ${className}`}>
        <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-gray-500">
          {article.section}
        </span>
        <h3 className="font-serif text-base font-bold text-gray-900 group-hover:text-gray-600 transition-colors leading-snug mt-0.5">
          {article.title}
        </h3>
        <p className="text-xs text-gray-500 font-sans mt-1">{formatDate(article.date)}</p>
      </Link>
    );
  }

  if (variant === "column") {
    return (
      <Link href={`/article/${article.slug}`} className={`group block ${className}`}>
        {article.image ? (
          <div className="aspect-[3/2] overflow-hidden bg-gray-100 mb-3">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
          </div>
        ) : (
          <div className="aspect-[3/2] bg-gradient-to-br from-gray-50 to-gray-100 mb-3 flex items-center justify-center">
            <span className="text-gray-300 font-serif text-sm">The Daily Chronicle</span>
          </div>
        )}
        <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-gray-500">
          {article.section}
        </span>
        <h3 className="font-serif text-lg font-bold text-gray-900 group-hover:text-gray-600 transition-colors leading-snug mt-1">
          {article.title}
        </h3>
        <p className="text-sm text-gray-600 font-sans leading-relaxed mt-2 line-clamp-3">
          {article.excerpt}
        </p>
        <p className="text-xs text-gray-400 font-sans mt-2">
          {article.author} &middot; {formatDate(article.date)}
        </p>
      </Link>
    );
  }

  // Standard variant
  return (
    <Link href={`/article/${article.slug}`} className={`group flex gap-4 ${className}`}>
      {article.image ? (
        <div className="flex-shrink-0 w-32 h-24 md:w-48 md:h-32 overflow-hidden bg-gray-100">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />
        </div>
      ) : (
        <div className="flex-shrink-0 w-32 h-24 md:w-48 md:h-32 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <span className="text-gray-300 font-serif text-[10px]">TDC</span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-gray-500">
          {article.section}
        </span>
        <h3 className="font-serif text-base md:text-lg font-bold text-gray-900 group-hover:text-gray-600 transition-colors leading-snug mt-0.5">
          {article.title}
        </h3>
        <p className="text-sm text-gray-600 font-sans leading-relaxed mt-1 line-clamp-2 hidden md:block">
          {article.excerpt}
        </p>
        <p className="text-xs text-gray-400 font-sans mt-1.5">
          {article.author} &middot; {formatDate(article.date)}
        </p>
      </div>
    </Link>
  );
}
