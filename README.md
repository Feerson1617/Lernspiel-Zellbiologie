# Zelllabor 11 – Die Zelle erforschen

P00 bis P02b: technisches Fundament, stabile Identitäten, typisierte Metadaten,
unveränderliche Aufgabenkontexte, explizite SI-Einheitenumrechnungen und lokale
Fortschrittsverträge und begrenzte Fachkorrektoren für Z1.02 und M6.02/process.
**Entwicklungsfassung, noch kein für den Unterricht freigegebenes Lernspiel.**
Die Startseite informiert über den Projektstand. Sie enthält keine Missionen,
Antwortbewertung, Simulationen oder Zellmodelle. Korrektor und Fortschrittsadapter
sind separat getestet und noch nicht an die Startseite angebunden.

## Lokal starten

Voraussetzungen: Node.js **24.19.0** (siehe `.nvmrc`), npm **11.x** und für die
Konzept-/Ergebnisschemaprüfung Python ≥3.10 mit `requirements-spec.txt`.
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
npm run check:catalog
npm run test:unit
npm run test:content
npm run test:build
npm run test:browser

# Gesamte für den aktuellen Stand erforderliche Kette, ohne doppelte Builds:
npm run check
```

`npm run build` prüft TypeScript und die unveränderte Metadatenprojektion,
baut mit Vite und prüft anschließend die
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
Der separate P01a-Lauf steht in `qa/p01a-review.json` und `qa/P01a.md`.
P01b dokumentiert seine Regression separat in `qa/p01b-review.json` und `qa/P01b.md`.

Die Scripts `test:models` und `test:review` sind für die
nachfolgenden Phasen vorbereitet. Solange keine passenden Tests existieren,
**beenden sie sich mit Fehler**, statt leere Suiten als bestanden zu melden.
Sie gehören noch nicht zur erforderlichen Prüfkette. `test:content` ist seit
P01a mit echten Identitäts-/Metadatentests gefüllt und Bestandteil von `check`.

## Architektur und Grenze nach P02b

| Bereich | Verantwortung |
| --- | --- |
| `src/domain/` | Stabile IDs, Metadaten, unveränderliche Kontexte, Hash-/Versionsbindung und SI-Mengen |
| `src/biology/` | Künftige reine biologische Modelle, ohne DOM/Three.js |
| `src/assessment/` | Gemeinsamer T1-Kern, getrennte Fachregeln Z1.02 und M6.02/process, gebundene Ergebnisse und geschützte P01c-Übergabe |
| `src/content/` | Ausschließlich erlaubte öffentliche Metadaten; keine Runtime-Aufgaben/Antwortschlüssel |
| `src/application/` | Start der Oberfläche; später Koordination und Navigation |
| `src/ui/` | Semantische DOM-Startseite, CSS und zugängliche Navigation |
| `src/render3d/` | Vorbereiteter Three.js-Adapter mit leerer Scene-Factory |
| `src/render2d/` | Künftige gleichwertige SVG-Darstellung |
| `src/persistence/` | Lokaler Fortschrittsadapter, Sitzungsmodus, gezieltes Zurücksetzen und Metadatenexport |
| `src/assets/` | Eigenes lokales Favicon und Asset-Inventar |
| `tests/` | Konfiguration, Schutzgrenzen, Build und Browserabläufe |
| `spec/` | Unveränderte redaktionelle Arbeitsgrundlagen, keine Runtime-Daten |
| `qa/`, `review/` | Eigene Prüfnachweise bzw. spätere getrennte Gegenprüfung |

Für spätere Fachbereiche existieren weiterhin nur Verantwortungsnotizen.
Die Scene-Factory
ist technisch getestet, aber nicht in die Startseite eingebunden: kein
WebGL-Kontext, Renderloop, 3D-Download oder scheinbares Zellmodell.

**P01a:** Alle 79 Aufgaben sind mit unveränderten IDs, Titeln, Formaten und
Missionsbezügen über `taskRegistry` referenzierbar. Die Runtime enthält keine
Imports aus `spec/`. Details zur Feld-Allowlist und reproduzierbaren Erzeugung
stehen in `src/content/README.md`, Verträge und Versionsgrenzen in
`src/domain/README.md`. Die Startseite lädt den vorbereiteten Katalog noch nicht.

**P01b:** `createTaskContext`, `capturePredictionContext`, `parseTaskContext`,
`createContextBinding` und `isResultForContext` erfassen/prüfen ausschließlich
Aufgabenkontexte. SHA-256 bindet sämtliche ausdrücklich übergebenen Versionen,
Instanz, Seed, Phase, Material und Modellzustand an eine reproduzierbare Identität.
`toSI`/`fromSI` trennen die sechs zentralen SI-Dimensionen; erforderliche Einheiten
werden nicht geraten. APIs, Zahlenkonventionen und Grenzen stehen in
`src/domain/README.md`. Die Startseite lädt diese vorbereiteten Funktionen nicht.

**P01c:** `src/domain/progress.ts` validiert den unveränderten Fortschrittsvertrag,
trennt Status und Hilfe und verhindert aktuelle Erfolgsmarkierungen ohne gültige
Sitzungskontextbindung. `createProgressStore` speichert ausschließlich erlaubte
Metadaten unter `zelllabor11.progress.v1`. Speicherfehler führen zum Sitzungsmodus;
unbekannte/beschädigte Daten und andere Inhaltsfassungen werden bis zum
ausdrücklichen Zurücksetzen erhalten. Details, Export und Grenzen stehen in
`src/persistence/README.md`; der Testbericht in `qa/P01c.md` und `qa/p01c-review.json`.

**P02a:** `createTonoplastEvaluator(versions)` prüft ausschließlich die Benennung
der Vakuolenmembran in Z1.02. Bekannte Begriffe, Satzrahmen, Verneinung und
Identität werden vollständig ausgewertet; unsichere Zusätze verhindern Grün.
Status, Feedback, Präsentationsdaten und Hilfe sind getrennt. Der Adapter
`createEvaluatedAttempt` bindet Ergebnisse ausdrücklich an den aktuellen Kontext,
ohne etwas automatisch zu speichern. API, fachliche Annahmen und Grenzen stehen
in `src/assessment/README.md`; Selbstprüfungen in `qa/P02a.md`/`qa/p02a-review.json`.
Die Nachbesserung nach der extern berichteten Gegenprüfung von PR #5 ist in
`qa/P02a-Nachbesserung.md` und `qa/p02a-revision-review.json` dokumentiert.
`test:content` benötigt seit P02a für die tatsächlichen Ergebnisschematests Python
mit den oben dokumentierten Abhängigkeiten.

**P02b:** `createOsmosisEvaluator(versions)` bewertet nur `M6.02/process` mit
`M6.02.C01`. Zellprofil, Beobachtungsphase, Wasserpotenziale in Pa und
Membranbedingungen müssen ausdrücklich im Material stehen. Keine Ableitung
aus bloßer Konzentration. Der gemeinsame Parser verwendet ein eigenes Profil;
Fachregeln und Feedback bleiben getrennt. Richtungs-/Volumenfelder werden nicht
mitbewertet; der Fortschrittsadapter lehnt das Teilfeldergebnis als unvollständige
Gesamtaufgabe ab. API/Grenzen: `src/assessment/OSMOSIS.md`; Selbstprüfung und
Fehlerregister: `qa/P02b.md` / `qa/p02b-review.json`.

Keine konkreten fachlichen Modellversionen werden vergeben. Weitere Textfelder,
Zahlenkorrektur, Fachmodelle und Lernmissionen bleiben unimplementiert.
P02c wurde nicht begonnen; erneute unabhängige Gegenprüfung/Unterrichtsfreigabe stehen aus.
Maßgeblich bleiben `AGENTS.md`, A–F und `spec/`;
Erwartungen und Modellwerte bleiben unverändert.

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
