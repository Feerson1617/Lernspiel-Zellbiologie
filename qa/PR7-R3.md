# PR7 R3 – Bezugsgröße in koordinierten Volumenaussagen

Ausgang `2a7220645d9bc0d8407462d33935fc6b8b768eef`, Basis main
`82f7a28237e3d11194a8951a4ab7566b0cd57574`. PR6 ist gemergt und wird nicht
geändert. Keine fremden Produktänderungen am Aufgabenbeginn. 174 Dateien des
R3-Pakets stimmen mit dessen SHA256-Liste überein. Private Unterrichtsoriginale
stehen für eine eigene neue Quellenprüfung nicht bereit. Die 21 geschützten
Quellen und 79 Identitäten bleiben unverändert.

## Ursache und fokussierter Patch

Vor Änderung wurden alle zehn gelieferten Koordinationsfälle auf der tatsächlichen
Runtime und Session.record wiederholt. Die fünf Gegenfälle wurden tatsächlich
correct/independent gebucht. Ein subjektloses zweites Prädikat erhielt isoliert
wieder den Fragebezug Vakuole; ein zuvor genanntes anderes Objekt ging verloren.

Jedes erkannte Volumenglied trägt nun `VolumeMeaning`: Gegenstand, Änderung,
lokale Negation, gemeinsame frühe Phase, Herkunft des Bezugs (explizit/geerbt/Frage)
und grammatischer Bezugsrahmen. Nicht sicher analysierte Glieder bleiben null
(ungeklärt), ihr Originaltext wird vollständig in notAssessed erhalten.
Koordination trägt den zuletzt eindeutig benannten Gegenstand weiter. Ein neues
explizites Subjekt überschreibt ihn. Die Frage ergänzt Vakuole nur am Anfang
einer eigenständigen objektlosen Antwort, niemals nach benannter Zellwand oder
Protoplast. Auch Alternative/Korrektur und zurückgenommene Vermutungen behalten
ihren Bezug. Gegensätze werden nur beim selben Gegenstand und derselben Phase
verglichen. Unbekannte Zeit-/Satzteile verhindern Grün.

Ein vorhandener Sprachumfang bleibt erhalten: „ihr Volumen“ bei einem einzigen
eindeutigen femininen Antezedens, „es“ bei einem eindeutigen sächlichen Volumenbezug.
Mehrere mögliche Gegenstände oder nicht profilierte Pronomen bleiben clarify.
Intern ergänzte Bezüge sind keine hinzugefügten Wörter in der Einreichung;
EvaluationResult-Evidenz bleibt ausschließlich am unveränderten Originalfeld
(UTF-16 0..length). Eingabe-/Ergebnis-/Kontext-/Versionsverträge und Speicherung
werden nicht erweitert. Keine neue Sprachlexik, Simulation oder Mission.

## Fachfeedback und Nachweis

C01/C02/C05 des Koordinationskorpus: incorrect, konkrete bestehende Rückmeldung
„Du schreibst der Zellwand eine Verkleinerung zu.“ Unterscheidung zur formstabilen
Wand; nächster Schritt Bezug auf den Vakuolenraum. C03/C04: partial, ausdrücklich
Protoplastenverkleinerung statt bestätigter Vakuolenvolumenfolge; nächster Schritt
dessen eigene Wasserbilanz unterscheiden. Keiner erhält einen Gesamtbeleg.
Alle fünf Gegenkontrollen bleiben korrekt unterschieden: drei correct, zwei
incorrect. C01–C10 sind hier Fall-IDs, nicht die Aufgaben-Kriteriennummern.

33 eigene Sicherheitsfälle wurden vor neuem Parserlauf eingefroren; sie betreffen
geteilte/wechselnde Gegenstände, Negation, Zeit, Korrektur, Pronomen und unbekannte
Zusätze. Keine unabhängige Abnahme und keine neue Sprachstichprobe. Zwei weitere
codegeleitete Unit-Prüfungen erhalten die bestehenden Possessiv-/Neutrumfälle und
ihre Mehrdeutigkeitsgrenzen; sie werden nicht in den 33er-Nenner eingerechnet.

Erster gezielter Lauf: vier alte richtige „ihr Volumen“-Fälle zu vorsichtig gelb,
entsprechendes altes Gate rot. Eindeutige Bindung wiederhergestellt. Abgleich mit
R3 zeigte zusätzlich R3-139 („Das Vakuolenvolumen sinkt, aber es sinkt nicht.“):
Neutrum-Referenz bewahrt, keine falsche Zurückweisung als unbekannte Aussage.
Eine neue Test-Tupeltypisierung meldete TypeScript als zu weit; als readonly-Tupel
präzisiert. Keine Sollwertänderung, kein Timeout-/Skip-Eingriff. Erstbefunde und
Wiederholungen bleiben im separaten Prüfarchiv. Danach gezielte Prüfungen erneut.

