"use client";

import { useEffect, useSyncExternalStore } from "react";
import { DEFAULT_LANG, messages, type Lang, type Messages } from "@/messages";

// UI language. German is the default; the choice is stored in the browser.

const LANG_KEY = "bewerbungstracker:lang";

let cache: Lang | null = null;
const listeners = new Set<() => void>();

function read(): Lang {
  if (!cache) {
    cache = window.localStorage.getItem(LANG_KEY) === "en" ? "en" : "de";
  }
  return cache;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Keep other open tabs in sync.
  const onStorage = (e: StorageEvent) => {
    if (e.key !== LANG_KEY) return;
    cache = null;
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function setLang(lang: Lang) {
  window.localStorage.setItem(LANG_KEY, lang);
  cache = lang;
  listeners.forEach((listener) => listener());
}

// Active language; German during the static build.
export function useLang(): Lang {
  return useSyncExternalStore(subscribe, read, () => DEFAULT_LANG);
}

// UI texts of the active language.
export function useT(): Messages {
  return messages[useLang()];
}

// Keeps <html lang> and the tab title in sync with the active language.
export function useDocumentLang() {
  const lang = useLang();
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = messages[lang].app.name;
  }, [lang]);
}
