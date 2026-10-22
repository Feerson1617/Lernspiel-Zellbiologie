# Lokaler Lernstand (P01c)

`progress-store.ts` ist ein vorbereiteter, separat testbarer Adapter. Die
Startseite erzeugt noch keinen Store und liest/schreibt weiterhin keine
Browserdaten. Kein Korrektor, keine Mission und keine Schülerfreigabe.

## Datenvertrag und Ergebnisregeln

`src/domain/progress.ts` überführt `spec/progress.schema.json` ohne Schemaänderung:
`schemaVersion: 1`, eine ausdrückliche `contentVersion`, `attempts` sowie optional
bekannte empfohlene/ausgewählte Missions-IDs. Jeder Versuch enthält genau
`attemptId`, `taskId`, `instanceId`, `taskVersion`, `rubricVersion`, `modelVersion`,
`status`, `assistance`. Aufgaben-IDs bleiben die 79 kanonischen Identitäten.
Versuchs-IDs sind innerhalb eines Lernstands eindeutig; mehrere Versuche zur
selben Aufgabeninstanz sind erlaubt und überschreiben sich nicht.

`parseProgress(unknown)` prüft alle Felder, kopiert und friert tief ein. Zusätzliche
Felder (auch Namen, Rohantworten, Kriterienbelege und Kontextmaterial) werden
abgelehnt. Labels sind explizite technische Strings mit 1–256 UTF-16-Codeeinheiten,
ohne Rand-Leerzeichen/Steuerzeichen; sie dürfen keine Schülertexte enthalten.
Fehler enthalten ausschließlich Codes. Dies ist strenger als die allgemeine
Stringprüfung des Redaktionsschemas. Versionen werden weder geraten noch vergeben.

`createAttemptRecord(attemptId, handoff, context)` ist die spätere P02-Schnittstelle:
Der Aufrufer muss ein vom Korrektor erzeugtes Ergebnis auf die vier P01b-
Bindungsfelder plus `status` und `assistance` projizieren. Der Kontext wird erneut
validiert und die Bindung geprüft. Hier wird keine Antwort untersucht und kein
Status `correct` erzeugt. Ein passender Hash bescheinigt keine fachliche Richtigkeit.
In P01c gibt es keinen produktiven Aufrufer; Teststatus sind ausdrücklich synthetisch.

`appendAttempt` ergänzt unveränderlich. `getAttemptOutcome(progress, attemptId,
activeContext)` liefert Status und Unterstützung getrennt, zusätzlich:

| Bedingung | Erfolgreich | Ohne Hilfe |
| --- | --- | --- |
| Aktuelle Bindung, `correct`, `independent` | ja | ja |
| Aktuelle Bindung, `correct`, `hint` / `wordbank` / `clarified` | ja | nein |
| `solution_viewed` | nein | nein |
| `incorrect`, `partial`, `clarify`, `empty`, `technical` | nein | nein |
| Andere Version / anderer Kontext / ungeprüfte Bindung | nein | nein |

Das ist ein konkreter Versuchsnachweis, keine Beherrschungs- oder Klausurreifeaussage.
Ein späterer eigenständiger Versuch ändert frühere Hilfennutzung nicht.
Die Reihenfolge der Versuche ist die Historienreihenfolge. Für dieselbe Aufgaben-
und Instanz-ID bei gleichen Aufgaben-/Rubrik-/Modellversionen darf nach Hilfe
kein späterer Versuch `independent` behaupten. Nach `solution_viewed` bleibt
diese Kennzeichnung für die Instanz erhalten. Widersprüchliche Einträge werden
abgelehnt, nicht still umgeschrieben. Ein neues Beispiel erhält eine neue
Instanz-ID; so kann später ein eigenständiger Nachweis hinzukommen.

## Kontextbindung und Wiederherstellung

