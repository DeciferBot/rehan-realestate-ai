import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        has: [{ type: "host", value: "simmerproperties.com" }],
        destination: "/landing",
        permanent: false,
      },
      {
        source: "/",
        has: [{ type: "host", value: "www.simmerproperties.com" }],
        destination: "/landing",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
