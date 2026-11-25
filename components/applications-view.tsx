"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { KanbanIcon, ListIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  FilterBar,
  NO_FILTERS,
  isFiltered,
  matches,
  type Filters,
} from "@/components/application-filters";
import { ApplicationTable } from "@/components/application-table";
import { Board } from "@/components/board";
import { EmptyState } from "@/components/empty-state";
import { NoApplications } from "@/components/no-applications";
import { PageHeader } from "@/components/page-header";
import { useAppData, useStorageReady } from "@/lib/storage";
import { useT } from "@/lib/i18n";

const VIEWS = ["board", "list"] as const;
type View = (typeof VIEWS)[number];

// The last chosen view, remembered in this browser.
const VIEW_KEY = "bewerbungstracker:view";

function storedView(): View {
  try {
    return window.localStorage.getItem(VIEW_KEY) === "list" ? "list" : "board";
  } catch {
    return "board";
  }
}

// Story 15: all applications on one page, as board or list, with search and
// filters that apply to both views.
export function ApplicationsView() {
  const t = useT();
  const router = useRouter();
  const param = useSearchParams().get("view");
  const ready = useStorageReady();
  const { applications } = useAppData();
  // Filters live here, so they survive switching the view.
  const [filters, setFilters] = useState<Filters>(NO_FILTERS);

  // Avoid flashing the empty state before browser data is available.
  if (!ready) return null;

  const view: View =
    param === "list" || param === "board" ? param : storedView();

  function switchView(next: View) {
    try {
      window.localStorage.setItem(VIEW_KEY, next);
    } catch {}
    router.replace(`/applications?view=${next}`, { scroll: false });
  }

  const shown = applications.filter((a) => matches(a, filters));
  const filtered = isFiltered(filters);

  return (
    <>
      <PageHeader title={t.pages.applications.title}>
        {applications.length > 0 && (
          <ViewSwitch view={view} onChange={switchView} />
        )}
      </PageHeader>

      {applications.length === 0 ? (
        <NoApplications />
      ) : (
        <div className="space-y-4">
          <FilterBar filters={filters} onChange={setFilters} />

          <div className="flex min-h-8 items-center justify-between gap-3">
            <p className="font-mono text-xs text-muted-foreground tabular-nums">
              {t.pages.list.count(shown.length, applications.length)}
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

          {shown.length === 0 ? (
            <EmptyState text={t.pages.list.noResults}>
              <Button
                variant="secondary"
                onClick={() => setFilters(NO_FILTERS)}
              >
                {t.pages.list.resetFilters}
              </Button>
            </EmptyState>
          ) : view === "board" ? (
            <Board
              applications={shown}
              statuses={filters.status === "all" ? undefined : [filters.status]}
            />
          ) : (
            <ApplicationTable applications={shown} />
          )}
        </div>
      )}
    </>
  );
}

// Segmented pill like the language switch (see DESIGN.md).
function ViewSwitch({
  view,
  onChange,
}: {
  view: View;
  onChange: (view: View) => void;
}) {
  const t = useT();
  const a = t.pages.applications;
  const icons = { board: KanbanIcon, list: ListIcon };

  return (
    <div
      role="group"
      aria-label={a.view}
      className="relative inline-grid h-9 grid-cols-2 rounded-full bg-secondary p-1"
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full bg-primary transition-transform duration-200 ease-soft motion-reduce:transition-none",
          view === "list" && "translate-x-full"
        )}
      />
      {VIEWS.map((v) => {
        const Icon = icons[v];
        return (
          <button
            key={v}
            type="button"
            aria-pressed={view === v}
            onClick={() => onChange(v)}
            className={cn(
              "relative z-10 inline-flex items-center justify-center gap-1.5 rounded-full px-3 text-sm font-medium transition-colors duration-200 ease-soft",
              view === v ? "text-primary-foreground" : "text-foreground"
            )}
          >
            <Icon className="size-4" />
            {a.views[v]}
          </button>
        );
      })}
    </div>
  );
}
