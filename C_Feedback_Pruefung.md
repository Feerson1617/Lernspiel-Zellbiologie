# C · Korrektur, Feedback und unabhängige Prüfung

**Konzept 1.0 · 22.10.2026 · Maßgebliche Freigabespezifikation**

## 1. Sicherheitsprinzip

Eine Aufgabe wird zuerst als **prüfbarer fachlicher Vertrag** entworfen: Welche Aussage ist gefragt? Welche Bedingungen gelten? Welche Antworten sind gleichwertig? Was wäre ein klarer Fehler? Erst danach werden Eingabefeld und Oberfläche gebaut. Ist dieser Vertrag nicht mit hinreichend guter Erkennungsleistung implementierbar, wird die Aufgabe enger – nicht die Fehlertoleranz für Falschbewertungen größer.

Nicht bewertbare Offenheit wird auch nicht durch häufiges Gelb kaschiert. Ein Korrektor, der eine falsche und eine richtige Aussage gleichermaßen oft nicht erkennt, ist für die jeweilige Aufgabe ungeeignet. Grün darf nur den tatsächlich geprüften Aussageumfang bestätigen, nicht einen beliebigen langen Text.

Diese Spezifikation definiert ein **begrenztes, deterministisches Prüfsystem**, keine allgemeine natürlichsprachliche Fachkorrektur. Die Grenzen werden im Code, im Schülerfeedback und in den Freigaben konsistent dargestellt.

## 2. Status, Farbe und Unterstützung sind verschiedene Daten

| Interner Status | Darstellung | Entscheidung |
|---|---|---|
| `correct` | grün + Häkchen | alle geforderten Kriterien dieses Feldes sicher erfüllt, kein ungeprüfter relevanter Rest und kein Widerspruch |
| `incorrect` | rot + Kreuz | eine konkrete Aussage ist unter dem eingefrorenen Fall nachweislich falsch; belegte Stelle/Option und Grund erforderlich |
| `partial` | gelb + Ergänzungssymbol | mindestens ein zutreffender Ansatz, keine gesicherte falsche Behauptung, aber inhaltlich unvollständig |
| `clarify` | gelb + Klärungssymbol | Bedeutung, Bezug oder relevanter Textrest nicht sicher auswertbar; keine fachliche Fehlerzählung |
| `empty` | neutral | keine auswertbare Antwort; eine Aufforderung zum Ergänzen ist keine Fachbewertung |
| `technical` | gelb + Hinweis | Eingabe-/Lade-/Versionsproblem; ausdrücklich kein fachliches Urteil und kein Fehlversuch |

Unterstützung wird orthogonal gespeichert: `independent`, `hint`, `wordbank`, `clarified`, `solution_viewed`. Die sichtbare Auswahlklärung kann eine neue richtige Antwort ergeben, macht aber den früheren Freitext nicht rückwirkend richtig. Eine mit Hinweis richtige Antwort bleibt grün, wird jedoch nicht als ohne Hilfe gelöst verbucht.

Ein Kriterium bleibt sichtbar richtig, auch wenn ein anderes noch offen ist. Eine Aufgabe ist erst vollständig richtig, wenn alle Pflichtkriterien erfüllt sind. Ein eindeutig falsches Teilkriterium erzeugt eine rote Teilrückmeldung; daneben dürfen grüne und gelbe Teile stehen. **Ein gemischtes Ergebnis erhält kein pauschales grünes Gesamtbanner.** Leere Felder dürfen eine bereits festgestellte falsche Teilantwort nicht unsichtbar machen.

## 3. Antwortverarbeitung in sieben kontrollierten Schritten

### 3.1 Eingabe und Kontext sichern

Die Auswertung erhält nicht nur Text, sondern `taskId`, Feld-ID, Rubrikversion, Materialwerte, Zeitpunkt/Phase, Modellzustands-Hash und Seed. Eine geänderte Konzentration oder ein anderes Zellprofil macht eine alte Bewertung ungültig. Die UI bewahrt den Text, kennzeichnet aber die nötige neue Prüfung. Bei Vorhersageaufgaben wird der Ausgangskontext vor dem Versuch eingefroren.

### 3.2 Schonende Normalisierung

