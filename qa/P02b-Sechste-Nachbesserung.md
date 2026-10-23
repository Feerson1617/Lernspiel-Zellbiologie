# P02b – sechste Nachbesserung / R4

**Selbstprüfung, keine unabhängige Gegenprüfung. NICHT MERGE. Keine P02c- oder Unterrichtsfreigabe.**

Geprüfter Implementierungscommit: `52d60759d9acff7ae5480bb93a94aeed2a28ee79`.
Ausgang: `cc6257465fb311ba23d2d916af6148ca4a2c2163`, bestehender PR #6,
Branch `feature/p02b-osmose-korrektor`, Basis main `b155936443745d98c8133788872c9c5ff44d7fb2`.
Nachfolgende Berichtskommitts ändern die Runtime nicht. Den exakten abschließenden
PR-Head und dessen CI-Ergebnis nennt die PR-Beschreibung.

Grundlagen tatsächlich gelesen: AGENTS, C insbesondere 3–5/9, D P02, F Z1.02/M6.02,
unveränderte Aufgaben/Rubriken/Verträge und R4-Bericht/Paket. Die 74 SHA-256-Werte
des außerhalb des Checkouts ausgepackten Pakets stimmen. Keine privaten Originale
oder fremden Prüfskripte wurden ins Repository kopiert. Veröffentlicht werden nur
die ausdrücklich beauftragten synthetischen Antwortfälle und eigene Messergebnisse.

## Änderung und Grenzen

`naming-syntax.ts` ergänzt endliche Nominalgruppen, Feldbezüge, Benennungsverben,
Voran-/Nachstellung und ausdrücklich gebundene Endverben. Beispiele für die
Konstruktionen sind „in das Feld … schreiben“, „mich auf … festlegen“, „mit …
bezeichnet“, „als Begriff … im Kopf“ und „beim Namen nicht ganz sicher: …“.
Die Wörter für richtige und falsche biologische Antworten bleiben im jeweiligen
Fachprofil; kein vollständiger Antwortabgleich, keine beliebigen Textlücken.
`Vorgangsname` und `Membranname` gehören zu getrennten Feldprofilen. Ein Zweifel
an der Benennung entfernt weder eine Verneinung des Begriffs noch Folgesätze.

Die Wiedererkennung von Slots, Modifikatoren und Satzanfängen wird ausschließlich
innerhalb einer einzelnen Auswertung zwischengespeichert. Es gibt keinen
antwortübergreifenden Textcache und keine Speicherung/Übertragung von Rohtext.
Biologische Entscheidungen, Feedbackcodes, Modell-/Materialbedingungen, Einheiten
und öffentliche Ergebnisverträge sind unverändert. Das Tonoplastprofil erhält
zusätzlich rein syntaktische Referenzen auf „Vakuolengrenze“ und „Membran um die
Vakuole“, keine zusätzliche richtige Antwort.

`term-grammar.ts` lässt bereits negierte Namen zur bestehenden Schleife für
wiederholte negative Synonyme durch. „Nicht Tonoplast und nicht Vakuolenmembran.
Tonoplast ist eine Membran.“ wird jetzt `incorrect`; die richtige Eigenschaft
hebt den Ausschluss nicht auf. Gemischte Begriffe/Negationsbereiche bleiben
`clarify`. Nachgestellte Benennungsrahmen bewahren ebenfalls ihre Negation.

R4-137 bleibt mit ursprünglichem Soll `clarify` erhalten. „Vielleicht doch keine
Osmose? Vielleicht Endocytose?“ wird nun `clarify`, vorher
`incorrect/OSMOSIS_NEGATED`. Begründung: zwei ausdrücklich mit „Vielleicht“
begonnene Fragen, zuerst verneinte Benennung, danach ein anderer positiver
Vorschlag, ohne Entscheidung. Die Regel gilt nur bei genau diesen zwei vollständig
gelesenen Benennungsfragen. Eine einzelne falsche Frage, ein bestimmter Ausschluss,
dieselben synonymen Namen oder eine weitere wissenschaftliche Aussage werden nicht
dadurch neutralisiert. Die frühere rote Lesart war eine mögliche wörtliche
Negationslesart, **kein nachgewiesenes Rot einer eindeutig richtigen Antwort**.

