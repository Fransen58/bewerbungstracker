import { ApplicationSimpleList } from "@/components/application-simple-list";
import { PageHeader } from "@/components/page-header";
import { t } from "@/messages";

export default function ListPage() {
  return (
    <>
      <PageHeader title={t.pages.list.title} />
      <ApplicationSimpleList />
    </>
  );
}
