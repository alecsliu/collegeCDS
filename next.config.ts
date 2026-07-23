import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project so a stray parent lockfile doesn't
  // get inferred as the root during local builds.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
