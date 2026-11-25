import { Suspense } from "react";
import { ApplicationsView } from "@/components/applications-view";

// Board and list on one page (story 15). The view comes from the query
// string (?view=list), so it can be linked and bookmarked.
export default function ApplicationsPage() {
  return (
    <Suspense>
      <ApplicationsView />
    </Suspense>
  );
}
