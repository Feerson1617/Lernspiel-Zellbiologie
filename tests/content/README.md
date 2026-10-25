# Metadaten- und Identitätstests (P01a)

`npm run test:content` prüft alle 79 IDs, die unveränderten öffentlichen
Metadaten, 19 Missions-/Modulzuordnungen, die Feld-Allowlist, unveränderliche
Registry-Daten und selbst erstellte negative Struktur-/Referenzfälle.
Negative Fälle verändern nur Kopien im Arbeitsspeicher, keine Quelldateien.

P02a/P02b ergänzen tatsächliche Runtimeprüfungen der Redaktionsfälle für Z1.02
und M6.02/process sowie Python-jsonschema-Prüfungen der erzeugten Ergebnisse.
Die neuen 40 Osmose-Benennungen werden auf Neuheit gegenüber den anderen
Osmose-Beständen geprüft. Keine Freigabe ganzer Runtime-Aufgaben. Die separate Konzeptprüfung bleibt
`npm run check:spec`; unabhängige Gegenprüfung wird nicht behauptet.
