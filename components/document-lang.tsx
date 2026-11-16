"use client";

import { useDocumentLang } from "@/lib/i18n";

// Renders nothing; keeps <html lang> and the tab title in the active language.
export function DocumentLang() {
  useDocumentLang();
  return null;
}
