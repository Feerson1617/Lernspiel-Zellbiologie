# Entscheidung nach R6: Fachbegriff-Eingabe statt weiterer Parserausweitung

**Empfehlung zur fachlichen Entscheidung; nicht beschlossen oder implementiert.**
Stand: 23.10.2026. Keine Unterrichtsfreigabe, kein Merge von PR #6.
Originalaufgaben, Rubriken, Bewertungshöhe und aktuelle Verträge bleiben verbindlich.

**Stand nach R7:** Auf dem Head `8258b6d` erreicht die neue unabhängige Probe
41/60 (68,33 %); auf exakt denselben Fällen zuvor 38/60. Dies sind andere
Antworten als der R6-Nenner. Die [kurze Entscheidungsvorlage a/b](P02b-Eingabeentscheidung.md)
konkretisiert jetzt die empfohlene Option b. Kein fachlicher Beschluss liegt vor;
19 R7- und vier eigene R6-Lücken werden nicht durch zusätzliche Satzmuster ergänzt.

## Die Entscheidungsgrenze ist erreicht

Die unabhängige R6-Prüfung auf `7ca29bdf96b7128969abee663675bda0b480b073`
erkennt 43/60 neue kurze vollständige Osmosebenennungen (71,67 %). Auf genau
diesen Fällen erreicht der ältere Vergleich `dcb8123` 31/60. Die bereits
bekannten R5-Kurzantworten erreichen gleichzeitig 60/60. Diese unterschiedlichen
Stichproben dürfen nicht als fortlaufend vergleichbare Erfolgsquote behandelt
werden. Das Nebeneinander zeigt aber die begrenzte Übertragbarkeit bekannter
grüner Regressionen auf neue übliche Formulierungen.

Die begrenzte R6-Reparatur erkennt die nun bekannten R6-Kurzantworten 60/60.
Die vor dem ersten Lauf eingefrorene eigene Stichprobe erreicht 56/60
(93,33 %, vier gelbe bleiben im Nenner). Das ist keine unabhängige Bestätigung.
Für diese vier Sätze werden in diesem Auftrag keine weiteren Muster ergänzt.
Die aktuelle 95-%-Qualitätsprüfung bleibt deshalb ausdrücklich rot.

**Konkrete Empfehlung:** Die breite Satzbenennung nicht durch weitere
Nachbesserungsrunden zum langfristigen Eingabevertrag machen. Für reine
Benennungsfelder einen ausdrücklich kommunizierten Fachbegriff-Vertrag mit
optionaler Klärung fachlich beschließen lassen. Künftige Parseränderungen auf
nachgewiesene fachliche Fehler und Sicherheitsmängel begrenzen, bis eine
bewusste Formatentscheidung und ein gesonderter Umsetzungsauftrag vorliegen.
Eine weitere bekannte Satzliste oder eine bestandene Selbstprüfung hebt diese
Entscheidungsgrenze nicht auf. Das ist eine Empfehlung, keine eigenmächtige
Beendigung der fachlichen Prüfung oder Änderung der bisherigen Sollwerte.

## Didaktischer Vergleich

Bei „benennen“ wird die passende biologische Identität geprüft. Ein zusätzlicher
deutscher Metasatz belegt keine zusätzliche Fachleistung. Schülerinnen und
Schüler sollen weder „Der Name lautet …“ erraten noch eine richtige Benennung
wegen einer üblichen Formulierung wiederholt umschreiben müssen. Erklärungen,
Begründungen und Vorhersagen benötigen eigene Aufgaben und überprüfbare
Kriterien; ein Begriffsfeld kann sie nicht ersetzen.

