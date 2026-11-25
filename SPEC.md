# Bewerbungs-Tracker – Produkt-Spec (MVP)

## Problem
Ich bewerbe mich parallel auf viele Stellen. Status, Gesprächstermine, offene Fragen (Remote, Workation, Gehalt) und die passende CV-Version verteile ich heute auf Mails, Chats und Notizen. Dadurch verliere ich den Überblick, wo ich stehe und was als Nächstes zu tun ist.

## Ziel
Eine Web-App, in der ich alle Bewerbungen an einem Ort verwalte, auf einen Blick sehe, wo jede steht, und weiß, was als Nächstes ansteht.

Die App ist zugleich ein **öffentliches Portfolio-Projekt**: Sie zeigt, dass ich mit KI (Claude Code) prototypen kann. Besucher sollen sie ohne Anmeldung direkt ausprobieren können.

## Nutzer
Ich selbst (Single-User). Besucher meines Portfolios nutzen die App im Demo-Modus.

## Technischer Rahmen
- Läuft komplett im Browser, kein eigener Server, keine Datenbank, kein Login.
- Daten liegen im `localStorage` des Browsers. Jeder Besucher sieht nur seine eigenen Daten auf seinem Gerät.
- Kostenlos gehostet als statische Seite (Vercel; GitHub Pages möglich).
- Bekannte Grenze (bewusst akzeptiert): Werden die Browserdaten gelöscht, sind die Bewerbungen weg. Schutz bietet nur der Export (Story 6).

## Nicht im MVP
Mehrere Nutzer, Login, Cloud-Sync, Team-Funktionen, E-Mail-Integration, Mobile App, Kalender-Sync, KI-Funktionen.

---

## Datenmodell

**application**
- id
- company (Text, Pflicht)
- role (Text, Pflicht)
- job_url (URL, optional)
- source (Auswahl: zuhausejobs, LinkedIn, JOIN, Karriereseite, Personalvermittlung, Sonstiges)
- status (Auswahl, siehe unten, Pflicht)
- work_model (Auswahl: 100 % remote, hybrid, vor Ort)
- workation (Text, z. B. „90 Tage EU", „unklar")
- salary_range (Text)
- fit_score (Zahl 0–100)
- contact_name, contact_email (optional)
- cv_version (Text, z. B. „DE Builder", „EN Element")
- requirements (Langtext, Pflichtanforderungen der Stelle, eine pro Zeile; ab Schema-Version 2)
- interview_prep (optional, KI-Gesprächsvorbereitung: Fragen mit Beispiel aus dem Profil, Rückfragen an die Firma, Zeitpunkt; ab Schema-Version 4)
- fit_assessment (optional, letzte KI-Einschätzung der Passung: Prozent, Konfidenz niedrig/mittel/hoch, größte Lücke, Begründung, Zeitpunkt; ab Schema-Version 3)
- notes (Langtext)
- applied_at (Datum)
- next_step (Text) und next_step_date (Datum)
- created_at, updated_at

**profile** (Langtext, optional, einmal pro Datenbestand: eigenes Profil für die Passungs-Einschätzung; ab Schema-Version 3)

**event** (Verlauf pro Bewerbung)
- id, application_id
- type (Auswahl: Beworben, Gespräch, Case, Absage, Angebot, Notiz)
- date
- note
- from_status, to_status (optional, nur bei Events aus einem Statuswechsel; feste Status-Schlüssel, damit der Verlauf in jeder Sprache lesbar bleibt)

**Status-Werte (in dieser Reihenfolge):**
Entdeckt → Beworben → Erstgespräch → Weitere Runde → Angebot → Zusage | Absage | Zurückgezogen

Auswahlwerte werden intern als feste Schlüssel gespeichert (z. B. `first_interview`) und nur in der Oberfläche übersetzt, damit der Sprachwechsel die Daten nicht verändert.

---

## User Stories

### 0. Projekt-Setup
Als Entwickler möchte ich ein lauffähiges Grundgerüst, damit alle Stories darauf aufbauen.
- Next.js-Projekt mit TypeScript, Tailwind und shadcn/ui startet lokal ohne Fehler.
- Git-Repository ist angelegt, erster Commit vorhanden.
- Grundlayout mit Navigation (Übersicht, Board, Liste) funktioniert auf Desktop und Handy.

