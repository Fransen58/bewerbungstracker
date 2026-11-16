"use client";

import { NewApplicationDialog } from "@/components/application-dialog";
import { StartDemoButton } from "@/components/demo-controls";
import { EmptyState } from "@/components/empty-state";
import { useT } from "@/lib/i18n";

// Shared empty state for overview, board and list: create or try the demo.
export function NoApplications() {
  const t = useT();
  return (
    <EmptyState text={t.empty.applications}>
      <div className="flex flex-wrap justify-center gap-2">
        <NewApplicationDialog trigger="full" />
        <StartDemoButton />
      </div>
    </EmptyState>
  );
}
