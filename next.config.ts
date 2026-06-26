import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // mupdf ships as WASM; keep it external so the bundler doesn't rewrite the
  // path to its .wasm and break the runtime load inside the ingest route.
  serverExternalPackages: ["mupdf"],
  async redirects() {
    return [
      // Marketing now lives at the root; keep old /aitaas links working.
      { source: "/aitaas", destination: "/", permanent: true },
      { source: "/aitaas/:path*", destination: "/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
