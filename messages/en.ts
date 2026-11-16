import type { Messages } from "./de";

// English UI texts. Typed against the German file so no key can be missing.
export const en: Messages = {
  locale: "en-GB",
  app: {
    name: "Application Tracker",
    description: "All your job applications in one place.",
  },
  nav: {
    overview: "Overview",
    board: "Board",
    list: "List",
    openMenu: "Open menu",
  },
  pages: {
    overview: {
      title: "Overview",
      placeholder: "The dashboard with your key figures will live here.",
    },
    board: {
      title: "Board",
      overdue: "Overdue",
      changeStatus: "Change status",
      dragInstructions:
        "Press space to pick up the card. Move it with the arrow keys, press space to drop it or escape to cancel.",
      announce: {
        start: (company: string) => `Picked up ${company}.`,
        over: (company: string, column: string) =>
          `${company} is over column ${column}.`,
        end: (company: string, column: string) =>
          `${company} dropped in column ${column}.`,
        cancel: (company: string) => `Moving ${company} was cancelled.`,
      },
    },
    list: {
      title: "List",
    },
  },
  empty: {
    applications: "No applications yet – add your first one.",
  },
  form: {
    newApplication: "New application",
    description: "Only company, role and status are required.",
    save: "Save",
    cancel: "Cancel",
    choose: "Please choose",
    fields: {
      company: "Company",
      role: "Role",
      status: "Status",
      job_url: "Job posting link",
      source: "Source",
      work_model: "Work model",
      workation: "Workation",
      salary_range: "Salary range",
      fit_score: "Fit (0–100)",
      contact_name: "Contact person",
      contact_email: "Contact email",
      cv_version: "CV version",
      notes: "Notes",
      applied_at: "Applied on",
      next_step: "Next step",
      next_step_date: "Next step date",
    },
    placeholders: {
      job_url: "https://…",
      workation: "e.g. 90 days EU, unclear",
      salary_range: "e.g. €60–70k",
      cv_version: "e.g. EN Builder",
    },
    errors: {
      required: "Please fill in.",
      url: "Please enter a complete address starting with http:// or https://.",
      fitScore: "Please enter a whole number from 0 to 100.",
    },
  },
  options: {
    status: {
      discovered: "Discovered",
      applied: "Applied",
      first_interview: "First interview",
      further_round: "Further round",
      offer: "Offer",
      accepted: "Accepted",
      rejected: "Rejected",
      withdrawn: "Withdrawn",
    },
    source: {
      zuhausejobs: "zuhausejobs",
      linkedin: "LinkedIn",
      join: "JOIN",
      career_site: "Career site",
      recruiter: "Recruitment agency",
      other: "Other",
    },
    work_model: {
      remote: "100% remote",
      hybrid: "Hybrid",
      onsite: "On-site",
    },
  },
};
