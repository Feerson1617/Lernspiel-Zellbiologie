# B · Technisches Pflichtenheft und biologische Modellverträge

**Konzept 1.0 · 22.10.2026 · Noch keine Spielimplementierung**

## 1. Festgelegter Stack und verworfene Alternativen

**TypeScript mit strenger Typprüfung, Vite, Three.js/WebGL2, semantisches HTML/CSS für die Oberfläche, SVG für Diagramme und 2D-Schnitte.** Vitest prüft reine Logik, Playwright die Browserwege. Kein React-Zwang, kein zusätzlicher 2D-Spielmotor, keine allgemeine 3D-Kollisionsphysik. Die Anwendung besitzt weder frei laufende Spielfiguren noch eine Physiksandbox; eine solche Engine würde das fachliche Modell nicht ersetzen.

Three.js verwendet im hier gewählten Renderer WebGL2; deshalb ist WebGL2-Erkennung mit funktionaler 2D-Rückfallebene erforderlich. Vite baut eine statische Ausgabe; bei GitHub Pages muss der Repository-Unterpfad korrekt gesetzt werden. [WEB-THREE; WEB-VITE]

Blender dient zur kontrollierten Modellierung, GLB/glTF 2.0 zum Export. Anatomische Identitäten liegen in einem eigenen Manifest, nicht in zufälligen Meshnamen oder Farben. Kompression wird erst nach Messung eingesetzt; Decoder und Texturen liegen lokal, nicht auf fremden Laufzeit-CDNs. [WEB-BLENDER]

**Kein Sprachmodell im Korrekturpfad der ersten Unterrichtsfassung.** Lokale Inferenz ist technisch möglich, etwa mit WebLLM/WebGPU, belegt aber keine aufgabenspezifische fachliche Verlässlichkeit. Ein zusätzlicher Modell-Download und variierende Geräteanforderungen würden die erste Fassung schwerer kontrollierbar machen. Die Entscheidung ist eine Risikoabwägung für dieses Projekt, keine Behauptung, dass lokale Sprachmodelle grundsätzlich unbrauchbar sind. [WEB-LOCAL]

Bibliotheksversionen und kompatible Node-Version werden bei Einrichtung anhand der aktuellen offiziellen Anforderungen gewählt und exakt im Lockfile festgehalten. Keine ungeprüfte Übernahme einer Versionsnummer aus diesem Konzept; keine automatischen Hauptversionswechsel im Unterrichtsbetrieb.

## 2. Modulgrenzen und Datenfluss

```text
spec/                    redaktionelle Aufgaben-, Missions- und Regelverträge
src/domain/              Typen, Einheiten, Validierung, unveränderliche Kontextdaten
src/biology/             reine Zustands-/Bilanzfunktionen, Szenario-Modelle
src/assessment/          Parser, Kriterienprüfung, Ergebnisaggregation
src/content/             freigegebene Aufgaben und notwendige Lernkarten
src/application/         Missionen, Versuche, Vorhersage/Experiment/Zustandswechsel
src/ui/                  DOM, Feedback, Formulare, Navigation, Accessibility
src/render3d/            Three.js-Adapter, Auswahl, Schnittansicht, Lifecycle
src/render2d/            gleichwertiger SVG-Adapter, Diagramme
src/persistence/         versionierte Lernstände und expliziter Export/Import
src/assets/              kontrollierte lokale Laufzeitdateien und Manifest
assets-source/           Blender-Quelldateien, nicht Bestandteil des Web-Bundles
qa/                      Prüfnachweise, fachliche Referenzen, Fehlerregister
review/                  neue Gegenprüffälle des getrennten Prüfauftrags
```

**Datenfluss:** Aktion → validierter Fachkontext → biologischer Zustand → Ansicht. Antwort + unveränderlicher Aufgaben-/Zustandskontext → Kriterienprüfung → Ergebnis → Feedbackansicht. Der Renderer entscheidet weder über Wasserbewegung noch über Richtigkeit. Ein Dropdown in der UI darf keine zweite, abweichende Fachberechnung enthalten.

Alle Modellfunktionen erhalten Eingaben und geben neue serialisierbare Zustände zurück. DOM, Three.js-Objekte, Browserzeit und Zufall ohne expliziten Seed sind darin ausgeschlossen. Zufallszahlen haben einen expliziten Generatorzustand. Jede Darstellung eines Pfeils oder Messwerts wird aus derselben Zustandsquelle abgeleitet.

