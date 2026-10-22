# E · Codex-Masterauftrag – Zelllabor 11

**Version 1.0 · 22.10.2026**

Dieser Master ist der dauerhafte Gesamtvertrag. **Nicht das gesamte Spiel in einem einzigen Auftrag implementieren.** Ein Folgeauftrag muss die freigegebene Phase bzw. den klar begrenzten Teilschritt nennen. Liegt nur dieser Master ohne Phasenauswahl vor, erschließe die Spezifikation und den Arbeitsstand, dokumentiere Voraussetzungen und beginne keine unkontrollierte Komplettimplementierung.

---

## 1. Auftrag und Produkt

Entwickle schrittweise „Zelllabor 11 – Die Zelle erforschen“, ein wissenschaftlich fundiertes browserbasiertes Biologie-Lernspiel für Jahrgang 11 der gymnasialen Oberstufe. Es begleitet die Unterrichtseinheit Zellbiologie/Biomembranen und dient als wesentlicher Baustein der Klausurvorbereitung.

Ziel ist eine kostenlose, werbefreie Anwendung ohne Schülerkonto oder verpflichtende externe KI-Dienste, statisch über GitHub Pages erreichbar, auf Desktop und iPad nutzbar. Eine hochwertige 3D-Darstellung ergänzt methodisch abwechslungsreiche Aufgaben. Junge Erwachsene werden sachlich und verständlich angesprochen. Schwierigkeit entsteht durch biologische Zusammenhänge, nicht durch komplizierte Bedienung oder unnötige Fachwörter.

## 2. Arbeitsgrundlagen und Vorrang

Lies zu Beginn des jeweiligen Auftrags tatsächlich:

1. `AGENTS.md`;
2. `A_Fach_Didaktik.md`;
3. `B_Technik_Modelle.md`;
4. `C_Feedback_Pruefung.md`;
5. `D_Entwicklungsroadmap.md`;
6. `F_Aufgabenkatalog.md` und die betroffenen Einträge in `spec/`;
7. aktuellen Quellcode, vorhandene Tests und dokumentierte offene Fehler.

Die Aufgaben- und Missionsdaten sind keine Beispiele, aus denen beliebige neue Inhalte erzeugt werden sollen. Sie bilden den fachlichen Ausgangsvertrag. Die mitgelieferten JSON-Schemata prüfen den redaktionellen Katalog; die Runtime-Typen müssen als kontrollierte Überführung ergänzt werden. Nutze `spec/contracts.d.ts` als Schnittstellenbasis.

Die private Unterrichtsfassung Variante A vom 22.10.2026 und das schulinterne Curriculum S.22–24 sind fachliche Referenzen, soweit im Arbeitskontext zugänglich. Sie dürfen **nicht** ins öffentliche Repository kopiert werden. Nicht zugängliche Originale nicht als gelesen ausgeben. Bearbeite unabhängige Teile und kennzeichne jede dadurch nicht mögliche Prüfung.

Der Referenzcode `Feerson1617/Lernspiel-Sinne` wurde in der Konzeption auf dem Commit `f55925a9611d69e1d3b8f66f1b77a9a195ad7332` gelesen. Übernimm sinnvolle Architekturideen nur nach eigener Prüfung. Er ist keine allgemeine biologische Textkorrektur und nicht ungeprüft zu portieren. Das Referenzrepository bleibt unverändert.

## 3. Oberste Entwicklungsregel

Die verbindliche Reihenfolge lautet:

**Fachlichkeit → zuverlässige Korrektur/Feedback → Lernwert → Methodenvielfalt/Aufgabenoffenheit → Grafik.**

Stelle Aufgaben nur so offen, wie ihre Korrektur mit dokumentierter Erkennungsqualität und ohne bekannte kritische Fehlwertungen funktioniert. Bei überforderter Textkorrektur die Frage in engere Teilfelder zerlegen oder ein geeignetes geschlossenes Format verwenden. Nicht mit vermeintlich intelligentem Textmatching unbewiesene Richtigkeit suggerieren.

Keine beliebige Aufsatzkorrektur, keine verpflichtende KI-API und in V1 kein lokales Sprachmodell im bewertenden Pfad. Optionales längeres Schreiben wird ausdrücklich nicht automatisch bewertet und zählt nicht als automatisch nachgewiesene Leistung.

## 4. Fachlicher Umfang und Progression