### 1. Bewerbung anlegen
Als Bewerber möchte ich eine neue Stelle schnell anlegen, damit ich nichts vergesse.
- Pflichtfelder: Firma, Rolle, Status. Alle anderen Felder optional.
- Nach dem Speichern erscheint die Bewerbung sofort in Board und Liste.
- Ungültige URL wird mit verständlicher Fehlermeldung abgelehnt.
- Eine ungültige E-Mail-Adresse wird ebenso abgelehnt; beim Speichern springt der Fokus auf das erste fehlerhafte Feld. Schließen mit ungespeicherten Eingaben fragt vorher nach. *(Ergänzt nach dem Testbericht vom 25.11.2026.)*
- Daten bleiben nach dem Neuladen der Seite erhalten.

### 2. Board-Ansicht
Als Bewerber möchte ich alle Bewerbungen als Kanban-Board nach Status sehen, damit ich auf einen Blick weiß, wo ich stehe.
- Eine Spalte pro Status, Karten zeigen Firma, Rolle, Arbeitsmodell und nächsten Schritt.
- Karten lassen sich per Drag & Drop in einen anderen Status ziehen; der Wechsel wird gespeichert und als Event protokolliert.
- Bewerbungen mit überfälligem nächsten Schritt sind sichtbar markiert.
- Auf dem Handy ist das Board horizontal scrollbar und der Status auch ohne Drag & Drop änderbar.
- Verlässt eine Bewerbung „Entdeckt“ und hat noch kein Datum „Beworben am“, wird das heutige gesetzt. *(Ergänzt nach dem Testbericht vom 25.11.2026.)*

### 3. Listen-Ansicht mit Filter
Als Bewerber möchte ich alle Bewerbungen als Tabelle sehen und filtern, damit ich gezielt suchen kann.
- Filter nach Status, Arbeitsmodell und Quelle; Suche nach Firma oder Rolle.
- Sortierung nach Datum, Passung und nächstem Schritt.

### 4. Detailseite mit Verlauf
Als Bewerber möchte ich zu jeder Bewerbung alle Infos und den Verlauf sehen, damit ich mich schnell auf ein Gespräch vorbereiten kann.
- Alle Felder sind bearbeitbar.
- Verlauf zeigt Events chronologisch; neue Events lassen sich hinzufügen.
- Ein Statuswechsel trägt im Verlauf den neuen Status als Titel; eine Notiz ohne Text wird nicht gespeichert. *(Ergänzt nach dem Testbericht vom 25.11.2026.)*
- Eine Bewerbung lässt sich nach Rückfrage löschen.

### 5. Übersicht (Dashboard)
Als Bewerber möchte ich Kennzahlen zu meiner Suche sehen, damit ich merke, was funktioniert.
- Anzahl je Status, Antwortquote (Bewerbungen mit Rückmeldung / alle beworbenen), durchschnittliche Passung.
- Liste „Diese Woche fällig" mit allen nächsten Schritten der kommenden 7 Tage. *(Ergänzt: Überfällige Schritte stehen rot markiert oben in der Liste.)*

### 6. Backup: Export und Import
Als Bewerber möchte ich meine Daten sichern und wiederherstellen, damit sie nicht verloren gehen.
- Export lädt alle Bewerbungen und Events als JSON-Datei herunter.
- Import liest eine solche Datei ein; vorher wird gefragt, ob die aktuellen Daten ersetzt werden sollen.
- Eine ungültige Datei wird mit verständlicher Fehlermeldung abgelehnt, ohne vorhandene Daten zu verändern.
- Fehlen in einer Datei optionale Felder, gelten sie als leer; abgelehnt werden nur vorhandene, aber ungültige Werte. *(Ergänzt nach dem Testbericht vom 25.11.2026.)*
- Ein Hinweis erklärt, dass die Daten nur in diesem Browser liegen und ein Export als Backup empfohlen ist.

