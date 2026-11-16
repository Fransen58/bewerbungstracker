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

// Moves an application to a new status and logs the change as an event.
export function changeStatus(applicationId: string, status: Status) {
  const data = read();
  const current = data.applications.find((a) => a.id === applicationId);
  if (!current || current.status === status) return;

  const event: ApplicationEvent = {
    id: crypto.randomUUID(),
    application_id: applicationId,
    type: STATUS_EVENT_TYPE[status],
    date: todayISO(),
    note: null,
    from_status: current.status,
    to_status: status,
  };
  write({
    ...data,
    applications: data.applications.map((a) =>
      a.id === applicationId
        ? { ...a, status, updated_at: new Date().toISOString() }
        : a
    ),
    events: [...data.events, event],
  });
}
