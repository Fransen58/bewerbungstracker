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
  const responded = applied.filter(respondedCheck(events)).length;
  return {
    responded,
    applied: applied.length,
    rate: applied.length === 0 ? null : responded / applied.length,
  };
}

// Returns a check whether an application got a response, from its current
// status or its history.
function respondedCheck(events: ApplicationEvent[]) {
  const everResponded = new Set(
    events
      .filter((e) => e.to_status && RESPONSE_STATUSES.has(e.to_status))
      .map((e) => e.application_id)
  );
  return (a: Application) =>
    RESPONSE_STATUSES.has(a.status) || everResponded.has(a.id);
}

export type CvVersionStats = {
  // Most common spelling of the version; null for "no version given".
  name: string | null;
  applied: number;
  responded: number;
  rate: number;
};

// Story 17: response rate per CV version, over sent applications only.
// Versions are grouped regardless of case and extra spaces. Sorted by rate,
// then by number of applications; "no version" always comes last.
export function responseByCv(
  apps: Application[],
  events: ApplicationEvent[]
): CvVersionStats[] {
  const responded = respondedCheck(events);
  const groups = new Map<
    string | null,
    { spellings: Map<string, number>; applied: number; responded: number }
  >();

  for (const app of apps) {
    if (app.status === "discovered") continue;
    const spelling = app.cv_version?.trim().replace(/\s+/g, " ") || null;
    const key = spelling?.toLowerCase() ?? null;
    const group = groups.get(key) ?? { spellings: new Map(), applied: 0, responded: 0 };
    if (spelling) group.spellings.set(spelling, (group.spellings.get(spelling) ?? 0) + 1);
    group.applied++;
    if (responded(app)) group.responded++;
    groups.set(key, group);
  }

  return [...groups.entries()]
    .map(([key, g]) => ({
      // Ties keep the spelling that came first.
      name:
        key === null
          ? null
          : [...g.spellings].reduce((best, s) => (s[1] > best[1] ? s : best))[0],
      applied: g.applied,
      responded: g.responded,
      rate: g.responded / g.applied,
    }))
    .sort(
      (a, b) =>
        Number(a.name === null) - Number(b.name === null) ||
        b.rate - a.rate ||
        b.applied - a.applied
    );
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
