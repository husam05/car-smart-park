import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // For Vercel deployment - no basePath needed (serves from root)
  // For GitHub Pages, uncomment these:
  // output: 'export',
  // trailingSlash: true,
  // basePath: '/car-smart-park',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
