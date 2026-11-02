# Gezielte Laufzeitprüfung und Wartungsauftrag

**Wartungsauftrag jetzt ausgeführt:** siehe [M6.04-R1](M604-R1.md).
Der neue Nutzerauftrag erlaubt die begrenzte Aufteilung und verlangt drei
gezielte Intel-WebKit-Proben vor einem vollständigen finalen Lauf. Die unten
stehenden Beschränkungen und Laufempfehlungen gehören zum früheren Auftrag.

Stand: neuer M6.04-Branch auf Main `3c9da3f6c84e78cd1abb25bc6f6d2bb1000915f1`.
Die Sammeltests, Workerzahlen, Timeouts, Retries und Fallzahlen werden in diesem
Auftrag nicht verändert. Die Nutzerangabe zu wiederholten externen R2-Timeouts
ist ernst zu nehmen; der vollständige externe R2-Bericht mit Einzelspuren lag
hier nicht vor. Ein grüner Wiederholungslauf widerlegt keinen Erstfehler.

## Eigene gezielte Prüfung

Umgebung: Linux x64, Node 24.19.0, Vitest 5.0.5; unveränderte zwei Worker.
Drei getrennte Aufrufe je Gruppe, keine automatischen Retries:

```sh
npx vitest run tests/unit/naming-v1.test.ts tests/unit/p02b-second.test.ts --outputFile=qa/generated/unit-probe.json
npx vitest run tests/content/naming-v1.test.ts tests/content/p02b-r6.test.ts tests/content/p02b-r7.test.ts --outputFile=qa/generated/content-probe.json
```

| Tatsächlich ausgeführter Einzeltest | Probe 1 | Probe 2 | Probe 3 |
| --- | ---: | ---: | ---: |
| Begriffskonfigurationen vollständig durchlaufen, `unit/naming-v1.test.ts` | 1.212 s | 1.145 s | 1.138 s |
| 3580 Ergebnisse gegen geschütztes Schema, `content/p02b-r6.test.ts` | 8.361 s | 8.408 s | 8.558 s |
| 3017 Ergebnisse gegen geschütztes Schema, `content/p02b-r7.test.ts` | 7.160 s | 6.937 s | 7.132 s |
| Langsamster 900er-Namensbatch, `content/naming-v1.test.ts` | 2.054 s | 2.110 s | 2.008 s |

Alle drei Unitproben: jeweils **713 bestanden, 0 fehlgeschlagen**. Alle drei
Contentproben: jeweils **12 bestanden, 0 fehlgeschlagen**. Einzelberichte und
vollständige Ausgaben liegen im Reviewpaket unter
`qa/generated/m604-evidence/timing/`. Das sind gezielte Messungen vor dem
abschließenden vollständigen Lauf, keine unabhängige Gegenprüfung.

`tools/report-test-timing.ts` liest vorhandene echte Vitest-/Playwright-Berichte,
bindet sie durch Dateihashes und nennt Einzelzeiten sowie Fehler. Beispiel:

```sh
node tools/report-test-timing.ts qa/generated/unit.json qa/generated/content.json qa/generated/playwright.json
```

Die Ausgabe enthält bewusst eine Einschränkung: Der zum Auswertungszeitpunkt
aktuelle Git-Head ist nicht automatisch der getestete Commit. Die endgültigen
Läufe werden zusätzlich im M6.04-Nachweismanifest mit Head, Tree, Umgebung und
Erstfehlern gebunden.

## Beleg und mögliche Ursachen trennen

Der vorhandene P03b-R1-Nachweis enthält einen vollständigen WebKit-Erstlauf mit
602 bestandenen Fällen und einem Timeout im alten M6.02-Test
`rejects unknown dictionary keys` (`tests/browser/m602-cued.spec.ts`). Der
unveränderte vollständige Wiederholungslauf bestand alle 603 Fälle. Der erste
Test dauerte etwa 31.1 s bei unverändertem 30-s-Testbudget. Ein Trace dieses
damaligen Fehlers wurde nicht aufbewahrt; eine bestimmte blockierende Aktion
lässt sich deshalb nachträglich nicht beweisen.

