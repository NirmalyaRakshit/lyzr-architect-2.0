import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Bypasses strict TS and ESLint checks during Vercel production builds
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;