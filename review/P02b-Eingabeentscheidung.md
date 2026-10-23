# P02b: offene fachliche Entscheidung nach R7

**Vorschlag zur Entscheidung, kein Beschluss oder Umsetzungsauftrag.**
Die Prüfentscheidung „B: NICHT MERGE“ genehmigt keine der folgenden Eingabeoptionen.
Im vorliegenden Auftrag wird kein Formatwechsel umgesetzt. Originalfragen,
Rubriken, Verträge und sämtliche bisherigen Nenner bleiben verbindlich.

## Zwei entscheidbare Optionen

| | a) Bestehenden Satzvertrag fortführen | b) Sichtbares Fachbegriff-Feld mit optionaler Klärung |
| --- | --- | --- |
| Leistung | Fachliche Benennung einschließlich zulässiger gewöhnlicher Sätze zuverlässig erkennen. | Dieselbe biologische Identität benennen; keine zusätzliche deutsche Satzkonstruktion verlangen. |
| Offene Abnahme | Unverändert ≥95 %, alle gelben im Nenner. R7: 41/60, erforderlich 57/60; eigene R6-Probe: 56/60. | Eingabeumfang und neue Kriterien vor Erprobung ausdrücklich beschließen; keine erwartete Erfolgsquote behaupten und keinen alten Test rückwirkend bestehen lassen. |
| Aufwand | Weitere Grammatikarbeit, neue getrennte Gegenproben und vollständige Regression beider Fachfelder nach jeder Änderung. Kein belastbarer Zeitbedarf für den offenen Satzraum ableitbar. | Gesonderte Umsetzung von Feldhinweis, sichtbarem Ergebnisumfang, Klärung, vollständigem Fortschrittsadapter, Versionierung und Migration. |
| Risiko | Viele richtige Alltagsantworten bleiben gelb. Weitere Rahmen erhöhen Wechselwirkungen mit Negation, Bezug und Fachbehauptungen; bekannte grüne Sätze belegen keine Übertragbarkeit. | Ein zu versteckter Umfangshinweis oder ein ignorierter Zusatz könnte unberechtigt Erfolg vermitteln. Diese Grenzen müssen sichtbar und technisch geprüft werden. |

**Empfehlung: b fachlich beschließen und anschließend gesondert beauftragen.**
Bei einer Benennung ist der biologische Begriff die geforderte Leistung.
Zusätzliche Metasätze sind hier kein eigenes Lernziel. Ein vorher verständlicher
Eingabeumfang vermeidet das Erraten akzeptierter Satzformen. Der engere Vertrag
ist gezielter testbar und wartbar; eine höhere Lern- oder Motivationswirkung
ist damit nicht empirisch belegt. Der ausführliche Vergleich aller sechs Kriterien
steht in der [R6-Empfehlung](R6-Eingabeempfehlung.md).

Wer a weiterverfolgen möchte, muss dafür Aufwand, begrenzten Arbeitsumfang und
erneute unabhängige Abnahme ausdrücklich beauftragen. In diesem Auftrag werden
weder die vier eigenen R6- noch die 19 R7-Sprachlücken mit neuen Mustern ergänzt.

## Konkret vorgeschlagene Bedienung für b

Die unveränderte Originalfrage und das Material bleiben sichtbar. Daneben:

> **Fachbegriff** – Ein Begriff genügt. Du musst keinen Satz schreiben.
>
> **Weitere Aussagen (optional)** – Diese Aussagen bleiben sichtbar und sind
> in diesem Benennungsfeld noch nicht fachlich geprüft.
>
> **Benennung prüfen**

Ein Begriff darf mehrere Wörter haben. Die bestehenden fachlich gleichwertigen
Mehrwortbezeichnungen, Synonyme und geprüften Schreibvarianten bleiben zulässig.
Keine versteckte Wortextraktion aus einem Satz, kein Entfernen von Negation,
konkurrierenden Begriffen oder relevanten Zusätzen. Eine Satzantwort wird
nicht automatisch auf ihr richtiges Wort reduziert oder als fachlich falsch
ausgegeben, nur weil sie den beschlossenen Eingabeumfang überschreitet.

