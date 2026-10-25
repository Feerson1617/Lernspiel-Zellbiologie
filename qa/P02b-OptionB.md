# P02b – genehmigter Fachbegriff-Vertrag 1.0.0

Stand: 24.10.2026, Europe/Berlin. **Codex-Selbstprüfung, keine unabhängige
Gegenprüfung und keine Unterrichtsfreigabe.** PR #6 bleibt offen; kein Merge,
Deployment, P02c, vollständiger P03-Pfad oder Modell-/Simulationsausbau.

## Auftrag, Quellen und vorab festgelegte Grenze

Der neu abgesandte überarbeitete Option-B-Auftrag genehmigt ausdrücklich den
Format-/Rückmeldewechsel nur für Z1.02/term und M6.02/process sowie die isolierte
Bedienprobe. R8-Prüfbericht/ZIP sind Fremdnachweise; deren Ausführung wird nicht
als eigene Prüfung ausgegeben. Inventar und alle 70 SHA256-Einträge des gelieferten
R8-Pakets wurden geprüft. Übernommen wurden ausschließlich die synthetischen
Legacy-Eingaben mit ursprünglichen IDs/Sollwerten; keine Quellen-ZIP/Prüfvorlage.

Arbeitsgrundlagen: AGENTS, 00_START_HIER, A–F einschließlich vollständigem
Aufgabenkatalog; technische Kontext-/Ergebnis-/Fortschrittsverträge; beide
Aufgaben, Text-Rubriken/Redaktionsreferenzen; vorherige Eingabeentscheidungen;
R8-Bericht, echte Treiber/Korpus-/Ergebnisdateien und Paketmanifest.
Private Originalklausur/Erwartungshorizont sind hier nicht zugänglich.

Vor erster neuer Auswertung eingefroren: [normativer Vertrag](../review/naming-input-1.0.0.md),
[260 Sollfälle](../tests/fixtures/naming-v1-cases.json),
[Zustands-/Bedienmatrix](../tests/fixtures/naming-v1-scenarios.json).
Zeit/Hashes stehen in [naming-v1-freeze.json](naming-v1-freeze.json):
24.10.2026, 09:49:43 Europe/Berlin (07:49:43 UTC), vor Implementierung.
Die fachliche Frage und sämtliche Pflichtkriterien bleiben unverändert.
21 geschützte Konzept-/Spec-Dateien sind weiterhin bytegleich.

## Implementierte Trennung

| Bereich | Dateien und Verantwortung |
| --- | --- |
| Vertrag | `src/domain/naming-contract.ts`, `contracts/naming-v1.schema.json`: geschlossene Zielpaar-Union, Einreichung, immutable Ergebnisumschlag, Scope, tatsächliche Hilfeherkunft |
| Fachregeln | `src/assessment/naming-profiles.ts`, `naming-v1.ts`: endliche Begriffstabelle, konservative Orthografie, gesamte Feldprüfung ohne Satzextraktion |
| Feedback | `src/assessment/naming-feedback.ts`: Erkanntes, konkreter Unterschied, nächster Schritt, getrennte Hinweise/Wortbank/Lösung je Fachprofil |
| Versuche | `src/application/naming-session.ts`: eigene Revisions-/Vorgänger-/Ausstellerhistorie, Hilfeereignisse, idempotente Abgabe, vollständige Gesamtprüfung vor Acht-Felder-Beleg |
| Darstellung | `src/ui/naming-lab.ts`: echtes DOM, Originalfrage/Material, statisches Schema, selbst bedienbare Feedback-/Hilfekette; gemeinsame Statusdarstellung |
| Schutz/Regression | neue Unit-, Content-/Schema-, Browser- und Build-Tests; R8-Input-/Vollergebnishashes; separates rotes Legacy-Gate; eng ergänzte Allowlist |

Versionslabels und exakte Grammatik/Statusmatrix stehen im normativen Vertrag.
`modelVersion` bleibt explizit übergeben; `review-no-simulation` ist nur das
bestehende technische Testlabel. Kein neues biologisches Modell wird behauptet.
`EvaluationResult`, TaskContext und Fortschrittsschema 1 bleiben unverändert.

