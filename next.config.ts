import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  // Enable experimental features for Frames
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  // Transpile OnchainKit to fix CSS issues
  transpilePackages: ['@coinbase/onchainkit'],
};

export default nextConfig;