## 3. Gemeinsame Verträge

`spec/contracts.d.ts` beschreibt die wesentlichen Schnittstellen. Verbindlich sind insbesondere:

- `TaskContext`: Aufgaben-, Rubrik-, Modell- und Inhaltsversion; Szenariohash; Seed; eingefrorene Materialwerte; Phase.
- `EvaluationResult`: Status pro Kriterium und Feld; belegte Textstellen bzw. ausgewählte IDs; erkannte Fehler; noch unklare Bestandteile; kein pauschaler Vertrauenswert eines Sprachmodells.
- `AttemptRecord`: Aufgabeninstanz, Ergebnis, Unterstützungsart, Version; **keine dauerhafte Speicherung des Rohtexts** in der Standardfassung.
- `BiologySnapshot`: Modell-ID, Version, Zeit bzw. Szenariostufe, physikalische Größen mit Einheiten, Bilanzkonto, Gültigkeitsstatus.
- `AssetManifest`: stabile Struktur-IDs, Mesh-/SVG-Anker, Zellprofil, Maßstab, Vereinfachungen, Lizenz, Quelldatei, Prüffassung.

Die mitgelieferten JSON-Dateien sind **redaktionelle Spezifikationen**. Die maschinenlesbaren Erwartungen sind die fachliche Grundlage für Runtime-Definitionen. Codex darf beim Überführen in streng typisierte ausführbare Typen keine neue fachliche Aufgabenidee erfinden und keine richtige Alternative streichen. Zulässige reine Schematransformationen werden dokumentiert und durch Vergleichstests abgesichert.

## 4. Modellarten klar unterscheiden

| Modell | Typ in der ersten Unterrichtsfassung | Was berechnet bzw. vorgegeben wird |
|---|---|---|
| Zellatlas/Endosymbiose | interaktives Struktur-/Erklärungsmodell | geprüfte Strukturen, Beziehungen, Verzweigungen |
| Membranaufbau | begrenztes Anordnungsmodell | Orientierung und Adjazenz, keine Selbstorganisation aus Atomkräften |
| Diffusion | stochastisches Teilchenzahlmodell | explizite Übergangswahrscheinlichkeiten, Mengenbilanz |
| Osmose/Plasmolyse | berechnetes Kompartimentmodell | Wasserpotenziale, Volumina, idealisierte Wandmechanik |
| Neutraler passiver Transport | berechnetes Ratenmodell | begrenzter Proteinbeitrag plus Lipidweg |
| Aktiver Transport | energiebezogenes Funktionsmodell mit geprüften Szenarien | Richtung, Kopplung und verfügbare Antriebe; keine behauptete Zellkinetik |
| Vesikeltransport | topologisch korrektes Struktur-/Ablaufmodell | Cargo- und Membranseitenzuordnung |
| Volumenregulation Tierzelle | begrenztes Szenario-/Regelkreismodell | qualitative Kausalkette, vorgegebene didaktische Zustände |
| Tabellen/FRAP | didaktisch erstellte Datensätze | feste neue Werte mit benannten Annahmen |

Jede Mission zeigt diesen Status kurz an. Ein unterrichtliches Modell darf idealisiert sein; es darf nicht als tatsächliche Messung ausgegeben werden.

## 5. Fachmodell BM01 · Zelltypen und räumliche Beziehungen

Drei Profile: `plant_leaf`, `onion_epidermis`, `animal_epithelial`. Blattzelle: Zellwand, Zellmembran, Cytosol, Vakuole mit Tonoplast, Zellkern, Mitochondrien, Chloroplasten, ER, Golgi, Ribosomen. Zwiebelprofil: keine Chloroplasten; roter Zellsaft nur im Vakuolenraum. Tierprofil: keine Zellwand und keine pflanzentypische Zentralvakuole; kein Tonoplast als allgemeine Tierzellgrenze. [SM AB01–02/12–15]

**Begriffe:** Cytosol ist die flüssige Grundphase; Cytoplasma umfasst im üblichen Zellmodell Cytosol und darin liegende Zellbestandteile außerhalb des Kerns. Der Zellatlas erläutert die Unterscheidung, bevor ein präziser Cytosolanker geprüft wird. Keine durchsichtige „leere Luft“ zwischen Protoplast und Zellwand: Dieser Spalt enthält Außenlösung.

