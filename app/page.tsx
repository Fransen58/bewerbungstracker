import { PagePlaceholder } from "@/components/page-placeholder";
import { t } from "@/messages";

export default function OverviewPage() {
  return (
    <PagePlaceholder
      title={t.pages.overview.title}
      text={t.pages.overview.placeholder}
    />
  );
}
