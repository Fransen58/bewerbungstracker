import { useSyncExternalStore } from "react";
import { THEME_KEY } from "./theme-script";

// Client-side theme state; the inline init script lives in theme-script.ts.

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

// True when the dark theme is active. False during the static build.
export function useIsDark(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => document.documentElement.classList.contains("dark"),
    () => false
  );
}

export function setTheme(theme: "light" | "dark") {
  localStorage.setItem(THEME_KEY, theme);
  document.documentElement.classList.toggle("dark", theme === "dark");
}
