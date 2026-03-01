import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fortnite-api.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn2.unrealengine.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
