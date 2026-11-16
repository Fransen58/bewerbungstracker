import { BackupPanel } from "@/components/backup-panel";
import { PageHeader } from "@/components/page-header";
import { t } from "@/messages";

export default function BackupPage() {
  return (
    <>
      <PageHeader title={t.backup.title} />
      <BackupPanel />
    </>
  );
}
