import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    
    // Ignore React Native modules for web builds
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        "@react-native-async-storage/async-storage": false,
      };
    }
    
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
