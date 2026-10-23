# P02b – siebte Nachbesserung / R5

**Selbstprüfung, keine unabhängige Gegenprüfung. NICHT MERGE. Keine P02c- oder Unterrichtsfreigabe.**

Geprüfter Implementierungscommit: `ae093b4ae56474aa412c1beec8e0206d9e22cb58`.
Ausgang `dcb81232297de5755a660bff8119c2c6a75e1a15`, bestehender PR #6,
Branch `feature/p02b-osmose-korrektor`; main `b155936443745d98c8133788872c9c5ff44d7fb2`.
Spätere Berichtskommitts ändern die Runtime nicht. Die PR-Beschreibung nennt den
exakten abschließenden Head und dessen tatsächlich abgeschlossenen CI-Lauf.

Gelesene Grundlagen: AGENTS, C insbesondere 3–5/9, D P02, F Z1.02/M6.02 und die
geschützten Aufgaben-/Rubrik-/Kontext-/Ergebnis-/Fortschrittsverträge sowie der
R5-Bericht und das Paket. 71 Dateihashes des außerhalb des Checkouts entpackten
Pakets geprüft. Keine privaten Originale oder fremden Prüfskripte übernommen.
Nur ausdrücklich beauftragte synthetische Antwortfälle und eigene Ergebnisse
werden veröffentlicht. Kein externer biologischer Quellenabgleich neu behauptet.

## Codeänderung

`naming-syntax.ts` erweitert endliche Rollen in Benennungssätzen: feldgebundene
Nominalgruppen, Namensnomen/-adjektive, Dativzuweisung („dem Vorgang den Namen …
zuordnen“), Benennungsverben, Wortstellung und ausdrücklich abgeschlossene
Relativsätze zur eigenen Wortwahl. Kein vollständiger Antwortabgleich, keine
beliebigen Textlücken. Biologische Antwortbegriffe bleiben in den Fachprofilen.
`Wasserbewegung` ist zusätzlich eine Referenz auf den gefragten Vorgang;
`Membranbezeichnung` und begrenzte „um die Vakuole/den Vakuolenraum“-Bezüge gehören
zum Tonoplastprofil. Dies macht kein anderes Wort zur richtigen Lösung.

`term-grammar.ts` erkennt harmlose Zweifel ohne „mir“ und bewahrt weiterhin den
vollständigen Resttext. Ein Starttoken-Index überspringt nur Konstruktionen,
deren erstes festes Wort nicht zum ersten Eingabetoken passt. Alle Konstruktionen
mit dynamischem ersten Slot bleiben Kandidaten; längstes Präfix und verpflichtende
Endungen werden unverändert geprüft. Slot-/Rahmencaches gelten nur für eine
Auswertung. Keine Antworttexte werden über Auswertungen hinweg gecacht.

`naming-choice.ts` bleibt bytegleich. Wiederholte Benennungen/Synonyme und
Originalevidenz bleiben getrennt, wissenschaftliche Prädikate, eigenständige
Ausschlüsse und Widersprüche erhalten. Die R2/R3/R4-Regression läuft vollständig.
Keine neuen biologischen Eigenschaften, Feedbackcodes, API-Verträge, Modelle,
Missionen, sichtbare Schüleroberfläche oder freie Erklärungskorrektur.

## Entscheidung zur Fragepaar-Lesart

Genau zwei vollständig gelesene, jeweils mit „Vielleicht“ begonnene
Benennungsfragen bleiben `clarify`, wenn sie unterschiedliche Konzepte oder
unterschiedliche Polaritäten vorschlagen. Reihenfolge und Synonym-ID entscheiden
nicht mehr über rot/gelb. Die Originaltexte und Sollwerte aller 24 gelieferten
Diagnosen bleiben unverändert. R5DIAG-02/03/04/14/15/16 sind jetzt `clarify`.

Begründung: Zwei ausdrücklich vorläufige konkurrierende Vorschläge sind keine
festgelegte aktuelle Sachbehauptung. Eine wörtliche negative Lesart war möglich;
die früheren sechs Rotwerte beweisen **kein Rot einer eindeutig richtigen
biologischen Antwort**. R5DIAG-15/16 enthalten „keine Tonoplast“ und bleiben
künstliche Robustheitsproben, keine Belege natürlicher Schülerformulierungen.

