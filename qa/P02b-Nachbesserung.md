# P02b – Nachbesserung nach unabhängiger Fachprüfung

**Historischer Prüfstand.** Die erneute Gegenprüfung des Heads `32cf4fc` fand
weiterhin erhebliche Erkennungslücken. Aktueller Nachweis und zweite Korrektur:
[P02b-Zweite-Nachbesserung.md](P02b-Zweite-Nachbesserung.md).

**Codex-Selbstprüfung, keine unabhängige Gegenprüfung oder Unterrichtsfreigabe.**
Nur M6.02/process und die notwendige gemeinsame Benennungsgrammatik; kein P02c.

- Ausgang auf `feature/p02b-osmose-korrektor`, PR #6:
  `374af12552da9a572840e0fe9b60bcf739716ca7`.
- Vollständig geprüfter Korrekturcommit:
  `bbf3e9e37927bb7eec31767e00e8212aedfd5fc7`.
- Der nachfolgende Berichtscommit ergänzt nur diese Datei und
  `p02b-revision-review.json`; Schema/Veröffentlichungsschutz werden erneut geprüft.
- Grundlagen: AGENTS, unveränderte Konzeptfestlegungen insbesondere C/M6.02,
  TERM_OSMOSIS und die vorhandenen Kontext-, Ergebnis- und Fortschrittsverträge.

## Übermittelter Fremdbefund und eigene Reproduktion

Der Nutzer berichtet einen separat ausgeführten ChatGPT-Gegenprüflauf:
22/55 kurze richtige Antworten grün, 33 unklar; 0/30 ausführlichere richtige
Antworten grün; 15/30 klare Fehler rot, 15 unklar; 6/14 Teilantworten teilweise,
acht unklar; alle 14 mehrdeutigen Antworten unklar. 192 zusätzliche
Widerspruchskombinationen seien ohne Falschgrün geblieben, ebenso hätten alle
13 Osmose-/39 Tonoplast-Redaktionsfälle und zehn Kontextprüfungen bestanden.
Das sind **übermittelte Fremdbefunde**. Der vollständige externe Bestand liegt
nicht vor und wurde hier nicht als eigener Prüflauf rekonstruiert.

Die 19 konkret übermittelten Eingaben wurden auf dem Ausgangsstand ausgeführt:
alle 14 richtigen Antworten und vier der fünf falschen Antworten waren
`clarify`. „Osmose ist ein anderer Name für Plasmolyse“ war bereits korrekt
`incorrect`. Final erreichen **alle 19** ihren unveränderten Sollstatus.

Ursachen waren fehlende Antwort-/Begriffsrahmen, Unsicherheitsformulierungen,
Nachträge, Objektstellung bei „nennt man“, eine fehlende Transportbezeichnung
sowie die nicht verstandene ATP-Pumpe und Kategorieformulierung.

## Änderungen und erhaltene Grenzen

- `naming-frames.ts`: gemeinsame Fragmente für Antwort/Begriff/Bezeichnung aus
  begrenzten Subjekten und Prädikaten sowie explizite Vermutungs-/Entscheidungs-
  und Nachtragsmuster. Keine biologischen Lösungstexte und keine Antwort-Whitelist.
- `term-grammar.ts`: längster passender Rahmen vor kürzerem Unsicherheitspräfix,
  obligatorische Endungen, begrenzte eingeschobene Unsicherheit, nachgestellte
  Benennung, explizite Negation samt paralleler Präposition. Die ganze Eingabe
  bleibt maßgeblich; unbekannte Zusätze werden nicht entfernt.
- Das abschließende „ist“ in „Ich vermute, dass es X ist“ schließt den Rahmen,
  statt fälschlich eine zweite Identitätsaussage zu eröffnen. Fehlende Endungen
  und unklare doppelte Verneinung bleiben Klärungsfälle.
- `osmosis.ts`: Transport-/Objektrahmen, ATP-Pumpe als aktive Pumpe und
  passende Genitivformen aktiven/passiven Transports. „Eine Form des …“ wird
  nur als begrenzte Kategoriebehauptung behandelt; kein allgemeiner Wortfund-Alarm.
- Neue Fixture-/Unit-Datei und erweiterte Content-/Browsertests; fünf konkrete
  neue Allowlist-Pfade. API-Dokumentation/README ergänzt, Erstbericht als
  historisch gekennzeichnet. Keine neuen Abhängigkeiten.