Vor der Eingabe sichtbar: **„Fachbegriff: Ein Begriff genügt. Du musst keinen
Satz schreiben.“** Mehrwortbegriffe sind möglich. Weitere Aussagen sind vor
Benutzung als ungeprüft gekennzeichnet. Es wird kein Wort aus einem Satz
herausgeschnitten, kein unbekannter Rest überlesen und keine Löschung richtiger
Gedanken für Grün verlangt. Fachliche Unsicherheit allein ist kein Fehler.

`termResult` kann nur das jeweilige C01 bestätigen. Ungeprüfte relevante Zusätze
bleiben mit unveränderten Belegen `not_assessed` und verhindern auch bei Z1.02
ein grünes Gesamturteil. Sicher falsche Benennung bleibt trotz richtig klingendem
Zusatz rot. M6.02 bleibt insgesamt offen/partial, C02/C03 sind nicht bewertet.
Der alte Adapter lehnt neue Aufgabenversionslabels ab. Nur der ganze aktuelle,
von derselben RAM-Sitzung ausgestellte Umschlag darf Fortschritt übergeben.

## Konkretes Lernen, Hilfe und Datenschutz

Die Feedback-Matrix steht im Vertrag, die vollständigen echten Texte im getrennten
Fachprofil und in den Rohresultaten. Beispiele ohne vorzeitige Lösung:

- Zellwand: feste äußere Hülle erkannt; gefragt ist die innere Membrangrenze um
  den Vakuolenraum → Grenzen im Schema vergleichen und selbst neu benennen.
- Zellmembran: äußere Protoplastgrenze erkannt; Unterschied zur inneren Grenze
  Vakuolenraum–Cytosol → umschlossenen Raum verfolgen.
- Kernhülle: Kernbezug erkannt; falscher umschlossener Raum → Räume unterscheiden.
- Membran: richtige Strukturebene; spezifischer Name fehlt → selbst präzisieren.
- Diffusion: zutreffender übergeordneter Ansatz; spezieller selektiver
  Wassertransport noch nicht benannt → speziellen Vorgang suchen.
- Plasmolyse: Zellreaktion erkannt; Unterschied zum Transportmechanismus →
  Mechanismus und sichtbare Folge trennen.
- Aktiv/Endo-/Exocytose: konkrete Energie-/Vesikelbedeutung erkannt; passt nicht
  zum angegebenen passiven Wasserübertritt → Bedeutung mit Material vergleichen.

Grün für Osmose bestätigt ausdrücklich nur C01. Jeder Status trägt Farbe,
Symbol und Text. Unbekannte Satzreste erhalten einen klaren Umfangshinweis und
eine Selbstüberarbeitungsmöglichkeit, keine erfundene biologische Fehlvorstellung.

Zuerst Selbstüberarbeitung, dann ausdrücklich aufgerufener Hinweis, Wortbank,
Auswahlklärung und Lösung. `independent`, `hint`, `wordbank`, `clarified` und
`solution_viewed` stammen aus echten Ereignissen; auch falsche Antworten können
unterstützt sein. Frühere Versuche bleiben unverändert, Vorgänger und ursprünglicher
Kontext sind sichtbar. Abschreiben nach Lösung oder Kontextwechsel derselben
Instanz hebt die Hilfe nicht auf. Ein neuer eigenständiger Fall braucht andere
Instanz, anderen Seed UND tatsächlich anderes Material; kein Kompetenzzertifikat.

Rohtexte, Belege, Hilfeereignisse und Vorgänger bleiben nur RAM. Persistiert werden
weiter ausschließlich acht Metadatenfelder pro Versuch. Geladene Metadaten stellen
kein Kontextvertrauen wieder her. Nach Reload/Zurück ohne belegte RAM-Historie
kein neuer Erfolgsnachweis für den alten Fall; frühere Hilfe wird nicht erfunden
und Eigenständigkeit nicht behauptet. Eine spätere Produktnavigation muss das
explizite Herkunftssignal `resumed` zuverlässig liefern. Eine leere Datenablage
beweist nach Browserneustart keine Eigenständigkeit. Speicherfehler bleiben
sichtbar, aktuelle RAM-Arbeit und fremde Browserdaten erhalten.

