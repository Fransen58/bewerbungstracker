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
- notes (Langtext)
- applied_at (Datum)
- next_step (Text) und next_step_date (Datum)
- created_at, updated_at

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
- Daten bleiben nach dem Neuladen der Seite erhalten.

### 2. Board-Ansicht
Als Bewerber möchte ich alle Bewerbungen als Kanban-Board nach Status sehen, damit ich auf einen Blick weiß, wo ich stehe.
- Eine Spalte pro Status, Karten zeigen Firma, Rolle, Arbeitsmodell und nächsten Schritt.
- Karten lassen sich per Drag & Drop in einen anderen Status ziehen; der Wechsel wird gespeichert und als Event protokolliert.
- Bewerbungen mit überfälligem nächsten Schritt sind sichtbar markiert.
- Auf dem Handy ist das Board horizontal scrollbar und der Status auch ohne Drag & Drop änderbar.

### 3. Listen-Ansicht mit Filter
Als Bewerber möchte ich alle Bewerbungen als Tabelle sehen und filtern, damit ich gezielt suchen kann.
- Filter nach Status, Arbeitsmodell und Quelle; Suche nach Firma oder Rolle.
- Sortierung nach Datum, Passung und nächstem Schritt.

### 4. Detailseite mit Verlauf
Als Bewerber möchte ich zu jeder Bewerbung alle Infos und den Verlauf sehen, damit ich mich schnell auf ein Gespräch vorbereiten kann.
- Alle Felder sind bearbeitbar.
- Verlauf zeigt Events chronologisch; neue Events lassen sich hinzufügen.
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

### 9. Veröffentlichung und Dokumentation
Als Bewerber möchte ich das Projekt öffentlich zeigen, damit es als Nachweis meiner Fähigkeiten dient.
- Code liegt in einem öffentlichen GitHub-Repository.
- App ist unter einem öffentlichen Live-Link erreichbar.
- README.md (Deutsch, mit englischer Kurzfassung) enthält Beschreibung, Screenshots, Live-Link, Funktionen, Tech-Stack und lokale Startanleitung.
- PROZESS.md dokumentiert, wie das Projekt mit Claude Code entstanden ist: Vorgehen, Entscheidungen, Prompts, Probleme und Learnings. Wird nach jeder Story fortgeschrieben.

---

## Ausbaustufe 2 (nach dem MVP)

_Reihenfolge (entschieden nach dem MVP): Story 11, dann 12, dann 13, dann 10._

### 10. Cloud-Sync und Login
- Optionale Speicherung in Supabase mit Login per Magic Link und Row Level Security, damit die Daten geräteübergreifend und sicher verfügbar sind.

### 11. Stellenanzeige per KI importieren
Als Bewerber möchte ich den Link oder den Text einer Stellenanzeige einfügen, damit die Felder automatisch vorausgefüllt werden.
- Ich kann einen öffentlichen Link einfügen; lässt sich die Seite nicht lesen (z. B. Login nötig), sagt die App das verständlich und bietet das Einfügen des Textes als Rückfallweg an.
- KI extrahiert Firma, Rolle, Arbeitsmodell, Workation, Gehalt und Pflichtanforderungen.
- Ich prüfe und korrigiere die Vorschläge vor dem Speichern; nichts wird ungefragt gespeichert.
- Felder, die die Anzeige nicht hergibt, bleiben leer statt geraten.

### 12. Passung einschätzen
Als Bewerber möchte ich eine erste Einschätzung, wie gut eine Stelle zu meinem Profil passt.
- Mein Profil ist einmalig hinterlegt.
- Ausgabe: Passung in Prozent, größte Lücke, ein Satz Begründung.
- Die Einschätzung ist als KI-Vorschlag gekennzeichnet und überschreibbar.

### 13. Stelle vom Handy teilen
Als Bewerber möchte ich eine Stellenanzeige auf dem Handy über „Teilen“ direkt an den Tracker schicken, damit ich Stellen unterwegs in Sekunden erfasse.
- Die App lässt sich auf dem Handy installieren (Progressive Web App) und erscheint danach im Teilen-Menü.
- Ein geteilter Link oder Text startet den Import aus Story 11 mit denselben Regeln (prüfen vor dem Speichern, nichts raten).

---

## Ideen-Speicher (noch nicht eingeplant)

Gesammelt am 16.11.2026 nach einem ruhigen Durchgang durch das Tool. Nichts davon ist beschlossen; eine Idee wird erst durch eine eigene Story mit Akzeptanzkriterien zum Umfang.

**Vom Nutzer**
- Board und Liste zu einer Seite zusammenführen, mit Ansichts-Umschalter.
- Wow-Faktor finden: Was hebt das Tool von Notion-Vorlagen oder Jobstep ab?
- E-Mail-Konto verknüpfen: Antworten von Firmen automatisch erkennen, Mailverlauf an der Bewerbung hinterlegen.
- Tipps zur jeweiligen Bewerbung erzeugen.
- Bewerbung im Tool durchführen: Lebenslauf und Anschreiben auf die Stelle anpassen, als PDF erzeugen, dann zur Originalanzeige springen.
- Stellen vom Handy teilen (bereits als Story 13 eingeplant).
- Alternative Version mit Gamification: Jobsuche als Spiel, mit Belohnungen, Erfahrungspunkten und Leveln, aber professionell und organisiert.
- Wissensbereich mit aktuellen Tipps: Online-Bewerbung, Gespräche, Formulare, Dokumente, Unterschiede nach Land und Branche.
- Bewerbungsgespräch für ein bestimmtes Unternehmen üben.
- Werkzeuge, um die eigenen Skills realistisch einzuschätzen.
- Dokumente je Bewerbung jederzeit abrufbar.
- Master-Dokumente (Lebenslauf, Anschreiben) ansehen und anpassen.
- Konstruktives, professionelles Feedback auf Dokumente und Bewerbungen, angepasst an Markt, Branche und Arbeitgeber.

**Von Claude ergänzt**
- CV-Versionen vergleichen: Welche CV-Version bekommt die meisten Antworten? Die Daten (cv_version, Verlauf) sind schon da.
- Nachfass-Assistent: Wenn eine Bewerbung nach X Tagen ohne Antwort ist, erinnern und einen höflichen Nachfass-Entwurf vorschlagen.
- Gesprächsvorbereitung je Stelle aus Anforderungen und eigenem Profil: wahrscheinliche Fragen, eigene passende Beispiele, Rückfragen an die Firma.
- Arbeitszeugnis-Übersetzer (DACH-typisch): Zeugnisformulierungen in Klartext übersetzen.
- Absagen auswerten: Muster über viele Bewerbungen erkennen (Branche, Rolle, Anforderungslücken), ohne zu verurteilen.
- Wochenrückblick: Was lief diese Woche, was steht an, eine konkrete nächste Aktion.

---

## Qualität
- Oberfläche auf Deutsch und Englisch umschaltbar, responsiv (Desktop und Handy).
- Modernes, professionelles, ruhiges Design mit konsistentem Design-System, Hell- und Dunkelmodus.
- Leere Zustände sind gestaltet (z. B. „Noch keine Bewerbung – leg die erste an").
