# Entstehungsprozess mit Claude Code

Dieses Dokument hält fest, wie der Bewerbungs-Tracker Story für Story mit Claude Code entstanden ist.

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