Zwei Hauptbereiche mit aufklappbaren Missionen, geführter Reihenfolge und jederzeit freier Wiederholung:

**Zellen erforschen:** Z1 Zellatlas → Z2 Zellräume/Zusammenarbeit → Z3 Endosymbiontentheorie → Z4 Mikroskopie/Färbung/Zeichnung.

**Biomembranen und Stofftransport:** M1 Wasser/Ladung → M2 Phospholipide/Bilayer → M3 Flüssig-Mosaik/Permeabilität → M4 Diffusion → M5 Osmose → M6 Plasmolyse/Deplasmolyse → M7 passiver/aktiver Transport → M8 Vesikel/Kompartimente → M9 inneres Milieu/Regelkreis → M10 Daten/Untersuchungen.

D0 enthält sechs Diagnoseaufgaben. E1–E3 enthalten je drei Grundlagenaufgaben zu Lebensursprung, Nukleinsäuren und bakterieller Informationsweitergabe. T enthält acht neue Trainingsaufgaben. Insgesamt 79 Aufgabenentwürfe, davon 56 Kernaufgaben; Teilfelder sind gesondert zu zählen und zu testen. Alle angegebenen Abhängigkeiten und Unterrichtsbezüge erhalten.

Die geplante digitale Mikroskopiemission ersetzt weder eigenes Präparieren noch Färben, Gerätehandhabung oder Beobachtungszeichnen. Abschnitt 4 des Schulcurriculums wird nicht vorgezogen. Plasmolyse ist die gewählte Konkretisierung des Verfahrens mit plasmolytisch wirksamen Reagenzien.

## 5. Technischer Stack und Struktur

Verwende TypeScript mit strenger Prüfung, Vite, Three.js/WebGL2 für 3D, semantisches HTML/CSS und SVG für Oberfläche/2D/Diagramme. Vitest für Pure-/Einheiten-/Vertragstests, Playwright für reale Browserabläufe. Exakte miteinander kompatible Versionen und Node-Anforderung in P00 prüfen und festschreiben; Lockfile verwenden. Keine automatische Hauptversionsmigration während der Unterrichtsfreigabe.

Halte die Grenzen ein:

```text
src/domain/       Einheiten, Typen, Kontexte und Validierung
src/biology/      pure Fachmodelle und dokumentierte Szenarien
src/assessment/   Parser, Rubriken, Kriterien und Aggregation
src/content/      freigegebene Aufgaben/Lernkarten
src/application/  Missionen, Versuche, Ereignisse und Zustandswechsel
src/ui/           DOM-Oberfläche, Feedback, Hilfen und Zugänglichkeit
src/render3d/     reiner Three.js-Adapter
src/render2d/     gleichwertiger SVG-Adapter
src/persistence/  versionierte lokale Lernstände
src/assets/       freigegebene Laufzeitassets mit Manifest
qa/               tatsächliche Prüfnachweise und Fehlerregister
review/           neue Fälle aus getrennten Gegenprüfungen
```

Die Fachlogik und Korrektur dürfen DOM oder Three.js nicht als Wahrheitsquelle verwenden. Beide Ansichten zeigen denselben Zustand. Keine zusätzliche „vereinfachte“ Mobilberechnung. Kein allgemeiner 3D-Physikmotor nötig; die biologischen Regeln werden als eigene begrenzte Modelle spezifiziert.

## 6. Korrektur- und Feedbackvertrag

Jede Teilantwort erhält einen Status:

- grün: vollständig fachlich richtig für die Frage und den eingefrorenen Kontext;
- rot: konkret nachweisbar falsche Aussage mit belegtem Grund;
- gelb/teilweise: zutreffender Ansatz, noch unvollständig;
- gelb/Klärung: Bedeutung oder relevanter Rest nicht sicher geprüft;
- neutral: nicht beantwortet;
- technischer Hinweis: nichtfachlicher Fehler, niemals als fachlicher Fehlversuch zählen.

Farbe, Symbol und begründeter Text immer gemeinsam. Fachlicher Status und Unterstützungsart getrennt. Ein richtiger unterstützter Versuch ist nicht eigenständig; eine Auswahlklärung beweist nicht, dass der erste Freitext richtig war.

