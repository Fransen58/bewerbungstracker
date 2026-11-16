"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { setTheme, useIsDark } from "@/lib/theme";
import { useT } from "@/lib/i18n";

export function ThemeToggle() {
  const t = useT();
  const isDark = useIsDark();
  const label = isDark ? t.theme.toLight : t.theme.toDark;

  return (
    <Button
      variant="secondary"
      size="icon"
      aria-label={label}
      title={label}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
}