`naming-choice.ts` bleibt bytegleich: aktive Namenswahl und sämtliche
Originalevidenz bleiben getrennt. Alle R2-/R3-Regressionen einschließlich
Wiederholungsrücknahmen, Synonymen, wissenschaftlichen Zwischenprädikaten,
Ausschlüssen, echten Widersprüchen und Mehrfachwechseln laufen weiter.

## Original-Soll und gemessener Status

Vollständige 2.402 Ergebnisobjekte mit Originaltext, ID, ursprünglichem Soll,
IST, Feedback und UTF-16-Evidenz: [p02b-r4-results.json](p02b-r4-results.json).
`metadata.rawMismatches` enthält alle Abweichungen ohne Auswahl.
Hauptbestand, Systematik, Diagnosen, bekannte Regression, eigene Kurzantworten
und weitere Varianten sind getrennt identifizierbar. Die Anzahl bezeichnet
Auswertungen/Datensätze, keine Zahl unabhängiger neuer Formulierungen.

| R4-Hauptgruppe | Anzahl | IST | ursprüngliches Soll getroffen |
| --- | ---: | --- | ---: |
| kurze richtige Osmosebenennung | 60 | 60 correct | 60 |
| längere richtige Erklärung | 15 | 15 clarify | 0 |
| falsche Osmosebenennung | 20 | 20 incorrect | 20 |
| Teilansatz | 12 | 5 partial, 7 clarify | 5 |
| mehrdeutig | 12 | 12 clarify | 12 |
| Negation/Korrektur gemischt | 20 | 2 incorrect, 18 clarify | 6 |
| fachlich falscher relevanter Zusatz | 10 | 10 clarify | 10 (Soll incorrect oder clarify) |
| fachlich richtiger relevanter Zusatz | 10 | 10 clarify | 0 |
| richtige Tonoplastbenennung | 10 | 10 correct | 10 |
| falsche Tonoplastbenennung | 6 | 3 incorrect, 3 clarify | 3 |
| Tonoplastteilansatz | 4 | 2 partial, 2 clarify | 2 |
| Tonoplastalternative | 4 | 4 clarify | 4 |

R4-Hauptbestand insgesamt **132/183 ursprüngliche Solltreffer, 51 Abweichungen**.
Die 51 bleiben ungelöste Implementierungslücken; keine fachliche Umwertung.
Davon sind 15 längere Erklärungen und zehn richtige Zusätze außerhalb des
implementierten T1-Prüfumfangs. Weitere 26 betreffen Teilansätze, Korrektur-/
Bestätigungssätze und falsch benannte Strukturen. Sie sind keine Freigabe.
Alle 51 sind derzeit `clarify`; die Unit-Tests dokumentieren diesen offenen
Zustand ausdrücklich. Ein bestandener technischer Dokumentationstest bedeutet
für diese Fälle **nicht** „biologisches Soll bestanden“.

Systematik **290/290**, quellmotivierte Diagnosen **32/32** ursprüngliche
Solltreffer, getrennt vom Hauptbestand. Bekannte Regression **958/1.021**
ursprüngliche Solltreffer; die bisherigen **63** Rohabweichungen bleiben einzeln
erhalten. Dazu gehören die bereits dokumentierten nicht erkannten langen bzw.
falschen wissenschaftlichen Erklärungen. Zwei frühere `clarify`-Sollwerte für
falsche Klassifikation des Tonoplasten als Zellmembran-/Zellwand-Art sind
biologisch begründet `incorrect`; das ursprüngliche Soll steht weiterhin daneben.
Es gibt in dieser Bearbeitung keine neue biologische Sollwertadjudikation.

