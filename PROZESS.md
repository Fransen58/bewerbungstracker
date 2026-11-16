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