**Topologische Invarianten:** Tonoplast umschließt Vakuolenlumen; Zellmembran umschließt Protoplasten; Zellwand liegt außen; Ribosomen besitzen keine umgebende Biomembran. Mitochondrien/Chloroplasten erhalten zwei Hüllmembranen; eine Hüllmembran ist nicht bloß eine der beiden Lipidlagen. Organellenmengen sind illustrative Beispiele, keine festen Zahlen aller Zellen. Schematische Überhöhung dünner Grenzen wird angegeben.

**Asset-Abnahme:** dieselbe Struktur-ID führt in 3D, Schnittansicht, Textalternative, Aufgabe und Lösung zur selben Struktur. Ankermarker enden auf der gemeinten Grenze bzw. im gemeinten Raum. Die Rückseite einer Wand darf nicht zum Tonoplastziel werden. Unsichtbare Ziele werden in der Prüfansicht nicht angeboten.

## 6. Fachmodell BM02 · Membran und Teilchen

Ein Modellphospholipid besitzt einen hydrophilen Kopf und zwei hydrophobe Ketten. Es ist eine begründete typische Vereinfachung, kein Anspruch auf alle natürlichen Lipidtypen. Die hydrophoben Ketten treffen im Inneren aufeinander; zwei wässrige Räume liegen außen an. Symbole sind keine atomaren Strukturen. Wasser ist insgesamt neutral, seine Teilladungen werden am Sauerstoff- bzw. Wasserstoffbereich korrekt gesetzt. [SM AB05–07]

Laterale Bewegung findet innerhalb einer Lage statt; spontanes häufiges Flipflop wird nicht als Normalanimation eingebaut. Proteinbeweglichkeit kann begrenzt sein. Ein Wasserkanal beschleunigt passiven Durchtritt und wird nicht als ATP-Wasserpumpe gezeigt. Kohlenhydratketten an Zelloberflächen werden nicht zufällig auf beide Membranseiten verteilt. Für die erste Aufgabenserie genügen Lipide und eindeutig dargestellte Transportproteine; zusätzliche Details müssen fachlich erklärt werden.

Visualisierte Teilchen sind **repräsentative Symbole**. Ihre Anzahl ist nur im ausdrücklich diskreten Diffusionsmodell eine berechnete Teilchenzahl. Partikel im Osmosemodell illustrieren bidirektionale Bewegung, nicht eine vollständige Molekulardynamik oder exakte Molekülzählung.

## 7. Fachmodell BM03 · Diffusion

### Gleiche Volumina

Aus dem alten Zustand `N_L,N_R` werden unabhängig `X_LR ~ Binomial(N_L,p)` und `X_RL ~ Binomial(N_R,p)` gezogen. Dann gleichzeitig:

```text
N_L' = N_L − X_LR + X_RL
N_R' = N_R + X_LR − X_RL
```

Für die Startaufgabe: N=24, N_L=18, N_R=6, p=0,25. Erwarteter Nettofluss pro Schritt = p(N_L−N_R)=3 nach rechts, aber ein konkreter Schritt darf anders ausfallen. **Bewertet wird die statistische Vorhersage, nicht die zufällige Realisierung.** Seeds und sichtbare Daten gehören zum Aufgabeninstanzkontext. Bei Gleichgewicht ist nicht in jedem Schritt die Anzahl genau gleich. [SM AB08; eigene Diskretisierung]

### Ungleiche Volumina

Gleiche Übergangswahrscheinlichkeit pro Teilchen wäre hier ohne geometrische Erklärung ungeeignet. Für das begrenzte Zwei-Raum-Modell werden Übergangsraten proportional `k/V_L` und `k/V_R` gesetzt, mit ausreichend kleinem Zeitschritt, so dass Wahrscheinlichkeiten ≤1 bleiben. Erwartete Flüsse gleichen sich bei gleichen Konzentrationen `N_L/V_L=N_R/V_R` aus. Keine Behauptung einer realen mikroskopischen Geometrie.

