import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Marketing now lives at the root; keep old /aitaas links working.
      { source: "/aitaas", destination: "/", permanent: true },
      { source: "/aitaas/:path*", destination: "/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
