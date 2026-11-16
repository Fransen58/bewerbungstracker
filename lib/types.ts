// Domain types, following the data model in SPEC.md.
// Choice values are stored as fixed English keys and only translated in the UI.

export const STATUSES = [
  "discovered",
  "applied",
  "first_interview",
  "further_round",
  "offer",
  "accepted",
  "rejected",
  "withdrawn",
] as const;
export type Status = (typeof STATUSES)[number];

export const SOURCES = [
  "zuhausejobs",
  "linkedin",
  "join",
  "career_site",
  "recruiter",
  "other",
] as const;
export type Source = (typeof SOURCES)[number];

export const WORK_MODELS = ["remote", "hybrid", "onsite"] as const;
export type WorkModel = (typeof WORK_MODELS)[number];

export const EVENT_TYPES = [
  "applied",
  "interview",
  "case",
  "rejection",
  "offer",
  "note",
] as const;
export type EventType = (typeof EVENT_TYPES)[number];

// Optional fields are null when empty. Dates are ISO strings (YYYY-MM-DD),
// timestamps full ISO date-time strings.
export type Application = {
  id: string;
  company: string;
  role: string;
  job_url: string | null;
  source: Source | null;
  status: Status;
  work_model: WorkModel | null;
  workation: string | null;
  salary_range: string | null;
  fit_score: number | null;
  contact_name: string | null;
  contact_email: string | null;
  cv_version: string | null;
  notes: string | null;
  applied_at: string | null;
  next_step: string | null;
  next_step_date: string | null;
  created_at: string;
  updated_at: string;
};

export type ApplicationEvent = {
  id: string;
  application_id: string;
  type: EventType;
  date: string;
  note: string | null;
};