Unicode vereinheitlichen, Groß-/Kleinschreibung für Fachbegriffe tolerieren, Leerzeichen ordnen und dokumentierte Umlautvarianten zulassen. Zahlen, Vorzeichen, Richtungswörter, Negationen, Mengenwörter und Bedingungen bleiben erhalten. „Nicht“, „kein“, „ohne“, „nur“, „immer“, „netto“, „innen“, „außen“, „mehr“ und „weniger“ sind keine zu entfernenden Stoppwörter.

Ein originaler Text mit Positionsabbildung bleibt im Arbeitsspeicher für konkrete Rückmeldungen verfügbar. Keine unbemerkte Kürzung auf einen Präfix. Bei sehr langen Eingaben bleiben alle Zeichen sichtbar; ab einer technischen Grenze von 4096 Zeichen erfolgt ein nichtfachlicher Hinweis, keine Bewertung des ersten Textteils. Der Hinweis bittet um eine Antwort auf die einzelne Frage. Das ist eine Schutzgrenze, kein Bewertungskriterium für Ausdrucksfähigkeit.

**Selbstsicherheit ist kein fachliches Kriterium:** „Vielleicht Tonoplast?“ und „Ich denke, das ist der Tonoplast“ sind bei der entsprechenden Benennungsfrage richtig. Nur tatsächlich konkurrierende Bedeutungen benötigen Klärung. „Tonoplast oder Vakuolenmembran“ nennt zwei gleichwertige Bezeichnungen und ist deshalb keine unentschiedene Alternative. Ein ausdrücklicher Fragekontext darf kurze Antworten vervollständigen: „weniger“ ist bei der Frage nach der Veränderung des Vakuolenvolumens ausreichend. Solche Fälle werden nicht allein wegen ihrer Kürze oder Zurückhaltung gelb.

### 3.3 Exakte Bedeutungen vor unscharfer Schreibweise

Bekannte korrekte und bekannte falsche Fachausdrücke werden vor jeder Ähnlichkeitssuche erkannt. Ein korrekt geschriebenes falsches Wort darf nicht zum Zielbegriff umgedeutet werden. Beispiel: „Zellmembran“ statt „Tonoplast“ ist kein Tippfehler.

Rechtschreibabstand wird nur für einen eindeutig isolierten Fachbegriff verwendet: mindestens fünf Zeichen, begrenzte Editierdistanz, klarer Abstand zum zweitnächsten Begriff, keine plausible gegensätzliche Fachbedeutung. Die Startregel aus dem Sinneslabor – maximal ein Editierschritt bei 5–8 Zeichen, maximal zwei bei längeren Begriffen, mindestens zwei Schritte Abstand zum nächsten Kandidaten – ist **nur ein Ausgangspunkt**, kein ungeprüfter Automatismus. Für konkrete Wörter gelten konservative Sonderregeln und Tests.

**Geschützte Kontraste ohne automatische unscharfe Umdeutung:** hydrophil/hydrophob, hypo-/hypertonisch, polar/unpolar, Endo-/Exocytose, ein-/auswärts, Zu-/Abnahme, positiv/negativ, Aktivierung/Hemmung. Zahlen und Einheiten werden nie durch Rechtschreibähnlichkeit „gerettet“. Eindeutig übliche Schreibvarianten dürfen explizit eingetragen werden.

### 3.4 Begrenzte Aussageerkennung

Zulässig sind drei Textprofile:

- **T1 Begriff:** eine Benennung mit optionalem bekannten Satzrahmen, etwa „Die Membran heißt …“.
- **T2 einzelne Relation:** ein benannter Stoff/eine benannte Struktur, eine Richtung oder Veränderung und gegebenenfalls ein vorgegebener Kontext. Beispiele: „Wasser netto nach außen“, „Vakuole wird kleiner“.
- **T3 enges Kausalpaar:** nur dort, wo eine endliche Menge von Beziehungen im Material vorliegt, über getrennte Ursache- und Folgefelder oder Kausalkarten. **Kein freier Mehrsatzaufsatz als T3.**

