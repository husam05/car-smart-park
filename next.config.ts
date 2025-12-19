import type { NextConfig } from "next";

// Detect deployment environment
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';
const isVercel = process.env.VERCEL === '1';

const nextConfig: NextConfig = {
  // GitHub Pages requires static export with basePath
  ...(isGitHubPages && {
    output: 'export',
    trailingSlash: true,
    basePath: '/car-smart-park',
  }),

  // Vercel uses SSR by default (no output: 'export' needed)
  // No basePath needed for Vercel deployment

  images: {
    unoptimized: true,
  },
};

export default nextConfig;