Keine pauschale Neutralisierung: einzelne falsche positive/negative Fragen,
bestimmte Ausschlüsse ohne „Vielleicht“, negative Nachstellungen und anschließende
falsche wissenschaftliche Prädikate bleiben rot. Gleiche positive Synonyme bleiben
eine Benennung; gleichartige wiederholte falsche Einzelvorschläge werden nicht
zu einer richtigen Antwort. Weitere/unbekannte Reste werden vollständig geprüft.
Der implementierte Ausnahmeumfang umfasst genau zwei solche Namensfragen;
eine allgemeine Interpretation mehrsätziger Frage-/Behauptungsfolgen fehlt.

Zwei **eigene** R4-Erwartungen werden ausdrücklich revidiert, nicht versteckt:

| unveränderter Text | ursprüngliches eigenes Soll | entschiedene Frage-Lesart |
| --- | --- | --- |
| Vielleicht doch keine Osmose? Vielleicht Osmosse? | incorrect | clarify |
| Vielleicht doch keine Tonoplast? Vielleicht Vakuolenmembran? | incorrect | clarify |

Beide Polaritäten bleiben als Fragen offen, auch bei synonymen Namen. Ursprüngliche
Sollwerte stehen als `originalExpected` neben `decidedExpected` in
`R5_QUESTION_READINGS`; der bestehende R4-Test prüft diesen Nachweis ausdrücklich.
Das ist eine dokumentierte sprachliche Lesartentscheidung unter dem R5-Auftrag,
keine Änderung geschützter biologischer Aufgaben oder Rubriken. Die zweite Probe
ist auch hier wegen des Artikels künstlich. Alle übrigen alten Sollwerte bleiben.

## Original-Soll, IST und Nenner

[Alle 2.823 vollständigen Ergebnisobjekte](p02b-r5-results.json), einschließlich
Original-ID/Text/Soll, IST, Kriterien, Feedback und UTF-16-Evidenz.
`metadata.rawMismatches` enthält alle Abweichungen einzeln. Die Bestände sind
getrennt; Auswertungszahlen sind keine Zahlen unabhängiger neuer Antworten.

| R5-Hauptgruppe | Anzahl | IST | ursprüngliche Solltreffer |
| --- | ---: | --- | ---: |
| kurze richtige Osmosebenennung | 60 | 60 correct | 60 |
| längere richtige Erklärung | 15 | 15 clarify | 0 |
| falsche Osmosebenennung | 20 | 20 incorrect | 20 |
| Teilansatz | 12 | 3 partial, 9 clarify | 3 |
| mehrdeutig | 12 | 12 clarify | 12 |
| Negation/Korrektur gemischt | 20 | 4 incorrect, 16 clarify | 8 |
| falscher relevanter Zusatz | 10 | 10 clarify | 10 (Soll incorrect oder clarify) |
| richtiger relevanter Zusatz | 10 | 10 clarify | 0 |
| richtige Tonoplastbenennung | 10 | 10 correct | 10 |
| falsche Tonoplastbenennung | 6 | 6 incorrect | 6 |
| Tonoplastteilansatz | 4 | 2 partial, 2 clarify | 2 |
| Tonoplastalternative | 4 | 4 clarify | 4 |

Hauptbestand **135/183 ursprüngliche Solltreffer, 48 offene Abweichungen**.
Davon 15 längere Erklärungen und zehn richtige relevante Zusätze außerhalb der
implementierten T1-Prüfung; weitere 23 betreffen Teilansätze, Korrektur-/
Bestätigungssätze und nicht erkannte Fehler. Alle 48 derzeit `clarify`.
Das sind weiter bestehende Implementierungslücken. Die technischen Tests
protokollieren sie mit `expectedRuntime`, ohne das biologische `expected` zu
ändern. Ein grüner Dokumentationstest erfüllt für sie nicht das ursprüngliche Soll.

Zusätzliche Systematik **290/290**, spätere Diagnosen **24/24** ursprüngliche
Solltreffer. Bekannte Regression **1.412/1.526** ursprüngliche Solltreffer mit
unverändert **114** älteren Rohabweichungen (51 R4 + 63 davor). Zwei ältere
ursprüngliche clarify-Sollwerte für falsche Klassifikation des Tonoplasten als
Zellmembran-/Zellwand-Art bleiben biologisch begründet incorrect. Das sind keine
falsch roten richtigen Antworten; das ursprüngliche Soll steht unverändert daneben.