## Tatsächliche eigene Prüfungen

Vollständige lokale Prüfkette für Fach-/Sitzungskern:
`fbe83f568c275a240e43f3f3c84fb5c5ab6e5f1a`.
Anschließender reiner UI-/Bedienregressionsstand:
`155fd095be3f8b93c9d0152067edb8084a20e67b` (46 Build- und 18 DOM-Tests erneut
bestanden). Der nachfolgende Abgabecommit ergänzt nur QA-Daten/Dokumentation.
Vollständige Quellhashes, Umgebung und Ausführungszeit stehen in den Rohberichten
und im [Testmanifest](naming-v1-review.json). Der PR-Head und sein tatsächlicher
CI-Status werden zusätzlich im PR-Text ausgewiesen; GITHUB_SHA eines PR-Laufs
kann der synthetische Merge-Commit sein und wird getrennt vom PR-Head protokolliert.

| Prüfung | Tatsächlicher Befund |
| --- | --- |
| TypeScript strict | bestanden |
| gesamte Unit-Suite | 17.222 bestanden, 0 fehlgeschlagen/übersprungen |
| gesamte aktive Content-Suite | 209 bestanden, 0 fehlgeschlagen/übersprungen |
| Produktionsbuild + Build-Tests | 46 bestanden; vier dist-Dateien, drei lokale Referenzen, Pages-Basis `/Lernspiel-Zellbiologie/` |
| Chromium-Gesamtlauf | 120 bestanden, 0 fehlgeschlagen/übersprungen; nach letztem UI-Detail zusätzlich alle 18 Bedienproben bestanden |
| Konzeptprüfung, getrennt von Anwendung | 694 bestanden, 0 fehlgeschlagen; 79 Aufgaben, 19 Missionsdatensätze, 219 Kriterien, 137 redaktionelle Referenzen |
| eigene neue Matrix | alle 260 Pflichtstatus-/Scopefälle stimmen; keine kritische Fehlfarbe in diesem Bestand |
| endliche Syntaxkonfigurationen | 109.980 Artikel-/Hüllen-/Interpunktions-/Unsicherheitskonfigurationen, alle definierten Konzepte; keine unabhängigen Schülerformulierungen |
| eigenes Schema-Replay | 4.106 Objekte: 260 neue Umschläge, 260 eingebettete Ergebnisse, 3.586 R8-Legacy-Ergebnisse; 0 Schemafehler |
| Legacy-95-%-Lauf | tatsächlich Exit 1: vier fehlgeschlagene Gates, kein Skip/xfail |
| WebKit lokal | Start versucht; Binärdatei fehlt. Kein lokaler WebKit-Bestand als bestanden ausgegeben |
| macOS-WebKit | tatsächlicher Head-Lauf separat auf GitHub; Status/Counts im PR und CI-Protokoll, nicht aus Chromium abgeleitet |

Neue Quoten, einschließlich ALLER vorab als vollständige Eingaben definierten
Fälle und der Fälle mit separaten Zusätzen:

| Feld | gesamte Matrix | vollständige Eingaben | correct | clarify im Nenner | Quote |
| --- | ---: | ---: | ---: | ---: | ---: |
| Z1.02/term | 132 | 78 | 78 | 0 | 100 % |
| M6.02/process | 128 | 74 | 74 | 0 | 100 % |

Z1-Feldstatus: correct 78, incorrect 18, partial 8, clarify 22, empty 2,
technical 4. Z1-Gesamtstatus: correct 75, incorrect 18, partial 8, clarify 25,
empty 2, technical 4. M6-Feldstatus: correct 74, incorrect 15, partial 10,
clarify 23, empty 2, technical 4. M6-Gesamtstatus: **kein correct**, partial 81,
incorrect 15, clarify 26, empty 2, technical 4. Keine Pflichtabweichung und keine
kritische Fehlfarbe in der fixierten Matrix. Das ist ein endlicher eigener
Nachweis des vereinbarten Umfangs, keine Erkennungsrate für unbekannte Sätze
oder echte Schülerhäufigkeiten und keine unabhängige Abnahme.

