import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    // Static export requires unoptimized images (no server to optimize them)
    unoptimized: true,
  },
};

export default nextConfig;
