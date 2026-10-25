# M6.02: begrenzte Relationsfelder 1.0.0

Vor Implementierung am 25.10.2026 festgeschrieben. Fachliche Autorisierung:
Nutzerauftrag „ausdrückliche Fachentscheidung und begrenzte P02c-Umsetzung“
und anschließende ausdrückliche Umsetzungsanweisung im Chat. Keine Freigabe
für Unterricht, Merge, Deployment oder P03. Die vorherige Entscheidungsvorlage
bleibt als Entwurfshistorie erhalten. Eigene Tests sind keine unabhängige Abnahme.

## Bindung und Nachweis

Neue Hülle `m602-cued-relations/1.0.0`, Aufgabe `M6.02@cued-relations-1`,
Rubrik `M6.02.C01-C03@cued-relations-1`, Inhalt
`zelllabor11.m602-cued-content/1.0.0`. Modellversion ausdrücklich vom Aufrufer,
keine neue Simulation oder erfundene Modellversion. Aufgaben-ID M6.02 und
biologische Kriterien C01–C03 unverändert. Originalfrage und gesamtes Material
bleiben sichtbar: intakte Zwiebelzelle, frühe Wasserverlustphase, Wasserpotenziale
Vakuole > Cytosol > Außenraum einschließlich Druck in Pa, beide Membranen
wasserpermeabel, Saccharose zurückgehalten, andere Transporte ausgeschlossen.

C01 behält die genehmigte Fachbegriffeingabe. C02 zeigt als **gegeben**:
„Wasser bewegt sich NETTO über die ZELLMEMBRAN: [deine Richtung]“.
C03 zeigt als **gegeben**: „Das VAKUOLENVOLUMEN [deine Veränderung]“.
Beide Eingaben starten leer. Keine Vorauswahl, keine zusätzlichen Kriterien
für das Abschreiben der gegebenen Membran oder des Volumengegenstands.
Bestätigt wird nur der deklarierte Abruf von Name, Nettorichtung und Volumenfolge;
keine freie Erklärungskompetenz, praktische Methode, Transferleistung oder Note.

## Vollständig konsumierter Slotumfang

Normalisierung ausschließlich NFC, Groß-/Kleinschreibung, ß/ss, Umlaut-/ae/oe/ue-
Schreibung, zusammengefasster Leerraum und bis zu drei abschließende . ! ?.
Originaltext und UTF-16-Evidenz bleiben unverändert. Keine unscharfe Korrektur,
keine Schlüsselwortextraktion und keine Entfernung unbekannter Textreste.
Ein vorsichtiger Vorsatz (vielleicht, vermutlich, wahrscheinlich, wohl, eventuell,
ich denke/glaube/vermute, jeweils optional mit Komma) wertet den fachlichen
Inhalt nicht ab. Ein optionales „netto“ wiederholt nur die gegebene Betrachtung.

C02: nach außen/hinaus/raus/auswärts/nach draußen sind gleichwertig.
Quell-/Zielausdrücke dürfen „aus …“, „von … in …“/„vom … in …“, „in …“/„ins …“
oder einen Pfeil → verwenden. Zellinneres/Cytosol/Zelle werden als Innenseite,
Außenraum/Außenlösung/Außenmedium/Umgebung/umgebende Lösung als Außenseite
geführt. Nur vollständige passende Raumbezeichnungen, keine freie Satzgrammatik.
Ein alleiniger innerer Quellraum bzw. äußerer Zielraum ist durch den Satzrahmen
eindeutig. „heraus“/„hinaus“ dürfen einen tatsächlich nach außen gerichteten
Quell-Ziel-Ausdruck abschließen. Gegenteilige Partikel werden nicht ignoriert.

C03-Abnahme: kleiner, weniger, nimmt ab, wird kleiner, schrumpft,
verkleinert/verringert/vermindert/reduziert sich, sinkt, wird geringer,
nimmt an Volumen ab, verliert (an) Volumen, Volumenabnahme, Abnahme,
abnehmend, geht zurück. Diese kurzen Prädikate beziehen sich ausschließlich
auf das ausdrücklich vorgegebene Vakuolenvolumen.

| Status | C02 | C03 |
|---|---|---|
| correct | sichere Nettorichtung innen → außen | sichere Volumenabnahme |
| incorrect | nach innen/hinein/rein/einwärts/nach drinnen; außen → innen; kein Nettotransport/Nettostrom/Nettowassertransport, netto kein Wassertransport | größer/mehr, nimmt zu, wächst, steigt, wird größer, vergrößert/erhöht sich, schwillt an, Zunahme; gleich/konstant/unverändert bzw. bleibt gleich/konstant/unverändert |
| partial | in beide Richtungen, hin und her, wechselseitig; bewegt sich/Wasserbewegung/Osmose ohne Richtung; ausdrücklicher Vakuole → Cytosol-Fluss ist die andere Membran | verändert/ändert sich, Veränderung, Volumenänderung ohne Richtung |
| clarify | unbekannter Rest, Pronomen oder anderer Zeitpunkt/Gegenstand/Grenze, vollständiger Satz außerhalb des Slots | ebenso; Zellwand/Protoplast niemals still als Vakuole auswerten |
| empty | nur Leerraum | nur Leerraum |
| technical | >4096 UTF-16-Zeichen, unzulässige Steuer-/Formatzeichen oder ungültiger Kontext | ebenso |

