"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/status-badge";
import { formatDate, isOverdue } from "@/lib/date";
import type { Application } from "@/lib/types";
import { useT } from "@/lib/i18n";

type SortKey = "applied_at" | "fit_score" | "next_step_date";
type SortDir = "asc" | "desc";

// Direction used when a column is sorted for the first time.
const DEFAULT_DIR: Record<SortKey, SortDir> = {
  applied_at: "desc", // newest first
  fit_score: "desc", // best fit first
  next_step_date: "asc", // soonest first
};

// Sorts by the given key; empty values always go last.
function compare(a: Application, b: Application, key: SortKey, dir: SortDir) {
  const va = a[key];
  const vb = b[key];
  if (va === null && vb === null) return 0;
  if (va === null) return 1;
  if (vb === null) return -1;
  const result = va < vb ? -1 : va > vb ? 1 : 0;
  return dir === "asc" ? result : -result;
}

// List view (story 3); receives the already filtered applications.
export function ApplicationTable({
  applications,
}: {
  applications: Application[];
}) {
  const t = useT();
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({
    key: "applied_at",
    dir: "desc",
  });

  const rows = [...applications].sort((a, b) =>
    compare(a, b, sort.key, sort.dir)
  );

  function toggleSort(key: SortKey) {
    setSort((s) =>
      s.key === key
        ? { key, dir: s.dir === "asc" ? "desc" : "asc" }
        : { key, dir: DEFAULT_DIR[key] }
    );
  }

  return (
    <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
      <table className="w-full min-w-[880px] border-collapse text-left">
        <thead>
          <tr className="border-b">
            <Th>{t.pages.list.companyRole}</Th>
            <Th>{t.form.fields.status}</Th>
            <Th>{t.form.fields.work_model}</Th>
            <Th>{t.form.fields.source}</Th>
            <SortTh sortKey="fit_score" sort={sort} onSort={toggleSort}>
              {t.form.fields.fit_score}
            </SortTh>
            <SortTh sortKey="applied_at" sort={sort} onSort={toggleSort}>
              {t.form.fields.applied_at}
            </SortTh>
            <SortTh
              sortKey="next_step_date"
              sort={sort}
              onSort={toggleSort}
            >
              {t.form.fields.next_step}
            </SortTh>
          </tr>
        </thead>
        <tbody>
          {rows.map((app) => (
            <Row key={app.id} app={app} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Row({ app }: { app: Application }) {
  const t = useT();
  const overdue = isOverdue(app.next_step_date);
  const muted = <span className="text-muted-foreground">–</span>;

  return (
    <tr className="relative border-b align-top transition-colors duration-200 ease-soft hover:bg-muted/50">
      <Td>
        {/* Stretched link: the whole row opens the detail page. */}
        <Link
          href={`/application?id=${app.id}`}
          className="font-medium tracking-[-0.02em] outline-none after:absolute after:inset-0 focus-visible:after:ring-3 focus-visible:after:ring-ring/40"
        >
          {app.company}
        </Link>
        <p className="text-[13px] leading-[18px] text-muted-foreground">
          {app.role}
        </p>
      </Td>
      <Td>
        <StatusBadge status={app.status} pill className="whitespace-nowrap" />
      </Td>
      <Td>{app.work_model ? t.options.work_model[app.work_model] : muted}</Td>
      <Td>{app.source ? t.options.source[app.source] : muted}</Td>
      <Td className="font-mono text-[13px] tabular-nums">
        {app.fit_score ?? muted}
      </Td>
      <Td className="font-mono text-[13px] whitespace-nowrap tabular-nums">
        {app.applied_at ? formatDate(app.applied_at, t.locale) : muted}
      </Td>
      <Td>
        {app.next_step || app.next_step_date ? (
          <>
            {app.next_step && (
              <p className="text-[13px] leading-[18px]">{app.next_step}</p>
            )}
            {app.next_step_date && (
              <p
                className={cn(
                  "font-mono text-xs whitespace-nowrap text-muted-foreground tabular-nums",
                  overdue && "font-medium text-destructive"
                )}
              >
                {formatDate(app.next_step_date, t.locale)}
                {overdue && ` · ${t.pages.board.overdue}`}
              </p>
            )}
          </>
        ) : (
          muted
        )}
      </Td>
    </tr>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th scope="col" className="label-caps px-3 py-2.5 font-medium">
      {children}
    </th>
  );
}

function SortTh({
  sortKey,
  sort,
  onSort,
  children,
}: {
  sortKey: SortKey;
  sort: { key: SortKey; dir: SortDir };
  onSort: (key: SortKey) => void;
  children: React.ReactNode;
}) {
  const active = sort.key === sortKey;
  const Arrow = sort.dir === "asc" ? ArrowUpIcon : ArrowDownIcon;

  return (
    <th
      scope="col"
      aria-sort={
        active ? (sort.dir === "asc" ? "ascending" : "descending") : "none"
      }
      className="px-3 py-1.5"
    >
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={cn(
          "label-caps -mx-2 inline-flex items-center gap-1 rounded-full px-2 py-1 transition-colors duration-200 ease-soft hover:bg-muted hover:text-foreground",
          active && "text-foreground"
        )}
      >
        {children}
        <Arrow className={cn("size-3", !active && "opacity-0")} />
      </button>
    </th>
  );
}

function Td({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <td className={cn("px-3 py-3 text-sm", className)}>{children}</td>;
}
