import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/causalme',
  images: { unoptimized: true },
};

export default nextConfig;