Eine einzelne Negation wird nur mit vollständig erkanntem Ausdruck verbunden:
Negation von out/down widerspricht dem gegebenen Fall; Ausschluss von in/up/same
benennt noch keine positive gesicherte Beziehung (partial). Doppelnegation bleibt
clarify. Genau zwei erkannte Ausdrücke können durch „und“ verbunden werden:
Gegenrichtungen bzw. Abnahme/Zunahme/Gleichbleiben am selben gegebenen Bezug
sind widersprüchlich; gleiche Bedeutung bleibt erhalten. „oder“ verlangt Klärung.
Ein unbekannter Operand verhindert jede fachliche Bestätigung des Ganzen.
Keine Rekonstruktion von Pronomen, Kausalsätzen, Vorher-/Nachher-Geschichten,
Membranvergleichen oder Allquantoren. Ein biologisch richtiger ganzer Satz
außerhalb des Slots erhält **nichtfachliche Klärung**, kein unbegründetes Rot.

## Rückmeldung, Zusätze, Hilfe und Ergebnis

Rückmeldung benennt ausschließlich die tatsächlich erkannte Beziehung,
erklärt sie anhand der gegebenen Gesamtpotenziale/Wasserbilanz und bietet
einen nächsten eigenen Schritt. Unbekanntes Format benennt eine Prüfgrenze,
keine erfundene Fehlvorstellung. Farbe stets mit Symbol/Text. Keine automatische
Musterlösung nach einem Fehler. Selbstüberarbeitung vor Hinweis, Wortbank,
Auswahlklärung und ausdrücklich betrachteter Lösung. Eine spätere Auswahl ist
ein neuer unterstützter Versuch; alte Versuche werden nicht umgeschrieben.

Optionale weitere Aussagen gehören weiter derselben bewerteten Einreichung an.
Jeder nichtleere ungeprüfte Zusatz bleibt sichtbar notAssessed und blockiert
Gesamtgrün. Keine separate Lernnotiz oder neue Rohtextpersistenz. Priorität:
technischer/context/history-Fehler > sicherer Fachfehler > ungeprüfter Rest >
alle leer > alle drei correct > partial. Nur alle drei aktuellen Kriterien ohne
relevanten Rest und mit gesicherter Historie können einen Gesamtbeleg erzeugen.

Die neue Session akzeptiert ausschließlich die neue Hülle/Versionsbindung;
alte Ergebnisse, Kopien, veraltete oder gemischte Kriterien bleiben unbuchbar.
Alte Versionsdaten bleiben historische Daten, keine Migration zu erfolgreich
oder eigenständig. Unbekannte Hilfehistorie bleibt auch nach neuen IDs/Seeds,
Materialwechsel und Reload ungesichert. Nur acht vorhandene Fortschrittsmetadaten,
keine Rohtexte, Evidenzen oder Hilfeereignisse dauerhaft speichern.

## Legacy, Prüfung und Grenze

Alter Satzparser bleibt ausschließlich historischer Prüfnachweis; seine
Sprachquoten werden nicht zum Erfolg der neuen Hülle umetikettiert. Kritische
Referenzzuordnungen konservativ absichern, ohne weitere Satzmuster zu sammeln.
Aktuelle Qualitätsprüfung bewertet die neue Hülle; historische rote Berichte
werden getrennt unverändert ausgeführt und behalten. Alte Ergebnisse dürfen
keinen aktuellen Kontext bestätigen oder dessen Fortschritt buchen.

Eigene Sollmatrix und Hash vor dem ersten neuen Lauf eingefroren. Ziel pro Feld
mindestens 95 % Grün auf **allen** gültigen kurzen eigenen Slotantworten und null
kritische Fehlfarben; Darstellungsvarianten und natürliche Ausdrucksvielfalt
getrennt betrachten, keine Generalisierung auf beliebige Schülerantworten.
Danach neue unabhängige Gegenprüfung. Die extern gelieferten R4-Dateien bleiben
außerhalb des Repositorys, Bundles und veröffentlichter CI-Artefakte; solange das
ZIP fehlt, sind seine vollständigen G/S/C/X-/Rohdatenprüfungen offen.
Echte Safari/iPad- und Unterrichtsprobe bleiben offen. Kein P03 in diesem Auftrag.

Der Startbestand mit 113 Fällen und seinen 24 gültigen Eingaben je Feld bleibt
unverändert eingefroren. Vor erster Ausführung separat fixierte 47 zusätzliche
Negativ-/Teil-/Formatfälle vervollständigen den eigenen C-Startbestand auf je
80: 24 richtig, 24 falsch, 12 unvollständig, 12 ungeklärt, 8 technische/Formatfälle
(davon zwei leer). Diese Ergänzung ist codegeleitet und nicht unabhängig; sie
fügt nach dem ersten Lauf keine richtigen Antworten zum Grün-Nenner hinzu.
