# D · Entwicklungsroadmap und Abhängigkeitsmatrix

**Stand 22.10.2026 · Konzept 1.0**

## 1. Arbeitsweise

Ein neues Repository ist vorgesehen, beispielsweise `Lernspiel-Zellbiologie-11`. Es wurde durch diese Konzeption **nicht** angelegt. Die vorhandene Anwendung `Lernspiel-Sinne` wird nicht verändert. Der Codex-Masterauftrag E beschreibt das Gesamtziel, erteilt aber keine Freigabe zur Komplettimplementierung in einem Schritt.

Jeder kleine Folgeauftrag nennt eine Phase oder einen Teil davon, den Ausgangscommit, die relevanten Spezifikationsstände, erlaubte Änderungen, überprüfbare Ergebnisse und Abbruchbedingungen. Der jeweils ausführende Agent liest die Originalaufgaben und Regeln selbst. Ein anderer Bericht ersetzt diese Prüfung nicht.

**Technische Entwicklungsreihenfolge ist nicht Lernreihenfolge:** Z1 und M6 sind die ersten vollständigen vertikalen Ausschnitte. Im späteren geführten Schülerpfad bleibt M6 hinter Diffusion/Osmose. Eine frühe Plasmolyse-Demo erhält nötige Kurzmaterialien; sie wird nicht als fertige gesamte Unterrichtsprogression veröffentlicht.

## 2. Phasenmatrix

| Phase | Ziel und Komponenten | Abhängigkeit | Fachlicher Schwerpunkt | Erfolgskriterium/Tests | Hauptrisiko und Freigabe |
|---|---|---|---|---|---|
| P00 | Quellen-/Schutzprüfung, Projektgerüst, AGENTS, Toolchain, README | Konzeptpaket A–F | keine geschützten Unterrichts-Klausurdateien im Git | leeres, lauffähiges Vite/TS-Gerüst; Inhalts- und Schutzmanifest; reproduzierbarer Build | versehentlicher Upload des Gesamtpakets; vor erstem Commit prüfen |
| P01 | Schemaüberführung, stabile IDs, TaskContext, Einheiten, Fortschrittsvertrag | P00 | gleiche Frage darf bei anderem Modellzustand anderes Ergebnis verlangen | Autorenspezifikation ↔ Runtime vollständig abgebildet; 79 IDs unverändert; Schema- und Migrationsfehlerfälle | schematisch valide, aber semantisch veränderte Aufgaben; Fachvergleich je Aufgabe |
| P02 | begrenzter Korrektor T1/T2, Zahlenprüfung, Kriterienfeedback | P01 | Negation, Richtung, Synonyme, Tippfehler vs Fachfehler | gemeinsame Pure-Funktionen; Referenzfälle plus eigener neuer Bestand; keine Laufzeitimports von Testantworten | zu großzügiges Grün oder häufiges Gelb; keine Schülerfreigabe ohne Gegenprüfung |
| P03 | DOM-Oberfläche, Navigation, Hilfen, Zuordnung, Auswahl, Ordnung, Kausalnetz, kurze Texte | P01–02 | Methodenparität und unveränderte Aussage beim Bedienwechsel | jeden Zustand über Maus/Touch/Tastatur; tatsächliche Farben/Symbole/Texte; Kontextwechsel invalidiert Feedback | Kamera-/Dragkonflikte, alte grüne Antwort nach Fallwechsel |
| P04 | vollständige Mission Z1 mit Blatt-/Tier-/Zwiebelprofil und 2D/3D-Schnitten | P03 | Zellgrenzen und verschiedene Zelltypen | vier Aufgaben vollständig; Ankerprüfung; einzelne Organellenfunktion; Browserbilder und unabhängige Antworten | bloß hübsches unlesbares 3D-Modell; fachliche Sichtprüfung blockiert Freigabe |
| P05 | reines Drei-Raum-Osmosemodell, Wandmechanik, Bilanz, Einheiten | P01 | Wasserpotenzial, Turgor, Reservoirkonto | analytische Referenzen, Gleichgewicht, Flusszeichen, positiver Zustand, Schrittweitenprüfung | numerische Instabilität als Biologie ausgegeben; Fachmodell muss zuerst bestehen |
| P06 | vollständige M6-Plasmolysemission mit Vorhersage und enger Freitext-/Kausalprüfung | P02–05 | Wasserverlust, Wand/Protoplast, Rücktausch, Kontrollbedingungen | alle vier Aufgaben, drei Textfelder, gleiche Ergebnisse in 2D/3D; vollständige Regression Z1+M6 | Simulation und Erklärung widersprechen sich; vertikale Abnahme beider Missionen |
| P07 | getrennte Gegenprüfung des Grundsystems, Problembehebung, stabile Schnittstellen | P04,P06 | neue, nicht vom Implementierungsbestand abgeleitete Fälle | neue Sollwerte vor Codelektüre, tatsächlich ausgeführte Prüfungen, keine P0/P1, Geräteprobe dokumentiert | Selbstbestätigung; Reviewer kann keine eigene Unabhängigkeitsfreigabe erfinden |
| P08 | Z2, Z3, Z4, D0 und E1–E3 | P07 | Kompartimente, Endosymbiose, Verfahrensgrenzen, Grundlagen | 27 zusätzliche Aufgaben vollständig; Befund/Deutung, Teilordnung, Diagnoseempfehlung, keine praktische Kompetenz behauptet | digitale Mikroskopie als realer Methodennachweis; explizit verhindern |
| P09 | M1–M5 und ergänzende Visualisierungen | P05,P07 | Chemie, Bilayer, selektive Passage, Diffusion, Osmose | 20 zusätzliche Aufgaben; gefährliche Begriffspaare, stochastische Vorhersage, Druckausgleich | bloße Konzentrationsregel; alle relevanten Gegenfälle prüfen |
| P10 | M7/M8 Transport und Vesikel | P08,P09 | passive/aktive Wege, ATP-Schluss, elektrische Beiträge, Topologie | acht Aufgaben; Raten-/Flächenskalierung, Energie-Szenarien, Orientierung; Regression | kein unmittelbarer ATP-Nachweis aus Korrelation; keine Membranseitenumkehr |
| P11 | M9 funktionale Volumenregulation | P09,P10 | drei Räume und negative Rückkopplung | vier Aufgaben; Sollbereich, eigener Rückpfeil, Blockade; Szenariengrenzen sichtbar | universelles oder scheinpräzises Zellphysiologiemodell; erlaubte Fälle begrenzen |
| P12 | M10, Diagrammwerkzeug, strukturierte Versuche, acht Trainingsaufgaben | P08–11 | Daten, Normierung, Alternativerklärung und Transfer | zwölf Aufgaben; alle validen Designfamilien, Einheitentests, private Fallnäheprüfung | Aufgabenoffenheit überfordert Korrektor; ggf. weiter zerlegen |
| P13 | Gesamtabnahme, Leistung, Veröffentlichung, echte Geräte-/Lerngruppenprobe | alle vorherigen | verlässliche Klausurvorbereitung | alle 79 Aufgaben/Teilfelder in jeder zugelassenen Variante, Quellen-/Schutzprüfung, neue Gegenfälle, Gerätetests, dokumentierte Restliste | fehlende Prüfumgebung als bestanden ausgegeben; Freigabe bleibt bei offenen Pflichtprüfungen ausstehend |