Vollständige Eingaben/Originalbelege/echte Texte/Ergebnisobjekte:
[neue Rohbefunde](naming-v1-results.json), [eigener R8-Replay](p02b-r8-results.json).
Die regulären Content-Schemaregessionen bleiben zusätzlich aktiv; wiederholte
Objekte sind keine neuen unabhängigen Fälle.

## Legacy, tatsächliche Fehler und Grenzen

R2–R8, alte Referenzen und alte Sollwerte bleiben unverändert. Sämtliche 3.586
R8-Ergebnis-/Feedbackobjekte entsprechen den gelieferten Vollobjekt-Hashes.
IDs, Texte und ursprüngliche Sollwerte sind zusätzlich gegen aus den gelieferten
Originaldaten gebildete Eingabehashes geprüft. 199 Hauptfälle + 370 systematische
Fälle + 3.017 bekannte Wiederholungen sind kein neuer unabhängiger Holdout.

| alter Satzvertrag | correct / vollständiger ursprünglicher Nenner | 95-%-Gate |
| --- | ---: | --- |
| eigene alte 60er-Probe R6 | 56/60 | rot |
| R7-Kurzfälle | 41/60 | rot |
| R8-Osmosekurzfälle | 26/60 | rot |
| R8-Tonoplastkurzfälle | 9/20 | rot |

Die R6/R7-Assert-Körper wurden bytegleich verschoben, mit
[SHA-Nachweis](legacy-gate-transfer.json) und tatsächlicher Ausführung.
`.github/workflows/legacy.yml` bleibt wirklich fehlgeschlagen; kein
continue-on-error, Skip oder xfail. `build`/`webkit` prüfen strikt den ausdrücklich
genehmigten neuen Umfang und alle aktiven Fach-/Sicherheitsregressionen. Ein
grünes neues Gate macht den alten Satzvertrag nicht nachträglich erfolgreich;
ein PR mit rotem Legacy-Workflow hat keinen pauschal grünen CI-Gesamtstatus.

Tatsächliche Erstfehler und Reparaturen, Rohlogs bleiben erhalten:

1. Erste neue Eigenprüfung: 276 bestanden, zwei Prüfprobleme. Ein Konfigurations-
   Zähler erwartete mehr Kombinationen als erzeugt; die vorgesehenen Unsicherheits-
   marker wurden ergänzt. Der neue R8-Sammeltest überschritt das Standardlimit;
   echte Batches bis 900 ersetzen den Sammeltest, ohne Sollwert-/Timeoutänderung.
2. Direkter Node-Berichtslauf scheiterte an nicht löschbarer TS-Parameter-Property.
   Neue Fehlerklasse nutzt löschbare TS-Syntax; unnötiger Import des großen
   alten Testhelfers entfiel. Bericht danach tatsächlich ausführbar.
3. Erster Build-Negativtest: 45 bestanden, einer scheiterte am absichtlich
   ungültigen Unicode-Testdatum schon im JSON-Loader. Der Rohtextimport prüft
   nun tatsächlich die Produktions-Importsperre. Freeze-Daten blieben unverändert.
4. Erster vollständiger Browserlauf: 118 bestanden, zwei Mobilfehler wegen
   Kontext-Hash-Überlauf. Echter Textumbruch repariert die Darstellung, ohne
   Inhalt zu verbergen. Gezielte sechs Mobiltests und anschließend 120/120 grün.
5. Zusätzliche Quellprüfung reproduzierte zwei Buchungen derselben Revision
   durch nachträglich veränderte Caller-Konfiguration. Konfiguration wird nun
   ebenfalls kopiert/geschlossen/eingefroren; Regression und Vorher-/Nachher-
   Nachweis sichern gleiche Ergebnis-/Belegidentität. Danach 284 gezielte
   Unit-/Contenttests, 46 Build-Tests und 18 DOM-Tests bestanden; gesamte Kette
   am oben genannten Fach-/Sitzungsstand erneut ausgeführt.