### 7. Demo-Modus
Als Besucher meines Portfolios möchte ich die App mit Beispieldaten ausprobieren, ohne selbst etwas eingeben zu müssen.
- Demo-Modus lässt sich mit einem Klick starten (auch aus dem leeren Zustand heraus).
- Ca. 10–15 realistische, frei erfundene Beispielbewerbungen über alle Status verteilt, inkl. Verlauf und fälliger Schritte.
- Ein deutlich sichtbares Banner zeigt „Demo-Modus – Beispieldaten" und bietet „Demo beenden".
- Demo-Daten werden getrennt gespeichert; meine echten Daten werden weder überschrieben noch vermischt.
- Änderungen im Demo-Modus sind möglich; „Demo zurücksetzen" stellt die Beispieldaten wieder her.

### 8. Sprache und Design-Modus
Als Nutzer möchte ich Sprache und Hell/Dunkel-Modus selbst wählen.
- Umschalter Deutsch/Englisch ist jederzeit gut sichtbar in der Navigation; alle Oberflächentexte werden übersetzt. *(Angepasst: auf dem Desktop in der Kopfzeile, auf dem Handy im Menü neben Hell/Dunkel.)*
- Umschalter Hell/Dunkel (Standard: Systemeinstellung). *(Vorgezogen im Designschritt nach Story 2: Knopf in der Kopfzeile, Wahl wird gespeichert.)*
- Beide Einstellungen bleiben nach dem Neuladen erhalten.
- Die Seite erscheint direkt in der gewählten Sprache, ohne kurz deutsche Texte zu zeigen; auch der Titel im Browser-Tab ist übersetzt. *(Ergänzt nach dem Testbericht vom 25.11.2026.)*

### 9. Veröffentlichung und Dokumentation
Als Bewerber möchte ich das Projekt öffentlich zeigen, damit es als Nachweis meiner Fähigkeiten dient.
- Code liegt in einem öffentlichen GitHub-Repository.
- App ist unter einem öffentlichen Live-Link erreichbar.
- README.md (Deutsch, mit englischer Kurzfassung) enthält Beschreibung, Screenshots, Live-Link, Funktionen, Tech-Stack und lokale Startanleitung.
- PROZESS.md dokumentiert, wie das Projekt mit Claude Code entstanden ist: Vorgehen, Entscheidungen, Prompts, Probleme und Learnings. Wird nach jeder Story fortgeschrieben.

---

## Ausbaustufe 2 (nach dem MVP)

_Reihenfolge (entschieden nach dem MVP): Story 11, dann 12, dann 14 (vorgezogen am 25.11.2026 für mehr sichtbaren Nutzen im Portfolio), dann 15 (Board und Liste zusammenführen), dann 16 (eigene Datumsauswahl), dann 17 (CV-Versionen vergleichen), dann 13, dann 10. Dokumente und E-Mail erst nach dem Cloud-Sync._

### 10. Cloud-Sync und Login
- Optionale Speicherung in Supabase mit Login per Magic Link und Row Level Security, damit die Daten geräteübergreifend und sicher verfügbar sind.

### 11. Stellenanzeige per KI importieren
Als Bewerber möchte ich den Link oder den Text einer Stellenanzeige einfügen, damit die Felder automatisch vorausgefüllt werden.
- Ich kann einen öffentlichen Link einfügen; lässt sich die Seite nicht lesen (z. B. Login nötig), sagt die App das verständlich und bietet das Einfügen des Textes als Rückfallweg an.
- KI extrahiert Firma, Rolle, Arbeitsmodell, Workation, Gehalt und Pflichtanforderungen.
- Ich prüfe und korrigiere die Vorschläge vor dem Speichern; nichts wird ungefragt gespeichert.
- Felder, die die Anzeige nicht hergibt, bleiben leer statt geraten.
- Der Vorschlag füllt nur leere Felder (oder ersetzt einen eigenen früheren Vorschlag); was ich eingetragen habe, bleibt. Ein Link, der sich nicht lesen lässt, landet trotzdem im Feld „Link zur Stellenanzeige“. *(Ergänzt nach dem Testbericht vom 25.11.2026.)*

