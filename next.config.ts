import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/d/:path*",
        destination: `${process.env.SERVER_API_BASE}/api/:path*`,
      },
      {
        source: "/o/:path*",
        destination: `${process.env.SERVER_API_BASE}/api/asset/files/:path*`,
      },
    ];
  },
};

export default nextConfig;