Für jedes Feld gelten aufgabenspezifische Kriterien, Synonyme, erlaubte knappe Antworten, typische Fehler, Negationen, zeitliche Bezüge und Gegenbehauptungen. Normalisierung darf keine Richtungs-/Vorzeichen-/Negationsinformation löschen. Bekanntes falsches Fachwort vor Ähnlichkeitssuche erkennen. Geschützte Gegensatzpaare nicht unscharf umdeuten.

Ein Begriff reicht bei Benennung; bei einer Erklärung reicht derselbe Begriff nicht automatisch. Längere Antworten weder belohnen noch allein wegen ihrer Länge abwerten. Keine grüne Freigabe auf Grundlage einiger gefundener Wörter bei ungeprüften relevanten Resten. Bei technischer Längengrenze Text erhalten und zur engeren Antwort auffordern, nicht einen Präfix benoten.

„Nicht nach innen, sondern nach außen“ ist nicht gleich „nach innen“. „Wasser bewegt sich in beide Richtungen“ ist kein Widerspruch zum Nettofluss nach außen. „Netto hinaus und zugleich netto hinein“ kann ein gesicherter Widerspruch sein, wenn gleiche Grenze und Zeit gemeint sind. Nicht unterstützte Mehrdeutigkeit gelb.

Auswertung und Browser verwenden dieselbe Pure-Funktion. Testantwortdateien dürfen nicht zur Laufzeit als Antwort-Whitelist importiert werden. Grün setzt alle Pflichtkriterien und das Fehlen relevanter ungeprüfter Reste voraus. Mischantworten erhalten konkrete Teilrückmeldungen, keine irreführende Gesamtbestätigung.

## 7. Aufgabenformate

Implementiere nach Phasenbedarf Zuordnung/Beschriftung, Einzel-/Mehrfachauswahl, Folge/Teilordnung, begrenzten Text, Zahlen, Kausalnetz, Diagramm, strukturierte Versuchsplanung und Modellhandlung.

- Drag & Drop: stabile biologische Zielanker, feste lesbare Antwortansicht; Tippfolge und Tastatur als gleichwertige Alternativen.
- Ordnung: mehrere fachlich gleichwertige Reihenfolgen bzw. parallele Kausalschritte zulassen, wenn die Rubrik sie erlaubt.
- Zahlen: deutsche Dezimalkommas, vorgegebene Einheitensätze, korrekte Umrechnung, explizite Toleranzen. Keine Umdeutung eines falschen Vorzeichens als Tippfehler.
- Graphen: Daten, Achsen und Einheiten prüfen; keine Pixelpräzision als Biologieleistung.
- Versuche: definierte valide Designfamilien und Kontrollbedingungen, nicht nur wortgleiche Musterlösung.
- Simulation: Vorhersagekontext einfrieren; nach veränderten Bedingungen frühere Bewertung invalidieren; zufällige Einzelereignisse nicht als deterministisch richtige Vorhersage behandeln.

Jeder Formatbaustein besitzt richtige, falsche, unvollständige, leere, Hilfe- und Abbruchpfade.

## 8. Fachmodelle

Verwende ausschließlich die Modellverträge BM01–BM07 in B; Änderungen brauchen fachlich dokumentierte Gründe und neue Tests.

**Zellprofile:** chloroplastenhaltige Blattzelle, chloroplastenfreie Zwiebel-Epidermiszelle und Tierzellprofil getrennt. Zellwand, Zellmembran, Tonoplast, Cytosol und Vakuolenraum nicht verwechseln. Dünne Hüllen optisch überhöht kennzeichnen. Keine molekulare Auflösung als Lichtmikroskopbild darstellen.

**Diffusion:** stochastische Einzelbewegung mit synchroner Bilanz; Gleichgewicht ist dynamisch. Bei ungleichen Volumina Konzentrationen statt gleicher Anzahlen vergleichen.

**Osmose:** intern SI, Ψ=P−RTC_osm; drei getrennte Räume; wasserpermeable Membranen und nicht permeierende Solute als klare Gültigkeitsbedingung; Flussrichtung vom höheren zum niedrigeren Wasserpotenzial. Zellwanddruck mit idealisiertem begrenztem Elastizitätsmodell. Reservoirwechsel in einem Austauschkonto bilanzieren. Kein stilles Clamping, das Masse erzeugt oder vernichtet. Adaptive/stabile numerische Lösung, Gegenprüfung mit analytischen Referenzen. Modellzeit nicht als echte Reaktionszeit verkaufen.

