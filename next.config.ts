import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: the app is served as plain HTML/CSS/JS, no server needed.
  output: "export",
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
