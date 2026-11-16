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
    backup: "Backup",
  },
  pages: {
    overview: {
      title: "Übersicht",
      responseRate: "Antwortquote",
      responseDetail: (responded: number, applied: number) =>
        applied === 0 ? "Noch nichts beworben" : `${responded} von ${applied} beworbenen`,
      avgFit: "Ø Passung",
      avgFitDetail: (count: number) =>
        count === 0
          ? "Noch keine Werte"
          : `aus ${count} ${count === 1 ? "Bewerbung" : "Bewerbungen"} mit Wert`,
      total: "Bewerbungen gesamt",
      byStatus: "Nach Status",
      due: "Diese Woche fällig",
      dueEmpty: "Diese Woche ist nichts fällig.",
      today: "Heute",
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
      search: "Firma oder Rolle suchen",
      all: "Alle",
      companyRole: "Firma / Rolle",
      noResults: "Keine Treffer für diese Filter.",
      resetFilters: "Filter zurücksetzen",
      count: (shown: number, total: number) =>
        shown === total
          ? `${total} ${total === 1 ? "Bewerbung" : "Bewerbungen"}`
          : `${shown} von ${total} Bewerbungen`,
    },
  },
  detail: {
    edit: "Bearbeiten",
    delete: "Löschen",
    deleteTitle: "Bewerbung löschen?",
    deleteText: (company: string) =>
      `${company} und der gesamte Verlauf werden endgültig gelöscht.`,
    deleteConfirm: "Endgültig löschen",
    notFound: "Diese Bewerbung gibt es nicht (mehr).",
    backToList: "Zur Liste",
    openJob: "Anzeige öffnen",
    created: (date: string) => `Angelegt am ${date}`,
    sections: {
      job: "Stelle",
      application: "Bewerbung",
      contact: "Kontakt",
      nextStep: "Nächster Schritt",
      notes: "Notizen",
      history: "Verlauf",
    },
    history: {
      empty: "Noch keine Einträge im Verlauf.",
      add: "Eintrag hinzufügen",
      type: "Art",
      date: "Datum",
      note: "Notiz",
      notePlaceholder: "z. B. Gehalt angesprochen, Rückmeldung bis Freitag",
    },
  },
  backup: {
    title: "Backup",
    hintTitle: "Deine Daten liegen nur in diesem Browser",
    hint: "Es gibt keinen Server und kein Konto. Löschst du die Browserdaten oder wechselst du Browser oder Gerät, sind die Bewerbungen weg. Exportiere deshalb regelmäßig ein Backup.",
    exportTitle: "Exportieren",
    exportText: (apps: number, events: number) =>
      `Lädt ${apps} ${apps === 1 ? "Bewerbung" : "Bewerbungen"} und ${events} ${events === 1 ? "Verlaufseintrag" : "Verlaufseinträge"} als JSON-Datei herunter.`,
    exportButton: "Backup herunterladen",
    importTitle: "Importieren",
    importText:
      "Liest eine Backup-Datei ein und ersetzt damit die aktuellen Daten. Vorher wirst du gefragt.",
    importButton: "Datei auswählen",
    confirmTitle: "Aktuelle Daten ersetzen?",
    confirmText: (current: number, incoming: number) =>
      `Deine ${current} ${current === 1 ? "Bewerbung wird" : "Bewerbungen werden"} durch ${incoming} aus der Datei ersetzt. Das lässt sich nicht rückgängig machen.`,
    confirmButton: "Ersetzen",
    success: (count: number) =>
      `Import erfolgreich: ${count} ${count === 1 ? "Bewerbung" : "Bewerbungen"} geladen.`,
    errorTitle: "Import abgelehnt, deine Daten bleiben unverändert.",
    errors: {
      invalidJson: "Die Datei ist keine gültige JSON-Datei.",
      notBackup: "Die Datei ist kein Backup des Bewerbungs-Trackers.",
      newerVersion:
        "Das Backup stammt aus einer neueren Version der App und kann hier nicht gelesen werden.",
      invalidApplication: (n: number, field: string) =>
        `Bewerbung ${n}: Das Feld „${field}“ fehlt oder ist ungültig.`,
      invalidEvent: (n: number, field: string) =>
        `Verlaufseintrag ${n}: Das Feld „${field}“ fehlt oder ist ungültig.`,
      orphanEvent: (n: number) =>
        `Verlaufseintrag ${n} gehört zu keiner Bewerbung in der Datei.`,
      duplicateId: "Die Datei enthält doppelte Einträge.",
    },
  },
  theme: {
    toLight: "Zu hell wechseln",
    toDark: "Zu dunkel wechseln",
  },
  empty: {
    applications: "Noch keine Bewerbung – leg die erste an.",
  },
  form: {
    newApplication: "Neue Bewerbung",
    editApplication: "Bewerbung bearbeiten",
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
    event_type: {
      applied: "Beworben",
      interview: "Gespräch",
      case: "Case",
      rejection: "Absage",
      offer: "Angebot",
      note: "Notiz",
    },
    work_model: {
      remote: "100 % remote",
      hybrid: "Hybrid",
      onsite: "Vor Ort",
    },
  },
};

export type Messages = typeof de;
