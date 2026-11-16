# DESIGN.md – Designkonzept

Verbindliches Regelwerk für die Oberfläche. Jede Story hält sich daran. Neue Werte kommen nur über die Tokens in `app/globals.css`, nie als Einzelwert im Code.

## Inspiration
Angelehnt an den Stil von lucaslima.design: ein ruhiger, editorialer und fast monochromer Look mit warmem Papierton, viel Weißraum, feinen Linien statt Kästen, Pillen-Formen und kleinen Labels in Großbuchstaben. Übernommen werden **Prinzipien und Wirkung**, keine Inhalte, Bilder oder Markenelemente.

**Stimmung:** ruhig · präzise · warm-neutral · editorial · aufgeräumt

## Grundprinzipien
1. **Monochrom zuerst.** Die Oberfläche lebt von Tinte auf Papier. Farbe ist rar und trägt immer eine Bedeutung, zum Beispiel einen Status oder eine Warnung.
2. **Linien statt Kästen.** Abschnitte werden mit Haarlinien (1 px) getrennt, Schatten nur sehr dezent und nur für Ebenen, die über dem Inhalt liegen (Dialog, gezogene Karte).
3. **Pillen für alles Klickbare.** Navigation, Buttons, Filter und Badges haben voll abgerundete Enden.
4. **Typografie macht die Hierarchie.** Große Zahlen und Titel mit engem Zeichenabstand, kleine Labels in Großbuchstaben mit weitem Zeichenabstand. Dafür reichen wenige Schriftgrößen.
5. **Luft.** Lieber mehr Abstand als mehr Rahmen.
6. **Leise Bewegung.** Kurze, weiche Übergänge. Keine verspielten Intro-Animationen, das hier ist ein Arbeitswerkzeug und kein Portfolio.

## Farben (Tokens)
Die Namen folgen den shadcn-Tokens, damit alle Komponenten sie automatisch nutzen.

| Token | Hell | Dunkel | Verwendung |
|---|---|---|---|
| `--background` | `#f4f4f2` | `#121211` | Seitenhintergrund (Papier) |
| `--card` / `--popover` | `#ffffff` | `#1b1b1a` | Karten, Dialoge, Menüs |
| `--foreground` | `#121211` | `#f4f4f2` | Text (Tinte) |
| `--muted-foreground` | `#62615b` | `#999991` | Sekundärtext, Labels |
| `--muted` | `#e9e9e5` | `#272725` | Flächen: Spalten, inaktive Pillen, Hover |
| `--border` / `--input` | `#d6d5cf` | `#393935` | Haarlinien, Eingabefelder |
| `--primary` | `#121211` | `#f4f4f2` | Hauptbutton, aktive Pille |
| `--primary-foreground` | `#f4f4f2` | `#121211` | Text auf Primary |
| `--ring` | `#121211` | `#f4f4f2` | Fokusrahmen (mit Transparenz) |
| `--destructive` | `#b4442f` | `#e0735e` | Fehler, überfällig, Löschen |
| `--success` | `#3f8a52` | `#5fae73` | Positive Signale (Zusage) |

### Statusfarben
Ein Status wird als **farbiger Punkt plus Text** dargestellt, nie als bunte Fläche. Der Text bleibt in Tinte, so bleibt das Board ruhig.

| Status | Punktfarbe | Gedanke |
|---|---|---|
| `discovered` | `#9a9992` | grau: noch nichts passiert |
| `applied` | `#5470c4` | blau: unterwegs |
| `first_interview` | `#7a5bc7` | violett: im Gespräch |
| `further_round` | `#5b3fa8` | dunkleres Violett: tiefer im Prozess |
| `offer` | `#c08a1e` | bernstein: Entscheidung steht an |
| `accepted` | `#3f8a52` | grün: Ziel erreicht |
| `rejected` | `#b4442f` | rot, gedämpft |
| `withdrawn` | `#b8b7b0` | hellgrau: abgeschlossen |

Im Dunkelmodus werden die Punkte etwas aufgehellt, damit der Kontrast zum Hintergrund reicht. Der Punkt hat einen weichen Hof in derselben Farbe bei 18 % Deckkraft (`box-shadow: 0 0 0 3px`).

## Typografie
- **Schrift:** Geist Sans für Texte, Geist Mono für Daten, Zahlen und Zähler. Beide sind schon eingebunden und frei lizenziert. *Alternative:* General Sans (Fontshare, ITF Free Font License) ist noch näher am Vorbild, müsste aber selbst gehostet werden.
- **Zeichenabstand:** Fließtext `-0.006em`, Überschriften `-0.03em`, große Zahlen `-0.04em`, Labels `+0.04em`.