**Tests:** Gesamtzahl erhalten; ganze nichtnegative Zahlen; kein Überspringen eines Raums im selben Schritt; Seed reproduzierbar; Erwartungswert über mehrere feste Seed-Sätze geprüft; ausführlich erklärte Bandbreite statt flackernder Zufallstests. Gleichgewichtsanimation läuft weiter. Ein deterministischer Tabellenfall kann separat exakt geprüft werden.

## 8. Fachmodell BM04 · Wasserpotenzial und Plasmolyse

### Gültigkeitsbereich

Intakte Pflanzenzelle, Wasser permeiert, betrachtete Solute bleiben im Zeitfenster zurückgehalten. Gleiche konstante Temperatur; verdünnte idealisierte Lösung; keine Reaktion, kein Stoffwechsel, keine Matrix-/Gravitationseffekte und keine aktive Wasserpumpe. Wandmechanik ist elastisch idealisiert; Adhäsion, Hecht-Fäden, Hysterese und irreversible Schädigung sind nicht quantitativ modelliert. Die Begrenzung wird im Modellpass genannt. Die Grundlage sind Druck- und Konzentrationsbedingungen in AB09/15; die folgende Rechenfassung ist ein **eigener technischer Entwurf**. [SM AB09/12–15]

### Einheiten

Intern SI: Volumen m³, Stoffmenge mol, Konzentration mol/m³, Druck Pa, Temperatur K. Anzeige darf pL, mol/L und MPa nutzen. `1 mol/L = 1000 mol/m³`; `1 pL = 10^-15 m³`; `1 MPa = 10^6 Pa`. Osmotische Konzentration zählt wirksame Teilchen; eine Salzformeleinheit darf nicht stillschweigend wie ein einzelnes ungeladenes Molekül behandelt werden.

Für einen Raum j:

```text
C_osm,j = n_osm,j / V_j
Ψ_j = P_j − R T C_osm,j
R = 8,314462618 J/(mol K)
```

Diese Form berücksichtigt im gewählten Modell den Solut- und Druckbeitrag. Kein allgemeines Naturgesetz „Wasser immer zur höheren Stoffkonzentration“ wird daraus abgeleitet.

### Drei Räume und Bilanz

Außenraum e, Cytosol c, Vakuole v:

```text
Q_ec = G_ec (Ψ_e − Ψ_c)
Q_cv = G_cv (Ψ_c − Ψ_v)
dV_e/dt = −Q_ec
dV_c/dt =  Q_ec − Q_cv
dV_v/dt =  Q_cv
```

G besitzt die Einheit m³/(Pa s) und ist hier eine Modellleitfähigkeit. Positive Richtung ist jeweils die im Index benannte Richtung. Keine zweite Flussformel in der Grafik. Die Solutmengen bleiben ohne explizites Ereignis erhalten.

Im endlichen System bleibt `V_e+V_c+V_v` konstant. Bei einem ausdrücklich gewählten großen Außenreservoir sind äußere Konzentration und Druck geklemmt; alle zu-/abgeführten Wasser- und Solutmengen werden in einem **Reservoirkonto** bilanziert. Ein Schieberegler, der die Außenlösung austauscht, ist ein protokolliertes Austauschereignis, keine scheinbar geschlossene Massenerhaltung.

### Druck und Wand

Die vereinfachte Grundfassung nimmt gleichen hydrostatischen Druck in Cytosol und Vakuole an; Konzentrationsunterschiede können dennoch verschiedene Wasserpotenziale an beiden Membranen erzeugen. Weitere Organellvolumina werden aus dieser Wasserbilanz ausgeblendet und als Darstellungsvereinfachung ausgewiesen.

```text
V_cell = V_c + V_v
P_cell = K_wall · max(V_cell / V_relaxed − 1, 0)
```

Unterhalb des entspannten Wandvolumens ist der Turgor im Modell null; der Protoplast kann sich verkleinern und ablösen, ohne die Zellwand entsprechend zu verkleinern. Oberhalb dehnt sich die Wand geringfügig. Die scharfe Grenzfunktion ist eine didaktische Näherung und kein Modell jeder Phase realer Ablösung.

### Analytisch prüfbarer Startfall

Technische Referenz, keine echte Zwiebelmessung: T=293,15 K; V_c=10 pL; V_v=90 pL; C_c=C_v=0,30 mol/L; C_e=0,10 mol/L; P_e=0. Setze P_cell=R·T·(300−100) Pa und K_wall=50 MPa. Definiere V_relaxed=100 pL/(1+P_cell/K_wall). Damit sind die drei Wasserpotenziale zu Beginn gleich. Die Solutmengen werden aus Konzentration mal Volumen berechnet.

