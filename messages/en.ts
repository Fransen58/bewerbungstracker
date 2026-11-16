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
    backup: "Backup",
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
  backup: {
    title: "Backup",
    hintTitle: "Your data lives only in this browser",
    hint: "There is no server and no account. If you clear your browser data or switch browser or device, your applications are gone. Export a backup regularly.",
    exportTitle: "Export",
    exportText: (apps: number, events: number) =>
      `Downloads ${apps} ${apps === 1 ? "application" : "applications"} and ${events} history ${events === 1 ? "entry" : "entries"} as a JSON file.`,
    exportButton: "Download backup",
    importTitle: "Import",
    importText:
      "Reads a backup file and replaces your current data with it. You will be asked first.",
    importButton: "Choose file",
    confirmTitle: "Replace current data?",
    confirmText: (current: number, incoming: number) =>
      `Your ${current} ${current === 1 ? "application" : "applications"} will be replaced by ${incoming} from the file. This cannot be undone.`,
    confirmButton: "Replace",
    success: (count: number) =>
      `Import successful: ${count} ${count === 1 ? "application" : "applications"} loaded.`,
    errorTitle: "Import rejected, your data is unchanged.",
    errors: {
      invalidJson: "The file is not a valid JSON file.",
      notBackup: "The file is not an Application Tracker backup.",
      newerVersion:
        "The backup comes from a newer version of the app and cannot be read here.",
      invalidApplication: (n: number, field: string) =>
        `Application ${n}: the field “${field}” is missing or invalid.`,
      invalidEvent: (n: number, field: string) =>
        `History entry ${n}: the field “${field}” is missing or invalid.`,
      orphanEvent: (n: number) =>
        `History entry ${n} does not belong to any application in the file.`,
      duplicateId: "The file contains duplicate entries.",
    },
  },
  demo: {
    banner: "Demo mode – sample data",
    start: "Try the demo",
    startFooter: "Start demo",
    reset: "Reset demo",
    end: "End demo",
    resetTitle: "Reset demo?",
    resetText:
      "All changes made in demo mode will be lost and the sample data will be recreated. Your real data is not affected.",
    // Sample texts, one entry per demo application (order matters).
    applications: [
      { role: "Product Designer", workation: "unclear", salary: "€60–70k", nextStep: "Send application", notes: "Exciting data product, small team. Dashboard portfolio case is a good fit.", history: [] },
      { role: "UX Designer", workation: null, salary: null, nextStep: "Research salary expectations", notes: null, history: [] },
      { role: "Senior UX Designer", workation: "30 days EU", salary: "€65–75k", nextStep: "Follow up by email", notes: "Hybrid with 2 office days in Munich.", history: [] },
      { role: "UI Designer", workation: null, salary: "€55k", nextStep: null, notes: "On-site, more of a plan B.", history: [] },
      { role: "Product Designer (Health)", workation: "90 days EU", salary: "€70–80k", nextStep: "First interview 2 pm via video", notes: "Prepare questions: team size, design system, remote culture.", history: ["Application receipt confirmed, feedback in about 2 weeks.", "Booked slot via calendar link."] },
      { role: "Design Lead", workation: "unclear", salary: "€80–90k", nextStep: "Call back recruiter", notes: "Via recruitment agency, client still anonymous.", history: ["Call: 3 remote days, workation must be clarified with the client."] },
      { role: "Senior Product Designer", workation: "60 days worldwide", salary: "€75–85k", nextStep: "Present case study", notes: "Top favourite. Strong design team, 100% remote.", history: ["Case received: redesign the onboarding flow for new users.", "Case well received, invited to present."] },
      { role: "UX Researcher", workation: null, salary: "€60–65k", nextStep: "Interview with team lead", notes: null, history: [] },
      { role: "Product Designer", workation: "90 days EU", salary: "€72k + bonus", nextStep: "Review offer, reply by Friday", notes: "Offer received. Compare with Wolkenfabrik.", history: ["Verbal offer: €72k + 10% bonus, start in 6 weeks."] },
      { role: "Product Designer", workation: "60 days EU", salary: "€70k", nextStep: null, notes: "Accepted.", history: ["Contract signed."] },
      { role: "Interaction Designer", workation: null, salary: null, nextStep: null, notes: null, history: ["Rejected: another candidate with more industry experience."] },
      { role: "UX/UI Designer", workation: null, salary: "€50–55k", nextStep: null, notes: null, history: ["Withdrawn myself: no remote option."] },
    ],
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
