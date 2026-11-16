"use client";

import { EmptyState } from "@/components/empty-state";
import { NewApplicationDialog } from "@/components/new-application-dialog";
import { StatusBadge } from "@/components/status-badge";
import { useAppData } from "@/lib/storage";
import { t } from "@/messages";

// Interim view for the list page until story 3 replaces it.
export function ApplicationSimpleList() {
  const { applications } = useAppData();

  if (applications.length === 0) {
    return (
      <EmptyState text={t.empty.applications}>
        <NewApplicationDialog trigger="full" />
      </EmptyState>
    );
  }

  return (
    <ul className="divide-y border-y">
      {applications.map((app) => (
        <li
          key={app.id}
          className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3"
        >
          <div className="min-w-0">
            <p className="font-medium tracking-[-0.02em]">{app.company}</p>
            <p className="text-[13px] leading-[18px] text-muted-foreground">
              {app.role}
            </p>
          </div>
          <StatusBadge status={app.status} pill />
        </li>
      ))}
    </ul>
  );
}