Ein allgemeines Aufteilen an jedem „und“ und anschließendes Negationssuchen reicht nicht: „Wasser tritt ein und aus; netto tritt es aus“ ist keine widersprüchliche Erklärung. Grammatische Bindung, Gegenüberstellung und Zeitbezug müssen für den zugelassenen Satztyp explizit behandelt werden. Nicht unterstützte Konstruktionen werden gelb, nicht still vereinfacht.

### 3.5 Relevante Reste und Widersprüche

Vor Grün muss die gesamte Eingabe geprüft werden. Zusätzlicher unbewerteter wissenschaftlicher Inhalt verhindert ein grünes Gesamturteil über diesen Text. Bekanntes höfliches Beiwerk darf eine Positivbewertung nicht blockieren; relevante Zusatzbehauptungen dürfen nicht ignoriert werden.

**Eindeutiger Widerspruch:** Dasselbe Objekt, dieselbe Zeit und dieselbe Richtung werden gleichzeitig behauptet und verneint, z. B. „Das Vakuolenvolumen nimmt ab und nimmt nicht ab.“ Diese Antwort ist als Ganzes nicht fachlich stimmig: rot mit beiden Textstellen. **Unklarer Bezug:** „Erst hinein, dann hinaus“ bei einer Frage nach einer bestimmten Anfangsphase wird ohne eindeutige Zuordnung gelb. **Korrigierende Verneinung:** „Nicht nach innen, sondern nach außen“ ist richtig, wenn im Fall nach außen gilt. „Wasser bewegt sich in beide Richtungen“ ist richtig als Einzelaussage, beantwortet allein aber noch nicht die Frage nach der Nettorichtung: gelb/teilweise, nicht rot.

### 3.6 Kriterien statt Musterwortlaut

Eine Rubrik enthält stabile Kriterien-IDs, fachliche Aussage, gültige Alternativen, Zustandsbedingungen, harte Gegenaussagen, unvollständige Ansätze und konkrete Rückmeldungen. Richtigkeit folgt aus Kriterien, nicht aus Ähnlichkeit zur Musterlösung. Die eigene Testantwortliste darf nicht als geheime vollständige Whitelist in die Laufzeitauswertung kopiert werden. Lexika und begrenzte Satzmuster sind legitim; ein vollständiger Golden-Testtextabgleich als Ersatz für Regeln nicht.

### 3.7 Rückfrage ohne Rückwirkung

Bei Gelb folgt zunächst eine konkrete Klärung: „Meinst du den Weg der einzelnen Wassermoleküle oder die Nettorichtung?“ Danach kann eine engere Auswahl kommen. Diese ist ein neuer Antwortschritt. Nach Auswahl einer richtigen Lösung wird `clarified` gespeichert; das System behauptet nicht, den ursprünglichen Text verstanden zu haben.

## 4. Vollständiges Beispiel A: Zellatlas

### Z1.01 Beschriftung

Die Antwortansicht enthält die acht geprüften Ziele aus dem Aufgabenkatalog. Drag, Tippfolge und Tastatur erzeugen dieselbe Antwortstruktur `{targetId: conceptId}`. Das Ziel ist die biologische Struktur-ID, nicht der Mittelpunkt eines Bildrechtecks. Kameraänderung verändert weder richtige Antwort noch Zielbedeutung.

**Kriterien:** je eine richtige Zuordnung zu Zellwand, Zellmembran, Tonoplast, Vakuole, Zellkern, Mitochondrium, Chloroplast und Cytosol. Eine falsch gezogene Karte wird nicht automatisch als Fachfehler verbucht, solange „Prüfen“ nicht ausgelöst ist. Ziehen abbrechen, zurücknehmen und tauschen sind möglich. Mehrfachzuordnungen nur entsprechend der Aufgabenregel. Ein Fall mit versehentlich verdecktem Ziel ist ein Softwarefehler, kein Schülerfehler.

**Rückmeldung bei Wand/Tonoplast-Verwechslung:** „Du hast die äußere feste Hülle gewählt. Gefragt ist hier die Membran um den inneren Vakuolenraum. Vergleiche die beiden Grenzen.“ Das nennt den Denkfehler, ohne falsche Optik zu legitimieren.

### Z1.02 Freitext

