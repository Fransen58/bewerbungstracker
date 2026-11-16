import { Board } from "@/components/board";
import { t } from "@/messages";

export default function BoardPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">
        {t.pages.board.title}
      </h1>
      <Board />
    </div>
  );
}
