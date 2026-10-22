# Metadaten- und Identitätstests (P01a)

`npm run test:content` prüft alle 79 IDs, die unveränderten öffentlichen
Metadaten, 19 Missions-/Modulzuordnungen, die Feld-Allowlist, unveränderliche
Registry-Daten und selbst erstellte negative Struktur-/Referenzfälle.
Negative Fälle verändern nur Kopien im Arbeitsspeicher, keine Quelldateien.

Noch keine Prüfung von Antwortinterpretation, Rubriken oder freigegebenen
Runtime-Aufgaben. Die separate redaktionelle Konzeptprüfung bleibt
`npm run check:spec`; unabhängige Gegenprüfung wird nicht behauptet.