**Frage:** „Wie heißt die Membran, die die Vakuole umschließt? Ein Begriff genügt.“

**Pflichtkriterium A1:** Benennung Tonoplast oder Vakuolenmembran. **Teilansatz:** „Membran“, „Vakuolenhülle“ ohne eindeutige Benennung. **Sichere Fehler:** Zellwand, Zellmembran, Kernhülle, Vakuole als bloßer Raumname. **Unklar:** mehrere konkurrierende Begriffe ohne Entscheidung, uninterpretierter relevanter Zusatz.

| Schülerantwort | Sollstatus | Konkretes Feedback |
|---|---|---|
| „Tonoplast“ | grün | „Richtig. Der Tonoplast grenzt den Vakuolenraum vom Cytosol ab.“ |
| „Vakuolenmembran“ | grün | „Das ist eine zutreffende Bezeichnung für den Tonoplasten.“ |
| „Der Tonoplat.“ | grün bei eindeutigem, geprüften Tippfehlermatch | „Gemeint ist der Tonoplast. Die Zuordnung ist richtig.“ |
| „Membran“ | gelb/teilweise | „Du nennst die Art der Grenze. Ergänze, welche Membran gemeint ist.“ |
| „Zellmembran“ | rot | „Die Zellmembran begrenzt den Protoplasten nach außen. Hier ist die Grenze der Vakuole gefragt.“ |
| „Vakuole“ | rot | „Die Vakuole ist der umschlossene Raum, nicht der Name seiner Membran.“ |
| „Tonoplast oder Zellmembran“ | gelb/unklar | „Du nennst zwei verschiedene Grenzen. Entscheide, welche den Vakuolenraum umschließt.“ |
| „Nicht Zellwand, sondern Tonoplast“ | grün | „Deine Abgrenzung ist korrekt: Die Zellwand ist nicht die Vakuolenmembran.“ |
| „Tonoplast. Außerdem ist jedes Organell ein Bakterium.“ | nicht grün; gelb bei nicht ausgewertetem Zusatz | „Den Namen der Grenze kann ich zuordnen. Die zusätzliche Aussage wird in diesem Feld nicht zuverlässig geprüft. Trenne sie von deiner Benennung.“ |
| leer | neutral | „Trage einen Begriff ein oder nutze die Hilfe.“ |

Die Unklarheitsroute bei langem Zusatz ist keine fachliche Zustimmung. Wenn die Anwendung den Zusatz separat ausdrücklich und sicher als falsch prüft, darf sie dafür ein eigenes rotes Kriterium anzeigen; das ist ein zusätzlich spezifizierter Prüfschritt, nicht zufälliges Schlüsselwortmatching.

## 5. Vollständiges Beispiel B: Plasmolyse

### Unveränderlicher Fallkontext

Frische intakte Zwiebel-Epidermiszelle, Wasser permeiert Zellmembran und Tonoplast, Saccharose bleibt im betrachteten Zeitraum weitgehend außen. Geprüft wird eine frühe Phase nach dem Lösungswechsel mit ausdrücklich festgelegter Reihenfolge Ψ_Vakuole > Ψ_Cytosol > Ψ_Außenraum. Keine weiteren Transporte. Gefragt sind die Nettoflüsse im angezeigten Zustand. Der mathematische Austauschzeitpunkt kann zunächst gleiche Wasserpotenziale an Cytosol und Vakuole und damit noch keinen Fluss am Tonoplasten aufweisen; er ist nicht der hier bewertete Zustand. Die Wasserpotenzialbedingung steht ausdrücklich im Material; hohe Saccharosekonzentration allein wird nicht ohne Druckkontext als Beweis eingesetzt. [SM AB09/12–15; Aufgabenkatalog M6.02]

### Drei getrennte Textfelder

**B1 Vorgang:** „Wie heißt der Wassertransportvorgang?“ → Osmose. „Diffusion“ ist verwandter, aber zu unspezifischer Ansatz. „Aktiver Transport“ ist unter dem Fall falsch.

**B2 Richtung:** „In welche Richtung bewegt sich Wasser hier netto über die Zellmembran?“ → aus der Zelle/Cytosol in den Außenraum. Das im Fragesatz benannte Subjekt erlaubt „nach außen“. Ohne Nettorichtung ist „in beide Richtungen“ unvollständig, nicht falsch.

