import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: '/car-smart-park',
  assetPrefix: '/car-smart-park/',
};

export default nextConfig;
