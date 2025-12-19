import type { NextConfig } from "next";

// Detect if we're building for GitHub Pages (static export)
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';

const nextConfig: NextConfig = {
  // Enable static export for GitHub Pages
  ...(isGitHubPages && {
    output: 'export',
    trailingSlash: true,
    basePath: '/car-smart-park',
  }),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