**Transport:** passiver Proteinweg nicht automatisch aktiv; Konzentrationsgefälle für ungeladene, unveränderte Modellstoffe; Ionen mit elektrischem Beitrag. ATP-Abhängigkeit des Systems beweist keine unmittelbare ATP-Spaltung am untersuchten Protein. Aktive Vorgänge in V1 als klar begrenzte Energie-/Kopplungsszenarien, nicht als allgemeine Zellkinetik.

**Vesikel:** Cargo im Lumen, Membranseiten bleiben topologisch erhalten; Fusion ohne Umkehrung der cytosolischen Seite.

**Regulation:** bestimmtes funktionales Tierzellmodell mit Schwellung, indirektem Sensor, Signalweg, K-/Cl-Kanalaktivierung bei passenden Gefällen und abschwächendem Rückweg. Kein universeller zentraler Regler. Prozentwerte didaktisch, keine allgemeinen biologischen Schwellen.

## 9. Grafik, Geräte und Bedienung

Eigene fachlich kontrollierte Blender-Modelle, GLB/glTF-Export mit Manifest und stabilen Struktur-IDs. Keine ungeprüften dekorativen Assets. Ruhige wissenschaftliche Materialwirkung, lesbare Schnitte und isolierbare Strukturen. Keine Glasoptik, die Grenzen verdeckt. Drei Maßstabsebenen ausdrücklich getrennt.

Desktop darf höhere Detailstufen nutzen; Tablet reduziert nur Darstellungsaufwand, nicht Aufgaben oder Fachlogik. Gleichwertige 2D-Ansicht bei WebGL2-Ausfall. Modelle und Decoder lokal bündeln, keine Laufzeit-CDNs. Initiale Budgets aus B einhalten oder messbar begründet nachbessern.

DOM-Text nicht ins WebGL zwingen. Fokus, Touchflächen, Bildschirmtastatur, reduced motion und Hoch-/Querformat beachten. Modal-/Antwortinteraktion darf keine ungewollte Kameradrehung auslösen. Echtes iPad mit Safari separat prüfen; WebKit/Viewport-Emulation nicht als Gerätetest ausgeben.

## 10. Fortschritt, Datenschutz und Prüfungsschutz

Lokale Speicherung mit Schema-/Inhalts-/Rubrikversion und Fallback. Keine Namen oder Rohtexte standardmäßig dauerhaft speichern oder übertragen. Unbekannte Speicherformate nicht raten; fremde Daten nicht löschen. Ein altes „bearbeitet“ bestätigt keine neu eingeführten Inhalte. Hilfenutzung bleibt historisch korrekt; ein späterer eigenständiger Versuch wird zusätzlich vermerkt.

Originalklausur, Erwartungshorizont, Lehrerpaket und geschützte Transferfälle niemals in öffentliche Dateien, Git-Historie, Builds, Logs, Screenshots oder CI-Artefakte übernehmen. Neue Zahlen allein machen einen originalen Transferfall nicht zu einer neuen Aufgabe. Private Quellen nur außerhalb des öffentlichen Arbeitsbaums lesen. Publish-Allowlist und Inspektion vor dem ersten Commit sowie vor jeder Veröffentlichung.

Das Klausurtraining ist ein statischer Selbsttest, keine sichere Prüfungsplattform. Lösungen im Client sind prinzipiell inspizierbar. Offlinefähigkeit ist optional und erst nach gesonderter Cache-/Versionsprüfung freizugeben. HTTPS-Nutzung priorisieren.

## 11. Kontinuierliche Tests und Unabhängigkeit

Führe in jedem Auftrag eigene fachliche Prüfungen aus. Ein vorliegender Bericht ist kein Nachweis deiner eigenen Prüfung. Erzeuge neue Fälle aus Material/Rubrik, nicht nur aus dem Code. Verwende den bereitgestellten Redaktionsbestand zusätzlich, nicht ausschließlich.

Vor Unterrichtsfreigabe mindestens der in C definierte kuratierte Fallbestand je Textfeld/Feldfamilie, ergänzende unabhängige neue Gegenprüffälle, sämtliche vorhandenen Regressionen und Browserabläufe. Jede bekannte falsche Grün-/Rotwertung blockiert. Mindestens 95 % Grün-Erkennung auf dem separat repräsentativ angelegten Bestand vollständig korrekter Antworten als gewähltes Entwicklungsziel; kein Wegfiltern gelber richtiger Antworten aus dem Nenner. Dieses Ziel ist keine Garantie für beliebige Schülerantworten.

