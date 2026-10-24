# P02b – vierte Nachbesserung / R2, 23.10.2026

Historischer Bericht. Die folgende R3-Prüfung fand zurückgenommene Wiederholungen
als weitere Fehlerfamilie; aktuelle Korrektur und Messung stehen in
[P02b-Fuenfte-Nachbesserung.md](P02b-Fuenfte-Nachbesserung.md).

**Selbstprüfung. Kein Merge, kein P02c, keine Unterrichtsfreigabe.**

Anwendungs-/Testfassung: `435843b1a44282199bd8eda01523eb3e7cbadf65`. Ausgang: `7393548c885cfe467b284808f873c90c43997fb8`.
[PR #6](https://github.com/Feerson1617/Lernspiel-Zellbiologie/pull/6) gegen `main`
(`b155936443745d98c8133788872c9c5ff44d7fb2`). Ein folgender Abgabecommit ergänzt
Berichte/Provenienz und Dokumentationsverweise, keine Runtime-/Testlogik.
Endgültiger Head und dessen CI-Lauf stehen in der PR-Beschreibung.
Berichtszeit: 2026-10-23T09:30:20+02:00, Europe/Berlin.

## Befund und Änderung

Die zwölf gelieferten bestätigenden Wiederholungen wurden auf dem Ausgangsstand
selbst falsch rot reproduziert. Ursache: Zwei positive Einzelbenennungen wurden
auch bei gleicher Begriffs-ID zu `contrast` umgeschrieben. `term-grammar.ts`
erhält jetzt bei gleichem Begriff zwei positive `name`-Aussagen einschließlich
beider Originalspannen; Synonyme und geprüfte Schreibweisen teilen dieselbe ID.
Nur eine ausdrücklich korrigierende **andere** Einzelbenennung wird zum Kontrast.
Die Gleichheitsprüfung in echten Kontrasten bleibt unverändert: „Nicht Osmose,
sondern Osmose“ ist weiterhin widersprüchlich. Fachliche Gegenbehauptungen,
konkurrierende Alternativen und unbekannte Reste werden nicht zurückgenommen.
Alle 34 gezielten Diagnosefälle bestehen, darunter alle zwölf Bestätigungen.

Eine zusätzliche eigene Abschlussprobe auf `9478d56` fand einen weiteren Randfall:
„Endocytose. Es ist in Wirklichkeit Exocytose. Es ist in Wirklichkeit Osmose.“
wurde wegen der bereits zurückgenommenen Zwischenbenennung falsch rot;
analog „Zellwand … Zellmembran … Tonoplast“. Dieser Befund wurde vor Abschluss
korrigiert und nicht als bestandener Zwischenstand ausgegeben. T1 unterstützt
hier eine geänderte Einzelbenennung; ein weiterer Wechsel oder eine Änderung
einer Kontrastauswahl führt ausdrücklich zu `clarify` mit vollständiger
Originalevidenz. Bestätigung der bereits gewählten Benennung bleibt gültig;
echte widersprüchliche Ausschlüsse bleiben rot. Keine pauschale spätere
Satzdominanz. Zwölf weitere quellgeleitete Diagnosefälle (acht `clarify`, zwei
`correct`, zwei `incorrect`) sind separat mit allen Rohresultaten enthalten und
im Browser sowie gegen das Ergebnisschema ausgeführt; keine neue Sprachquote.

`naming-syntax.ts` ergänzt begrenzte Verb-/Nominalgruppenkomposition: vor- und
nachgestelltes „als Bezeichnung“, Antwortverben, Modalverben mit zwingendem
Schlussverb, Teilfragenbezug, Wortetiketten, Relativsätze zur eigenen Wortwahl
und Referenzen mit begrenzter Verschachtelung. Feldobjekte bleiben an das jeweilige
Prozess-/Membranprofil gebunden. Keine Antwortsatz-Whitelist, Schlüsselwortwertung,
allgemeine Textlöschung oder Änderung der Fachkriterien. Bekannte wissenschaftliche
Qualifikatoren, Verneinungen und relevante Reste verschwinden nicht als Beiwerk.
Eine ausdrückliche Wiederbenennung eines biologisch benannten Subjekts erhält
beide Begriffe als Gleichsetzungsrelation; eine generische Membraneigenschaft
wird daraus nicht abgeleitet. Die früher behobenen Namensgleichsetzungsfehler
bleiben in der Regression ungeklärt statt falsch grün/rot.

## Grundlagen und Quellenbindung

AGENTS, C 3–5/9–11, D, F M6.02 sowie die unveränderten Aufgaben-/Rubrik- und
Ergebnisverträge sind maßgeblich. Der gelieferte Prompt ist die Aufgabenbeschreibung;
der Prüfbericht sind Fremdbefunde am alten Head, keine eigenen Prüfergebnisse.
Archiv außerhalb des Repositories entpackt, Pfade/Symlinks geprüft, 47 Hashwerte
bestätigt. Nur die ausdrücklich verlangten, neu verfassten Prüfsätze wurden in
Testfixtures übernommen. ZIP, fremde Vollprotokolle und private Originalquellen
wurden nicht veröffentlicht. Keine eigenen erneuten OpenStax-Abrufe behauptet.

Alle 176 Hauptfälle, 34 Diagnosefälle und 368 bekannten Fälle sind unverändert
mit Text, ID und ursprünglicher Sollmenge enthalten. Die 368 bekannten Fälle
werden zusätzlich gegen die bereits vorhandenen ursprünglichen Fixtures geprüft.
Die drei kanonischen JSON-Hashes stehen im Unit-Test. 21 geschützte Dateien,
79 Aufgaben-IDs/19 Missionsbezüge und alle 13 Osmose-/39 Tonoplast-Redaktionsfälle
bleiben unverändert. Das belegt keine 79 implementierten Aufgaben.

Technische Testversionslabels (vom gelieferten Runner übernommen):
`review3-task-20261023`, `review3-rubric-20261023`, `concept-1.0-20261023`,
`review-no-simulation`. Vier Werte werden getrennt übergeben; keine erfundene
Simulation. Instanz `independent-review3-PR6`, Seed `fixed-independent-review`,
Phase `explain`, Modellzustand {}. Intakte Zwiebel-Epidermiszelle, frühe
Wasserverlustphase, Wasserpotenziale in Pa: Vakuole −120000 > Cytosol −350000 >
Außenraum −810000, beide Membranen wasserpermeabel, Saccharose weitgehend
zurückgehalten, andere Transporte ausgeblendet. Keine Konzentrationsableitung.

## Erkennungsbestände und unveränderte Sollwerte

- Gelieferte kurze Benennungen: **60/60 grün**, selbst reproduzierter Ausgang
  **23/60**. Jetzt bekannte Regression, keine frische unabhängige Quote.
- Eigener neuer Kurzbestand: **40/40 grün**, Ausgang **10/40**. Selbstprüfung,
  keine Schülerquote/Unabhängigkeit. Ziel 95 % im eigenen Bestand erreicht.
- Zuerst 40 Sätze fixiert; die Neuheitsprüfung vor Codeänderungen fand zwei
  Überschneidungen. Diese blieben erhalten, zwei zusätzliche Sätze wurden vor
  deren erstem Lauf fixiert. Nach NFC/Kleinschreibung/Satzzeichenbereinigung
  sind die ausgewiesenen 40 neuen Sätze eindeutig und ohne Treffer gegen 6749
  bekannte Strings. Beide ursprünglichen Dateien sind per Bytehash gebunden.
  Zwei bekannte Überschneidungen werden separat ausgewiesen, nicht als neu gezählt.
- Alle 42 selbst formulierten/einbezogenen Sätze haben acht vorab definierte
  Gegenvarianten (336): vier falsche Begriffe, Teilansatz, Alternative,
  Widerspruch und unbewerteter Zusatz. Sollwerte wurden nicht nachgebessert.
- Neue längere richtige Antworten: **0/12 grün**, 12 gelb; bekannte längere
  Gruppen **2/20 grün +18 gelb** (22.10.) und **0/20 +20 gelb** (erste Prüfung
  23.10.). Der ältere eigene Langbestand bleibt **4/20 +16 gelb**. Alle Nenner
  bleiben erhalten. Keine allgemeine Erklärungskorrektur implementiert.

**41 Abweichungen vom unveränderten Roh-Soll bleiben sichtbar:** zwölf neue und
20 bekannte längere Antworten mit ursprünglichem Soll `correct` bleiben im
beauftragten C01-Umfang `clarify`; sieben bekannte verneinte breite
Namensgleichsetzungen bleiben gemäß früherer dokumentierter Bezugsunsicherheit
`clarify`; zwei frühere Tonoplast-Klassifikationen sind gemäß der gelieferten
fachlichen Nachbeurteilung `incorrect` statt Roh-Soll `clarify`.
`acceptedFourth` übernimmt die früheren Ausnahmen gezielt aus `acceptedThird`.
Kein nachträglich erzeugter fachlicher Sollwechsel. Kein pauschales „956 Roh-Soll
bestanden“. Die 956 Resultate erfüllen die getrennt dokumentierten zulässigen
Mengen; bekannte/alte/gezielte/metamorphische Fälle sind keine unabhängige Quote.

Alle Statusverteilungen des vollständigen neuen Berichts:

| Gruppe | Gesamt | correct | partial | incorrect | clarify |
|---|---:|---:|---:|---:|---:|
| short-correct | 60 | 60 | 0 | 0 | 0 |
| long-correct | 12 | 0 | 0 | 0 | 12 |
| wrong-name | 12 | 0 | 0 | 12 | 0 |
| partial | 8 | 0 | 8 | 0 | 0 |
| ambiguous | 12 | 0 | 0 | 0 | 12 |
| contradiction | 12 | 0 | 0 | 12 | 0 |
| unsafe-extra | 12 | 0 | 0 | 0 | 12 |
| correct-distinction | 8 | 8 | 0 | 0 | 0 |
| semantic-boundary | 16 | 0 | 0 | 0 | 16 |
| tonoplast-correct | 12 | 12 | 0 | 0 | 0 |
| tonoplast-wrong | 6 | 0 | 0 | 6 | 0 |
| tonoplast-boundary | 6 | 0 | 0 | 0 | 6 |
| reaffirm-osmosis | 6 | 6 | 0 | 0 | 0 |
| reaffirm-tonoplast | 6 | 6 | 0 | 0 | 0 |
| genuine-correction-osmosis | 4 | 4 | 0 | 0 | 0 |
| genuine-correction-tonoplast | 4 | 4 | 0 | 0 | 0 |
| property-and-reaffirmation | 2 | 2 | 0 | 0 | 0 |
| property-and-reaffirmation-tonoplast | 2 | 2 | 0 | 0 | 0 |
| correction-contradiction | 2 | 0 | 0 | 2 | 0 |
| correction-contradiction-tonoplast | 2 | 0 | 0 | 2 | 0 |
| unresolved-correction | 3 | 0 | 0 | 0 | 3 |
| unresolved-correction-tonoplast | 3 | 0 | 0 | 0 | 3 |
| known0-short-correct | 50 | 50 | 0 | 0 | 0 |
| known0-long-correct | 20 | 2 | 0 | 0 | 18 |
| known0-wrong-name | 10 | 0 | 0 | 10 | 0 |
| known0-contradiction | 15 | 0 | 0 | 15 | 0 |
| known0-correct-negation | 10 | 10 | 0 | 0 | 0 |
| known0-unassessed | 10 | 0 | 0 | 0 | 10 |
| known0-partial | 5 | 0 | 5 | 0 | 0 |
| known0-ambiguous | 6 | 0 | 0 | 0 | 6 |
| known0-tonoplast-correct | 15 | 15 | 0 | 0 | 0 |
| known0-tonoplast-wrong | 10 | 0 | 0 | 10 | 0 |
| known0-tonoplast-unassessed | 5 | 0 | 0 | 0 | 5 |
| known1-short-correct | 60 | 60 | 0 | 0 | 0 |
| known1-long-correct | 20 | 0 | 0 | 0 | 20 |
| known1-wrong-name | 12 | 0 | 0 | 12 | 0 |
| known1-partial | 8 | 0 | 8 | 0 | 0 |
| known1-ambiguous | 12 | 0 | 0 | 0 | 12 |
| known1-contradiction | 12 | 0 | 0 | 12 | 0 |
| known1-unsafe-extra | 12 | 0 | 0 | 0 | 12 |
| known1-correct-distinction | 8 | 8 | 0 | 0 | 0 |
| known1-semantic-trap | 8 | 0 | 0 | 0 | 8 |
| known1-tonoplast-correct | 12 | 12 | 0 | 0 | 0 |
| known1-tonoplast-wrong | 8 | 0 | 0 | 8 | 0 |
| known1-tonoplast-boundary | 8 | 0 | 0 | 0 | 8 |
| known2-not-generic-name | 4 | 0 | 0 | 0 | 4 |
| known2-generic-name | 4 | 0 | 0 | 0 | 4 |
| known2-explicit-negation | 4 | 0 | 0 | 4 | 0 |
| known2-evidence | 4 | 4 | 0 | 0 | 0 |
| known2-unassessed-unicode | 4 | 0 | 0 | 0 | 4 |
| known2-tonoplast-property | 4 | 0 | 0 | 2 | 2 |
| known3-explicit-name-not-alias | 3 | 0 | 0 | 0 | 3 |
| known3-explicit-name-alias | 2 | 0 | 0 | 0 | 2 |
| known3-explicit-name-equivalence | 1 | 0 | 0 | 0 | 1 |
| known3-membrane-no-synonym | 1 | 0 | 0 | 0 | 1 |
| known3-membrane-not-membrane | 1 | 0 | 0 | 1 | 0 |
| fresh-short | 40 | 40 | 0 | 0 | 0 |
| known-overlap | 2 | 2 | 0 | 0 | 0 |
| fresh-wrong | 168 | 0 | 0 | 168 | 0 |
| fresh-partial | 42 | 0 | 42 | 0 | 0 |
| fresh-alternative | 42 | 0 | 0 | 0 | 42 |
| fresh-contradiction | 42 | 0 | 0 | 42 | 0 |
| fresh-unassessed | 42 | 0 | 0 | 0 | 42 |

## Tatsächlich ausgeführte Prüfung

Vollständiges `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run check`
am genannten Commit, Exit 0:

| Prüfung | Bestanden | Fehlgeschlagen | Übersprungen |
|---|---:|---:|---:|
| Unit | 3405 | 0 | 0 |
| Inhalt/Schema | 185 | 0 | 0 |
| Build | 19 | 0 | 0 |
| Chromium Desktop/Tablet/Mobile | 57 | 0 | 0 |
| Technisch lokal gesamt | 3666 | 0 | 0 |
| Konzeptprüfung, separat | 694 | 0 | 0 |

TypeScript strict, Katalog, Produktionsbuild und Veröffentlichungsschutz bestanden.
Zusätzlich alle 69 unterschiedlichen Schutzprüfungen aus dem gelesenen gelieferten
Runner selbst ausgeführt, 0 Fehler. Wiederholungen werden nicht addiert. Vier
Versionsbindungen, Kontextwechsel, Hilfe, Material, Potenzialreihenfolge/Einheiten,
Feldtrennung, Progressionssperre C01→Gesamtaufgabe, Überlänge/Markup und Datensparsamkeit
bleiben wirksam. Der erste externe Runnerstart scheiterte in Node-Strip-only-Modus
an einer bestehenden TypeScript-Parameterproperty; derselbe unveränderte Runner
bestand mit `node --experimental-transform-types`. Kein Anwendungsfehler verdeckt.

Frühere lokale Entwicklungsläufe: 12/12 Bestätigungen falsch rot am Ausgang;
erster Syntaxausbau 35 Abweichungen von den akzeptierten Mengen; zweiter Ausbau
3 Abweichungen. Die erste bestehende Unit-Regression hatte 2357 bestanden und
4 Fehler (Feldobjekt wurde als biologische Wiederbenennung gelesen). Die spezifische
Feldbenennung erhält jetzt Vorrang; der vollständige abschließende Lauf besteht.
Keine gefallenen Sollwerte, Testlöschung oder übersprungener Test zur Bereinigung.
Die historische Neuheitsprüfung der dritten Revision vergleicht ihren damaligen
Bestand; später wiederholte Sätze können damalige Neuheit nicht rückwirkend ändern.
Ihre Fall-/Hash-/Live-Statusprüfungen bleiben erhalten.

Alle 956 aktuellen Korpusobjekte sowie zwölf zusätzliche Rücknahme-Diagnosen gegen das
unveränderte JSON Schema validiert; zusammen mit bestehenden Beständen 2586 Schemaobjekte. Die 694
Konzeptchecks sind deklarative/redaktionelle Prüfungen, keine zusätzlichen
biologischen Runtimefälle.

## Browser und CI

[Eigener CI-Lauf 39917331953](https://github.com/Feerson1617/Lernspiel-Zellbiologie/actions/runs/39917331953)
auf `435843b1a44282199bd8eda01523eb3e7cbadf65`: Build **in_progress**, WebKit **failure**,
Gesamtlauf **in_progress** zum Berichtszeitpunkt. Der Linux-Job verbleibt
bei der Chromium-/Systemabhängigkeitsinstallation; sein Anwendungscheck wird
nicht als durchgeführt behauptet. Lokaler vollständiger Check und WebKit sind
oben tatsächlich abgeschlossen. Ein folgender Dokumentations-Push kann den
noch laufenden Vorgängerlauf gemäß bestehender Workflow-Konfiguration abbrechen.
Der finale Head/CI-Status wird separat in der PR-Beschreibung ausgewiesen.
Pages-Upload/Deployment sind im PR nicht freigeschaltet.
Job-/Schrittergebnisse und vollständige kompakte WebKit-Check-Annotations selbst
abgerufen; kein Lesen nicht zugänglicher Vollprotokolle behauptet.

WebKit: **54/57 bestanden, 3 fehlgeschlagen**, 0 skipped/flaky.
Standardbestand **45/48**, Zusatzbestand **9/9** (einschließlich drei neuer
968-Fälle-Prüfungen). Dieselben drei `start.spec.ts`-Standard-Tab-Prüfungen
scheitern auf macOS für Desktop/Tablet/Mobile: Tab → BODY, Option-/Alt-Tab →
Sprunglink. Explizit fokussierte Links aktivieren korrekt. Kein stilles Umstellen
oder Überspringen der Standardtests und kein grüner Gesamtlauf. Ursache nicht
pauschal als behobener Produktfehler ausgegeben. WebKit 27.2, macOS arm64;
lokal kein WebKit-Executable vorhanden. Echter Safari/iPad bleibt offen.

Neue Browserauswertung: (956 +12) ×3 Profile ×2 Engines = **5808** tatsächliche
Runtimeauswertungen. Vollständige Node-Parität, UTF-16-Originalspannen, Kontext,
Feedback und Statusdeskriptoren geprüft, keine externen Anfragen/Browserfehler,
keine Markupausführung, fremder Storage-Sentinel erhalten. Der Harness bündelt
die echten APIs durch Vite mit unverändertem Produktionsimportschutz, `write:false`.
Keine sichtbare Aufgaben-/Feedbackoberfläche vorhanden; keine echte
Schülerinteraktion mit Fachfarben/Hilfen behauptet. Aktuelle Chromium-Desktop-
und Mobilscreenshots der Produktionsstartseite visuell betrachtet, lesbar und
ohne abgeschnittene Inhalte. Keine UI-Änderungen.

## Veröffentlichung und Administration

Vier `dist`-Dateien byte-/SHA256-identisch mit dem Ausgang; drei lokale
Assetverweise unter `/Lernspiel-Zellbiologie/`. Keine neuen externen Requests,
Abhängigkeiten, Paket-/Lockfileänderungen oder Runtimeimporte redaktioneller Daten.
Zwölf echte negative Vite-Importbuilds einschließlich aller neuen Fixtures/`?raw`
werden blockiert. Der lokale vollständige Lauf prüfte 164 exakt freigegebene
Arbeitsbaum- und historische Pfade einschließlich der Berichte;
die Abschlussdokumentation wird erneut geprüft. Keine ZIP-/Originalquellen in Git/dist.
Eigener privater Originalvergleich nicht möglich; die fremden Hash-/Textscans
werden nicht als selbst wiederholt ausgegeben.

`main` vor Beginn erneut `protected=false`. Vorhandener, **nicht aktivierter**
Regelvorschlag verlangt nur `build`. WebKit läuft nur bei PRs; main-Deployment
hängt nur von build ab. Ein roter WebKit-PR ist administrativ nicht gegen Merge
und anschließendes Deployment gesichert. Administratorentscheidung: erforderliche
Checks (insbesondere Umgang mit WebKit), Review, Force-Push-/Löschschutz und
Deployment-Abhängigkeit festlegen. Kein Einstellungswechsel oder Merge ausgeführt.

## Nachweise und offene Grenzen

- `qa/p02b-fourth-results.json`: alle 956 vollständigen tatsächlichen Ergebnisse,
  Originaltexte/IDs/Sollwerte, separate akzeptierte Mengen, Feedback, Ausgangs-
  und Endverteilungen, 41 Roh-Soll-Abweichungen, zwölf zusätzliche Rücknahme-
  Diagnosen sowie alle 69 Schutzprüfungen.
- `qa/p02b-fourth-review.json`: schemafähiges Selbstprüfmanifest, SHA/Versionen,
  Befehle, Zahlen, aktuelle CI-Belege, Quellen-/Dateihashes und Restliste.
- Lokale Vollprotokolle/JSON/Screenshots bleiben in ignorierten `qa/generated/`
  bzw. `test-results/`; Hashverweise im Manifest, keine zusätzlichen CI-Uploads.
- 176+34+368 Fälle und die eigene Sammlung sind jetzt Regression. Erneute
  unabhängige Gegenprüfung muss **frische** Fälle entwickeln/ausführen.
- Echte benannte Safari-/iPad-Probe, Firefox, Lerngruppenpilot und private
  semantische Fallnäheprüfung nicht ausgeführt. Keine unabhängige Gegenprüfung
  dieses neuen Codes behauptet.
- Ausschließlich M6.02/process/C01; keine direction-/volume-/freie Erklärungskorrektur,
  Simulation, Fortschrittserweiterung, neue UI oder vollständige Mission. P02c
  nicht begonnen. P1-/Fokus-/Administrations- und Freigabegrenzen bleiben sichtbar.
