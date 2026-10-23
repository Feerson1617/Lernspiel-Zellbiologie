# P02b – ausschließlich M6.02/process

**Entwicklungsfassung und Codex-Selbstprüfung. Keine Unterrichtsfreigabe.**
Die Startseite lädt keinen Korrektor. `direction`, `volume`, sichtbare
Aufgabenoberfläche, Modelle und Simulationen bleiben unimplementiert.

## API und expliziter Kontext

```ts
const evaluator = createOsmosisEvaluator(versions);
const context = createTaskContext({
  ...versions, taskId: 'M6.02', instanceId, seed, phase: 'explain',
  material, modelState: {},
});
const result = evaluator.evaluate(context, { fieldId: 'process', text }, assistance);
```

`versions` enthält vier getrennte, explizite Aufgaben-, Rubrik-, Inhalts- und
Modelllabels. Keine Versionsnummer einer nicht existierenden Simulation wird
vergeben. Der Aufrufer verantwortet die geprüfte Inhaltsfassung; die Factory
ist kein Versionsregister und keine Migration. Labels müssen wie bei P02a
nichtleer, randbereinigt, steuerzeichenfrei und höchstens 256 UTF-16-Codeeinheiten
lang sein. Sie werden kopiert und eingefroren.

`material` muss genau den Typ `OsmosisMaterial` erfüllen:

| Feld | Erforderlicher Wert |
| --- | --- |
| `cellProfile` | `onion_epidermis` |
| `cellIntegrity` | `intact` |
| `observationPhase` | `early_water_loss_after_solution_change` |
| `waterPotential` | `{ unit: 'Pa', vacuole, cytosol, external }`, explizit endlich, `vacuole > cytosol > external` |
| `waterPermeability` | `{ cellMembrane: true, tonoplast: true }` |
| `sucroseRetention` | `largely_retained` |
| `otherTransport` | `excluded` |

Keine Materialdefaults oder Ableitung aus Saccharosekonzentration. Testzahlen
sind illustrative Materialwerte. Andere Einheiten zuerst mit P01b umrechnen;
dieses Feld korrigiert keine Zahlenantworten. Gleiche Potenziale, etwa direkt
zum Austauschzeitpunkt, passen nicht zum Fall. Zusätzliche Materialfelder werden
konservativ zurückgewiesen. `modelState` muss `{}` sein: noch keine Simulation
oder zweite Quelle biologischer Wahrheit. Ein späterer Modellsnapshot benötigt
einen eigenen Integrationsvertrag. Die didaktische Bearbeitungsphase
`TaskContext.phase` und die biologische Beobachtungsphase sind getrennt gehasht.

P01b validiert jeden Kontext erneut. Fehlende/falsche Voraussetzungen, fremde
gültige Aufgaben/Felder oder Versionen liefern `technical`. Ungültige Kontexte,
NaN/Infinity, manipulierte Hashes und unbekannte Hilfe werfen Vertragsfehler:
ohne gültige Bindung gibt es kein erfundenes Ergebnis. Alte Ergebnisse passen
nach einem Kontextwechsel nicht zum aktiven Fall; gültige neue Materialwerte
können ausdrücklich neu geprüft werden.

## Gemeinsame Architektur, getrennte Biologie

| Modul | Verantwortung |
| --- | --- |
| `text.ts` | Gemeinsame unveränderte Normalisierung/Tokenisierung und Originalpositionen |
| `term-grammar.ts` | Ein Parser mit austauschbarem Feldprofil; ganze Eingabe, Benennung, Negation, Subjekt/Objekt |
| `naming-frames.ts` | Gemeinsame bedeutungsneutrale Antwort-/Begriffsrahmen mit ausdrücklich gebundenen Satzendungen |
| `naming-syntax.ts` | Zusammensetzbare Nominalgruppen, feldgebundene Referenzen, Benennungsverben und verpflichtende Endungen; keine biologischen Antwortwörter |
| `term-evaluator.ts` | Gemeinsame Versions-, Kontext-, Eingabe- und Ergebnishülle, keine Biologie |
| `osmosis-context.ts` | Typ und reine Prüfung ausdrücklich gegebener Voraussetzungen |
| `osmosis.ts` | TERM_OSMOSIS-Lexikon, eigenes Benennungsprofil, Kontraste, Kriterienprüfung C01 |
| `osmosis-feedback.ts` | Differenzierte Gründe ohne Rohtextinterpolation |
| `result.ts`, `../ui/feedback-presentation.ts` | Unveränderter Ergebnisvertrag und getrennte Status-/Hilfendarstellung |

