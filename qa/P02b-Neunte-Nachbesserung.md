# P02b – neunte Nachbesserung / R7

**Selbstprüfung. NICHT MERGE. Kein Deployment, P02c oder Unterrichtseinsatz.**

Geprüfter Test-/Entscheidungskommit: `0145ac2268428422ea82fd90b4838b41e2d8543e`.
Ausgang und unabhängig geprüfter PR-Head:
`8258b6dc3c8f1724a9fb1e7c72746100dc542f2b`; main unverändert
`b155936443745d98c8133788872c9c5ff44d7fb2`. Produktive Runtime weiterhin wie
Implementierung `3194330eb0d92f3edea5b8c3915087d9667bf6b5`.
Nachfolgende Berichtskommitts ändern keine Runtime oder Tests. Der exakte
abschließende Head und seine tatsächlich abgeschlossenen CI-Ergebnisse stehen
in der aktualisierten Beschreibung von [PR #6](https://github.com/Feerson1617/Lernspiel-Zellbiologie/pull/6).

## Auftrag und Grenze

R7 verlangt bekannte Regression, eine kurze fachliche Entscheidungsvorlage und
erneute tatsächliche technische Prüfung. **Keine weiteren Satzmuster** für die
vier eigenen R6- oder die 19 R7-Sprachlücken. Kein neuer Eingabevertrag wurde
implementiert. Produktcode unter src, geschützte Spezifikationen, Originalfragen,
Rubriken, Aufgaben-/Feld-/Ergebnis-/Fortschrittsverträge, Abhängigkeiten und der
aktive Pages-Workflow sind gegenüber 8258b6d unverändert.

Die Prüfentscheidung „B: nicht freigegeben“ ist keine Genehmigung der Eingabeoption
b. Ein ausdrücklicher fachlicher Formatbeschluss oder Umsetzungsauftrag liegt
nicht vor. Alle heutigen Nenner und die 95-%-Schwelle bleiben verbindlich.

Grundlage: AGENTS, C insbesondere Benennung/Kriterien/95-%-Maßstab, D/P02,
F/Z1.02 und M6.02, unveränderte Aufgaben-/Rubrik-/Kontext-/Ergebnis-/
Fortschrittsverträge sowie R7-Prüfbericht, Folgeauftrag und Prüfdaten. Kein neuer
externer Quellenabgleich oder Zugriff auf private Unterrichtsoriginale behauptet.
74 Dateihashes des außerhalb des Git-Checkouts entpackten Archivs geprüft.
Nur beauftragte synthetische Fälle und bereits dokumentierte Adjudikationen
übernommen; keine ZIP-Datei, fremden Prüfscripte, Logs, Screenshots oder privaten
Originale veröffentlicht. Gelieferte unabhängige Befunde bleiben Fremdbefunde;
unsere erneuten Läufe sind Selbstprüfungen, keine neue unabhängige Gegenprüfung.

## Getrennte Bestände und unveränderte Originale

`tests/fixtures/p02b-r7-cases.ts` erhält alle IDs, Texte, ursprünglichen Sollwerte
und optionalen rationale-/basis-Metadaten. Die vier kanonischen Eingabehashes
werden geprüft. Alle vollständigen neu ausgeführten Ergebnisobjekte einschließlich
Kontext-Hash, Feedback und Originalevidenz reproduzieren zudem die vier gelieferten
Ergebnis-Hashes. Diese technische Momentaufnahme ist keine fachliche Sollfreigabe.
Die Originalhashes stehen unverändert in Fixture und Rohbericht.

| R7-Bestand | Datensätze | Ursprüngliches Soll getroffen | Abweichungen |
| --- | ---: | ---: | ---: |
| Hauptprobe | 183 | 120 | 63 |
| Systematik | 290 | 240 | 50 |
| Höflichkeits-/Gegenfalldiagnosen | 24 | 24 | 0 |
| Bekannte Fälle | 2.520 | 2.315 | 205 |
| Summe wiederholter Datensätze | 3.017 | 2.699 | 318 |

Die Systematik überschneidet sich in 13 normalisierten Texten mit der Hauptprobe:
**277 zusätzlich eindeutige systematische Formulierungen**, nicht 290 zusätzliche
unabhängige Antworten. Beide Gruppen sind intern ohne normalisierte Dubletten;
alle 3.017 IDs bleiben eindeutig. Kein Datensatz wird wegen der Überschneidung
entfernt. Bekannte Gruppe: 2.023 frühere + 183 R6-Hauptfälle + 290 R6-Systematik
+ 24 R6-Diagnosen. Die Summe bezeichnet keine einzigartigen neuen Schülerantworten.

Die nun importierten R7-Fälle sind bekannte Regression. Der gelieferte unabhängige
Freeze liegt bei `2026-10-23T15:50:40.297957+00:00` (17:50:40 Europe/Berlin).
Dessen Neuheits-/Vorhervergleich wird nicht als hier erneut ausgeführte
unabhängige Prüfung ausgegeben. Auf exakt denselben R7-Kurzantworten meldet der
Fremdbericht 38/60 auf 7ca29bd und 41/60 auf 8258b6d. Hier wird letzteres mit
unverändertem Produktcode reproduziert. Die anderen R6-Kurzantworten 60/60
bleiben bekannte Regression und sind kein neuer Erkennungsnachweis.

## Fehlende sprachliche Abdeckung bleibt ein Freigabemangel

- R7: **41/60 = 68,33 %**, 19 clarify, kein incorrect bei diesen kurzen richtigen
  Antworten. Erforderlich unverändert mindestens 57/60. Alle 19 gelben bleiben
  im Nenner und erhalten keine neuen Spezialmuster.
- Bestehende eigene R6-Stichprobe: **56/60 = 93,33 %**, vier clarify. Fixture,
  eingefrorener Hash und das echte bisherige Contentgate bleiben unverändert.
- Die gleiche bestehende 95-%-Anforderung wird zusätzlich auf R7 geprüft.
  Dieses weitere echte Gate scheitert ebenfalls. Kein Entfernen, Skip, xfail,
  Absenken oder nachträgliches Einengen der alten Eingabe-/Erfolgsdefinition.
- R7 längere richtige Antworten: **0/15**, eigener Nenner. Zehn richtige
  relevante Zusätze bleiben ebenfalls clarify. Das ist ungeprüft und keine
  fachliche Zurückweisung der Lernenden; es erfüllt das vereinbarte Ziel nicht.

Die 63 Hauptabweichungen bestehen aus 19 kurzen und 15 längeren richtigen
Antworten, sechs Teilansätzen, elf Negations-/Korrekturfällen, zehn richtigen
Zusätzen und zwei Tonoplast-Teilansätzen. Alle 20 falschen Osmosenamen sowie
zehn richtige und sechs falsche Tonoplastnamen treffen ihr ursprüngliches Soll.
Unbekannte falsche Zusätze bleiben konservativ clarify; kein ungeprüftes Grün.

`expectedRuntime` und historische accepted-Mengen kennzeichnen gemessene Lücken,
keine nachträglich angepassten biologischen Sollwerte. Die 113 neuen R7-Lücken
(63 Haupt-, 50 Systematikfälle) bleiben mit Original-Soll/IST sichtbar.
Beide roten Qualitätsgates verhindern, dass technische Zustandskontrollen als
fachliche Abnahme gelesen werden. Sämtliche 318 Rohabweichungen stehen vollständig
in `qa/p02b-r7-results.json`, nicht nur die günstigsten Fallgruppen.

Die ursprünglichen zwölf Wiederholungsfälle bestehen 12/12, die 24 neuen
Höflichkeits-/Gegenfalldiagnosen 24/24. Namenswiederholung, echte Synonyme,
Fragepaar-Symmetrie, Korrektur und getrennte falsche Fachbehauptung bleiben durch
die unveränderte Runtime und vollständige frühere Regression erhalten.
Drei alte Tonoplast-Adjudikationen bleiben biologisch begründet rot neben ihrem
ursprünglichen clarify-Soll: Form der äußeren Zellmembran, Art der Zellwand und
Name der Kernhülle. Keine neue Adjudikation oder Rubrikänderung. Alle drei
Rohabweichungen sind weiter in den 205 bekannten enthalten.

In den 3.017 erneuten Bewertungen kein falsches Grün und kein Rot bei eindeutig
richtigen Antworten gefunden. Das ist kein Nachweis allgemeiner Sprachsicherheit,
repräsentativer Schülererkennung oder absoluter Fehlerfreiheit.

## Tatsächlich ausgeführte Prüfungen

Linux x86_64, Node 24.19.0/npm 11.9.0, Python 3.12.14/jsonschema 4.26.0;
Chromium 154.0.8037.57. Manifest: `qa/p02b-r7-review.json`.

| Prüfung | Ergebnis |
| --- | --- |
| TypeScript strict | bestanden |
| Konzeptprüfung über npm run check | 694 bestanden; separat von Anwendungstests |
| vollständige Unit-Suite | 16.945 bestanden |
| vollständige Content-Suite | 202 bestanden, zwei 95-%-Gates fehlgeschlagen |
| Ergebnis-Schema innerhalb Content | 15.909 wiederholte tatsächliche Ergebnisvalidierungen bestanden |
| separat npm run test:build | TypeScript, Katalog, Produktionsbuild, Veröffentlichungsschutz und 39 Buildtests bestanden |
| separat vollständiges Playwright/Chromium | 90 bestanden, keine Fehler/Skips/Flaky-Tests |
| gelieferte Material-/Versions-/Kontext-/Eingabe-/Hilfenguards erneut ausgeführt | 69/69, separat und als Selbstprüfung |

Lokale Standardsumme: **17.276 bestanden, zwei fehlgeschlagen, null übersprungen**.
`npm run check` endet mit Exit 1 bei Content und erreicht selbst Build/Browser
nicht. Beide späteren Stufen wurden anschließend vollständig separat ausgeführt.
Kein grüner Gesamtcheck behauptet; Konzept und 69 Schutzprüfungen nicht in die
technische Standardsumme eingerechnet. Es gibt keinen neuen Autoren-Sprachbestand.

3017 R7-Ergebnisse werden pro Chromiumprofil über echte gebündelte src-APIs
in vier Chargen geprüft (900/900/900/317), vollständig gegen Node verglichen,
mit Kontext, Originalspannen, Kriterien, Feedback, Statussymbol/-text/-farbe,
keinen externen Anfragen, keiner Markupausführung und unverändertem fremden
Speichereintrag. Alle zwölf R7-Chargen und sämtliche alten Browsertests laufen.
Keine bestehenden Tests entfernt oder Zeitlimits erhöht. 36 lokale
Browser-/Node-Zeitaufzeichnungen einschließlich zwölf R7-Chargen im Rohbericht.
Startseite und Ladepfade unter /Lernspiel-Zellbiologie/ tatsächlich geprüft;
eine sichtbare Aufgaben-/Bewertungsoberfläche existiert nicht und wird nicht
als getesteter Nutzerfluss ausgegeben.

Alle 2.330 Osmosefeldbefunde des R7-Bestands werden als M6.02-Gesamtabschluss
zurückgewiesen. process bleibt C01, C02/C03 offen. Materialbindung bleibt die
intakte Zwiebelzelle in früher Wasserverlustphase, beide Membranen permeabel,
Saccharose weitgehend zurückgehalten, Zusatztransporte ausgeschlossen,
ΨVakuole > ΨCytosol > ΨAußenraum in Pa einschließlich Druck. Versionen, Instanz,
Seed, Phase, Material und Hash bleiben gebunden. Fünf Hilfearten und reine
Metadatenspeicherung werden durch unveränderte bisherige Tests regressiert.
Keine Rohtexte/Evidenzen persistiert, keine neue Speicher- oder Fachfunktion.

Vorbereitender Importcheck schlug zunächst fehl, weil optionale rationale-/basis-
Felder im Vergleich fehlten; ein folgender Fixtureimport scheiterte entsprechend
vor Ausführung. Importer korrigiert, alle Eingabefelder erhalten. Danach stimmen
alle vier Eingabe- und vollständigen Ergebnishashes, 3.022 neue Unitkontrollen
und die gesamte Regression. Keine Änderung an Originaltexten oder Sollwerten.

## Veröffentlichung, CI und Grenzen

79 Aufgaben-IDs, 19 Missionsdatensätze und 21 geschützte Dateien unverändert.
216 freigegebene Projektpfade, vier dist-Dateien und drei lokale Assetreferenzen;
die vier dist-Hashes sind identisch zum vorigen eigenen Buildnachweis.
Alle erreichbaren historischen Pfade werden ebenfalls kontrolliert. Fünf neue
negative Vite-Importbuilds sperren R7-Fixtures, QA und Entscheidungsvorlagen;
insgesamt 32 tatsächliche negative Imports plus weitere Buildkontrollen bestanden.
Startbundle enthält weiterhin keinen Korrektor oder Testkorpus.

Private Originale sind hier nicht zugänglich. Die gelieferten privaten Hash-/
Wortfensterscans werden nicht als eigene Ausführung übernommen. Keine eigene
private Hash-, Textfenster-, Bild-, OCR- oder Paraphrasenprüfung behauptet;
keine privaten Dateinamen/Auszüge übernommen. Kein absoluter Leakausschluss.

Lokale WebKit-Binärdatei tatsächlich geprüft: fehlt. Kein lokaler WebKit-Lauf
oder echter Safari-/iPad-Test behauptet. Vollständige WebKit-Suiten werden im
macOS-CI-Lauf des abschließenden Heads ausgeführt; tatsächlicher Run, Zähler
und rote Gates werden nach Push in PR #6 dokumentiert. Zum Berichtskommitt ist
dieser neue Lauf noch nicht ausgeführt. Vorheriger Lauf 39979382162 auf 8258b6d:
build failure, WebKit 75/78 (45/48 Standard plus 30/30 zusätzlich), deploy skipped,
Gesamtworkflow failure. Der alte Lauf ist kein neuer Head-Nachweis.

Tatsächlich gelesener CI-Zwischenstand 39988069880 auf ea9375f: build beim
Schritt npm run check fehlgeschlagen, WebKit weiter queued ohne zugeteilten
Runner, deploy skipped, kein abschließendes Gesamturteil. Vollständiger
Joblog-Download hier gesperrt; Job-/Schrittzustände und verfügbare Annotationen
ausgewertet. Dieser Zwischenstand wird nicht als bestandene WebKitprüfung
ausgegeben. Eine abschließende reine Dokumentationskorrektur gleicht den
älteren 0.2-Entwurf an den jetzt zwei Checks verlangenden JSON-Vorschlag an;
Runtime und Tests bleiben unverändert. Der endgültige Head und sein tatsächlich
beobachteter CI-Zustand stehen in der PR-Beschreibung.

Standard-Tab-Fokusfehler und Option-Tab-/Enter-Erfolge bleiben getrennt. Der
strenge WebKit-JSON-Endcheck wird nicht gelockert. Nur die neue R7-Testdatei wird
in die zusätzliche Suite aufgenommen. Echte benannte Safari-/iPad-Geräte mit
Bildschirmtastatur, Rotation, Hintergrundrückkehr und Speicherbeschränkungen,
Firefox und ein Lernendenpilot sind nicht geprüft. Keine allgemeine Lastgarantie
oder empirische Lern-/Motivationswirkung aus technischen Läufen ableiten.

## Konkrete Entscheidung und inaktive Schutzvorlagen

[Kurze Entscheidungsvorlage a/b](../review/P02b-Eingabeentscheidung.md):
a behält den Satzvertrag und unverändert 95 %, mit offenem Aufwand und weiterem
Gegenprüfbedarf. b verlangt einen ausdrücklich sichtbaren Fachbegriff und
optionale Klärung. **b wird empfohlen, nicht beschlossen oder umgesetzt.**
Fachliche Identität, Mehrwortbegriffe/Synonyme, Negation/Konkurrenz, sichtbare
ungeprüfte Zusätze und Selbstüberarbeitung gegenüber unterstützter Klärung sind
konkret reviewbar. Kein Herausschneiden richtiger Wörter aus Aussagen.

Der künftige term_only/not_assessed-Umschlag muss vollständig geprüft werden,
bevor Fortschritt entsteht – auch bei Z1.02. Ein grünes termResult allein
reicht nicht. C02/C03 bleiben offen; Hilfe erzeugt einen neuen gebundenen
Versuch ohne rückwirkende Grünfärbung. Versionswechsel, Migration, historische
Ergebnisse und heutiger Acht-Metadatenfelder-Vertrag sind ausdrücklich geregelt.
Neue Format-/Abnahmekriterien müssen vor einer Erprobung separat beschlossen
werden; kein rückwirkendes Bestehen alter Prüfungen oder Umetikettieren der Nenner.

GitHub tatsächlich gelesen: main protected=false, Rulesets leer, PR offen,
kein Auto-Merge; github-actions App-ID 15368. Die inaktive JSON-Regelvorlage
verlangt jetzt konsistent build und webkit. Der getrennte, nur mit git apply
--check validierte Workflow-Patch lässt WebKit auch bei main-Push laufen und
verlangt für Deployment needs: [build, webkit]. Der aktive Workflow hängt weiter
nur an build; keine Administration, kein Patch oder Deployment wurde aktiviert.
Vor einer späteren autorisierten Aktivierung effektive Regeln und Anbieterbindung
neu kontrollieren. Die Vorlagen beheben weder Sprachlücken noch Tab-Fokusfehler.

Offen bleiben der fachliche Beschluss a/b samt Kriterien und für b ein gesonderter
Umsetzungsauftrag, beide heutigen 95-%-Gates, längere Antworten/Zusätze,
318 dokumentierte Rohabweichungen, unabhängige Gegenprobe nach jeder später
beauftragten Runtimeänderung, Geräteabnahme und tatsächlicher Branchschutz.
R7 ist dann bekannte Regression. PR offen lassen, keine Mergefreigabe behaupten.