Dieser Browserfall bündelt zahlreiche unbekannte Wörter, echte Tastatureingaben,
Prüfungen der Oberfläche, Node-/Browser-Parität, Speicherprüfungen und
Überarbeitungen. Der Unit-Konfigurationstest enthält über 20 000 Kombinationen
in einem Testkörper. Die Contentfälle enthalten große dynamische Korpusimporte,
vollständige Ergebnisvergleiche und synchrone Python-/JSON-Schema-Unterprozesse
(bestehendes Unterprozessbudget 20 s, Testbudget 30 s).

CPU-Konkurrenz, Start-/Importkosten und viele sequenzielle Browseraktionen sind
damit **prüfbare Ursachenhypothesen**, keine nachgewiesene Fehlerursache. Die
eigenen drei Proben reproduzierten den Timeout nicht. Ohne präzisere Spur wäre
eine Änderung der alten Korpora eine ungezielte Reparatur; sie unterbleibt hier.
Auch alle 603 bisherigen Browserfälle bleiben erhalten.

## Sichere Fehlerspuren in Actions

Die bestehenden Chromium- und WebKit-Jobs archivieren bei einem fehlgeschlagenen
Job zusätzlich ausschließlich `test-results/**/trace.zip` und
`test-results/**/error-context.md`, Aufbewahrung sieben Tage. Das sind die
Ausgaben des isolierten Test-Checkouts mit synthetischen Eingaben. Kein Zugriff
auf private Unterrichtsquellen, Konten oder echte Schülerdaten, kein Upload des
gesamten Arbeitsverzeichnisses. Fehlende Dateien werden nicht als erfolgreicher
Test gewertet. Die bereits konfigurierten Traces werden nicht erst nach einem
Fehler erfunden. Berichte und Screenshots bleiben weiterhin verfügbar.

## Separater Wartungsauftrag mit Abnahmekriterien

1. Auf demselben benannten Runner und Commit den vollständigen ursprünglichen
   Befehl ausführen: `npm run check` bzw.
   `WEBKIT_SUITE=all npx playwright test --config=playwright.webkit.config.ts`.
   Zwei Worker, null Retries, bestehende Budgets. Erste rote Läufe einschließlich
   JSON, Logs, Trace und Fehlerkontext aufbewahren, nicht durch Reruns ersetzen.
2. Beim konkret betroffenen Fall Import-/Schema-/Aktionszeiten und
   Ressourcenbelegung erfassen. Mit den hier benannten gezielten Reproduzierern
   vergleichen. Beim Browser aus dem Trace die letzte begonnene und letzte
   abgeschlossene Aktion bestimmen; zuerst prüfen, ob ein Produktfehler vorliegt.
3. Nur den belegten Engpass reparieren. Falls ein übergroßer Testkörper die
   Ursache ist, begrenzte Batches in einem eigenen PR erwägen. Alle bisherigen
   Eingaben, erwarteten Ergebnisse und Assertions durch Hash-/Mengenvergleich
   nachweisen; mehr Testfälle dürfen dabei entstehen, keine fachlichen Prüfungen
   entfallen. Keine pauschalen Timeout-Erhöhungen, Retries oder Skips.
4. Akzeptanz: ursprünglichen Erstfehler erklären, gezielten Reproduzierer
   bestehen und drei vollständige Läufe auf derselben dokumentierten Umgebung
   ohne Fehler, Flakes oder Skips durchführen. Historische Satzqualitätsgates
   bleiben separat sichtbar. Eine bloße Wiederholung ohne Ursache genügt nicht
   als Nachweis einer Stabilitätsreparatur.

Die endgültigen vollständigen M6.04-Läufe und etwaige neue Erstfehler stehen im
Reviewmanifest; diese gezielte Vorprüfung behauptet keine generelle Stabilität.