Das Osmoseprofil ersetzt die Standardrahmen für Membranen. Keine Tonoplast-
Bedeutung oder anatomische Beziehung wird als Osmose-Fachregel übernommen.
Tonoplast verwendet die gemeinsame Hülle mit seiner bisherigen Fachlogik.
Alle alten Regressionen laufen mit; keine Runtimeimporte aus Redaktion/Tests.

### Nachbesserung nach Gegenprüfung von PR #6

Gemeinsame Antwort-, Begriffs- und Bezeichnungsrahmen werden aus begrenzten
Subjekten und Prädikaten zusammengesetzt. Persönliche Vermutung/Entscheidung,
„ich tippe/denke an …“, „das nennt man …“, „… wäre meine Antwort“ und bekannte
Unsicherheitsnachträge sind ausdrücklich modelliert. Diese Fragmente enthalten
keine biologischen Antwortwörter. Fachbegriffe kommen erst aus dem jeweiligen
Lexikon; dieselben Rahmen führen mit falschen Begriffen zu konkreten Fehlern
und mit unentschiedenen Alternativen zu Klärung.

Satzendungen wie „ein“, „sagen“, „tippen“ oder das abschließende „ist“ einer
untergeordneten Benennung sind obligatorisch. Die längere passende Struktur
hat Vorrang vor einem kürzeren Unsicherheitspräfix. „Ich tippe nicht auf A,
sondern auf B“ bindet Verneinung und parallele Präposition ausdrücklich;
doppelte Verneinung wird nicht geraten. Ein eingeschobenes „glaube ich“ wird
nur mit genau bekannten Grenzen interpretiert, kein beliebiger Einschub gelöscht.

Begrenzte Kategorieaussagen „Osmose ist eine Form des …“ behandeln die bekannte
Transportklasse; die ausdrückliche Verneinung bleibt erhalten. ATP-Pumpe ist
eine geprüfte aktive Pumpe, kein Schreibfehler für Osmose. Neue Kasusformen
„aktiven/passiven Transports“ ergänzen diese vorhandenen Konzepte. Unbekannte
Zusätze verhindern unverändert Grün; es gibt keine allgemeine Erklärungskorrektur.
Nachweise und getrennte Erkennungsquoten stehen in `qa/P02b-Nachbesserung.md`
und `qa/p02b-revision-review.json`.

### Zweite Nachbesserung: zusammensetzbare Satzstellung

Benennungssubjekt, finites Verb, Voranstellung und optionaler Einschub werden
getrennt kombiniert. Beispiele der Konstruktionen: Subjekt + „lautet“,
„hier“ + Verb + Subjekt, „ich würde“ + Objekt + Name + „nennen“ und Name +
„wäre“ + Benennungssubjekt. Fachspezifische Vorgangsobjekte bleiben im
Osmoseprofil; die Standardrahmen für Membranen bleiben getrennt.
Das gilt auch für untergeordnete Benennungssubjekte und Rückverweise wie
„so heißt der Vorgang“: außerhalb des Osmoseprofils bleiben sie ungeprüft,
statt einen Membrannamen als Prozess zu bestätigen.

`NAMING_MODIFIERS` enthält ausschließlich explizite Benennungs-/Unsicherheits-
fragmente, etwa „hier“, „also“ und „meiner Ansicht nach“. Sie werden nur in
erkannten Benennungsrahmen an Wortgrenzen interpretiert, nie aus wissenschaftlichen
Prädikaten oder beliebigen Resten gelöscht. Pro Lücke sind höchstens drei
Fragmente möglich. Negationen gehören nicht zu diesen Einschüben.
Gleiche Präfixe vereinigen ihre gebundenen Endungsalternativen. Spezifische
Metabenennungen wie „mit A meine ich B“ oder „A ist der Name der B“ behalten
Vorrang vor kurzen unvollständigen Rahmen.

Die 156 übermittelten Gegenprüffälle werden ohne veränderte Sollmengen zu
bekannten Regressionen. Weitere 60 kurze und 20 längere richtige Antworten
sind ein eigener, vor dem ersten Lauf festgelegter Selbstprüfbestand, keine
unabhängige Gegenprüfung. Alle Ergebnisse einschließlich Klärungen und
20 zusätzlicher Feldgrenzfälle:
`qa/p02b-second-results.json`; Nachweis: `qa/P02b-Zweite-Nachbesserung.md`.

## Kontrolliert überführte Fachregel

