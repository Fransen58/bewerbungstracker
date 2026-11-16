"use client";

import { Board } from "@/components/board";
import { PageHeader } from "@/components/page-header";
import { useT } from "@/lib/i18n";

export default function BoardPage() {
  const t = useT();
  return (
    <>
      <PageHeader title={t.pages.board.title} />
      <Board />
    </>
  );
}
