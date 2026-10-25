# P02c: versionierte begrenzte Relationsfelder

Ausgang PR7 `7d6c657f61d53bc3d5e5e4a08343a9141bc8da28`, main
`82f7a28237e3d11194a8951a4ab7566b0cd57574`. PR6 unverändert gemergt.
Die neue ausdrückliche Nutzerentscheidung autorisiert C02/C03 im bestehenden PR7,
keine Unterrichtsfreigabe, keinen Merge/Deploy und kein P03. Verbindlicher vor
Implementierung geschlossener Vertrag: [cued 1.0.0](../review/m602-cued-relations-1.0.0.md).

## Ergebnis und Ursache

Die neue Route `evaluateM602Cued` prüft vollständige kurze Richtungs-/Quell-Ziel-
und Veränderungsausdrücke. Keine Verwendung der alten Satzgrammatik, kein
Fuzzy-Matching oder Schlüsselwortausschneiden. Normale Schreibvarianten und
vorsichtige Formulierungen verfälschen die Polarität nicht. Zellmembran und
Vakuolenvolumen sind im Satzrahmen gegeben, keine zusätzlichen Kriterien.
Unbekannte ganze Sätze/Pronomen/Reste erhalten nichtfachliche Klärung und
Original-notAssessed, keinen erfundenen Fachfehler oder Erfolgsbeleg.

Neue Hülle `m602-cued-relations/1.0.0` und getrennte Aufgaben-, Rubrik-,
Inhaltsversionen. Keine erfundene Modellversion. Shape- und Ergebnisverträge
bleiben geschlossen. C01, Originalfrage, alle 79 IDs/19 Module und 21 geschützten
Dateien unverändert. Druckanteile/Pa, Räume, Membranen und frühe Materialphase
bleiben Voraussetzung; die Bearbeitungsphase ist davon zu unterscheiden.

Der R4-Bericht belegt eine zweite Bezugsregression: Der bisherige Genuscheck
wurde vor der Entfernung von Voranstellungen und Verbzweit-Umordnung ausgeführt.
Er prüfte somit nicht alle tatsächlich ausgewerteten Rückbezüge. Die historische
Route prüft Pronomen unabhängig von ihrer Position und klärt Mehrfachbezüge
konservativ, statt den zuletzt besuchten Gegenstand zu zertifizieren. Kein
weiterer Satzmusterausbau. Sechs wörtliche Beispiele aus dem externen Bericht
wurden lokal vor/nach dem Patch mit vollständigen Outcomes und Buchungsproben
reproduziert; danach weder ungerechtfertigtes Rot noch grüner Beleg.

**Das zusätzlich angekündigte R4-ZIP ist bisher nicht zugänglich.** Die vollständigen
ursprünglichen G/S/C/X-Sammlungen und Rohresultate wurden daher noch nicht gelesen
oder erneut ausgeführt. Bericht und lokale Replays bleiben außerhalb des
Repositorys, Bundles und CI-Artefakte. Keine Rekonstruktion fehlender Sollfälle
und keine Behauptung einer vollständigen R4-Prüfung oder unabhängigen Abnahme.

## Trennung und Integration

Fachliche Slotprüfung/Feedback getrennt von Session und Speicherung. Die bestehende
Sessionmechanik wird intern für exakt zwei statisch gebundene Verträge verwendet;
keine Plugin-/Parserbibliothek. `createM602CuedSession` akzeptiert nur neue Hülle
und Versionen, privat ausgestellte aktuelle Ergebnisse und gesicherte Historie.
Alte Ergebnisse/Kopien, fremde Vorgänger, Teilkriterien und ungeprüfte Zusätze
bleiben unbuchbar. Historische Metadaten werden nicht migriert oder umetikettiert.
Contentwechsel erhält fremde Daten und Hilfeunsicherheit; neue IDs/Seeds und Reload
stellen kein verlorenes Historienvertrauen wieder her. Unverändert acht
Fortschrittsmetadaten, keine Rohtexte, Evidenzen oder Hilfeereignisse dauerhaft.

`mountM602CuedLab` nutzt dieselbe interne DOM-Probe mit leeren selbst einzutragenden
Slots und der bestehenden Hilfekette. Der aktuelle isolierte Browserexport enthält
keinen alten Satzparser und kein altes Evaluator-API. Die historische Probe bleibt
explizit für Regressionen getrennt; deren Belege tragen alte Versionen und gelten
nicht als aktuelle Leistungen. Keine Einbindung in die öffentliche Startseite.

## Eigene Tests und erster Verlauf

