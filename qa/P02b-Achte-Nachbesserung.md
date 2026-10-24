# P02b – achte Nachbesserung / R6

**Selbstprüfung. NICHT MERGE. Kein P02c, kein Formatwechsel, keine Unterrichtsfreigabe.**

Implementierungscommit: `3194330eb0d92f3edea5b8c3915087d9667bf6b5`.
Ausgang: `7ca29bdf96b7128969abee663675bda0b480b073`, bestehender PR #6,
Branch `feature/p02b-osmose-korrektor`; main unverändert
`b155936443745d98c8133788872c9c5ff44d7fb2`. Nachfolgende Berichtskommitts
ändern keine Runtime oder Tests. Der exakte abschließende Head und dessen
abgeschlossene CI-Ergebnisse werden in der PR-Beschreibung festgehalten.

Grundlagen: AGENTS, C/D/F, die geschützten Aufgaben-/Rubrik-/Kontext-/Ergebnis-/
Fortschrittsverträge, vorhandene Implementierung und vollständiges R6-Paket.
66 SHA256-Dateieinträge des außerhalb des Git-Checkouts entpackten Pakets
verifiziert. Nur beauftragte synthetische Antwortfälle übernommen; keine
ZIP-Quellen, fremden Prüfscripte oder privaten Originalprüfungen veröffentlicht.
Kein neuer externer biologischer Quellenabgleich oder unabhängiger Eigenprüfer
behauptet. Die R6-Gegenprüfung ist ein gelieferter unabhängiger Vorbefund;
alle hier ausgeführten Nachprüfungen sind Selbstprüfungen.

## Begrenzte Änderung

`naming-syntax.ts` ergänzt endliche Benennungsrollen mit Pflichtverben und
Satzenden: „unter dem Namen … bekannt“, „den Namen … angeben“, modale
Benennung, eigene Wortwahl-Relativsätze, „Art des Wassertransports“ und
harmlose Unsicherheit. `hierbei`, `gewählt` und `Antwortwort` gehören zur
Metasprache. `Wassertransportverfahren` ist ausschließlich eine Feldreferenz
im Osmoseprofil, `Membranbenennung` ausschließlich eine Namensreferenz im
Tonoplastprofil. Die biologische Lösungsvokabelmenge bleibt unverändert.

`term-grammar.ts` liest das abgegrenzte „, danke“ nach einer Benennung,
wenn danach das Ende oder ein Satztrennzeichen folgt. Weitere Aussagen,
Negation, Alternativen und wissenschaftliche Prädikate werden nicht entfernt.
Originaltokens und UTF-16-Spannen bleiben erhalten. Keine komplette
Antwort-Whitelist, beliebigen Textlücken, Negationsfilter oder externe Bewertung.
`naming-choice.ts` ist bytegleich; die explizite SHA-Prüfung und sämtliche alten
Rücknahme-/Synonym-/Fragepaarfälle bleiben bestehen.

## Vorher eingefrorene eigene Stichprobe

60 natürliche kurze Benennungen und 480 Gegenvarianten wurden vor dem ersten
Korrektorlauf festgeschrieben. Zeitpunkt: `2026-10-23T15:17:03.616Z`
(17:17:03 Europe/Berlin). SHA256 von `tests/fixtures/p02b-r6-fresh.ts`:
`f67e544c56285f3ade2914795910deaa2005180651963ea43f94c717b828ab8e`.
60 eindeutige Texte, keine normalisierte Übereinstimmung gegen 36.454 verfügbare
Zeichenketten aus bestehenden Beständen und Metadaten. Das ist eine Prüfung
auf Textüberschneidung, keine semantische oder statistische Unabhängigkeit.

Auf unverändertem Ausgangscode: eigene 22/60 und R6-Originale 43/60 erkannt.
Nach begrenzter Reparatur: eigene **56/60 = 93,33 %**, vier gelbe bleiben im
Nenner. Mindestens 57/60 wären erforderlich. Für diese vier Antworten wurden
keine weiteren Satzmuster ergänzt:

- `r6-fresh-7`: Ich würde bei dieser Teilfrage von Osmose sprechen.
- `r6-fresh-18`: Hierbei nenne ich als Fachbegriff Osmose.
- `r6-fresh-40`: Bei dem gezeigten Wassertransport kommt Osmose als Fachwort infrage.
- `r6-fresh-44`: Osmose ist wohl mein gewähltes Wort für diese Teilfrage.

Diese üblichen, fachlich richtigen Benennungen bleiben technische Sprachlücken,
keine fachlichen Fehler der Lernenden. Die 95-%-Contentprüfung bleibt bewusst
als echter fehlgeschlagener Test bestehen; sie wird weder übersprungen noch
auf den gemessenen Wert abgesenkt. Die vier Satzrahmen erzeugen zusätzlich
24 gelbe Gegenvarianten. Ihre ursprünglichen Sollwerte bleiben ebenfalls stehen.

## Original-Soll und tatsächliches Ergebnis

Die übernommenen R6-Fälle sind jetzt Regression, keine neue unabhängige
Bestätigung. Alle 3.580 vollständigen Ergebnis-/Feedbackobjekte, ursprünglichen
Sollwerte, technischen Lückensperren, Gruppen und 233 Rohabweichungen stehen
in `qa/p02b-r6-results.json`. Mehrere Zeilen können denselben Text prüfen;
die Summe ist keine Zahl einzigartiger Antworten.

| Bestand | Umfang | Vorher ursprüngliches Soll getroffen | Jetzt ursprüngliches Soll getroffen |
| --- | ---: | ---: | ---: |
| R6 Hauptfälle | 183 | 116 | 141 |
| davon kurze richtige Osmosebenennungen | 60 | 43 | 60 |
| R6 systematische Kombinationen | 290 | 234 | 290 |
| R6 spätere Diagnosen | 24 | 21 | 23 |
| Frühere mitgelieferte Fälle | 2.023 | 1.861 | 1.861 |
| Eigene neue kurze Benennungen | 60 | 22 | 56 |
| Eigene eingefrorene Gegenvarianten | 480 | separat in Rohdaten | 456 |
| Satzrahmen-/Höflichkeitskontrollen | 520 | kein vergleichbarer Vorhernenner | 520 |

Die R6-Hauptfälle enthalten weiterhin 42 gelbe Sollabweichungen: 15 längere
richtige Antworten, sechs Teilansätze, zehn Negations-/Korrekturfälle, zehn
richtige relevante Zusätze und einen Tonoplast-Teilansatz. Alle 20 falschen
Osmosenamen, zehn richtigen und sechs falschen Tonoplastnamen treffen jetzt
ihr ursprüngliches Soll. Zwölf Osmose- und vier Tonoplastalternativen bleiben
wie erwartet unentschieden. Falsche unbekannte Zusatzbehauptungen bleiben
konservativ zur Klärung offen, statt ein unbelegtes Fehlkonzept zu erfinden.

Die zwei Höflichkeitsdiagnosen werden jetzt begründet rot.
`R6DIAG-23` „Die Membran um den Zellkern heißt Tonoplast“ bleibt mit
`TONOPLAST_FALSE_IDENTITY` rot. Der externe Prüfer hat sein vorheriges
`clarify`-Soll ausdrücklich als zu eng eingeordnet. Original-Soll, Rohabweichung
und gelieferte Adjudikation stehen getrennt nebeneinander; es werden nicht
24/24 ursprüngliche Statuswerte behauptet. Ebenso bleiben die zwei älteren
biologisch falschen Tonoplast-Klassifikationen begründet rot neben ihrem
historischen `clarify`-Soll. Die beiden eigenen R5-Fragelesartrevisionen bleiben
mit ihren ursprünglichen Erwartungen dokumentiert und regressiert.

In diesen 3.580 Ergebnissen kein falsches Grün und kein Rot für eindeutig
richtige Antworten gefunden. Das ist kein Fehlerfreiheits- oder Freigabebeweis.
Die 233 Rohabweichungen zerfallen in 42 Hauptfälle + eine adjudizierte Diagnose
+ 162 frühere Fälle + 28 eigene Fälle. `expectedRuntime`/`acceptedKnown` sind
technische Zustandskontrollen, keine abgeänderten biologischen Sollwerte oder
fachliche Abnahmen. Das rote 95-%-Gate verhindert entsprechende Grünrechnung.