Im geprüften Bestand kein falsches Grün und kein Rot bei eindeutig richtigen
Antworten gefunden. Neu kein Rot statt clarify. Die zwei älteren Klassifikations-
Rohabweichungen bleiben getrennt. Keine Behauptung absoluter Fehlerfreiheit.
Alle sechs neuen Frage-Diagnoseabweichungen sind repariert; alle 32 R4-Diagnosen,
R4-137 und R4DIAG-29 bleiben korrekt. 60 alte R4-Kurzantworten sind bekannte
Regression, kein neuer Freigabenachweis.

### Eigene zusätzliche Kurzantworten

Vor der ersten Bewertung weitere 60 natürliche vollständige kurze Antworten und
480 Gegenvarianten festgelegt. Freeze: **23.10.2026, 14:39:05 Europe/Berlin**
(`2026-10-23T12:39:05.275Z`), SHA-256
`7a18b4357986ffb6b786f06f4feea9d8c01e96ef5f1e91e460c6c9612355f197`.
NFC/Kleinschreibung/Satzzeichenvergleich gegen aktuelle Fixtures/QA/spec und alle
verfügbaren Gegenprüf-JSONs: 60 eindeutige Texte, null Überschneidungen. Die
28.358 Vergleichszeichenketten enthalten auch Metadaten, sind keine gleich große
Schülerstichprobe. Die Contentprüfung wiederholt den dauerhaften Repo-Abgleich.

| identischer Bestand/Material/Versionsbindung | dcb8123 vorher | nachher |
| --- | ---: | ---: |
| neue gelieferte kurze R5-Antworten | 29/60 | 60/60 |
| eigene vorab eingefrorene Kurzantworten | 13/60 | 60/60 |
| gelieferte richtige Tonoplastbenennungen | 2/10 | 10/10 |

Alle gelben Fälle bleiben im Nenner. Längere richtige Antworten bleiben separat
**0/15**, richtige relevante Zusätze **0/10**. Frühere Bestände behalten ihre
historischen Nenner/Befunde. Die fremde Vergleichsquote 23/60 auf cc625 gehört
zum identischen R5-Bestand; sie darf nicht mit den 38/60 einer anderen R4-Probe
als zeitlicher Leistungsverlauf vermischt werden.

Alle 480 eigenen Gegenvarianten treffen ihr vorab festgelegtes Soll. Zusätzlich
260 Tonoplasttransfer-/Fragekontrollen vor ihrer ersten Anwendung festgelegt:
alle Solltreffer, keine Behauptung 260 unabhängiger natürlicher Formulierungen.
R5 ist nach Übernahme Regression. Die eigenen 60 Antworten sind **Selbstprüfung**;
eine erneute gesonderte frische Gegenprüfung ist zwingend offen. Keine neue
unabhängige 95-%-Behauptung und keine Unterrichtsfreigabe.

## Tatsächlich ausgeführte technische Prüfungen

Linux x86_64, Node 24.19.0, npm 11.9.0, Python 3.12.14/jsonschema 4.26.0,
Chromium 154.0.8037.57; manifestierte Quellenhashes und Befehle in
[p02b-r5-review.json](p02b-r5-review.json).

```sh
npm run check:types
npx vitest run tests/unit --outputFile=qa/generated/p02b-r5-old-unit-fixed.json
npx vitest run tests/unit/p02b-r5.test.ts --outputFile=qa/generated/p02b-r5-first-unit.json
npm run build
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test tests/browser/p02b-r5.spec.ts --reporter=list,json
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run check
npm run check:publish
```

Vollständiger lokaler Lauf nach allen Runtimeänderungen bestanden:

- **10.341 Unit-, 197 Content-/Schema-, 29 Build-, 66 Chromium-Tests**;
- **10.633 technische Tests**, null fehlgeschlagen/übersprungen/flaky;
- TypeScript strict, Katalogabgleich, Produktionsbuild und Veröffentlichungsschutz;
- **694 Konzeptprüfungen separat**, keine Spiel-/Gegenprüfbescheinigung;
- 9.312 Schemaauswertungen vollständiger Runtime-Ergebnisse einschließlich
  wiederholter Falltexte; keine gleich große Zahl verschiedener Antworten;
- 69 unterschiedliche gelieferte Kontext-/Versions-/Material-/Hilfen-/Eingabe-
  Guards zusätzlich tatsächlich ausgeführt, alle bestanden, nicht mehrfach gezählt.

