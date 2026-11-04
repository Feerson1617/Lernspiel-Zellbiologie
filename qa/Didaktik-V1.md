# Didaktische Lernwege V1 · begrenzte Entwicklungsvorschau

Ausgang: nach manuellem Merge von PR #12, Commit
`0092585fbdc40e305c04a6155101896dabb9de4a`, Branch `feature/didaktik-v1`.
Grundlage: AGENTS, A–E, die relevanten Aufgabenabschnitte von F und spec,
bestehende Fachverträge und der ausdrückliche Folgeauftrag. Private Pro-PDFs,
Unterrichtspakete und Prüfungsoriginale waren nicht zugänglich und wurden nicht
verwendet. Diese Selbstprüfung ist keine unabhängige Gegenprüfung.

## Änderungen und Gültigkeit bestehender Ergebnisse

[Darstellungs-/Inhaltsvertrag 1.0.0](../contracts/didaktik-v1-1.0.0.json) beschreibt
zwei frei zugängliche Lernwege. Wasser: M6.02 → M6.03 → eine eigene biologische
Erklärung. Daten: M10.01 → M10.02 → eine eigene Datenbeschreibung. M6.04 ist eine
optionale Vertiefung. Keine zusätzliche Mission, Physik oder Freitextbewertung.

M6.04 verbirgt befundabhängige Felder einschließlich ihrer Legenden und
Rückmeldungen vor der bewussten Datenöffnung. Auch die Vergleichslösung öffnet
die Daten und friert zuerst den tatsächlichen Vorentwurf ein. Leeren und
Fallwechsel machen gesehene Daten nicht ungesehen. Der Standardplan folgt erst
auf eine eigene Planungsmöglichkeit und wird bewusst geöffnet. Der kompakte
Kernweg zeigt sechs zentrale Felder; die Vertiefung enthält weiterhin sämtliche
17 Felder. C18 und alle Voraussetzungen eines vollständigen Erfolgsbelegs bleiben
unverändert. „Kernweg bearbeitet“ meldet nur ausgefüllte Entscheidungen, kein
fachliches Grün. Freie Planungsnotizen werden nicht bewertet.

M6.02 zeigt zunächst die unveränderten drei Potenzialwerte, Membranbedingungen
und Druckbezug, ohne deren Rangfolge oder die gesuchte Nettorichtung vorzugeben.
M6.03 behält alle Karten und Bedeutungen, verkürzt Formulierungen und ergänzt
eine gesonderte Schreibansicht. Der abschließende Kriterienvergleich bleibt
anfangs geschlossen. Bewusst aufgerufene Hilfen bleiben nutzbar und erfasst.

Der neue Kartoffelgewebe-Kontext ist ein ausdrücklich konstruierter didaktischer
Fall, keine reale Messreihe. Die fünf Massen, Ergebnisse und Diagrammpunkte
bleiben unverändert. Der zusätzliche Normierungsvergleich ist eine unbewertete
Zwischennotiz. M10.02 behält Renderer, Parser, Skalenvertrag und exakte Toleranzen.
Ein Lesbarkeitshinweis beurteilt keine mathematisch gültige Skala als falsch.

Frühere Ergebnisse gelten weiter ausschließlich für ihren strukturierten
Prüfumfang. Sie belegen keinen neuen Schreibabschluss und keine selbstständige
Vorhersage. Kein Migrationsbonus, keine neuen gespeicherten Metadaten. Eigene
Texte bleiben flüchtig und beim bloßen Routenwechsel erhalten; ausdrückliches
Leeren/Fallwechsel und Neuladen haben die jeweils beschriebene Wirkung.

## Unterrichtsplanung: zwei getrennte 45-Minuten-Abschnitte

Die Zeiten sind **Planungsschätzungen**, keine aus Browserlaufzeiten oder
Lerngruppentests abgeleiteten Messwerte. Nicht alle fünf Aufgaben in einer Stunde.

