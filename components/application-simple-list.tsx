"use client";

import { useAppData } from "@/lib/storage";
import { t } from "@/messages";

// Interim view for board and list until stories 2 and 3 replace it.
export function ApplicationSimpleList() {
  const { applications } = useAppData();

  if (applications.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
        {t.empty.applications}
      </div>
    );
  }

  return (
    <ul className="divide-y rounded-xl border">
      {applications.map((app) => (
        <li
          key={app.id}
          className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 py-3"
        >
          <div className="min-w-0">
            <p className="font-medium">{app.company}</p>
            <p className="text-sm text-muted-foreground">{app.role}</p>
          </div>
          <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium">
            {t.options.status[app.status]}
          </span>
        </li>
      ))}
    </ul>
  );
}
