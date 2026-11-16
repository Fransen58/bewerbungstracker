import { addDays } from "./date";
import {
  STATUSES,
  type Application,
  type ApplicationEvent,
  type Status,
} from "./types";

// Key figures for the overview page. Pure functions, no UI.

export function countByStatus(apps: Application[]): Record<Status, number> {
  const counts = Object.fromEntries(STATUSES.map((s) => [s, 0])) as Record<
    Status,
    number
  >;
  for (const app of apps) counts[app.status]++;
  return counts;
}

// Statuses that mean the company has responded.
const RESPONSE_STATUSES: ReadonlySet<Status> = new Set([
  "first_interview",
  "further_round",
  "offer",
  "accepted",
  "rejected",
]);

// Applied = no longer "discovered". Responded = was in a response status at
// any point, current status or history (e.g. withdrawn after an interview).
export function responseRate(
  apps: Application[],
  events: ApplicationEvent[]
): { responded: number; applied: number; rate: number | null } {
  const applied = apps.filter((a) => a.status !== "discovered");
  const everResponded = new Set(
    events
      .filter((e) => e.to_status && RESPONSE_STATUSES.has(e.to_status))
      .map((e) => e.application_id)
  );
  const responded = applied.filter(
    (a) => RESPONSE_STATUSES.has(a.status) || everResponded.has(a.id)
  ).length;
  return {
    responded,
    applied: applied.length,
    rate: applied.length === 0 ? null : responded / applied.length,
  };
}

export function averageFit(apps: Application[]): {
  average: number | null;
  count: number;
} {
  const scores = apps
    .map((a) => a.fit_score)
    .filter((s): s is number => s !== null);
  return {
    average:
      scores.length === 0
        ? null
        : scores.reduce((sum, s) => sum + s, 0) / scores.length,
    count: scores.length,
  };
}

// Next steps due within the next 7 days, plus overdue ones, soonest first.
export function dueThisWeek(apps: Application[], today: string) {
  const end = addDays(today, 7);
  return apps
    .filter(
      (a): a is Application & { next_step_date: string } =>
        a.next_step_date !== null && a.next_step_date <= end
    )
    .sort((a, b) => (a.next_step_date < b.next_step_date ? -1 : 1));
}