P08 enthält Z2/Z3/Z4 mit je vier Aufgaben (12), D0 mit sechs und E1–E3 mit neun, also 27. P09 5×4=20; P10 8; P11 4; P12 4+8=12; zusammen mit Z1/M6 (8) ergeben sich 79. P07 ist eine eigene Prüfung, kein zusätzlicher Inhaltsblock.

## 3. Zerlegung in kleine Codex-Aufträge

Eine Phase darf in mehrere begrenzte Pakete zerlegt werden. Ein sinnvoller Schnitt hat **ein benennbares Ergebnis**, etwa „Tonoplast-Begriffsprüfung samt Fehlerfällen“ oder „Drei-Raum-Bilanz ohne Grafik“. Nicht sinnvoll ist „an vielen Stellen ein bisschen optimieren“ ohne Abnahmepunkt.

Jeder Teilauftrag übernimmt unverändert:

1. **Kontext:** AGENTS, Spezifikationsversion, relevante Aufgaben-/Modell-IDs, Ausgangscommit.
2. **Ziel:** konkret sichtbare bzw. prüfbare Funktion; keine zusätzliche Aufgabe ohne fachlichen Vertrag.
3. **Grenze:** erlaubte Dateien/Komponenten und ausdrücklich nicht enthaltene Erweiterungen.
4. **Nachweis:** auszuführende lokale Tests, gemeinsame Regression, eigene neu abgeleitete Fachfälle, erforderliche UI-Bilder.
5. **Ergebnis:** Commit/Branch, Testmanifest, Fehlerregister und nicht ausgeführte Prüfungen; kein automatischer Merge.

