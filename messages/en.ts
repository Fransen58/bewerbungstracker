import type { Messages } from "./de";

// English UI texts. Typed against the German file so no key can be missing.
export const en: Messages = {
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
      placeholder: "The Kanban board by status will live here.",
    },
    list: {
      title: "List",
      placeholder: "The filterable list of all applications will live here.",
    },
  },
};