### 12. Passung einschätzen
Als Bewerber möchte ich eine erste Einschätzung, wie gut eine Stelle zu meinem Profil passt.
- Mein Profil ist einmalig hinterlegt.
- Ich kann meinen Lebenslauf als PDF hochladen; die KI macht daraus einen Profiltext ohne Kontaktdaten, den ich prüfe und speichere. Die Datei selbst wird nicht gespeichert. *(Ergänzt nach dem ersten Test von Story 12.)*
- Ausgabe: Passung in Prozent, größte Lücke, ein Satz Begründung.
- Die Einschätzung ist als KI-Vorschlag gekennzeichnet und überschreibbar.
- Eine selbst gesetzte Passung bleibt beim (Neu-)Einschätzen erhalten; der KI-Wert steht daneben und lässt sich per Knopf übernehmen. *(Ergänzt nach dem Testbericht vom 25.11.2026.)*
- Zusätzlich wird eine Konfidenz (niedrig/mittel/hoch) angezeigt, die davon abhängt, wie viele Angaben zu Stelle und Profil vorliegen.
- Nach dem Import kann ich die Passung optional prüfen, bevor ich speichere. Bei geringer Passung (unter 50 %, bei mindestens mittlerer Konfidenz) schlägt die App vor, die Stelle zu verwerfen; die Entscheidung bleibt bei mir. *(Ergänzt im Test: Bei niedriger Konfidenz kommt stattdessen der Hinweis, Angaben zu ergänzen.)*
- Ohne Klick auf „Passung prüfen“ läuft keine Einschätzung; Import und Anlegen funktionieren wie bisher.

### 13. Stelle vom Handy teilen
Als Bewerber möchte ich eine Stellenanzeige auf dem Handy über „Teilen“ direkt an den Tracker schicken, damit ich Stellen unterwegs in Sekunden erfasse.
- Die App lässt sich auf dem Handy installieren (Progressive Web App) und erscheint danach im Teilen-Menü.
- Ein geteilter Link oder Text startet den Import aus Story 11 mit denselben Regeln (prüfen vor dem Speichern, nichts raten).

### 14. Gespräch vorbereiten
Als Bewerber möchte ich mich gezielt auf ein Gespräch für eine bestimmte Stelle vorbereiten.
- Auf der Detailseite erzeugt „Gespräch vorbereiten“ aus Stelle und Profil 5 wahrscheinliche Fragen, jeweils mit einem passenden Beispiel aus meinem Profil, und 3 Rückfragen an die Firma.
- Gibt das Profil zu einer Frage kein oder nur ein teilweises Beispiel her, bekomme ich einen Experten-Rat: Einordnung der Lücke, Brücke zu vorhandener Erfahrung, ein konkreter erster Lernschritt und ein Formulierungsvorschlag. Nichts wird erfunden, Lernbereitschaft ist ein Angebot, keine behauptete Tatsache. *(Geändert nach dem Nutzertest: Der bloße Hinweis „überleg dir ein Beispiel“ half zu wenig.)*
- Die Vorbereitung wird an der Bewerbung gespeichert (ab Schema-Version 4) und lässt sich neu erzeugen.
- Ohne Profil gibt es einen Hinweis mit Link zum Profil.
- Die Vorbereitung ist als KI-Vorschlag gekennzeichnet und in der eingestellten Sprache.

### 15. Bewerbungen: Board und Liste auf einer Seite
Als Nutzer möchte ich alle Bewerbungen auf einer Seite sehen und zwischen Board und Liste wechseln.
- Eine Seite „Bewerbungen“ ersetzt Board und Liste in der Navigation; ein Umschalter wechselt zwischen Board- und Listenansicht.
- Die gewählte Ansicht bleibt nach dem Neuladen erhalten; beim ersten Besuch startet das Board.
- Suche und Filter (Status, Arbeitsmodell, Quelle) gelten für beide Ansichten und bleiben beim Wechsel erhalten. *(Ergänzt im Test: Auf dem Handy liegen die Filter hinter einem Knopf „Filter“; mit Status-Filter zeigt das Board nur diese Spalte.)*
- Alte Links auf `/board` und `/list` führen auf die neue Seite mit der passenden Ansicht.
- Das Prozentzeichen springt beim Sprachwechsel nicht mehr.
- Der Hinweis „Profil anlegen“ im Import-Dialog verliert die importierten Felder nicht.