Alle **2.126 Osmosefeldergebnisse** des neuen 2.823er-Gesamtbestands werden als
M6.02-Gesamtabschluss zurückgewiesen. process bleibt ausschließlich C01 von drei
Pflichtkriterien. Hilfe/Status/gespeichertes Kontextvertrauen bleiben getrennt;
keine Rohtextpersistenz und keine Löschung fremder Browserdaten.

Desktop/Tablet/Mobile mit Touch-Emulation: produktiven Startbildschirm geladen
und alle 2.823 Ergebnisse je Profil durch echte src-APIs im getrennten flüchtigen
Prüfmodul mit produktivem Importguard gegen vollständige Node-Objekte verglichen.
Null Paritäts-/Originalspannenfehler, Seitenfehler oder externe Laufzeitanfragen
im bestandenen Lauf. Feedbacktexte, Symbole/Farben, Kontext und Speicherzustand
geprüft. Desktop-/Mobile-Screenshots des aktuellen Chromium-Laufs tatsächlich angesehen:
Startseitentexte und Links lesbar, keine sichtbare horizontale Überlagerung.
Keine tatsächlich nicht vorhandene Schülerbewertungsoberfläche als sichtbar
bedient ausgegeben. Kein echter Safari-/iPad-Test.

79 Aufgabenidentitäten/19 Missionsdatensätze und 21 geschützte Dateien unverändert.
Wasserpotenzialreihenfolge mit Druckbezug/Pa, Materialphase/Permeabilität/
Saccharoserückhaltung und Aufgaben-/Feld-/Rubrik-/Versionsbindung erhalten.
Abhängigkeiten/Lockdateien und naming-choice.ts unverändert. Vier dist-Dateien
bytegleich mit dcb8123, drei lokale Pages-Assetpfade. 22 echte negative Vite-
Importbuilds sperren spec/Test/QA/Reviewdaten einschließlich neuer R5-Dateien.
Mit Berichten 195 aktuelle erlaubte Pfade; der Veröffentlichungscheck prüft auch
alle erreichbaren historischen Pfade. Keine ZIP-/privaten Originaldateien.

### Tatsächliche Entwicklungsfehler

Der erste alte Unit-Lauf hatte **7.442 Erfolge/12 Fehler**. Zehn waren echte
Syntaxregressionen: „Ich vermute: …“ wurde vom neuen Präfix verdeckt; ein zu
breiter „ist die Membran“-Nachstellungsrahmen konsumierte nur den Anfang
vollständiger wissenschaftlicher Beschreibungen. Doppelpunkt bei harmloser
Vermutung zugelassen und den überbreiten Nachstellungsrahmen entfernt; keine
fachlichen Sollwerte zum Bestehen geändert. Die übrigen zwei Fehler betreffen
die oben ausdrücklich revidierten eigenen Frage-Lesarten. Danach sämtliche
7.454 alten Unit-Tests und abschließend der vollständige Lauf bestanden.
Erste Syntaxläufe/Fehlerprotokolle bleiben lokal in qa/generated erhalten;
frühere Fehlversuche werden nicht als erfolgreiche Abnahme ausgegeben.

## Browser-/CI-Gate und Grenzen

Lokaler WebKit-Binärpfad tatsächlich geprüft: Datei fehlt. Keine lokale WebKit-
Suite als ausgeführt/bestanden behauptet. Die vollständige reale macOS-Suite läuft
im bestehenden CI-Job, einschließlich unveränderter Standard-Tab-Tests und des
strengen JSON-Endgates. Dessen tatsächlicher Endstand wird unten dokumentiert;
der abschließende Head/Lauf zusätzlich in der PR-Beschreibung.

Der frühere R5-Gegenprüflauf und CI 39932023663 bleiben historisch **60/63**
mit drei Standard-Tab-Fokusfehlern, null Timeouts. Die frühere R4-Prüfung bleibt
55/60 im Erstlauf plus separater 3/3-Nachlauf. Keine rückwirkende Verrechnung.
Ein Node-Ergebnis für zwei unveränderte Assertions wird weiterverwendet.
Kein Test gelöscht/übersprungen, kein bestehendes Zeitlimit erhöht. Auch der neue
R5-Batch hat das ausdrücklich ausgewiesene 90-s-Limit der bisherigen großen
R3/R4-Paritätsprüfungen. Timinganhänge trennen Browser und Node/Assertions.