113 eigene Fälle vor erstem neuen Lauf eingefroren, davon 24 gültige Eingaben pro
Feld einschließlich Schreib-, Unsicherheits- und Formatvarianten. Keine unabhängige
Sprachstichprobe. 47 anschließend codegeleitet ergänzte Negativ-/Teil-/Formatfälle
wurden vor ihrer ersten Ausführung separat fixiert. Die ersten 113 und der
Grün-Nenner blieben unverändert. Je Feld jetzt 80 Fälle nach C: 24 richtig,
24 falsch, 12 unvollständig, 12 unklar, 8 technisch/Format (davon zwei leer).
Eigene gemessene Quote 24/24 pro Feld, keine kritische Fehlfarbe in diesen 160.
Das ersetzt keine neue unabhängige Prüfung frischer zulässiger Formulierungen.

Zusätzlich 1296 aktuelle Status-/Zusatz-/Historienkonfigurationen, 250
Unterstützungskombinationen, je zehn feldspezifische Kontextbedingungen,
Version-/Hash-/Clone-/Vorgänger-/Metadatenprüfungen und geschlossene JSON-Schemata.
Systematik ist keine Anzahl natürlicher Schülerantworten. Alle bisherigen
M6.02-Unit-/Content-Regressionen und aktuellen gezielten Prüfungen: 563/563.
Aktuelle DOM-Probe: 21/21 auf Desktop/Tablet/Mobil-Chromium, einschließlich echter
Tastatur-/emulierter Touchbedienung, Fokus, sichtbarer Texte/Farben, Hilfe,
Überarbeitung, Materialwechsel, altem Content und Speicher-denied/quota mit Reload.

Erstfehler bleiben erhalten: neue TypeScript-Testzeile hatte ungenutzten Import
und einen nicht nach kind eingeengten Evidence-Zugriff; korrigiert. Erster DOM-Lauf
12/15, dreimal Timeout durch Versuch, nach Materialwechsel eine absichtlich
versteckte Lösung anzuklicken. Harness öffnet nun wieder Hinweis/Wortbank,
keine Produkt-/Timeout-/Skipänderung; anschließend 15/15 und erweitert 21/21.
Zwei ergänzende Kontexttests verwechselten zunächst die erlaubte Bearbeitungsphase
predict mit einem unzulässigen biologischen Zeitpunkt. Negative Materialprobe
prüft jetzt tatsächlich late_equilibrium; eigener positiver Test erhält predict
und dessen getrennten Kontexthash. Die eingefrorenen Matrizen wurden nicht geändert.

Vollständige Endprüfungen werden erst am fixierten Commit ausgeführt und im PR
sowie separaten Nachweisarchiv mit Head/Umgebung/Einzel-Exitcodes berichtet:
frischer GitHub-Mehrzweigklon, npm ci, direkter Unit-Aufruf ohne qa/generated vor
Konzeptprüfung, Content, TypeScript/Katalog/Build/Veröffentlichungsschutz,
vollständiges Chromium und Actions-WEBKIT_SUITE=all. Keine schweren lokalen
Browsersuiten parallel; Platz/Port vorab kontrollieren. Keine private Quelle im Git.

Aktueller CI-Qualitätsjob führt `report:m602-cued` aus. Alte R2/R3-Reporter bleiben
mit unveränderten Sollwerten als tatsächlich ausgeführter separat roter historischer
Job im Legacy-Workflow erhalten, samt beiden Rohberichten. Kein Umdeuten alter
Sprachergebnisse zu neuen Erfolgen. Frühere Befunde und neue konservative
Legacy-Abweichungen werden separat dokumentiert. Keine Änderung von Branchschutz
oder Deploy-Abhängigkeiten; grüne Selbsttests sind keine fachliche Abnahme.

## Offen und Anschluss

R4-ZIP/gesamte Originalmatrix fehlen; neue unabhängige Gegenprüfung bleibt Pflicht.
Keine echte Safari/iPad-Hardware samt Bildschirmtastatur/Rotation und keine
Unterrichts-/Lernendenprüfung ausgeführt. Private Unterrichtsoriginale nicht
verfügbar; kein eigener privater Quellenabgleich behauptet. Produktionsschutz
ist keine semantische Geheimnisprüfung.

Nach unabhängiger Sicherheits-/Formatabnahme kann P03 separat beauftragt werden:
ein begrenzter durchgängiger Lernzyklus Material/Frage → Eingabe → Kriterienfeedback
→ eigene Verbesserung → Hilfe → Kontext-/Fortschrittsanzeige. Keine neue Aufgabe,
Simulation oder allgemeine Grammatik dafür vorziehen. Dieser Auftrag stoppt bei
der begrenzten P02c-Umsetzung; PR7 bleibt offen.
