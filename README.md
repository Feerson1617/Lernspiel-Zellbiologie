# Zelllabor 11 – Die Zelle erforschen

P00: technisches Fundament einer statischen Browseranwendung für Jahrgang 11.
**Entwicklungsfassung, noch kein für den Unterricht freigegebenes Lernspiel.**
Die Startseite informiert über den Projektstand. Es gibt noch keine Missionen,
Bewertung, Simulationen, Zellmodelle oder Fortschrittsspeicherung.

## Lokal starten

Voraussetzungen: Node.js **24.19.0** (siehe `.nvmrc`), npm **11.x** und für die
separate Konzeptprüfung Python ≥3.10 mit `requirements-spec.txt`.
Die Pakete sind exakt versioniert; `package-lock.json` wird eingecheckt.

```sh
npm ci
npm run dev
```

Vite bedient die Anwendung unter `/Lernspiel-Zellbiologie/`. Alle Befehle laufen
im Repository-Hauptverzeichnis. Für reine Frontendentwicklung ist Python nicht
erforderlich. Die Anwendung verwendet keine externen Schriftdateien, CDNs,
Tracker, Konten oder APIs. Es werden keine Browserdaten geschrieben.

## Prüfen und bauen

```sh
# Separate Entwicklungsabhängigkeiten der Konzeptprüfung, optional in einer venv:
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements-spec.txt
. .venv/bin/activate

# Browser installieren (einmalig; CI installiert zusätzlich Systempakete):
npx playwright install chromium

npm run check:spec
npm run check:types
npm run test:unit
npm run test:build
npm run test:browser

# Gesamte für P00 erforderliche Kette, ohne doppelte Builds:
npm run check
```

`npm run build` prüft TypeScript, baut mit Vite und prüft anschließend die
Veröffentlichungs- und Quellen-Allowlist. `test:build` führt einen neuen Build
aus und testet das erzeugte Artefakt. `test:browser` baut ebenfalls neu und
startet dann den Produktions-Preview automatisch. `npm run preview` startet
die bereits gebaute Fassung. Es wird ausschließlich `dist/` veröffentlicht.