Eine unabhängige Gegenprüfung darf nur als abgeschlossen markiert werden, wenn der getrennte Auftrag tatsächlich eigene Sollwerte, neue Fälle und Ausführungsnachweise geliefert hat. Du kannst die eigene Arbeit nicht selbst als unabhängig zertifizieren. Bei fehlenden Werkzeugen: Prüfung blockiert/ausstehend, nicht bestanden. Keine simulierten Testprotokolle.

Nach jeder Änderung gemeinsamer Korrektur-/Modellfunktionen sämtliche bereits implementierten Aufgaben/Varianten erneut testen. Alte Fälle nicht löschen oder an Fehlverhalten anpassen. Fachlich notwendige Sollwertkorrekturen dokumentieren und gegenprüfen.

P00 legt folgende ausführbare Scripts an, spätere Phasen füllen sie mit echten Prüfungen. Ein noch leerer Prüfschritt darf keinen erfolgreichen Freigabestatus liefern:

```text
npm run check:spec       Inhalt, Verweise, Kriterien, gültige Varianten
npm run check:types      TypeScript strict
npm run test:unit        gemeinsame Fach- und Korrektorfunktionen
npm run test:models      Bilanz-, Richtungs-, Grenz- und Referenzfälle
npm run test:content     alle freigegebenen Aufgaben/Teilfelder
npm run test:review      tatsächlich vorhandene neue Gegenprüffälle
npm run build           reproduzierbares statisches Artefakt
npm run test:browser     echte Interaktionen und Ansichten
npm run check:publish    Allowlist, Quellen-/Prüfungsschutz, Laufzeitabhängigkeiten
npm run check           vollständige für den Stand erforderliche Kette
```

Testmanifest nennt Commit, Umgebung, Inhaltsversion, ausgeführte Befehle, Fallzahlen und Überspringungen. Prüfe tatsächliche Farben und Rückmeldetexte, nicht nur Rückgabewerte. Screenshot-/Ankerprüfung ist für 3D Pflicht. Schutz- und Geräteprüfungen bleiben eigenständige Abnahmepunkte.

## 12. Phasen und Abbruchbedingungen

Folge D: P00 Gerüst/Schutz → P01 Verträge → P02 Feedback → P03 UI-Formate → P04 Z1 → P05 reine Osmose → P06 M6 → P07 getrennte Grundsystemprüfung → P08 übrige Zell-/Grundlagenmodule → P09 M1–M5 → P10 M7/M8 → P11 M9 → P12 Daten/Training → P13 Gesamtabnahme.

Im Folgeauftrag wird genau ein handhabbarer Teil freigegeben. Nicht gleichzeitig alle Missionen, alle Modelle und eine neue Korrekturarchitektur bauen. Grenzen nicht durch Platzhalter umgehen. Bei P0/P1-Fehlern die betroffene Freigabe stoppen, Ursache und Reproduktion dokumentieren, korrigieren und Regression durchführen. Unabhängige Teile dürfen weiterentwickelt werden; eine nicht geprüfte Mission darf nicht als einsatzbereit erscheinen.

## 13. Ausgabe je Teilauftrag

Liefere eine nachvollziehbare Änderung mit:

- betroffenen Aufgaben-/Modell-/Anforderungs-IDs;
- verändertem Code/Inhalt/Asset und Begründung;
- tatsächlich ausgeführten Tests mit Ergebnisdateien;
- neuen selbst abgeleiteten Fachfällen;
- visuellen Belegen dort, wo sie erforderlich sind;
- Fehlerregister und konkret nicht ausgeführten Prüfungen;
- Commit/Branch bzw. lokalem Artefaktstand und nächster freigegebener Abhängigkeit.

Kein ungefragter Merge oder destruktiver Git-Eingriff. Keine Behauptung einer Veröffentlichung ohne erfolgreiche echte Bereitstellung. Keine Hintergrundarbeit versprechen. Quellen, Lizenz und Modellgrenzen erhalten.

**Erfolg:** Ein anderes Modell kann jeden Teilschritt anhand der Spezifikation, eigener neuer Fälle und realer Ausführung prüfen. Die Lernenden erhalten eine verlässliche Rückmeldung zur konkret gestellten Frage – nicht eine vermeintlich allwissende Bewertung freier Texte.
