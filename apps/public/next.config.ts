import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@resvg/resvg-js"],
  transpilePackages: ["@kawkaw/database"],
};

export default nextConfig;
