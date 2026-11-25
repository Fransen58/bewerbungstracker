import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Board and list became one page in story 15; old links keep working.
  async redirects() {
    return [
      { source: "/board", destination: "/applications?view=board", permanent: true },
      { source: "/list", destination: "/applications?view=list", permanent: true },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
