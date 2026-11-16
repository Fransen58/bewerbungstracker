import { Dashboard } from "@/components/dashboard";
import { PageHeader } from "@/components/page-header";
import { t } from "@/messages";

export default function OverviewPage() {
  return (
    <>
      <PageHeader title={t.pages.overview.title} />
      <Dashboard />
    </>
  );
}
