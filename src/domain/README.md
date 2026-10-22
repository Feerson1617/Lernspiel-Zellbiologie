# Domain-Verträge (P01a/P01b)

Keine DOM-, Three.js-, Speicher- oder `spec/`-Imports. Hier liegen reine Typen,
Identitäten, Kontexte, Einheiten und die Validierung öffentlich zulässiger Daten.

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

| Designvertrag | P01a/P01b |
| --- | --- |
| Aufgaben-/Missionsreferenz als String | Eingrenzung auf exakt vorhandene IDs; bidirektionale Prüfung |
| `Status` und `Assistance` | Dieselben Literalwerte; keine fachliche Auswertungslogik |
| `taskVersion`, `rubricVersion`, `contentVersion`, `modelVersion` | Getrennte readonly-Strings; in P01b ausdrücklich übergeben, validiert und gehasht |
| Aufgabenreferenz mit Versionsfeldern | Erweiterungspunkt `VersionedTaskReference`; keine konkreten Versionswerte vergeben |
| `TaskContext` | In P01b umgesetzt, einschließlich explizitem Modellzustand, Snapshot und Kontext-Hash |
| `Evaluate`, `EvaluationResult`, `AttemptRecord`, `BiologySnapshot` | Fachliche Implementierung bleibt späteren Phasen vorbehalten; P01b prüft ausschließlich Ergebnisbindungen |

`TaskCatalog.schemaVersion = 1` versioniert ausschließlich die neue technische
Metadatenform. Die redaktionelle Schemafassung `1.0` und die Konzeptfassung
werden damit nicht zu einer Aufgaben-, Rubrik-, Modell- oder Lernstandsversion.
Es gibt keine erfundenen Versionswerte für die 79 Aufgaben und keine
Versionsmigration. P01b bindet ausschließlich ausdrücklich übergebene Werte.

Voraussetzungen wie „E2 bei Diagnosebedarf“ bleiben redaktionelle Prosa. Die
Identitätsprüfung interpretiert sie nicht als maschinelle Missionsreferenzen.
Geprüft werden `tasks[].mission_id` und `missions[].tasks` sowie die daraus
explizit erzeugten öffentlichen Felder.

## Unveränderliche Aufgabenkontexte (P01b)

`task-context.ts` stellt `TaskContextInput`, `TaskContext`, `TaskPhase` und
`ContextBinding` bereit. Alle Felder des Designvertrags sind enthalten; die
Aufgaben-ID ist auf die 79 bekannten IDs eingegrenzt. Zusätzlich ist
`modelState` als ausdrücklicher fachlicher Snapshot erforderlich. Bei Aufgaben
ohne Zustandsdaten wird bewusst `{}` übergeben. Renderer, Kamera, DOM, Uhr und
impliziter Zufall gehören nicht in diesen Snapshot.

- `createTaskContext(input)` validiert alle Pflichtfelder, kopiert die Daten
  und friert sämtliche Ebenen ein. Es gibt keine Defaultversion, automatische
  Instanz-ID oder Zufallsseed-Erzeugung.
- Aufgaben-, Rubrik-, Inhalts- und Modellversion bleiben vier getrennte,
  nichtleere Stringfelder. Rand-Leerzeichen und Steuerzeichen sind unzulässig;
  sonst bleiben die Labels unverändert. Eine zusätzliche `modelVersion` im
  Modell-Snapshot muss mit der Kontextversion übereinstimmen. Die Fabrik kann
  ohne ein späteres Modellregister keine fachliche Versionsfreigabe bescheinigen.
- `capturePredictionContext(input)` verlangt `phase: 'predict'`. Vor Änderung
  einer Modellbedingung aufrufen und die zurückgegebene Referenz behalten.
  Die Funktion führt keine Simulation und keine Speicherung durch.
- `parseTaskContext(unknown)` prüft einen vorliegenden Kontext und berechnet
  dessen Hash erneut. Ein kopierter alter Hash bei geändertem Inhalt wird
  zurückgewiesen. Die Funktion implementiert keinen Speicher-/Importdialog.
- `createContextBinding(context)` erzeugt lediglich die vier Bindungsfelder
  aus dem späteren Ergebnisvertrag: `taskId`, `taskVersion`, `rubricVersion`,
  `contextHash`. Sie erzeugt keine Bewertung und keinen Erfolg.
- `isResultForContext(result, activeContext)` liefert nur dann `true`, wenn
  diese vier Felder zum erneut validierten aktiven Kontext passen. Vollständige
  spätere `EvaluationResult`-Objekte dürfen die bekannten übrigen Ergebnisfelder
  enthalten. Deren Kriterien, Farbe und fachlicher Status werden hier **nicht**
  bewertet oder validiert. `true` bedeutet ausschließlich „Kontextbindung passt“.

Ein Ergebnis zum eingefrorenen Vorhersagekontext kann weiterhin zu dieser
Vorhersage gehören, während es nach einem Zustands-/Phasenwechsel nicht mehr
zum aktiven Untersuchungskontext passt. Die spätere UI muss diese Referenzen
bewusst auseinanderhalten; in P01b gibt es noch keine Ergebnisanzeige.