**B3 Volumen:** „Wie verändert sich in dieser Phase das Vakuolenvolumen?“ → nimmt ab. „Kleiner“ reicht, weil Objekt und Vergleich explizit gefragt sind. „Zellwand wird kleiner“ beantwortet eine andere Struktur und ist im vorliegenden Modell falsch.

| Feld und Antwort | Sollstatus | Rückmeldung |
|---|---|---|
| B1 „Osmosse“ | grün bei eindeutigem geprüften Match | „Du benennst Osmose: Hier wird die Wasserbilanz durch die selektive Grenze bestimmt.“ |
| B1 „Diffusion“ | gelb/teilweise | „Der Gedanke der Teilchenbewegung passt. Gesucht ist der spezielle Wassertransport durch die selektive Membran.“ |
| B2 „raus“ | grün | „Die Nettorichtung stimmt: Wasser verlässt die Zelle unter diesen Bedingungen.“ |
| B2 „Wasser tritt in beide Richtungen über, netto aber aus der Zelle.“ | grün | „Du unterscheidest Einzelbewegung und Nettotransport korrekt.“ |
| B2 „rein“ | rot | „Das passt nicht zum angegebenen Wasserpotenzialgefälle. Vergleiche Außenraum und Cytosol.“ |
| B2 „Die Saccharose geht nach außen.“ | rot | „Gefragt ist Wasser. Saccharose wird im vorliegenden Modell weitgehend zurückgehalten.“ |
| B2 „in beide Richtungen“ | gelb/teilweise | „Einzelne Wassermoleküle bewegen sich in beide Richtungen. Ergänze die Nettorichtung.“ |
| B2 „netto hinaus und gleichzeitig netto hinein“ | rot, wenn eindeutig gleicher Zeitpunkt/gleiche Membran | „Die beiden Nettorichtungen widersprechen sich für denselben Zustand. Entscheide anhand des Materials.“ |
| B2 „erst hinein, später hinaus“ | gelb/unklar | „Die Antwort enthält zwei Zeitpunkte. Gefragt ist nur die Anfangsphase nach dem Wechsel.“ |
| B3 „schrumpft“ | grün | „Das Vakuolenvolumen nimmt durch den Wasserverlust ab.“ |
| B3 „ändert sich“ | gelb/teilweise | „Eine Veränderung ist benannt. Ergänze, ob das Volumen zu- oder abnimmt.“ |
| B3 „wächst, weil Wasser austritt“ | rot | „Wasserverlust erklärt hier keine Volumenzunahme. Prüfe die Mengenbilanz der Vakuole.“ |

### Strukturierte Kausalerklärung

Die anschließende Aufgabe M6.03 verlangt die Verknüpfung: Wasserverlust → kleinerer Protoplast/Vakuolenraum und sinkender Turgor → bei ausreichendem Ausmaß Ablösung. Die beiden Folgen sind keine künstlich strikt geordnete Filmfolge. Kanten werden geprüft, nicht eine einzige Reihenfolge aller Karten. Die Zellwand bleibt annähernd formstabil. Die Aufgabe fordert somit eine biologische Erklärung, obwohl kein beliebiger Aufsatz interpretiert werden muss.

### Regelkreis und Wasseraufnahme nicht vermischen

Eine Beschreibung der passiven Wasserabgabe darf nicht durch automatisch eingefügte „Regulationsabsicht“ erklärt werden. Der spätere M9-Regelkreis enthält ausdrücklich einen Sensor-/Signalweg und eine Gegenreaktion; M6 allein belegt das nicht. Rückmeldungen sprechen von Bedingungen und Prozessen, nicht davon, was eine Zelle „will“.

## 6. Verbindliche Spezifikation je Aufgabentyp

