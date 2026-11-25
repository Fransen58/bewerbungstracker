"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { useT } from "@/lib/i18n";

// Unknown routes: the app's own empty state instead of the Next.js default.
export default function NotFound() {
  const t = useT();
  return (
    <EmptyState text={t.notFound.text}>
      <Button render={<Link href="/" />} nativeButton={false}>
        {t.notFound.back}
      </Button>
    </EmptyState>
  );
}
