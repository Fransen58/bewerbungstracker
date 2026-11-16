"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { NoApplications } from "@/components/no-applications";
import { StatusBadge, StatusDot } from "@/components/status-badge";
import { formatDate, todayISO } from "@/lib/date";
import {
  averageFit,
  countByStatus,
  dueThisWeek,
  responseRate,
} from "@/lib/metrics";
import { useAppData, useStorageReady } from "@/lib/storage";
import { STATUSES } from "@/lib/types";
import { useT } from "@/lib/i18n";

export function Dashboard() {
  const t = useT();
  const { applications, events } = useAppData();
  const ready = useStorageReady();

  // Avoid flashing the empty state before browser data is available.
  if (!ready) return null;

  if (applications.length === 0) {
    return (
      <NoApplications />
    );
  }

  const o = t.pages.overview;
  const response = responseRate(applications, events);
  const fit = averageFit(applications);
  const percent = new Intl.NumberFormat(t.locale, { style: "percent" });
  const whole = new Intl.NumberFormat(t.locale, { maximumFractionDigits: 0 });

  return (
    <div className="space-y-12">
      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-3">
        <Kpi
          label={o.responseRate}
          value={response.rate === null ? "–" : percent.format(response.rate)}
          detail={o.responseDetail(response.responded, response.applied)}
        />
        <Kpi
          label={o.avgFit}
          value={fit.average === null ? "–" : whole.format(fit.average)}
          detail={o.avgFitDetail(fit.count)}
        />
        <Kpi label={o.total} value={String(applications.length)} />
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
        <StatusCounts />
        <DueList />
      </div>
    </div>
  );
}

function Kpi({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div>
      <p className="label-caps border-b pb-2">{label}</p>
      <p className="mt-4 text-5xl leading-none font-normal tracking-[-0.04em] tabular-nums">
        {value}
      </p>
      {detail && (
        <p className="mt-2 text-[13px] leading-[18px] text-muted-foreground">
          {detail}
        </p>
      )}
    </div>
  );
}

function StatusCounts() {
  const t = useT();
  const { applications } = useAppData();
  const counts = countByStatus(applications);

  return (
    <section>
      <h2 className="label-caps border-b pb-2">{t.pages.overview.byStatus}</h2>
      <ul className="divide-y">
        {STATUSES.map((status) => (
          <li
            key={status}
            className="flex items-center justify-between gap-4 py-2.5 text-sm"
          >
            <span className="flex items-center gap-2">
              <StatusDot status={status} />
              {t.options.status[status]}
            </span>
            <span
              className={cn(
                "text-right font-mono text-[13px] tabular-nums",
                counts[status] === 0 && "text-muted-foreground"
              )}
            >
              {counts[status]}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function DueList() {
  const t = useT();
  const { applications } = useAppData();
  const today = todayISO();
  const due = dueThisWeek(applications, today);

  return (
    <section>
      <h2 className="label-caps border-b pb-2">{t.pages.overview.due}</h2>
      {due.length === 0 ? (
        <p className="py-4 text-sm text-muted-foreground">
          {t.pages.overview.dueEmpty}
        </p>
      ) : (
        <ul className="divide-y">
          {due.map((app) => {
            const overdue = app.next_step_date < today;
            return (
              <li
                key={app.id}
                className="relative grid grid-cols-[6.5rem_1fr] gap-4 py-3 transition-colors duration-200 ease-soft hover:bg-muted/50"
              >
                <span
                  className={cn(
                    "pt-0.5 font-mono text-xs leading-[18px] text-muted-foreground tabular-nums",
                    overdue && "font-medium text-destructive"
                  )}
                >
                  {app.next_step_date === today
                    ? t.pages.overview.today
                    : formatDate(app.next_step_date, t.locale)}
                  {overdue && (
                    <span className="block">{t.pages.board.overdue}</span>
                  )}
                </span>
                <div className="min-w-0">
                  <p className="text-sm">{app.next_step ?? "–"}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                    {/* Stretched link: the whole row opens the detail page. */}
                    <Link
                      href={`/application?id=${app.id}`}
                      className="text-[13px] font-medium tracking-[-0.02em] outline-none after:absolute after:inset-0 focus-visible:after:ring-3 focus-visible:after:ring-ring/40"
                    >
                      {app.company}
                    </Link>
                    <StatusBadge status={app.status} className="text-xs" />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
