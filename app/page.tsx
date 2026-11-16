"use client";

import { Dashboard } from "@/components/dashboard";
import { PageHeader } from "@/components/page-header";
import { useT } from "@/lib/i18n";

export default function OverviewPage() {
  const t = useT();
  return (
    <>
      <PageHeader title={t.pages.overview.title} />
      <Dashboard />
    </>
  );
}
