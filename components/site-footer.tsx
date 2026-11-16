import Link from "next/link";
import { t } from "@/messages";

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between gap-4 px-4 text-[13px] text-muted-foreground md:px-8">
        <span>{t.app.name}</span>
        <Link
          href="/backup"
          className="underline decoration-border underline-offset-4 transition-colors duration-200 ease-soft hover:text-foreground hover:decoration-foreground"
        >
          {t.nav.backup}
        </Link>
      </div>
    </footer>
  );
}
