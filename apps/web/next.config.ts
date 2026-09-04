import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@ai-sales-assistant/ui',
    '@ai-sales-assistant/config',
    '@ai-sales-assistant/types',
    '@ai-sales-assistant/utils',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
