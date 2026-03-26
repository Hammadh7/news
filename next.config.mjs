/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost"],
    unoptimized: true,
  },
  // Enable static exports for Netlify compatibility
  // Uncomment the line below if deploying to Netlify as static site
  // output: 'export',
};

export default nextConfig;
