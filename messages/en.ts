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
      responseRate: "Response rate",
      responseDetail: (responded: number, applied: number) =>
        applied === 0 ? "Nothing applied yet" : `${responded} of ${applied} applied`,
      avgFit: "Avg. fit",
      avgFitDetail: (count: number) =>
        count === 0
          ? "No values yet"
          : `from ${count} ${count === 1 ? "application" : "applications"} with a value`,
      total: "Total applications",
      byStatus: "By status",
      due: "Due this week",
      dueEmpty: "Nothing due this week.",
      today: "Today",
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
      search: "Search company or role",
      all: "All",
      companyRole: "Company / Role",
      noResults: "No matches for these filters.",
      resetFilters: "Reset filters",
      count: (shown: number, total: number) =>
        shown === total
          ? `${total} ${total === 1 ? "application" : "applications"}`
          : `${shown} of ${total} applications`,
    },
  },
  detail: {
    edit: "Edit",
    delete: "Delete",
    deleteTitle: "Delete application?",
    deleteText: (company: string) =>
      `${company} and its entire history will be deleted permanently.`,
    deleteConfirm: "Delete permanently",
    notFound: "This application does not exist (anymore).",
    backToList: "Back to list",
    openJob: "Open posting",
    created: (date: string) => `Created on ${date}`,
    sections: {
      job: "Position",
      application: "Application",
      contact: "Contact",
      nextStep: "Next step",
      notes: "Notes",
      history: "History",
    },
    history: {
      empty: "No history entries yet.",
      add: "Add entry",
      type: "Type",
      date: "Date",
      note: "Note",
      notePlaceholder: "e.g. discussed salary, feedback by Friday",
    },
  },
  theme: {
    toLight: "Switch to light",
    toDark: "Switch to dark",
  },
  empty: {
    applications: "No applications yet – add your first one.",
  },
  form: {
    newApplication: "New application",
    editApplication: "Edit application",
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
    event_type: {
      applied: "Applied",
      interview: "Interview",
      case: "Case",
      rejection: "Rejection",
      offer: "Offer",
      note: "Note",
    },
    work_model: {
      remote: "100% remote",
      hybrid: "Hybrid",
      onsite: "On-site",
    },
  },
};
