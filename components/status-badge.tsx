"use client";

import { cn } from "@/lib/utils";
import type { Status } from "@/lib/types";
import { useT } from "@/lib/i18n";

// Colored dot for a status. The color comes from the --status-* tokens.
export function StatusDot({ status }: { status: Status }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block size-2 shrink-0 rounded-full"
      style={{
        backgroundColor: `var(--status-${status})`,
        boxShadow: `0 0 0 3px color-mix(in srgb, var(--status-${status}) 18%, transparent)`,
      }}
    />
  );
}

// Status as dot plus text, optionally on a muted pill.
export function StatusBadge({
  status,
  pill,
  className,
}: {
  status: Status;
  pill?: boolean;
  className?: string;
}) {
  const t = useT();
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-sm",
        pill && "rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium",
        className
      )}
    >
      <StatusDot status={status} />
      {t.options.status[status]}
    </span>
  );
}
