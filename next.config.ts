import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    return [
      { source: "/community", destination: "/society", permanent: true },
      { source: "/plans/community", destination: "/plans/society", permanent: true },
    ];
  },
};

export default nextConfig;
