"use client";

import { useState, useCallback, type ReactNode } from "react";
import { siteConfig } from "@/lib/config";

interface Props {
  title: string;
  subtitle: string;
  htmlContent: string;
  rawContent: string;
  children?: ReactNode; // meta bar, image, etc. rendered between title and body
}

export default function TranslatableArticle({
  title,
  subtitle,
  htmlContent,
  rawContent,
  children,
}: Props) {
  const [selectedLang, setSelectedLang] = useState("original");
  const [translatedTitle, setTranslatedTitle] = useState(title);
  const [translatedSubtitle, setTranslatedSubtitle] = useState(subtitle);
  const [translatedHtml, setTranslatedHtml] = useState(htmlContent);
  const [loading, setLoading] = useState(false);
  const [cache, setCache] = useState<
    Record<string, { title: string; subtitle: string; html: string }>
  >({
    original: { title, subtitle, html: htmlContent },
  });

  const handleTranslate = useCallback(
    async (langCode: string) => {
      setSelectedLang(langCode);

      if (cache[langCode]) {
        setTranslatedTitle(cache[langCode].title);
        setTranslatedSubtitle(cache[langCode].subtitle);
        setTranslatedHtml(cache[langCode].html);
        return;
      }

      if (langCode === "original") {
        setTranslatedTitle(title);
        setTranslatedSubtitle(subtitle);
        setTranslatedHtml(htmlContent);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: rawContent,
            title,
            subtitle,
            targetLang: langCode,
          }),
        });

        if (!res.ok) throw new Error("Translation failed");

        const data = await res.json();

        const result = {
          title: data.title || title,
          subtitle: data.subtitle || subtitle,
          html: data.html || htmlContent,
        };

        setTranslatedTitle(result.title);
        setTranslatedSubtitle(result.subtitle);
        setTranslatedHtml(result.html);
        setCache((prev) => ({ ...prev, [langCode]: result }));
      } catch {
        alert("Translation failed. Please try again.");
        setSelectedLang("original");
        setTranslatedTitle(title);
        setTranslatedSubtitle(subtitle);
        setTranslatedHtml(htmlContent);
      }
      setLoading(false);
    },
    [cache, title, subtitle, htmlContent, rawContent]
  );

  const languages = siteConfig.languages;

  return (
    <>
      {/* Language selector */}
      <div className="flex items-center gap-2 mb-4">
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
          />
        </svg>
        <select
          value={selectedLang}
          onChange={(e) => handleTranslate(e.target.value)}
          disabled={loading}
          className="text-sm font-sans border border-gray-200 rounded-md px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-black focus:border-black bg-white disabled:opacity-50"
        >
          <option value="original">Original</option>
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.nativeName}
            </option>
          ))}
        </select>
        {loading && (
          <span className="text-xs text-gray-400 font-sans flex items-center gap-1.5">
            <svg
              className="animate-spin h-3 w-3"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Translating...
          </span>
        )}
        {selectedLang !== "original" && !loading && (
          <span className="text-[10px] text-gray-400 font-sans italic">
            Auto-translated
          </span>
        )}
      </div>

      {/* Translated headline */}
      <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-3">
        {translatedTitle}
      </h1>

      {translatedSubtitle && (
        <p className="text-lg md:text-xl text-gray-600 font-sans leading-relaxed mb-4">
          {translatedSubtitle}
        </p>
      )}

      {/* Meta bar, image, etc. from parent */}
      {children}

      {/* Translated article body */}
      <div
        className={`article-content transition-opacity ${loading ? "opacity-40" : ""}`}
        dangerouslySetInnerHTML={{ __html: translatedHtml }}
      />
    </>
  );
}
