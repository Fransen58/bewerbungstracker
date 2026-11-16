import type { ReactNode } from "react";

// Designed empty state: short sentence, optional action below.
export function EmptyState({
  text,
  children,
}: {
  text: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-5 rounded-2xl border border-dashed px-6 py-16 text-center">
      <p className="max-w-sm text-xl leading-snug tracking-[-0.02em] text-muted-foreground">
        {text}
      </p>
      {children}
    </div>
  );
}
