# Entscheidungsvorlage naming-input/0.2-draft

**Nicht beschlossen, nicht implementiert, keine Freigabe.** Ergänzt die Vorlage
im R4-Bericht. Originalaufgaben, Rubriken und heutiger Runtimevertrag bleiben
bis zu einer ausdrücklichen fachlichen Entscheidung unverändert verbindlich.

Aktuelle kurze [Entscheidungsvorlage nach R7](P02b-Eingabeentscheidung.md):
Option b wird empfohlen, ist aber nicht beschlossen. Der Fortschrittsadapter
muss vor jeder Übernahme den gesamten Ergebnisumschlag einschließlich Zusätzen
prüfen, auch bei Z1.02. Ein grünes `termResult` allein genügt nicht.

## Anlass und Entscheidung

**Aktualisierung nach R6:** Die Entscheidungsgrenze ist mit unabhängig 43/60
(71,67 %) erneut deutlich unterschritten. Der Entwurf wird jetzt ausdrücklich
als künftiger Eingabevertrag empfohlen. Der [R6-Vergleich und Entscheidungsvorschlag](R6-Eingabeempfehlung.md)
begründet den begrenzten Lernwert zusätzlicher Metasätze und den Stopp weiterer
unbegrenzter Musterergänzung. Er bleibt unbeschlossen und nicht implementiert.

Die frische R5-Gegenprüfung erkennt 29/60 kurze richtige Osmosebenennungen,
obwohl die bekannten R4-Kurzantworten bereits 60/60 erreichen. Weitere bekannte
Rahmen oder eigene grüne Tests belegen keine allgemeine Spracherkennung.
Deshalb ist fachlich zu entscheiden, ob die Eingabe künftig eine ausdrücklich
begrenzte Benennung statt beliebiger Metasätze verlangt. Der Entwurf verspricht
keine höhere Lernwirksamkeit und ersetzt keine gesonderte neue Gegenprüfung.

Zu entscheiden sind gemeinsam: Schülerwortlaut, zulässiger Aussageumfang,
Behandlung weiterer Aussagen, Korrekturhandlung, Versionswechsel und
Abnahmekriterien. Ein bloßer technischer Formatwechsel genügt nicht.

## Sichtbare Eingabe und Rückmeldung

Die Originalfrage bleibt sichtbar. Daneben steht eindeutig das geprüfte Feld,
bei M6.02 „a) Name des Wassertransportvorgangs“, bei Z1.02 die markierte Grenze.

> **Begriff** — Trage den Namen ein. Ein Begriff genügt.
>
> **Weitere Aussagen (optional)** — Diese Aussagen bleiben sichtbar. Sie werden
> in diesem Benennungsfeld noch nicht fachlich geprüft.
>
> **Benennung prüfen**

Keine automatische Extraktion eines Begriffs aus bisherigen Sätzen. Eingaben,
die über den beschlossenen Umfang hinausgehen, bleiben sichtbar und erhalten
Klärung. Eine Längenempfehlung ist keine fachliche Mindestleistung; die
bestehende technische Obergrenze von 4096 UTF-16-Codeeinheiten bleibt getrennt.
Falsche Begriffe, Verneinung und konkurrierende Alternativen werden nicht
herausgefiltert. Gleichwertige Synonyme bleiben gemäß C gleichwertig.

Beispiel einer notwendigen sichtbaren Umfangsrückmeldung:

> ✓ Benennung: Richtig. Geprüft wurde nur der Name des Wassertransportvorgangs.
>
> ? Weitere Aussagen: Noch nicht bewertet. Daraus folgt kein grünes Gesamturteil.
>
> Die Teilfragen b) Richtung und c) Volumen sind weiterhin offen.

„Vorigen Versuch korrigieren“ erzeugt eine neue Eingabe mit sichtbarem Bezug
auf genau diesen Versuch. Die frühere Bewertung wird nicht rückwirkend richtig.
Ein eigener Korrekturwunsch entfernt keine wissenschaftlichen Aussagen aus der
vorherigen Eingabe. Wenn eine Auswahlklärung/Wordbank hilft, wird die neue
Hilfenutzung ausdrücklich und unabhängig von der Farbe ausgewiesen.

## Dokumentarischer Datenvertrag

Nur ein Vorschlag; keine neue Datei unter src und kein Import in die Runtime:

```ts
type NamingSubmissionDraft = Readonly<{
  formatVersion: 'naming-input/0.2-draft';
  taskId: 'Z1.02' | 'M6.02';
  fieldId: 'term' | 'process'; // exakt Z1.02/term oder M6.02/process
  attemptId: string;
  context: TaskContext;      // bestehende vollständige immutable Bindung
  assistance: Assistance;   // keine aus Richtigkeit erratene Hilfe
  termText: string;
  additionalStatements: readonly string[];
  action: Readonly<{ kind: 'initial' }> | Readonly<{
    kind: 'replace';
    previousAttemptId: string;
    previousContextHash: string;
  }>;
}>;

type NamingOutcomeDraft = Readonly<{
  formatVersion: 'naming-input/0.2-draft';
  attemptId: string;
  assessedScope: 'term_only';
  termResult: EvaluationResult;
  additionalStatements: Readonly<{ status: 'not_assessed'; count: number }>;
  overallStatus: Status;    // bei ungeprüften Zusätzen niemals correct
}>;
```

