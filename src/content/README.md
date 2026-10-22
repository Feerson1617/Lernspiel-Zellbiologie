# Öffentliche Metadaten (P01a)

`task-catalog.ts` stellt `taskRegistry` bereit. Die Startseite importiert diesen
Katalog noch nicht; es werden keine Missionen freigeschaltet oder Aufgaben
angeboten. Ein eigener Buildtest prüft den tatsächlich gebündelten Katalog.

```ts
import { taskRegistry } from './task-catalog.ts';

const metadata = taskRegistry.getTask('Z1.01');
const mission = taskRegistry.getMission(metadata.missionId);
```

## Veröffentlichungsgrenze

| Öffentlich zulässige Daten | Quelle/Überführung |
| --- | --- |
| `TaskMetadata.id`, `title`, `type` | Unverändert aus `spec/tasks.json` |
| `TaskMetadata.missionId` | Reine Umbenennung von `mission_id` |
| `TaskMetadata.publicationStatus` | In P01a ausschließlich `draft`; niemals eine Unterrichtsfreigabe |
| `MissionMetadata.id`, `title` | Unverändert aus `spec/missions.json` |
| `MissionMetadata.taskIds` | Unveränderte IDs/Reihenfolge aus `missions[].tasks` |
| `TaskCatalog.schemaVersion` | Version 1 der technischen Metadatenstruktur |

Alle anderen Felder werden in P01a **nicht** exportiert. Dazu gehören
Aufgabenstellung, Materialien, Antwortmöglichkeiten/-schlüssel (`expected`,
`response_spec`), Kriterien, Rubriken, Referenzantworten, `feedback`, Hilfen,
Fehlvorstellungen, Quellenverweise und redaktionelle Freigabe-/Prüfdaten.
`reference-fixtures.json`, `text-rubrics.json`, Modellreferenzen und sämtliche
JSON-Schemata bleiben im Entwicklungs-/Prüfbereich. P01a veröffentlicht keine
fachlichen Erwartungshorizonte. Private Originalklausuren und deren
Erwartungshorizonte gehören vollständig außerhalb dieses Repositories.

`catalog-data.ts` wird ausschließlich mit einer expliziten Feld-Allowlist
erzeugt. Der Entwicklungshelfer `tools/catalog-source.ts` darf die Redaktion
lesen; Runtime-Module dürfen ihn oder `spec/` nicht importieren. Der Parser
weist unbekannte Felder zusätzlich zurück, statt sie durchzureichen.

```sh
npm run check:catalog     # read-only: Projektionsvergleich und Identitätsprüfung
npm run generate:catalog  # nur bei autorisierter Metadatenänderung; Diff prüfen
npm run test:content      # alle 79 Zuordnungen und eigene negative Fälle
```

Die Generierung ändert ausschließlich diese Metadatendatei. Unbekannte,
doppelte, fehlende oder widersprüchliche IDs werden zurückgewiesen; die feste
Identitätsliste und die Fachspezifikation werden nicht automatisch angepasst.
Ein veraltetes oder manuell verändertes Metadatenartefakt blockiert den Build.
