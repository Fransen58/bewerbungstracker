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
