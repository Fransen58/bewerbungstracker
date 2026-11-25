"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NewApplicationDialog } from "@/components/application-dialog";
import { DemoBanner } from "@/components/demo-controls";
import { LanguageSwitch } from "@/components/language-switch";
import { ThemeToggle } from "@/components/theme-toggle";
import { useT } from "@/lib/i18n";


function NavLinks({
  vertical,
  onNavigate,
}: {
  vertical?: boolean;
  onNavigate?: () => void;
}) {
  const t = useT();
  const navItems = [
    { href: "/", label: t.nav.overview },
    { href: "/applications", label: t.nav.applications },
    { href: "/profile", label: t.nav.profile },
  ];
  const pathname = usePathname();
  return (
    <nav className={cn("flex gap-1.5", vertical && "flex-col")}>
      {navItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex h-9 items-center rounded-full px-4 text-sm font-medium transition-colors duration-200 ease-soft",
              active
                ? "bg-primary text-primary-foreground"
                : "bg-muted/70 text-foreground hover:bg-muted",
              vertical && "h-11 text-base"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function SiteHeader() {
  const t = useT();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-b from-background from-60% to-background/0 backdrop-blur-sm">
      <DemoBanner />
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-4 md:px-8">
        <Link
          href="/"
          className="text-base font-medium tracking-[-0.03em]"
        >
          {t.app.name}
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:block">
          <NavLinks />
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* On small screens language and theme live in the menu. */}
          <div className="hidden items-center gap-2 md:flex">
            <LanguageSwitch />
            <ThemeToggle />
          </div>
          <NewApplicationDialog />

          {/* Mobile navigation: slide-in sheet */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label={t.nav.openMenu}
                />
              }
            >
              <MenuIcon />
            </SheetTrigger>
            <SheetContent side="right" className="gap-6 p-5">
              <SheetTitle className="text-base tracking-[-0.03em]">
                {t.app.name}
              </SheetTitle>
              <NavLinks vertical onNavigate={() => setOpen(false)} />
              <div className="space-y-3 border-t pt-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    {t.language.label}
                  </span>
                  <LanguageSwitch />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{t.theme.label}</span>
                  <ThemeToggle />
                </div>
              </div>
              <Link
                href="/backup"
                onClick={() => setOpen(false)}
                className="text-sm text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground"
              >
                {t.nav.backup}
              </Link>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