Bei vorhandenem System-Chromium kann statt eines Downloads beispielsweise
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:browser`
verwendet werden. Drei Chromium-Viewports prüfen Desktop, Tablet und Mobilgerät.
Das ist **kein echter iPad-/Safari-Test**. Ein nicht verfügbarer Browser ist ein
offener Test, kein bestandenes Ergebnis.

`check:spec` führt den **unveränderten** `tools/check_spec.py` mit den
dokumentierten Abhängigkeiten auf einer exakten temporären Kopie der
Konzeptdateien aus. Dadurch durchsucht dessen rekursiver Paketcheck nicht die
installierten Entwicklungsabhängigkeiten; außerdem vermeidet dies den
TypeScript-7-Konflikt TS5112 zwischen dessen expliziter Quelldatei und der
neuen Projekt-`tsconfig.json`. Rückgabecode und Prüfungen bleiben
erhalten. Der Aufruf `python3 tools/check_spec.py` ist weiterhin möglich, kann
im installierten Arbeitsbaum jedoch diese Abhängigkeiten mitprüfen und mit
dem lokalen TypeScript 7 an TS5112 scheitern. Ohne `tsc` lässt der Originalprüfer
den Deklarationstest aus; `check:spec` in der npm-Umgebung führt ihn tatsächlich aus.
Konzeptprüfungen validieren redaktionelle Daten, Schemata und Referenzarithmetik;
sie testen **keinen Runtime-Korrektor und keine biologische Simulation**.

Automatische JSON-Ergebnisse liegen lokal unter `qa/generated/`, Browserbilder
unter `test-results/`. Diese Verzeichnisse sind weder versioniert noch Teil des
Pages-Artefakts. Den tatsächlich ausgeführten P00-Lauf dokumentiert
`qa/p00-review.json`, Grenzen und Befunde stehen in `qa/P00.md`.

Die Scripts `test:models`, `test:content` und `test:review` sind für die
nachfolgenden Phasen vorbereitet. Solange keine passenden Tests existieren,
**beenden sie sich mit Fehler**, statt leere Suiten als bestanden zu melden.
Sie gehören noch nicht zur P00-Prüfkette.

## Architektur und Grenze zu P01

| Bereich | Verantwortung |
| --- | --- |
| `src/domain/` | Künftige Typen, Einheiten und unveränderliche Fachkontexte |
| `src/biology/` | Künftige reine biologische Modelle, ohne DOM/Three.js |
| `src/assessment/` | Künftige Antwortprüfung und fachliche Feedbackdaten |
| `src/content/` | Ausschließlich später freigegebene Runtime-Aufgaben/Rubriken |
| `src/application/` | Start der Oberfläche; später Koordination und Navigation |
| `src/ui/` | Semantische DOM-Startseite, CSS und zugängliche Navigation |
| `src/render3d/` | Vorbereiteter Three.js-Adapter mit leerer Scene-Factory |
| `src/render2d/` | Künftige gleichwertige SVG-Darstellung |
| `src/persistence/` | Künftige versionierte, datensparsame Speicherung |
| `src/assets/` | Eigenes lokales Favicon und Asset-Inventar |
| `tests/` | Konfiguration, Schutzgrenzen, Build und Browserabläufe |
| `spec/` | Unveränderte redaktionelle Arbeitsgrundlagen, keine Runtime-Daten |
| `qa/`, `review/` | Eigene Prüfnachweise bzw. spätere getrennte Gegenprüfung |

In P00 existieren für spätere Fachbereiche bewusst nur Verantwortungsnotizen.
Es wird kein unvollständiger Runtime-Vertrag vorweggenommen. Die Scene-Factory
ist technisch getestet, aber nicht in die Startseite eingebunden: kein
WebGL-Kontext, Renderloop, 3D-Download oder scheinbares Zellmodell.

**P01 ist ein eigener Auftrag:** kontrollierte Schemaüberführung, unveränderte
Aufgaben-IDs, `TaskContext`, Einheiten und Fortschrittsvertrag. P00 implementiert
keine dieser Fachfunktionen und verändert keine Erwartungen oder Modellwerte.
Maßgeblich bleiben `AGENTS.md`, A–F und `spec/`.

## Veröffentlichung und Prüfungsschutz

Der Workflow `.github/workflows/pages.yml` prüft Pull Requests nach `main`.
Nur ein Push auf `main` kann nach bestandener Prüfkette das geprüfte `dist/`
über GitHub Pages veröffentlichen. Im GitHub-Repository muss unter
**Settings → Pages → Build and deployment → Source** die Option **GitHub Actions**
aktiviert sein. Der konfigurierte Basispfad ist `/Lernspiel-Zellbiologie/`.
P00 löst keinen Merge und keine manuelle Produktionsveröffentlichung aus.

`publish.allowlist.json` enthält eine explizite Datei-Allowlist für Git und
enge Muster für das Produktionsartefakt. Neue Dateien benötigen eine bewusste
Ergänzung nach Inhaltsprüfung. `qa/source-manifest.json` dokumentiert die
SHA-256-Werte der geschützten Ausgangsspezifikation. Der Build blockiert
Imports aus `spec/`, Tests oder privaten Ordnern in Runtime-Chunks; Vites
automatisches Kopieren aus `public/` ist deaktiviert. Unbekannte Dateien,
Symlinks, JSON-Redaktionsdaten und Source Maps im Artefakt werden abgewiesen.
Auch die Dateipfade der erreichbaren lokalen Git-Historie werden geprüft.

Private Originalklausuren, Erwartungshorizonte, Lehrerpakete und Quellenarchive
bleiben **außerhalb des öffentlichen Arbeitsbaums**. Sie wurden in P00 nicht
bereitgestellt oder gelesen. Der technische Schutz ersetzt keinen späteren
privaten Fallnäheabgleich. `.gitignore` ist nur eine zusätzliche Sicherung;
bereits veröffentlichte Git-Historie lässt sich damit nicht bereinigen.

Die App benötigt keine Secrets. Three.js, Vite, TypeScript, Vitest und Playwright
sind frei verfügbare Bibliotheken; ihre mitgelieferten Lizenzen bleiben in den
installierten Paketen erhalten. Das Favicon und die abstrakte CSS-Grafik sind
für dieses Projekt erstellt; sie stellen kein biologisches Modell dar.
