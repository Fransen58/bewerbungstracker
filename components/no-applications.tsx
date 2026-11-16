"use client";

import { NewApplicationDialog } from "@/components/application-dialog";
import { StartDemoButton } from "@/components/demo-controls";
import { EmptyState } from "@/components/empty-state";
import { t } from "@/messages";

// Shared empty state for overview, board and list: create or try the demo.
export function NoApplications() {
  return (
    <EmptyState text={t.empty.applications}>
      <div className="flex flex-wrap justify-center gap-2">
        <NewApplicationDialog trigger="full" />
        <StartDemoButton />
      </div>
    </EmptyState>
  );
}