## Tatsächlich ausgeführte Prüfungen

Linux x86_64, Node 24.19.0, npm 11.9.0, Python 3.12.14/jsonschema 4.26.0;
Chromium 154.0.8037.57. Manifest: `qa/p02b-r6-review.json`.

| Prüfung | Tatsächliches Ergebnis |
| --- | --- |
| `npm run check:types` | bestanden |
| `npm run check:spec`, durch `npm run check` | 694 Konzeptprüfungen bestanden; separat von Anwendungstests |
| vollständige Unit-Suite | 13.923 bestanden |
| vollständige Content-Suite | 200 bestanden, ein 95-%-Gate fehlgeschlagen |
| Ergebnisschemata innerhalb Content | 12.892 wiederholte tatsächliche Ergebnisvalidierungen bestanden |
| `npm run test:build`, nach Abbruch separat ausgeführt | Produktionsbuild, TypeScript, Katalog, Veröffentlichungsschutz und 34 Build-Tests bestanden |
| vollständiges Chromium/Playwright, separat ausgeführt | 78 bestanden, keine Überspringungen oder Flaky-Tests |
| gelieferte Material-/Versions-/Kontext-/Hilfenschutzprüfungen erneut ausgeführt | 69/69 bestanden; Selbstprüfung |

Lokale Standardsumme: **14.235 bestanden, ein fehlgeschlagener Test, null
übersprungen**. `npm run check` endet wegen des Qualitätsfehlers mit Exit 1
und erreicht deshalb selbst Build/Browser nicht. Deren vollständige Befehle
wurden anschließend tatsächlich separat ausgeführt. Keine Behauptung eines
bestandenen Gesamtbefehls. Konzept- und 69 Schutzprüfungen werden nicht in die
technische Standardsumme eingerechnet.

Die Schema-, Originalspannen-, Kontext-, Feedback- und Präsentationsprüfungen
verwenden dieselben Pure-Funktionen. Alle 2.924 Osmosefeldbefunde des neuen
Ergebnisbestands werden als Abschluss der gesamten M6.02 zurückgewiesen;
`process` bleibt nur C01. Hilfe, Speicherung und weitere Kriterien bleiben
unverändert. 79 Aufgaben-IDs, 19 Missionsdatensätze und 21 geschützte Dateien
sind unverändert. Keine neue Simulation oder Lernmission.

78 Chromiumtests prüfen Desktop, Tablet und Mobilprofil. R6 prüft pro Profil
alle 3.580 Datensätze in vier Chargen von höchstens 900, mit vollständigem
Node-/Bundlevergleich, Originalevidenz, Kontext, Feedback, Symbol/Text/Farbe,
keinen externen Anfragen und unverändertem fremden Speichereintrag.
24 gemessene Browser-/Node-Zeitaufzeichnungen, darunter zwölf R6-Chargen,
liegen in den Rohdaten. Kein bestehender Test entfernt oder Zeitlimit erhöht.
Die gebaute Startseite wird tatsächlich mit lokalen Ladepfaden geprüft;
eine sichtbare Aufgabenoberfläche existiert weiterhin nicht und wird nicht
als getesteter Benutzerfluss ausgegeben. Keine Pfeile oder Aufgabenbedienwege
erfunden.

Vorbereitende Befunde: Der erste begrenzte Patch ließ R6-024 und R6-164 offen;
deren Benennungsschluss bzw. profilgebundener Begriff wurden korrigiert.
Der Kontrollgenerator ersetzte zunächst bei vier Tonoplast-Synonymrahmen das
falsche Ausgangswort und verwendete einen nicht unterstützten Teilbegriff.
Vor den formalen Kontrollen wurden der tatsächliche Ausgangsbegriff und das
rubrikgestützte „Membran“ eingesetzt. Die gelieferten Originalfälle und die
vorher eingefrorenen eigenen 60+480 wurden dabei nie verändert. Ein früher
`git diff --check` beanstandete eine leere Schlusszeile; vor dem Commit behoben.

## WebKit, CI und Veröffentlichung