| Beispiel und Feld | Fachlicher Umfang im Vorschlag |
| --- | --- |
| `Tonoplast` oder `Vakuolenmembran`, Z1.02/term | Gleichwertige Benennung der markierten Vakuolengrenze. |
| `Membran`, Z1.02/term | Weiterhin Teilansatz, keine vollständige Benennung. |
| `Kernhülle`, Z1.02/term | Falsch: Kernhülle umschließt den Zellkern, gefragt ist die Vakuolengrenze. |
| `Osmose`, M6.02/process | Richtig ausschließlich für C01. Richtung/C02 und Volumen/C03 bleiben offen. |
| `Diffusion`, M6.02/process | Weiterhin der zu allgemeine Teilansatz. |
| `Osmose oder Plasmolyse` | Konkurrenz bleibt sichtbar und ungeklärt. |
| `nicht Osmose` | Ausschluss des geforderten Vorgangs bleibt erhalten; nicht zu positivem Osmose umdeuten. |
| Richtiger Begriff plus zusätzliche Aussage | Benennung getrennt anzeigen; ungeprüfter relevanter Zusatz verhindert ein grünes Gesamturteil. Sicher bewertete falsche Aussagen benötigen konkrete Gegenbelege. |

Bei Unsicherheit: **„Ich kann diese Eingabe im Begriffsfeld noch nicht sicher
zuordnen. Überarbeite den Begriff selbst oder nutze eine Auswahlhilfe.“**
Selbstüberarbeitung ohne inhaltliche Hilfe ist ein neuer eigenständiger Versuch;
bereits genutzte Hilfen werden nicht gelöscht. Auswahlklärung/Wordbank erzeugt
einen neuen Versuch mit ausgewiesener Hilfeart, sichtbarem Vorgängerbezug und
aktuellem Kontext. Kein rückwirkendes Grün und keine erfundene Fehlvorstellung.

## Ergebnis, Fortschritt und Wechsel alter Daten

- `term_only` und `not_assessed` werden sichtbar und technisch getrennt geführt.
  Ein grünes `termResult` bestätigt nur die Benennung. Der vollständige
  Ergebnisumschlag entscheidet über Gesamtstatus und Fortschritt: bei ungeprüften
  relevanten Zusätzen kein grünes Gesamturteil und **auch für Z1.02 kein vollständiger
  Erfolg**. Der Adapter darf niemals nur `termResult` an den alten Fortschrittspfad
  weiterreichen. M6.02/process bleibt grundsätzlich unvollständig.
- Alle Aufgaben-/Feldpaare, vier Versionswerte, Material, Instanz, Seed, Phase und
  Kontext-Hash bleiben gebunden. Veraltete Ergebnisse sind nicht aktuell gültig.
  Der [0.2-Entwurf](naming-input-0.2-decision.md) ist keine heutige Runtimeversion.
- Rohtexte, Zusatztexte und Evidenzen verbleiben in der Sitzung; der bestehende
  Acht-Metadatenfelder-Speicher wird nicht still erweitert. Notwendige spätere
  Migrationen erfordern einen eigenen versionierten Auftrag. Alte Versuche
  behalten ihren damaligen Vertrag, Status und Hilfenachweis; kein automatisches
  Herausschneiden oder nachträgliches Grün. Fremde Browserdaten bleiben erhalten.
- Fachlich Verantwortliche müssen Wortlaut, zulässigen Umfang, Versionswechsel
  und neue Abnahmekriterien **vor** der Erprobung beschließen. Vorschlag für die
  spätere Abnahme: getrennt entwickelte neue Gegenprobe, ≥95 % im dann ausdrücklich
  beschlossenen Vertrag, keine kritische Fehlfarbe, alte Rohbestände und Nenner
  weiterhin separat. Keine Erfolgsprognose oder Freigabe daraus ableiten.

**Ausstehender Beschluss:** a oder b samt Umfang und Kriterien; für b zusätzlich
ausdrücklicher Umsetzungsauftrag. Bis dahin bleiben beide heutigen 95-%-Befunde,
WebKit-/Geräteabnahme und unabhängige Gegenprüfung offen. Kein Merge, Deployment,
P02c oder Unterrichtseinsatz.
