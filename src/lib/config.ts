export const siteConfig = {
  name: "The Daily Chronicle",
  tagline: "Truth. Clarity. India.",
  description: "India's trusted source for news, analysis, and stories that matter.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  adminPassword: process.env.ADMIN_PASSWORD || "admin123",
  sections: [
    { name: "Home", slug: "/", icon: "home" },
    { name: "India", slug: "india", icon: "flag" },
    { name: "World", slug: "world", icon: "globe" },
    { name: "Politics", slug: "politics", icon: "landmark" },
    { name: "Business", slug: "business", icon: "briefcase" },
    { name: "Technology", slug: "technology", icon: "cpu" },
    { name: "Sports", slug: "sports", icon: "trophy" },
    { name: "Entertainment", slug: "entertainment", icon: "film" },
    { name: "Opinion", slug: "opinion", icon: "message-circle" },
    { name: "Health", slug: "health", icon: "heart" },
    { name: "Cricket", slug: "cricket", icon: "circle-dot" },
  ],
  languages: [
    { code: "en", name: "English", nativeName: "English" },
    { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
    { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
    { code: "te", name: "Telugu", nativeName: "తెలుగు" },
    { code: "bn", name: "Bengali", nativeName: "বাংলা" },
    { code: "mr", name: "Marathi", nativeName: "मराठी" },
    { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
    { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
    { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
    { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
    { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ" },
    { code: "ur", name: "Urdu", nativeName: "اردو" },
  ],
  adsEnabled: false, // Set to true when ready to enable Google Ads
  googleAdsClientId: process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID || "",
};

export type Section = (typeof siteConfig.sections)[number];
export type Language = (typeof siteConfig.languages)[number];