In allen 2.402 geprüften Datensätzen: **kein falsches Grün, kein Rot bei eindeutig
richtigen Antworten** gefunden. Neu gegenüber dem R4-Soll kein Rot statt Klärung;
die zwei genannten älteren Klassifikationsfälle bleiben gesondert ausgewiesen.
Das ist eine begrenzte Befundaussage und kein Fehlerfreiheitsbeweis.

### Quoten und Neuheit

Dieselben R4-Kurzantworten mit identischem review5-Kontext auf cc625 vor der
Änderung: **38/60**, nachher **60/60**. Tonoplast korrekt: **5/10 → 10/10**.
Alle gelben Antworten bleiben im Nenner. Die längeren R4-Antworten bleiben
separat **0/15**, die richtigen relevanten Zusätze **0/10**. Frühere Bestände
behalten ihre dokumentierten Nenner und Ergebnisse in den historischen Berichten.
Keine freie Erklärungs-, Richtungs- oder Volumenkorrektur wurde ergänzt.

Weitere **60 natürliche kurze richtige Antworten** wurden vor der ersten
Auswertung festgelegt, mit 480 vorab bestimmten falschen/teilweisen/alternativen/
negativen/widersprüchlichen/zusätzlichen Varianten. Eingefroren am
`2026-10-23T09:04:54.063Z`, Dateihash
`7e2fab84acb08cc254cb50881e389c33090a4eae28af5d294ad325d4d4411ef1`.
NFC/Kleinschreibung/Satzzeichenabgleich gegen vorhandene Fixtures, QA-, Spec-
und verfügbare Gegenprüf-JSONs: **60 eindeutige Texte, null Überschneidungen**.
Die 21.051 Vergleichszeichenketten enthalten auch Metadaten; das sind keine
21.051 verschiedenen Schülerantworten. Die automatisierte Contentprüfung
wiederholt den Vergleich mit den dauerhaft verfügbaren Repo-Beständen.

Eigene Kurzantworten auf cc625 **26/60**, nachher **60/60**; sämtliche 480
Gegenvarianten treffen ihr vorab festgelegtes Soll. Zusätzlich wurden 336
Tonoplastvarianten aus 48 geeigneten Satzrahmen vor ihrer ersten Auswertung
festgelegt; alle treffen ihr Soll. Diese Varianten sind kein unabhängiger
Neuheitsnachweis. Auch die inzwischen bekannten R4-Fälle liefern **keinen neuen
unabhängigen 95-%-Nachweis**. Eine weitere getrennte frische Gegenprüfung bleibt
zwingend offen.

## Tatsächlich ausgeführte Prüfungen

Linux x86_64, Node 24.19.0, npm 11.9.0, Python 3.12.14,
jsonschema 4.26.0, Chromium 154.0.8037.57. Manifest mit Quellenhashes:
[p02b-r4-review.json](p02b-r4-review.json).

```sh
npm run check:types
npx vitest run tests/unit --outputFile=qa/generated/p02b-r4-existing-unit.json
npx vitest run tests/unit/p02b-r4.test.ts tests/content/p02b-r4.test.ts --outputFile=qa/generated/p02b-r4-focused.json
npm run build
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test tests/browser/p02b-r4.spec.ts tests/browser/p02b-fourth.spec.ts --reporter=list,json
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run check
```

Der abschließende vollständige lokale Lauf besteht:

- **7.454 Unit**, darunter sämtliche 4.988 bestehenden Regressionen;
- **193 Content-/Schematests**, einschließlich 2.402 neuer vollständiger
  Ergebnisobjekte; mit bestehenden Batches 6.489 Schemaauswertungen, teils
  wiederholte Falltexte, keine Behauptung dieser Anzahl verschiedener Antworten;
- TypeScript strict, Katalogabgleich, Produktionsbuild, **25 Buildtests**;
- **63 Chromium-Tests**, Desktop/Tablet/Mobile mit Touch-Emulation, null
  fehlgeschlagen/übersprungen/flaky;
- zusammen **7.735 technische Tests**; die **694 Konzeptprüfungen separat**.