Das verbindliche Schema v1 enthält **keinen Kontext-Hash pro Versuch**. Deshalb
wird keine solche Zusatzspalte hineingeschmuggelt. Erfolgreich geprüfte Bindungen
bleiben ausschließlich in einer privaten `WeakMap` im Arbeitsspeicher. Interne
`snapshotProgress`-Kopien erhalten vorhandene Sitzungsevidenz; `parseProgress` und
JSON-Wiederherstellung stellen diese niemals her. Ein geladener Versuch bleibt
mit seinen ursprünglichen Metadaten sichtbar, ist aber `context_unverified`.
Ein bloß gespeichertes oder manipuliertes `correct` erhält keine aktuelle
Erfolgsbestätigung. P02 muss ein neues kontextgebundenes Korrektorergebnis liefern.
Kein Prüfungs- oder Manipulationsschutz gegenüber einem kontrollierten Client.

Aufgaben-, Rubrik-, Modell- und Inhaltsversion müssen jeweils exakt zum aktiven
Kontext passen. Auch Konzentration, Zellprofil, Instanz, Seed und Phase sind über
P01b gebunden. Es gibt keine automatische Aggregation zu Missionserfolgen.

## Speicheradapter

`createProgressStore(contentVersion, acquireStorage?)` lädt einmal beim Erzeugen.
Standard ist der verzögerte, abgesicherte Zugriff auf `window.localStorage`.
Ein injizierbarer minimaler `StoragePort` ermöglicht Tests ohne DOM.

- `getState()` liefert unveränderlich `mode`, `issue`, `progress`, `history`.
- `save(progress)` validiert zunächst; ungültige Daten werfen einen Vertragsfehler
  und ändern keinen Stand. Gültige Daten werden zuerst im Sitzungsspeicher
  gehalten, dann ausschließlich unter `zelllabor11.progress.v1` geschrieben.
- `reset()` leert den eigenen Sitzungsstand und entfernt ausschließlich diesen
  Schlüssel. Bei einem Fehler bleibt der explizite Fehlerstatus sichtbar;
  vorhandene Browserbytes können dann noch nicht gelöscht sein.
- `exportProgress()` und `exportHistory()` liefern auf ausdrücklichen Aufruf
  ausschließlich validierte Metadaten als JSON, ohne Download/Netzwerkzugriff.

`unavailable`, `denied`, `quota` und `storage_error` kennzeichnen Speicherprobleme;
die Sitzung bleibt nutzbar und exportierbar. Nach temporärem Schreibfehler darf ein
erneutes explizites Speichern gelingen. Die spätere UI muss `mode: 'session'`
sichtbar erklären; P01c fügt der informationsgebenden Startseite keinen Speicherfluss hinzu.
Lokaler Browser-Speicher ist kein Backup, `mode: 'local'` keine Haltbarkeitsgarantie.

Beschädigtes JSON, unvollständige/verbotene Felder oder unbekannte Schemaversionen
werden nicht überschrieben. Bei anderer Inhaltsversion wird das gültige alte
Envelope zusätzlich als `history` bereitgestellt; neue Arbeit erfolgt separat in
der Sitzung. Keine fiktive historische Migration. Da das Schema nur eine
Inhaltsversion umfasst, werden unterschiedliche Fassungen nicht vermischt:
Vor einem ausdrücklich gewünschten Neustart kann die alte Historie exportiert
werden. Erst `reset()` gibt den eigenen lokalen Schlüssel für einen neuen Stand
frei. Das ist eine bewusste konservative Grenze des unveränderten v1-Formats.

Vor jedem Schreiben wird unerwartete Änderung des eigenen Schlüssels erkannt
(`storage_changed`, etwa durch einen zweiten Tab) und nicht überschrieben. Das
ist keine atomare Mehrtab-Synchronisation: `localStorage` bietet dafür keine
Transaktion. Automatische Konfliktauflösung und Migrationen sind nicht enthalten.
Fremde Schlüssel werden weder gelesen noch verändert; `clear()` wird nie benutzt.