## Vollständige Nenner und Freigabegrenze

`report:m602-r2` bleibt unverändert: 916 Fälle, 85 Abweichungen, Exit 1.
`report:m602-r3` ergänzt 156 ursprüngliche R3-Fälle, zehn Koordinationsfälle und
33 eigene Sicherheitsfälle, insgesamt 199 vollständige Outcomes mit Buchungsprobe.
Der rote Relations-readiness-Job führt beide Berichte aus und sichert beide Dateien.

| Bestand | Richtung | Volumen |
|---|---:|---:|
| Alte 642: alle Sollklassen | 314/321 | 316/321 |
| Alte vollständige richtige | 136/143 | 138/143 |
| R2: alle Sollklassen | 55/90 | 53/90 |
| R2 vollständige richtige | 37/52 | 34/52 |
| R2 kurze richtige | 35/45 | 32/45 |
| R3: alle Sollklassen | 31/78 | 26/78 |
| R3 vollständige richtige | 16/47 | 13/47 |
| R3 kurze richtige | 14/40 | 11/40 |
| R3 zehn Koordinationsfälle | – | 10/10 |
| Eigene neue Sicherheitsfälle | – | 33/33 |

R3 behält alle 99 Sollabweichungen. Die alten 85 bleiben ebenso vollständig im
Nenner. Keine falschen grünen/roten Urteile in diesen tatsächlich geprüften
Beständen; keine Garantie für unbekannte Formulierungen. Fünf kritische Fehlgrüns
wurden vor Reparatur getrennt reproduziert, nicht in einer Sprachquote gemittelt.
Der allgemeine Freitextvertrag bleibt klar unter 95 % und **nicht freigegeben**.
Keine weitere Satzmustersammlung. Die vier alten Legacy-Satzgates bleiben separat rot.

## Entscheidungsvorlage und Abschluss

Die bestehende [Vorlage](../review/m602-structured-proposal.md) ist präzisiert:
Zellmembran/Volumengegenstand als gegeben kennzeichnen, nur Richtung/Änderung selbst
eintragen; kein Abschreiben als neues Kriterium. Die freiwillige Erklärung bleibt
im kleinsten vorgeschlagenen Folgeauftrag Teil derselben bewerteten Einreichung:
ungeprüfter relevanter Zusatz blockiert Gesamtgrün nach der bestehenden strengen
Regel. Eine separate Lernnotiz ist ausdrücklich nicht Teil dieses Vorschlags.
Neue Hülle und getrennte Versionsbezeichner sind nur Genehmigungskandidaten.
Keine vorliegende Freigabe für C02/C03, keine Runtime-Formatumstellung und kein P03.

Der finale PR und das separate Prüfarchiv nennen exakte Endhead-/Basis-SHAs,
Umgebung, Befehle/Exitcodes, sämtliche Fehler/Skips, echte DOM- und Runtimeproben,
komplette lokale/CI-Abschlussprüfungen einschließlich Chromium und macOS-WebKit.
Direkter Unit-Aufruf ohne vorherigen Konzeptlauf, Mehrzweigschutz, negative
Runtimeimporte, R9-Hilfehistorie, Kontext-/Speicher-/Aggregationsregression bleiben
Pflicht. Vor Browserläufen: genügend freier Speicher, kein anderer eigener
Testserver; schwere lokale Suiten nacheinander. Keine Cache-/Beleglöschung nötig.

Offen: ausdrückliche Formatentscheidung und Folgeauftrag, neue unabhängige
Sicherheits-/Formatprüfung, echte Safari/iPad-Hardware samt Bildschirmtastatur/
Rotation und Lernenden-/Unterrichtsprobe. Main ungeschützt, Deploy nur von build
abhängig: roter Qualitätsjob ist keine administrativ erzwungene Sperre. Keine
Adminänderung, kein Merge/Deployment oder Unterrichtsfreigabe durch diesen Auftrag.

Der erste eigene DOM-Nachweis hatte drei fehlgeschlagene Tests (je Profil):
getState().latest ist absichtlich eine Kopie und darf nicht als Originalbeleg an
record übergeben werden. Die Probe holt nun über die bestehende idempotente
submit-Schnittstelle den ausgestellten Originalumschlag und prüft zusätzlich,
dass die Kopie weiterhin zurückgewiesen wird. Dies war ein Fehler im neuen
Prüfharness, keine Rücknahme der Produktgrenze. Erste Logs, JSON und Screenshots/
Traces sind erhalten. Eigene gezielte Gegenfälle aus dieser Codeprüfung prüfen
zusätzlich unaufgelöste Pronomen nach Wasserverlust-/Strukturbeobachtung; sie sind
keine nachträgliche Veränderung des eingefrorenen 33er-Bestands.