69 unterschiedliche Material-/Kontext-/Versions-/Hilfen-/Eingabeguards wurden
zusätzlich mit dem gelesenen gelieferten R4-Runner tatsächlich ausgeführt:
69 bestanden. Mehrfachausführung wird nicht als neue Guardprüfung gezählt.
Alle **1.727 Osmosefeld-Ergebnisse** aus den 2.402 Datensätzen werden bei der
Übergabe als vollständiger M6.02-Abschluss zurückgewiesen. Nur process/C01
ist implementiert; M6.02 verlangt weiterhin C01/C02/C03.

Der Browser lädt den veröffentlichten Startbildschirm aus dist. Ein getrenntes,
flüchtig gebautes Prüfmodul verwendet die echten src-APIs und den produktiven
Importguard. Pro Profil werden alle 2.402 Ergebnisse vollständig mit Node
verglichen, einschließlich Kontextbindung, Kriterien, Feedback, Farben/Symbolen,
UTF-16-Spannen und Speicherzustand. Null Abweichungen, externe Anfragen oder
Seitenfehler im bestandenen Lauf. Desktop- und Mobile-Screenshots des aktuellen Chromium-Laufs wurden tatsächlich
angesehen: Text/Links lesbar, keine sichtbare horizontale Überlagerung. Dies
prüft keine bisher nicht vorhandene sichtbare Schülerbewertungsoberfläche und
kein echtes iPad.

Geschützt unverändert: **79 Aufgabenidentitäten, 19 Missionsdatensätze und 21
Konzept-/Vertragsdateien**, Aufgaben-/Rubrik-/Inhalts-/Modellversionsbindung,
Wasserpotenzial Vakuole > Cytosol > Außenraum mit Druckbezug und Pa-Einheit,
Hilfe getrennt vom Status. Keine Konzentrationsersatzregel, keine neue
Modellversion, keine Simulation. Abhängigkeiten/Lockdateien unverändert.
Die vier dist-Dateien sind bytegleich mit cc625, drei lokale Assetbezüge unter
`/Lernspiel-Zellbiologie/`. 18 echte negative Runtime-Importbuilds sperren
spec-, Test-, QA- und Reviewdaten. Die genaue aktuelle/historische Allowlistzahl
steht im Veröffentlichungsprotokoll; mit diesem Bericht 184 freigegebene Pfade.
Keine private Klausur/Lehrerpakete verfügbar: die privaten Hash-/Textfenster-
Vergleiche des fremden Berichts wurden hier **nicht** erneut ausgeführt.

Entwicklungsanläufe: Der erste TypeScript-Lauf wies die zunächst zu enge
Testfixture-Typisierung zurück (mitgelieferte rationale/basis-Metadaten).
Der Typ wurde auf den bereits vorhandenen R3-Vertrag erweitert; Texte/Sollwerte
blieben unverändert. Erste Syntaxläufe zeigten weitere harmlose Satzstellungen
und negative Nachstellungen als clarify; alle ursprünglichen Messergebnisse
bleiben lokal in qa/generated erhalten. Nach der begrenzten Syntaxergänzung
wurden neue und alte Regressionen vollständig erneut ausgeführt.

## WebKit, Lastbefund und Plattformentscheidung

Lokaler WebKit-Binärpfad wurde geprüft: Datei fehlt. Kein lokaler WebKit-Lauf
wird als bestanden ausgegeben. Die vollständige tatsächliche Suite läuft auf
macOS im bestehenden CI-Job, mit unverändertem Standard-Tab-Test und strengem
abschließenden JSON-Gate. Der tatsächlich abgeschlossene Lauf ist unten belegt; der abschließende
PR-Head und dessen erneuter Lauf stehen zusätzlich in der PR-Beschreibung.

