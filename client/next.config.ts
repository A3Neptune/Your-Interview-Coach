import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
    resolveAlias: {
      "@": path.join(__dirname, "src"),
    },
  },
};

export default nextConfig;
