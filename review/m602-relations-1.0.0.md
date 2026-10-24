# P02c – M6.02-Relationsvertrag 1.0.0

Vor Implementierung/erstem neuen Lauf festgelegt. Ausgangspunkt ist der nach
R9 reparierte, vollständig geprüfte P02b-Commit 09d2cd18e50cad22b035b2fe5e23e9bcfa94ed72.
Direkter Zusatzauftrag erlaubt nur C02/C03, Ergebnisintegration und interne Probe
auf eigenem Branch/gestapeltem PR. PR #6 bleibt unverändert. Kein Merge/Deployment,
keine vollständige Mission, Simulation, weitere Aufgabe oder Unterrichtsfreigabe.

Quellen: AGENTS, A–F (unveränderte geschützte Fassungen), besonders C §3–5,
B §8, F M6.02, spec/tasks, REL_NET_WATER_OUT/REL_VACUOLE_SMALLER und RF050–099.
Originalfrage, fachliche Kriterien und alle geschützten Daten bleiben unverändert.

## Fachlicher und sprachlicher Umfang

C01 bleibt der vorhandene Fachbegriffskorrektor. C02 und C03 verwenden eigene
Relationsprofile T2; keine unscharfe Korrektur gegensätzlicher Richtungswörter.
Vor Eingabe sichtbar: „Antworte je Feld mit einer kurzen Beziehung für den
angezeigten Zustand. Einzelbewegung und Nettostrom sind verschieden. Nicht
eindeutige Zeitbezüge oder weitere ungeprüfte Aussagen benötigen Klärung.“
Kein allgemeiner deutscher Satzparser und keine versteckte Schlüsselwortwertung.

| Feld | correct | partial | incorrect | clarify |
| --- | --- | --- | --- | --- |
| C02 direction | Wasser netto Cytosol/Zelle → Außenraum; Kurzformen aus Rubrik, Vergleich mehr aus als ein | bidirektionale Einzelbewegung ohne Nettobilanz; bloße Bewegung/Osmose; richtiger Tonoplastfluss statt Zellmembran | netto nach innen, kein Fluss, Wasser steht still, Saccharosetransport, alle Moleküle nur in eine Richtung, sichere gleichzeitige Nettowidersprüche | konkurrierende verschiedene Richtungen, unklarer/fremder Zeitpunkt, unbekannter relevanter Rest |
| C03 volume | Vakuolenvolumen sinkt; explizite Kurzformen; bekannter Zusammenhang Wasserverlust → Abnahme | Änderung ohne Richtung, Ursache Wasserverlust ohne Volumenfolge, andere richtige Strukturbeobachtung | Zunahme, gleichbleibend im gegebenen Zustand, schrumpfende Zellwand, gleichzeitige gegensätzliche/negierte Volumenänderung | unentschiedene Alternativen, fremder Zeitpunkt, unbekannte Kausalbehauptung/Rest |

Vollständig zu konsumierende Formen: dokumentierte Richtungs-/Veränderungslexika,
Subjekt (Wasser/Moleküle bzw. Vakuole/Volumen), einfache Bewegungs-/Änderungsverben,
netto/insgesamt, begrenzte Satzzeichen, harmlose Unsicherheit („vielleicht“,
„ich denke“ usw.), gleichwertige Alternativen. Zusammensetzung über bekannte
ganze Relationsglieder; kein pauschales Negationssuchen nach Trennung an und.
Einzelne/manche Moleküle dürfen einwärts gehen, obwohl der Nettostrom auswärts
gerichtet ist. Ein Nettowiderspruch ist nur bei identischem Bezug rot.

Negation bleibt lokal: nicht nach außen / nimmt nicht ab widerspricht dem
gefragten Zustand. Ausschluss nur der falschen Alternative ohne positive Wahl
bleibt clarify. „Nicht A, sondern B“/„B statt A“ wählt B; ein Gegensatz derselben
Bedeutung ist widersprüchlich. Explizit zurückgenommene eigene Vermutung
„Ich dachte zunächst A; jetzt meine ich B“ wertet die aktuelle Wahl B.
„Erst A, später B“ beschreibt hingegen mehrere Zeiten und bleibt clarify.
Unbekannte weitere Satzteile verhindern Grün; unentscheidbare Semantik führt
nicht zu erfundenen Fehlvorstellungen. Die zwei ausdrücklich spezifizierten
Wasserverlust-/Volumenkausalpaare sind als bekannte Beziehungen prüfbar; kein
freier Erklärungsaufsatz. Leere Felder neutral, >4096 UTF-16 oder ungültiges
Unicode technisch; gesamte Originalevidenz bleibt unverändert erhalten.

## Material, Versionen und Ergebnisse

