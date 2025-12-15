import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: isProd ? '/car-smart-park' : '',
  assetPrefix: isProd ? '/car-smart-park/' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
