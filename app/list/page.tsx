"use client";

import { ApplicationTable } from "@/components/application-table";
import { PageHeader } from "@/components/page-header";
import { useT } from "@/lib/i18n";

export default function ListPage() {
  const t = useT();
  return (
    <>
      <PageHeader title={t.pages.list.title} />
      <ApplicationTable />
    </>
  );
}
