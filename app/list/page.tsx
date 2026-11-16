import { PagePlaceholder } from "@/components/page-placeholder";
import { t } from "@/messages";

export default function ListPage() {
  return (
    <PagePlaceholder
      title={t.pages.list.title}
      text={t.pages.list.placeholder}
    />
  );
}