Nach Austausch des Außenreservoirs gegen 0,50 mol/L ist zunächst Wasserabgabe nach außen zu erwarten. Ohne Druck liegt das rechnerische gemeinsame Endvolumen bei `n_total / C_e = 60 pL`, verteilt entsprechend den Solutmengen auf 6 pL Cytosol und 54 pL Vakuole. Das ist ein idealisierter Referenzzustand, nicht die Behauptung eines realen Messwerts oder einer bestimmten Beobachtungsdauer. Rücktausch auf die anfänglichen Außenbedingungen erlaubt im reversiblen Modell die Rückkehr zum Anfangszustand.

Leitfähigkeiten werden erst im Prototyp festgelegt und vollständig dokumentiert. Die Uhr zeigt bis zur empirischen Kalibrierung **Modellzeit**; eine simulierte Sekunde darf nicht als experimentell ermittelte Zwiebelreaktionszeit erklärt werden. Die dynamische Lösung ist vor Freigabe numerisch zu prüfen; die jetzige Konzeptprüfung kontrolliert nur Referenzarithmetik und Invarianten, nicht einen schon implementierten Integrator.

### Numerische Sicherheit

Adaptiver Integrationsschritt oder andere dokumentiert stabile Methode; Volumina dürfen nicht negativ werden. Ein unzulässiger Schritt wird verworfen und verkleinert. Kein stilles Abschneiden negativer Werte, weil das Bilanzen verfälschen würde. Bei dauerhaft unzulässigem Zustand: Simulation pausieren, Aufgabe nicht benoten, Fehlerzustand sichtbar dokumentieren.

Referenzziele für die Implementierung: relative Volumenbilanzabweichung ≤10^-8 in geschlossenen Testläufen, relative Solutmengenabweichung ≤10^-10 bei reinem Wassertransport; Schrittweitenhalbierung verändert die geprüften Endvolumina um <0,1 %. Diese Grenzen sind eigene technische Abnahmewerte. Die Toleranz für „praktisch kein Nettofluss“ ist im Modellvertrag separat anzugeben, nicht aus einer hübschen ruhenden Grafik abzuleiten.

## 9. Fachmodell BM05 · Membrantransport

**Passiver ungeladener Modellstoff**, keine chemische Veränderung, Bindung oder Kompartimentverschiebung:

```text
J_lipid = P_s · A · (C_out − C_in)
J_carrier = J_max · [C_out/(K_m+C_out) − C_in/(K_m+C_in)]
J_total = J_lipid + J_carrier
```

P_s in m/s, A in m², J in mol/s; J_max in mol/s und bei gleichbleibender Proteindichte proportional zur Fläche. K_m in mol/m³. Dieses symmetrische Sättigungsmodell ist eine bewusst einfache Funktionsbeschreibung, kein universeller Carriermechanismus. Es liefert null bei gleichen Konzentrationen, die richtige Vorzeichenumkehr und einen begrenzten Proteinbeitrag. Ein zusätzlich linearer Lipidanteil darf weiterhin zunehmen; deshalb nicht eine zwingend vollständig waagerechte Gesamtkurve verlangen.

**Aktive Mechanismen:** Im ersten Produkt werden klar definierte Funktionsfälle gezeigt. Primär: nachgewiesene direkte Energie-Kopplung des Modellproteins. Sekundär: das Gefälle eines anderen Stoffes treibt an; der Aufbau dieses Gefälles ist eine getrennte Energieleistung. Abschalten der ATP-Bereitstellung muss nicht augenblicklich jeden sekundären Transport beenden, solange das antreibende Gefälle besteht. Keine Rateschätzung aus dem Wort „Carrier“. [SM AB14/17]

Für positive/negative Ionen sind elektrische und chemische Beiträge gemeinsam relevant. Technische Prüfform:

```text
ΔG_out→in = RT ln(C_in/C_out) + zF(φ_in−φ_out)
```

