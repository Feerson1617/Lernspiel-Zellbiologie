# P02b – zweite Nachbesserung von PR #6

**Codex-Selbstprüfung. Keine Merge- oder Unterrichtsfreigabe. Kein P02c.**

- Ausgang: `32cf4fcb1756ea41ab6d99abef725865151d7bd3`, unverändert offener PR [#6](https://github.com/Feerson1617/Lernspiel-Zellbiologie/pull/6).
- Vollständig lokal geprüfter Code: `29d12d14d1ade8cdabdad50c67879234f0138482`.
- Basis `main`: `b155936443745d98c8133788872c9c5ff44d7fb2`.
- Berichtsstand: 2026-10-22T22:07:36+02:00, Europe/Berlin. Ein anschließender Berichtscommit
  ergänzt nur Nachweise/Provenienz; sein endgültiger SHA und die zugehörige CI
  werden im PR-Abschluss nachgewiesen. Kein Selbstverweis auf einen unbekannten Commit.

## Auftrag, Grundlage und Herkunft

Der separat gelieferte Nachbesserungsprompt beschreibt den Codeauftrag. Der
Prüfbericht ist Fremdevidenz für den alten Head; seine Freigabeentscheidung ist
keine von Codex selbst durchgeführte Prüfung. Das Archiv wurde außerhalb des
Checkouts inventarisiert, auf sichere Pfade geprüft und entpackt. Alle 20
beigefügten SHA256-Werte stimmten. Reproduktionsskripte wurden vor Ausführung
gelesen. Archiv, private Originale, fremde Rohprotokolle und Prompts wurden nicht
ins Repository kopiert. Nur die ausdrücklich beauftragten, neu formulierten
156 Prüfsätze werden als bekannte Regression übernommen; keine Klausurinhalte.

Gelesene Grundlagen: `AGENTS.md`, C insbesondere 4/5/9/10, F M6.02,
`spec/tasks.json`, `spec/text-rubrics.json`, Kontext-/Ergebnisverträge und
bestehende Implementierung. Keine fachlichen Sollmengen, Rubriken oder Modellwerte
angepasst. Canonical-JSON-Hash bindet alle gelieferten Felder einschließlich
Sollstatusmengen und Begründungen an die unveränderte Übernahme.

## Umsetzung und Grenzen

`naming-frames.ts` kombiniert Benennungssubjekte, finite Prädikate,
Voranstellungen und verpflichtende Infinitiv-/Partizip-/Nebensatzendungen.
`term-grammar.ts` interpretiert begrenzte bedeutungsneutrale Einschübe nur
innerhalb erkannter Benennungen. Keine biologischen Lösungssätze in den Rahmen,
keine Ganzantwort-Whitelist, keine Schlüsselwortwertung und kein Löschen
unbekannter Reste. Negationen bleiben Tokens; gegensätzliche Fachwörter werden
nicht unscharf zum Zielwort umgedeutet. Gleiche Präfixe behalten alle erlaubten
gebundenen Endungen. Spezifische Metabenennungsrelationen bleiben vorrangig.

`osmosis.ts` besitzt weiterhin sein eigenes Vorgangsprofil. Tonoplast-Fachregeln
und Osmose-Fachregeln bleiben getrennt. Komma + „aber/und“ verbindet nur zwei
vollständig verstandene Prädikate; eine bloße Begriffsliste wird dadurch nicht
zur Entscheidung. Spätere Widersprüche bleiben erhalten, auch nach „Danke!“.

Keine direction-/volume-Bewertung, neuen Modelle, Missionen, UI, Abhängigkeiten
oder Änderungen an Persistenz. M6.02 bleibt ausschließlich process/C01;
`createEvaluatedAttempt` weist sein Teilfeldergebnis weiterhin mit
`IncompleteTaskAssessmentError` zurück. Version, Material, Kontext-Hash,
Originalevidenz und Hilfen bleiben gebunden.

## Eigene Reproduktion und Erkennungsquoten

Vor der Änderung reproduziert: **12/50** kurze gelieferte richtige Antworten
grün, **38 gelb**. Alle 69 gelieferten Schutzprüfungen bestanden schon vorher.
Die 156er-Fälle sind jetzt bekannte Regressionen, keine unabhängigen neuen Fälle
für die Korrektur. Ihre Sollmengen wurden nicht geändert; einige enthalten
ausdrücklich `correct|clarify` beziehungsweise `incorrect|clarify`.

Zusätzlich **60 kurze** und **20 längere** richtige Antworten vor ihrem ersten
Lauf und vor Runtime-Änderungen mit Erwartungen festgelegt. Keine Duplikate
gegen alle bisherigen eigenen, gelieferten und redaktionellen Fälle, auch nach
Normalisierung von Großschreibung/Interpunktion. Der unveränderte Fixture-Hash
ist im Test festgehalten. Vorher: 2/60 kurze und 1/20 längere grün.
Neue Negativ-/Metamorphietests entstanden zusätzlich während der Korrektur;
für diese wird kein vorher ungesehener Erkennungsbestand behauptet.

| Bestand | Fälle | correct | partial | incorrect | clarify |
| --- | ---: | ---: | ---: | ---: | ---: |
| short-correct | 50 | 50 | 0 | 0 | 0 |
| long-correct | 20 | 2 | 0 | 0 | 18 |
| wrong-name | 10 | 0 | 0 | 10 | 0 |
| contradiction | 15 | 0 | 0 | 15 | 0 |
| correct-negation | 10 | 10 | 0 | 0 | 0 |
| unassessed | 10 | 0 | 0 | 0 | 10 |
| partial | 5 | 0 | 5 | 0 | 0 |
| ambiguous | 6 | 0 | 0 | 0 | 6 |
| tonoplast-correct | 15 | 15 | 0 | 0 | 0 |
| tonoplast-wrong | 10 | 0 | 0 | 10 | 0 |
| tonoplast-unassessed | 5 | 0 | 0 | 0 | 5 |
| fresh-short | 60 | 60 | 0 | 0 | 0 |
| fresh-long | 20 | 3 | 0 | 0 | 17 |

- Bekannte kurze Benennungen: **50/50 = 100 %** grün.
- Eigener frischer kurzer Benennungsbestand: **60/60 = 100 %** grün;
  gewähltes Entwicklungsziel 95 % in diesem Selbstprüfbestand erreicht.
- Bekannte längere richtige Erklärungen: **2/20 = 10 %**, 18 gelb.
- Eigene längere richtige Erklärungen: **3/20 = 15 %**, 17 gelb.
- Bekannte richtige Tonoplastantworten: **15/15** grün, vorher 12 grün/3 gelb.

**Alle gelben richtigen Antworten bleiben im jeweiligen Nenner.** Die längeren
Fälle enthalten nicht ausgewertete Richtungs-, Volumen-, Material- oder weitere
Fachbehauptungen; sie erhalten keine pauschale Zustimmung. Das 95-%-Ziel ist für
diesen längeren Bereich nicht erreicht. Kein Auftrag zur Ausweitung auf diese
Fachfelder. Für eine spätere enge Formatlösung bleibt eine getrennte
Ein-Begriff-Benennung mit separat spezifizierten Erklärungsfeldern erforderlich;
eine entsprechende Aufgabenoberfläche wurde hier nicht gebaut.

Keine empirische Schülerquote oder unabhängige Erkennungsprüfung behauptet.
Im final geprüften Bestand kein verbleibendes falsches Grün/Rot beobachtet; die
vier während der Entwicklung gefundenen Fehlgrün-Fälle stehen unten. Dies ist
keine Aussage über sämtliche möglichen Formulierungen.

Vollständige Eingaben, unveränderte Sollmengen und **alle 236 tatsächlichen
Ergebnisobjekte** sowie **20 Feldgrenzfall-Ergebnisse** einschließlich Kriterien,
Rückmeldecode und Originalevidenz:
[p02b-second-results.json](p02b-second-results.json). Automatischer Contenttest
vergleicht jeden Eintrag mit der echten Runtime; keine Auswahl nur grüner Fälle.

## Tatsächlich ausgeführte Prüfung

Auf dem genannten Codecommit vollständig bestanden:

| Prüfung | Bestanden | Fehlgeschlagen | Übersprungen |
| --- | ---: | ---: | ---: |
| Unit | 1624 | 0 | 0 |
| Content/Schema | 177 | 0 | 0 |
| Build einschließlich echter negativer Vite-Imports | 14 | 0 | 0 |
| Browser | 48 | 0 | 0 |
| **Technische Tests gesamt** | **1863** | **0** | **0** |
| Konzeptprüfung, separat | 694 | 0 | 0 |

Keine flaky Browserfälle. TypeScript strict, 79 Aufgabenidentitäten und
19 Missionsdatensätze geprüft. Die 694 Konzeptprüfungen sind redaktionelle
Schema-/Rechen-/Deklarationsprüfungen, keine 694 unabhängigen Fachkorrekturen.
956 tatsächliche Ergebnisobjekte gegen das unveränderte JSON-Schema geprüft:
409 bisherige Osmose-, 291 bisherige Tonoplast- und 256 weitere Ergebnisse.
Die 13 Osmose-/39 Tonoplast-Redaktionsreferenzen bleiben unverändert bestanden.

110 kurze Benennungskonstruktionen wurden jeweils mit vier falschen Begriffen,
einem Teilansatz, drei Alternativen und drei späteren Aussagen geprüft
(1.210 Aufrufe). 85 gemeinsame Konstruktionen mit separaten Tonoplast-Bedeutungen
erzeugen weitere 680 Aufrufe. Keine Behauptung, dass diese Aufrufe alle neu oder
jede generierte Wortkombination vollständig geprüft wären. Zusätzliche Tests
decken Negation, korrigierende Verneinung, Selbstkorrektur, unvollständige
Endungen, unbekannte Einschübe und Komma-Verknüpfungen ab.

Der gelieferte Runner führte **156 Antworten und 69 Schutzprüfungen** auf dem
finalen Code erneut aus: keine Abweichung von Sollmengen und Originalevidenz,
kein fehlgeschlagener Schutz. Diese 69 Aufrufe überschneiden sich mit der
Regression und werden nicht als zusätzliche unabhängige Fälle addiert.
Illustratives Material: Pa, -120000 > -350000 > -810000; keine Simulation.
Alle vier ausdrücklich gelieferten Versionslabels und Materialwerte stehen im
Manifest, keine erfundene Modellversionsnummer.

Browser: tatsächliches Vite-Bundle mit Produktionsimportschutz, beide echten
APIs; 236 Korpusfälle plus 20 Feldgrenzfälle pro Profil, 768 Auswertungen. Vollständige Resultate
stimmen mit Node überein. Originalspannen, Statusfarben/-symbole/-texte als
Runtime-Deskriptoren, Rückmeldungen, Kontextbindung, keine externen Anfragen
oder Browserfehler in diesen Läufen geprüft. Bestehende Browserprüfungen
einschließlich Fortschritts-/Speicherregression und Startseite erneut bestanden.
Keine sichtbare Schüler-Aufgaben-/Feedbackoberfläche oder echte Geräteprobe.

Wesentliche tatsächlich ausgeführte Befehle (vollständige Liste im Manifest):

```sh
npm run check:types
npm run build
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test tests/browser/p02b-second.spec.ts
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run check
node --experimental-transform-types /workspace/attachments/pr6-countercheck/PR6_Gegenpruefung_2026-10-22/run-review.mjs /workspace/Lernspiel-Zellbiologie /workspace/Lernspiel-Zellbiologie/qa/generated/p02b-second-supplied-final.json
git diff --check
```

Letzter Komplettlauf: `qa/generated/p02b-second-final-check.log`.
Lokale Unit-/Content-/Build-/Browser-JSONs und Vorher-/Nachher-Nachweise liegen
ignoriert in `qa/generated/`; ihre SHA256-Werte stehen im Manifest.
Sie sind keine CI-Artefakte mit privaten Quellen.

## Fehlversuche und Korrekturverlauf

| Lokaler Beleg | Bestanden | Fehlgeschlagen | Übersprungen |
| --- | ---: | ---: | ---: |
| `p02b-second-before-tests.json` | 156 | 193 | 0 |
| `p02b-second-first-fix.json` | 1218 | 10 | 0 |
| `p02b-second-second-fix.json` | 1197 | 31 | 0 |
| `p02b-second-third-fix.json` | 1226 | 2 | 0 |
| `p02b-second-targeted.json` | 1231 | 0 | 0 |
| `p02b-second-cross-field.json` | 434 | 0 | 0 |
| `p02b-second-conjunction.json` | 435 | 0 | 0 |
| `p02b-second-field-scope.json` | 1315 | 0 | 0 |
| `p02b-second-field-scope-final.json` | 439 | 1 | 0 |
| `p02b-second-field-scope-verified.json` | 440 | 0 | 0 |

Der erste rote Lauf fixiert die bekannten Lücken vor der Implementierung.
Zwischenstände verloren kurzzeitig vier Tonoplast-Erwartungen durch überdeckende
kurze Präfixe und weitere alte Unsicherheitsrahmen; sie blieben gelb.
Spezifische Metabenennungen und längere Rahmen wurden priorisiert, ohne Sollwerte
zu ändern. Ein TypeScript-Versuch scheiterte an zu tiefer Playwright-
Argumenttypinstanziierung; JSON-Transport der unveränderten Kontexte behebt dies.

Ein vollständiger Zwischenlauf auf `c9ffcd7e76fcdab284f2fcc7cee544cf78d9b57c`
bestand 1.861 technische Tests plus 694 Konzeptprüfungen. Der gelieferte Satz
„Osmose ist passiver Transport, aber Osmose ist aktiver Transport“ blieb im
erlaubten `clarify`, weil das Komma vor „aber“ noch nicht verbunden wurde.
Dieser konkrete bekannte Widerspruch wird nun rot. Der anschließende
Zwischenlauf auf `1c17f62e1a8a93a500e9b23613de1a685f27e0d2` bestand 1.862
technische Tests plus 694 Konzeptprüfungen, enthielt aber noch nicht die danach
entdeckten vier Fehlgrün-Fälle der Feldtrennung.

**P1 / P02b-R2-04, behoben:** „Ich nehme an, dass der Vorgang Tonoplast heißt“,
„Ich nenne als Vorgang Tonoplast“, „Tonoplast, so heißt der Vorgang“ und
„Tonoplast, so würde ich den Vorgang nennen“ wurden fälschlich grün.
Prozessbezogene Benennungssubjekte/-nachträge waren teilweise im gemeinsamen
Rahmenbestand gelandet. Diese Formulierungen gehören jetzt ausschließlich ins
Osmoseprofil. Bei Tonoplast bleiben sie ungeprüft/gelb, statt einen Membrannamen
als Prozess zu bestätigen. 20 zusätzliche feste Tests prüfen beide Feldrichtungen,
falsche Namen und Alternativen in Node, JSON-Schema und echtem Browserbundle.
Diese Fälle entstanden während der Implementierung und sind kein neuer
unabhängiger Erkennungsbestand.

Ein neuer Test enthielt zunächst eine zu breite technische Annahme: auch erkannte
unentschiedene Alternativen sollten `unassessedRelevantText=true` haben.
Deren Bedeutung ist jedoch vollständig geparst und mehrdeutig; nur fremde
Feldreferenzen sind ungeprüft. Die Flag-Prüfung wurde auf diese beschränkt, ohne
fachliche Sollstatus zu ändern. Nach der Feldkorrektur wurde die komplette
Regression nochmals auf dem oben genannten finalen Code ausgeführt.

## Umgebung und Veröffentlichungsschutz

Linux x86_64; Node 24.19.0, npm 11.9.0, Python 3.12.14,
**jsonschema 4.26.0 wie in requirements-spec.txt**, Chromium 154.0.8037.57.
Der fremde Bericht verwendete macOS/Node 24.21.0/npm 11.19.0, Python 3.9.6/
jsonschema 4.25.1 und Chromium 156. Die damalige Paketquellenabweichung wurde hier
nicht übernommen; alle lokalen Prüfungen laufen mit der dokumentierten Version.

21 geschützte Quelldateien, Aufgaben/Rubriken/Referenzen/Modellwerte, Workflow,
package.json und Lockfile unverändert. Exakte Allowlist: zehn zusätzliche
Entwicklungs-/Prüfpfade, keine Erweiterung des Runtime-Bereichs. Historische
Git-Pfade werden ebenso geprüft wie Arbeitsbaum und Symlinks. Sieben echte
negative Vite-Import-Builds scheitern am Produktionsschutz, darunter beide neuen
Fixturedateien, QA-Bericht und Regelvorschlag, auch per `?raw`.

Vier Dist-Dateien SHA256-/bytegleich zum bisherigen Head; drei gültige lokale
Assetverweise unter `/Lernspiel-Zellbiologie/`. Kein Korrektor, Antwort-/Testbestand
oder redaktioneller Schlüssel im öffentlichen Startbundle, keine Quellenkarten.
Private Originale/Erwartungshorizonte standen nicht zur Verfügung und wurden
nicht geöffnet oder ergänzt. Die fremde Behauptung eines 75-Dateien-Vergleichs
wird nicht als eigene Prüfung ausgegeben; ein neuer semantischer/privater
Dateihashvergleich war mangels Originalen nicht möglich.

## GitHub-Schutzbefund – gesondert offen

Tatsächlich erneut gelesen: `branches/main` meldet `protected=false`,
`enforcement_level=off`, leere Pflichtchecks; `/rulesets` liefert `[]`.
Der gelesene Check heißt `build`, App `github-actions`, Integration-ID 15368.
**CI wird derzeit nicht als Merge-Gate erzwungen.**

Konkreter, nicht aktivierter Vorschlag:
[main-ruleset-proposal.json](../review/main-ruleset-proposal.json), erläutert in
[review/README.md](../review/README.md). PR-Pflicht, eine Zustimmung einschließlich
letztem Push, veraltete Zustimmungen verwerfen, offene Threads erledigen,
aktueller Branch mit erfolgreichem `build` aus GitHub Actions, keine Bypass-Akteure,
kein Force-Push/Löschen. Keine Konto-/Repositoryeinstellungen geändert.
Aktivierung und tatsächlich wirksame Durchsetzung benötigen separate Administration.

## Rückgabe zur Gegenprüfung

Weitere unabhängige Gegenprüfung auf neuen Fällen nach dieser Korrektur offen.
Die 156 alten Gegenprüffälle sind Regression, die 80 eigenen Fälle Selbstprüfung.
Echter Safari/iPad-, WebKit- und Schülernachweis fehlen. Längere freie
Facherklärungen bleiben in wesentlichen Teilen ungeprüft; kein allgemeiner
Deutsch-/Fachkorrektor. Keine automatische PR-Abnahme, kein Merge, kein P02c
und keine Unterrichtsfreigabe.