### Kontextidentität

Der Hash ist `sha256-v1:<64 Hexzeichen>` über die UTF-8-Darstellung von
`zelllabor11.task-context.v1\n` gefolgt von kanonischem JSON der zehn Eingabefelder.
`contextHash` selbst ist kein Eingabefeld. SHA-256 wird synchron und ohne Browser-
oder Node-Abhängigkeit durch das exakt fixierte MIT-Paket `@noble/hashes` berechnet.

Alle vier Versionen, Aufgabe, Instanz, Seed, Phase und **alle** übergebenen
Material-/Modellwerte sind enthalten. Objekt-Schlüssel werden rekursiv nach
UTF-16-Codeeinheiten sortiert, ohne Locale- oder Unicode-Normalisierung.
JSON-Escaping und endliche JavaScript-Zahlen bleiben erhalten; `-0` und `0`
gelten als dieselbe Zahl. Array-Reihenfolgen bleiben bedeutsam. Kleine Werte
werden nicht gerundet oder durch eine Toleranz als null behandelt.

Zulässig sind primitive JSON-Werte, einfache Datensätze und dichte Arrays bis
64 Verschachtelungsebenen. Zyklen, `undefined`, NaN/Infinity, BigInt, Funktionen,
Symbole, Accessors, versteckte Felder, sparse Arrays und Klasseninstanzen wie
Date/Map/Set werden ausdrücklich zurückgewiesen. Fehler enthalten Codes,
keine Eingabeinhalte. Geteilte Unterobjekte sind erlaubt und werden kopiert.

Der Aufrufer muss alle bewertungsrelevanten Bedingungen tatsächlich übergeben;
die Domain liest keine externen Zustände nach und interpretiert keine
biologischen Modellannahmen. Ein Hash identifiziert diesen Snapshot, er ist
keine Signatur und kein Schutz vor einem absichtlich manipulierenden Client.

## SI-Konvention und Umrechnung (P01b)

`units.ts` trennt Dimensionen durch `SIQuantity<D> = { dimension, value, unit }`.
`toSI(dimension, value, unit)` verlangt eine explizite Einheit und liefert ein
eingefrorenes SI-Objekt. `fromSI(quantity, targetUnit)` prüft auch zur Laufzeit
Dimension, SI-Tag und Zahl, bevor es einen Anzeigewert liefert.

| Dimension | Intern | Akzeptierte Eingabe-/Anzeigeeinheiten |
| --- | --- | --- |
| Konzentration | `mol/m3` | `mol/m3`, `mol/L`, `mmol/L` |
| Stoffmenge | `mol` | `mol`, `mmol`, `µmol`, `nmol`, `pmol` |
| Volumen | `m3` | `m3`, `L`, `mL`, `µL`, `pL` |
| Druck / Wasserpotenzial | `Pa` | `Pa`, `kPa`, `MPa` |
| Absolute Temperatur | `K` | `K`, `°C` |
| Zeit | `s` | `s`, `min` |

Die API verwendet ASCII `m3` für m³ und exakte, case-sensitive Einheitenlabels;
`µ` ist U+00B5. Es gibt keinen Freitextparser und keine geratenen Aliase.
`1 mol/L = 1000 mol/m3`, `1 mmol/L = 1 mol/m3`, `1 pL = 1e-15 m3`,
`1 MPa = 1e6 Pa`, `20 °C = 293.15 K`, `1 min = 60 s`.

```ts
const concentration = toSI('concentration', 0.3, 'mol/L'); // 300 mol/m3
const volume = toSI('volume', 90, 'pL');                  // 9e-14 m3
const potential = toSI('pressure', -0.42, 'MPa');        // -420000 Pa
const displayedVolume = fromSI(volume, 'pL');            // 90
```

Zahlenstrings, fehlende/falsche Einheiten, NaN/Infinity sowie Überlauf und
Unterlauf zu null führen zu `UnitConversionError`. Es wird nicht abgeschnitten,
gerundet oder still auf null geklemmt. Berechnung erfolgt mit IEEE-754 binary64;
Dezimalwerte sind daher nicht allgemein exakt. Kleine Größen werden in Tests
mit relativer Genauigkeit geprüft, nicht durch große absolute Toleranzen verdeckt.

Die Mengenfunktionen repräsentieren nichtnegative **absolute** Konzentrationen,
Stoffmengen, Volumina und Zeiten; Null ist erlaubt. Temperaturen unter 0 K
werden abgewiesen. Werte mit Druckeinheit dürfen negativ sein, insbesondere
Wasserpotenziale. Vorzeichenbehaftete Stoff-/Volumenaustauschkonten,
Temperaturdifferenzen, zusammengesetzte Raten und biologische Gültigkeitsregeln
benötigen eigene spätere Verträge; sie werden nicht als absolute Mengen umgedeutet.
Modellzeit erhält durch eine Einheitenumrechnung keine empirische Kalibrierung.
Osmotische Teilchenkonzentration wird nicht aus einer Salzformel erraten.
