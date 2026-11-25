import type { MetadataRoute } from "next";
import { messages, DEFAULT_LANG } from "@/messages";

const t = messages[DEFAULT_LANG];

// Story 13: makes the app installable and, on Android, a target in the
// share menu. Shared links and texts open /share as query parameters.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: t.app.name,
    short_name: t.app.name,
    description: t.app.description,
    start_url: "/",
    display: "standalone",
    background_color: "#f4f4f2",
    theme_color: "#121211",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    share_target: {
      action: "/share",
      method: "GET",
      params: { title: "title", text: "text", url: "url" },
    },
  };
}
