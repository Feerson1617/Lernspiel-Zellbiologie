# Bewertungskern P02a – ausschließlich Z1.02

P02b ergänzt [M6.02/process](OSMOSIS.md) mit eigenem Feldprofil und eigener
Fachregel. `term-evaluator.ts` ist die gemeinsame Eingabe-/Kontexthülle;
`term-grammar.ts` bleibt der gemeinsame Parser. Hier stehen die unverändert
geltenden Tonoplast-Regeln. Die gemeinsame Fortschrittsübergabe akzeptiert nur
die vollständig implementierte Z1.02; ein Osmose-Teilfeld ist keine Gesamtaufgabe.

**Codex-Selbstprüfung, keine unabhängige Gegenprüfung und keine Unterrichtsfreigabe.**
Die öffentliche Startseite lädt/benutzt den Korrektor nicht. Keine Bewertung
der anderen sechs Textfelder, längerer Erklärungen oder ganzer Missionen.

## API und Kontextvertrag

```ts
const evaluator = createTonoplastEvaluator(versions);
const context = createTaskContext({
  ...versions, taskId: 'Z1.02', instanceId, seed, phase: 'explain',
  material: { highlightedStructureId: 'tonoplast' }, modelState: {},
});
const result = evaluator.evaluate(context, { fieldId: 'term', text }, assistance);
```

`versions` muss Aufgaben-, Rubrik-, Inhalts- und Modellversion explizit enthalten:
nichtleere technische Labels, höchstens 256 UTF-16-Codeeinheiten, ohne
Rand-Leerzeichen/Steuerzeichen. Die Factory kopiert und friert sie ein. Keine
Defaultversion oder erfundene Simulationsversion. Eine neue Factory ist eine
ausdrückliche Integrationsentscheidung für vom Aufrufer fachlich geprüfte
Fassungen; sie prüft kein externes Versionsregister. Umetikettieren ersetzt
keine Prüfung veränderter Aufgaben/Rubriken und ist keine Migration.

Grundlage: `spec/tasks.json` → Z1.02, Feld `term`, Regel `TERM_TONOPLAST`,
Pflichtkriterium `Z1.02.C01`. Das Material markiert ausschließlich die Grenze
des Vakuolenraums. `material.highlightedStructureId: 'tonoplast'` bestätigt
diese Zuordnung technisch, entsprechend der vorhandenen semantischen Struktur-ID.
Fehlt sie oder benennt sie eine andere Struktur, wird `technical` ausgegeben.
Zusätzliche Materialwerte und Modellzustände sind durch P01b gehasht. Die spätere
Ansicht muss diese Markierung tatsächlich zeigen; hier wird kein Modell geprüft.

Jeder Kontext wird mit `parseTaskContext` neu validiert und gehasht. Andere
gültige Versionen liefern `technical` mit aktueller Bindung. Unbrauchbare
Kontexte/Hashes und unbekannte Unterstützung werfen einen Vertragsfehler:
keine erfundenen Identitäten oder Standardhilfen. Die Antwort enthält genau
`fieldId` und `text`; falsches Feld, zusätzliche/ausführbare Eigenschaften und
Nichttext werden ohne fachliches Urteil technisch zurückgewiesen.

## Architektur und Fachregel

| Modul | Verantwortung |
| --- | --- |
| `text.ts` | Normalisierung, vollständige Tokenisierung mit Originalpositionen, begrenzte Editieroperationen |
| `term-grammar.ts` | Endliche T1-Grammatik mit Termen, Namensrahmen, Negation, Kontrast, Identität und Umschließung |
| `tonoplast.ts` | Nur TERM_TONOPLAST-Vokabular/Fachentscheidungen, Versions-/Materialprüfung und ein Pflichtkriterium |
| `result.ts` | Strikte Typen, Schema-Invarianten, Evidenzprüfung und unveränderliche Ergebniskopien |
| `feedback.ts` | Konkrete Feedbackcodes/-texte ausschließlich für dieses Feld |
| `progress.ts` | Ausdrückliche P01c-Übergabe unter aktueller Bindung, ohne Speicherzugriff |
| `../ui/feedback-presentation.ts` | Getrennte Statusfarben, Symbole, Texte und Unterstützungslabels |