Lokale WebKit-Binärdatei tatsächlich geprüft: nicht vorhanden. Kein lokaler
WebKitlauf oder echter Safari-/iPad-Test wird als bestanden behauptet.
Der vorherige CI-Lauf `39957895371` auf `7ca29bd` war insgesamt rot:
build success, WebKit 63/66 mit drei Standard-Tab-Fehlern, deploy skipped.
Dieser alte Befund ist kein Ergebnis für den neuen Head. Der abschließende
Head wird gepusht, sein macOS-WebKit-Lauf tatsächlich ausgewertet und mit
Link, Zählern und Gates in [PR #6](https://github.com/Feerson1617/Lernspiel-Zellbiologie/pull/6)
festgehalten. Zum Zeitpunkt dieses Berichtskommitts ist dieser neue Lauf
noch nicht ausgeführt. Es wird kein grüner Status vorweggenommen.
Standard-Tab bleibt verbindlich; Option-Tab ersetzt keine fehlende Abnahme.
Der bestehende strenge JSON-Endcheck bleibt erhalten. Nur die neue R6-Datei
wird der zusätzlichen WebKit-Suite zugeordnet; kein Workflowgate geändert.

Veröffentlichungsschutz: 206 freigegebene Projektpfade, 21 geschützte Dateien,
vier dist-Dateien und drei lokale Assetreferenzen. Fünf zusätzliche tatsächliche
Vite-Importversuche aus R6-Test-/QA-/Reviewdaten werden abgewiesen. Alle
historischen Pfade werden ebenfalls geprüft; Gitignore allein ist kein Schutz.
Das normale Startbundle enthält keinen Korrektor oder Testkorpus. Keine privaten
Originale zugänglich, daher keine eigene private Hash-/Textfenster-/OCR-Prüfung;
die fremden Datenschutzbefunde werden nicht als eigene Wiederholung ausgegeben.
Keine Rohtexte dauerhaft gespeichert oder an externe Bewertungsdienste gesendet.

GitHub tatsächlich gelesen: main ungeschützt, Rulesets leer, PR offen und kein
Auto-Merge. Die vorgeschlagene spätere Main-Regel mit Pflichtchecks build und
webkit sowie ein auf main ausgeführter WebKitjob und Deployment erst nach beiden
Jobs bleiben Vorschläge. Keine administrative Aktivierung oder Änderung der
Deployment-Abhängigkeit.

## Konkrete didaktische Entscheidungsempfehlung

**Die Entscheidungsgrenze ist ausgelöst.** Unabhängig erneut nur 43/60, trotz
60/60 bekannter R5-Fälle, rechtfertigt keine unbegrenzte Parserausweitung.
Die eigene neue Stichprobe verfehlt ebenfalls 95 %. Deshalb jetzt einen klar
kommunizierten Fachbegriff-Vertrag mit optionaler Klärung zur fachlichen
Entscheidung empfehlen; weitere Muster für die vier neuen Lücken werden nicht
ergänzt. Kein eigenmächtiger Formatwechsel und keine Abschwächung der Ziele.

[Didaktischer Vergleich und konkreter Vertrag](../review/R6-Eingabeempfehlung.md)
vergleichen biologische Korrektheit, Bedienbarkeit, Motivation, Fehlertoleranz,
Testbarkeit und Wartbarkeit. Sie konkretisieren Aufgaben-/Feldpaare,
Mehrwortsynonyme, optionale sichtbare Zusätze ohne grünes Gesamturteil,
unterstützte Klärung als neuen Versuch, Ergebnisumschlag, Kontext-/Versionen und
unveränderten Metadatenschutz. Die Vorlage `naming-input/0.2-draft` bleibt
unbeschlossen. Die Frage ist eine Formatentscheidung, kein Auftrag zum
weiteren Ausbau des deutschen Satzraums.

Offen: fachlicher Beschluss und gesonderter Umsetzungsauftrag, frische getrennte
Gegenprüfung, aktuelles 95-%-Gate, längere Antworten/Zusätze, WebKit-/Geräteabnahme,
Lernendenpilot und tatsächlicher Main-/Deployment-Schutz. Keine Selbstprüfung
zählt als unabhängige Gegenprüfung. PR bleibt offen, nicht mergen, kein P02c.