6. Letzte UI-Abgrenzung: Ein wirklich neuer Fall beginnt leer; vorherige Texte
   bleiben unverändert als RAM-Sitzungsnotiz. Ohne neue Eingabe gibt es nur
   empty, keinen automatisch übernommenen Erfolg. Unbekannte Hilfen werden
   auch im historischen Verlauf nicht als „ohne Hilfe“ ausgegeben. Die 46
   Build- und 18 DOM-Prüfungen bestanden danach erneut. Der vollständige End-Head-
   CI-Lauf wird gesondert im PR protokolliert.

Mac-WebKit-Tab: Der belegte Plattformfehler wird im ursprünglichen Navigationstest
semantisch repariert: Option-Tab → tatsächlicher Linkfokus → Enter → Inhalt →
weiterer Link. Keine direkte Fokuszuweisung ersetzt diesen Weg. Separate Tests
zeichnen weiterhin Standard-Tab und Option-Tab auf. Tatsächlicher macOS-Lauf ist
gesondert nachzuweisen; frühere drei Fehler bleiben historische Befunde.

## Didaktische Entscheidung und offene Abnahme

| Kriterium | alter begrenzter Satzkorrektor | ausdrücklich kommuniziertes Begriffsfeld |
| --- | --- | --- |
| biologische Korrektheit | Umfang sprachlicher Behauptungen wächst; alte Gates deutlich verfehlt | unverändertes C01 mit endlicher Benennung und sichtbarer Scope-Grenze |
| Bedienbarkeit/Motivation | Lernende müssen unter Umständen Satzrahmen erraten | ein Begriff genügt, eigene Überarbeitung zuerst, zusätzliche Gedanken bleiben erhalten |
| Fehlertoleranz | neue Satzmuster erzeugen neue Wechselwirkungen | konservative Schreibregeln, harmlose Unsicherheit, bekannte Gegenbegriffe vor Ähnlichkeit; unbekannte Sprache bleibt unklar |
| Testbarkeit | Regression beweist keine Zuverlässigkeit unbekannter Sätze | endliches Vokabular weitgehend exhaustiv prüfbar; neue unabhängige Gegenfälle trotzdem nötig |
| Wartbarkeit | weitere Spezialmuster begünstigen Überanpassung | kleine gemeinsame Grammatik, getrennte Fach-/Feedbackprofile, keine unbegrenzte Parserfortsetzung |

Der Wechsel schwächt keine Aufgabe oder Rubrik ab. M6 bleibt unvollständig.
Noch offen: **neue vorher fixierte unabhängige Gegenfälle**, reale Safari-/iPad-
Geräte mit Bildschirmtastatur/Rotation, Lerngruppenpassung und private
Originalquellen-Gegenprüfung. Eigene Tests schließen diese Punkte nicht.
Kein Nachweis absoluter Fehlerfreiheit oder allgemeiner Freitextkompetenz.

Veröffentlichungsschutz: Allowlist prüft Arbeitsbaum und alle Git-Referenzhistorien,
21 geschützte Dateien, vier dist-Dateien und lokale Assetpfade. Neue echte
Negativ-Builds sperren Fixtures/Vertrag/QA sowie die interne UI selbst. Kein
Runtimeimport redaktioneller Daten, keine privaten Originale übertragen. Ohne
private Quellen ist eine eigene Volltext-/Hash-Gegenprüfung gegen diese nicht
möglich; der fremde R8-Datenschutzbericht wird dafür nicht vereinnahmt.

Main-Schutz und Deployment erst nach build **und** webkit bleiben ein
dokumentierter Vorschlag. Keine GitHub-Administration verändert, aktive
Deployment-Abhängigkeit weiterhin nur build; PR-Läufe veröffentlichen keine Site.
Die Testansicht wird ausschließlich durch den lokalen Playwright-Harness bedient,
nicht durch einen öffentlichen Vite-/Pages-Pfad. Reproduktion und API:
[`src/assessment/NAMING.md`](../src/assessment/NAMING.md).
