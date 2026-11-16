"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowDownIcon, ArrowUpIcon, SearchIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/empty-state";
import { NewApplicationDialog } from "@/components/application-dialog";
import { StatusBadge } from "@/components/status-badge";
import { formatDate, isOverdue } from "@/lib/date";
import { useAppData, useStorageReady } from "@/lib/storage";
import {
  SOURCES,
  STATUSES,
  WORK_MODELS,
  type Application,
  type Source,
  type Status,
  type WorkModel,
} from "@/lib/types";
import { t } from "@/messages";

type SortKey = "applied_at" | "fit_score" | "next_step_date";
type SortDir = "asc" | "desc";

// Direction used when a column is sorted for the first time.
const DEFAULT_DIR: Record<SortKey, SortDir> = {
  applied_at: "desc", // newest first
  fit_score: "desc", // best fit first
  next_step_date: "asc", // soonest first
};

type Filters = {
  status: Status | "all";
  work_model: WorkModel | "all";
  source: Source | "all";
  search: string;
};

const NO_FILTERS: Filters = {
  status: "all",
  work_model: "all",
  source: "all",
  search: "",
};

function matches(app: Application, f: Filters) {
  const q = f.search.trim().toLocaleLowerCase();
  return (
    (f.status === "all" || app.status === f.status) &&
    (f.work_model === "all" || app.work_model === f.work_model) &&
    (f.source === "all" || app.source === f.source) &&
    (q === "" ||
      app.company.toLocaleLowerCase().includes(q) ||
      app.role.toLocaleLowerCase().includes(q))
  );
}

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

export function ApplicationTable() {
  const { applications } = useAppData();
  const ready = useStorageReady();
  const [filters, setFilters] = useState<Filters>(NO_FILTERS);
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({
    key: "applied_at",
    dir: "desc",
  });

  // Avoid flashing the empty state before browser data is available.
  if (!ready) return null;

  if (applications.length === 0) {
    return (
      <EmptyState text={t.empty.applications}>
        <NewApplicationDialog trigger="full" />
      </EmptyState>
    );
  }

  const rows = applications
    .filter((a) => matches(a, filters))
    .sort((a, b) => compare(a, b, sort.key, sort.dir));

  function toggleSort(key: SortKey) {
    setSort((s) =>
      s.key === key
        ? { key, dir: s.dir === "asc" ? "desc" : "asc" }
        : { key, dir: DEFAULT_DIR[key] }
    );
  }

  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    setFilters((f) => ({ ...f, [key]: value }));

  const filtered =
    filters.status !== "all" ||
    filters.work_model !== "all" ||
    filters.source !== "all" ||
    filters.search.trim() !== "";

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={filters.search}
            onChange={(e) => set("search", e.target.value)}
            placeholder={t.pages.list.search}
            aria-label={t.pages.list.search}
            className="pl-9"
          />
        </div>
        <FilterSelect
          label={t.form.fields.status}
          keys={STATUSES}
          labels={t.options.status}
          value={filters.status}
          onChange={(v) => set("status", v)}
        />
        <FilterSelect
          label={t.form.fields.work_model}
          keys={WORK_MODELS}
          labels={t.options.work_model}
          value={filters.work_model}
          onChange={(v) => set("work_model", v)}
        />
        <FilterSelect
          label={t.form.fields.source}
          keys={SOURCES}
          labels={t.options.source}
          value={filters.source}
          onChange={(v) => set("source", v)}
        />
      </div>

      <div className="flex min-h-8 items-center justify-between gap-3">
        <p className="font-mono text-xs text-muted-foreground tabular-nums">
          {t.pages.list.count(rows.length, applications.length)}
        </p>
        {filtered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilters(NO_FILTERS)}
          >
            <XIcon />
            {t.pages.list.resetFilters}
          </Button>
        )}
      </div>

      {rows.length === 0 ? (
        <EmptyState text={t.pages.list.noResults}>
          <Button variant="secondary" onClick={() => setFilters(NO_FILTERS)}>
            {t.pages.list.resetFilters}
          </Button>
        </EmptyState>
      ) : (
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
      )}
    </div>
  );
}

function Row({ app }: { app: Application }) {
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

function FilterSelect<K extends string>({
  label,
  keys,
  labels,
  value,
  onChange,
}: {
  label: string;
  keys: readonly K[];
  labels: Record<K, string>;
  value: K | "all";
  onChange: (value: K | "all") => void;
}) {
  const items: Record<K | "all", string> = {
    ...labels,
    all: `${label}: ${t.pages.list.all}`,
  };

  return (
    <Select<K | "all">
      items={items}
      value={value}
      onValueChange={(v) => onChange((v ?? "all") as K | "all")}
    >
      <SelectTrigger className="w-full" aria-label={label}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{items.all}</SelectItem>
        {keys.map((key) => (
          <SelectItem key={key} value={key}>
            {labels[key]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
