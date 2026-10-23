# P02b – fünfte Nachbesserung / R3

**Selbstprüfung; kein Merge, kein P02c und keine Unterrichtsfreigabe.**

Geprüfte Code-/Testfassung: `c00412198235919ad146e9f285a09af8670bd780`. Ausgang `3174574a714461627e7f831d94b70f682afab636`;
[PR #6](https://github.com/Feerson1617/Lernspiel-Zellbiologie/pull/6) gegen main
`b155936443745d98c8133788872c9c5ff44d7fb2`. Der anschließende Abgabecommit ergänzt
Berichte/Provenienz, Dokumentationsverweise und das unten begründete Zeitbudget
eines älteren Schemabatches. Finaler Head und sein CI-Status
stehen in der PR-Beschreibung. Berichtszeit 2026-10-23T10:25:19+02:00, Europe/Berlin.

## Änderung und Grenzen

`naming-choice.ts` trennt aktive Namenswahl und Originalevidenz. Ausschließlich
positive Benennungen derselben Begriffs-ID gehören zu einer wiederholten Wahl.
Eine ausdrückliche einmalige Korrektur nimmt **alle** Wiederholungen dieser Wahl
zurück. Die ursprünglichen Klauseln bleiben als Evidenz erhalten. Wissenschaftliche
Prädikate, echte Ausschlüsse und konkurrierende Alternativen werden nicht zurückgenommen.
Es gibt keine pauschale letzte-Satz-Dominanz. Eine weitere tatsächliche Namensänderung
bleibt außerhalb des unterstützten T1-Umfangs `clarify`; Wiederholung/Bestätigung
ist keine weitere Änderung. Beide Fachadapter reichen die getrennten Originalspannen
weiter; ihre biologischen Bewertungsregeln wurden nicht geändert. Evidenz ist
Quellbeleg und keine eigenständige Richtigkeitsmarkierung jeder zurückgenommenen Aussage.

Der minimale gelieferte Reproducer wurde zuerst gegen eine isoliert aus Git
archivierte Originalfassung und danach gegen die korrigierten echten APIs ausgeführt.
Zwei der vier Originaleingaben waren rot; danach alle vier grün. Alle zwölf neuen
Wiederholungs-/Bestätigungs-/Korrekturdiagnosen und SYS-173 sind jetzt grün. Alle
sechs echten Fehler und beide Mehrdeutigkeitskontrollen behalten ihren Sollstatus.
Alle 34 alten Diagnosen und zwölf früheren Bestätigungen bleiben unverändert gültig.

Die Benennungssyntax erweitert endliche Konstituenten/Verbvalenzen: deiktische
Fragebezüge („das Ganze“), Modal-/Perfektformen mit zwingendem Schlussverb,
Wort-/Antwortetiketten und explizite Fragebezüge, Voran-/Nachstellung. Keine
vollständige Antwortsatz-Whitelist oder Schlüsselwortbewertung. Bekannte
Verneinungen bleiben gebunden; gleichbedeutende wiederholte negative Alternativen
werden als solche erhalten. Gemischte Negations-/Begriffsalternativen bleiben
ungeklärt. Keine freien Erklärungs-, Richtungs- oder Volumenauswertungen.

## Grundlagen, Daten und Provenienz

AGENTS, C 1–5/9–11, D, F M6.02 sowie die Aufgaben-/Rubrik-/Kontext-/Ergebnis-
und Fortschrittsverträge sind maßgeblich. Der gelieferte Prompt ist die Aufgabenbeschreibung;
der Bericht beschreibt Fremdbefunde, keine eigene Prüfung. Paket außerhalb des
Repositories pfad-/symlinksicher entpackt; 57 SHA256-Einträge bestätigt. Nur die
verlangten, neu verfassten Prüfsätze als Fixtures übernommen. Keine ZIP-/Original-
prüfungsquellen oder fremden Vollprotokolle in Git/dist. Private Originale waren
für einen eigenen Vergleich nicht verfügbar. Fremde Datenschutz-/OpenStax-Prüfungen
wurden nicht als eigene Abrufe/Scans behauptet.

183 Hauptfälle, 240 systematische Datensätze und 20 gezielte Diagnosen behalten
Originaltexte, IDs, Roh-Sollwerte und ggf. `basis`. Vier Überschneidungen zwischen
Haupt-/Systematikbestand bleiben enthalten und werden nicht als zusätzliche neue
Fälle gezählt: 236 zusätzliche systematische Kombinationen. Alle 578 bekannten
Originaldatensätze behalten auch ihre `previous…`-Identitäten und werden gegen die
vorhandenen ursprünglichen Arrays geprüft. Hashbindung der drei neuen Arrays und
des vor dem ersten Lauf festgelegten eigenen Bestands stehen im Unit-Test.
Nach Reparatur sind diese Sammlungen bekannte Regression, keine neue unabhängige Quote.

Eigener Bestand: 60 neue kurze richtige Benennungen, ohne Treffer nach NFC,
Kleinschreibung und Satzzeichenbereinigung gegen 8490 bekannte Strings einschließlich
des neuen Hauptbestands. Vor dem ersten Runtime-Lauf wurden zusätzlich 420 Varianten
fixiert: 180 falsche Namen, je 60 Teilansätze, Alternativen, fachliche Verneinungen
und relevante unbewertete Zusätze. Keine Sollwertkorrektur nach Laufbefund.

Finale technische Testlabels aus dem gelieferten Runner: `review4-task-20261023`,
`review4-rubric-20261023`, `concept-1.0-20261023`, `review-no-simulation`.
Instanz `independent-review4-PR6`, Seed `fixed-independent-review`, Phase `explain`,
Modellzustand {}. Die erste Arbeitsbaumprobe nutzte noch die früheren review3-Labels;
der vollständige isolierte Originalvergleich wurde anschließend mit exakt den
finalen vier Labels und demselben Kontext wiederholt: gleicher Befund 8/60 bzw. 18/60.
Intakte onion_epidermis, frühe Wasserverlustphase, Pa: Vakuole −120000 > Cytosol
−350000 > Außenraum −810000; beide Membranen wasserpermeabel, Saccharose weitgehend
zurückgehalten, andere Transporte ausgeschlossen. Keine Konzentrationsableitung,
keine erfundene Modell-/Simulationsversion. 69 unterschiedliche Schutzprüfungen
selbst ausgeführt, alle bestanden; Wiederholungen werden nicht addiert.

## Tatsächliche Statusverteilungen

Kurze gelieferte richtige Benennungen **60/60 grün**, Ausgang **8/60** auf genau
diesem Bestand. Eigene neue kurze Antworten **60/60 grün**, Ausgang **18/60**.
Das gewählte Ziel >=95 % ist in der Selbstprüfung erreicht; keine empirische
Schülerquote oder unabhängige Abnahme. Frühere 23/60 aus einem anderen Korpus
werden nicht als Vorher-/Nachhervergleich verwendet.

Neue längere richtige Antworten **0/15 grün, 15 gelb**. Alle Nenner bleiben
vollständig. Die bekannten längeren Gruppen bleiben getrennt in der folgenden
Tabelle sichtbar, einschließlich 0/20 und 0/12 sowie 2/20. Ältere eigene Lang-
antworten sind weiter Teil der vollständigen Regression, keine entfernten Fälle.

**22 neue Abweichungen vom unveränderten Roh-Soll:** 15 längere richtige Antworten
bleiben ungeklärt; sieben wissenschaftliche Erklärungs-/Richtungs-/Volumenaussagen
(`wrong-name-13/14/15/17/18/19/20`) bleiben mangels implementierter Fachlogik
`clarify` statt Roh-Soll `incorrect`. Kein Grün für diese Aussagen und keine
behauptete Fehlerdiagnose. Die gesonderten akzeptierten Mengen sind reine
Scope-Ausweisung, keine umgeschriebenen Fach-Sollwerte. 13/20 falsche Hauptantworten
werden rot erkannt, sieben gelb. Die ursprünglich verlangte Rotdiagnose dieser
sieben ist weiterhin nicht umgesetzt. Für alle kurzen Benennungen/Systematik-
und Diagnosefälle gelten die ursprünglichen Sollmengen ohne zusätzliche Ausnahmen.

**41 bekannte Roh-Soll-Abweichungen** bleiben separat: 32 längere richtige Antworten
gelb, sieben bekannte Bezugsunsicherheiten gelb, zwei früher fachlich begründet
nachbeurteilte Tonoplast-Klassifikationen rot statt altem Soll-gelb. Diese früheren
Nachbeurteilungen werden nur über die zugehörige Identität übernommen. Insgesamt
63 sichtbare Roh-Soll-Abweichungen; kein pauschales „1501 Original-Sollwerte bestanden“.

| Neuer Bestand / eigene Gruppe | Gesamt | correct | partial | incorrect | clarify |
|---|---:|---:|---:|---:|---:|
| short-correct | 60 | 60 | 0 | 0 | 0 |
| long-correct | 15 | 0 | 0 | 0 | 15 |
| wrong-name | 20 | 0 | 0 | 13 | 7 |
| partial | 12 | 0 | 12 | 0 | 0 |
| ambiguous | 12 | 0 | 0 | 0 | 12 |
| negation-correction | 20 | 8 | 0 | 8 | 4 |
| relevant-extra | 20 | 0 | 0 | 0 | 20 |
| tonoplast-correct | 10 | 10 | 0 | 0 | 0 |
| tonoplast-wrong | 6 | 0 | 0 | 6 | 0 |
| tonoplast-partial | 4 | 0 | 4 | 0 | 0 |
| tonoplast-ambiguous | 4 | 0 | 0 | 0 | 4 |
| sys-reaffirm | 40 | 40 | 0 | 0 | 0 |
| sys-contradiction | 25 | 0 | 0 | 25 | 0 |
| sys-extra | 25 | 0 | 0 | 0 | 25 |
| sys-correction | 25 | 25 | 0 | 0 | 0 |
| sys-alternative | 25 | 0 | 0 | 0 | 25 |
| sys-negated-name | 25 | 0 | 0 | 25 | 0 |
| sys-property | 25 | 25 | 0 | 0 | 0 |
| sys-synonym | 10 | 10 | 0 | 0 | 0 |
| sys-scope-contradiction | 10 | 0 | 0 | 10 | 0 |
| sys-scope-double | 10 | 0 | 0 | 0 | 10 |
| sys-scope-designation | 10 | 0 | 0 | 0 | 10 |
| sys-scope-alternative | 10 | 0 | 0 | 0 | 10 |
| repeated-wrong-then-correct | 6 | 6 | 0 | 0 | 0 |
| reaffirmed-wrong-then-correct | 6 | 6 | 0 | 0 | 0 |
| preserve-scientific-error | 4 | 0 | 0 | 4 | 0 |
| preserve-exclusion | 2 | 0 | 0 | 2 | 0 |
| preserve-unresolved | 2 | 0 | 0 | 0 | 2 |
| fresh-short | 60 | 60 | 0 | 0 | 0 |
| fresh-wrong | 180 | 0 | 0 | 180 | 0 |
| fresh-partial | 60 | 0 | 60 | 0 | 0 |
| fresh-alternative | 60 | 0 | 0 | 0 | 60 |
| fresh-negation | 60 | 0 | 0 | 60 | 0 |
| fresh-unknown | 60 | 0 | 0 | 0 | 60 |

| Bekannte Gruppe | Gesamt | correct | partial | incorrect | clarify |
|---|---:|---:|---:|---:|---:|
| previous0-known0-short-correct | 50 | 50 | 0 | 0 | 0 |
| previous0-known0-long-correct | 20 | 2 | 0 | 0 | 18 |
| previous0-known0-wrong-name | 10 | 0 | 0 | 10 | 0 |
| previous0-known0-contradiction | 15 | 0 | 0 | 15 | 0 |
| previous0-known0-correct-negation | 10 | 10 | 0 | 0 | 0 |
| previous0-known0-unassessed | 10 | 0 | 0 | 0 | 10 |
| previous0-known0-partial | 5 | 0 | 5 | 0 | 0 |
| previous0-known0-ambiguous | 6 | 0 | 0 | 0 | 6 |
| previous0-known0-tonoplast-correct | 15 | 15 | 0 | 0 | 0 |
| previous0-known0-tonoplast-wrong | 10 | 0 | 0 | 10 | 0 |
| previous0-known0-tonoplast-unassessed | 5 | 0 | 0 | 0 | 5 |
| previous0-known1-short-correct | 60 | 60 | 0 | 0 | 0 |
| previous0-known1-long-correct | 20 | 0 | 0 | 0 | 20 |
| previous0-known1-wrong-name | 12 | 0 | 0 | 12 | 0 |
| previous0-known1-partial | 8 | 0 | 8 | 0 | 0 |
| previous0-known1-ambiguous | 12 | 0 | 0 | 0 | 12 |
| previous0-known1-contradiction | 12 | 0 | 0 | 12 | 0 |
| previous0-known1-unsafe-extra | 12 | 0 | 0 | 0 | 12 |
| previous0-known1-correct-distinction | 8 | 8 | 0 | 0 | 0 |
| previous0-known1-semantic-trap | 8 | 0 | 0 | 0 | 8 |
| previous0-known1-tonoplast-correct | 12 | 12 | 0 | 0 | 0 |
| previous0-known1-tonoplast-wrong | 8 | 0 | 0 | 8 | 0 |
| previous0-known1-tonoplast-boundary | 8 | 0 | 0 | 0 | 8 |
| previous0-known2-not-generic-name | 4 | 0 | 0 | 0 | 4 |
| previous0-known2-generic-name | 4 | 0 | 0 | 0 | 4 |
| previous0-known2-explicit-negation | 4 | 0 | 0 | 4 | 0 |
| previous0-known2-evidence | 4 | 4 | 0 | 0 | 0 |
| previous0-known2-unassessed-unicode | 4 | 0 | 0 | 0 | 4 |
| previous0-known2-tonoplast-property | 4 | 0 | 0 | 2 | 2 |
| previous0-known3-explicit-name-not-alias | 3 | 0 | 0 | 0 | 3 |
| previous0-known3-explicit-name-alias | 2 | 0 | 0 | 0 | 2 |
| previous0-known3-explicit-name-equivalence | 1 | 0 | 0 | 0 | 1 |
| previous0-known3-membrane-no-synonym | 1 | 0 | 0 | 0 | 1 |
| previous0-known3-membrane-not-membrane | 1 | 0 | 0 | 1 | 0 |
| previous1-short-correct | 60 | 60 | 0 | 0 | 0 |
| previous1-long-correct | 12 | 0 | 0 | 0 | 12 |
| previous1-wrong-name | 12 | 0 | 0 | 12 | 0 |
| previous1-partial | 8 | 0 | 8 | 0 | 0 |
| previous1-ambiguous | 12 | 0 | 0 | 0 | 12 |
| previous1-contradiction | 12 | 0 | 0 | 12 | 0 |
| previous1-unsafe-extra | 12 | 0 | 0 | 0 | 12 |
| previous1-correct-distinction | 8 | 8 | 0 | 0 | 0 |
| previous1-semantic-boundary | 16 | 0 | 0 | 0 | 16 |
| previous1-tonoplast-correct | 12 | 12 | 0 | 0 | 0 |
| previous1-tonoplast-wrong | 6 | 0 | 0 | 6 | 0 |
| previous1-tonoplast-boundary | 6 | 0 | 0 | 0 | 6 |
| previous2-reaffirm-osmosis | 6 | 6 | 0 | 0 | 0 |
| previous2-reaffirm-tonoplast | 6 | 6 | 0 | 0 | 0 |
| previous2-genuine-correction-osmosis | 4 | 4 | 0 | 0 | 0 |
| previous2-genuine-correction-tonoplast | 4 | 4 | 0 | 0 | 0 |
| previous2-property-and-reaffirmation | 2 | 2 | 0 | 0 | 0 |
| previous2-property-and-reaffirmation-tonoplast | 2 | 2 | 0 | 0 | 0 |
| previous2-correction-contradiction | 2 | 0 | 0 | 2 | 0 |
| previous2-correction-contradiction-tonoplast | 2 | 0 | 0 | 2 | 0 |
| previous2-unresolved-correction | 3 | 0 | 0 | 0 | 3 |
| previous2-unresolved-correction-tonoplast | 3 | 0 | 0 | 0 | 3 |

## Ausgeführte Technik- und Browserprüfungen

Vollständiges `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run check`
am genannten Codecommit: Exit 0. Node 24.19.0, npm 11.9.0, Python 3.12.14,
jsonschema 4.26.0, Chromium 154.0.8037.57. Lockfile/Abhängigkeiten unverändert.

| Prüfung | Bestanden | Fehlgeschlagen | Übersprungen |
|---|---:|---:|---:|
| Unit | 4988 | 0 | 0 |
| Inhalt/Schema | 189 | 0 | 0 |
| Build | 21 | 0 | 0 |
| Chromium Desktop/Tablet/Mobile | 60 | 0 | 0 |
| Technisch lokal gesamt | 5258 | 0 | 0 |
| Konzeptprüfung, separat | 694 | 0 | 0 |

TypeScript strict, 79 Aufgabenidentitäten/19 Missionsbezüge, Produktionsbuild,
Publikationsschutz und alle bisherigen implementierten Regressionen bestanden.
1501 aktuelle Resultate zusätzlich mit unverändertem Schema geprüft; zusammen
mit früheren Schema-Beständen 4087 tatsächliche Ergebnisobjekte. Die 694 Konzept-
prüfungen sind redaktionell/deklarativ und keine 694 unabhängigen Fachbewertungen.
Alle 69 Guardprüfungen behalten Material, vier Versionen, Hash-/Seed-/Instanzbindung,
Hilfe, C01-Fortschrittssperre, Feldtrennung und technische Eingabegrenzen.

Entwicklungsmisserfolge bleiben dokumentiert: Der erste neue Helper-Generator
enthielt einen JavaScript-Methodentippfehler und wurde vor Ausführung der Fälle
korrigiert. Im ersten Sprachrahmenausbau wurde das Negationsflag des neuen
„hat nicht den Namen“-Präfixes noch nicht übertragen; die Probe ergab falsches
Grün, wurde vor dem Codecommit korrigiert und durch die vollständige Negations-
/Systematikregression abgesichert. Ein gemischt systematischer wiederholter
Ausschluss blieb zunächst gelb; gleichbedeutende negative Alternativen sind jetzt
explizit modelliert. TypeScript meldete im neuen Test zwei unbenutzte Imports und
einen nicht eingeengten Evidenzzugriff; korrigiert. Die erste Inhaltssammelprüfung
bestand 188 Fälle, ein neuer Test lief ins 5-Sekunden-Limit. Nur dieser Test hat
jetzt 30 Sekunden für 1501 Runtimeauswertungen plus den auf 20 Sekunden begrenzten
Schema-Unterprozess. Browserparität hat 90 Sekunden für die neue vollständige
Sammlung; der erste Lauf benötigte 28–42 Sekunden pro Profil. Kein Fall wurde
übersprungen, kein fachlicher Sollwert oder Bestehensmaßstab gelockert.

Die nachträgliche Inhaltsprüfung nach Erstellung der Berichte hatte 188 bestandene
Prüfungen und eine weitere Zeitüberschreitung: der bestehende 968-Ergebnis-Schemabatch
überschritt unter paralleler Ausführung fünf Sekunden. Der bereits erfolgreiche
vollständige Lauf und CI-Build am Codecommit werden dadurch nicht rückwirkend
ungültig; der zusätzliche Lauf wird ausdrücklich nicht als bestanden ausgegeben.
Auch dieser Batch erhält nun 30 Sekunden für seine vollständigen Auswertungen und
den bereits bestehenden, auf 20 Sekunden begrenzten Schema-Unterprozess. Danach
bestehen alle 189 Inhaltsprüfungen erneut. Keine Runtime-, Fall-, Sollwert- oder
Fachlogikänderung; der finale CI-Lauf prüft auch diese Testkonfiguration.

[CI-Lauf 39924012946](https://github.com/Feerson1617/Lernspiel-Zellbiologie/actions/runs/39924012946)
auf `c00412198235919ad146e9f285a09af8670bd780`: build success, webkit failure, deploy skipped;
Gesamtlauf **failure**. Job-/Schrittergebnisse und die vollständigen
kompakten WebKit-Check-Annotations selbst gelesen; kein Lesen unzugänglicher
Vollprotokolle behauptet. Die endgültige Dokumentationsfassung hat einen eigenen
Lauf, dessen tatsächlicher Status in der PR-Beschreibung steht.

WebKit **57/60 bestanden, drei Standard-Tab-Fokusfehler**, 0 skipped/flaky:
45/48 unveränderte Standardtests, 12/12 Zusatzprüfungen. Desktop/Tablet/Mobile,
macOS arm64, WebKit 27.2: Tab → BODY, Option-/Alt-Tab → Sprunglink; fokussierte
Aktivierung besteht. Kein Überspringen/Umdeuten der drei Fehler, kein grünes
Gesamt-Gate, kein behaupteter Produktursachenbefund. Echter Safari/iPad fehlt.

Neue Browserparität: **1501 ×3 Profile ×2 Engines = 9006** tatsächliche Auswertungen.
Vollständige Node-Parität, UTF-16-Spannen, Kontext, Rückmeldung und Statusdeskriptoren
geprüft; keine externen Anfragen, Browserfehler, Markupausführung oder Antwort-
persistenz; fremder Storage erhalten. Original-Produktionsimportschutz im Vite-
Testbundle aktiv, `write:false`. Keine sichtbare fachliche Aufgaben-/Feedback-
oberfläche vorhanden und keine Schülerinteraktion mit ihr behauptet. Aktuelle
Produktionsstartseite in Desktop-/Mobilansicht visuell geprüft.

## Schutz und offene Entscheidungen

21 geschützte Dateien unverändert. Vier Dist-Dateien byte-/SHA256-identisch zum
Ausgang, drei lokale Assets unter `/Lernspiel-Zellbiologie/`. Keine neuen
Laufzeitanfragen, Paket-/Lockfileänderungen, Lösungsschlüssel oder Prüfungsquellen
im Startbundle. 14 echte negative Vite-Importbuilds blockieren Redaktions-, Test-
und QA-Daten einschließlich beider neuer Fixtures/`?raw`. Der Codecommit prüfte
172 freigegebene Arbeitsbaum-/historische Pfade; die zwei finalen Berichte sind
gezielt auf der Allowlist und werden vor und nach Commit ebenfalls geprüft (174).
Private Originalvergleiche wurden mangels Zugriff nicht selbst ausgeführt;
der fremde Hash-/Textfensterscan wird nicht als eigene Kontrolle ausgegeben.

`main` erneut `protected=false`; vorhandener, nicht aktivierter Vorschlag verlangt
nur `build`. WebKit läuft nur für PRs, main-Deployment hängt nur an build. Gesonderte
Administrationsentscheidung: Pflichtchecks/Review, Force-Push-/Löschschutz und
Deployment-Gate festlegen. Keine Einstellungen geändert, kein Merge/Deployment.

Als konkrete, noch nicht umgesetzte Alternative für eine spätere Fachentscheidung:
`naming-input/0.1-draft` könnte genau ein `termText`-Feld und eine gesonderte
explizite Korrekturhandlung mit Bezug auf einen vorigen Versuch vorsehen. Nur eine
isolierte Benennung wird fachlich ausgewertet; zusätzliche Sätze bleiben sichtbar
und führen zur Klärung. Bereits gespeicherte Versuche würden nicht umgeschrieben.
Dies ist eine begründete Entscheidungsvorlage bei erneut unzureichender frischer
Sprachquote, keine geänderte Aufgaben-/Rubrik-/Modellversion und keine implementierte
UI oder API. Die Originalaufgaben bleiben bis zur fachlichen Prüfung unverändert.

Frische unabhängige Gegenprüfung auf wiederum neuen Fällen, echte benannte Safari-/
iPad-Probe, Firefox/Lerngruppenpilot und private semantische Fallnäheprüfung bleiben
ausstehend. Keine P02c-, Missions-, UI-, Simulations- oder freie Erklärungskorrektur.
Keine eigenmächtige Abnahme oder Unterrichtsfreigabe.

Vollständige eigene Rohresultate/Statusverteilungen: `qa/p02b-r3-results.json`.
Manifest mit Befehlen, Quellen-/Versionsbindung und Beleg-Hashes: `qa/p02b-r3-review.json`.
Lokale vollständige JSON/Logs/Screenshots bleiben in ignorierten `qa/generated/`
und `test-results/`, keine zusätzlichen CI-Uploads. Frühere Berichte sind historische
Messungen ihrer jeweiligen Commits; aktuelle 578er-Regression steht separat hier.
