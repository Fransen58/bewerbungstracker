import { ApplicationSimpleList } from "@/components/application-simple-list";
import { t } from "@/messages";

export default function ListPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">
        {t.pages.list.title}
      </h1>
      <ApplicationSimpleList />
    </div>
  );
}
