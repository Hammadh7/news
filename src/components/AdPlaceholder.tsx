"use client";

import { siteConfig } from "@/lib/config";

const sizes = {
  banner: { width: "728px", height: "90px", label: "728x90" },
  sidebar: { width: "300px", height: "250px", label: "300x250" },
  inline: { width: "100%", height: "100px", label: "Inline Ad" },
};

export default function AdPlaceholder({ size = "banner" }: { size?: "banner" | "sidebar" | "inline" }) {
  const dim = sizes[size];

  if (siteConfig.adsEnabled && siteConfig.googleAdsClientId) {
    return (
      <div className="flex justify-center my-6">
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: dim.width, height: dim.height }}
          data-ad-client={siteConfig.googleAdsClientId}
          data-ad-slot="auto"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  return (
    <div className="flex justify-center my-6">
      <div
        className="border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs uppercase tracking-widest"
        style={{ width: dim.width, maxWidth: "100%", height: dim.height }}
      >
        Advertisement
      </div>
    </div>
  );
}