Die Runtime importiert keine Redaktion/Testantworten. Das kontrolliert
überführte Lexikon enthält Tonoplast/Vakuolenmembran und die spezifizierte
Flexion Tonoplasten, die Teilansätze Membran/Hülle/Vakuolenhülle/innere Grenze
sowie die fünf bekannten anderen Strukturen. Alle bekannten Formen werden
**vor** Tippfehlerähnlichkeit geprüft. Die Grammatik konsumiert die gesamte
Eingabe und erzeugt Aussagen mit Subjekt, Objekt, Negation und Originalspanne.
Keine beliebige Schlüsselwortsuche und keine vollständige Antwort-Positivliste.

### Nachbesserung nach Gegenprüfung von PR #5

Die Grammatik unterscheidet nun auch `synonymy`, `separates` und
`has_named_boundary`. Zusätzliche Namensrahmen bleiben endliche Satzmuster mit
frei eingesetzten bekannten Konzepten. Unsicherheit mit Doppelpunkt, „doch“,
„meines Wissens“, „es handelt sich um …“ und „könnte/müsste … sein“ verändert
nicht die fachliche Bedeutung. Eine allgemeine Membraneigenschaft ist jedoch
keine strikte Gleichbedeutung mit dem Wort „Membran“.

Kontrollierte Konzeptergänzungen: Plasmamembran/Plasmalemma = Zellmembran,
Kernmembran bzw. Membran um den Zellkern = Kernhülle; Vakuolenraum/Vakuoleninnere
bezeichnen den umschlossenen Raum. Beschreibungen wie „Membran der Vakuole“
oder „Membran zwischen Vakuole und Cytosol“ bleiben allein `partial`; erst
die gefragte Benennung ergänzt das Pflichtkriterium. Allgemeine Membransubjekte
werden weiterhin nicht automatisch als die markierte Struktur aufgefasst.

Aktive/passive Formen von umschließen, begrenzen und umgeben bewahren Richtung,
Objekte und Verneinung. In dieser konkreten Benennungsfrage beziehen sich diese
Muster auf die direkte markierte Vakuolengrenze; eine Zellmembran als diese
Grenze ist falsch. Aussagen über indirekte räumliche Verschachtelung werden
nicht allgemein ausgewertet. „Trennt … von …“ / „grenzt … von … ab“ wird nur
für den Tonoplasten zwischen Vakuolenraum und Cytosol geprüft. Es entsteht
keine allgemeine Relationsbewertung für andere Organellen oder Textfelder.

Einfache Klammer-Appositionen, Schrägstrich und „– also …“ bewerten alle
beteiligten Namen: gleichwertige Benennungen richtig, konkurrierende Strukturen
unklar. Explizite falsche Gleichsetzung oder Negation bleibt falsch. Ein
bekanntes „Danke!“ beendet nicht die Prüfung späterer Textteile. Originalspannen
umfassen auch konsumierte Klammern und Modalendungen; Text wird nicht umgeschrieben.

Die 20 übermittelten Fälle, 40 neue richtige und 48 weitere Fälle stehen in
`tests/fixtures/tonoplast-revision-cases.ts`. Zusätzliche Kreuzprüfungen tauschen
Fachbegriffe in zehn neuen Rahmen aus und hängen an jede neue richtige Antwort
unbekannte bzw. widersprüchliche Aussagen an. Bericht und Grenzen:
`qa/P02a-Nachbesserung.md` / `qa/p02a-revision-review.json`. Diese Fälle sind
Codex-Selbstprüfungen; die erneute unabhängige Gegenprüfung bleibt ausstehend.

Unterstützt sind insbesondere:

- Einzelne Namen mit Artikel/Anführungszeichen; genaue Namensrahmen wie
  „Die Membran heißt X“, „Meine Antwort ist X“, „Das müsste X sein“,
  „Die Membran wird X genannt“ sowie die ausdrücklich bekannte Vakuolenbeschreibung.
- Bekannte harmlose Unsicherheitsrahmen: „vielleicht“, „ich denke/glaube/vermute“,
  „meiner Meinung nach“, „ich bin mir nicht sicher, aber …“; nachgestellte
  „…, denke ich“ und eigenständiges „Danke“ nach einer fertigen Antwort.
- Gleichwertige Namen über `oder`, `und`, `beziehungsweise`/`bzw.` oder
  „…, also …“. Unterschiedliche Strukturen ohne eindeutige Zuordnung → `clarify`,
  auch bei mehreren nur benennenden Sätzen.
