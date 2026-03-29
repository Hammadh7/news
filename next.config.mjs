/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost"],
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  // Enable static exports for Netlify compatibility
  // Uncomment the line below if deploying to Netlify as static site
  // output: 'export',
};

export default nextConfig;
