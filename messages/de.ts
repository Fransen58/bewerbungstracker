// German UI texts (default language).
export const de = {
  locale: "de-DE",
  app: {
    name: "Bewerbungs-Tracker",
    description: "Alle Bewerbungen an einem Ort.",
  },
  nav: {
    overview: "Übersicht",
    board: "Board",
    list: "Liste",
    openMenu: "Menü öffnen",
  },
  pages: {
    overview: {
      title: "Übersicht",
      placeholder: "Hier entsteht das Dashboard mit deinen Kennzahlen.",
    },
    board: {
      title: "Board",
      overdue: "Überfällig",
      changeStatus: "Status ändern",
      dragInstructions:
        "Leertaste drücken, um die Karte aufzunehmen. Mit den Pfeiltasten verschieben, mit Leertaste ablegen, mit Escape abbrechen.",
      announce: {
        start: (company: string) => `${company} aufgenommen.`,
        over: (company: string, column: string) =>
          `${company} über Spalte ${column}.`,
        end: (company: string, column: string) =>
          `${company} in Spalte ${column} abgelegt.`,
        cancel: (company: string) => `Verschieben von ${company} abgebrochen.`,
      },
    },
    list: {
      title: "Liste",
    },
  },
  empty: {
    applications: "Noch keine Bewerbung – leg die erste an.",
  },
  form: {
    newApplication: "Neue Bewerbung",
    description: "Pflicht sind nur Firma, Rolle und Status.",
    save: "Speichern",
    cancel: "Abbrechen",
    choose: "Bitte wählen",
    fields: {
      company: "Firma",
      role: "Rolle",
      status: "Status",
      job_url: "Link zur Stellenanzeige",
      source: "Quelle",
      work_model: "Arbeitsmodell",
      workation: "Workation",
      salary_range: "Gehaltsspanne",
      fit_score: "Passung (0–100)",
      contact_name: "Ansprechpartner",
      contact_email: "E-Mail Ansprechpartner",
      cv_version: "CV-Version",
      notes: "Notizen",
      applied_at: "Beworben am",
      next_step: "Nächster Schritt",
      next_step_date: "Datum nächster Schritt",
    },
    placeholders: {
      job_url: "https://…",
      workation: "z. B. 90 Tage EU, unklar",
      salary_range: "z. B. 60–70 k €",
      cv_version: "z. B. DE Builder",
    },
    errors: {
      required: "Bitte ausfüllen.",
      url: "Bitte eine vollständige Adresse eingeben, die mit http:// oder https:// beginnt.",
      fitScore: "Bitte eine ganze Zahl von 0 bis 100 eingeben.",
    },
  },
  options: {
    status: {
      discovered: "Entdeckt",
      applied: "Beworben",
      first_interview: "Erstgespräch",
      further_round: "Weitere Runde",
      offer: "Angebot",
      accepted: "Zusage",
      rejected: "Absage",
      withdrawn: "Zurückgezogen",
    },
    source: {
      zuhausejobs: "zuhausejobs",
      linkedin: "LinkedIn",
      join: "JOIN",
      career_site: "Karriereseite",
      recruiter: "Personalvermittlung",
      other: "Sonstiges",
    },
    work_model: {
      remote: "100 % remote",
      hybrid: "Hybrid",
      onsite: "Vor Ort",
    },
  },
};

export type Messages = typeof de;