| Rolle | Größe / Zeilenhöhe | Gewicht | Besonderheit |
|---|---|---|---|
| Seitentitel | 32 px / 1.1 (Handy 26 px) | 500 | eng gesetzt |
| Kennzahl (Dashboard) | 48 px / 1 | 400 | eng, tabellarische Ziffern |
| Abschnittstitel | 20 px / 1.2 | 500 | |
| Fließtext | 15 px / 24 px | 400 | |
| Klein / Meta | 13 px / 18 px | 400 | `muted-foreground` |
| Label | 12 px / 16 px | 500 | GROSSBUCHSTABEN, `muted-foreground` |
| Daten & Zahlen | 13 px | 400 | Geist Mono, `tabular-nums` |

## Formen
- **Radius:** Pillen `9999px` (Buttons, Nav, Badges, Filter). Karten `16px`, Eingabefelder `12px`. Basis-Token `--radius: 0.75rem`.
- **Linien:** 1 px `--border`. Tabellenzeilen und Abschnitte sind durch Haarlinien getrennt, ohne Zebra-Streifen.
- **Schatten:**
  - Karte: `0 0 0 1px var(--border)` als Rand, sonst flach.
  - Erhöht (Dialog, gezogene Karte, Menü): `0 0 0 1px #1018280f, 0 24px 60px -16px #1018284d`.

## Abstände und Layout
- Raster aus 4-px-Schritten (Tailwind-Standard).
- Inhaltsbreite max. `1200px`, Seitenrand `16px` auf dem Handy und `32px` ab `md`.
- Abschnitte beginnen mit einem **Label in Großbuchstaben über einer Haarlinie**, nicht mit Kästen.
- Formulare: Label über dem Feld, 6 px Abstand, 16 px zwischen den Feldern.

## Komponenten-Muster
- **Kopfzeile:** fixiert, halbtransparenter Papierton mit Unschärfe nach unten. Navigation als Pillen, die aktive Pille ist gefüllt (Primary), die inaktiven sind `muted` und beim Hover etwas dunkler.
- **Buttons:** Primär als gefüllte Tinten-Pille, Sekundär als `muted`-Pille, Ghost ohne Fläche. Höhe 36 px, auf dem Handy mindestens 40 px Tippfläche.
- **Status-Badge:** Punkt und Text, optional auf einer `muted`-Pille (Board-Karte, Tabelle).
- **Board:** Spalten als `muted`-Flächen mit Radius 16 px. Die Kopfzeile jeder Spalte zeigt ein Label in Großbuchstaben und die Anzahl in Mono. Karten sind weiß mit Haarlinienrand. Eine gezogene Karte bekommt den erhöhten Schatten und ist leicht gekippt (1–2°).
- **Tabelle:** Kopf in Label-Stil, Zeilen mit Haarlinie, Hover hellt die Zeile leicht auf (`muted` bei 50 %).
- **Überfällig:** Datum in `--destructive` mit dem Wort „Überfällig“. Die Karte bekommt einen Rand in `--destructive`. Keine rote Fläche.
- **Leerer Zustand:** zentriert, ein kurzer Satz in großer, leichter Schrift (20 px, `muted-foreground`), darunter eine Primär-Pille.
- **Demo-Banner (Story 7):** schmale Leiste in Tinte mit Papier-Text über der Kopfzeile.

## Bewegung
- Kurve `cubic-bezier(.23, 1, .32, 1)`, Dauer 150–300 ms.
- Hover: Farbwechsel. Bei Links und Pfeilen ein kleiner Versatz (2–4 px).
- `prefers-reduced-motion` schaltet Versatz und Kippen ab.

## Hell und Dunkel
- Standard ist die Systemeinstellung. Den Umschalter bringt Story 8.
- Dunkel ist keine bloße Umkehrung: Der Hintergrund ist warmes Schwarz (`#121211`), Karten sind eine Stufe heller, Linien bleiben dezent.

## Barrierefreiheit
- Kontrast Text zu Hintergrund mindestens 4.5:1. Sekundärtext `#62615b` erreicht auf allen hellen Flächen (Papier, Karte, `muted`) mindestens 5:1.
- Status nie nur über die Farbe zeigen, der Text steht immer dabei.
- Fokus sichtbar: 3 px Ring in `--ring` bei 40 % Deckkraft.
