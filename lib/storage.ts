import { useSyncExternalStore } from "react";
import { todayISO } from "./date";
import type {
  Application,
  ApplicationEvent,
  EventType,
  Status,
} from "./types";

// Browser storage layer. All reads and writes of app data go through here.

const STORAGE_KEY = "bewerbungstracker:data";
export const SCHEMA_VERSION = 1;

export type AppData = {
  schemaVersion: number;
  applications: Application[];
  events: ApplicationEvent[];
};

const EMPTY: AppData = {
  schemaVersion: SCHEMA_VERSION,
  applications: [],
  events: [],
};

// Cached snapshot: useSyncExternalStore requires the same object
// reference as long as the data has not changed.
let cache: AppData | null = null;
const listeners = new Set<() => void>();

function read(): AppData {
  if (cache) return cache;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  cache = raw ? (JSON.parse(raw) as AppData) : EMPTY;
  return cache;
}

function write(data: AppData) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  cache = data;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Keep other open tabs in sync.
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    cache = null;
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

// React hook: returns the current data and re-renders on every change.
// During the static build (no window) it returns the empty state.
export function useAppData(): AppData {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
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
const STATUS_EVENT_TYPE: Record<Status, EventType> = {
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