Nur positive Konzentrationen; φ in V; F in C/mol; Ergebnis J/mol. Bei negativem ΔG ist passiver Einwärtstransport thermodynamisch begünstigt. Die Schüleroberfläche verwendet zunächst qualitative eindeutige Fälle; bei gegensätzlichen Beiträgen ohne Größeninformation ist „nicht bestimmbar“ richtig. Ein frei laufendes Membranpotenzial-/Mehrionenmodell gehört nicht ungeprüft zur ersten Fassung. Spannungsgeklemmt bedeutet externen elektrischen Einfluss, nicht kostenlose Energie.

## 10. Fachmodell BM06 · Vesikel und Orientierung

Das betrachtete Cargo startet im ER-Lumen. Sein Weg verläuft über Vesikel und Golgi zum Außenraum. Es muss dabei nicht durch den hydrophoben Kern einer Biomembran diffundieren. Luminale Membranseiten werden bei Exocytose außen zugänglich; cytosolische Seiten bleiben cytosolisch. [SM AB15.1]

Die Animation besteht aus diskreten, topologisch geprüften Schlüsselschritten mit optischer Interpolation. Ein Morph darf dabei die Membranseiten nicht vertauschen. Die Interpolation ist eine Darstellung, keine mechanische Berechnung der Membranfusion. Vergrößerte Vesikel und überhöhte Transportgeschwindigkeiten werden als Maßstabs-/Zeitvereinfachung angegeben.

## 11. Fachmodell BM07 · Regulation

Das Szenario übernimmt **nicht** eine universelle Homöostase-Engine. Es konkretisiert AB15.3: ein bestimmtes funktionales Epithelzellmodell mit Schwellung, indirekter Erfassung durch ein mechanosensitives Protein, Signalweg, K+-/Cl−-Kanälen, vorausgesetzten Auswärtsgradienten und abschwächender Rückkopplung. Die Primärforschung von Numata et al. betrifft konkrete Zellsysteme und rechtfertigt keine Verallgemeinerung auf alle Tierzellen. In dieser Konzeption wurde nur der zugängliche Abstract bzw. Verlags-/PubMed-Eintrag genutzt. [SM AB15.3; BIO-RVD]

Zustandsfolge: Ausgangsbereich → Verdünnungsstörung → Schwellung → verstärktes Signal → erhöhte Kanalaktivierung → Salzverlust → begünstigte Wasserabgabe → geringere Schwellung → nachlassendes Signal. Eine reversible Kanalblockade aktiviert den dokumentierten Gegenfall mit geringerer Rückkehr. Der passive Ionenausstrom durch geöffnete Kanäle wird nicht als unmittelbare ATP-Pumpe dargestellt.

Es wird kein zentraler „Regler im Zellkern“ gezeichnet. „Sollbereich“ ist eine funktionale Darstellung stabiler Bedingungen, kein bewusst gemessener Zahlenwert der Zelle. Prozentwerte dienen der Unterrichtsstruktur; biologische Fristen und universelle Schwellen werden nicht vorgetäuscht. Schieberegler außerhalb der validierten Szenarien sind deaktiviert oder als nicht bewertetes Erkunden ausdrücklich ausgenommen.

## 12. 3D-Produktion und visuelle Qualität

**Vier Ansichten je zentralem Asset:** Gesamtansicht, lesbarer Schnitt, isolierte Struktur, eindeutige Antwortansicht. Die Gesamtansicht vermittelt Räumlichkeit; die Antwortansicht verhindert verdeckte bzw. mehrdeutige Ziele. Nicht jedes Organell wird als Kugel dargestellt: Falten der inneren Mitochondrienmembran, typische Thylakoidstapel, ER/Golgi-Unterscheidung und Vakuolenraum werden gezielt modelliert.

Blender-Quellen behalten benannte Objekte und eine Prüfliste. GLB-Export mit angewandten Transformationen, stabilen Ursprüngen, einheitlicher +Y-oben-Konvention im Runtime-Manifest, logischer Hüllstruktur. Wissenschaftliche Maßangaben und Renderer-Skalierung sind getrennt. Eine Blender-Einheit ist nicht automatisch ein Meter einer echten Zelle. [WEB-BLENDER]

Bevorzugt werden opake Schnittflächen und gezieltes Ausblenden statt mehrerer volltransparenter ineinanderliegender Hüllen. Durchscheinende „Glasblasen“ dürfen Grenzen nicht unlesbar machen. Eigenständige, lokal mitgelieferte Modelle vermeiden ungeprüfte Lizenz- und Fachfehler fremder Assets. PDB-Strukturen sind für die erste Fassung nicht nötig; spätere Nutzung erfordert eigenen Daten-/Lizenz-/Repräsentationsnachweis.