### Nachbesserung vom 23.10.2026

Der Parser erhält den Unterschied zwischen Eigenschaft, Klassifikation,
Namensgleichsetzung und Gleichbedeutung einschließlich der Negation.
„Osmose ist der Name der Diffusion“ ist eine ungeprüfte Gleichsetzung;
ihre Verneinung ist keine Verneinung passiver Diffusion. Beides bleibt hier
konservativ `clarify`. Umgekehrt bleibt „Osmose ist keine Diffusion“ ein
konkreter fachlicher Fehler. Auch Tonoplast unterscheidet eine Membran-
Eigenschaft von einer unqualifizierten Namensgleichsetzung mit „Membran“.

Die neue Satzsyntax kombiniert explizite Nominalgruppen und Verweise mit
Benennungsverben. Prozessreferenzen werden ausschließlich aus dem Osmoseprofil,
Membranreferenzen aus dem Tonoplastprofil gelesen. Genitivische Namensrelationen
dürfen auch mit Einschüben nicht in eine umgekehrte Antwortbenennung fallen.
Unbekannte Reste, biologische Qualifikatoren und Verneinungen werden nie als
Füllwörter gelöscht. „Es ist in Wirklichkeit …“ darf nur eine frühere einzelne
Benennung ausdrücklich korrigieren; wissenschaftliche Aussagen bleiben erhalten.

Neue vollständige Rohresultate und dokumentierte Nachbeurteilungen des
übermittelten Bestands: `qa/p02b-third-results.json`.
Nachweise/Grenzen: `qa/P02b-Dritte-Nachbesserung.md` und
`qa/p02b-third-review.json`. WebKit läuft getrennt mit unveränderten Standard-
Tab-Prüfungen und ausgewiesenem Plattformprofil; eine echte iPad-Probe fehlt.

### Vierte Nachbesserung / R2 vom 23.10.2026

Bestätigende Wiederholung und synonyme Wiederbenennung bleiben zwei positive
Benennungsaussagen mit beiden Originalspannen. „Es/Das ist in Wirklichkeit …“
erzeugt nur bei einem anderen vorherigen Einzelbegriff einen Kontrast. Die
Widerspruchsprüfung gleicher IDs in echten Ausschlüssen bleibt bestehen.
Fachliche Aussagen, Alternativen und ungeprüfte Reste werden nicht zurückgenommen.
Eine weitere Änderung einer schon korrigierten Einzelbenennung oder einer
Kontrastauswahl überschreitet den hier unterstützten T1-Umfang: `clarify` mit
vollständiger Originalevidenz. Dadurch wird eine zurückgenommene Zwischenbenennung
nicht als weiterhin aktiver Fachfehler gewertet. Eine bloße Bestätigung der
bereits gewählten Benennung bleibt auswertbar; echte Ausschlüsse bleiben erhalten.

Zusätzliche Satzkonstruktionen kombinieren nominale Wortwahl, Teilfragenbezug,
Benennungsverben und notwendige Schlussverben. Referenzen haben eine begrenzte
Verschachtelung. Feldobjekte haben Vorrang vor der Interpretation als biologische
Wiederbenennung; bei expliziten biologischen Begriffen bleiben beide Seiten als
Gleichsetzungsrelation erhalten. Keine neuen Fachkriterien oder Textfelder.

Nachweis: `qa/P02b-Vierte-Nachbesserung.md`, `qa/p02b-fourth-review.json` und
`qa/p02b-fourth-results.json`. 176 Haupt-, 34 Diagnose- und 368 bekannte Fälle
sind Regression; 40 zusätzliche neue Kurzbenennungen sind Selbstprüfung.
Längere richtige Erklärungen bleiben mit allen gelben Ergebnissen im Nenner.
Zwölf zusätzliche Rücknahme-Diagnosen werden getrennt von der Sprachquote berichtet.
WebKit-Standard-Tab-Fehler bleiben offen; weitere Gegenprüfung muss neue Fälle nutzen.

### Fünfte Nachbesserung / R3

`resolveNamingChoices` trennt aktive Benennungen von allen Originalbelegen.
Wiederholungen und Bestätigungen derselben positiven Begriffs-ID zählen zu einer
Wahl. Eine ausdrückliche Korrektur nimmt alle zugehörigen Namensaussagen zurück;
wissenschaftliche Prädikate, Ausschlüsse und konkurrierende Alternativen bleiben
aktiv. Ein weiterer tatsächlicher Wechsel bleibt `clarify`. Beide Fachadapter
reichen die vollständige, getrennt erfasste Originalevidenz weiter; biologische
Bewertungsregeln und öffentliche Evaluator-APIs bleiben unverändert.

