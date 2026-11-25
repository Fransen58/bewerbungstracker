// German UI texts (default language).
export const de = {
  locale: "de-DE",
  app: {
    name: "Bewerbungs-Tracker",
    description: "Alle Bewerbungen an einem Ort.",
  },
  nav: {
    overview: "Übersicht",
    applications: "Bewerbungen",
    openMenu: "Menü öffnen",
    backup: "Backup",
    profile: "Profil",
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
    applications: {
      title: "Bewerbungen",
      view: "Ansicht",
      views: { board: "Board", list: "Liste" },
    },
    board: {
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
      search: "Firma oder Rolle suchen",
      filters: "Filter",
      filtersActive: (n: number) => `Filter (${n})`,
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
      fit: "Passung",
      interview: "Gesprächsvorbereitung",
      requirements: "Anforderungen",
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
  profile: {
    title: "Profil",
    intro: "Beschreibe hier einmalig, was du mitbringst und was du suchst. Die KI vergleicht es mit einer Stelle, wenn du „Passung einschätzen“ klickst. Je ausführlicher, desto genauer die Einschätzung.",
    label: "Mein Profil",
    placeholder: "Zum Beispiel: Lebenslauf als Text einfügen, oder Erfahrung, Stärken, Tools, Sprachen, Abschlüsse und was du suchst (Rolle, Arbeitsmodell, Gehalt).",
    privacy: "Das Profil liegt nur in diesem Browser und ist im Backup enthalten. An die KI (Anthropic) geht es nur, wenn du eine Einschätzung startest. Ein hochgeladener Lebenslauf wird nur ausgelesen und nirgends gespeichert.",
    save: "Profil speichern",
    saved: "Gespeichert.",
    cv: {
      button: "Lebenslauf (PDF) einlesen",
      loading: "Lese Lebenslauf …",
      hint: "Die KI macht daraus einen Profiltext, Kontaktdaten lässt sie weg.",
      success: "Lebenslauf eingelesen. Bitte prüfen, ergänzen, was du suchst (Rolle, Arbeitsmodell, Gehalt), und dann speichern.",
      replaceTitle: "Profiltext ersetzen?",
      replaceText: "Im Profilfeld steht schon Text. Er wird durch den Text aus dem Lebenslauf ersetzt. Gespeichert wird erst, wenn du auf „Profil speichern“ klickst.",
      replaceConfirm: "Ersetzen",
      errors: {
        badRequest: "Die Datei konnte nicht übertragen werden. Bitte erneut versuchen.",
        tooLarge: "Die Datei ist zu groß (höchstens 4 MB).",
        notPdf: "Das ist keine PDF-Datei.",
        notCv: "In der PDF wurde kein lesbarer Lebenslauf gefunden. Ist sie eingescannt? Dann füge den Text bitte selbst ein.",
        notConfigured: "Das Einlesen ist auf diesem Server nicht eingerichtet.",
        aiFailed: "Das Einlesen hat nicht geklappt. Bitte später erneut versuchen.",
      },
    },
  },
  fit: {
    assess: "Passung einschätzen",
    reassess: "Neu einschätzen",
    check: "Passung prüfen",
    checkHint: "Optional: vergleicht die Anzeige mit deinem Profil.",
    loading: "Schätze ein …",
    aiLabel: "KI-Vorschlag",
    confidence: "Konfidenz",
    confidenceLevels: { low: "niedrig", medium: "mittel", high: "hoch" },
    gap: "Größte Lücke",
    noGap: "Keine wesentliche Lücke",
    lowConfidenceHint: "Wenige Angaben: Mehr Anforderungen zur Stelle oder ein ausführlicheres Profil machen die Einschätzung genauer.",
    overridden: (score: number) => `Frühere KI-Einschätzung: ${score} %. Die Passung oben hast du selbst angepasst.`,
    noProfile: "Für eine Einschätzung brauchst du zuerst ein Profil.",
    toProfile: "Profil anlegen",
    discardSuggestion: "Passt eher nicht. Stelle verwerfen? Die Entscheidung liegt bei dir.",
    discard: "Verwerfen",
    errors: {
      badRequest: "Die Anfrage war unvollständig. Bitte erneut versuchen.",
      notConfigured: "Die KI-Einschätzung ist auf diesem Server nicht eingerichtet.",
      tooLong: "Profil oder Stelle sind zu lang für eine Einschätzung.",
      aiFailed: "Die Einschätzung hat nicht geklappt. Bitte später erneut versuchen.",
    },
  },
  interview: {
    prepare: "Gespräch vorbereiten",
    regenerate: "Neu erzeugen",
    loading: "Bereite vor, dauert etwa 20 Sekunden …",
    intro: "Wahrscheinliche Fragen zu dieser Stelle, mit passenden Beispielen aus deinem Profil.",
    questions: "Wahrscheinliche Fragen",
    example: "Dein Beispiel",
    noExample: "Dein Profil liefert dafür kein Beispiel. Überlege dir eines aus deiner Erfahrung.",
    adviceIntro: "So gehst du damit um:",
    quote: (text: string) => `„${text}“`,
    noExampleAdvice: "Kein passendes Beispiel in deinem Profil.",
    advice: {
      assessment: "Einordnung",
      bridge: "Brücke",
      first_step: "Erster Schritt",
      wording: "Formulierung",
    },
    ask: "Deine Rückfragen an die Firma",
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
  demo: {
    banner: "Demo-Modus – Beispieldaten",
    start: "Demo ansehen",
    startFooter: "Demo starten",
    reset: "Demo zurücksetzen",
    end: "Demo beenden",
    resetTitle: "Demo zurücksetzen?",
    resetText:
      "Alle Änderungen im Demo-Modus gehen verloren und die Beispieldaten werden neu erzeugt. Deine echten Daten sind davon nicht betroffen.",
    // Invented profile of the demo user, for trying the fit assessment.
    profile:
      "Product Designerin mit 6 Jahren Erfahrung in B2B- und Consumer-Apps. Schwerpunkte: Interaction Design, Design-Systeme, Prototyping in Figma, Usability-Tests. Erste Führungserfahrung mit zwei Junior-Designern. Grundkenntnisse in HTML und CSS. Sprachen: Deutsch Muttersprache, Englisch C1. Ich suche eine Stelle als Senior Product Designer, remote oder hybrid, ab 70.000 € brutto, gern mit Workation-Möglichkeit.",
    // Sample texts, one entry per demo application (order matters).
    applications: [
      { role: "Product Designer", workation: "unklar", salary: "60–70 k €", nextStep: "Bewerbung abschicken", requirements: "3+ Jahre Product Design\nErfahrung mit Datenvisualisierung und Dashboards\nSicher in Figma\nEnglisch fließend", notes: "Spannendes Datenprodukt, kleines Team. Portfolio-Case zu Dashboards passt gut.", history: [] },
      { role: "UX Designer", workation: null, salary: null, nextStep: "Gehaltsvorstellung recherchieren", requirements: "Erfahrung mit User Research und Usability-Tests\nSicher in Figma\nDeutsch auf Muttersprachniveau", notes: null, history: [] },
      { role: "Senior UX Designer", workation: "30 Tage EU", salary: "65–75 k €", nextStep: "Nachfassen per E-Mail", requirements: "5+ Jahre UX Design\nErfahrung im Mobilitätsbereich\nWorkshops mit Stakeholdern moderieren", notes: "Hybrid mit 2 Bürotagen in München.", history: [] },
      { role: "UI Designer", workation: null, salary: "55 k €", nextStep: null, requirements: null, notes: "Vor Ort, eher Plan B.", history: [] },
      { role: "Product Designer (Health)", workation: "90 Tage EU", salary: "70–80 k €", nextStep: "Erstgespräch 14:00 per Video", requirements: null, notes: "Fragen vorbereiten: Teamgröße, Design-System, Remote-Kultur.", history: ["Eingang der Bewerbung bestätigt, Rückmeldung in ca. 2 Wochen.", "Termin über Kalenderlink gebucht."] },
      { role: "Design Lead", workation: "unklar", salary: "80–90 k €", nextStep: "Rückruf Personalvermittlung", requirements: null, notes: "Über Personalvermittlung, Kunde ist noch anonym.", history: ["Telefonat: Remote-Anteil 3 Tage, Workation muss mit dem Kunden geklärt werden."] },
      { role: "Senior Product Designer", workation: "60 Tage weltweit", salary: "75–85 k €", nextStep: "Case präsentieren", requirements: "5+ Jahre Product Design für Consumer-Apps\nAufbau und Pflege von Design-Systemen\nStarke Motion-Design-Skills\nEnglisch fließend", notes: "Top-Favorit. Starkes Design-Team, 100 % remote.", history: ["Case erhalten: Onboarding-Flow für neue Nutzer überarbeiten.", "Case gut angekommen, Einladung zur Präsentation."] },
      { role: "UX Researcher", workation: null, salary: "60–65 k €", nextStep: "Gespräch mit Teamlead", requirements: null, notes: null, history: [] },
      { role: "Product Designer", workation: "90 Tage EU", salary: "72 k € + Bonus", nextStep: "Angebot prüfen, Antwort bis Freitag", requirements: null, notes: "Angebot liegt vor. Vergleichen mit Wolkenfabrik.", history: ["Mündliches Angebot: 72 k € + 10 % Bonus, Start in 6 Wochen."] },
      { role: "Product Designer", workation: "60 Tage EU", salary: "70 k €", nextStep: null, requirements: null, notes: "Zugesagt.", history: ["Vertrag unterschrieben."] },
      { role: "Interaction Designer", workation: null, salary: null, nextStep: null, requirements: null, notes: null, history: ["Absage: andere Kandidatin mit mehr Branchenerfahrung."] },
      { role: "UX/UI Designer", workation: null, salary: "50–55 k €", nextStep: null, requirements: null, notes: null, history: ["Selbst zurückgezogen: kein Remote möglich."] },
    ],
  },
  common: {
    close: "Schließen",
  },
  language: {
    label: "Sprache",
    names: { de: "Deutsch", en: "Englisch" },
  },
  theme: {
    toLight: "Zu hell wechseln",
    toDark: "Zu dunkel wechseln",
    label: "Darstellung",
  },
  empty: {
    applications: "Noch keine Bewerbung – leg die erste an.",
  },
  datePicker: {
    placeholder: "Datum wählen",
    today: "Heute",
    clear: "Leeren",
  },
  form: {
    newApplication: "Neue Bewerbung",
    editApplication: "Bewerbung bearbeiten",
    description: "Pflicht sind nur Firma, Rolle und Status.",
    save: "Speichern",
    cancel: "Abbrechen",
    choose: "Bitte wählen",
    import: {
      label: "Stellenanzeige automatisch auslesen",
      placeholder: "Link zur Anzeige oder den Text der Anzeige einfügen",
      button: "Felder ausfüllen",
      hint: "Einfügen, dann auf „Felder ausfüllen“ klicken.",
      loading: "Liest Anzeige …",
      success:
        "KI-Vorschlag eingetragen. Bitte prüfen und korrigieren. Leere Felder standen nicht in der Anzeige.",
      errors: {
        badRequest: "Bitte einen Link oder den Text einer Anzeige einfügen.",
        invalidUrl: "Bitte einen öffentlichen Link eingeben, der mit http:// oder https:// beginnt.",
        fetchFailed:
          "Die Seite ließ sich nicht abrufen. Kopiere stattdessen den Text der Anzeige hier hinein.",
        unreadable:
          "Die Seite lässt sich nicht automatisch lesen (z. B. Login nötig). Kopiere stattdessen den Text der Anzeige hier hinein.",
        noJobAd: "Darin wurde keine Stellenanzeige gefunden.",
        tooLong: "Der Text ist zu lang. Bitte nur die Anzeige selbst einfügen.",
        notConfigured: "Der KI-Import ist auf diesem Server nicht eingerichtet.",
        aiFailed: "Das Auslesen hat nicht geklappt. Bitte später erneut versuchen oder die Felder selbst ausfüllen.",
      },
    },
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
      requirements: "Pflichtanforderungen",
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
      requirements: "Eine Anforderung pro Zeile",
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
