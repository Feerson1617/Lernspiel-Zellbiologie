# Entscheidungsvorlage: explizite Relationsantwort für M6.02

**Status: vorgeschlagen, nicht implementiert und nicht freigegeben.**
Die vorhandene Eingabeversion `m602-response/1.0.0`, Aufgabenfrage, C01–C03,
Sollwerte und Hilfegeschichte gelten weiter. Diese Vorlage ersetzt keinen Vertrag.

## Anlass und Empfehlung

Die Reparatur beseitigt membranübergreifende Fehlfarben, aber eine kohärente
Grammatik erreicht auf den neuen R2-Kurzantworten nur Richtung 35/45 (77,78 %)
und Volumen 32/45 (71,11 %). Die zuvor eingefrorenen eigenen kurzen Kombinationen
werden 32/32 und 28/28 erkannt. Diese Differenz und die wiederholten Gegenprüfungen
sprechen für eine Begrenzung des Eingabevertrags statt weiterer Satzmuster.
Empfehlung: nach fachlicher Entscheidung eine eigene versionierte Relationshülle
mit ausdrücklich benannten biologischen Slots beauftragen. Bis dahin bleibt die
Freigabe des aktuellen Freitextformats blockiert. Die Grenze wird nicht durch eine
niedrigere Schwelle oder die Auswahl nur bekannter Formulierungen aufgehoben.

## Konkreter Schülerablauf zur Entscheidung

Frage und Material bleiben gleichzeitig lesbar: drei Räume, Gesamtwasserpotenziale
mit Druckanteil in Pa, Membranpermeabilität, frühe Phase. C01 bleibt ein Fachbegriff.
C02 wird von Anfang an angekündigt als „Beschreibe die **Nettobewegung von Wasser**:
von [selbst benannte Quelle] über [selbst benannte Membran] nach [selbst benanntes Ziel].“
C03: „[selbst benannte Bezugsgröße] verändert sich [selbst benannte Änderung].“
Alle Felder starten leer. Vorbelegt werden allein die in der Frage vorgegebenen
Bedingungen (Wasser, Nettobewegung, angezeigter Zeitpunkt), keine gesuchten Antworten.
Als Eingaben zunächst eng begrenzte Begriffs-/Richtungsfelder mit transparent
angekündigten Synonymen; keine verdeckte Suche nach einem vollständigen Satz.
Das fordert Abrufen und Zuordnen. Sichtbar wählbare Karten/Listen wären ausdrücklich
als alternative Auswahlleistung zu kennzeichnen und gesondert fachlich zu entscheiden.

Darunter freiwillig: „Begründe deinen Zusammenhang – diese freie Erklärung wird
hier nicht automatisch bewertet.“ Text bleibt sichtbar im RAM. Der Erfolg der Slots
bestätigt ausschließlich die drei definierten Kriterien, keine frei geschriebene
Erklärungskompetenz. Keine Rohtexte standardmäßig speichern oder übertragen.

Nach Prüfen bleiben die erkannten Beziehungen und offenen Kriterien sichtbar.
Feedback nennt einen erkannten Bezug, die fachliche Unterscheidung und genau eine
nächste Handlung. Eine eigene Überarbeitung ist zuerst möglich. Dann ausdrücklich
abrufbar: Hinweis → Wortbank → Auswahlklärung → Lösung ansehen. Keine automatische
Auswahl. Ein von Anfang an angekündigtes Auswahlformat belegt Auswahlleistung;
eine nach unklarem Freitext geöffnete Auswahlklärung ist dagegen ein neuer
unterstützter Versuch mit Vorgängerbindung. Sie zertifiziert den alten Text nicht
nachträglich und setzt die Hilfehistorie nicht zurück.

## Folgen für bestehende Verträge

- Neue Eingabehülle, z.B. `m602-relation-slots/1.0.0`, erst nach Freigabe festlegen;
  getrennte Aufgaben-/Rubrik-/Inhaltsversionen eindeutig binden. Keine Umdeutung
  vorhandener Einreichungen und keine automatische Migration zu „verstanden“.
- Aufgaben-ID M6.02 und biologische Kriterien C01–C03 bleiben. Die Slots verfeinern
  die Form des Nachweises, nicht das Lernziel. Ein freier Zusatz wird nicht Teil
  eines scheinbar vollständig ausgewerteten Aufsatzes.
- `TaskContext` und `EvaluationResult` weiterverwenden: pro Kriterium aktuelle
  Kontextbindung, tatsächliche Textspanne oder option_id/state_value-Evidenz,
  klarer reasonCode und deklarierter unbewerteter Umfang. Ein freier Zusatz darf
  weder still mitbestätigt noch ohne ausdrückliche Vertragsentscheidung als
  heutiger `additionalStatements`-Erfolgsblocker umgedeutet werden. Dieser Punkt
  muss für die neue Hülle vor Umsetzung entschieden und schematisch geschlossen sein.
- Hilfe-/Versuchshistorie, Auswahlherkunft, sticky help und R9-Vertrauensgrenze
  bleiben. Selbst eingegebene Slots können Abrufleistung belegen; Wortbank/
  Auswahlklärung muss sich in assistance/origin zeigen. Eindeutiges Gesamtresultat
  erst bei drei aktuellen, widerspruchsfreien Kriterien ohne unbewerteten
  **bewertungsrelevanten** Rest. Bei Rekonstruktion kein unabhängiger Erfolgsbeleg.
- Persistiert werden weiterhin ausschließlich die acht zulässigen Metadaten.
  Ob eine reine ursprüngliche Auswahl als independent bezeichnet werden darf,
  braucht eine explizite didaktische Definition; sie darf nicht als unabhängige
  Freitextleistung ausgegeben werden. Kein neues Speicherfeld auf Verdacht.

## Abnahme und späterer P03-Anschluss

Vor Umsetzung: fachliche Genehmigung der Eingabe- und Zusatztextsemantik. Danach
neuer begrenzter Folgeauftrag, Referenzfälle für Slotverwechslung, beide Membranen,
Negation/Zeiten, Hilfen, Material-/Versionswechsel und echte DOM-Wege. Alte
Sprachnenner bleiben als Befund archiviert; ein neues Format macht sie nicht grün.
Neue unabhängige Gegenprüfung vor Übergang. Diese Vorlage genehmigt keinen Wechsel.

P03 anschließend separat: ein durchgängiger Schülerzyklus mit Frage/Material,
Eingabe, Kriterienfeedback, eigenständiger Verbesserung, abgestuften Hilfen,
Kontextwechsel und Fortschritt auf Desktop/iPad; Tastatur, Touch, sichtbarer Fokus
und Bildschirmtastatur prüfen. Kein Implementierungsbeginn in dieser Reparatur.