Benötigte Invarianten vor einer Umsetzung:

- Nur die beiden konkreten Aufgaben-/Feldpaare zulassen; kein direction/volume.
- Alle vier Versionswerte vom fachlich verantworteten Aufrufer übernehmen,
  Material-/Modellzustand/Phase/Seed unverändert hashen und validieren.
- Korrektur muss einen vorhandenen vorherigen Versuch und dessen ursprünglichen
  Kontext eindeutig treffen. Veralteter/gefälschter Bezug erzeugt einen
  technischen Hinweis, kein erfundenes fachliches Urteil.
- Aktiver Kontextwechsel verlangt eine neue Prüfung unter dem neuen Kontext.
  Die vorige Bewertung bleibt historisch gebunden und wird nicht übertragen.
- termResult bestätigt ausschließlich die Benennung. Bei weiteren ungeprüften
  Aussagen overallStatus clarify; bei einem sicher falschen Teil kein grünes
  Gesamtbanner. Ergebnis und Unterstützung bleiben unabhängig.
- M6.02/process wird auch im neuen Format niemals als fertige M6.02 gespeichert.
  Z1.02 benötigt weiterhin seine vollständige gebundene Bewertung einschließlich
  des vollständigen Umschlags; ungeprüfte relevante Zusätze verhindern auch hier
  einen vollständigen Erfolg. Kein isoliertes termResult an den alten Adapter.
- Rohtexte und Korrekturverknüpfungen zunächst ausschließlich im Sitzungsspeicher;
  keine Telemetrie, keine externe Bewertung, keine stillschweigende Erweiterung
  des heutigen Acht-Metadatenfelder-Speichervertrags.

## Versionierung und Migration

Die endgültige Format-ID darf erst nach fachlicher Entscheidung vergeben werden;
die Draft-ID ist keine freigegebene Inhalts-/Rubrik-/Modellversion. Bei geänderter
Aufgaben-/Bewertungsreichweite Aufgaben-, Rubrik- und Inhaltsversion ausdrücklich
festlegen. Keine erfundene Simulationsversion. Heutige Verträge in spec bleiben
bis zum ausdrücklich begründeten Änderungsauftrag unangetastet.

Alte Versuche behalten ihren bisherigen Vertrag und Kontext. Keine automatische
Aufteilung alter Rohtexte, kein nachträgliches Grün, kein Rückdatieren eines
supported-Versuchs als independent. Historische Sollwerte/Rohbefunde bleiben
sichtbar. Kein Löschen fremder Browserdaten oder globales Zurücksetzen.
Eine künftig wirklich benötigte Persistenzänderung erfordert eine eigene
versionierte, getestete Migration; die bestehende schemaVersion 1 wird hier
nicht verändert. Gespeicherte Metadaten verleihen weiterhin kein aktuelles
Kontextvertrauen ohne erneute Prüfung.

## Abnahme vor einer Umsetzung/Freigabe

1. Fachlicher Beschluss über Wortlaut, Feldumfang, Zusatzdarstellung und Migration.
2. Gesonderter Umsetzungsauftrag; keine automatische Erweiterung dieses P02b-PR.
3. Frischer getrennt entwickelter Bestand mit mindestens 60 natürlichen
   vollständigen Benennungen im dann beschlossenen Vertrag, dazu falsche,
   teilweise, mehrdeutige, negative und widersprüchliche Eingaben. Mindestens
   95 %, alle gelben im Nenner, keine kritischen Fehlfarben.
4. Originale bisherigen Sätze und ihre Nenner als historische/Legacy-Prüfung
   erhalten. Die aktuelle 95-%-Messung wird nicht eigenmächtig umdefiniert.
5. Sichtbare Umfangsrückmeldung, Zusätze, Korrekturbezug, Hilfe, Kontextwechsel,
   Tastatur-/Touchbedienung und Speicherausfall tatsächlich prüfen.
6. Vollständige Regression Z1.02/M6.02, Datenschutz, Veröffentlichungsschutz,
   WebKit-Gate und benannte reale Safari-/iPad-Geräte bestehen lassen.

Bis dahin bleiben das gegenwärtige Freigabekriterium und NICHT MERGE bestehen.

## Getrennter Vorschlag für Schutz und Deployment

Keine administrative Aktivierung und keine Workflowänderung dieses Entwurfs.
Für einen späteren ausdrücklich autorisierten Schutzauftrag konkret:

- Main-Regel mit Pflichtchecks `build` und `webkit`, erforderlichem Review und
  ohne automatischen Merge konfigurieren; genaue Checknamen vorher abgleichen.
- Den WebKit-Job auch beim push auf main tatsächlich ausführen.
- Deployment erst nach `needs: [build, webkit]`; nie einen übersprungenen oder
  roten WebKit-Job als Freigabe lesen.

Der aktuelle main-Zustand ist ungeschützt, Rulesets leer. Seit R7 verlangt der
JSON-Vorschlag beide Checks build und webkit; der getrennte Workflow-Patch
passt Ausführung auf main und Deployment-Abhängigkeiten dazu an. Beide sind
nicht aktiviert. Eine Schutzkonfiguration behebt weder Sprachlücken noch die
drei offenen Standard-Tab-Fokusfehler.