Die spätere Zerlegung darf die fachliche Konzeption nicht stillschweigend umdeuten. Bei einem echten Widerspruch wird eine Änderungsnotiz angelegt: betroffene IDs, Problem, Quelle, vorgeschlagene Präzisierung, Folgewirkung, neue Tests. Keine neue Pro-Bearbeitung ist für jede kleine Dateiumbenennung nötig; grundlegende Änderungen an Physik, Rubriken oder Aufgabenreichweite benötigen fachliche Gegenprüfung.

## 4. Definition of Ready und Definition of Done

### Vor Beginn eines Auftrags

Die benötigten Aufgaben liegen mit Material und Erwartung vor; das Format hat einen definierten Prüfumfang. Die Quelle ist zugänglich oder ihre Einschränkung dokumentiert. Es gibt keine unbekannte Pflichtabhängigkeit. Private Inhalte sind nicht in den Arbeitsbaum kopiert. Testumgebung und Ausgangscommit sind benannt.

Fehlt eine echte Voraussetzung, werden unabhängige Teile weiterbearbeitet und die betroffene Freigabe blockiert. Keine Erfindung fehlender Originalmaterialien. Ein Schemaänderungsauftrag kann vor dem Gerätetest eines späteren 3D-Modells stattfinden; er darf aber keine Gerätefreigabe behaupten.

### Am Ende eines Implementierungsauftrags

Code und Inhalte entsprechen dem abgegrenzten Auftrag. Eigene fachliche Fälle wurden tatsächlich ausgeführt. Alle bereits betroffenen Runtime-Pfade sind getestet; gemeinsame Änderungen haben die vollständige vorhandene Regression durchlaufen. Jede neue Datei und jedes Asset hat einen Zweck. Fehlende Werkzeuge, übersprungene Tests und offene Befunde sind ausdrücklich dokumentiert. „Done im Entwicklungsauftrag“ ist nicht automatisch „für die Klasse freigegeben“.

### Unterrichtsfreigabe

Getrennter Gegenprüflauf und echte Zielgeräteprobe abgeschlossen; keine offenen P0/P1-Befunde; Aufgaben verständlich und Zeitannahmen mindestens klein pilotiert; Lehrkraft hat die inhaltliche Freigabe dokumentiert. Ein eingeschränkt freigegebener Stand zeigt nur die tatsächlich freigegebenen Missionen. Keine Platzhaltermissionen als fertig markieren.

## 5. Aufwandstreiber und sinnvolle Begrenzungen

Größter Aufwandstreiber ist die **validierte Interpretation kurzer Texte**, nicht die Anzahl der Textfelder. Zusätzliche offene Texttypen benötigen neue Regeln und neue Gegenprüfungen. Ein kleineres Set kontrollierter Felder ist vorzuziehen.

Zweiter Aufwandstreiber ist das **gleichzeitige Fach- und Darstellungsmodell** für Plasmolyse. Deshalb zunächst Pure-Modell und 2D-Kontrolle, danach 3D. Dritter ist reale iPad-Bedienbarkeit: Bildschirmtastatur, Sichtbarkeit, Kontextverlust und Speichereinschränkungen müssen am Gerät geprüft werden.

V1 erhält keine allgemeine Molekulardynamik, keine freie Mehrionenphysiologie, keine KI-Benotung und keine Mehrspielerverwaltung. Solche Funktionen sind keine versteckten späteren Pflichtteile. Eine Offline-PWA ist eine optionale Nachfolgephase erst nach stabiler Onlinefreigabe; sie darf keine veralteten Aufgabenversionen unbemerkt konservieren.

Es werden bewusst **keine belastbaren Entwicklungsstunden oder Fertigstellungstermine** behauptet. Umfang und Geschwindigkeit hängen von Werkzeugen, Fehlerbefunden, Assetarbeit und verfügbaren echten Testgeräten ab.

## 6. Kontinuierliches Sicherheitsnetz

Der Implementierer prüft selbst. Ein getrennt beauftragter Prüfer leitet neue Fälle aus Materialien ab. Beide führen die ihnen möglichen Prüfungen tatsächlich durch und dokumentieren Grenzen. Der gemeinsame Bericht ist eine Vergleichsgrundlage, kein Ersatz für eigene Handlungen. Modelle mit gleichem Ausgangswissen sind dadurch nicht statistisch unabhängig; der Nutzen liegt in getrennten Sollwertableitungen, neuen Fällen und realen Ausführungsnachweisen.

Bei einer Korrektur werden alle betroffenen und gemeinsamen Regressionen erneut gestartet. Kein Test verschwindet, nur weil er unbequem ist. Ein Schema-/Rubrikfehler wird fachlich korrigiert und versioniert, nicht durch Anpassung des Sollwerts an den Code kaschiert. Das Fehlerregister bleibt Teil der Projektgeschichte.
