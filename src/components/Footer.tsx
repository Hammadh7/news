"use client";

import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { useLanguage } from "./LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Footer() {
  const { t } = useLanguage();
  const navSections = siteConfig.sections.filter((s) => s.slug !== "/");

  return (
    <footer className="bg-gray-950 text-gray-300 mt-16">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <h2 className="font-serif text-2xl md:text-3xl font-black text-white">
              {siteConfig.name}
            </h2>
          </Link>
          <p className="text-xs text-gray-500 mt-1 tracking-[0.2em] uppercase font-sans">
            {siteConfig.tagline}
          </p>
        </div>

        {/* Sections grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-x-6 gap-y-3 mb-10">
          {navSections.map((section) => (
            <Link
              key={section.slug}
              href={`/section/${section.slug}`}
              className="text-sm text-gray-400 hover:text-white transition-colors font-sans"
            >
              {t(section.slug) || section.name}
            </Link>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Links */}
          <div className="flex items-center gap-6 text-xs text-gray-500 font-sans">
            <span>{t("aboutUs")}</span>
            <span>{t("contactUs")}</span>
            <span>{t("privacyPolicy")}</span>
            <span>{t("termsOfService")}</span>
          </div>

          {/* Language */}
          <div className="text-gray-400">
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-xs text-gray-600 font-sans">
          &copy; {new Date().getFullYear()} {siteConfig.name}. {t("copyright")}
        </div>
      </div>
    </footer>
  );
}
