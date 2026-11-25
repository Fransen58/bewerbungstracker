"use client";

import { useDocumentLang } from "@/lib/i18n";

// Keeps <html lang> and the tab title in the active language. The title is
// rendered here (React moves it into <head>) instead of in the layout's
// metadata, which Next.js would re-apply in German after hydration.
export function DocumentLang() {
  return <title>{useDocumentLang().app.name}</title>;
}
