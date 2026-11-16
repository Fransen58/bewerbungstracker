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
import { NewApplicationDialog } from "@/components/new-application-dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import { t } from "@/messages";

const navItems = [
  { href: "/", label: t.nav.overview },
  { href: "/board", label: t.nav.board },
  { href: "/list", label: t.nav.list },
];

function NavLinks({
  vertical,
  onNavigate,
}: {
  vertical?: boolean;
  onNavigate?: () => void;
}) {
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
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-b from-background from-60% to-background/0 backdrop-blur-sm">
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

        <div className="flex items-center gap-2">
          <ThemeToggle />
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
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