Der gelieferte unabhängige R4-Erstlauf bleibt **55/60**: drei Fokusfehler plus
zwei 30-Sekunden-Timeouts im Desktop-/Tablet-Test p02b-fourth. Sein unveränderter
Nachlauf **3/3** bleibt separat; keine nachträgliche Verrechnung zu 57/60.
Der frühere CI-Lauf 39924923359 war dagegen 57/60 mit drei Fokusfehlern.
Beides sind frühere fremde Befunde, keine eigenen neuen Prüfergebnisse.

Im eigenen p02b-fourth-/R3-Browsertest werden die bisher zweimal pro Antwort
berechneten identischen Node-Ergebnisse jetzt einmal für beide Paritätsassertions
verwendet. Keine Assertion entfernt, kein Soll geändert, kein Zeitlimit erhöht.
Das ursprüngliche 30-Sekunden-Limit von p02b-fourth bleibt. Neun Anhänge mit
Browser-/Node-und-Assertion-Zeiten machen die Lastbeobachtung nachvollziehbar.
Der vollständige Chromium-Lauf misst für p02b-fourth je Profil etwa 9–13 Sekunden
für Browserauswertung plus Node/Assertions. Das allein erklärt die frühere
macOS-Lastursache nicht abschließend. Die neue 2.402er-Prüfung hat wie die
bestehende größere R3-Prüfung ein eigenes 90-Sekunden-Limit.

**Vorläufige Bedienentscheidung:** Standard-Tab bleibt ein offener Abnahmepunkt.
Keine produktseitige JavaScript-Umleitung der Tab-Taste und kein Umbenennen des
Standardtests zum Option-Tab-Test. Der bereits nachgewiesene macOS-WebKit-Weg
Option-Tab und explizite Linkaktivierung werden separat weiter geprüft und
protokolliert. Für eine endgültige Plattformentscheidung fehlen benannte reale
Safari-/iPad-Geräte mit der jeweiligen Tastaturnavigationseinstellung. Ein
bestandener Option-Tab-Test ersetzt die drei Standardfehler nicht.

Main ist ungeschützt; Ruleset/Deployment-Gates wurden nicht administrativ geändert.
Der vorhandene Vorschlag verlangt nur build, WebKit ist nur bei PR aktiv und das
main-Deployment hängt nur an build. Vorschlag zur späteren Entscheidung:
WebKit als Pflichtcheck und als Deployment-Voraussetzung vorsehen. **Nicht aktiv.**

## Reviewbare Eingabealternative, kein beschlossener Produktwechsel

Die folgenden Präzisierungen von `naming-input/0.1-draft` sind als
**`naming-input/0.2-draft` ausschließlich eine Entscheidungsvorlage** gedacht,
wenn eine neue unabhängige Sprachprüfung das Ziel erneut verfehlt.
Keine Umsetzung und kein stiller Wechsel der ursprünglichen 95-%-Abnahme.

Dokumentarischer Datenvertragsentwurf:

```ts
type NamingSubmissionDraft = Readonly<{
  formatVersion: 'naming-input/0.2-draft';
  taskId: 'Z1.02' | 'M6.02';
  fieldId: 'term' | 'process'; // Zuordnung strikt nach taskId validieren.
  contextHash: string;       // vollständiger bestehender P01b-Kontext.
  attemptId: string;
  termText: string;
  additionalStatements: readonly string[];
  action: Readonly<{ kind: 'initial' }> | Readonly<{
    kind: 'replace'; previousAttemptId: string; previousContextHash: string;
  }>;
}>;
```

Schülerwortlaut: „Trage den Namen in das Begriffsfeld ein. Weitere Aussagen kannst
du darunter schreiben. Geprüft wird hier die Benennung. Zusätzliche Aussagen sind
noch nicht bewertet.“ Sichtbar bleiben Begriff, Zusätze und geprüfter Umfang;
bei ungeprüften Zusätzen kein grünes Gesamturteil. „Vorigen Versuch korrigieren“
erzeugt einen neuen Versuch mit explizitem Bezug; kein automatisches stilles
Zurücknehmen wissenschaftlicher Aussagen im alten Text.