Fachlexika und Entscheidungen bleiben getrennt. Der Tonoplast-Korrektor nutzt
die gemeinsamen Rahmen mit unveränderter Fachlogik; alle bisherigen Sollwerte
bleiben bestehen. Kontext-/Versionsbindung, Originalspannen, Feedback, Hilfe,
Publikationsschutz und die Sperre vollständiger M6.02-Erfolge aus nur C01 gelten
weiter. Keine Bewertung von direction/volume oder freien biologischen Aufsätzen.

## Neue Fallbestände und getrennte Quoten

Vollständige Eingaben, IDs, Sollstatus und Gründe:
`tests/fixtures/osmosis-revision-cases.ts`. Sollwerte wurden vor der
Grammatikerweiterung festgelegt. Kein fachlicher Sollwert wurde abgeschwächt.

| Bestand | Fälle | Finale Ergebnisse |
| --- | ---: | --- |
| Übermittelte Gegenprüfbeispiele | 19 | 14 richtig, 5 falsch |
| Neue natürliche kurze Benennungen | 40 | **40 grün, 0 gelb, 0 rot** |
| Neue falsche Benennungen in denselben Rahmen | 40 | 40 falsch |
| Neue Teil-/Klärungsantworten | 16 | 6 teilweise, 10 unklar |
| Neue Negations-/Korrekturfälle | 20 | 10 richtig, 6 falsch, 4 unklar |
| Neue ausführlichere richtige Sprachfälle | 10 | **6 grün, 4 gelb, 0 rot** |
| Richtiger Anfang plus spätere sichere Gegenaussage | 100 | 100 falsch |
| **Zusätzlicher fester Bestand** | **245** | alle 245 Sollstatus erreicht |

Grünquote für die **neuen kurzen Benennungen: 40/40 = 100 %**, vor Änderung
2/40 = 5 %. Diese 40 Eingaben werden auf Neuheit gegenüber bisherigen eigenen,
redaktionellen und übermittelten Beispielen geprüft. Sie umfassen unter anderem
persönliche Vermutung/Entscheidung, umgangssprachliche Satzpartikeln, untergeordnete
Benennung und nachgestellte Antwort. Das ist keine empirische Schülerstichprobe
oder unabhängige Erkennungsquote.

Grünquote für die **zehn neuen ausführlicheren richtigen Antworten: 6/10 = 60 %**.
Die vier gelben Antworten bleiben im Nenner. Sie enthalten Richtungs-, Volumen-
oder Materialaussagen, die der begrenzte Sprachparser nicht vollständig prüft;
ihre biologische Plausibilität führt daher nicht zu einer erfundenen Bestätigung.
Die früheren eigenen 16 kurzen/24 breiteren richtigen Antworten bestehen
weiterhin, ersetzen aber keinen neuen unabhängigen Bestand. Die neue 60-%-Quote
ist nicht mit den externen 0/30 vergleichbar, da andere Eingaben geprüft wurden.

Zusätzlich zu den festen Fällen: 216 Austausche bekannter falscher Begriffe
und 54 konkurrierende Alternativen in allen 14 übermittelten und 40 neuen
positiven Rahmen, 54 unbekannte Zusätze, 32 untergeordnete Benennungsvarianten
plus acht relevante Zusätze und sechs explizite Präpositions-/Negationsfälle.
Es sind Prüfungen, nicht sämtlich zusätzliche einzigartige Eingaben. Weitere
Tests prüfen gemeinsame Rahmen mit getrennten Bedeutungen beider Korrektoren.

