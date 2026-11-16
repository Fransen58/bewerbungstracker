import { Suspense } from "react";
import { ApplicationDetail } from "@/components/application-detail";

// The id comes from the query string (?id=…), because the static export
// cannot prebuild a page per id: ids only exist in the browser.
export default function ApplicationPage() {
  return (
    <Suspense>
      <ApplicationDetail />
    </Suspense>
  );
}
