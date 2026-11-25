"use client";

import { useState } from "react";
import { SearchIcon, SlidersHorizontalIcon } from "lucide-react";
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
import {
  SOURCES,
  STATUSES,
  WORK_MODELS,
  type Application,
  type Source,
  type Status,
  type WorkModel,
} from "@/lib/types";
import { useT } from "@/lib/i18n";

// Search and filters shared by the board and the list view (story 15).

export type Filters = {
  status: Status | "all";
  work_model: WorkModel | "all";
  source: Source | "all";
  search: string;
};

export const NO_FILTERS: Filters = {
  status: "all",
  work_model: "all",
  source: "all",
  search: "",
};

export function matches(app: Application, f: Filters) {
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

export function isFiltered(f: Filters) {
  return (
    f.status !== "all" ||
    f.work_model !== "all" ||
    f.source !== "all" ||
    f.search.trim() !== ""
  );
}

export function FilterBar({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (filters: Filters) => void;
}) {
  const t = useT();
  // On phones the three filters fold away behind a button; search stays.
  const [open, setOpen] = useState(false);
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    onChange({ ...filters, [key]: value });
  const active = (["status", "work_model", "source"] as const).filter(
    (key) => filters[key] !== "all",
  ).length;

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
      <div className="flex gap-2">
        <div className="relative flex-1">
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
        <Button
          type="button"
          variant="secondary"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="sm:hidden"
        >
          <SlidersHorizontalIcon />
          {active > 0
            ? t.pages.list.filtersActive(active)
            : t.pages.list.filters}
        </Button>
      </div>
      <div className={cn("contents", !open && "max-sm:hidden")}>
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
    </div>
  );
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
  const t = useT();
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
        {/* Always "Label: value", also once a value is chosen. */}
        <SelectValue>
          {(v: K | "all") => (v === "all" ? items.all : `${label}: ${labels[v]}`)}
        </SelectValue>
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
