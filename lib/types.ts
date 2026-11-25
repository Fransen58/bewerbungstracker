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

export const CONFIDENCE_LEVELS = ["low", "medium", "high"] as const;
export type Confidence = (typeof CONFIDENCE_LEVELS)[number];

// The latest AI fit assessment (story 12). The score is also written to
// fit_score; once the user changes fit_score, it is no longer the AI's value.
export type FitAssessment = {
  score: number;
  confidence: Confidence;
  // Biggest gap between profile and job, null if there is none.
  gap: string | null;
  reason: string;
  created_at: string;
};

// Coaching advice for a question the profile covers not or only partly.
export type InterviewAdvice = {
  assessment: string;
  bridge: string;
  first_step: string;
  wording: string;
};

// AI interview preparation for one job (story 14).
export type InterviewPrep = {
  // Likely questions, each with a matching example from the profile, or
  // null if the profile has none. Advice was added later; preparations
  // stored before have no advice field, which counts as null.
  questions: {
    question: string;
    example: string | null;
    advice?: InterviewAdvice | null;
  }[];
  // Questions the user can ask the company.
  ask: string[];
  created_at: string;
};

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
  // Must-have requirements from the job ad, one per line (schema v2).
  requirements: string | null;
  // Latest AI fit assessment (schema v3).
  fit_assessment: FitAssessment | null;
  // AI interview preparation (schema v4).
  interview_prep: InterviewPrep | null;
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
  // Set only for events logged by a status change.
  from_status: Status | null;
  to_status: Status | null;
};