Vorläufige Bedienentscheidung: Standard-Tab bleibt offen, keine JavaScript-
Umleitung der Taste und keine Umbenennung roter Tests in Option-Tab-Erfolge.
Option-Tab ist der nachgewiesene macOS-WebKit-Weg; das belegt keine vollständige
Bedienbarkeit eines benannten realen Safari-/iPad-Geräts. Geräte-/Einstellungs-
entscheidung bleibt bis zu solchen tatsächlichen Nachweisen offen.

Main ungeschützt/Rulesets leer; keine administrative Änderung. Bestehendes
Deployment hängt nur an build, WebKit läuft nur bei PR. Konkreter künftiger
Vorschlag in der Entscheidungsvorlage: beide Pflichtchecks, WebKit tatsächlich
auch auf main ausführen und Deployment erst nach build + webkit. Nicht aktiviert.

## Eingabealternative und offene Prüfungen

[Reviewbare Vorlage naming-input/0.2-draft](../review/naming-input-0.2-decision.md):
sichtbares Begriffsfeld und zusätzliche sichtbare Aussagen, ehrliche Umfangs-
rückmeldung ohne grünes Gesamtbanner, explizite Korrektur mit vorigem Versuch/
Kontext, dokumentarischer Datenvertrag, Versionierung/Migration und neue Abnahme.
Keine automatische Extraktion, rückwirkende Grünbewertung oder heimliche Änderung
der Originalaufgabe/95-%-Nenner. Keine Umsetzung oder beschlossene Freigabe.
Wegen der wiederholten Differenz zwischen bekannten und frischen Formulierungen
wird eine fachliche Entscheidung darüber ausdrücklich empfohlen; weitere eigene
grüne Syntaxbestände genügen nicht als Freigabe.

Offen: neue getrennte frische Gegenprüfung; reale benannte Safari-/iPad-Geräte
mit Tastatur, Orientierung, Hintergrundrückkehr und Speichergrenzen; repräsentative
Schülerformulierungen; 48 neue/114 ältere Sollabweichungen; drei bisherige
Standard-Tab-Fehler. Private Originale hier nicht verfügbar: die Hash-/Textfenster-
Prüfung des fremden Berichts nicht erneut ausgeführt, keine eigene semantische/
Bild-/OCR-Prüfung behauptet. Richtung/Volumen, Missionen, Simulationen und sichtbare
Bewertungsoberfläche fehlen weiterhin. Kein Merge, P02c oder Unterrichtseinsatz.

### Tatsächlicher CI-Endstand des Implementierungscommits

[Actions 39956832616](https://github.com/Feerson1617/Lernspiel-Zellbiologie/actions/runs/39956832616)
auf `ae093b4ae56474aa412c1beec8e0206d9e22cb58`: **build success, webkit failure,
deploy skipped, Gesamtworkflow failure**. Tatsächliche Job-/Schrittzustände und
sämtliche WebKit-Check-Run-Annotationen gelesen; kein Lesen nicht verfügbarer
vollständiger Joblogs behauptet.

macOS arm64, Node 24.19.0, WebKit 27.2: Baseline **45/48**, zusätzlich **18/18**,
zusammen **63/66**, drei Fehler, null übersprungen/flaky. Die drei Fehler betreffen
weiterhin ausschließlich Standard-Tab in start.spec.ts auf Desktop/Tablet/Mobile.
Tab bleibt jeweils BODY, Option-Tab erreicht „Zum Inhalt“; die explizite
Linkaktivierung besteht. Das strenge abschließende JSON-Gate ist tatsächlich rot.

Alle alten und neuen Paritätsbatches einschließlich R5 bestehen in allen drei
Profilen, keine Zeitüberschreitung. Alle zwölf gemessenen Browser-/Node-Zeitpaare
stehen im Manifest/Rohbericht; p02b-fourth bleibt unter dem unveränderten
30-s-Limit. Kein unabhängiger Last-/Gerätenachweis daraus abgeleitet.

Nach Berichtsänderungen alle 197 Content-/Schematests erneut bestanden,
Veröffentlichungsschutz bestanden. Manifest zählt 10.633 lokale technische
Erfolge + 63 WebKit-Erfolge und drei WebKit-Fehler; CI-Buildwiederholung nicht
zusätzlich gezählt. 694 Konzeptprüfungen und 69 Guards bleiben separat.
Die PR-Beschreibung ergänzt nach dem Berichtscommit dessen exakten Head und
Endstand der dann erneut vollständig ausgeführten CI.
