import { useSyncExternalStore } from "react";
import { todayISO } from "./date";
import type {
  Application,
  ApplicationEvent,
  EventType,
  Status,
} from "./types";

// Browser storage layer. All reads and writes of app data go through here.
// Real data and demo data live under separate keys and never mix; the
// active mode decides which one is read and written.

const KEYS = {
  real: "bewerbungstracker:data",
  demo: "bewerbungstracker:demo",
  mode: "bewerbungstracker:mode",
} as const;
export const SCHEMA_VERSION = 3;

export type AppMode = "real" | "demo";

export type AppData = {
  schemaVersion: number;
  applications: Application[];
  events: ApplicationEvent[];
  // The user's own profile for fit assessments (schema v3).
  profile: string | null;
};

const EMPTY: AppData = {
  schemaVersion: SCHEMA_VERSION,
  applications: [],
  events: [],
  profile: null,
};

// Cached snapshots: useSyncExternalStore requires the same object
// reference as long as nothing has changed.
let modeCache: AppMode | null = null;
let dataCache: AppData | null = null;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function readMode(): AppMode {
  if (!modeCache) {
    modeCache =
      window.localStorage.getItem(KEYS.mode) === "demo" ? "demo" : "real";
  }
  return modeCache;
}

// Brings data from an older schema version up to the current one.
// Version 2 added `requirements`, version 3 `fit_assessment` and `profile`;
// older data gets them as empty. The result is stored on the next write.
export function migrate<
  T extends { schemaVersion: number; applications: unknown[]; profile?: unknown }
>(data: T): T {
  if (data.schemaVersion >= SCHEMA_VERSION) return data;
  return {
    ...data,
    schemaVersion: SCHEMA_VERSION,
    profile: data.profile ?? null,
    applications: data.applications.map((a) =>
      typeof a === "object" && a !== null
        ? { requirements: null, fit_assessment: null, ...a }
        : a
    ),
  };
}

function read(): AppData {
  if (dataCache) return dataCache;
  const raw = window.localStorage.getItem(KEYS[readMode()]);
  dataCache = raw ? migrate(JSON.parse(raw) as AppData) : EMPTY;
  return dataCache;
}

function write(data: AppData) {
  window.localStorage.setItem(KEYS[readMode()], JSON.stringify(data));
  dataCache = data;
  notify();
}

function setMode(mode: AppMode) {
  window.localStorage.setItem(KEYS.mode, mode);
  modeCache = mode;
  dataCache = null;
  notify();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Keep other open tabs in sync.
  const keys: (string | null)[] = Object.values(KEYS);
  const onStorage = (e: StorageEvent) => {
    if (!keys.includes(e.key)) return;
    modeCache = null;
    dataCache = null;
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

// React hook: returns the active data and re-renders on every change.
// During the static build (no window) it returns the empty state.
export function useAppData(): AppData {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

// React hook: the active mode ("real" during the static build).
export function useAppMode(): AppMode {
  return useSyncExternalStore(subscribe, readMode, () => "real");
}

// Switches to demo mode. Existing demo data is kept; if there is none,
// the given sample data is stored first.
export function startDemo(createSample: () => AppData) {
  if (!window.localStorage.getItem(KEYS.demo)) {
    window.localStorage.setItem(KEYS.demo, JSON.stringify(createSample()));
  }
  setMode("demo");
}

// Replaces the demo data with fresh sample data.
export function resetDemo(createSample: () => AppData) {
  window.localStorage.setItem(KEYS.demo, JSON.stringify(createSample()));
  dataCache = null;
  notify();
}

// Back to the real data, which demo mode never touched.
export function endDemo() {
  setMode("real");
}

const noopSubscribe = () => () => {};

// False in the prerendered HTML and during hydration, true once browser
// data is available. Lets views avoid flashing an empty or "not found" state.
export function useStorageReady(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );
}

export type NewApplication = Omit<
  Application,
  "id" | "created_at" | "updated_at"
>;

export function addApplication(input: NewApplication): Application {
  const now = new Date().toISOString();
  const application: Application = {
    ...input,
    id: crypto.randomUUID(),
    created_at: now,
    updated_at: now,
  };
  const data = read();
  write({ ...data, applications: [...data.applications, application] });
  return application;
}

// Which event type a status change is logged as.
export const STATUS_EVENT_TYPE: Record<Status, EventType> = {
  discovered: "note",
  applied: "applied",
  first_interview: "interview",
  further_round: "interview",
  offer: "offer",
  accepted: "note",
  rejected: "rejection",
  withdrawn: "note",
};

function statusEvent(
  applicationId: string,
  from: Status,
  to: Status
): ApplicationEvent {
  return {
    id: crypto.randomUUID(),
    application_id: applicationId,
    type: STATUS_EVENT_TYPE[to],
    date: todayISO(),
    note: null,
    from_status: from,
    to_status: to,
  };
}

// Moves an application to a new status and logs the change as an event.
export function changeStatus(applicationId: string, status: Status) {
  const current = read().applications.find((a) => a.id === applicationId);
  if (!current || current.status === status) return;
  updateApplication(applicationId, { ...current, status });
}

// Replaces all editable fields. A status change is logged as an event.
export function updateApplication(applicationId: string, input: NewApplication) {
  const data = read();
  const current = data.applications.find((a) => a.id === applicationId);
  if (!current) return;

  const statusChanged = current.status !== input.status;
  write({
    ...data,
    applications: data.applications.map((a) =>
      a.id === applicationId
        ? { ...a, ...input, updated_at: new Date().toISOString() }
        : a
    ),
    events: statusChanged
      ? [...data.events, statusEvent(applicationId, current.status, input.status)]
      : data.events,
  });
}

// Removes an application together with all of its events.
export function deleteApplication(applicationId: string) {
  const data = read();
  write({
    ...data,
    applications: data.applications.filter((a) => a.id !== applicationId),
    events: data.events.filter((e) => e.application_id !== applicationId),
  });
}

// Stores the user's profile; empty text removes it.
export function setProfile(profile: string) {
  const text = profile.trim();
  write({ ...read(), profile: text === "" ? null : text });
}

// Replaces all data at once (for import). Input must be validated before.
export function replaceAppData(data: AppData) {
  write(data);
}

export type NewEvent = Pick<
  ApplicationEvent,
  "application_id" | "type" | "date" | "note"
>;

// Adds a manual event (not a status change).
export function addEvent(input: NewEvent) {
  const data = read();
  const event: ApplicationEvent = {
    ...input,
    id: crypto.randomUUID(),
    from_status: null,
    to_status: null,
  };
  write({ ...data, events: [...data.events, event] });
}
