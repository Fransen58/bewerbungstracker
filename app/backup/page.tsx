"use client";

import { BackupPanel } from "@/components/backup-panel";
import { PageHeader } from "@/components/page-header";
import { useT } from "@/lib/i18n";

export default function BackupPage() {
  const t = useT();
  return (
    <>
      <PageHeader title={t.backup.title} />
      <BackupPanel />
    </>
  );
}
