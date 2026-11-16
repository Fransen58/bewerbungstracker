import { addDays, todayISO } from "./date";
import { SCHEMA_VERSION, STATUS_EVENT_TYPE, type AppData } from "./storage";
import type {
  Application,
  ApplicationEvent,
  EventType,
  Source,
  Status,
  WorkModel,
} from "./types";
import type { Messages } from "@/messages/de";

// Sample data for demo mode. All companies, people and links are invented;
// e-mails and links use the reserved example.com domain. Dates are relative
// to today, so due and overdue steps always look current.

type DemoTexts = Messages["demo"]["applications"][number];

type HistoryStep =
  // Status change on day offset `day`, optional note = index into texts.history.
  | { to: Status; day: number; note?: number }
  // Manual entry.
  | { type: EventType; day: number; note: number };

type DemoSpec = {
  company: string;
  source: Source;
  work_model: WorkModel;
  fit: number;
  cv: string | null;
  contact?: { name: string; email: string };
  appliedDay: number | null;
  nextDay: number | null;
  createdDay: number;
  history: HistoryStep[];
};

const SPECS: DemoSpec[] = [
  { company: "Nordlicht Analytics", source: "linkedin", work_model: "remote", fit: 78, cv: null,
    appliedDay: null, nextDay: 2, createdDay: -3, history: [] },
  { company: "Kieselgrund Software", source: "zuhausejobs", work_model: "remote", fit: 64, cv: null,
    appliedDay: null, nextDay: 6, createdDay: -1, history: [] },
  { company: "Fernblick Mobility", source: "join", work_model: "hybrid", fit: 71, cv: "DE Builder",
    appliedDay: -9, nextDay: -2, createdDay: -12,
    history: [{ to: "applied", day: -9 }] },
  { company: "Blauwal Logistik", source: "career_site", work_model: "onsite", fit: 55, cv: "DE Builder",
    appliedDay: -4, nextDay: null, createdDay: -6,
    history: [{ to: "applied", day: -4 }] },
  { company: "Silberdistel Health", source: "linkedin", work_model: "remote", fit: 85, cv: "EN Element",
    contact: { name: "Lena Morgenroth", email: "lena.morgenroth@example.com" },
    appliedDay: -18, nextDay: 0, createdDay: -20,
    history: [
      { to: "applied", day: -18 },
      { type: "note", day: -10, note: 0 },
      { to: "first_interview", day: -7, note: 1 },
    ] },
  { company: "Hafenkran Digital", source: "recruiter", work_model: "hybrid", fit: 69, cv: "DE Builder",
    contact: { name: "Tarek Albers", email: "t.albers@example.com" },
    appliedDay: -15, nextDay: 3, createdDay: -16,
    history: [
      { to: "applied", day: -15 },
      { to: "first_interview", day: -5 },
      { type: "note", day: -5, note: 0 },
    ] },
  { company: "Wolkenfabrik Studio", source: "linkedin", work_model: "remote", fit: 88, cv: "EN Element",
    contact: { name: "Ida Wellner", email: "ida@example.com" },
    appliedDay: -25, nextDay: 1, createdDay: -27,
    history: [
      { to: "applied", day: -25 },
      { to: "first_interview", day: -16 },
      { type: "case", day: -9, note: 0 },
      { to: "further_round", day: -6, note: 1 },
    ] },
  { company: "Grünspecht Energie", source: "career_site", work_model: "hybrid", fit: 74, cv: "DE Builder",
    appliedDay: -28, nextDay: 5, createdDay: -29,
    history: [
      { to: "applied", day: -28 },
      { to: "first_interview", day: -14 },
      { to: "further_round", day: -4 },
    ] },
  { company: "Morgentau Finance", source: "join", work_model: "remote", fit: 81, cv: "EN Element",
    contact: { name: "Noah Brenner", email: "noah.brenner@example.com" },
    appliedDay: -35, nextDay: 4, createdDay: -36,
    history: [
      { to: "applied", day: -35 },
      { to: "first_interview", day: -27 },
      { to: "further_round", day: -19 },
      { to: "offer", day: -3, note: 0 },
    ] },
  { company: "Lindenhof Labs", source: "linkedin", work_model: "remote", fit: 90, cv: "EN Element",
    appliedDay: -50, nextDay: null, createdDay: -52,
    history: [
      { to: "applied", day: -50 },
      { to: "first_interview", day: -41 },
      { to: "further_round", day: -33 },
      { to: "offer", day: -25 },
      { to: "accepted", day: -20, note: 0 },
    ] },
  { company: "Steinbock Systems", source: "zuhausejobs", work_model: "onsite", fit: 52, cv: "DE Builder",
    appliedDay: -30, nextDay: null, createdDay: -31,
    history: [
      { to: "applied", day: -30 },
      { to: "first_interview", day: -21 },
      { to: "rejected", day: -12, note: 0 },
    ] },
  { company: "Papierkranich Verlag", source: "other", work_model: "onsite", fit: 48, cv: "DE Builder",
    appliedDay: -22, nextDay: null, createdDay: -23,
    history: [
      { to: "applied", day: -22 },
      { to: "first_interview", day: -17 },
      { to: "withdrawn", day: -11, note: 0 },
    ] },
];

export function createDemoData(texts: Messages["demo"]): AppData {
  const today = todayISO();
  const day = (offset: number) => addDays(today, offset);
  const now = new Date().toISOString();
  const applications: Application[] = [];
  const events: ApplicationEvent[] = [];

  SPECS.forEach((spec, i) => {
    const text: DemoTexts = texts.applications[i];
    const id = `demo-${i + 1}`;
    let status: Status = "discovered";

    spec.history.forEach((step, j) => {
      const note = step.note === undefined ? null : text.history[step.note];
      if ("to" in step) {
        events.push({
          id: `${id}-e${j}`,
          application_id: id,
          type: STATUS_EVENT_TYPE[step.to],
          date: day(step.day),
          note,
          from_status: status,
          to_status: step.to,
        });
        status = step.to;
      } else {
        events.push({
          id: `${id}-e${j}`,
          application_id: id,
          type: step.type,
          date: day(step.day),
          note,
          from_status: null,
          to_status: null,
        });
      }
    });

    applications.push({
      id,
      company: spec.company,
      role: text.role,
      job_url: `https://example.com/jobs/${id}`,
      source: spec.source,
      status,
      work_model: spec.work_model,
      workation: text.workation,
      salary_range: text.salary,
      fit_score: spec.fit,
      contact_name: spec.contact?.name ?? null,
      contact_email: spec.contact?.email ?? null,
      cv_version: spec.cv,
      requirements: null,
      notes: text.notes,
      applied_at: spec.appliedDay === null ? null : day(spec.appliedDay),
      next_step: spec.nextDay === null ? null : text.nextStep,
      next_step_date: spec.nextDay === null ? null : day(spec.nextDay),
      created_at: new Date(day(spec.createdDay) + "T09:00:00").toISOString(),
      updated_at: now,
    });
  });

  return { schemaVersion: SCHEMA_VERSION, applications, events };
}