| Kriterium | Bisherige begrenzte Satzbenennung | Klar benanntes Fachbegriff-Feld mit Klärung |
| --- | --- | --- |
| Biologische Korrektheit | Erhält erkannte Negation, Widerspruch und fachliche Zusätze; unbekannte Syntax erzeugt häufig Gelb. Unbekannte Formulierungen bleiben schwer abzusichern. | Enger prüfbarer Umfang mit denselben richtigen, falschen und teilrichtigen Begriffen. Zusätze müssen sichtbar ungeprüft bleiben; kein grünes Gesamturteil daraus. |
| Bedienbarkeit | Alltagssätze sind möglich, tatsächlich akzeptierte Form ist vorab schwer erkennbar. | „Ein Begriff genügt“ macht die erwartete Handlung vorhersehbar; keine Satzschablone erforderlich. |
| Motivation | Wiederholte gelbe Rückmeldungen auf fachlich richtige Sätze können als Willkür wirken. | Weniger unnötiges Umformulieren ist plausibel; Wirkung auf Motivation muss mit Lernenden geprüft werden. Wortbank nicht sofort erzwingen. |
| Fehlertoleranz | Viele sprachliche Varianten denkbar, ihre verlässliche Abdeckung ist begrenzt. | Gleichwertige Synonyme, geprüfte Schreibvarianten, Leerraum, Großschreibung und Anführungszeichen zulassen. Unbekanntes sichtbar klären, keine gegensätzlichen Fachbegriffe unscharf umdeuten. |
| Testbarkeit | Unbegrenzter Satzraum; Erfolg auf bekannten Sätzen sagt wenig über neue Sprache. | Explizite Eingabegrenze erlaubt gezielte Tests von Begriffen, Alternativen, Negation, Zusätzen und Hilfen. Keine Garantie absoluter Fehlerfreiheit. |
| Wartbarkeit | Jeder zusätzliche Rahmen erweitert Wechselwirkungen zwischen Metasprache, Bezug, Negation und wissenschaftlichen Prädikaten. | Kleinerer, versionierter Vertrag; fachliche Vokabulare bleiben feldbezogen. Klärungsdialog, Umfangsanzeige und Migration erfordern trotzdem eigene Umsetzung und Tests. |

Kein Lernendenpilot und keine empirische Motivationsmessung wurden durchgeführt.
Auch der engere Vertrag muss unabhängig fachlich und auf echten Geräten geprüft
werden; er ist keine Abkürzung zur Freigabe.

## Vorgeschlagener Eingabevertrag

Die vollständige Originalfrage und das Material bleiben sichtbar. Ein neuer,
zusätzlicher Bedienhinweis lautet: **„Fachbegriff: Ein Begriff genügt. Du musst
keinen Satz schreiben.“** Gleichwertige Mehrwortbezeichnungen bleiben möglich;
„Begriff“ bedeutet nicht „genau ein durch Leerzeichen getrenntes Wort“.

- `Z1.02/term`: Name der markierten Vakuolengrenze. Tonoplast und die bereits
  fachlich zulässigen Synonyme bleiben gleichwertig; ein allgemeines „Membran“
  bleibt teilweise richtig, Zellwand/Kernhülle bleiben fachlich falsch.
- `M6.02/process`: ausschließlich Name des Wassertransportvorgangs/C01. Osmose
  bleibt vollständig, Diffusion bleibt der zu allgemeine Teilansatz;
  Plasmolyse, Endocytose und Exocytose werden nicht zu Lösungen umgedeutet.
  C02 Richtung und C03 Volumen bleiben offen und werden nicht ersetzt.
- Beide Felder: keine automatische Schlüsselwortextraktion aus Sätzen.
  Konkurrenz („Osmose oder Exocytose“), Verneinung, unbekannte Inhalte und
  Zusatzbehauptungen werden nicht entfernt oder als reiner Name grün bestätigt.
  Keine Auswahlfrage anstelle der ursprünglichen Fachleistung erzwingen.
- Ein optionales Feld „Weitere Aussagen – noch nicht fachlich geprüft“ kann
  zusätzliche Gedanken sichtbar erhalten. Sie gehören nicht zum grünen
  Benennungsurteil; bei ungeprüften relevanten Zusätzen bleibt das Gesamturteil
  `clarify`. Sicher falsche geprüfte Aussagen dürfen nicht versteckt werden.
- Bei unklarer Eingabe: „Ich kann diese Eingabe im Begriffsfeld noch nicht sicher
  zuordnen. Möchtest du den Begriff selbst überarbeiten oder eine Auswahlhilfe
  nutzen?“ Selbstständige Überarbeitung und unterstützte Klärung unterscheiden.
  Auswahlhilfe erzeugt einen neuen Versuch mit `assistance: clarified` bzw.
  `wordbank`, sichtbarem Bezug auf den alten Versuch und aktueller Kontextbindung.
  Das alte Urteil wird nicht nachträglich grün; Hilfenutzung bleibt unabhängig
  von der fachlichen Farbe. Keine erfundene Fehlvorstellung bei unbekanntem Text.

## Auswirkungen auf Aufgaben, Ergebnisse und Speicherung

Der vorhandene [Entwurf naming-input/0.2](naming-input-0.2-decision.md) konkretisiert
Kontext, Korrekturaktion, Rohtextgrenze und Migration. Er wird jetzt zur
Entscheidung empfohlen; seine Draft-ID ist weiterhin keine Runtimeversion.
Für eine spätere Umsetzung müssen die Aufgaben-/Feldpaare als echte Union
statt lediglich als unverbundene Felder abgesichert werden:

```ts
type NamingTargetDraft =
  | Readonly<{ taskId: 'Z1.02'; fieldId: 'term' }>
  | Readonly<{ taskId: 'M6.02'; fieldId: 'process' }>;
```

`EvaluationResult` bleibt an Aufgaben-, Rubrik-, Inhalts- und Modellversion,
Instanz, Material und Kontext-Hash gebunden. Die bestehenden vollständigen
Originalspannen dürfen nicht als Evidenz für automatisch herausgelöste Wörter
missbraucht werden. Der Entwurf ergänzt einen **gesonderten** Ergebnisumschlag
mit `assessedScope: term_only`, dem gebundenen `termResult`, sichtbarem
`additionalStatements: not_assessed` und einem konservativen Gesamtstatus.
Ein grüner Begriff bestätigt weder ungeprüfte Zusätze noch die gesamte M6.02.
Ein künftiger Fortschrittsadapter muss den gesamten Umschlag einschließlich
ungeprüfter Zusätze prüfen, ausdrücklich auch für Z1.02. Ein isoliertes grünes
`termResult` darf niemals einen vollständigen Aufgabenabschluss auslösen.

Vorgeschlagene Zusammenführung: technische Ungültigkeit bleibt `technical`,
eine sicher falsche Benennung bleibt als `incorrect` mit konkretem Gegenbeleg
sichtbar. Bei sonstiger Benennung und ungeprüften relevanten Zusätzen lautet
das Gesamturteil `clarify`; das getrennte Feldurteil bleibt sichtbar.
Ohne Zusätze entspricht der Umfangsstatus dem Benennungsurteil. Auch dann ist
er bei M6.02 ausschließlich ein Feldstatus, kein Aufgabenabschluss.

Fachliche Ziele und Rubriken werden nicht abgeschwächt. Falls sich durch den
beschlossenen Hinweis die erlaubte Eingabe oder Bewertungsreichweite ändert,
müssen fachlich Verantwortliche die nötigen Aufgaben-, Rubrik- und Inhaltsversionen
festlegen und einen begründeten Spezifikationsänderungsauftrag erteilen.
Keine neue Modellversion erfinden. Bis dahin bleiben alle Originaldateien und
der alte 95-%-Nenner unverändert. Historische Sätze behalten ihren alten Vertrag
und ihre Rohbefunde; sie werden nicht rückwirkend in einen engeren Nenner sortiert.

Der heutige Metadatenspeicher erhält keine Rohtexte, Zusätze oder neue
Korrekturverknüpfungen. Ein künftiger Dialog hält diese zunächst nur in der Sitzung.
Neue Persistenz erfordert einen eigenen versionierten Migrationsauftrag;
`schemaVersion: 1` und fremde Browserdaten bleiben geschützt. Veraltete Ergebnisse
werden auch im vorgeschlagenen Format nicht als aktuell gültig angezeigt.

## Noch zu entscheiden und anschließend zu prüfen

1. Fachliche Zustimmung zum Schülerhinweis, zu den zulässigen Mehrwortbegriffen
   und zur sichtbaren Behandlung aller weiteren Aussagen.
2. Ob das optionale Zusatzfeld für diese zwei Benennungen einen nachgewiesenen
   Lernwert hat oder die optionale Klärung allein genügt. Es darf kein verdeckter
   ungeprüfter Ersatz für Erklärungsaufgaben werden.
3. Endgültige Format-/Inhaltsversionen, konservativer Ergebnisumschlag und genaue
   Korrekturhandlung einschließlich Kontextwechsel und Hilfenutzung.
4. Gesonderter Umsetzungsauftrag, danach frische getrennt entwickelte Gegenprüfung
   mit mindestens 60 üblichen Benennungen im beschlossenen Vertrag, ≥95 % bei
   vollständigem Nenner und keinen kritischen Fehlfarben; vollständige alte
   Regression und ihre bisherigen Nenner zusätzlich erhalten.
5. Lernendenpilot, sichtbare Rückmeldungen, Tastatur-/Touchbedienung, echte benannte
   Safari-/iPad-Geräte sowie Speicher- und Veröffentlichungsschutz prüfen.

Die aktuellen Standard-Tab-Fehler auf macOS WebKit und der fehlende administrative
Main-Schutz bleiben getrennte Freigabeblocker. Der Formatvorschlag behebt sie
nicht. Keine Schutz- oder Deploymentänderung wird in diesem Auftrag aktiviert.