Weitere endliche Nominal-/Verbkonstruktionen behandeln unter anderem deiktische
Fragebezüge, Modal-/Perfektformen und Wortwahl mit notwendigen Schlussverben.
Negative Präfixe und gleichbedeutende wiederholte Ausschlüsse bleiben erhalten.
Keine freie Erklärungskorrektur: sieben längere wissenschaftliche Aussagen des
neuen Hauptbestands bleiben mangels implementierter Fachlogik ungeklärt; Roh-Soll
und tatsächliches Ergebnis werden nebeneinander berichtet. Ein engerer versionierter
Eingabevertrag ist als Entscheidungsvorlage dokumentiert, nicht implementiert.

Bericht und Grenzen: `qa/P02b-Fuenfte-Nachbesserung.md`, Manifest:
`qa/p02b-r3-review.json`, alle 1501 tatsächlichen Resultate:
`qa/p02b-r3-results.json`. Die 183/240/20 gelieferten und 578 bekannten Fälle
sind nach Reparatur Regression; vier Haupt-/Systematiküberschneidungen bleiben
sichtbar. Die 60 neuen eigenen kurzen Antworten sind Selbstprüfung.

Grundlagen: C, M6.02 in F/`spec/tasks.json`, `TERM_OSMOSIS`, `M6.02.C01`,
alle 13 unveränderten Redaktionsfälle. Keine vollständige Antwort-Whitelist.

- `correct`: eindeutige Benennung Osmose, bekannte Satzrahmen sowie vier exakt
  geprüfte Schreibvarianten `Osmosse`, `Ossmose`, `Osmosee`, `Osmsoe`.
  Keine allgemeine kurze Fuzzy-Suche; andere ähnliche Wörter bleiben unklar.
- `partial`: Diffusion, Wasserbewegung, Wassertransport. Eng zugeordnete Formen
  „Diffusion von Wasser“ / „Transport von Wasser“ präzisieren diese dokumentierten
  Konzepte. „Passiver Transport“ allein erhält ohne dokumentierten spezifischen
  Teilansatz konservativ `clarify`, keine erfundene Fehlvorstellung.
- `incorrect`: aktiver Transport/aktive Pumpe, Endocytose/Endozytose,
  Exocytose/Exozytose oder Plasmolyse als Vorgangsbenennung; ausdrücklicher
  Ausschluss von Osmose oder eine konkret falsche bekannte Eigenschaft.
- `clarify`: unentschiedene Namen, unbekannte Bedeutung/Restbehauptung, unklarer
  Negationsbereich, fremde Membranrahmen und ungeprüfte Kausal-/Richtungs-/
  Volumenaussagen. Plasmolyse als Zellreaktion ist von ihrem Transport getrennt.
- `empty`: Leerraum. `technical`: Format, Steuerzeichen, vollständige Überlänge,
  nicht passender Fall, Feld oder Version. Keine fachliche Abwertung.

Osmose ist hier Diffusion von Wasser bzw. passiver Wassertransport. Diese
Eigenschaft wird nur mit Subjekt Osmose und kopulativem „ist“ bestätigt;
„Osmose ist ein anderer Name für Diffusion“ ist keine geprüfte Gleichbedeutung.
`oder`, `und`, Schrägstrich/Klammern zwischen spezifischem und allgemeinem Begriff
bleiben unentschiedene Benennungen. „Osmose, also passiver Wassertransport“
erläutert dagegen den identifizierten Namen mit einer bekannten Eigenschaft.
Mehrgliedrige Mischungen werden nicht geraten.

„Nicht Diffusion, sondern Osmose“ präzisiert die Benennung. „Osmose ist keine
Diffusion“ verneint eine zutreffende Eigenschaft und ist falsch. „Osmose und
nicht Diffusion“ lässt diesen Bezug offen und bleibt unklar. Unsicherheit allein
ändert die Fachlichkeit nicht. Ungeprüfte relevante Zusätze verhindern Grün;
spätere bekannte Gegenaussagen bleiben falsch, auch nach „Danke!“. Originaltext
und UTF-16-Positionen bleiben erhalten. Über 4096 Codeeinheiten im vollständigen
Text gibt es einen technischen Hinweis, keine Präfixbewertung. Rot enthält
immer Kriterium, Grund und Evidenz.

## Teilfeldstatus und Fortschritt