### 16. Eigene Datumsauswahl
Als Nutzer möchte ich, dass die Datumsauswahl zum Design der App passt.
- Alle Datumsfelder öffnen eine eigene Kalender-Ansicht im Stil der App, hell und dunkel, auch auf dem Handy.
- Das Feld zeigt das Datum im gewohnten Format der Sprache; Monatsnamen und Wochentage sind übersetzt, im Deutschen beginnt die Woche am Montag.
- Knöpfe „Heute“ und „Leeren“; ein Datum wird nur ausgewählt, nicht eingetippt.
- Bedienbar mit Maus, Touch und Tastatur (Pfeiltasten, Enter, Escape).
- Gespeichert wird weiter `YYYY-MM-DD`; Daten, Backups und die Pflichtprüfung beim Verlaufseintrag bleiben unverändert.

### 17. CV-Versionen vergleichen
Als Nutzer möchte ich sehen, welche CV-Version wie oft eine Antwort bekommt, damit ich meine Versionen gezielter einsetze.
- Die Übersicht zeigt einen Block „CV-Versionen“: je Version die Zahl der Bewerbungen, die Zahl der Antworten und die Antwortquote.
- „Antwort“ zählt wie bei der bestehenden Antwortquote: Die Bewerbung ist über „Entdeckt“ hinaus, und Status oder Verlauf zeigen eine Rückmeldung (Erstgespräch, weitere Runde, Angebot, Zusage, Absage). Die Quote bezieht sich auf die abgeschickten Bewerbungen.
- Gleiche Versionen werden zusammengefasst, auch bei anderer Groß-/Kleinschreibung oder zusätzlichen Leerzeichen; angezeigt wird die häufigste Schreibweise. Das Feld bleibt Freitext.
- Bewerbungen ohne CV-Version erscheinen als eigene Zeile „Ohne Angabe“, immer am Ende.
- Sortiert nach Antwortquote, bei Gleichstand nach Zahl der Bewerbungen.
- Bei weniger als drei abgeschickten Bewerbungen einer Version steht ein Hinweis, dass die Zahl noch wenig aussagt.
- Neutrale Darstellung: keine Wertung wie „beste Version“, keine Auszeichnung (Prinzip „Handlungen belohnen, nie Ergebnisse“).
- Der Block erscheint, sobald mindestens eine abgeschickte Bewerbung eine CV-Version hat. Keine Datenänderung, keine Migration.

---

## Ideen-Speicher (noch nicht eingeplant)

Gesammelt am 16.11.2026 nach einem ruhigen Durchgang durch das Tool. Nichts davon ist beschlossen; eine Idee wird erst durch eine eigene Story mit Akzeptanzkriterien zum Umfang.

**Vom Nutzer**
- Board und Liste zu einer Seite zusammenführen, mit Ansichts-Umschalter. *(Umgesetzt als Story 15.)*
- Wow-Faktor finden: Was hebt das Tool von Notion-Vorlagen oder Jobstep ab?
- E-Mail-Konto verknüpfen: Antworten von Firmen automatisch erkennen, Mailverlauf an der Bewerbung hinterlegen.
- Tipps zur jeweiligen Bewerbung erzeugen.
- Bewerbung im Tool durchführen: Lebenslauf und Anschreiben auf die Stelle anpassen, als PDF erzeugen, dann zur Originalanzeige springen.
- Stellen vom Handy teilen (bereits als Story 13 eingeplant).
- Alternative Version mit Gamification: Jobsuche als Spiel, mit Belohnungen, Erfahrungspunkten und Leveln, aber professionell und organisiert. *(Für später. Grundsatz: Belohnt werden Handlungen, nie Ergebnisse, also z. B. eine Bewerbung abschicken oder nachfassen, nicht eine Zusage.)*
- Wissensbereich mit aktuellen Tipps: Online-Bewerbung, Gespräche, Formulare, Dokumente, Unterschiede nach Land und Branche.
- Bewerbungsgespräch für ein bestimmtes Unternehmen üben.
- Werkzeuge, um die eigenen Skills realistisch einzuschätzen.
- Dokumente je Bewerbung jederzeit abrufbar.
- Master-Dokumente (Lebenslauf, Anschreiben) ansehen und anpassen. Den Lebenslauf hochladen und auslesen lassen bleibt dabei ausdrücklich möglich (Grundlage: PDF-Upload aus Story 12).
- Konstruktives, professionelles Feedback auf Dokumente und Bewerbungen, angepasst an Markt, Branche und Arbeitgeber.

