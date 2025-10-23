import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://13.233.198.145:8000/api/:path*", // Proxy to backend
      },
    ];
  },
};

export default nextConfig;
