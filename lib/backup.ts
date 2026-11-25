import { SCHEMA_VERSION, migrate, type AppData } from "./storage";
import {
  CONFIDENCE_LEVELS,
  EVENT_TYPES,
  SOURCES,
  STATUSES,
  WORK_MODELS,
  type Application,
  type ApplicationEvent,
} from "./types";

// Backup file format and validation. A file from outside is never trusted:
// everything is checked before anything is stored.

const APP_ID = "bewerbungstracker";

export type BackupFile = {
  app: typeof APP_ID;
  schemaVersion: number;
  exportedAt: string;
  applications: Application[];
  events: ApplicationEvent[];
  profile: string | null;
};

export function createBackup(data: AppData): BackupFile {
  return {
    app: APP_ID,
    schemaVersion: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    applications: data.applications,
    events: data.events,
    profile: data.profile,
  };
}

// Errors are codes, not texts, so the UI can translate them.
export type BackupError =
  | { code: "invalidJson" }
  | { code: "notBackup" }
  | { code: "newerVersion" }
  | { code: "invalidApplication"; index: number; field: string }
  | { code: "invalidEvent"; index: number; field: string }
  | { code: "duplicateId"; id: string };

export type ParseResult =
  | { ok: true; data: AppData }
  | { ok: false; error: BackupError };

type Obj = Record<string, unknown>;

const isObj = (v: unknown): v is Obj =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const isText = (v: unknown) => typeof v === "string" && v.trim() !== "";
const isOptText = (v: unknown) => v === null || typeof v === "string";
const isDay = (v: unknown) =>
  typeof v === "string" &&
  /^\d{4}-\d{2}-\d{2}$/.test(v) &&
  !Number.isNaN(Date.parse(v));
const isOptDay = (v: unknown) => v === null || isDay(v);
const isTimestamp = (v: unknown) =>
  typeof v === "string" && !Number.isNaN(Date.parse(v));
const isOneOf = (list: readonly string[]) => (v: unknown) =>
  typeof v === "string" && list.includes(v);
const isOptOneOf = (list: readonly string[]) => (v: unknown) =>
  v === null || isOneOf(list)(v);
const isOptUrl = (v: unknown) => {
  if (v === null) return true;
  if (typeof v !== "string") return false;
  try {
    const url = new URL(v);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};
const isOptFit = (v: unknown) =>
  v === null || (Number.isInteger(v) && (v as number) >= 0 && (v as number) <= 100);
const isOptAssessment = (v: unknown) =>
  v === null ||
  (isObj(v) &&
    isOptFit(v.score) &&
    v.score !== null &&
    isOneOf(CONFIDENCE_LEVELS)(v.confidence) &&
    isOptText(v.gap) &&
    isText(v.reason) &&
    isTimestamp(v.created_at));
const isTextList = (v: unknown) => Array.isArray(v) && v.every(isText);
const isAdvice = (v: unknown) =>
  isObj(v) &&
  ["assessment", "bridge", "first_step", "wording"].every((k) => isText(v[k]));
const isOptInterviewPrep = (v: unknown) =>
  v === null ||
  (isObj(v) &&
    Array.isArray(v.questions) &&
    v.questions.every(
      (q) =>
        isObj(q) &&
        isText(q.question) &&
        isOptText(q.example) &&
        (q.advice === undefined || q.advice === null || isAdvice(q.advice))
    ) &&
    isTextList(v.ask) &&
    isTimestamp(v.created_at));

// One check per field, following the data model.
const APPLICATION_FIELDS: Record<keyof Application, (v: unknown) => boolean> = {
  id: isText,
  company: isText,
  role: isText,
  job_url: isOptUrl,
  source: isOptOneOf(SOURCES),
  status: isOneOf(STATUSES),
  work_model: isOptOneOf(WORK_MODELS),
  workation: isOptText,
  salary_range: isOptText,
  fit_score: isOptFit,
  contact_name: isOptText,
  contact_email: isOptText,
  cv_version: isOptText,
  requirements: isOptText,
  fit_assessment: isOptAssessment,
  interview_prep: isOptInterviewPrep,
  notes: isOptText,
  applied_at: isOptDay,
  next_step: isOptText,
  next_step_date: isOptDay,
  created_at: isTimestamp,
  updated_at: isTimestamp,
};

const EVENT_FIELDS: Record<keyof ApplicationEvent, (v: unknown) => boolean> = {
  id: isText,
  application_id: isText,
  type: isOneOf(EVENT_TYPES),
  date: isDay,
  note: isOptText,
  from_status: isOptOneOf(STATUSES),
  to_status: isOptOneOf(STATUSES),
};

// Returns the first field that fails its check, or null if all pass.
function firstInvalidField(
  item: unknown,
  fields: Record<string, (v: unknown) => boolean>
): string | null {
  if (!isObj(item)) return "-";
  for (const [field, check] of Object.entries(fields)) {
    if (!(field in item) || !check(item[field])) return field;
  }
  return null;
}

export function parseBackup(text: string): ParseResult {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, error: { code: "invalidJson" } };
  }

  if (
    !isObj(raw) ||
    raw.app !== APP_ID ||
    typeof raw.schemaVersion !== "number" ||
    !Array.isArray(raw.applications) ||
    !Array.isArray(raw.events)
  ) {
    return { ok: false, error: { code: "notBackup" } };
  }
  if (raw.schemaVersion > SCHEMA_VERSION) {
    return { ok: false, error: { code: "newerVersion" } };
  }
  // Backups from older versions are upgraded before they are checked.
  const { applications, profile } = migrate({
    schemaVersion: raw.schemaVersion,
    applications: raw.applications,
    profile: raw.profile,
  });
  const events = raw.events;
  if (!isOptText(profile)) {
    return { ok: false, error: { code: "notBackup" } };
  }

  const ids = new Set<string>();
  for (const [index, app] of applications.entries()) {
    const field = firstInvalidField(app, APPLICATION_FIELDS);
    if (field) {
      return { ok: false, error: { code: "invalidApplication", index, field } };
    }
    const id = (app as Application).id;
    if (ids.has(id)) return { ok: false, error: { code: "duplicateId", id } };
    ids.add(id);
  }

  const eventIds = new Set<string>();
  for (const [index, event] of events.entries()) {
    const field = firstInvalidField(event, EVENT_FIELDS);
    if (field) return { ok: false, error: { code: "invalidEvent", index, field } };
    const e = event as ApplicationEvent;
    if (!ids.has(e.application_id)) {
      return {
        ok: false,
        error: { code: "invalidEvent", index, field: "application_id" },
      };
    }
    if (eventIds.has(e.id)) return { ok: false, error: { code: "duplicateId", id: e.id } };
    eventIds.add(e.id);
  }

  // Only known fields are kept; anything extra in the file is dropped.
  const pick = <T,>(item: unknown, fields: Record<string, unknown>) =>
    Object.fromEntries(
      Object.keys(fields).map((f) => [f, (item as Obj)[f]])
    ) as T;

  return {
    ok: true,
    data: {
      schemaVersion: SCHEMA_VERSION,
      applications: applications.map((a) =>
        pick<Application>(a, APPLICATION_FIELDS)
      ),
      events: events.map((e) => pick<ApplicationEvent>(e, EVENT_FIELDS)),
      profile: profile as string | null,
    },
  };
}