Migration: Alte Antworttexte/Ergebnisse bleiben in ihrem bisherigen Vertrag;
keine automatische Begriffsextraktion, keine rückwirkend grüne Bewertung und
keine dauerhafte Speicherung alter Rohtexte. Nach fachlichem Beschluss müssen
Aufgaben-/Rubrik-/Inhaltsversionen ausdrücklich neu gebunden werden; das ist keine
neue biologische Modellversion. Für einen Ersatzversuch muss der vorherige
Kontextbezug geprüft werden; ein alter Kontext macht das Ergebnis ungültig.
Die Originalaufgabe, ihr Erwartungshorizont und bestehende Fortschrittsdaten
werden bis zu einer ausdrücklich spezifizierten Migration nicht umgeschrieben.

Neue Abnahme vor einer solchen Umsetzung: fachliche Entscheidung über Wortlaut
und tatsächlich geprüften Umfang; neue versionierte Verträge und Migrationstests;
frischer getrennter Bestand mit mindestens 60 natürlichen vollständigen
Benennungen, mindestens 95 % und keinen kritischen Fehlfarben; Negation,
Synonyme, falsche Begriffe, konkurrierende Begriffe und Zusätze; sichtbare
Korrekturhandlung und Kontextwechsel; vollständige Regression beider Felder,
Datenschutz und reale Geräte. Alte offene Fälle/Nenner bleiben unverändert
sichtbar; eine Formatänderung darf keine nachträgliche Freigabe erzeugen.

Frische unabhängige Gegenprüfung, reale Safari-/iPad-Probe, repräsentative
Schülerformulierungen und fachliche Freigabe bleiben offen. P02b bleibt gesperrt.

### Tatsächlicher CI-Nachweis des Implementierungscommits

[Actions 39931049217](https://github.com/Feerson1617/Lernspiel-Zellbiologie/actions/runs/39931049217)
auf exakt `52d60759d9acff7ae5480bb93a94aeed2a28ee79`: `build success`,
`webkit failure`, `deploy skipped`, **Gesamtworkflow failure**. Tatsächliche
Job-/Schrittergebnisse und sämtliche Check-Run-Annotationen wurden abgerufen;
kein Lesen nicht verfügbarer vollständiger Joblogs wird behauptet.

macOS arm64, Node 24.19.0, WebKit 27.2: Baseline **45/48**, zusätzliche Suite
**15/15**, zusammen **60/63**, drei fehlgeschlagen, null übersprungen/flaky.
Alle drei Fehler betreffen unverändert `start.spec.ts`, Standard-Tab-Fokus auf
Desktop/Tablet/Mobile. In allen drei Plattformproben bleibt Tab bei BODY,
Option-Tab erreicht den Link „Zum Inhalt“; explizit fokussierte Links sind
aktivierbar. Der strenge abschließende Gate-Schritt schlägt tatsächlich fehl.

p02b-fourth besteht in allen Profilen bei unverändertem 30-Sekunden-Limit.
Browserauswertung plus Node/Assertions: Desktop **17,14 s**, Tablet **15,57 s**,
Mobile **15,46 s**. Die Lastschwelle wird hier eingehalten; das beweist keine
abschließende Ursachenanalyse des früheren fremden Erstlaufs. R3- und R4-Batches
bestehen ebenfalls, R4 etwa 49–58 s pro Profil bei dem ausgewiesenen 90-s-Limit.
Die neuen Zeitmessungen stehen vollständig im Rohbericht und Manifest.

Nach den Berichtsänderungen wurden sämtliche 193 Content-/Schematests nochmals
tatsächlich ausgeführt: 193 bestanden. Veröffentlichungsschutz danach ebenfalls
bestanden. Manifestzählung: 7.735 lokale technische Erfolge + 60 WebKit-Erfolge,
drei WebKit-Fehler; CI-Wiederholungen des Builds werden nicht zusätzlich gezählt.
694 Konzeptprüfungen und 69 Guards bleiben separat. Eine grüne technische
Teilprüfung ändert den Freigabestatus nicht.