## Tatsächlich ausgeführte vollständige Regression

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run check
```

Auf dem genannten Korrekturcommit, Linux x86_64, Node 24.19.0, npm 11.9.0,
Python 3.12.14 mit dokumentierten Spec-Abhängigkeiten, Chromium 154.0.8037.57:

| Prüfung | Bestanden |
| --- | ---: |
| Unit einschließlich aller bisherigen Regressionen | 1188 |
| Content/Identitäten/Redaktions- und Ergebnisschema | 173 |
| Produktions-/geschützter Vorbereitungsbuild | 10 |
| Chromium Desktop/Tablet/Mobilprofil | 45 |
| **Technische Tests gesamt** | **1416** |
| **Separate unveränderte Konzeptprüfungen** | **694** |

Keine Fehler, Überspringungen oder flaky Tests im finalen Lauf. TypeScript
strict, Katalogprojektion, Produktionsbuild und Veröffentlichungsschutz bestanden.
Die Konzeptprüfung validiert nur das ursprüngliche Redaktionspaket und
Referenzarithmetik; sie ist keine biologische Runtime-Gegenprüfung.

**409 tatsächliche Osmose-Ergebnisobjekte** und weiterhin **291 Tonoplast-
Ergebnisse** wurden gegen das unveränderte Ergebnisschema validiert. Alle
13 Osmose-/39 Tonoplast-Redaktionsfälle sowie vollständige P00–P02b-Regression
bestanden. Die Browser führen **395 feste Osmosefälle je Profil** aus; `undefined`
bleibt ausdrücklich nur im Unit-Test. Ein weiterer Test pro Profil prüft neue
gemeinsame Rahmen mit richtigen, falschen und konkurrierenden Begriffen beider
realen Runtime-Schnittstellen. Evidenz, Kriterien, Feedback-/Präsentationsdaten,
Kontexte, Hilfe und Teilfeldschutz werden tatsächlich geprüft, keine fertige
Aufgabenoberfläche behauptet.

79 Aufgabenidentitäten, 19 Missionsbezüge und 21 geschützte Dateien unverändert.
Vier Dist-Dateien bytegleich zum Ausgang; drei lokale Assetpfade, korrekter
Pages-Pfad, keine unerwarteten externen Startanfragen. Keine Testfixtures,
redaktionellen Lösungen oder privaten Prüfungsdateien im Startbundle.

## Fehlgeschlagene Vorläufe und Fehlerregister

| Befund | Reproduktion und Behebung |
| --- | --- |
| P02b-R01 / P2: Erkennungslücken | Ausgangsstand verfehlt 18/19 übermittelte Sollstatus und erkennt nur 2/40 neue kurze Antworten grün. Gemeinsame begrenzte Rahmen sowie bekannte Fachformen ergänzt; final alle erwarteten Status erreicht. |
| P02b-R02 / P2: Rahmenabschluss/Objektstellung | Erster Korrekturstand: „Ich vermute, dass es Osmose ist“ und „Vermutlich nennt man das Osmose“ noch unklar; falsche Namen und spätere Widersprüche in denselben Rahmen ebenfalls nicht sicher erkannt. Endungspriorität und invertierten Benennungsrahmen ergänzt; unveränderte Sollwerte bestehen. |

Tatsächliche lokale ignorierte Belege unter `qa/generated/`:
`p02b-revision-before.json` (21 bestanden, 225 fehlgeschlagen),
`p02b-revision-first-fix.json` (865 bestanden, 14 fehlgeschlagen),
`p02b-revision-second-fix.json` (879 bestanden, null Fehler),
`p02b-revision-safety.json` (319 bestanden),
`p02b-revision-targeted-final.json` (655 bestanden),
`p02b-revision-first-check.log` (1414 technische Prüfungen vor den zwei weiteren
Scope-Tests) und `p02b-revision-final-check.log` samt finalen Runner-JSON-Dateien.
Der erste Vorlauf wurde ausdrücklich zum Nachweis fehlender Erkennung ausgeführt.
Keine fachliche Rot-/Grün-Fehlbewertung aus diesen Vorläufen nachgewiesen; der
Mangel war unzureichende Erkennung. Behebung im oben genannten Korrekturcommit.

## Weiter offen

Neue unabhängige ChatGPT-Gegenprüfung mit weiteren eigenen Antworten steht aus.
Weiterhin keine WebKit-/echte Safari-/iPad-Probe, reale Schülerstichprobe oder
sichtbare Aufgaben-/Feedbackoberfläche. Private Originalklausur und
Erwartungshorizonte waren nicht zugänglich und wurden nicht aufgenommen.
Komplexe Negation, Zeitwechsel, freie feldübergreifende Erklärungen und unbekannte
relevante Zusätze bleiben Klärungsgrenzen. **Kein Merge, kein P02c, keine
Richtungs-/Volumenkorrektur, Missionen oder Simulationen.**
