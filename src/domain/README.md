# Domain-Verträge (P01a)

Keine DOM-, Three.js-, Speicher- oder `spec/`-Imports. Hier liegen reine Typen,
Identitäten und die Validierung der öffentlich zulässigen Metadaten.

- `identities.ts`: feste, ausdrücklich aufgelistete 79 Aufgaben-IDs und 19
  Missions-/Modul-IDs. `TaskId`, `MissionId`, `TaskIdFor<M>` und exakte Type Guards.
  Keine Normalisierung, keine aus Zahlenbereichen geratenen IDs. Diese Liste
  wird durch Metadatengenerierung nicht überschrieben.
- `contracts.ts`: `TaskIdentity` als diskriminierte Union, `TaskMetadata`,
  `MissionMetadata`, `TaskCatalog`, `Status` und `Assistance`.
  Aufgaben-/Missionspaare müssen auch im TypeScript-Vertrag zusammenpassen.
- `catalog.ts`: `parseTaskCatalog(unknown)` und `createTaskRegistry(unknown)`.
  Vollständigkeit, Eindeutigkeit und beide Zuordnungsrichtungen werden geprüft.
  Fehler enthalten Codes und strukturelle Pfade, keine gelieferten Inhalte.
  Ergebnisse werden neu erstellt und tief eingefroren; interne Maps bleiben
  in Closures. `getTask(TaskId)` und `getMission(MissionId)` liefern ausschließlich
  validierte Einträge. Unbekannte Strings erst mit den Type Guards prüfen.

## Kontrollierte Überführung von `spec/contracts.d.ts`

| Designvertrag | P01a |
| --- | --- |
| Aufgaben-/Missionsreferenz als String | Eingrenzung auf exakt vorhandene IDs; bidirektionale Prüfung |
| `Status` und `Assistance` | Dieselben Literalwerte; keine fachliche Auswertungslogik |
| `taskVersion`, `rubricVersion`, `contentVersion`, `modelVersion` | Nur struktureller Vertrag `VersionInfo` mit readonly-Strings |
| Aufgabenreferenz mit Versionsfeldern | Erweiterungspunkt `VersionedTaskReference`; keine konkreten Versionswerte vergeben |
| `TaskContext`, `Evaluate`, `EvaluationResult`, `AttemptRecord`, `BiologySnapshot` | Noch nicht implementiert; Kontext/Einheiten/inhaltliche Versionsbindung gehören zu P01b bzw. späteren Phasen |

`TaskCatalog.schemaVersion = 1` versioniert ausschließlich die neue technische
Metadatenform. Die redaktionelle Schemafassung `1.0` und die Konzeptfassung
werden damit nicht zu einer Aufgaben-, Rubrik-, Modell- oder Lernstandsversion.
Es gibt keine erfundenen Versionswerte für die 79 Aufgaben und keine
Versionsmigration oder Kontext-Hash-Berechnung.

Voraussetzungen wie „E2 bei Diagnosebedarf“ bleiben redaktionelle Prosa. Die
Identitätsprüfung interpretiert sie nicht als maschinelle Missionsreferenzen.
Geprüft werden `tasks[].mission_id` und `missions[].tasks` sowie die daraus
explizit erzeugten öffentlichen Felder.