| Typ | Auswertung | Besonderes Fehlerrisiko |
|---|---|---|
| Auswahl | stabile IDs und Begründungen je Option | Labelreihenfolge ändert sich, Bedeutung nicht; nicht „alles anklicken“ belohnen |
| Mehrfachauswahl | Kriterien für jede richtige und jede unzulässige Auswahl; vollständiges Set für Grün | Teilmenge richtiger Optionen gelb, falsche gewählte Option rot; leere Auswahl neutral |
| Zuordnung | semantische Ziel-/Antwort-IDs | Überlappung, Verdecken, erlaubte Mehrfachnutzung, Tastaturparität |
| Ordnung | Folge oder explizite Teilordnung/DAG | gleichwertige Reihenfolgen nicht zurückweisen |
| Kausalnetz | gerichtete Kanten samt Bedeutung/Vorzeichen | bloße gleiche Wörter ersetzen keinen Zusammenhang |
| Zahl | striktes Parseformat, Einheitenumrechnung, aufgabenspezifische Toleranz | Dezimalkomma, Vorzeichen, „mol/L“ vs „mmol/L“, Prozent vs Prozentpunkte |
| Diagramm | Datenkoordinaten/Achsen/Einheiten, keine Pixelästhetik | richtige alternative Skalierung, gleichwertige Eingabe über Zahlen |
| Versuch | gültige Designfamilien und erforderliche Vergleichsbedingungen | nicht nur eine Musterlösung als richtig; Konfundierung erkennen |
| Modellhandlung | Zustands-/Ereignisbedingungen und Vorhersagekontext | Animation kann falsch sein, obwohl Zahlen stimmen; Zustand nach Änderung veraltet |
| kurzer Text | T1/T2/T3-Vertrag wie oben | Rechtschreibung vs falscher Begriff, Negationsbereich, relevante Reste |

Folgefehler: ein falscher Ausgangswert wird nicht mehrfach als neuer unabhängiger Denkfehler gewertet. Wenn die folgende Rechnung folgerichtig ist, kann das entsprechende Verfahrenskriterium erfüllt sein; die sachlich richtige Endlösung bleibt getrennt. Jede Teilpunktentscheidung muss aus einer ausdrücklich geforderten Leistung folgen. Keine verdeckte pauschale Fachsprachnote.

## 7. Übernahme aus dem Sinneslabor: was ja, was nicht?

Der aktuelle Referenzstand `f55925a9611d69e1d3b8f66f1b77a9a195ad7332` wurde statisch in `src/evaluate.js`, `src/scoped-rules.js`, `src/state.js` und `package.json` gelesen. Eine lokale vollständige Testausführung dieses Repositories fand in dieser Bearbeitung nicht statt. [GH]

**Gute Ausgangsideen:** gemeinsame Korrektorfunktionen für UI und Tests; bekannte Fachbegriffe vor Rechtschreibähnlichkeit; spezifische Regeln; konservativer Klärungsweg; Unterstützung als eigener Herkunftswert; Fehlerbehandlung beim Speichern.

**Nicht unverändert übertragen:** fachfremdes Ohr-/Augenlexikon; pauschales Zerlegen von Sätzen an „und“; allgemeine Negationsheuristik; feste 24 Aufgaben/vier Niveaus; nur ein unveränderlicher erster Datensatz pro Antwortschritt; ein einziges korrektes Kartenordering; generische Fehlerrückmeldung statt belegter Teilaussage. Das sind statisch erkannte Grenzen für die neue Anwendung, kein hier ausgeführter vollständiger Fehlernachweis des alten Spiels.

Insbesondere kann eine in einem engen Ohrkontext sinnvolle Regel im Zellkontext einen Bedeutungsfehler erzeugen. Wiederverwendet werden geprüfte Architekturideen, nicht die Behauptung, das bestehende Modul sei ein allgemeiner deutscher Fachkorrektor.

## 8. Prüfbestände und Mindestumfang

### Bestand A: Redaktionsreferenz

Die mitgelieferte Datei `spec/reference-fixtures.json` enthält konkrete Eingaben, menschlich konzipierten fachlichen Sollgehalt, erwarteten Softwarestatus, Fehler-/Klärungsgrund und Rückmeldung. Sie ist **in dieser Bearbeitung erstellt, nicht unabhängig**. Es gibt noch keinen neuen Runtime-Korrektor, gegen den sie gelaufen wäre.

