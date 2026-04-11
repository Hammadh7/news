import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/lib/config";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MarketTicker from "@/components/MarketTicker";
import { LanguageProvider } from "@/components/LanguageContext";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} - ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["news", "india", "indian news", "news dholi", "breaking news", "politics", "business", "technology", "sports", "entertainment", "health"],
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "k4n1DanCvsUyWsDvz0cH7MzOJlXdE-5721NNFRIQfpY",
  },
  openGraph: {
    title: `${siteConfig.name} - ${siteConfig.tagline}`,
    description: siteConfig.description,
    type: "website",
    siteName: siteConfig.name,
    locale: "en_IN",
    url: siteConfig.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} - ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="alternate" type="application/rss+xml" title={siteConfig.name} href="/feed.xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "NewsMediaOrganization",
              name: siteConfig.name,
              url: siteConfig.url,
              description: siteConfig.description,
            }),
          }}
        />
        {siteConfig.adsEnabled && siteConfig.googleAdsClientId && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${siteConfig.googleAdsClientId}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="min-h-screen flex flex-col">
        <LanguageProvider>
          <MarketTicker />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <Analytics />
          <SpeedInsights />
        </LanguageProvider>
      </body>
    </html>
  );
}