Nur derselbe intakte frühe Wasserverlustfall: Gesamtwasserpotenziale einschließlich
Druck in Pa mit Ψv > Ψc > Ψe, beide Membranen wasserpermeabel, Saccharose weitgehend
zurückgehalten, andere Transporte ausgeschlossen, Modellzustand {}. Keine
Berechnung aus Konzentration allein und kein erfundenes Modellrelease.

Neue technische Hülle `m602-response/1.0.0`, taskVersion `M6.02@relations-input-1`,
rubricVersion `M6.02.C01-C03@concept-1-scope-1`, contentVersion
`zelllabor11.m602-content/1.0.0`; modelVersion zwingend explizit vom Aufrufer.
P02b-Versionen werden nicht still übernommen. Die reine C01-Bedeutungsfunktion
wird unter neuem vollständig geprüften Kontext wiederverwendet; keine alten
Ergebnisobjekte umetikettieren. TaskContext/EvaluationResult/Persistenzschema
bleiben unverändert. Eigene geschlossene Einreichung: Kontext, Vertrag, ID,
Revision/Vorgänger, drei Rohfelder und optional getrennte zusätzliche Aussagen.

Jedes Feld erhält ein gebundenes EvaluationResult mit seinem unveränderten
Kriterium; Evidenzpositionen beziehen sich auf das eindeutig benannte Originalfeld.
Gesamtresultat enthält C01/C02/C03 mit derselben Kontextbindung. Priorität:
technisch ungültiger Kontext/Format oder ungesicherte Historie → technical;
gesicherter falscher Teil → incorrect; ungeklärter/unbewerteter Rest → clarify;
alle leer → empty; fehlende/unvollständige Teile → partial; nur alle drei
correct ohne Rest → correct. not_assessed ist Umfang, kein neuer biologischer Status.

Nur der vollständig ausgestellte aktuelle Umschlag derselben Sitzung darf einen
M6-Gesamtbeleg erzeugen. Keine Mischung fremder Kontexte, Versionen, alter
Teilresultate oder geklonter Ergebnisse; keine doppelte Buchung. assistance und
Historiensicherheit bleiben getrennt. Hilfe wird explizit pro Feld protokolliert,
für die ganze Instanz konservativ zusammengeführt; Lösung gesehen bleibt erhalten.
R9-Grenze gilt auch hier: rekonstruierte/geladene ungesicherte Sitzung kann kein
Vertrauen durch neue IDs/Materialien zurückgewinnen. Rohantworten/Evidenz und
Hilfeereignisse nur RAM; persistiert werden höchstens bestehende acht Metadaten.

## Feedback und Prüfplan

Je Feld/Fehlergrund: erkanntes Konzept, konkreter Fachunterschied/Beleg und nächste
Handlung. Direction: Nettobilanz versus Einzelbewegung, falsche Membran, falscher
Stoff, umgekehrtes Potenzialgefälle, Widerspruch/Zeit. Volume: Wasserbilanz,
Zunahme/Stillstand, Wand/Vakuole, Änderung ohne Richtung, Widerspruch/Zeit.
Keine ungefragte Lösung im Standardfeedback zu falschen/teilweisen Antworten.
Selbstüberarbeitung zuerst, Hinweis, Wortbank, Auswahlklärung und ausdrückliche
Lösung separat. Unsichere Historie ist kein biologischer Fehler.

Eigene Statusfälle sind vor Lauf festgelegt in tests/fixtures/p02c-cases.json;
zusätzlich alle 50 unveränderten RF050–099. Vollständige erlaubte Eingaben je Feld
bleiben im Nenner (Ziel ≥95%, kein kritisches Falschgrün/Falschrot); alle Pflicht-
Statusfälle müssen stimmen. Konfigurationen sind keine unabhängigen Schülerfälle.
Negative Integration: fehlendes Feld/Version, umgekehrtes/gleiches Potenzial,
fremde Instanz/Seed/Phase, Unicode/Grenzen, unbewertete Zusätze, Hilfe/Reload,
Vorgängerfälschung, Duplikate, C01 allein kein Abschluss. Beide Begriffskorrektoren,
alle R9- und Legacy-Regressionsfälle bleiben Pflicht; Legacy vier Fehler separat.

Interne echte DOM-Probe für drei Felder: richtige/falsche/teilweise/unklare Fälle,
konkretes Feedback, Hilfekette, Kontextwechsel, unbekannte Zusätze, Speicherung
und Reload auf Desktop/Tablet/Mobil, Tastatur/Touch und Screenshots. Keine
Veröffentlichung des Harness. Ganze bestehende Kette plus WEBKIT_SUITE=all,
Schema-/Publikations-/Importgrenzen. Eigene Tests sind keine unabhängige Abnahme;
neue Gegenprüfung und reale Safari/iPad/Lernendenprüfung bleiben offen.
