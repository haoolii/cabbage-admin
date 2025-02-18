import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    CLIENT_BASE: process.env.CLIENT_BASE,
    CLIENT_API_BASE: process.env.CLIENT_API_BASE,
    APP_NAME: process.env.APP_NAME,
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  },
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
