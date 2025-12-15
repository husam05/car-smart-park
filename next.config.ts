import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/car-smart-park',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