**Von Claude ergänzt**
- CV-Versionen vergleichen. *(Umgesetzt als Story 17.)*
- CV-Versionen als Dateien ablegen und im Bewerbungsdialog auswählen statt eintippen. Erst nach dem Cloud-Sync, weil der Browser-Speicher für PDFs zu klein ist; baut auf den Versionsnamen aus Story 17 auf.
- Nachfass-Assistent: Wenn eine Bewerbung nach X Tagen ohne Antwort ist, erinnern und einen höflichen Nachfass-Entwurf vorschlagen.
- Gesprächsvorbereitung je Stelle aus Anforderungen und eigenem Profil: wahrscheinliche Fragen, eigene passende Beispiele, Rückfragen an die Firma.
- Arbeitszeugnis-Übersetzer (DACH-typisch): Zeugnisformulierungen in Klartext übersetzen.
- Absagen auswerten: Muster über viele Bewerbungen erkennen (Branche, Rolle, Anforderungslücken), ohne zu verurteilen.
- Wochenrückblick: Was lief diese Woche, was steht an, eine konkrete nächste Aktion.

**Aus der Recherche zur Gesprächsvorbereitung (25.11.2026)**
- Lückenkarte: jede Pflichtanforderung als abgedeckt, teilweise oder fehlend markieren, mit Fundstelle im Profil.
- Geschichtenbank: 5–8 Geschichten aus dem Profil, den wahrscheinlichen Fragen zugeordnet; fehlt ein Ergebnis, fragt das Tool nach statt zu ergänzen.
- Felder Land, Gesprächsart/Runde und Gehaltswunsch: machen Länderhinweise (Du/Sie, Selbstdarstellung, Dankes-Mail), Format-Hinweise (Case, Portfolio, Take-Home, Kommission) und Gehaltsvorbereitung verlässlich.
- Tipps auch zu gut abgedeckten Fragen (welche Geschichte, eigene Rolle und Ergebnis betonen).
- Checkliste vorher/nachher: Technik-Check beim Video-Interview, Notizen direkt danach, Dankes-Mail je nach Land.
- Nachbereitung je Runde: gestellte Fragen und Eindrücke erfassen, die nächste Runde darauf aufbauen.
- Probeinterview: Fragen nacheinander beantworten, Rückmeldung gegen ein Raster (Üben mit Rückmeldung wirkt laut Forschung am stärksten).

**Aus dem Testbericht (25.11.2026), noch nicht umgesetzt**
- Verlaufseinträge bearbeiten und löschen (Löschen mit Rückfrage), mindestens die manuellen.
- Ein Verlaufseintrag „Absage“ oder „Angebot“ bietet an, den Status mitzuändern.
- Quelle beim KI-Import erkennen; StepStone, Indeed und XING als Quellen ergänzen (ändert die Auswahlwerte).
- Antwortquote im UI kurz erklären (z. B. Tooltip): Was zählt als Antwort, warum zählt eine zurückgezogene Bewerbung nur nach einem Gespräch.
- Demo-Persona an das Portfolio anpassen: Product-Manager- und Product-Owner-Rollen statt Design-Rollen.
- Liste auch nach Firma und Status sortieren.
- Suche und Filter in der Adresse speichern (teilen, Zurück-Taste).
- Übersicht: Klick auf eine Status-Zeile öffnet die gefilterte Liste.
- Board auf dem Desktop: Hinweis, dass sich weitere Spalten seitlich anschließen. Auf dem Handy leere Spalten einklappen oder Status-Tabs.
- Liste auf dem Handy als Karten statt breiter Tabelle.
- „Demo starten“ auch im Handy-Menü.
- Rückmeldung nach Speichern und Löschen, Löschen mit „Rückgängig“ für einige Sekunden.

---

## Qualität
- Oberfläche auf Deutsch und Englisch umschaltbar, responsiv (Desktop und Handy).
- Modernes, professionelles, ruhiges Design mit konsistentem Design-System, Hell- und Dunkelmodus.
- Leere Zustände sind gestaltet (z. B. „Noch keine Bewerbung – leg die erste an").
- Unbekannte Adressen zeigen eine eigene, übersetzte Fehlerseite mit Weg zurück zur Übersicht. *(Ergänzt nach dem Testbericht vom 25.11.2026.)*