- „Nicht A, sondern B“ und „A und nicht B“ mit begrenztem Negationsbereich.
  „Nicht Zellwand“ allein ist ein zutreffender Ausschluss, aber kein Name (`partial`).
- „A ist/heißt B“ / „A = B“ und „A umschließt die Vakuole“ samt passiver Form.
  Verneinte Gleichbedeutung, falsche Gleichsetzung und ausdrücklicher Widerspruch
  liefern `incorrect` mit Belegen. `und`/`aber` zwischen Aussagen setzt auf
  beiden Seiten vollständige Relationsprädikate voraus.

Nomenfragmente werden nicht mit geratenem Negationsbereich aufgeteilt:
„Nicht Zellwand und Tonoplast“ bleibt unklar. Subjekt/Aussageabsicht bleiben
wesentlich: „Die Zellwand ist nicht der Tonoplast“ identifiziert die gefragte
Membran nicht eindeutig. Eine allgemeine Aussage über „eine Membran“ wird nicht
als universelle Identität umgedeutet. Dafür ist Klärung erforderlich. Explizite
Namensrahmen wie „Die Membran ist der Tonoplast“ beziehen sich dagegen auf die
konkrete Frage. Unbekannte relevante Zusätze verhindern Grün.

## Normalisierung und Tippfehler

Jedes Nicht-Leerraumzeichen bleibt erhalten. Verneinungen, Zeitwörter, Zahlen,
Quantifikationen und unbekannte Zusätze werden nicht entfernt. Wörter werden
nach NFC und ohne Locale kleingeschrieben; `ä/ö/ü/ß` werden für Vergleiche zu
`ae/oe/ue/ss`. Originaltext und UTF-16-Offsets bleiben unverändert. HTML und
Instruktionen sind Text, keine Befehle. Steuerzeichen, Bidi-/Nullbreitenformatierung
und ungepaarte Surrogate werden technisch zurückgewiesen; Tabs/Zeilenwechsel/NBSP
sind erlaubt.

Tippfehler betreffen nur isolierte Namen mit mindestens acht ASCII-Buchstaben
nach Normalisierung: ein ausgelassener Buchstabe, eine unmittelbare Verdopplung
oder ein benachbarter Buchstabentausch. Andere bekannte Konzepte müssen mindestens
zwei Levenshtein-Schritte weiter entfernt sein. Ein Nachbartausch kann selbst
zwei Levenshtein-Schritte benötigen. Beliebige Ersetzungen, Abkürzungen wie
„Tono“, Zahlen und fachliche Kontraste werden nicht zu richtiger Bedeutung
umgedeutet. Dies ist eine konservative getestete Sonderregel, kein allgemeiner
Rechtschreib- oder Bedeutungsprüfer.

Über 4096 UTF-16-Codeeinheiten im vollständigen Originaltext → `technical`,
**vor** Normalisierung; kein Präfixurteil und keine Kürzung des Eingabeobjekts.
Nicht verstandene Aussagen unterhalb der Grenze → `clarify`, nicht wegen Länge rot.

## Ergebnisse, Rückmeldungen und Fortschritt

`EvaluationResult` hat die neun Felder des unveränderten Schemas und genau ein
Kriterium `Z1.02.C01`. Rote Ergebnisse enthalten Originalspannen und konkrete
Gründe. Bei Verneinungen wird der Satzrahmen mitbelegt; getrennte widersprüchliche
Sätze haben getrennte Belege. Ungeprüfter relevanter Text verhindert Grün und
setzt `unassessedRelevantText`. Status und Hilfenutzung sind orthogonal.

Die Texte unterscheiden die falsche Zellwand, Zellmembran, Vakuole als Raum,
Kernhülle und Zellkern. Weitere Codes erklären verneinte Benennung, falsche
Synonymie, verneinte Membraneigenschaft, falsche Umschließung, Widerspruch,
Konkurrenz, fehlende eindeutige Benennung und ungeprüften Zusatz. Vollständige
Texte: `feedback.ts`, beispielsweise:

- Richtig: „Richtig: Der Tonoplast grenzt den Vakuolenraum vom Cytosol ab.“
- Zellmembran: „Die Zellmembran begrenzt den Protoplasten nach außen. Gesucht ist hier die Membran um die Vakuole.“
- Vakuole: „Die Vakuole ist der Raum. Gesucht ist der Name seiner Membran.“
- Teilansatz: „Du benennst eine Grenze, aber noch nicht die gesuchte Vakuolenmembran. Ergänze den passenden Namen.“

