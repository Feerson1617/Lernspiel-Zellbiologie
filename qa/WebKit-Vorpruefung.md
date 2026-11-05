# Begrenzte Intel-WebKit-Diagnose · PR 14

Ausgangspunkt: `fe28dd38244f23152286e9b51b9683178b667b3a`, Basis
`effed6bb5dd0e41df21036d59b6d0664e7718372`. Auftrag und externer Prüfbericht
vom 05.11.2026 begrenzen die Arbeit auf die bestehende WebKit-Vorprüfung.
M7.02, Fachverträge und Sollwerte bleiben unverändert. AGENTS.md, bestehender
Tastaturtest, seine UI-Fokusübergänge und die native CI-Konfiguration wurden gelesen.

## Ausgangsbefund und vorab festgelegte Serie

CI 41897872301 / Job 126812129059: zwei 30-s-Timeouts der Tastaturvorprüfung.
Korrektur der früheren Zuordnung: Der aktuelle Desktop-Stack zeigt Zeile **222**
(Hilfe nach Entfernen), nicht 215. Beim Tablet war die Schlussaufnahme bereits
angehängt. Die spätere Vollsuite bestand mit 870/870; sie heilt das rote Pflichtgate
nicht. Der externe ARM64-Vergleich (9/9 je Stand) beweist keine Intel-Ursache.

Vor dem neuen Intel-Lauf festgelegt: **drei getrennte Tastaturaufrufe**, jeweils
alle drei unveränderten Profile, zwei Worker, null Retries und 30 s pro Fall.
Alle drei Aufrufe laufen auch nach einem Fehler; jeder Fehler bleibt gatewirksam.
Anschließend die unveränderte R1-Vorprüfung (sechs Fälle), vorhandene drei
M6.02-Probes und vollständige Suite. Kein selektives Wiederholen bis Grün.
Wenn ein Tastaturfehler reproduziert wird, zusätzlich genau drei Aufrufe auf
der unveränderten PR-Basis, auf demselben Intel-Runner. Die Basis wird unverändert
gebaut und geprüft; dort liefern native Traces die Zeitleiste, ohne Übertragung
des instrumentierten Head-Tests. Kein Profil-/Budget-/Workerwechsel.

## Nachweissicherung

Jeder Aufruf erhält einen eigenen Ergebnisordner und JSON-Bericht sowie einen
Manifest-Eintrag für PR-Head, Ausführungscommit, geprüften Commit/Baum, Phase,
Plattform/Architektur, Befehle und Test-/Konfigurationshashes. Die Vorprüfungen
zeichnen Traces auch bei Erfolg auf; Fehlerkontext und Fehlerscreenshot bleiben
über die bestehende Playwright-Konfiguration erhalten. Die Tastaturfälle schreiben
zusätzlich Phasenzeit, tatsächlichen Fokus und Seitensichtbarkeit an den Übergängen
in `keyboard-timeline.jsonl`. Keine Eingabewerte oder Schülertexte im Zeitprotokoll.
Die wenigen zusätzlichen Leseaufrufe sind Diagnoseinstrumentierung, keine
behauptete Beschleunigung; die Vollsuite aktiviert sie nicht.

Upload unmittelbar nach der jeweiligen Serie, vor späteren Suiten, auch bei Fehler.
Sieben Tage Aufbewahrung für jedes neue Artefakt. Bestehende Artefakte und
Pflichtgates bleiben erhalten. Eine spätere erfolgreiche Wiederholung ersetzt
keinen Erstfehler. Tatsächliche Ergebnisse und Artefaktfristen werden im
Abschlussbericht anhand des ausgeführten Laufs ergänzt, nicht vorweggenommen.

Ursache derzeit offen. Keine Reparaturbehauptung, automatische Mergeentscheidung,
Veröffentlichung oder Unterrichtsfreigabe.

Vor dem Diagnosecommit lokal: TypeScript, Build/Veröffentlichungsschutz und
Workflow-Strukturprüfung bestanden. Alle bisherigen CI-Gates/Artefaktpfade sowie
die ursprüngliche Testquelle nach Entfernen ausschließlich der Diagnosezeilen
sind erhalten. System-Chromium: 3/3 Tastaturfälle mit vollständiger Zeitaufzeichnung
bestanden (13,6 s Gesamtzeit). Lokale WebKit-Serie: neun Startfehler wegen fehlender
Browserdatei, kein Bedienfall gestartet; Download durch Netzwerkpolicy (403)
gesperrt, R1 lokal anschließend nicht ausgeführt. Originalberichte bleiben erhalten.
Diese lokale Umgebung ersetzt ausdrücklich nicht die anstehende Intel-Serie.

Die erste Intel-Diagnoseserie an `5fcc114` bestand mit 9/9 Tastatur- und 6/6
R1-Fällen. Der bedingte Basisvergleich wurde mangels reproduzierten Fehlers
nicht ausgeführt. Das Tastatur-Sammelartefakt (47.207.166 Byte) überschreitet die
32-MiB-Transfergrenze des Prüfwerkzeugs; direkter Transfer ist ebenfalls durch
die Netzwerkpolicy gesperrt. Deshalb wird nur die Upload-Gruppierung korrigiert:
je Aufruf ein Artefakt. Die ursprünglichen Artefakte bleiben erhalten. Der Push
kann den laufenden Diagnose-Workflow durch die bestehende Concurrency-Regel
abbrechen; er wird nicht als vollständig bestanden gezählt. Am neuen finalen
Head gilt erneut die vorab festgelegte Dreierserie samt vollständiger Regression.
Dies ist eine Korrektur der Nachweiszugänglichkeit, keine belegte Timeoutreparatur
und kein selektiver Fehlertest-Rerun. Ursache und Freigabe bleiben offen.