| Wasserweg | Minuten | Erwartetes Arbeitsprodukt |
| --- | ---: | --- |
| Frage und nötige Begriffe klären | 5 | Räume, Membranen, Gesamtwasserpotenzial |
| M6.02 individuell bearbeiten und gezielt verbessern | 10 | Drei geprüfte Kurzantworten mit Materialbezug |
| M6.03 Netz bauen und nach Feedback überarbeiten | 12 | Bedingte, gerichtete Beziehungen |
| Eigene Erklärung ohne offene Lösung schreiben | 8 | Zwei bis vier zusammenhängende Sätze zur Turgorfrage |
| Partnervergleich und gemeinsame Sicherung | 10 | Notwendige Bedingung, gemeinsame Bedingungen, Beobachtungsgrenze |

M6.04 ist eine spätere Vertiefung oder Differenzierung; keine Pflicht für diesen
45-Minuten-Weg. Stärkere Lernende begründen Bedingungen, statt weitere Missionen
freizuschalten. Bei höherem Unterstützungsbedarf kann die Lehrkraft die drei
Potenzialwerte gemeinsam erschließen, ohne die Antworten vorwegzunehmen.

| Datenweg | Minuten | Erwartetes Arbeitsprodukt |
| --- | ---: | --- |
| Gewebe, Behandlung und Wägeweise verstehen | 5 | Vergleichsbedingungen benennen |
| M10.01 rechnen, prüfen und Normierung vergleichen | 10 | Fünf Werte; kurze unbewertete Bezugsgrößen-Notiz |
| M10.02 Achsen, Skalen und Punkte selbst darstellen | 14 | Eigenes geprüftes Diagramm |
| Eigene Datenbeschreibung schreiben | 8 | Zwei Zahlenbelege mit Einheiten, Näherung, begrenzter Schluss |
| Kriterienvergleich und gemeinsame Sicherung | 8 | Unterschied zwischen Datenbefund, Deutung und Grenze |

## Kurze Pilotprüfliste für die Lehrkraft

- Verstehen Lernende Einstieg, nächsten Schritt und den Unterschied zwischen Kernweg und vollständiger Untersuchung?
- Lässt sich die eigene Begründung vor der Lösung beobachten; bleiben Hilfen freiwillig und ohne Bestrafung?
- Können Lernende notwendige und hinreichende Bedingungen sowie Beobachtung und Deutung in eigenen Worten unterscheiden?
- Wird die Anfangsmasse als Bezug begründet; werden Werte und Einheiten korrekt verbunden und Näherungen kenntlich gemacht?
- Reichen Arbeits- und Auswertungszeit auf dem tatsächlichen Schulgerät, auch mit Bildschirmtastatur und großer Schrift?

Unabhängige Gegenprüfung, reale iPad-Safari-/Screenreaderprüfung und Lerngruppenpilot
stehen aus. Kein automatischer Merge, kein Deployment und keine Unterrichtsfreigabe.

## Testprotokoll und Erhaltungsprüfung

Vor Produktänderung wurden zwei neue Sollabläufe ausgeführt: direkter Sprung
zum Befundschritt und frühe Vergleichslösung. **6/6 Chromiumfälle schlugen fehl**
(je Desktop/Tablet/Mobil). Die direkte Ansicht zeigte 61/89 %; die Vergleichslösung
ließ die Datenhistorie unverändert und den ursprünglichen Entwurf unerfasst.
Die nachfolgenden ursprünglichen-Vorhersage-Assertions liefen deshalb ins
30-Sekunden-Limit. Erstbericht, Bilder, Traces und Fehlerkontexte bleiben im
separaten Übergabepaket erhalten; die Wiederholung ersetzt sie nicht.

Bestehende Browserfälle bleiben erhalten. Angepasst werden nur ausdrücklich
geänderte UI-Wege/Wortlaute: Volluntersuchung öffnet nun die Vertiefung (auch
per Tastatur), M6.02 führt weiter zu M6.03, der optionale Zwischenvergleich
wird entsprechend benannt, Kantenbeschriftungen behalten kürzer denselben Sinn.
Fachliche Sollwerte, Skips, Retries, Workerzahlen und Budgets werden nicht geändert.
Tatsächliche Endzahlen, weitere Erstfehler, Commit/Tree und Belegpfade werden im
Übergabemanifest und im PR ergänzt, sobald die Läufe abgeschlossen sind.

