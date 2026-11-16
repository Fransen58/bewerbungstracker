import { Board } from "@/components/board";
import { PageHeader } from "@/components/page-header";
import { t } from "@/messages";

export default function BoardPage() {
  return (
    <>
      <PageHeader title={t.pages.board.title} />
      <Board />
    </>
  );
}
