import { PagePlaceholder } from "@/components/page-placeholder";
import { t } from "@/messages";

export default function BoardPage() {
  return (
    <PagePlaceholder
      title={t.pages.board.title}
      text={t.pages.board.placeholder}
    />
  );
}