Sie dient als Startvertrag, nicht als alleiniger Testnachweis. Adversarial konstruierte lange oder mehrdeutige Sätze sind darin absichtlich häufig; daraus darf keine Häufigkeit realer Schülerformulierungen abgeleitet werden.

### Bestand B: Implementierungstests

Vor Freigabe je textlichem Antwortfeld mindestens 80 fachlich kuratierte Fälle als Startumfang: 24 richtige, 24 falsche, 12 unvollständige, 12 mehrdeutige und 8 technische/Formatfälle. Falls mehrere Felder dieselbe Regel nutzen, zusätzlich mindestens zehn feldspezifische Kontextfälle; eine globale Regelprüfung ersetzt diese nicht. Diese Zahlen sind Projektentscheidungen, keine statistische Garantie. Bei schwierigen Kontrasten wächst der Bestand.

Zusätzlich Metamorphietests: harmlose Großschreibung ändert den Inhalt nicht; Austausch „innen“/„außen“ kann ihn ändern; ein bekannter Widerspruch hinter einer zunächst richtigen Antwort darf Grün aufheben; 1000 mmol/L und 1 mol/L sind bei erlaubter Einheit gleichwertig; Ziffern-/Vorzeichenänderung nicht automatisch korrigieren.

### Bestand C: wirklich neue Gegenprüfung

Ein getrennter Prüfauftrag liest zuerst Frage, Material und fachliche Rubrik, **nicht zuerst die Implementierung oder deren Fälle**. Daraus entstehen zusätzliche, zuvor nicht verwendete Eingaben. Diese werden mit dem tatsächlichen gemeinsamen Runtime-Korrektor und zusätzlich über die UI ausgeführt. Erst nach Festlegung der Sollwerte werden Implementierung und bisherige Testberichte betrachtet.

Mindestens 40 neue Fälle je Textfeld bzw. semantisch gleichartiger Feldfamilie mit zusätzlicher feldspezifischer Abdeckung. Darunter mindestens 20 fachlich vollständige, natürliche korrekte Antworten, zwölf klare Fehler und vier Teil-/vier Mehrdeutigkeitsfälle. Nach Fehlerbehebung wird der neue Bestand Bestandteil der Regression; beim nächsten unabhängigen Prüfschritt entstehen wieder neue Fälle. Eine andere Modellbezeichnung allein ist kein Unabhängigkeitsnachweis.

Ist kein getrennter Prüflauf oder kein Ausführungswerkzeug verfügbar, lautet der Status **„Gegenprüfung ausstehend/technisch blockiert“**, nicht bestanden. Eine interne Zweitperspektive darf ergänzen, aber nicht als unabhängige Kontrolle etikettiert werden.

## 9. Freigabekriterien: Fehler und Erkennungsqualität

**Null akzeptierte kritische Fehler im tatsächlich geprüften Bestand:**

- fachlich falsche Antwort mit Grün;
- fachlich richtige, vollständige Antwort mit Rot;
- falsche Begründung trotz formal richtiger Farbe;
- ungeprüfter relevanter Textrest mit pauschalem Grün;
- Modellzustand, Frage oder Feedback nicht synchron;
- Material enthält nicht die zur Lösung benötigten Angaben;
- geschützte Prüfungsmaterialien im Repository/Artefakt;
- nicht durchgeführte Prüfung als bestanden deklariert.

Alle explizit spezifizierten Referenzfälle müssen den vorgesehenen Status erreichen. Eine absichtlich ungeklärte Formulierung darf gelb bleiben. Zusätzlich wird die Erkennungsqualität auf einem **getrennten repräsentativ angelegten Gegenprüfbestand** pro Feld gemessen:

```text
Grün-Erkennungsrate = korrekt grün erkannte vollständige Antworten
                     / alle fachlich vollständigen Antworten dieses Bestands
```

Start-Freigabeziel mindestens 95 %, ohne einen kritischen Fehlbefund. Eine richtige Formulierung, die aus Vorsicht gelb bleibt, zählt im Nenner weiter mit. Häufige Klärung wird weder aus dem Nenner entfernt noch durch eine vorselektierte Musterwortliste versteckt. Die adversariale Grenzfallsammlung wird separat ausgewiesen. Die 95 % sind ein **gewählter Entwicklungsmaßstab**, kein empirisch bewiesener Klasseneffekt. Mit realen, datensparsam erhobenen Formulierungen muss die Passung später nachgeprüft werden.