**Entwurfsbudgets, keine gemessenen Leistungsversprechen:** Startoberfläche komprimiert ≤2 MB ohne Modelle; erster freigegebener 3D-Lernraum zusätzlich ≤10 MB; Modelle einzeln nachladen. Tabletprofil zunächst ≤250.000 sichtbare Dreiecke, ≤80 Drawcalls und Texturen typischerweise bis 2K; Desktop darf nach Messung höher gehen. Instanzen für wiederholte Lipide. Ziel auf benanntem Test-iPad: im aktiven Modell überwiegend ≤33 ms Bildzeit, ohne Verluste bei Eingaben; Pause/Standbild im Hintergrund. Werden Budgets überschritten, messen und reduzieren, nicht fachliche Details ersatzlos streichen.

## 13. UI, Fehlerbehandlung und Zugriff

Mindestens 44×44 CSS-Pixel als eigenes Ziel für wesentliche Touchflächen; Textgröße anpassbar; sichtbarer Fokus; keine ausschließlich farblichen Informationen. Drag & Drop erhält **zusätzlich** zur Tastatur eine einfache Tippfolge: Begriff wählen → Ziel wählen → Zuordnung prüfen. Tastatur allein ersetzt diese Touchalternative nicht. [WEB-W3C]

Jeder Bereich besitzt Zurück, Hilfe, Modell zurücksetzen und Wechsel zur 2D-Ansicht. Modale Fenster blockieren Kamerabewegung. Escape bricht eine aktuelle Ziehhandlung ab. Texte werden als Text ausgegeben, niemals als ausführbares HTML aus Schülerinput. Zahlenfelder akzeptieren deutsche Dezimalkommas und die in der Aufgabe zugelassenen Einheiten; ungültige Eingaben erklären den Eingabefehler neutral/gelb, ohne erfundene fachliche Diagnose.

WebGL-Verlust, fehlendes Asset oder ungültiger Fachzustand erzeugt eine Pause und eine verständliche Wiederherstellungsoption. Bereits gespeicherter Fortschritt bleibt erhalten. Im 2D-Modus sind dieselben fachlichen Kriterien prüfbar. Neue Beschriftung oder Simulation darf nicht durch fehlende Grafik den Kontext verändern.

## 14. Speicherung, Versionierung und Veröffentlichung

Lokaler Schlüssel `zelllabor11.progress.v1`, separates Schema und Inhaltsversion. Speichern kann scheitern; dann sichtbarer Sitzungsmodus und freiwilliger Fortschrittsexport ohne Namen/Rohtexte. Kein `localStorage.clear()`, keine Veränderung fremder Anwendungsdaten. Browserdaten können verloren gehen; lokaler Speicher ist kein Backup. [WEB-STORAGE]

Bei Inhaltsänderungen bleiben alte Versuchsnachweise mit Version erhalten. Ein früherer Abschluss bestätigt keine neu ergänzte Aufgabe. Unterstützungsart und fachliches Ergebnis werden getrennt migriert; Migration unbekannter Versionen wird nicht geraten. Nur vom Nutzer ausdrücklich exportierte Notizen dürfen separat als Text ausgegeben werden.

GitHub Pages veröffentlicht ausschließlich eine geprüfte `dist`-Allowlist. Originalklausur, Erwartungshorizont, Lehrerpaket, Quellenarchive und deren extrahierte Texte kommen **nie** ins öffentliche Repository, in Actions-Artefakte, Screenshots oder Debuglogs. Ein späteres Löschen entfernt sie nicht zuverlässig aus der Git-Historie. Die Schutzprüfung beginnt daher vor dem ersten Commit. `.gitignore` allein genügt nicht.

Der Prüfungsmodus ist ein Selbsttest, keine technisch geschützte Prüfungsplattform: richtige Antworten sind in einer statischen Anwendung prinzipiell im Client auffindbar. Eine spätere Offline-Funktion braucht versionierten Cache und Updateprüfung; die erste Unterrichtsfassung priorisiert HTTPS. Kein Versprechen, dass `file://` und Speicherung dort auf allen Geräten funktionieren.
