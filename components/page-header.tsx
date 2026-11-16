import type { ReactNode } from "react";

// Page title with optional actions on the right.
export function PageHeader({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b pb-4">
      <h1 className="text-[26px] leading-[1.1] font-medium md:text-[32px]">
        {title}
      </h1>
      {children}
    </div>
  );
}