Grün/✓ gilt nur für `correct`, Rot/✕ für `incorrect`, Gelb mit getrennten
Symbolen/Texten für `partial`/`clarify`/`technical`, Neutral/○ für `empty`.
Das sind geprüfte Präsentationsdaten; eine sichtbare Aufgabenansicht fehlt noch.

`createEvaluatedAttempt(attemptId, result, activeContext)` prüft Ergebnisvertrag
und Kontextbindung erneut. Nur die acht erlaubten Metadaten gehen an P01c;
keine Belege, Rohantworten oder Materialdaten. Kein automatisches Speichern.
Veraltete Ergebnisse werden abgewiesen. `solution_viewed` bleibt erhalten und
bestätigt keine eigenständige Leistung. Der Adapter ist keine Signatur oder
unabhängige Herkunftsprüfung eines beliebig vom Client erzeugten Objekts.

## Selbsttests und verbleibende Grenzen

Eigene Eingaben mit Sollstatus/Begründung: `tests/fixtures/tonoplast-cases.ts`.
Alle 39 unveränderten Z1.02-Redaktionsfälle laufen zusätzlich. Der Content-Test
validiert sämtliche tatsächlichen Ergebnisse beider Bestände mit Python
`jsonschema` gegen `spec/result.schema.json`. `test:content` benötigt dafür seit
P02a ebenfalls `requirements-spec.txt`. Unit-Tests benötigen keine Python-/Browserlaufzeit.

Nicht unterstützte Sprachen, freie Argumentation, unbekannte Begriffe,
verschachtelte/doppelte Negationen, zeitliche Selbstkorrekturen und weitere
Satzkonstruktionen benötigen Klärung. Andere biologische Behauptungen werden
nicht mitbestätigt. Die Tests einschließlich Fehlerregister stehen in
`qa/P02a.md` und `qa/p02a-review.json`. Keine unabhängige 95-%-Erkennungsrate oder
reale Lerngruppenpassung behauptet. Gegenprüfung und echte Geräteprobe stehen
aus. Der zusätzliche P02b-Vertrag steht separat in `OSMOSIS.md`.

### R4: begrenzte Satzbezüge und Negationsbereich

Gemeinsame Syntax ergänzt Feld-/Namensgruppen, ausdrückliche Zweifel an der
Benennung, Verbendstellungen und vorangestellte Begriffe. Fachprofilgebundene
Namensnomen werden über `NamingReferences.names` getrennt übergeben; das ist
keine zusätzliche fachliche Lösung. Bereits negative Synonyme erreichen auch
bei „und nicht“ die Ausschlussschleife. Genau zwei ausdrücklich tentative
Fragen mit verschiedenen Vorschlägen bleiben offen, ohne einzelne falsche
Fragen zu neutralisieren. Aktive Wahl/Originalevidenz in naming-choice bleibt
unverändert. Bericht und sämtliche offenen ursprünglichen Sollabweichungen:
`qa/P02b-Sechste-Nachbesserung.md` / `qa/p02b-r4-results.json`.

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

### R6: begrenzte Reparatur und erreichte Entscheidungsgrenze

Feldgebundene Benennungsrollen, Genitivbezüge („Art des Wassertransports“),
abgeschlossene Wortwahl-Relativsätze und lokale Höflichkeit „, danke“ ergänzen
den bestehenden Vertrag. Originaltokens, Negation und sämtliche Folgesätze
bleiben erhalten. `naming-choice.ts` und die Fragepaar-Regeln sind unverändert.
Die 60 übernommenen R6-Kurzantworten bestehen; die vorher eingefrorenen eigenen
60 erreichen nur 56/60. Das 95-%-Gate bleibt rot, ohne weitere Musterergänzung
für die vier gelben Sätze. Alle 3.580 tatsächlich gemessenen Objekte samt
Original-Soll und ausdrücklich technischen Lückensperren stehen in
`qa/p02b-r6-results.json`, Grenzen in `qa/P02b-Achte-Nachbesserung.md`.
`review/R6-Eingabeempfehlung.md` empfiehlt einen Fachbegriff-Vertrag mit optionaler
Klärung zur Entscheidung. Kein Formatwechsel, keine fachliche Abnahme.
