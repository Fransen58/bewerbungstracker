# CLAUDE.md – Arbeitsanweisungen für dieses Projekt

## Projekt
Bewerbungs-Tracker, siehe SPEC.md. SPEC.md ist die Quelle der Wahrheit für Umfang und Akzeptanzkriterien.

## Stack
- Next.js (App Router) mit TypeScript; Seiten werden statisch vorgebaut, Server-Code nur als Route Handler (seit Story 11, für den KI-Import)
- Tailwind CSS und shadcn/ui für die Oberfläche
- Speicherung im Browser (`localStorage`) über eine eigene Storage-Schicht, keine Datenbank, kein Login
- KI über die Claude API (`@anthropic-ai/sdk`), nur serverseitig; der Schlüssel liegt in `.env.local` bzw. in den Vercel-Umgebungsvariablen
- Deployment auf Vercel

## Arbeitsweise
- Arbeite immer an genau einer User Story aus SPEC.md.
- Bevor du Code schreibst: Erkläre kurz deinen Plan und warte auf mein OK.
- Baue in kleinen Schritten, die jeweils lauffähig sind.
- Nach jeder Story: Prüfe alle Akzeptanzkriterien einzeln und sag mir, welche erfüllt sind.
- Nach jeder Story: PROZESS.md um einen kurzen Abschnitt ergänzen (Ziel, Vorgehen, Entscheidungen, Probleme, Learnings).
- Erfinde keine Features, die nicht in SPEC.md stehen. Wenn etwas unklar ist, frag.
- Erkläre mir neue Konzepte in ein, zwei Sätzen, ich lerne dabei.

## Konventionen
- Oberflächentexte zweisprachig (Deutsch Standard, Englisch umschaltbar) über zentrale Übersetzungsdateien, nie hart im Code.
- Code und Kommentare auf Englisch.
- Auswahlwerte (Status, Quelle usw.) als feste englische Schlüssel speichern, nur in der Oberfläche übersetzen.
- Gespeicherte Daten tragen eine Schema-Version, damit spätere Änderungen migriert werden können.
- Keine Secrets im Code; falls später nötig, über .env.local.
- Demo-Daten frei erfunden, keine echten Firmen-Ansprechpartner oder persönlichen Daten.
- Nach jeder abgeschlossenen Story ein Git-Commit mit aussagekräftiger Nachricht.

## Allgemeine Coding-Richtlinien
Diese Richtlinien setzen auf Vorsicht statt Tempo. Bei trivialen Aufgaben mit Augenmaß anwenden.

### 1. Erst denken, dann coden
- Annahmen ausdrücklich nennen. Bei Unsicherheit fragen.
- Gibt es mehrere Deutungen, diese vorstellen statt still eine zu wählen.
- Gibt es einen einfacheren Weg, ihn ansprechen und ruhig widersprechen.
- Ist etwas unklar: anhalten, benennen, fragen.

### 2. Einfachheit zuerst
- Minimaler Code, der das Problem löst, nichts auf Vorrat.
- Keine Abstraktionen für einmalig genutzten Code.
- Keine nicht angefragte Flexibilität oder Konfigurierbarkeit.
- Keine Fehlerbehandlung für unmögliche Fälle.
- Prüffrage: Würde ein Senior Engineer das überkompliziert finden? Dann vereinfachen.

### 3. Chirurgische Änderungen
- Nur anfassen, was nötig ist. Angrenzenden Code, Kommentare und Formatierung nicht „verbessern“.
- Nichts refaktorieren, was nicht kaputt ist. Vorhandenen Stil übernehmen.
- Fremden toten Code erwähnen, nicht löschen. Durch eigene Änderungen ungenutzte Imports/Variablen/Funktionen entfernen.
- Jede geänderte Zeile muss sich direkt auf die Aufgabe zurückführen lassen.

### 4. Zielgerichtet arbeiten
- Aufgaben in überprüfbare Ziele übersetzen (z. B. „Bug fixen“ → Test schreiben, der ihn reproduziert, dann grün machen).
- Bei mehrstufigen Aufgaben kurzer Plan im Format: Schritt → Prüfung.
