# Entstehungsprozess mit Claude Code

Dieses Dokument hält fest, wie der Bewerbungs-Tracker Story für Story mit Claude Code entstanden ist. Es soll nachvollziehbar machen, wie man mit einem KI-Agenten ein echtes, veröffentlichtes Produkt baut, inklusive der Stellen, an denen etwas schiefging.

## Werkzeuge und Arbeitsweise

**Werkzeuge:** [Claude Code](https://claude.com/claude-code) im Terminal (macOS), Node.js, Git, Chrome zum Testen, später GitHub und Vercel.

**Drei Dokumente steuern die Arbeit:**
- **SPEC.md** ist die Quelle der Wahrheit: Problem, Datenmodell, User Stories mit Akzeptanzkriterien. Wurde eine Anforderung im Lauf des Projekts angepasst, steht das dort als Vermerk.
- **CLAUDE.md** enthält die Spielregeln für den Agenten: immer genau eine Story; vor dem Code ein Plan, der auf mein OK wartet; kleine lauffähige Schritte; nach jeder Story die Akzeptanzkriterien einzeln prüfen, PROZESS.md fortschreiben und committen; keine erfundenen Features; neue Konzepte kurz erklären. Dazu Konventionen wie zweisprachige Texte aus zentralen Dateien, feste englische Schlüssel für Auswahlwerte und eine Schema-Version für gespeicherte Daten.
- **DESIGN.md** ist das Designkonzept (entstanden nach Story 2): Tokens, Typografie, Formen, Komponenten-Muster.

**Rollen:** Ich bin Product Owner und Tester. Ich entscheide offene Fragen, teste im Browser und gebe Rückmeldung. Claude Code plant, implementiert und prüft alles, was sich ohne Browser prüfen lässt.

**Ablauf jeder Story:**
1. Claude schlägt einen Plan vor. Offene Punkte kommen als Optionen (A/B) mit Empfehlung und Begründung.
2. Ich entscheide, Claude setzt in kleinen Schritten um.
3. Automatische Prüfung: Typprüfung, Lint, Build. Reine Logik (Filter, Kennzahlen, Backup-Prüfung, Speicher-Trennung) wird zusätzlich mit Beispieldaten in Node getestet.
4. Claude schreibt einen konkreten Testplan für den Browser, ich teste und melde zurück.
5. Rückmeldungen werden eingearbeitet, dann kommen Dokumentation hier und ein Commit.

## Story 0: Projekt-Setup

**Ziel:** Ein lauffähiges Grundgerüst mit Next.js, TypeScript, Tailwind und shadcn/ui, dazu Git und eine Navigation (Übersicht, Board, Liste), die auf Desktop und Handy funktioniert.

**Vorgehen:**
- Projektregeln (CLAUDE.md) und Produkt-Spec (SPEC.md) vorab geschrieben. Allgemeine Coding-Richtlinien aus dem Netz auf Deutsch in CLAUDE.md übernommen.
- `create-next-app` in einem temporären Unterordner ausgeführt und das Ergebnis in den Projektordner verschoben, weil das Tool keine Ordner mit vorhandenen Dateien akzeptiert.
- Statischen Export (`output: "export"`) eingestellt und per Build geprüft.
- shadcn/ui initialisiert, nur Button und Sheet (Handy-Menü) hinzugefügt.
- Kopfzeile mit Navigation gebaut: auf dem Desktop als Linkleiste, auf dem Handy als ausklappbares Menü. Drei Platzhalterseiten angelegt.
- Alle Oberflächentexte liegen zentral in `messages/de.ts` und `messages/en.ts`. Die englische Datei ist gegen die deutsche typisiert, damit kein Text fehlen kann.

**Entscheidungen:**
- Routen: `/` = Übersicht, `/board`, `/list`.
- Bis zum Sprachumschalter (Story 8) ist Deutsch fest eingestellt. Der Zugriff läuft aber schon jetzt über eine zentrale Stelle (`messages/index.ts`), damit später nur diese Stelle geändert werden muss.
- Unbenutzte Beispielbilder des Starter-Templates entfernt.

**Probleme:**
- Git war auf dem Mac noch nicht installiert. Die Xcode Command Line Tools wurden nachinstalliert. Name und E-Mail für Git gelten nur für dieses Repository, weil sie im öffentlichen Repo an jedem Commit sichtbar sind.
- Der erste Build schlug mit „PPR cannot be enabled in export mode“ fehl. Das aktuelle Next.js-Template schaltet `cacheComponents` und `partialPrefetching` ein. Beide brauchen einen Server und wurden entfernt.
- shadcn nutzt inzwischen das Paket `cn` statt `clsx` und `tailwind-merge`. Vor der Verwendung geprüft, ob es aus dem offiziellen shadcn-Repository stammt.

**Prüfung:** Build, Lint und alle drei Routen geprüft; Burger-Menü in der Handy-Ansicht von Chrome manuell getestet.

**Learnings:**
- Werkzeuge entwickeln sich schnell. Templates bringen neue Standardoptionen mit, die nicht zu jedem Einsatzzweck passen, hier zum statischen Export. Ein früher Build-Test fängt so etwas sofort ab.
- Next.js legt eine `AGENTS.md` mit dem Hinweis an, dass sich seine APIs geändert haben. Die mitgelieferte Doku in `node_modules/next/dist/docs/` ist deshalb verlässlicher als Wissen aus dem Gedächtnis.

## Story 1: Bewerbung anlegen

**Ziel:** Eine neue Bewerbung schnell anlegen. Pflicht sind Firma, Rolle und Status, eine ungültige URL wird abgelehnt, und die Daten überstehen ein Neuladen.

**Vorgehen:**
- Datentypen (`lib/types.ts`) genau nach dem Datenmodell in SPEC.md. Auswahlwerte sind feste englische Schlüssel (`first_interview`, `remote` …), ihre Übersetzungen stehen in `messages/`.
- Storage-Schicht (`lib/storage.ts`): ein einziger `localStorage`-Eintrag `{ schemaVersion: 1, applications, events }`. Die Komponenten lesen ihn über den Hook `useAppData()`, der auf `useSyncExternalStore` aufbaut.
- Formular als Dialog hinter dem Knopf „Neue Bewerbung“ in der Kopfzeile, mit allen Feldern des Datenmodells. Die Prüfung läuft beim Speichern, und Fehler erscheinen direkt am jeweiligen Feld.
- Board und Liste zeigen vorerst eine einfache Aufzählung (Variante A). Sie wird in Story 2 und 3 durch die richtigen Ansichten ersetzt.

**Entscheidungen:**
- Das Akzeptanzkriterium „erscheint in Board und Liste“ setzt Ansichten voraus, die es noch nicht gibt. Gemeinsam entschieden: vorläufig eine einfache Aufzählung.
- Status „Entdeckt“ ist vorausgewählt, damit das Anlegen schnell geht.
- Beim Anlegen entsteht kein Verlaufs-Event, weil SPEC.md Events erst beim Statuswechsel verlangt.
- Leere optionale Felder werden als `null` gespeichert, nicht als leerer Text.
- Die Passung wird auf eine ganze Zahl von 0 bis 100 geprüft, wie im Datenmodell vorgegeben.

**Probleme:**
- shadcn/ui setzt jetzt auf Base UI statt Radix. Die API ist anders: zum Beispiel `render`-Prop statt `asChild`, und Selects bekommen ihre Beschriftungen über `items`. Nachgeschlagen in den Typdefinitionen unter `node_modules/@base-ui/react`.

**Prüfung:** Lint, Typprüfung und Build fehlerfrei. Die Testschritte (Pflichtfelder, ungültige URL, Anzeige in Board und Liste, Neuladen, Handy-Ansicht) manuell im Browser durchgeführt, alle erfüllt.

**Rückmeldung aus dem Test:** Die Übersicht zeigt noch nichts an, und Einträge lassen sich nicht bearbeiten. Beides ist geplant: Das Dashboard kommt in Story 5, das Bearbeiten in Story 4.

**Learnings:**
- Wenn mehrere unabhängige Komponenten (Kopfzeile mit Formular, Listenseite) dieselben Browserdaten brauchen, reicht ein kleiner Speicher mit `useSyncExternalStore`. Eine zusätzliche State-Bibliothek ist dafür nicht nötig.
- Akzeptanzkriterien können von späteren Stories abhängen. Das früh anzusprechen erspart Diskussionen am Ende.

## Story 2: Board-Ansicht

**Ziel:** Alle Bewerbungen als Kanban-Board nach Status zeigen. Karten lassen sich per Drag & Drop verschieben, auf dem Handy auch ohne Drag & Drop. Überfällige nächste Schritte sind sichtbar markiert.

**Vorgehen:**
- Eine Spalte pro Status in der Reihenfolge aus SPEC.md. Das Board scrollt auf allen Bildschirmgrößen horizontal.
- Karten zeigen Firma, Rolle, Arbeitsmodell und den nächsten Schritt mit Datum.
- Drag & Drop mit `@dnd-kit/core`: Maus ab 5 px Bewegung, Touch nach kurzem Halten (damit Scrollen weiter geht) und Tastatur. Die Screenreader-Ansagen stehen übersetzt in `messages/`.
- Zusätzlich hat jede Karte ein Status-Auswahlfeld als Alternative zum Ziehen.
- `changeStatus()` in der Storage-Schicht speichert den neuen Status, aktualisiert `updated_at` und legt ein Event an.

**Entscheidungen:**
- Event bei Statuswechsel (Variante B): Der Status wird auf den passenden Event-Typ abgebildet (Erstgespräch und Weitere Runde → Gespräch, Absage → Absage, Angebot → Angebot, Beworben → Beworben, sonst Notiz). Dazu speichert das Event die neuen Felder `from_status` und `to_status` als feste Schlüssel, damit der Verlauf in jeder Sprache lesbar bleibt. SPEC.md wurde ergänzt.
- Die Schema-Version bleibt 1, weil die Felder nur dazukommen und es noch keine gespeicherten Events gab.
- „Überfällig“ heißt: Das Datum des nächsten Schritts liegt vor heute. Das gilt für alle Karten, auch für abgeschlossene Status.
- Daten werden als lokaler Kalendertag (`YYYY-MM-DD`) gespeichert. So lässt sich „überfällig“ per einfachem Textvergleich prüfen, ohne Probleme mit Zeitzonen.

**Probleme:**
- Das Status-Auswahlfeld liegt innerhalb der ziehbaren Karte. Ohne Gegenmaßnahme würde ein Klick darauf ein Ziehen starten. Gelöst, indem Maus-, Touch- und Tastatur-Ereignisse am Auswahlfeld nicht an die Karte weitergereicht werden.

**Prüfung:** Lint, Typprüfung und Build fehlerfrei. Manuell getestet und erfüllt: Ziehen zwischen Spalten inklusive Neuladen, Statuswechsel über das Auswahlfeld, Markierung „Überfällig“, horizontales Scrollen und Auswahlfeld in der Handy-Ansicht, Events mit `from_status`/`to_status` im Local Storage.

**Learnings:**
- Eine Bibliothek wie dnd-kit nimmt viel Arbeit ab: Touch, Tastatur und Barrierefreiheit kommen gleich mit.
- Wenn das Datenmodell eine Anforderung nicht abbildet, hier den Statuswechsel im Verlauf, lohnt sich eine kleine, bewusste Erweiterung mit Eintrag in der Spec. Ein Workaround wäre auf Dauer teurer.

## Zwischenschritt: Designkonzept und Hell/Dunkel-Umschalter

**Ziel:** Vor den weiteren Ansichten ein einheitliches Design-System festlegen, damit Liste, Detailseite und Dashboard nicht jeweils anders aussehen. SPEC.md verlangt ein „konsistentes Design-System“.

**Vorgehen:**
- Als Vorbild diente eine Portfolio-Website. Das Abrufwerkzeug lieferte nur den Text, deshalb wurden HTML und Stylesheets direkt geladen und die echten Werte ausgelesen: Farben, Schriften, Radien, Schatten, Bewegungskurven.
- Daraus entstand `DESIGN.md` als verbindliches Regelwerk. Übernommen wurden Prinzipien und Wirkung (warmer Papierton, Tinte, Haarlinien, Pillen, Labels in Großbuchstaben), keine Inhalte oder Markenelemente.
- Die Tokens stehen in `app/globals.css`, hell und dunkel, dazu Statusfarben und die Hilfsklasse `label-caps`. Die shadcn-Bausteine (Button, Input, Select, Dialog) wurden angepasst.
- Neue gemeinsame Bausteine: `StatusBadge`/`StatusDot`, `PageHeader` und `EmptyState`. Board, Liste und Formular nutzen sie.
- Der Hell/Dunkel-Umschalter aus Story 8 wurde vorgezogen, damit sich das Design in beiden Modi prüfen lässt. Standard ist die Systemeinstellung, eine Wahl per Klick wird gespeichert.

**Entscheidungen:**
- Status als farbiger Punkt plus Text statt bunter Flächen, damit das Board ruhig bleibt und der Status nicht nur über die Farbe erkennbar ist.
- Schrift bleibt Geist, weil sie schon eingebunden ist. Die Schrift des Vorbilds (General Sans) ist als Alternative in DESIGN.md notiert.
- Ein einfacher Knopf hell ↔ dunkel (Variante A) statt eines Umschalters mit drei Stufen. Nach dem ersten Klick folgt die App nicht mehr automatisch dem System.
- Die Intro-Animationen des Vorbilds wurden bewusst nicht übernommen, weil sie nicht zu einem Arbeitswerkzeug passen.

**Probleme:**
- Ein Grauton lag nachgerechnet unter dem Mindestkontrast von 4.5:1 auf grauen Flächen und wurde abgedunkelt.
- Die shadcn-Vorlage enthielt `--font-sans: var(--font-sans)`, also einen Verweis auf sich selbst. Dadurch wurde Geist nie verwendet. Korrigiert auf `--font-geist-sans`.
- Das Layout ist eine Server-Komponente und durfte das Theme-Modul mit React-Hook nicht importieren. Das Startskript liegt deshalb getrennt in `lib/theme-script.ts`.
- Missverständnis beim Test: Das „N“ unten links ist das Entwickler-Werkzeug von Next.js. Seine Theme-Einstellung betrifft nur dieses Werkzeug, nicht die App.

**Prüfung:** Lint, Typprüfung und Build fehlerfrei, die Tokens sind im fertigen CSS geprüft. Manuell getestet: helle und dunkle Ansicht, Umschalter und Speicherung, schwebende Karte beim Ziehen, leerer Zustand im privaten Fenster.

**Learnings:**
- Ein Designkonzept früh festzulegen kostet einen Zwischenschritt, erspart aber das Angleichen am Ende.
- Kontrast nachrechnen statt schätzen: Eine Farbe, die auf Weiß gut lesbar ist, kann auf einer grauen Fläche durchfallen.
- Kleine Teile späterer Stories vorzuziehen ist in Ordnung, wenn es das Testen erleichtert. Es muss nur dokumentiert werden, damit es in der späteren Story nicht doppelt gebaut wird.

## Story 3: Listen-Ansicht mit Filter

**Ziel:** Alle Bewerbungen als Tabelle anzeigen, filtern nach Status, Arbeitsmodell und Quelle, suchen nach Firma oder Rolle und sortieren nach Datum, Passung und nächstem Schritt.

**Vorgehen:**
- Tabelle nach DESIGN.md: Kopf im Label-Stil, Haarlinien, Daten und Zahlen in Mono-Schrift, Status als Badge mit Punkt, überfällige Schritte rot. Auf dem Handy scrollt sie horizontal.
- Filter als Auswahlfelder mit „Alle“ als oberstem Eintrag, dazu ein Suchfeld, ein Zähler („2 von 5 Bewerbungen“) und eigene leere Zustände für „keine Bewerbungen“ und „keine Treffer“.
- Sortierung über klickbare Spaltenköpfe mit Pfeil und `aria-sort` für Screenreader.
- Die Filter- und Sortierlogik wurde vor dem Browsertest mit Beispieldaten in Node geprüft.
- Die vorläufige Aufzählung aus Story 1 wurde gelöscht.

**Entscheidungen:**
- „Sortierung nach Datum“ bedeutet „Beworben am“ (Variante A). Standard ist die neueste Bewerbung zuerst.
- Jede Sortierspalte startet in einer sinnvollen Richtung: Passung die beste zuerst, nächster Schritt der früheste zuerst. Leere Werte stehen immer am Ende.
- Filter und Sortierung werden nicht gespeichert, pro Filter wird ein Wert gewählt.
- Nach Rückmeldung aus dem Test: Ein Knopf „Filter zurücksetzen“ erscheint, sobald ein Filter aktiv ist, nicht erst bei „keine Treffer“. Chips mit × wurden besprochen und verworfen, weil die Auswahlfelder den Wert schon zeigen.

**Probleme:**
- TypeScript leitete den Wertetyp des Base-UI-Selects aus dem Eintrag „all“ ab. Gelöst mit einem ausdrücklichen Typargument (`<Select<K | "all">>`).
- Der Eintrag „Alle“ im Auswahlfeld wurde beim Test übersehen. Ein sichtbarer Knopf zum Zurücksetzen ist leichter zu finden.

**Prüfung:** Lint, Typprüfung und Build fehlerfrei. Manuell getestet und erfüllt: Filter, Suche, keine Treffer mit Zurücksetzen, Sortierung in beide Richtungen, Handy-Ansicht.

**Learnings:**
- Was technisch vorhanden ist, ist noch nicht auffindbar. Nutzertests decken solche Lücken schnell auf.
- Reine Logik, also Filtern und Sortieren, lässt sich ohne Browser in Sekunden prüfen, wenn sie von der Oberfläche getrennt ist.

## Story 4: Detailseite mit Verlauf

**Ziel:** Zu jeder Bewerbung alle Infos und den Verlauf zeigen, alle Felder bearbeitbar machen, Events hinzufügen und eine Bewerbung nach Rückfrage löschen.

**Vorgehen:**
- Vorab geklärt, was ein Event ist: ein datierter Eintrag im Verlauf. Er entsteht automatisch bei Statuswechseln oder von Hand, zum Beispiel für Gesprächsnotizen.
- Die Detailseite liegt unter `/application?id=…`. Board-Karten und Tabellenzeilen sind komplett klickbar, über einen gestreckten Link (`after:absolute inset-0`).
- Leseansicht in Abschnitten (Stelle, Bewerbung, Kontakt, nächster Schritt, Notizen), daneben der Verlauf als Zeitleiste mit Formular für neue Einträge.
- Das Formular wurde in eine gemeinsame Komponente gezogen (`application-dialog.tsx`), die Anlegen und Bearbeiten abdeckt.
- Neu in der Storage-Schicht: `updateApplication()` (ein Statuswechsel erzeugt ein Event), `deleteApplication()` (löscht auch die zugehörigen Events) und `addEvent()`. Vor dem Browsertest mit nachgebildetem `localStorage` in Node geprüft.

**Entscheidungen:**
- Leseansicht mit „Bearbeiten“-Dialog (Variante A) statt einer Seite, die selbst ein Formular ist. Zum Vorbereiten auf ein Gespräch liest sich das ruhiger.
- Der Verlauf ist chronologisch sortiert, das älteste Event zuerst. Events lassen sich laut SPEC nur hinzufügen, nicht bearbeiten oder löschen.
- Nach dem Löschen geht es zurück zum Board.

**Probleme:**
- Beim statischen Export gibt es keine Seite pro ID, weil die IDs erst im Browser entstehen. Lösung: ID als Parameter in der Adresse, ausgelesen mit `useSearchParams` innerhalb einer `Suspense`-Grenze (laut Next.js-Doku nötig).
- Das vorgefertigte HTML kennt keine Browserdaten, deshalb blitzte kurz „nicht gefunden“ bzw. „Noch keine Bewerbung“ auf. Gelöst mit dem Hook `useStorageReady()`, auch auf Board und Liste.
- Base UI warnte, dass sich der Startwert eines Auswahlfelds nachträglich ändert. Ursache: Nach dem Speichern bekam der Dialog während der Schließ-Animation die aktualisierten Daten. Gelöst, indem der Dialog die Werte beim Öffnen übernimmt und bis zum Schließen behält.
- Links in einer ziehbaren Karte: Das native Ziehen von Links im Browser hätte Drag & Drop gestört, deshalb `draggable={false}`. Das Auswahlfeld liegt mit `z-10` über dem gestreckten Link.

**Prüfung:** Lint, Typprüfung und Build fehlerfrei. Manuell getestet und erfüllt: Öffnen von Board und Liste, Ziehen und Auswahlfeld weiterhin funktionsfähig, Bearbeiten inklusive Statuswechsel im Verlauf, manuelle Einträge chronologisch einsortiert, Löschen mit Abbrechen und Bestätigen, unbekannte ID, Handy-Ansicht. Die Warnung tritt nach dem Fix nicht mehr auf.

**Learnings:**
- Ein statischer Export verändert die Architektur: Alles, was von Browserdaten abhängt, muss wissen, ob diese Daten schon geladen sind.
- Konsolenwarnungen lohnen sich. Hier zeigte die Warnung auf ein echtes Timing-Problem zwischen Speichern und Schließ-Animation.

## Story 5: Übersicht (Dashboard)

**Ziel:** Kennzahlen zur Suche zeigen (Anzahl je Status, Antwortquote, durchschnittliche Passung) und eine Liste „Diese Woche fällig“.

**Vorgehen:**
- Die Berechnungen liegen als reine Funktionen in `lib/metrics.ts`, getrennt von der Oberfläche. Vor dem Browsertest wurden sie mit Beispieldaten in Node geprüft, inklusive Grenzfällen: heute + 7 Tage, Monats- und Jahreswechsel, leere Daten.
- Oben drei große Kennzahlen im Stil von DESIGN.md: Antwortquote, Ø Passung, gesamt. Darunter die Anzahl je Status und die fälligen Schritte, die per Klick zur Detailseite führen.
- Der Platzhalter aus Story 0 wurde gelöscht.

**Entscheidungen:**
- Antwortquote: „Beworben“ heißt, die Bewerbung steht nicht mehr auf „Entdeckt“. „Rückmeldung“ heißt, sie war irgendwann in Erstgespräch, Weiterer Runde, Angebot, Zusage oder Absage. Der Verlauf zählt mit, eine nach einem Gespräch zurückgezogene Bewerbung gilt also als beantwortet.
- Überfällige Schritte stehen rot oben in „Diese Woche fällig“ (Variante A). Das geht über SPEC.md hinaus und ist dort vermerkt.
- Statusbalken entfernt (Variante A nach Rückmeldung). Die graue Spur wirkte bei leeren Status wie ein Skeleton Loader, und bei wenigen Bewerbungen reichen die Zahlen.

**Probleme:**
- Die Balken waren als Anteilsdiagramm gedacht, aber im Test nicht verständlich. Eine Visualisierung, die man erklären muss, erfüllt ihren Zweck nicht.

**Prüfung:** Lint, Typprüfung und Build fehlerfrei. Manuell getestet und erfüllt: Antwortquote (3 von 4 = 75 % nachvollzogen), Ø Passung, Anzahl je Status, Reihenfolge und Markierung in „Diese Woche fällig“, Klick zur Detailseite, Handy-Ansicht.

**Learnings:**
- Kennzahlen brauchen eine klare Definition. „Antwortquote“ klingt eindeutig, die Abgrenzung (Zählt eine Absage? Was ist mit zurückgezogenen Bewerbungen?) musste aber festgelegt werden.
- Eine kleine Zeile mit der Rechnung unter der Zahl („3 von 4 beworbenen“) macht eine Kennzahl nachvollziehbar.

## Story 6: Backup – Export und Import

**Ziel:** Alle Daten als JSON-Datei sichern und wiederherstellen. Ungültige Dateien werden abgelehnt, ohne vorhandene Daten zu verändern. Ein Hinweis erklärt, dass die Daten nur im Browser liegen.

**Vorgehen:**
- Eigene Seite „Backup“, erreichbar über eine neue Fußzeile und das Handy-Menü. Die Navigation bleibt bei den drei Punkten aus SPEC.md.
- `lib/backup.ts`: Das Backup-Format enthält App-Kennung, Schema-Version, Exportdatum, Bewerbungen und Events. Die Prüfung arbeitet Feld für Feld nach dem Datenmodell: Pflichtfelder, Auswahlwerte, Datumsformate, URL nur mit http(s), Passung 0–100, Events nur zu vorhandenen Bewerbungen, keine doppelten IDs. Eine zu neue Schema-Version wird abgelehnt.
- Fehler werden als Codes zurückgegeben und erst in der Oberfläche übersetzt. Die Meldungen nennen die Bewerbung und das betroffene Feld.
- Vor dem Ersetzen fragt ein Dialog nach und nennt die Zahlen vorher und nachher.
- Die Prüflogik wurde in Node mit 15 Fällen getestet, gültigen wie kaputten. Für den Browsertest gab es drei vorbereitete kaputte Dateien.

**Entscheidungen:**
- Import heißt ersetzen. Zusammenführen steht nicht in SPEC.md.
- Unbekannte zusätzliche Felder in einer Datei werden verworfen statt übernommen.
- Seite statt Knopf in der Kopfzeile (Variante A), damit die Kopfzeile für den Sprachumschalter in Story 8 frei bleibt.

**Probleme:** Keine nennenswerten. Die strikte Trennung von Prüflogik und Oberfläche machte das Testen einfach.

**Prüfung:** Lint, Typprüfung und Build fehlerfrei. Manuell getestet und erfüllt: Export, Import mit Abbrechen und Ersetzen (Stand inklusive Verlauf wiederhergestellt), drei ungültige Dateien mit passender Meldung und unveränderten Daten, Backup-Link im Handy-Menü.

**Learnings:**
- Eine Datei von außen ist nie vertrauenswürdig. Die Prüfung schützt nicht nur vor kaputten Daten, sondern zum Beispiel auch vor manipulierten Links wie `javascript:…`.
- Fehler als Codes statt als fertige Texte zu liefern, hält die Logik sprachunabhängig. Das passt zur Zweisprachigkeit der App.

## Story 7: Demo-Modus

**Ziel:** Besucher können die App mit einem Klick und Beispieldaten ausprobieren, ohne etwas einzugeben. Die echten Daten werden dabei weder überschrieben noch vermischt.

**Vorgehen:**
- Die Storage-Schicht kennt jetzt zwei Datenbestände unter getrennten Schlüsseln (`bewerbungstracker:data` und `bewerbungstracker:demo`) und einen Modus-Schlüssel. Alle Lese- und Schreibzugriffe gehen automatisch an den aktiven Bestand, die Komponenten mussten dafür nicht geändert werden.
- Beispieldaten in `lib/demo-data.ts`: 12 erfundene Bewerbungen über alle 8 Status, mit Verlauf. Die Daten werden relativ zum heutigen Tag erzeugt, damit „Diese Woche fällig“ immer aktuell wirkt, mit einem überfälligen und einem heute fälligen Schritt.
- Die Texte der Beispieldaten liegen zweisprachig in den Übersetzungsdateien (Variante A). Die Demo entsteht in der aktiven Sprache.
- Banner in der Kopfzeile mit „Demo zurücksetzen“ (mit Rückfrage) und „Demo beenden“. Gestartet wird über „Demo ansehen“ im leeren Zustand und „Demo starten“ in der Fußzeile.
- Die drei identischen leeren Zustände wurden zu einer Komponente `NoApplications` zusammengefasst.

**Entscheidungen:**
- Ein erneuter Start behält vorhandene Demo-Daten. Frische Beispieldaten gibt es über „Demo zurücksetzen“.
- Der Demo-Modus bleibt nach dem Neuladen aktiv.
- Links und E-Mails der Beispieldaten nutzen `example.com`, eine Domain, die für Beispiele reserviert ist. Firmen und Personen sind frei erfunden.
- Das Backup arbeitet im Demo-Modus mit den Demo-Daten. Das Banner macht den Modus deutlich.

**Probleme:**
- Die Zuordnung Status → Event-Typ wurde auch für die Beispieldaten gebraucht. Statt sie zu kopieren, wird sie jetzt aus der Storage-Schicht exportiert.

**Prüfung:** Lint, Typprüfung und Build fehlerfrei. In Node geprüft: Die Beispieldaten bestehen die Backup-Prüfung auf Deutsch und Englisch und decken alle Status sowie fällige und überfällige Schritte ab. Die echten Daten bleiben über Starten, Ändern, Zurücksetzen und Beenden hinweg unverändert. Manuell getestet und erfüllt: Start aus echten Daten und aus dem leeren Zustand, Verlauf der Beispiele, Ändern und Zurücksetzen, Beenden mit unveränderten echten Daten, Neuladen, Handy-Ansicht.

**Learnings:**
- Weil alle Datenzugriffe von Anfang an durch eine eigene Storage-Schicht laufen, war der Demo-Modus eine Änderung an einer einzigen Stelle.
- Beispieldaten mit festen Daten veralten. Relative Daten halten eine Demo dauerhaft glaubwürdig.

## Story 8: Sprache und Design-Modus

**Ziel:** Sprache (Deutsch/Englisch) und Hell/Dunkel selbst wählen. Beide Einstellungen bleiben nach dem Neuladen erhalten. Der Hell/Dunkel-Teil war bereits im Designschritt vorgezogen worden.

**Vorgehen:**
- Sprach-Speicher in `lib/i18n.ts` nach demselben Muster wie Theme und Daten (`useSyncExternalStore`, `localStorage`). Standard ist Deutsch.
- Alle Komponenten holen ihre Texte jetzt über den Hook `useT()` statt über einen festen Import. Die Umstellung lief per Skript, das in jede Komponente mit Textzugriff `const t = useT()` einsetzte. Die Typprüfung zeigte danach die übrigen Stellen: Hilfsfunktionen außerhalb von Komponenten, Navigation, Demo-Erzeugung.
- Seiten und Fußzeile wurden dafür zu Client-Komponenten. `<html lang>` und der Tab-Titel wechseln mit.
- Umschalter „DE | EN“ als Pille mit gleitendem Hintergrund, wie in DESIGN.md beschrieben.
- Die Suche nach festen Texten fand noch ein „Close“ in den shadcn-Vorlagen, das jetzt ebenfalls übersetzt ist.
- In Node geprüft: Beide Sprachdateien haben dieselben 211 Texte, gleiche Listenlängen und Parameter.

**Entscheidungen:**
- Angezeigte Fehlermeldungen (Formular, Import) speichern nur noch die Fehlerart und werden erst beim Anzeigen übersetzt. So wechseln sie mit der Sprache.
- Auf dem Handy liegen Sprache und Hell/Dunkel im Menü, auf dem Desktop in der Kopfzeile. Das war ein Wunsch nach dem Test, SPEC.md wurde angepasst.

**Probleme:**
- Bekannte Grenze: Beim Neuladen mit Englisch blitzt kurz der deutsche Text auf, weil das vorgefertigte HTML deutsch ist. Beim Theme ließ sich das per Skript verhindern, bei ganzen Texten geht das ohne Server nicht.
- Ein Testschritt war nicht durchführbar: Bei geöffnetem modalem Dialog lässt sich die Sprache nicht umschalten. Er wurde durch einen Test auf der Backup-Seite ersetzt.

**Prüfung:** Lint, Typprüfung und Build fehlerfrei. Manuell getestet und erfüllt: Sprachwechsel auf allen Seiten inklusive Datumsformaten, mitwechselnde Fehlermeldung beim Import, Speicherung nach dem Neuladen, Demo auf Englisch, Kopfzeile und Menü in der Handy-Ansicht.

**Learnings:**
- Texte von Anfang an zentral abzulegen hat sich ausgezahlt. Aus einem festen Import einen Hook zu machen, war vor allem mechanische Arbeit.
- Fehler als Codes zu speichern (wie schon beim Backup) ist nicht nur sauberer, sondern hier auch sichtbar besser für die Nutzer.
- Testpläne können selbst Fehler enthalten. Die Rückfrage hat das schnell aufgedeckt.

## Story 9: Veröffentlichung und Dokumentation

**Ziel:** Code öffentlich auf GitHub, App unter einem Live-Link erreichbar, README und PROZESS.md als Nachweis.

**Vorgehen:**
- Vor dem Hochladen alle Dateien und die komplette Git-Historie auf Secrets und persönliche Daten geprüft. Ergebnis: Es gibt keine. Ein früher versehentlich eingetragener Vorname war schon vor dem Commit entfernt worden.
- README neu geschrieben: Beschreibung, Screenshots, Funktionen, Datenschutz-Hinweis, Tech-Stack, Startanleitung, englische Kurzfassung.
- Screenshots automatisch mit Playwright: Der statische Build wird lokal ausgeliefert, die Demo per Klick gestartet, dann werden Übersicht, Board, Detailseite (hell), Liste (dunkel) und das Board auf dem Handy fotografiert.
- GitHub: leeres öffentliches Repository im Browser angelegt, Push per HTTPS mit Personal Access Token.
- Vercel: Repository importiert, Standardeinstellungen, Deploy. Jeder weitere Push wird automatisch veröffentlicht.
- Den Live-Stand geprüft: alle Seiten mit Status 200, unbekannte Adressen mit 404.

**Probleme:**
- Weder GitHub-CLI noch Homebrew oder SSH-Schlüssel waren vorhanden. Deshalb Push per Token im eigenen Terminal-Fenster, weil Git dort interaktiv nach Benutzername und Token fragen kann.
- Das fein granulierte Token hatte zunächst keine Schreibrechte (Fehler 403). In der neuen GitHub-Oberfläche muss die Berechtigung „Contents: Read and write“ hinzugefügt werden, bevor man speichert, sonst wird auch die Repository-Auswahl verworfen.
- Missverständnis: „hat funktioniert“ bezog sich auf das Token, nicht auf den Push. Aufgefallen ist das, weil der Erfolg über die GitHub-Schnittstelle geprüft statt angenommen wurde.
- Der zweite Push mit den Screenshots brach mit „HTTP 400“ ab. Ein größerer Git-Puffer (`http.postBuffer`) hat das behoben.
- Der Browser-Download für Playwright hing über Stunden. Lösung: Playwright steuert das bereits installierte Chrome (`channel: "chrome"`), ganz ohne Download.
- Beim Ansehen der Screenshots fiel auf, dass Datumsangaben mal mit, mal ohne führende Null erschienen. In der Mono-Schrift standen die Spalten dadurch schief. Jetzt sind sie durchgehend zweistellig.

**Prüfung:** Kriterien erfüllt: öffentliches Repository (github.com/Fransen58/bewerbungstracker), Live-Link (bewerbungstracker-bice.vercel.app), README mit allen geforderten Teilen, PROZESS.md nach jeder Story fortgeschrieben.

**Learnings:**
- Den Erfolg prüfen statt annehmen: Ein Blick über die GitHub-Schnittstelle hat ein Missverständnis sofort sichtbar gemacht.
- Screenshots sind auch ein Test. Auf einem ruhigen Gesamtbild fallen Kleinigkeiten auf, die beim Klicken untergehen.
- Wenn ein Werkzeug hängt, lohnt sich die Frage nach einem anderen Weg zum selben Ziel, statt weiter zu warten.

## Ausbaustufe 2: Planung nach dem MVP

**Entscheidungen:**
- Reihenfolge: Story 11 (KI-Import) vor Story 10 (Cloud-Sync). Der Import spart bei jeder Bewerbung Arbeit und ist der stärkere Nachweis. Cloud-Sync ist der größte und riskanteste Brocken und kommt mit mehr Erfahrung später.
- Story 11 wurde um den Link-Import erweitert, mit Text-Einfügen als Rückfallweg. Neu ist Story 13 „Stelle vom Handy teilen“.
- Die Kosten wurden vor dem Bau aufgeschlüsselt: Preis pro Import je Modell, ein Ausgabenlimit in der Anthropic-Konsole als harter Deckel gegen Missbrauch der öffentlichen App.

## Story 11: Stellenanzeige per KI importieren

**Ziel:** Link oder Text einer Stellenanzeige einfügen, die KI füllt die Felder vor. Ich prüfe vor dem Speichern, und was die Anzeige nicht hergibt, bleibt leer.

**Vorgehen in Schritten, jeder einzeln lauffähig:**
1. Neues Feld `requirements` (Pflichtanforderungen) mit Schema-Version 2. Alte Browserdaten und alte Backups werden beim Lesen automatisch migriert, getestet mit einem Backup der Version 1.
2. Den statischen Export abgeschaltet. Alle Seiten werden weiterhin vorab gebaut, neu ist nur eine Server-Funktion (`/api/import`).
3. Server-Funktion: Sie ruft den Link selbst ab, wandelt HTML in Text um (strukturierte Stellendaten nach schema.org bleiben erhalten) und lässt Claude Haiku 5.5 die Felder in einem festen Ausgabeformat auslesen (Structured Outputs).
4. Oberfläche: ein Import-Feld oben im Dialog „Neue Bewerbung“. Vorschläge landen im Formular, selbst Getipptes bleibt stehen, gespeichert wird erst beim Klick auf „Speichern“.

**Entscheidungen:**
- Anforderungen als eigenes Feld statt in den Notizen, weil Story 12 (Passung) genau diese Liste braucht.
- Haiku statt Opus: Das Auslesen ist eine einfache Aufgabe, Haiku kostet etwa ein Dreißigstel. Gestartet wird mit Haiku, verglichen wird später.
- Den Link ruft unser Server ab, nicht Claudes Web-Fetch-Werkzeug. Das Werkzeug ist für Haiku nicht als unterstützt dokumentiert. So ist es außerdem nur ein KI-Aufruf pro Import und unabhängig vom Modell.
- Schutz: Nur öffentliche http(s)-Adressen werden abgerufen, interne Adressen abgelehnt. Die Textlänge ist begrenzt, das begrenzt auch die Kosten. Der Anzeigentext gilt im Prompt als Daten, nicht als Anweisung.
- Der API-Schlüssel liegt nur in `.env.local` (lokal) bzw. in den Vercel-Einstellungen, nie im Code und nie im Chat. Er wurde direkt aus der Zwischenablage in die Datei geschrieben.

**Probleme:**
- Die Next.js-Version ist neuer als Claudes Trainingswissen. Deshalb wurde die mitgelieferte Doku zu Route Handlern gelesen, bevor gebaut wurde.
- Ein Formatierungswerkzeug hat ungefragt Stellen außerhalb der Änderung umformatiert. Zurückgesetzt, damit jede geänderte Zeile zur Aufgabe gehört.
- Im ersten Nutzertest wurde der Knopf „Felder ausfüllen“ übersehen, der Text wurde ohne Import gespeichert. Das Server-Log zeigte eindeutig: Es kam gar keine Anfrage an. Lösung: Der Knopf ist jetzt der auffällige Hauptknopf, mit Hinweis daneben.

**Prüfung:**
- Vier erfundene Anzeigen: vollständig, ohne Gehalt, englisch, Login-Seite. Alles erkannt bzw. korrekt leer gelassen, „Schön wäre“-Punkte nicht als Pflicht übernommen.
- Dazu echte Links von StepStone, JOIN und LinkedIn sowie ein eingefügter Text.
- Gemessene Kosten: rund 0,02 Cent pro Import, 1–5 Sekunden Dauer.

**Learnings:**
- Logs sind der schnellste Weg von „funktioniert nicht“ zur Ursache.
- „Nichts raten“ muss man der KI ausdrücklich sagen und am Ergebnis prüfen. Mit klaren Regeln hält sich auch ein kleines Modell daran.
- Kosten vorher aufschlüsseln und danach messen schafft Vertrauen. Die Schätzung lag deutlich über dem echten Wert.

**Nachtrag nach dem zweiten Nutzertest:** Beim LinkedIn-Link („Hamburg or Remote from Germany“) blieb das Arbeitsmodell leer. Die Regel „remote nur bei komplett remote“ war zu streng, denn die Anzeige sagt eindeutig, dass Remote möglich ist. Neue Regel: remote, sobald komplett remote möglich ist, auch als eine von mehreren Optionen; hybrid bei Büro plus Homeoffice oder mobilem Arbeiten; vor Ort nur, wenn die Anzeige das klar sagt; leer, wenn sie nichts dazu sagt (ein Ort allein heißt nicht „vor Ort“). Geprüft mit fünf neuen Testsätzen, den bisherigen Anzeigen und dem LinkedIn-Link, alle elf Fälle richtig. Dabei aufgefallen: LinkedIn blockt wiederholte Abrufe zeitweise (Fehler 429). Für Nutzer greift dann die bestehende Meldung mit dem Rückfallweg „Text einfügen“.
Learning: „Nicht raten“ heißt nicht „im Zweifel leer“. Die Regel muss eindeutige Aussagen auch dann einordnen, wenn sie nicht wörtlich zur Kategorie passen.

## Story 12: Passung einschätzen

**Ziel:** Profil einmal hinterlegen, dann schätzt die KI ein, wie gut eine Stelle passt: Prozent, Konfidenz, größte Lücke, ein Satz Begründung. Als KI-Vorschlag gekennzeichnet und überschreibbar.

**Vorgehen in Schritten, jeder einzeln lauffähig:**
1. Datenmodell Version 3: Profil (`profile`) und letzte Einschätzung je Bewerbung (`fit_assessment`). Alte Daten und Backups der Versionen 1 und 2 werden migriert, getestet mit acht Fällen, darunter kaputte und zu neue Dateien.
2. Neue Seite „Profil“ mit einem Textfeld und einem Hinweis, wann das Profil die App verlässt.
3. Zweite Server-Funktion `/api/fit` mit Haiku 5.5 und festem Ausgabeformat, getestet mit erfundenen Fällen: passend, teilweise, unpassend, nur Jobtitel, sehr kurzes Profil.
4. Bereich „Passung“ auf der Detailseite: Einschätzung aus den gespeicherten Feldern, Kennzeichnung „KI-Vorschlag“, nach eigener Zahl „Frühere KI-Einschätzung“.
5. „Passung prüfen“ direkt nach dem Import, mit Verwerfen-Vorschlag.
6. Demo: erfundenes Profil und Pflichtanforderungen für einige Beispielstellen.

**Entscheidungen:**
- Konfidenz kam aus dem Nutzertest des Plans: Je mehr über Stelle und Profil bekannt ist, desto belastbarer die Zahl. Die KI vergibt sie nach festen Regeln (konkrete Anforderungen? ausführliches Profil?), damit sie nachvollziehbar bleibt.
- Gatekeeper: Die Idee kam vom Nutzer. Nach dem Import kennt die KI den ganzen Anzeigentext, dort ist die Einschätzung am genauesten. Sie läuft nur auf Klick, Import und Anlegen ohne Einschätzung bleiben wie bisher.
- Verwerfen wird nur bei unter 50 % **und** mindestens mittlerer Konfidenz vorgeschlagen. Im Test bekam eine Stelle, von der nur der Titel bekannt war, 45 % bei niedriger Konfidenz. Wenig Wissen ist kein Grund zum Verwerfen, sondern einer zum Nachschauen.
- „Überschreibbar“ ohne zusätzliches Feld: Die KI schreibt ihre Zahl in die normale Passung. Weicht die Passung später davon ab, hat der Nutzer sie geändert, und die Kennzeichnung verschwindet.
- Lücke und Begründung schreibt die KI in der eingestellten Sprache. Beim späteren Umschalten bleiben sie, wie sie sind, denn sie sind Text und keine Auswahlwerte.

**Probleme:**
- Lücke und Begründung waren im ersten Test zu lang. Eine Wortgrenze im Prompt (8 bzw. 25 Wörter) hat das gelöst.
- Der seit Tagen laufende Entwicklungsserver hatte eine geänderte Datei nicht neu geladen und lieferte einen Fehler, den es im Code nicht gab. Ein Neustart behob ihn. Das Server-Log zeigte die Stelle sofort.
- Ein Browser-Test fand „KI-Vorschlag“ schon im Hinweistext des Imports und wartete deshalb nicht auf das Ergebnis. Der Fehler lag im Test, nicht in der App. Seitdem wartet der Test auf einen Text, den es nur im Ergebnis gibt.

**Prüfung:**
- Test-Staffelung: passend 88 %, teilweise 35 %, unpassend 5 %. Bei nur Jobtitel oder Ein-Satz-Profil Konfidenz „niedrig“.
- Browser-Tests: ohne Profil Hinweis mit Link, Einschätzung speichern, eigene Zahl überschreibt, Gatekeeper mit Verwerfen (nichts gespeichert), Speichern mit Einschätzung, Import ohne Einschätzung, Englisch.
- Kosten: rund 1.000 Eingabe- und 150–700 Ausgabe-Token pro Einschätzung, also Bruchteile eines Cents.

**Learnings:**
- Ein Nutzer-Einwand („je mehr Infos, desto genauer“) hat das Feature besser gemacht als der ursprüngliche Plan.
- Schwellenwerte erst mit echten Ergebnissen festzurren: Der Grenzfall „wenig bekannt“ fiel erst im Test auf.

**Nachtrag: Lebenslauf als PDF einlesen.** Auf die Frage „Kann ich einen Lebenslauf hochladen?“ kam ein kleiner Knopf auf der Profilseite dazu. Die PDF geht an eine dritte Server-Funktion (`/api/cv`). Claude liest sie direkt, die API kann PDFs ohne Umweg über eine Texterkennung verarbeiten. Heraus kommt ein geordneter Profiltext, den der Nutzer prüft und selbst speichert.
- Entscheidungen: Kontaktdaten, Geburtsdatum, Familienstand usw. lässt die KI weg, weil sie für die Passung egal sind. Datensparsamkeit gehört hier zum Feature. Die Datei wird nirgends gespeichert. Echte Dokumente kommen später mit den Master-Dokumenten, das steht so in der SPEC. Steht schon Text im Profil, fragt die App vor dem Ersetzen.
- Schutz: Geprüft wird die Dateikennung `%PDF-`, nicht nur die Endung. Die Größengrenze von 4 MB wird schon im Browser geprüft, damit nichts umsonst hochgeladen wird. Vercel nimmt ohnehin nur rund 4,5 MB pro Anfrage an.
- Prüfung: Ein erfundener Lebenslauf als PDF wurde vollständig übernommen, ohne Name, Adresse, Telefon, E-Mail und Geburtsdatum. Ein Rezept als PDF wurde als „kein Lebenslauf“ erkannt. Eine Nicht-PDF und eine zu große Datei werden mit klarer Meldung abgelehnt. Kosten: rund 2.600 Eingabe- und 430 Ausgabe-Token für eine Seite, etwa 0,05 Cent.
- Learning: Die Testdateien (PDFs) hat das Browser-Testwerkzeug selbst erzeugt. So waren es von Anfang an erfundene Daten, und niemand musste echte Lebensläufe benutzen.

## Story 14: Gespräch vorbereiten

**Ziel:** Pro Stelle fünf wahrscheinliche Fragen mit passendem Beispiel aus dem eigenen Profil und drei Rückfragen an die Firma, gespeichert an der Bewerbung.

**Vorgehen:** Die Story wurde vor Board/Liste und Story 13 vorgezogen, weil sie im Portfolio am meisten sichtbaren Nutzen bringt. Story 13 (Teilen vom Handy) funktioniert ohnehin nur auf Android, ein Personaler am Laptop sähe davon nichts. Umgesetzt wurde sie nach dem Muster der Passung: Schema-Version 4 mit Migration, Server-Funktion `/api/interview` mit Haiku 5.5 und festem Ausgabeformat, ein Bereich auf der Detailseite. Den Hinweis „Profil anlegen“ nutzen jetzt Passung und Gesprächsvorbereitung gemeinsam.

**Entscheidungen:**
- „Kein Beispiel“ ist ein gültiges Ergebnis. Fehlt im Profil etwas, zeigt die App den Hinweis, sich selbst ein Beispiel zu überlegen. Gerade diese Lücken sind für die Vorbereitung am wertvollsten.
- Die Eingabe sind die gespeicherten Felder, nicht der ursprüngliche Anzeigentext. Der wird nicht gespeichert. Gepflegte Anforderungen machen die Fragen also besser.

**Probleme:**
- Im ersten Durchlauf schrieb die KI bei einer Frage statt eines Beispiels einen Kommentar über das Profil („…sind im Profil aber nicht genannt“). Die Regel wurde geschärft: ein sagbarer Punkt oder null, nie eine Erklärung, was fehlt.
- Wieder hatte der lange laufende Entwicklungsserver eine Änderung nicht übernommen. Nach dem Neustart lief es. Learning für die nächsten Stories: Nach Änderungen an gemeinsam genutzten Modulen den Server neu starten, bevor man den Fehler im Code sucht.

**Prüfung:** Test mit einem erfundenen Profil gegen eine echte Anzeige (nur lokal): Bei fehlender KI-Erfahrung kam korrekt „kein Beispiel“, die Rückfragen waren firmenspezifisch. Browser-Test im Demo-Modus: erzeugen, anzeigen, nach dem Neuladen noch da.

## Offene Punkte aus dem Nutzertest (16.11.2026)

- Das Prozentzeichen springt beim Sprachwechsel. Vermutete Ursache: „80 %“ (Deutsch, mit Leerzeichen) und „80%“ (Englisch) sind unterschiedlich breit. Noch zu prüfen.
- Aufklappende Fenster wie der Kalender der Datumsfelder sehen anders aus als die Knöpfe und Felder, die sie öffnen. Ursache: Das ist die eingebaute Datumsauswahl des Browsers, die sich kaum gestalten lässt. Abhilfe wäre eine eigene Kalender-Komponente.

## Ausgewählte Prompts

So sahen meine Eingaben an Claude Code typischerweise aus. Die Zitate sind wörtlich, nur Tippfehler sind korrigiert. Die meisten Prompts waren kurz. Die eigentliche Steuerung lag in SPEC.md, CLAUDE.md und den Entscheidungen zwischen den Optionen, die Claude vorgeschlagen hat.

**Starten und steuern**
- „Node.js ist installiert, können wir mit dem Tracker weitermachen?“ → Claude las SPEC.md und CLAUDE.md, erkannte, dass noch nichts gebaut war, und schlug einen Plan für Story 0 vor.
- „Plan passt so. Ich habe eine CLAUDE.md noch aus dem Internet geladen. Führe beide zusammen.“
- „Nein, gerne der Reihe nach. GO“ (auf die Frage, ob eine spätere Story vorgezogen werden soll)

**Entscheiden statt ausformulieren.** Claude legte offene Punkte als Optionen mit Empfehlung vor, die Antwort war oft ein Buchstabe:
- „1. Ja, eine Spalte pro Status. 2. Perfekt so. 3. Ja, machen wir so. 4. Perfekt. […] Variante B ist die beste.“
- „Passt so. Variante A passt.“

**Richtung ändern**
- „Bevor ich die Frage beantworte: Wie gehen wir UI an? Die Seite ist ja sehr funktional jetzt. Machen wir das am Ende, wenn alles steht, oder sollten wir uns vorher ein Designkonzept überlegen?“ → führte zum Designschritt und zu DESIGN.md.
- „Ich habe eine coole Website gefunden, auf deren Basis ich gerne eine DESIGN.md erstellen lassen möchte.“ (mit Link)
- „Können wir nicht in der App die Möglichkeit einbauen, das Theme zu ändern?“ → Hell/Dunkel wurde aus Story 8 vorgezogen.

**Rückmeldung aus dem Test**
- „Es gibt keine Möglichkeit, einzelne Filter zurückzusetzen. Die Filter könnten als Chips mit einem X gesetzt werden. Oder wir packen in die Auswahl eine Auswahl ein, die ‚Alle‘ heißt. Und einen Button ‚Filter zurücksetzen‘, der sofort sichtbar ist.“
- „Die Balken sehen aus wie Skeleton Loader in grau. Ich weiß nicht, was die da machen.“ → Balken entfernt.
- „Ich würde den Sprachswitch aber auch in der Handyansicht in das Burgermenü packen, bei Theme.“
- „Base UI: A component is changing the default value state of an uncontrolled Select after being initialized. […] Habe ich als Issue beim Ändern erhalten.“ → Fehlermeldung einfach hineinkopiert, Ursache gefunden und behoben.

**Verstehen wollen**
- „Was ist genau mit Events gemeint?“
- „Was genau macht die Antwortquote? […] Quote war 75 %. Ist das korrekt so?“
- „Kann ich für Schritt 3 einfach ein neues Fenster hier öffnen? Oder muss ich dich schließen dafür?“

## Fazit

- **Die Dokumente waren wichtiger als die einzelnen Prompts.** SPEC.md, CLAUDE.md und DESIGN.md haben dafür gesorgt, dass kurze Prompts genügten und das Ergebnis trotzdem konsistent blieb.
- **„Plan zuerst, dann OK“ hat sich bewährt.** Unklarheiten kamen vor dem Code auf den Tisch, zum Beispiel die Definition der Antwortquote, der Umgang mit Statuswechseln im Verlauf oder die Sprache der Demo-Daten. Spec-Änderungen wurden bewusst entschieden und vermerkt.
- **Arbeitsteilung beim Testen:** Was ohne Browser prüfbar ist (Logik, Typen, Build), hat Claude selbst getestet. Ich habe die Oberfläche getestet. Fast jede Story hatte nach meinem Test noch eine Verbesserung, die keiner der automatischen Tests gefunden hätte.
- **Der statische Export hat die Architektur geprägt:** Speicherung im Browser, ID als Parameter in der Adresse, Warten auf die Browserdaten, Sprachwechsel auf dem Client. Das war mehr Arbeit als erwartet, macht die App aber kostenlos und ohne Server betreibbar.
- **KI ersetzt keine Entscheidungen.** Die interessantesten Momente waren die, in denen ich etwas nicht verstanden oder anders gewollt habe.
