"use client";

import { useEffect } from "react";

// Registers the minimal service worker (public/sw.js), see story 13.
export function ServiceWorker() {
  useEffect(() => {
    navigator.serviceWorker?.register("/sw.js").catch(() => {});
  }, []);
  return null;
}
