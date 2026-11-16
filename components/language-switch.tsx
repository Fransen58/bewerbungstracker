"use client";

import { cn } from "@/lib/utils";
import { setLang, useLang, useT } from "@/lib/i18n";
import { LANGS } from "@/messages";

// Segmented pill "DE | EN" with a sliding thumb (see DESIGN.md).
export function LanguageSwitch() {
  const t = useT();
  const lang = useLang();

  return (
    <div
      role="group"
      aria-label={t.language.label}
      className="relative inline-grid h-9 grid-cols-2 rounded-full bg-secondary p-1"
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full bg-primary transition-transform duration-200 ease-soft motion-reduce:transition-none",
          lang === "en" && "translate-x-full"
        )}
      />
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          aria-pressed={lang === l}
          title={t.language.names[l]}
          onClick={() => setLang(l)}
          className={cn(
            "relative z-10 min-w-10 rounded-full px-2.5 text-xs font-medium uppercase transition-colors duration-200 ease-soft",
            lang === l ? "text-primary-foreground" : "text-foreground"
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