Weitere eigene Erstbefunde: Der erste Build scheiterte an `spawnSync git EPERM`
in der Sandbox; die genehmigte Wiederholung erreichte den Publikationsschutz
und blockierte korrekt eine generierte `.vitest/json/output.json` außerhalb der
Allowlist. Der Bericht wurde in den ignorierten Nachweisordner verschoben.
Danach fiel ein unbenutzter Eventparameter (TS6133) auf und wurde entfernt.
Ein diagnostischer Browserlauf startete versehentlich trotz dieses Buildfehlers
auf dem zuvor gebauten Stand; währenddessen wurde neu gebaut. Er endete mit
134/138, vier Wortlaut-/Navigationsfehlern. Dieser gemischte Lauf ist ausdrücklich
**kein finaler Regressionsnachweis**; Originalbericht und Traces bleiben erhalten.
Die neue Startnavigation und der weiterhin explizite Hinweis auf zwei gemeinsame
Bedingungen wurden anschließend auf dem erfolgreich gebauten Stand geprüft.

Die neue 54er-Auswahl bestand zunächst 48/54: sechs Layoutfehler bei 320/390 px
und 200 % Schrift. Nach dem ersten Umbruchschritt bestanden 45/48 neue Fälle;
die drei restlichen Fälle betrafen die Entwicklungsüberschrift bei 320 px.
Echte Browser-Textrechtecke zeigten dort 324,65625 px rechte Grenze bei 320 px
Viewport. Die Überschrift darf nun umbrechen; das Startseitentitelmaß verwendet
weiter vergrößerbare rem. Keine fachliche Erwartung und kein Testbudget wurde
hierfür angepasst. Die Fehler und verfügbaren Bilder/Traces bleiben im Paket.

Beim Fortsetzungsauftrag wurde der Stand erneut geprüft: `main` und PR-12-Merge
weiter `0092585`, alle uncommitteten Änderungen auf `feature/didaktik-v1` vorhanden;
kein späterer Remote-Branch oder PR. Keine Rekonstruktion verlorener Änderungen
und kein Ersatzbranch nötig. Die YAML-Strukturprüfung bestätigt ausschließlich
zwei zusätzliche synthetische Nachweisuploads mit sieben Tagen Aufbewahrung.
Der Hashvergleich der ursprünglichen M6.02-Browseraktionen besteht weiterhin.

Gezielte Abschlusswiederholung: **48/48 neue Chromiumfälle bestanden**,
0 Fehler, 0 Skips, 0 Flakes, keine automatischen Wiederholungen. Darin enthalten:
alle Befundöffnungswege, kompakter Kernweg/C18, beide Lernwege, gültige weite Skala,
flüchtige Texte, Maus/Touch/Tastatur sowie 1440/820/390/320 px bei 100/200 % Schrift.
Die Gesamtzahl wächst damit von 762 auf **810 Browserfälle je Engine**. Drei neue
Controllerfälle ergänzen die Unitregression. Die folgende vollständige lokale
und reguläre CI-Prüfung bleibt maßgeblich für den Übergabecommit.

Erste vollständige lokale Regression am Produktstand `25c27b0`: 18.607 Unit-
und 277 Contentfälle bestanden; Buildtests 75/76. Ein Bundle-Inhaltstest suchte
noch die auftragsgemäß ersetzte Überschrift „Erklären im Heft“. Er prüft jetzt
„Optionaler Zwischenvergleich“; alle Import-/Lösungsschutzassertions und die
Fallzahl bleiben erhalten. Der Browserteil wurde wegen dieses Buildtestfehlers
in diesem Vollaufruf nicht gestartet. Vollbericht und alle drei JSON-Berichte
sind archiviert. Die folgende vollständige Wiederholung prüft den korrigierten
Test; es wurde kein Produktcode und keine fachliche Erwartung dafür verändert.
