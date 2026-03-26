"use client";

import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/lib/config";
import { useLanguage } from "./LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useLanguage();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const navSections = siteConfig.sections.filter((s) => s.slug !== "/");

  return (
    <header className="border-b border-gray-200">
      {/* Top utility bar */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between text-xs text-gray-500 font-sans">
          <span>{today}</span>
          <div className="flex items-center gap-4">
            <LanguageSwitcher compact />
          </div>
        </div>
      </div>

      {/* Masthead */}
      <div className="max-w-7xl mx-auto px-4 py-4 text-center">
        <Link href="/" className="inline-block">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-black leading-none">
            {siteConfig.name}
          </h1>
        </Link>
        <p className="text-xs md:text-sm text-gray-500 mt-1 font-sans tracking-[0.2em] uppercase">
          {siteConfig.tagline}
        </p>
      </div>

      {/* Navigation */}
      <nav className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          {/* Desktop nav */}
          <div className="hidden md:flex items-center justify-center gap-0 overflow-x-auto">
            {navSections.map((section) => (
              <Link
                key={section.slug}
                href={`/section/${section.slug}`}
                className="px-3 py-2.5 text-xs font-sans font-medium uppercase tracking-wider text-gray-700 hover:text-black hover:bg-gray-50 transition-colors whitespace-nowrap"
              >
                {t(section.slug) || section.name}
              </Link>
            ))}
          </div>

          {/* Mobile nav button */}
          <div className="flex md:hidden items-center justify-between py-2">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 -ml-2"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
            <span className="text-xs font-sans font-medium uppercase tracking-wider text-gray-500">
              {t("sections")}
            </span>
            <div className="w-9" />
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="max-w-7xl mx-auto px-4 py-2">
              {navSections.map((section) => (
                <Link
                  key={section.slug}
                  href={`/section/${section.slug}`}
                  onClick={() => setMenuOpen(false)}
                  className="block py-2.5 text-sm font-sans text-gray-700 hover:text-black border-b border-gray-50 last:border-0"
                >
                  {t(section.slug) || section.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
