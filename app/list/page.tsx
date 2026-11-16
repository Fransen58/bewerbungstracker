import { ApplicationTable } from "@/components/application-table";
import { PageHeader } from "@/components/page-header";
import { t } from "@/messages";

export default function ListPage() {
  return (
    <>
      <PageHeader title={t.pages.list.title} />
      <ApplicationTable />
    </>
  );
}