`EvaluationResult.status` gilt hier nur für process/C01, keine Gesamtbewertung
von M6.02 mit drei Pflichtkriterien. `createEvaluatedAttempt` akzeptiert derzeit
nur die vollständig implementierte Z1.02 mit ihrem einen Pflichtkriterium.
M6.02-Teilfeldergebnisse werden unabhängig von Hilfe/Status mit
`IncompleteTaskAssessmentError` abgewiesen. Eine spätere fachlich geprüfte
Gesamtbewertung benötigt eine spätere Integration; das Persistenzschema bleibt
unverändert. Hilfe bleibt orthogonal: richtig mit Hinweis bleibt richtig und
unterstützt. Kein automatisches Speichern/Exportieren von Rohtexten oder Ergebnissen.

## Prüfumfang und Interpretationsgrenzen

`tests/fixtures/osmosis-cases.ts`: 91 Implementierungsfälle, 40 zusätzliche
natürliche richtige Antworten (16 kurze Benennungen, 24 breitere Sprachfälle)
und 20 weitere Negativ-/Grenzfälle. Alle 13 Redaktionsfälle und die tatsächlichen
Resultate laufen in Content-/Schematests. Weitere Fachbegriffsaustausche,
Gegenbehauptungen und Kontextwechsel prüfen falsches Grün/Rot. Beide Korrektoren
laufen gemeinsam im Browserbundle.

Die Grenzfälle enthalten auch plausible Aussagen über andere M6.02-Teilfragen,
etwa „Osmose. Wasser fließt nach außen“ oder „Die Vakuole schrumpft durch Osmose“.
Sie bleiben wegen des nicht geprüften Zusatzes `clarify`; die 40er-Quote behauptet
kein Verstehen solcher übergreifenden freien Erklärungen. Auch komplexe Negation,
wechselnde Zeitbezüge, Quantifikation und weitere Sprachen bleiben begrenzt.

Tatsächliche Quoten, Fehlversuche und Fehlerregister: `qa/P02b.md` /
`qa/p02b-review.json`. Alle Codex-Prüfungen sind Selbstprüfungen. Neue unabhängige
Gegenprüfung sowie echtes Safari/iPad stehen aus. **Kein P02c.**

### Sechste Nachbesserung / R4

Begrenzte Syntax für Feldbezüge, Benennungsverben, Namensgruppen und Zweifel
wird von beiden Fachprofilen genutzt. Negative Nachstellungen bleiben negativ;
„Vielleicht keine …? Vielleicht …?“ mit zwei verschiedenen ausdrücklich
vorläufigen Vorschlägen bleibt als Fragepaar offen. Einzelne falsche Vorschläge,
bestimmte Ausschlüsse und wissenschaftliche Prädikate werden nicht pauschal
neutralisiert. Die frühere Bindung und die aktive Namenswahl bleiben erhalten.
Keine weitere biologische Fachentscheidung oder Erklärungskorrektur wurde
implementiert. 51 neue ursprüngliche Sollabweichungen bleiben ausdrücklich
Implementierungslücken. Nachweis: `qa/P02b-Sechste-Nachbesserung.md`, vollständige
Rohwerte in `qa/p02b-r4-results.json`. Keine unabhängige Freigabe.

### R5: Benennungsrollen und tentative Fragepaare

Finite Dativzuweisung, Benennungsverben, Namensnomen/-adjektive und Wortstellungen
werden feldbezogen zusammengesetzt. Ein Index fester Starttokens ändert weder
Slots noch längstes Präfix oder Pflichtendungen. Zwei vollständig gelesene
„Vielleicht …?“-Benennungsfragen mit unterschiedlichen Konzepten oder Polaritäten
bleiben in beiden Reihenfolgen clarify. Einzelne falsche Fragen, bestimmte
Ausschlüsse und zusätzliche falsche wissenschaftliche Prädikate bleiben getrennt.
Zwei ursprüngliche eigene R4-Frage-Sollwerte stehen ausdrücklich neben der
revidierten Lesart; alle gelieferten Rohtexte/IDs/Sollwerte bleiben unverändert.
Begrenzter Ausnahmeumfang, keine allgemeine Interpretation von Fragefolgen.
Bericht: `qa/P02b-Siebte-Nachbesserung.md`; alle offenen ursprünglichen Sollwerte
in `qa/p02b-r5-results.json`. Keine unabhängige Freigabe. Der reviewbare engere
Vertrag in `review/naming-input-0.2-decision.md` bleibt ein Entwurf.