Bei Nichterreichen: konkrete Ursachen analysieren, Regel konservativ verbessern oder Aufgabe enger formulieren. Niemals einfach die Schwelle absenken, den Test löschen oder eine bisher falsche Klassifikation zur Sollantwort erklären. Fachliche Sollwertkorrekturen benötigen begründeten Änderungsnachweis und erneute Gegenprüfung.

## 10. Fach-, Browser- und Regressionstests

**Fachmodelle:** Erhaltung, Vorzeichen, Einheiten, Grenzfälle, Reservoirwechsel, Gleichgewicht, Druck, positive Volumina, Topologie, verfügbare Energie und begrenzte Gültigkeit. Referenzwerte stehen in `spec/model-vectors.json`. Kein bloßes Screenshoturteil über numerische Richtigkeit.

**Browser:** jede Aufgabe richtig, falsch, teilweise, leer und mit Hilfe bedienen; tatsächliche Farben, Texte und Symbole jedes Feldes prüfen; alle Eingabemethoden; Tastaturfokus; Modell-/Fragewechsel; Rücksetzen; doppelte Abgabe; Speicherausfall; Versionswechsel. Screenshotkontrolle für die 3D-Zuordnung und Schnittansichten, weil DOM-Tests Pfeilziele nicht belegen.

**Geräte:** Chromium und WebKit im Testsystem, zusätzlich echter Safari auf einem benannten iPad einschließlich Bildschirmtastatur, Hoch-/Querformat und Rückkehr nach Hintergrundpause. Geräteemulation ersetzt keinen realen iPad-Nachweis. [WEB-PLAYWRIGHT]

**Regression:** Nach jeder Änderung am gemeinsamen Korrektor, gemeinsamen Aufgabenformat oder Fachmodell laufen alle bereits implementierten Aufgaben und Varianten erneut. Ein neuer Inhalt braucht außerdem lokale Einzeltests und die vollständige gemeinsame Regression. Fehlende Geräte- oder Browserprüfungen werden mit Zielgerät/Grund offen ausgewiesen. Entwicklung kann weitergehen; die entsprechende Unterrichtsfreigabe bleibt ausstehend.

## 11. Nachweise, Fehlerregister und Freigabe

Jeder Prüfbericht nennt Commit-SHA, Inhalts-/Rubrik-/Modellversionen, Quellgrundlage, Umgebung, ausgeführte Befehle, eigene neue Fälle, Anzahl bestandener/fehlgeschlagener/übersprungener Tests, konkrete Reproduktionsschritte und Artefaktpfade. „Alle Tests bestanden“ ohne Bezug auf einen definierten Bestand ist unzulässig. `spec/review-manifest.schema.json` legt die Mindestfelder fest.

Fehlerregister: ID, Schweregrad, Aufgabe/Feld, Eingabe, erwartetes Ergebnis, tatsächliches Ergebnis, Version, Begründung, Reproduktion, Korrekturcommit und erneuter Prüfnachweis. P0 = Schutzverletzung/gefährlich irreführende fachliche Freigabe; P1 = falsche Richtig-/Falschwertung, falscher Fachzustand oder nicht bedienbare Pflichtleistung; P2 = Teilfeedback/Verständlichkeitsproblem ohne falsche Bestätigung; P3 = kosmetisch. P0/P1 blockieren die betroffene Freigabe; ein gemeinsamer Korrektorfehler blockiert alle betroffenen Missionen bis zur Regression.

Ein Modell darf seine eigene Arbeit als selbstgeprüft dokumentieren, aber nicht eigenmächtig den unabhängigen Freigabestempel setzen. Abschließende Unterrichtsfreigabe durch benannte Lehrkraft nach dokumentiertem Gegenprüflauf und Geräteprobe. Keine Garantie für sämtliche denkbaren Antworten; das eng definierte Aufgabenformat und konservative Gelb sind Sicherheitsmaßnahmen, keine Vollständigkeitsbehauptung.
