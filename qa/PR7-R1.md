# PR7 R1 – Relationsgrammatik und zutreffendes Feedback

Grundlage: PR6-Veröffentlichungsreparatur `7a12d11d4c6e6a96efb4be6348202ec3064aebb5`,
nur in Richtung PR7 übernommen. PR6 enthält keine P02c-Implementierung.
Die 21 geschützten Quellen, 79 Identitäten, Sollwerte, Eingabe-/Ergebnisversionen,
Hilfehistorie, Speicherung und Kontext-/Gesamtabschlusslogik bleiben unverändert.

Ursachen: Die bisherigen Prädikatlisten enthielten selbst das vertraglich genannte
„sinkt“ nicht. Subjekt, Wortstellung und Quelle/Ziel waren zu eng gekoppelt.
Zusätzlich markierte `movement` eine nicht geäußerte Einzelbewegung und wählte damit
den falschen bestehenden Feedbackweg.

Reparatur in `src/assessment/m602-relations.ts`: getrennte Slots für Stoff
(Wasser/Saccharose), Einzelbewegung/Nettobilanz, Quelle/Ziel (Zellinneres, Außenraum,
Vakuole), Bezugsgröße (Vakuolenvolumen/Zellwand/Protoplast) und Änderungsprädikat.
Normale Inversion nutzt dieselben Slots. Lokale Negation, ausdrücklich zurückgenommene
Vermutung, widersprüchliche Nettobehauptungen und zeitliche Einschränkungen bleiben
relevant. Dativischer Ort („in der Zelle“) ist kein Bewegungsziel. Unbekannte Reste
führen weiterhin zur Klärung. Keine Satzkorpusabfrage oder unscharfe Richtungsänderung.
„Osmose“/„Wasser bewegt sich“ nutzen nun den vorhandenen `movement`-Feedbackweg;
echte Einzel-/Zweirichtungsbewegung bleibt davon getrennt.

## Sprachprüfung mit vollständigen Nennern

Die gelieferten 282 Hauptfälle plus 360 systematischen Konfigurationen wurden mit
unveränderten Eingaben/Sollwerten übernommen. 34 eigene positive und negative
Slot-, Negations-, Zeit- und Membranfälle wurden vor dem neuen Parserlauf eingefroren;
`qa/p02c-r1-freeze.json` schützt beide Korpora. Sie sind jetzt bekannte Regressionen,
keine unabhängige Abnahme und keine 676 verschiedenen biologischen Lösungen.

| Bestand | Richtung | Volumen |
|---|---:|---:|
| Alle Sollklassifikationen | 313/321 | 313/321 |
| Alle als vollständig richtig festgelegten Fälle | 135/143 | 135/143 |
| Gewöhnliche kurze richtige Relationen | 60/60 | 60/60 |
| Längere richtige Erklärungen | 7/15 | 7/15 |
| Eigene zusätzliche Fälle | 18/18 | 16/16 |
| Falschgrün / Falschrot | 0 / 0 | 0 / 0 |

16 längere richtige Erklärungen bleiben **clarify**, nicht falsch. Ihre ursprünglichen
Sollwerte bleiben `correct`; sie werden im vollständigen Nenner und Fehlerregister
weitergeführt. Ursache: noch nicht sicher zerlegte mehrteilige Begründungen,
Rücknahmen und zeitlich gebundene Zusammenhänge. `npm run report:m602-r1` schreibt
alle 676 vollständigen Runtime-Ergebnisse und jede Abweichung nach
`qa/generated/p02c-r1-results.json`. Der Bericht nennt HEAD, aber keine unabhängige
Freigabe. Die 95-%-Schwelle ist für beide Kurzrelationsfelder erreicht; beim gesamten
Bestand vollständig richtiger Antworten sind es jeweils 94,41 %. Keine Änderung
am Aufgabenformat oder an den Freigabekriterien. Bei künftigem Scheitern neuer kurzer
Fälle wäre ein transparentes Quelle–Ziel-/Bezugsgröße–Änderung-Eingabeformat ein
Entscheidungsvorschlag, keine stillschweigende Sollwertabschwächung.

## Prüfverlauf und Grenzen

Erster gezielter Entwurf: zwei bestehende Regressionen rot (Negation von
„netto kein Wassertransport“, Verwechslung eines Orts mit einem Ziel). Ursachen
behoben, unveränderte bisherige 266 Tests danach grün. TypeScript meldete einen
ungenutzten Callbackparameter; entfernt. Erweiterter gezielter Lauf: 304/304.
Frühe Messung: Volumen-Kurzrelationen 59/60; reguläre Verb-Inversion vervollständigt,
jetzt 60/60. Frühere Fehler bleiben im separaten Prüfarchiv erhalten.
Gezielte neue Chromium-Browserprüfung: 6/6 auf Desktop, Tablet und Mobilprofil.

Neue Unit-Tests prüfen unveränderte Korpora, vollständige kurze Nenner, kritische
Fehlfarben, UTF-16-Evidenz, Zusätze und alle eigenen Fälle. Browserprüfungen führen
alle 642 gelieferten Eingaben durch dieselbe Runtime aus und prüfen den tatsächlich
angezeigten Feedbacktext. Zusätzliche echte negative Vite-Imports schützen die neuen
Prüfdateien. Keine Runtimeimporte der redaktionellen Korpora.

Vollständige Abschlusszahlen, exakte Heads, normale/isolierte Klone und tatsächliche
CI-Jobnachweise stehen im PR und separaten Prüfarchiv. Die vier alten Satzgates
bleiben separat rot. Die bekannten 16 Sprachlücken, neue unabhängige Gegenprüfung,
echte Safari/iPad-Geräte und Lernendenprobe bleiben offen. Kein Merge, Deployment,
Unterrichtsfreigabe oder Beginn einer Folgephase.
