# F · Vollständiger Aufgabenentwurf

Konzept 1.0 · 22.10.2026. 79 Aufgaben: 56 Kern-, 9 Ergänzungs-, 6 Diagnose- und 8 Trainingsaufgaben. Teilfelder zählen zusätzlich. Alle sind Entwürfe; keine neue Laufzeitauswertung oder Spielprüfung wird behauptet. JSON und diese Fassung verwenden dieselben IDs und Erwartungen.

Quellenkürzel: `QA/Quellen_und_Zugriffe.md`. Globale Korrektur-/Feedbackregeln: C. Die neu erstellten Datensätze sind didaktische Modelldaten. Für Medien und Abbildungen gelten die in B definierten zu erstellenden Assets, nicht angeblich bereits vorhandene Grafiken.


## Z1 · Zellatlas

**Frage:** Welche Strukturen ermöglichen die verschiedenen Leistungen einer Zelle?

**Ziel:** Acht Zellstrukturen lokalisieren; Funktionen unterscheiden; Blatt-, Zwiebel- und Tierzelle kriterienbezogen vergleichen.

**Bezug:** SFC23 §2 SF2; SM AB01 S.3. **Vorwissen:** keine zusätzlichen Voraussetzungen.

**Darstellung:** Interaktives 3D-Strukturmodell einer chloroplastenhaltigen Blattzelle, einer Tierzelle und einer Zwiebel-Epidermiszelle; gleichwertige SVG-Schnitte. Keine Mikroaufnahmen.

**Handlung:** Drehen, schneiden, Struktur isolieren, Beschriftung zuordnen, einen Fachbegriff eingeben.

**Hilfe:** Grenze der ganzen Zelle und Grenze der Vakuole getrennt hervorheben, ohne den Namen einzublenden.

**Transfer:** Ein nicht fotosynthetisches Pflanzengewebe anhand seiner Merkmale zuordnen.

**Abnahme:** Jede Beschriftung hat einen geprüften semantischen Zielanker; kein Ziel ist in der Prüfansicht verdeckt; Zwiebelprofil ohne Chloroplasten.


### Z1.01 · Grenzen und Organellen lokalisieren

**Format:** `match` · **Denkhandlung:** Abruf

**Material:** Gezeigt wird das Schema einer chloroplastenhaltigen Blattzelle. Es ist kein Mikroskopbild. Nummern bezeichnen stabile Strukturanker, nicht zufällige Bildschirmpositionen. Cytosol bezeichnet hier die flüssige Grundphase zwischen den Organellen; Cytoplasma ist der weitere Begriff für Zellinhalt außerhalb des Kerns.

**Auftrag:** Ordne die acht Bezeichnungen den markierten Strukturen der Blattzelle zu. Drehen und Schnittansicht helfen beim Orientieren. In der Antwortansicht bleiben alle Zielstellen sichtbar.

**Antwort-/Bedienstruktur:**
```json
{
  "targets": [
    "wall",
    "plasma_membrane",
    "tonoplast",
    "vacuole_lumen",
    "nucleus",
    "mitochondrion",
    "chloroplast",
    "cytosol"
  ],
  "one_to_one": true,
  "view": "plant_leaf_cutaway",
  "camera_in_answer_mode": "fixed; explorer separate"
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "pairs": {
    "wall": "Zellwand",
    "plasma_membrane": "Zellmembran",
    "tonoplast": "Tonoplast",
    "vacuole_lumen": "Vakuole",
    "nucleus": "Zellkern",
    "mitochondrion": "Mitochondrium",
    "chloroplast": "Chloroplast",
    "cytosol": "Cytosol"
  }
}
```

**Kriterien-IDs:** Z1.01.C01, Z1.01.C02, Z1.01.C03, Z1.01.C04, Z1.01.C05, Z1.01.C06, Z1.01.C07, Z1.01.C08.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Zellwand = Zellmembran = Tonoplast; alle Pflanzenzellen besitzen Chloroplasten.


### Z1.02 · Die Vakuolengrenze benennen

**Format:** `bounded_text` · **Denkhandlung:** Abruf

**Material:** Im Modell ist ausschließlich die Grenze um den Vakuolenraum hervorgehoben, nicht die äußere Zellmembran.

**Auftrag:** Wie heißt die Membran, die die Vakuole umschließt? Ein Begriff genügt.

**Antwort-/Bedienstruktur:**
```json
{
  "fields": [
    {
      "id": "term",
      "mode": "one_term",
      "recommended_length": "1–5 Wörter",
      "hard_limit_chars": 4096
    }
  ]
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "rule_id": "TERM_TONOPLAST",
  "required": [
    "Tonoplast oder fachlich gleichwertig Vakuolenmembran"
  ],
  "known_wrong": [
    "Zellwand",
    "Zellmembran",
    "Vakuole",
    "Kernhülle"
  ],
  "partial": [
    "Membran"
  ],
  "contrast": "Membran um die Vakuole ≠ gesamte Vakuole",
  "confidence_policy": "Keine fachliche Abwertung allein wegen vorsichtiger Formulierung."
}
```

**Kriterien-IDs:** Z1.02.C01.

**Hilfen:** 1. Gesucht ist die Grenze des inneren Speicherraums, nicht die Grenze der ganzen Zelle. 2. Der Begriff beginnt mit „Tono…“; alternativ kannst du die Membran nach ihrem umschlossenen Raum benennen. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Zellwand = Zellmembran = Tonoplast; alle Pflanzenzellen besitzen Chloroplasten.


### Z1.03 · Funktionen unterscheiden

**Format:** `match` · **Denkhandlung:** Abruf

**Material:** Strukturen: Zellkern, Mitochondrium, Ribosom, Chloroplast, Vakuole, Zellwand. Funktionen sind als Karten vollständig angegeben.

**Auftrag:** Verbinde jede Struktur mit ihrer zutreffenden Hauptfunktion in diesem Modell.

**Antwort-/Bedienstruktur:**
```json
{}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "pairs": {
    "Zellkern": "enthält den überwiegenden Teil der Erbinformation",
    "Mitochondrium": "stellt durch Zellatmung ATP bereit",
    "Ribosom": "stellt Proteine her",
    "Chloroplast": "ermöglicht Fotosynthese",
    "Vakuole": "speichert Wasser und gelöste Stoffe; trägt zum Turgor bei",
    "Zellwand": "gibt mechanische Stabilität"
  }
}
```

**Kriterien-IDs:** Z1.03.C01, Z1.03.C02, Z1.03.C03, Z1.03.C04, Z1.03.C05, Z1.03.C06.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Zellwand = Zellmembran = Tonoplast; alle Pflanzenzellen besitzen Chloroplasten.


### Z1.04 · Drei Zelltypen vergleichen

**Format:** `multi` · **Denkhandlung:** Anwendung

**Material:** A: Blattzelle mit Chloroplasten. B: Epidermiszelle einer nicht grünen Zwiebelknolle. C: typische Tierzelle. Alle drei besitzen Zellmembran, Zellkern und Mitochondrien.

**Auftrag:** Welche Aussagen stimmen für die hier dargestellten typischen Zellen? Wähle alle zutreffenden Aussagen.

**Antwort-/Bedienstruktur:**
```json
{
  "options": {
    "a": "A und B besitzen eine Zellwand.",
    "b": "B muss Chloroplasten besitzen, weil sie zu einer Pflanze gehört.",
    "c": "C besitzt keine pflanzentypische Zentralvakuole.",
    "d": "Alle drei sind Eucyten.",
    "e": "Nur C benötigt Mitochondrien."
  }
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "correct_ids": [
    "a",
    "c",
    "d"
  ],
  "wrong_reasons": {
    "b": "Pflanzliche Herkunft verlangt nicht in jeder einzelnen Zelle Chloroplasten.",
    "e": "Mitochondrien kommen auch in typischen Pflanzenzellen vor."
  }
}
```

**Kriterien-IDs:** Z1.04.C01, Z1.04.C02, Z1.04.C03, Z1.04.C04, Z1.04.C05.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Zellwand = Zellmembran = Tonoplast; alle Pflanzenzellen besitzen Chloroplasten.


## Z2 · Zellräume und Zusammenarbeit

**Frage:** Warum reicht ein einziger ungeteilter Zellraum nicht aus?

**Ziel:** Struktur-Funktion, Organisationsebenen und abgegrenzte Reaktionsräume verknüpfen; Energieversorgung vom Weg eines Produkts unterscheiden.

**Bezug:** SFC23 §1/§2 SF3/SF2/SF8; SM AB02 S.4. **Vorwissen:** Z1.

**Darstellung:** 3D-Schnitte plus geordnetes 2D-Funktionsnetz; molekulare Größen ausdrücklich andere Maßstabsebene.

**Handlung:** Größenebenen ordnen, gerichtete Beziehungen legen, geeignete Kompartimentfunktionen auswählen.

**Hilfe:** Zwei Pfeilarten trennen: Weg des Proteins und Bereitstellung von ATP.

**Transfer:** Begründen, weshalb räumliche Trennung und kontrollierter Austausch gemeinsam erforderlich sind.

**Abnahme:** Erlaubte alternative Ordnungen und parallele Funktionsbeziehungen dürfen nicht als Fehler gelten.


### Z2.01 · Organisationsebenen ordnen

**Format:** `order` · **Denkhandlung:** Anwendung

**Material:** Betrachtet werden eine Aminosäure, ein Protein, ein Ribosom, ein Mitochondrium und eine ganze typische eukaryotische Zelle. Die Größenrelation ist für diese Beispiele vorgegeben.

**Auftrag:** Ordne die Beispiele vom kleineren Bestandteil zum größeren biologischen System.

**Antwort-/Bedienstruktur:**
```json
{
  "items": [
    "Aminosäure",
    "Protein",
    "Ribosom",
    "Mitochondrium",
    "Zelle"
  ],
  "evaluation": "sequence"
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "sequence": [
    "Aminosäure",
    "Protein",
    "Ribosom",
    "Mitochondrium",
    "Zelle"
  ]
}
```

**Kriterien-IDs:** Z2.01.C01.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Ein Ribosom ist eine membranumhüllte Zelle; ein Sekretprotein muss durch ein Mitochondrium laufen.


### Z2.02 · Produktweg und Unterstützung

**Format:** `causal_map` · **Denkhandlung:** Anwendung

**Material:** Für diesen vereinfachten Fall: Synthese an einem Ribosom am rauen ER; Aufnahme in das ER-Lumen; Weitertransport über Vesikel zum Golgi. Mitochondrien stellen ATP für Zellprozesse bereit.

**Auftrag:** Lege den Weg eines für die Sekretion bestimmten Proteins. Verbinde das Mitochondrium zusätzlich mit der passenden Unterstützungsfunktion, nicht als Durchgangsstation.

**Antwort-/Bedienstruktur:**
```json
{
  "edge_types": [
    "Produktweg",
    "ATP-Bereitstellung"
  ]
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "required_edges": [
    [
      "Ribosom am ER",
      "ER-Lumen",
      "Produktweg"
    ],
    [
      "ER-Lumen",
      "Transportvesikel",
      "Produktweg"
    ],
    [
      "Transportvesikel",
      "Golgi",
      "Produktweg"
    ],
    [
      "Mitochondrium",
      "energiebedürftige Zellprozesse",
      "ATP-Bereitstellung"
    ]
  ],
  "forbidden_edges": [
    [
      "ER-Lumen",
      "Mitochondrium",
      "Produktweg"
    ]
  ]
}
```

**Kriterien-IDs:** Z2.02.C01, Z2.02.C02, Z2.02.C03, Z2.02.C04.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Ein Ribosom ist eine membranumhüllte Zelle; ein Sekretprotein muss durch ein Mitochondrium laufen.


### Z2.03 · Kompartimentierung begründen

**Format:** `multi` · **Denkhandlung:** Anwendung

**Material:** In zwei Zellräumen können verschiedene gelöste Stoffe und unterschiedliche Bedingungen vorliegen. Stoffe werden über geeignete Transportwege ausgetauscht.

**Auftrag:** Wähle die beiden Begründungen, die den Nutzen membranumgrenzter Reaktionsräume beschreiben.

**Antwort-/Bedienstruktur:**
```json
{
  "options": {
    "a": "Verschiedene Prozesse können unter unterschiedlichen Bedingungen ablaufen.",
    "b": "Zwischen den Räumen darf nie ein Stoff ausgetauscht werden.",
    "c": "Selektive Grenzen erlauben kontrollierten Austausch.",
    "d": "Jeder Zellraum ist deshalb ein selbstständig lebensfähiger Organismus."
  }
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "correct_ids": [
    "a",
    "c"
  ],
  "wrong_reasons": {
    "b": "Membranen ermöglichen selektiven Austausch, keine vollständige dauerhafte Isolation.",
    "d": "Kompartimente gehören zu einer Zelle; jedes Organell ist nicht automatisch ein eigenständiger Organismus."
  }
}
```

**Kriterien-IDs:** Z2.03.C01, Z2.03.C02, Z2.03.C03, Z2.03.C04.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Ein Ribosom ist eine membranumhüllte Zelle; ein Sekretprotein muss durch ein Mitochondrium laufen.


### Z2.04 · Bekannte Biomoleküle verknüpfen

**Format:** `match` · **Denkhandlung:** Abruf

**Material:** Karten: A viele verknüpfte Glucosebausteine als Speicher; B gefaltete Aminosäurekette als Transportprotein; C amphiphiles Lipid als Membranbaustein.

**Auftrag:** Ordne Strukturmerkmal und Funktion der passenden Stoffgruppe zu.

**Antwort-/Bedienstruktur:**
```json
{}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "pairs": {
    "A": "Kohlenhydrat",
    "B": "Protein",
    "C": "Lipid"
  },
  "note": "Nicht sämtliche Lipide sind Polymere gleicher Bausteine."
}
```

**Kriterien-IDs:** Z2.04.C01, Z2.04.C02, Z2.04.C03.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Ein Ribosom ist eine membranumhüllte Zelle; ein Sekretprotein muss durch ein Mitochondrium laufen.


## Z3 · Zellgeschichte begründen

**Frage:** Welche Befunde sprechen für bakterielle Vorfahren bestimmter Organellen?

**Ziel:** Befund und historische Deutung unterscheiden; mitochondriale und plastidäre Endosymbiose sowie Grenzen des Modells erklären.

**Bezug:** SFC23 §2 E21; SM AB03–04 S.5–6. **Vorwissen:** Z1, E2 bei Diagnosebedarf, E3 bei Diagnosebedarf.

**Darstellung:** Befundkarten und verzweigtes Evolutionsschema; keine scheinbare historische Filmaufnahme.

**Handlung:** Befunde zuordnen, Teilfolge rekonstruieren, Aussagen auf Reichweite prüfen.

**Hilfe:** Zuerst einen heutigen Befund markieren, dann die passende Erklärung suchen.

**Transfer:** Eine Erklärung beurteilen, die aus einem einzigen Hinweis zu viel folgert.

**Abnahme:** Keine moderne Tierzelle als gesichert ursprünglicher Wirt; Ribosomen nur bakterienähnlich, keine universelle 70S-Behauptung.


### Z3.01 · Befund oder Erklärung?

**Format:** `match` · **Denkhandlung:** Anwendung

**Material:** A eigenes Erbmaterial in Mitochondrien; B Ähnlichkeiten organellärer Ribosomen mit bakteriellen Systemen; C ein bakterieller Vorfahr wurde dauerhaft integriert; D molekulare Verwandtschaftsbefunde; E über viele Generationen entstand wechselseitige Abhängigkeit.

**Auftrag:** Ordne jede Aussage entweder „heute untersuchbarer Befund“ oder „historische Erklärung“ zu.

**Antwort-/Bedienstruktur:**
```json
{
  "one_to_one": false
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "pairs": {
    "A": "Befund",
    "B": "Befund",
    "C": "Erklärung",
    "D": "Befund",
    "E": "Erklärung"
  }
}
```

**Kriterien-IDs:** Z3.01.C01, Z3.01.C02, Z3.01.C03, Z3.01.C04, Z3.01.C05.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Alle Organellen entstanden durch Endosymbiose; jede Doppelmembran beweist deren genaue Geschichte.


### Z3.02 · Ein verzweigtes Modell rekonstruieren

**Format:** `order` · **Denkhandlung:** Anwendung

**Material:** A dauerhafte Verbindung eines eukaryotischen Vorläufers mit einem bakteriellen Partner; B mitochondriale Integration über viele Generationen; C ein mitochondrienhaltiger Vorläufer einer pflanzlichen Linie integriert einen fotosynthetischen bakteriellen Partner; D Entwicklung primärer Plastiden in dieser Linie.

**Auftrag:** Lege die zeitlichen Abhängigkeiten. Der plastidäre Schritt gehört nur zu einer Teil-Linie.

**Antwort-/Bedienstruktur:**
```json
{
  "items": [
    "A",
    "B",
    "C",
    "D"
  ],
  "evaluation": "partial_order_with_branch"
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "precedence_edges": [
    [
      "A",
      "B"
    ],
    [
      "B",
      "C"
    ],
    [
      "C",
      "D"
    ]
  ],
  "branch_annotation": {
    "C": "pflanzliche Teil-Linie",
    "D": "pflanzliche Teil-Linie"
  }
}
```

**Kriterien-IDs:** Z3.02.C01, Z3.02.C02.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Alle Organellen entstanden durch Endosymbiose; jede Doppelmembran beweist deren genaue Geschichte.


### Z3.03 · Die Reichweite von Befunden

**Format:** `multi` · **Denkhandlung:** Begründete Prüfung

**Material:** Mitochondrien und primäre Plastiden zeigen eine Kombination aus eigenem Erbmaterial, bakterienähnlichen Systemen, Teilung und molekularen Verwandtschaftsbefunden. Beide besitzen zwei Hüllmembranen.

**Auftrag:** Welche Schlussfolgerungen sind durch die dargestellten Befunde vertretbar?

**Antwort-/Bedienstruktur:**
```json
{
  "options": {
    "a": "Die Gesamtheit der Befunde stützt einen bakteriellen Ursprung.",
    "b": "Damit ist auch der endosymbiotische Ursprung des Zellkerns bewiesen.",
    "c": "Zwei Membranen beweisen für jede Membran eindeutig ihre historische Herkunft.",
    "d": "Die heutige Abhängigkeit der Organellen ist mit einer langen evolutionären Integration vereinbar."
  }
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "correct_ids": [
    "a",
    "d"
  ],
  "wrong_reasons": {
    "b": "Die dargestellten Befunde erlauben keine gemeinsame endosymbiotische Herkunft sämtlicher Organellen.",
    "c": "Die genaue Herkunft jeder einzelnen Hüllmembran folgt nicht allein aus ihrer heutigen Zahl."
  }
}
```

**Kriterien-IDs:** Z3.03.C01, Z3.03.C02, Z3.03.C03, Z3.03.C04.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Alle Organellen entstanden durch Endosymbiose; jede Doppelmembran beweist deren genaue Geschichte.


### Z3.04 · Nicht grün und trotzdem pflanzlich

**Format:** `single` · **Denkhandlung:** Anwendung

**Material:** Die betrachtete Knolle wächst unterirdisch; die untersuchte Epidermis ist nicht fotosynthetisch aktiv.

**Auftrag:** Welche Erklärung passt dazu, dass eine Zwiebel-Epidermiszelle Mitochondrien, aber keine Chloroplasten besitzt?

**Antwort-/Bedienstruktur:**
```json
{
  "options": {
    "a": "Es handelt sich deshalb um eine Tierzelle.",
    "b": "Mitochondriale Zellfunktionen werden benötigt; Chloroplasten sind nicht in jedem Pflanzenzelltyp ausgebildet.",
    "c": "Ihre Chloroplasten wurden sämtlich in Mitochondrien umgewandelt."
  }
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "correct_id": "b",
  "wrong_reasons": {
    "a": "Fehlende Chloroplasten machen eine Zelle nicht zur Tierzelle.",
    "c": "Mitochondrien sind nicht aus Chloroplasten der betreffenden Zelle entstanden."
  }
}
```

**Kriterien-IDs:** Z3.04.C01.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Alle Organellen entstanden durch Endosymbiose; jede Doppelmembran beweist deren genaue Geschichte.


## Z4 · Beobachten statt hineinzeichnen

**Frage:** Was zeigt ein Mikroskop tatsächlich – und was ergänzen wir aus unserem Wissen?

**Ziel:** Präparation, Vergleichsfärbung, Vergrößerung und Kriterien einer Beobachtungszeichnung nachvollziehen; Erkenntnisgrenzen benennen.

**Bezug:** SFC23 fachliche Verfahren SF2; SM AB10–11 S.13–16. **Vorwissen:** Z1.

**Darstellung:** Eigene gekennzeichnete Verfahrensschemata und Vergleichszeichnungen; echte Aufnahmen nur nach überprüfter Herkunft/Lizenz.

**Handlung:** Arbeitsschritte ordnen, Vergrößerung berechnen, Zeichnungen und Vergleichsbedingungen prüfen.

**Hilfe:** Nur die ausdrücklich beobachteten Merkmale aus dem Befundprotokoll verwenden.

**Transfer:** Eine sorgfältige Zeichnung trotz nicht sichtbaren Zellkerns als sachgerecht erkennen.

**Abnahme:** Kein digitales Kompetenzabzeichen für praktisch ausgeführte Mikroskopie; reale Laborarbeit bleibt separat.


### Z4.01 · Ein Frischpräparat vorbereiten

**Format:** `order` · **Denkhandlung:** Abruf

**Material:** A dünnes Epidermisstück flach in einen Wassertropfen legen; B Deckglas schräg ansetzen und absenken; C bei kleinstem Objektiv orientieren und scharfstellen; D bei Bedarf höher vergrößern und mit Feintrieb nachstellen.

**Auftrag:** Ordne diese Schritte zu einer sicheren grundlegenden Vorgehensweise. Die Aufgabe ersetzt kein eigenes Präparieren.

**Antwort-/Bedienstruktur:**
```json
{
  "items": [
    "A",
    "B",
    "C",
    "D"
  ],
  "evaluation": "sequence"
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "sequence": [
    "A",
    "B",
    "C",
    "D"
  ]
}
```

**Kriterien-IDs:** Z4.01.C01.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Größere Vergrößerung löst automatisch kleinere Strukturen auf; ein Zellmodell ist eine Beobachtungszeichnung.


### Z4.02 · Vergrößerung berechnen

**Format:** `numeric` · **Denkhandlung:** Anwendung

**Material:** Gesamtvergrößerung = Okularvergrößerung × Objektivvergrößerung. Die Vergrößerung beschreibt nicht allein die optische Auflösung.

**Auftrag:** Ein Okular vergrößert 10-fach, das Objektiv 20-fach. Berechne die Gesamtvergrößerung.

**Antwort-/Bedienstruktur:**
```json
{
  "fields": [
    "number"
  ],
  "unit": "fach"
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "value": 200,
  "unit": "fach",
  "abs_tolerance": 0,
  "accepted_unit_aliases": [
    "fach",
    "×",
    "x"
  ],
  "unit_preprinted": true
}
```

**Kriterien-IDs:** Z4.02.C01, Z4.02.C02.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Größere Vergrößerung löst automatisch kleinere Strukturen auf; ein Zellmodell ist eine Beobachtungszeichnung.


### Z4.03 · Eine Zeichnung beurteilen

**Format:** `multi` · **Denkhandlung:** Anwendung

**Material:** Ein beobachtetes Zwiebelpräparat zeigt Zellgrenzen, aber keinen sicher erkennbaren Zellkern. In einer ausdrücklich didaktischen Fehlerzeichnung sind ein auswendig ergänzter Kern und Chloroplasten eingezeichnet; Titel und Vergrößerung fehlen.

**Auftrag:** Welche Änderungen verbessern die Beobachtungszeichnung?

**Antwort-/Bedienstruktur:**
```json
{
  "options": {
    "a": "Nicht beobachtete Strukturen entfernen oder in einem getrennten Erklärungsmodell zeigen.",
    "b": "Alle aus dem Lehrbuch bekannten Organellen ergänzen.",
    "c": "Präparat und Vergrößerung angeben.",
    "d": "Nur sicher beobachtete Strukturen eindeutig beschriften."
  }
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "correct_ids": [
    "a",
    "c",
    "d"
  ],
  "wrong_reasons": {
    "b": "Bekannte, aber nicht beobachtete Strukturen gehören nicht in eine als Beobachtung ausgegebene Zeichnung."
  }
}
```

**Kriterien-IDs:** Z4.03.C01, Z4.03.C02, Z4.03.C03, Z4.03.C04.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Größere Vergrößerung löst automatisch kleinere Strukturen auf; ein Zellmodell ist eine Beobachtungszeichnung.


### Z4.04 · Einen Färbevergleich beurteilen

**Format:** `experiment` · **Denkhandlung:** Anwendung

**Material:** Zwei frische, möglichst ähnliche Stücke derselben weißen Zwiebel werden verglichen. Ein Präparat erhält nach Lehrkraftanweisung Färbelösung, das andere nicht. Hier wird nur die Planung geprüft.

**Auftrag:** Wähle Bedingungen für einen aussagekräftigen Vergleich von ungefärbtem und gefärbtem Präparat.

**Antwort-/Bedienstruktur:**
```json
{
  "options": [
    "gleicher Zelltyp",
    "gleiche Vergrößerung",
    "vergleichbare Präparatdicke",
    "erkennbare Strukturen und Kontrast protokollieren",
    "gefärbtes Präparat als unveränderte lebende Kontrolle für Osmose weiterverwenden",
    "nur maximal vergrößern"
  ]
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "required_selections": [
    "gleicher Zelltyp",
    "gleiche Vergrößerung",
    "vergleichbare Präparatdicke",
    "erkennbare Strukturen und Kontrast protokollieren"
  ],
  "reject": [
    "gefärbtes Präparat als unveränderte lebende Kontrolle für Osmose weiterverwenden",
    "nur maximal vergrößern"
  ],
  "limit": "Färbung kann Kontrast und Präparat verändern; mehr Sichtbarkeit ist nicht automatisch mehr Auflösung."
}
```

**Kriterien-IDs:** Z4.04.C01, Z4.04.C02, Z4.04.C03, Z4.04.C04, Z4.04.C05.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Größere Vergrößerung löst automatisch kleinere Strukturen auf; ein Zellmodell ist eine Beobachtungszeichnung.


## M1 · Wasser und Ladung

**Frage:** Warum verhalten sich Wasser, Ionen und lange Kohlenwasserstoffketten unterschiedlich?

**Ziel:** Gesamtladung von Teilladung unterscheiden und Wasserwechselwirkungen verständlich beschreiben.

**Bezug:** SFC23 §1 SF3; SM AB05 S.7. **Vorwissen:** Z1.

**Darstellung:** Symbolische Molekülmodelle mit erklärten Zeichen O, H, δ+, δ− und Ionenladungen.

**Handlung:** Teilladungen setzen, geladene und polare Teilchen vergleichen, kurze Begriffe abrufen.

**Hilfe:** Erst die Gesamtladung des Teilchens, dann die Verteilung innerhalb des Moleküls betrachten.

**Transfer:** Phasentrennung von der Frage unterscheiden, welche Flüssigkeit oben liegt.

**Abnahme:** Kein unscharfer Begriffsabgleich zwischen hydrophil/hydrophob oder polar/unpolar.


### M1.01 · Teilladungen am Wasser

**Format:** `match` · **Denkhandlung:** Abruf

**Material:** O bedeutet Sauerstoff, H Wasserstoff. δ kennzeichnet eine Teilladung innerhalb eines Moleküls, nicht die volle Ladung eines Ions. Das gewinkelte H–O–H-Modell zeigt ungleich verteilte Elektronen.

**Auftrag:** Ordne dem Sauerstoffbereich δ− und beiden Wasserstoffbereichen δ+ zu. Gib anschließend die Gesamtladung des Wassermoleküls an.

**Antwort-/Bedienstruktur:**
```json
{
  "targets": [
    "O",
    "H1",
    "H2",
    "total"
  ],
  "labels": [
    "δ−",
    "δ+",
    "0",
    "+1",
    "−1"
  ],
  "one_to_one": false
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "parts": {
    "O": "δ−",
    "H1": "δ+",
    "H2": "δ+",
    "total": "0"
  }
}
```

**Kriterien-IDs:** M1.01.C01, M1.01.C02, M1.01.C03, M1.01.C04.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Ein polares Wassermolekül ist insgesamt negativ; hydrophob bedeutet absichtliches Wegstoßen.


### M1.02 · Polar ist nicht ionisch geladen

**Format:** `single` · **Denkhandlung:** Anwendung

**Material:** Na+ trägt eine positive Gesamtladung. Ein Wassermolekül hat Teilladungen, seine Gesamtladung ist null.

**Auftrag:** Welche Aussage unterscheidet Wasser und ein Natriumion richtig?

**Antwort-/Bedienstruktur:**
```json
{
  "options": {
    "a": "Beide Teilchen tragen eine negative Gesamtladung.",
    "b": "Wasser ist insgesamt neutral und polar; Na+ ist insgesamt positiv geladen.",
    "c": "Wasser ist insgesamt neutral und deshalb zwingend unpolar."
  }
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "correct_id": "b",
  "wrong_reasons": {
    "a": "Teilladungen machen Wasser nicht insgesamt negativ.",
    "c": "Elektrisch neutral schließt eine ungleiche Ladungsverteilung nicht aus."
  }
}
```

**Kriterien-IDs:** M1.02.C01.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Ein polares Wassermolekül ist insgesamt negativ; hydrophob bedeutet absichtliches Wegstoßen.


### M1.03 · Wasserfreundliche Bereiche benennen

**Format:** `bounded_text` · **Denkhandlung:** Abruf

**Material:** Gesucht ist die Eigenschaft des Molekülbereichs, keine Garantie unbegrenzter Wasserlöslichkeit eines ganzen Stoffes.

**Auftrag:** Wie nennt man einen Molekülbereich, der günstig mit Wasser wechselwirkt? Ein Begriff genügt.

**Antwort-/Bedienstruktur:**
```json
{
  "fields": [
    {
      "id": "term",
      "mode": "one_term",
      "hard_limit_chars": 4096
    }
  ]
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "rule_id": "TERM_HYDROPHIL",
  "known_wrong": [
    "hydrophob",
    "wassermeidend"
  ],
  "partial": [
    "polar"
  ],
  "protected_contrasts": [
    "hydrophil",
    "hydrophob"
  ],
  "required_any_of": [
    "hydrophil",
    "wasserfreundlich"
  ],
  "confidence_policy": "Keine fachliche Abwertung allein wegen vorsichtiger Formulierung."
}
```

**Kriterien-IDs:** M1.03.C01.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Ein polares Wassermolekül ist insgesamt negativ; hydrophob bedeutet absichtliches Wegstoßen.


### M1.04 · Öl und Wasser richtig erklären

**Format:** `single` · **Denkhandlung:** Anwendung

**Material:** Wasser und Speiseöl bilden nach dem Schütteln zunächst kleine Tropfen, später wieder zwei Phasen. Die Position der Phasen und ihre Mischbarkeit sind unterschiedliche Fragen.

**Auftrag:** Welche Aussage erklärt die erneute Trennung nach dem Schütteln fachlich passend?

**Antwort-/Bedienstruktur:**
```json
{
  "options": {
    "a": "Öl ist leichter; allein deshalb kann es sich nicht mit Wasser mischen.",
    "b": "Ölmoleküle erkennen Wasser und fliehen gezielt davor.",
    "c": "Wasser und die überwiegend unpolaren Ölbereiche bilden keine dauerhaft gleichmäßig gemischte Phase; ihre unterschiedlichen Wechselwirkungen sind entscheidend."
  }
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "correct_id": "c",
  "wrong_reasons": {
    "a": "Dichte erklärt die Lage der Schichten, nicht allein die schlechte Mischbarkeit.",
    "b": "Moleküle verfolgen kein Ziel und besitzen keine Absicht."
  }
}
```

**Kriterien-IDs:** M1.04.C01.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Ein polares Wassermolekül ist insgesamt negativ; hydrophob bedeutet absichtliches Wegstoßen.


## M2 · Eine Membran aufbauen

**Frage:** Wie entsteht aus amphiphilen Molekülen eine Grenze zwischen wässrigen Räumen?

**Ziel:** Speicherfett und typisches Phospholipid unterscheiden; Orientierung beider Lagen einer Doppelschicht begründen.

**Bezug:** SFC23 §1/§3 SF3/SF5; SM AB06 S.8. **Vorwissen:** M1.

**Darstellung:** 3D- und 2D-Bausteinmodell; Köpfe/Schwänze sind Symbole, keine Atome.

**Handlung:** Molekülbausteine vergleichen, Phospholipide drehen und anordnen, Begründungsketten vervollständigen.

**Hilfe:** Beide Seiten des Membranausschnitts sind wässrig, nicht nur die obere.

**Transfer:** Eine fehlerhaft umgekehrte zweite Lage korrigieren.

**Abnahme:** Orientierung und nicht Pixelposition wird bewertet; gleichwertige Gesamtrotationen bleiben richtig.


### M2.01 · Lipidbausteine vergleichen

**Format:** `match` · **Denkhandlung:** Abruf

**Material:** A: Glycerin mit drei Fettsäureresten. B: typisches Glycerophospholipid mit zwei Fettsäureresten und phosphathaltiger Kopfgruppe.

**Auftrag:** Ordne den beiden vereinfachten Modellen die Bezeichnung und das Strukturmerkmal zu.

**Antwort-/Bedienstruktur:**
```json
{}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "pairs": {
    "A": "Speicherfett; drei Fettsäurereste",
    "B": "Phospholipid; hydrophiler Kopf und zwei hydrophobe Ketten"
  }
}
```

**Kriterien-IDs:** M2.01.C01, M2.01.C02.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Eine Doppelschicht sind zwei vollständige Membranen.


### M2.02 · Zwei Lagen anordnen

**Format:** `model_action` · **Denkhandlung:** Anwendung

**Material:** Ein Kreis steht für den hydrophilen Kopf, zwei Linien für hydrophobe Ketten. Oberhalb und unterhalb liegt Wasser. Je vier Symbole gehören zu einer Lage.

**Auftrag:** Ordne acht Phospholipidsymbole als zwei Lagen zwischen zwei wässrigen Räumen an.

**Antwort-/Bedienstruktur:**
```json
{
  "controls": [
    "drehen",
    "verschieben",
    "zurücksetzen"
  ],
  "tap_alternative": "Symbol wählen; Lage und Orientierung wählen"
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "constraints": [
    "two_leaflets",
    "four_molecules_per_leaflet",
    "heads_face_adjacent_water",
    "tails_face_bilayer_core"
  ],
  "equivalences": [
    "Verschiebung innerhalb einer Lage",
    "Drehung der gesamten Darstellung mit beiden Wasserräumen"
  ]
}
```

**Kriterien-IDs:** M2.02.C01, M2.02.C02, M2.02.C03, M2.02.C04.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Eine Doppelschicht sind zwei vollständige Membranen.


### M2.03 · Doppelschicht und Doppelmembran

**Format:** `single` · **Denkhandlung:** Abruf

**Material:** Eine einzelne Biomembran enthält in diesem Modell zwei aufeinander bezogene Lipidlagen.

**Auftrag:** Wie viele vollständige Biomembranen zeigt eine Phospholipiddoppelschicht?

**Antwort-/Bedienstruktur:**
```json
{
  "options": {
    "a": "Eine.",
    "b": "Zwei.",
    "c": "Eine halbe."
  }
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "correct_id": "a",
  "wrong_reasons": {
    "b": "Zwei Lipidlagen bilden hier eine Membran, nicht zwei getrennte Membranen.",
    "c": "Eine Lipidlage allein ist nicht das betrachtete Biomembranmodell."
  }
}
```

**Kriterien-IDs:** M2.03.C01.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Eine Doppelschicht sind zwei vollständige Membranen.


### M2.04 · Die Anordnung begründen

**Format:** `causal_map` · **Denkhandlung:** Anwendung

**Material:** Kartenpaare: Kopf polar/hydrophil; Ketten überwiegend unpolar/hydrophob; günstige Wechselwirkung mit Wasser; abgeschirmter Membrankern.

**Auftrag:** Vervollständige zwei Begründungsketten zur Orientierung der Phospholipide.

**Antwort-/Bedienstruktur:**
```json
{
  "edge_types": [
    "Orientierung"
  ]
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "required_edges": [
    [
      "hydrophiler Kopf",
      "wässriger Raum",
      "Orientierung"
    ],
    [
      "hydrophobe Ketten",
      "Membrankern",
      "Orientierung"
    ]
  ],
  "explanation": "Die amphiphile Struktur erklärt beide Orientierungen gemeinsam; keine absichtsvolle Bewegung."
}
```

**Kriterien-IDs:** M2.04.C01, M2.04.C02.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Eine Doppelschicht sind zwei vollständige Membranen.


## M3 · Die bewegliche Grenze

**Frage:** Wie kann eine Membran beweglich und zugleich selektiv durchlässig sein?

**Ziel:** Flüssig-Mosaik-Modell, Stoffeigenschaften und Daten zur lateralen Lipidbewegung verknüpfen.

**Bezug:** SFC23 §3 SF5/SF6; SM AB07 S.9–10. **Vorwissen:** M2.

**Darstellung:** Membran-3D-Ausschnitt und gekennzeichnetes FRAP-Datenschema; gebleichte Lipide, keine markierten Proteine.

**Handlung:** Beschriften, Passage begründet zuordnen, Kurven beschreiben und Schlussfolgerungen begrenzen.

**Hilfe:** Prüfen, welcher Bestandteil im Material überhaupt markiert ist.

**Transfer:** Eine zu weit reichende Behauptung mit einem gezielten Gegenargument einschränken.

**Abnahme:** Die dargestellte Markierung stimmt mit Text, Kurve und Rückmeldung überein; keine falsche Flipflop-Aussage.


### M3.01 · Membranbestandteile erkennen

**Format:** `match` · **Denkhandlung:** Abruf

**Material:** Vergrößerter Membranausschnitt mit vier eindeutigen Ankern. Der Kanal ist ein Protein; die Pore gehört zum Protein und ist nicht ein zufälliges Loch zwischen Lipiden.

**Auftrag:** Ordne Kopfgruppen, hydrophoben Kern, Kanalprotein und wässrigen Raum zu.

**Antwort-/Bedienstruktur:**
```json
{
  "targets": [
    "head",
    "core",
    "channel",
    "water"
  ],
  "one_to_one": true
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "pairs": {
    "head": "hydrophile Kopfgruppen",
    "core": "hydrophober Kern",
    "channel": "Kanalprotein",
    "water": "wässriger Raum"
  }
}
```

**Kriterien-IDs:** M3.01.C01, M3.01.C02, M3.01.C03, M3.01.C04.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Jedes kleine Teilchen passiert; Lipidbeweglichkeit beweist die freie Bewegung aller Proteine.


### M3.02 · Durchtritt begründet zuordnen

**Format:** `match` · **Denkhandlung:** Anwendung

**Material:** Sauerstoff ist klein/unpolar. Natriumionen sind geladen. Glucose ist relativ groß/polar. Wasser ist klein/polar; es kann die Lipidschicht begrenzt und passende Wasserkanäle leichter passieren.

**Auftrag:** Ordne die Stoffe dem im Material beschriebenen Passageweg zu.

**Antwort-/Bedienstruktur:**
```json
{
  "one_to_one": true
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "pairs": {
    "Sauerstoff": "vergleichsweise leicht direkt durch Lipide",
    "Natriumion": "passendes Transportprotein erforderlich",
    "Glucose": "in diesem Modell passendes Transportprotein erforderlich",
    "Wasser": "begrenzter Lipidweg und schnellerer Weg durch Wasserkanäle"
  }
}
```

**Kriterien-IDs:** M3.02.C01, M3.02.C02, M3.02.C03, M3.02.C04.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Jedes kleine Teilchen passiert; Lipidbeweglichkeit beweist die freie Bewegung aller Proteine.


### M3.03 · Fluoreszenz richtig auswerten

**Format:** `multi` · **Denkhandlung:** Anwendung

**Material:** Nur Membranlipide sind fluoreszenzmarkiert. Ein kleiner Bereich wird gebleicht. Ohne Neusynthese steigt seine relative Helligkeit nach 0/15/45/90 s von 8/32/59/78 %. Die Belichtung bleibt gleich. Die Werte sind neu erstellte Modelldaten.

**Auftrag:** Welche Aussagen werden durch den Modellversuch gestützt?

**Antwort-/Bedienstruktur:**
```json
{
  "options": {
    "a": "Die Daten sind mit seitlichem Austausch markierter Lipide vereinbar.",
    "b": "Alle Proteine bewegen sich nachweislich jederzeit ungehindert.",
    "c": "Die Helligkeit nimmt im betrachteten Bereich zu.",
    "d": "Der Versuch beweist häufigen Wechsel der Lipide zwischen beiden Lagen."
  }
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "correct_ids": [
    "a",
    "c"
  ],
  "wrong_reasons": {
    "b": "Proteine sind hier nicht markiert; ihre uneingeschränkte Beweglichkeit wurde nicht untersucht.",
    "d": "Seitlicher Austausch ist kein Nachweis des Wechsels zwischen den Lipidlagen."
  }
}
```

**Kriterien-IDs:** M3.03.C01, M3.03.C02, M3.03.C03, M3.03.C04.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Jedes kleine Teilchen passiert; Lipidbeweglichkeit beweist die freie Bewegung aller Proteine.


### M3.04 · Eine Modellkritik auswählen

**Format:** `single` · **Denkhandlung:** Anwendung

**Material:** „Flüssig“ beschreibt hier vor allem Beweglichkeit von Bestandteilen innerhalb der Membran. Durchlässigkeit hängt auch von Ladung, Polarität und verfügbaren Proteinen ab.

**Auftrag:** Welche Kritik trifft die Aussage „Die Membran ist flüssig, also passiert jedes kleine Teilchen“?

**Antwort-/Bedienstruktur:**
```json
{
  "options": {
    "a": "Keine; die Aussage stimmt für alle kleinen Ionen.",
    "b": "Sie verwechselt seitliche Beweglichkeit mit selektivem Durchtritt durch die Membran.",
    "c": "Sie ist nur falsch, weil eine Membran ausschließlich aus Wasser besteht."
  }
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "correct_id": "b",
  "wrong_reasons": {
    "a": "Beweglichkeit innerhalb der Membran ist nicht gleich beliebige Durchlässigkeit quer hindurch.",
    "c": "Membranen enthalten Proteine und sind nicht einfach eine Wasserschicht."
  }
}
```

**Kriterien-IDs:** M3.04.C01.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Jedes kleine Teilchen passiert; Lipidbeweglichkeit beweist die freie Bewegung aller Proteine.


## M4 · Diffusion ohne Absicht

**Frage:** Wie entsteht aus ungeordneter Bewegung ein Nettotransport?

**Ziel:** Einzelbewegung, Nettobilanz und dynamisches Gleichgewicht unterscheiden; Volumen beim Konzentrationsvergleich berücksichtigen.

**Bezug:** SFC23 §3 SF6; SM AB08 S.11. **Vorwissen:** M3.

**Darstellung:** Seed-basiertes Zufallsmodell, keine Molekulardynamik; tabellarische Übergangszahlen und Konzentrationen.

**Handlung:** Vorhersage abgeben, Schritte auslösen, beide Richtungen zählen, Gegenbeispiel ungleicher Volumina auswerten.

**Hilfe:** Beide Richtungen zählen und erst danach die Differenz bilden.

**Transfer:** Bei doppeltem Raumvolumen eine passende Teilchenzahl für gleiche Konzentration bestimmen.

**Abnahme:** Massenerhaltung, synchrone Aktualisierung und korrekte Fluktuation; Vorhersagen nicht nach zufälligem Einzelereignis benoten.


### M4.01 · Vorhersage und Zufall trennen

**Format:** `single` · **Denkhandlung:** Anwendung

**Material:** Jedes Teilchen besitzt in einem Modellschritt dieselbe Übertrittschance 1/4. Übergänge werden aus dem alten Zustand gleichzeitig berechnet. Einzelne Durchläufe dürfen schwanken.

**Auftrag:** Links befinden sich 18, rechts 6 Teilchen in gleich großen Räumen. Welche Vorhersage ist für viele Wiederholungen sinnvoll?

**Antwort-/Bedienstruktur:**
```json
{
  "options": {
    "a": "Jedes einzelne Teilchen bewegt sich nach rechts.",
    "b": "Anfangs ist im Mittel ein Nettotransport nach rechts zu erwarten.",
    "c": "Nach einem Schritt liegen sicher genau 12 Teilchen auf jeder Seite."
  }
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "correct_id": "b",
  "wrong_reasons": {
    "a": "Einzelteilchen bewegen sich nicht nur in die Richtung des Nettotransports.",
    "c": "Ein einzelner zufälliger Schritt garantiert keine exakte Gleichverteilung."
  }
}
```

**Kriterien-IDs:** M4.01.C01.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Alle Teilchen laufen zielgerichtet; im Gleichgewicht stehen sie still; gleiche Anzahl bedeutet immer gleiche Konzentration.


### M4.02 · Nettotransport berechnen

**Format:** `numeric` · **Denkhandlung:** Anwendung

**Material:** Ausgang: links 18, rechts 6 Teilchen; keine Erzeugung und kein Verlust.

**Auftrag:** In einem Schritt wechseln 7 Teilchen von links nach rechts und 3 zurück. Bestimme Nettotransport und neuen Bestand.

**Antwort-/Bedienstruktur:**
```json
{
  "fields": [
    "net_right",
    "left_after",
    "right_after"
  ],
  "units_preprinted": true
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "fields": {
    "net_right": {
      "value": 4,
      "unit": "Teilchen",
      "abs_tolerance": 0
    },
    "left_after": {
      "value": 14,
      "unit": "Teilchen",
      "abs_tolerance": 0
    },
    "right_after": {
      "value": 10,
      "unit": "Teilchen",
      "abs_tolerance": 0
    }
  }
}
```

**Kriterien-IDs:** M4.02.C01, M4.02.C02, M4.02.C03.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Alle Teilchen laufen zielgerichtet; im Gleichgewicht stehen sie still; gleiche Anzahl bedeutet immer gleiche Konzentration.


### M4.03 · Dynamisches Gleichgewicht

**Format:** `bounded_text` · **Denkhandlung:** Anwendung

**Material:** Es handelt sich um thermisch bewegte Teilchen. „Kein Nettotransport“ bedeutet gleiche mittlere Übergänge in beide Richtungen.

**Auftrag:** Bei gleicher Konzentration: Bewegen sich die einzelnen Teilchen weiter oder stehen sie still? Antworte nur auf diese Frage.

**Antwort-/Bedienstruktur:**
```json
{
  "fields": [
    {
      "id": "motion",
      "mode": "one_relation",
      "hard_limit_chars": 4096
    }
  ]
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "rule_id": "REL_PARTICLES_MOVE",
  "required": [
    "Teilchen bewegen sich weiter"
  ],
  "accepted_short": [
    "weiter",
    "bewegen sich",
    "bleiben in Bewegung"
  ],
  "known_wrong": [
    "stehen still",
    "bewegen sich nicht"
  ],
  "partial": [
    "Gleichgewicht"
  ],
  "scope": "Keine Bewertung weitergehender ungeprüfter Behauptungen.",
  "confidence_policy": "Keine fachliche Abwertung allein wegen vorsichtiger Formulierung."
}
```

**Kriterien-IDs:** M4.03.C01.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Alle Teilchen laufen zielgerichtet; im Gleichgewicht stehen sie still; gleiche Anzahl bedeutet immer gleiche Konzentration.


### M4.04 · Anzahl ist nicht Konzentration

**Format:** `numeric` · **Denkhandlung:** Transfer

**Material:** Konzentration bedeutet Teilchenmenge pro Volumen. Beide Räume enthalten dieselbe Teilchenart.

**Auftrag:** Raum A hat das doppelte Volumen von B. In B sind 10 Teilchen. Wie viele müssen in A vorliegen, damit die Konzentrationen gleich sind?

**Antwort-/Bedienstruktur:**
```json
{
  "fields": [
    "number"
  ],
  "unit": "Teilchen"
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "value": 20,
  "unit": "Teilchen",
  "abs_tolerance": 0,
  "unit_preprinted": true
}
```

**Kriterien-IDs:** M4.04.C01, M4.04.C02.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Alle Teilchen laufen zielgerichtet; im Gleichgewicht stehen sie still; gleiche Anzahl bedeutet immer gleiche Konzentration.


## M5 · Wasserwege vorhersagen

**Frage:** Welche Richtung nimmt Wasser, wenn nur bestimmte Teilchen die Grenze passieren können?

**Ziel:** Membranannahme, Konzentration und Druck getrennt prüfen; Wasserpotenzial als Vergleichsgröße anwenden.

**Bezug:** SFC23–24 §3 SF6/SR1; SM AB09 S.12. **Vorwissen:** M4.

**Darstellung:** Berechnetes Zwei-Raum-Modell plus Zeichen für Druck; für die Lernenden zunächst qualitative Darstellung.

**Handlung:** Permeabilität einstellen, Vorhersagen bei festgelegten Bedingungen vergleichen, Druckwirkung prüfen.

**Hilfe:** Dreischritt: Was passiert die Membran? Wie sind die Konzentrationen? Gibt es einen Druckunterschied?

**Transfer:** Bei verschiedenen Konzentrationen ein Gleichgewicht durch Druckausgleich erklären.

**Abnahme:** Vorzeichen und Einheiten geprüft; kein Wasserstillstand bei Nettofluss null; Tonizität nur relativ und unter benannten Annahmen.


### M5.01 · Die Membranannahme zuerst

**Format:** `multi` · **Denkhandlung:** Anwendung

**Material:** Die Membran ist für Wasser permeabel und für den gelösten Stoff R undurchlässig. Weitere Antriebe oder Reaktionen fehlen.

**Auftrag:** Welche Übergänge sind im Modell erlaubt?

**Antwort-/Bedienstruktur:**
```json
{
  "options": {
    "a": "Wasser von links nach rechts.",
    "b": "Wasser von rechts nach links.",
    "c": "R durch die Membran.",
    "d": "Bei gleichen Bedingungen gibt es keinerlei Wasserübertritte."
  }
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "correct_ids": [
    "a",
    "b"
  ],
  "wrong_reasons": {
    "c": "R ist als nicht permeierend festgelegt.",
    "d": "Wasser kann weiterhin in beide Richtungen übertreten; nur die Nettobilanz kann null sein."
  }
}
```

**Kriterien-IDs:** M5.01.C01, M5.01.C02, M5.01.C03, M5.01.C04.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Osmose ist Soluttransport; die Konzentration allein bestimmt unter allen Bedingungen die Richtung.


### M5.02 · Konzentrationsfälle vergleichen

**Format:** `match` · **Denkhandlung:** Anwendung

**Material:** Innen jeweils 0,24 mol/L nicht permeierendes R, außen A 0,06, B 0,24, C 0,48 mol/L. Anfangs gleiche hydrostatische Drücke; Wasser kann passieren.

**Auftrag:** Ordne für jeden Anfangszustand die Richtung des Netto-Wassertransports zu.

**Antwort-/Bedienstruktur:**
```json
{
  "one_to_one": true
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "pairs": {
    "A": "netto nach innen",
    "B": "kein anfänglicher Nettofluss",
    "C": "netto nach außen"
  }
}
```

**Kriterien-IDs:** M5.02.C01, M5.02.C02, M5.02.C03.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Osmose ist Soluttransport; die Konzentration allein bestimmt unter allen Bedingungen die Richtung.


### M5.03 · Wasserpotenziale vergleichen

**Format:** `single` · **Denkhandlung:** Anwendung

**Material:** Wasser bewegt sich netto vom höheren zum niedrigeren Wasserpotenzial; die Druckwirkung ist in diesen Werten bereits enthalten. Die Membran ist wasserpermeabel.

**Auftrag:** Außen beträgt das Wasserpotenzial −0,18 MPa, innen −0,42 MPa. Welche anfängliche Nettorichtung folgt daraus?

**Antwort-/Bedienstruktur:**
```json
{
  "options": {
    "a": "Nach innen.",
    "b": "Nach außen.",
    "c": "Kein Nettofluss."
  }
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "correct_id": "a",
  "wrong_reasons": {
    "b": "−0,18 ist höher als −0,42; die Vorzeichen dürfen nicht ignoriert werden.",
    "c": "Die Wasserpotenziale sind nicht gleich."
  }
}
```

**Kriterien-IDs:** M5.03.C01.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Osmose ist Soluttransport; die Konzentration allein bestimmt unter allen Bedingungen die Richtung.


### M5.04 · Druck kann ausgleichen

**Format:** `single` · **Denkhandlung:** Anwendung

**Material:** Gleiche Temperatur; intakte wasserpermeable Membran; keine weiteren Prozesse.

**Auftrag:** Innen ist mehr nicht permeierender Stoff gelöst als außen. Der innere Druck ist so weit gestiegen, dass beide Wasserpotenziale gleich sind. Welche Aussage stimmt?

**Antwort-/Bedienstruktur:**
```json
{
  "options": {
    "a": "Wasser muss trotzdem dauerhaft netto nach innen fließen.",
    "b": "Jetzt stehen alle Wassermoleküle still.",
    "c": "Es gibt keinen mittleren Nettofluss, aber weiter Wasserübertritte in beide Richtungen."
  }
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "correct_id": "c",
  "wrong_reasons": {
    "a": "Der entstehende Druck kann den Konzentrationseffekt ausgleichen.",
    "b": "Null Nettofluss bedeutet keinen Stillstand der Moleküle."
  }
}
```

**Kriterien-IDs:** M5.04.C01.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Osmose ist Soluttransport; die Konzentration allein bestimmt unter allen Bedingungen die Richtung.


## M6 · Plasmolyse untersuchen

**Frage:** Warum verändert sich die Zwiebelzelle, obwohl ihre Zellwand fast gleich bleibt?

**Ziel:** Wasserbewegung, Vakuolenvolumen, Turgor und Protoplastlage kausal verbinden; Kontrolle und Rücktausch auswerten.

**Bezug:** SFC23–24 plasmolytisch wirksame Reagenzien/SF6; SM AB12–13 S.17–19. **Vorwissen:** Z1, Z4, M5.

**Darstellung:** 3D-Zwiebel-Epidermiszelle ohne Chloroplasten, drei getrennte Räume und entsprechende 2D-Schnittansicht; kein Mikroskopbild.

**Handlung:** Vorhersagen, Konzentrationswechsel auslösen, Umrisse vergleichen, kurze Begriffe/Richtungen eingeben, Kontrollversuch auswählen.

**Hilfe:** Zuerst nur verfolgen, welche Grenze ihre Position ändert; danach Wasserverlust begründen.

**Transfer:** Einen Wasser-gegen-Wasser-Kontrollansatz begründen; fehlende Erholung ohne voreiligen Ursachenschluss benennen.

**Abnahme:** Zellwand/Zellmembran/Tonoplast eindeutig; eigenes Fachzustandsmodell und Korrektor getrennt geprüft; keine Original-Klausurtransferfrage.


### M6.01 · Was bewegt sich zurück?

**Format:** `match` · **Denkhandlung:** Anwendung

**Material:** Eine frische rote Zwiebel-Epidermiszelle ohne Chloroplasten wird schematisch dargestellt. Zwischen zurückgezogenem Protoplasten und Zellwand liegt Außenlösung, kein leerer Luftraum.

**Auftrag:** Vergleiche den Ausgangszustand und die plasmolysierte Modellzelle. Ordne Zellwand, Zellmembran, Tonoplast und Vakuole ihren Grenzen bzw. Räumen zu.

**Antwort-/Bedienstruktur:**
```json
{
  "targets": [
    "wall",
    "plasma_membrane",
    "tonoplast",
    "vacuole_lumen"
  ],
  "states": [
    "turgid",
    "plasmolysed"
  ],
  "one_to_one": true
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "pairs": {
    "wall": "Zellwand",
    "plasma_membrane": "Zellmembran",
    "tonoplast": "Tonoplast",
    "vacuole_lumen": "Vakuole"
  },
  "invariants": [
    "Zellwandabmessungen annähernd gleich",
    "Membranen sind nicht mit der Wand gleichzusetzen"
  ]
}
```

**Kriterien-IDs:** M6.01.C01, M6.01.C02, M6.01.C03, M6.01.C04.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Die Zellwand schrumpft mit; Zucker drückt die Vakuole zusammen; fehlende Erholung beweist eine bestimmte Ursache.


### M6.02 · Wasserverlust schrittweise erklären

**Format:** `bounded_text` · **Denkhandlung:** Anwendung

**Material:** Betrachtet wird eine frühe Phase der Wasserabgabe nach dem Lösungswechsel, nicht der mathematische Zeitpunkt des Austauschs. Für den angezeigten Zustand gilt ausdrücklich: Wasserpotenzial Vakuole > Cytosol > Außenlösung. Zellmembran und Tonoplast lassen Wasser passieren. Saccharose wird im Beobachtungszeitraum weitgehend zurückgehalten. Die Zelle ist intakt; weitere Stofftransporte werden ausgeblendet. Ein höheres Wasserpotenzial liegt hier vor, wenn der Wert weniger negativ ist.

**Auftrag:** Beantworte die drei Teilfragen getrennt: a) Wie heißt der Wassertransportvorgang? b) In welche Richtung bewegt sich Wasser im angezeigten Zustand netto über die Zellmembran? c) Wie verändert sich in dieser Phase das Vakuolenvolumen?

**Antwort-/Bedienstruktur:**
```json
{
  "fields": [
    {
      "id": "process",
      "mode": "one_term",
      "hard_limit_chars": 4096
    },
    {
      "id": "direction",
      "mode": "one_relation",
      "hard_limit_chars": 4096
    },
    {
      "id": "volume",
      "mode": "one_relation",
      "hard_limit_chars": 4096
    }
  ]
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "fields": {
    "process": {
      "rule_id": "TERM_OSMOSIS",
      "required": [
        "Osmose"
      ],
      "partial": [
        "Diffusion"
      ]
    },
    "direction": {
      "rule_id": "REL_NET_WATER_OUT",
      "required": [
        "Wasser netto aus der Zelle in den Außenraum"
      ],
      "accepted_short": [
        "nach außen",
        "hinaus",
        "raus"
      ],
      "known_wrong": [
        "nach innen",
        "hinein"
      ]
    },
    "volume": {
      "rule_id": "REL_VACUOLE_SMALLER",
      "required": [
        "Vakuolenvolumen nimmt ab"
      ],
      "accepted_short": [
        "kleiner",
        "nimmt ab",
        "schrumpft",
        "weniger"
      ],
      "known_wrong": [
        "größer",
        "nimmt zu"
      ]
    }
  },
  "confidence_policy": "Keine fachliche Abwertung allein wegen vorsichtiger Formulierung."
}
```

**Kriterien-IDs:** M6.02.C01, M6.02.C02, M6.02.C03.

**Hilfen:** 1. Verfolge zuerst nur Wasser, nicht Saccharose. 2. Der Außenraum besitzt das niedrigere Wasserpotenzial. Welche Mengenbilanz folgt für den Zellinhalt? 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Die Zellwand schrumpft mit; Zucker drückt die Vakuole zusammen; fehlende Erholung beweist eine bestimmte Ursache.


### M6.03 · Eine Ursache-Wirkungs-Kette legen

**Format:** `causal_map` · **Denkhandlung:** Anwendung

**Material:** A Wasserverlust; B abnehmendes Vakuolen-/Protoplastvolumen; C sinkender Turgor; D bei hinreichendem Wasserverlust Ablösung des Protoplasten. Die Zellwand bleibt annähernd formstabil.

**Auftrag:** Verbinde die Aussagen mit passenden Ursache-Wirkungs-Pfeilen. Zwei Folgen dürfen nebeneinander liegen.

**Antwort-/Bedienstruktur:**
```json
{
  "edge_types": [
    "führt zu",
    "bei ausreichendem Ausmaß",
    "nach Verlust des Wanddrucks"
  ]
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "required_edges": [
    [
      "A",
      "B",
      "führt zu"
    ],
    [
      "A",
      "C",
      "führt zu"
    ],
    [
      "B",
      "D",
      "bei ausreichendem Ausmaß"
    ],
    [
      "C",
      "D",
      "nach Verlust des Wanddrucks"
    ]
  ],
  "parallel": [
    "B",
    "C"
  ],
  "forbidden_claims": [
    "Die Wand schrumpft im gleichen Ausmaß wie der Protoplast."
  ]
}
```

**Kriterien-IDs:** M6.03.C01, M6.03.C02, M6.03.C03, M6.03.C04.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Die Zellwand schrumpft mit; Zucker drückt die Vakuole zusammen; fehlende Erholung beweist eine bestimmte Ursache.


### M6.04 · Kontrolle und Rücktausch

**Format:** `experiment` · **Denkhandlung:** Anwendung

**Material:** Der Behandlungsansatz erhält konzentrierte Saccharoselösung und später Wasser. Ein weiterer Ansatz soll die Handhabung kontrollieren. Lösungen werden insgesamt dreimal nachgezogen: erster Durchgang und zwei Wiederholungen. Beobachtet werden dieselben markierten Zellfelder. Dies ist eine virtuelle Planung, kein realer Methodennachweis.

**Auftrag:** Ergänze einen passenden Kontrollansatz und eine vorsichtige Aussage zum Rücktausch.

**Antwort-/Bedienstruktur:**
```json
{
  "fields": {
    "control": [
      "Wasser gegen Wasser mit gleichen Handgriffen und Zeiten",
      "kein Kontrollansatz",
      "gefärbtes altes Präparat"
    ],
    "interpretation": [
      "Volumenzunahme ist mit erneuter Wasseraufnahme vereinbar",
      "fehlende Erholung beweist sicher Zelltod"
    ],
    "limit": [
      "ohne weitere Befunde keine eindeutige Ursache fehlender Erholung",
      "jede Zelle muss vollständig regenerieren"
    ]
  }
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "control": "Wasser gegen Wasser mit gleichen Handgriffen und Zeiten",
  "recovery": "Volumenzunahme/erneutes Anliegen ist mit Wasseraufnahme vereinbar",
  "no_recovery": "Ausbleibende Erholung allein unterscheidet unvollständigen Austausch, zu kurze Zeit und Schädigung nicht",
  "reject": [
    "ungefärbte Zelle durch gefärbtes altes Präparat ersetzen",
    "fehlende Erholung beweist sicher Zelltod"
  ]
}
```

**Kriterien-IDs:** M6.04.C01, M6.04.C02, M6.04.C03.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Die Zellwand schrumpft mit; Zucker drückt die Vakuole zusammen; fehlende Erholung beweist eine bestimmte Ursache.


## M7 · Transportwege unterscheiden

**Frage:** Wann genügt ein Gefälle, und wann ist ein gekoppelter Antrieb nötig?

**Ziel:** Einfache/erleichterte Diffusion, direkt und indirekt energiegekoppelten Transport unterscheiden; Ionen nur elektrochemisch beurteilen.

**Bezug:** SFC24 §3 SF6/SR1; SM AB14 S.20. **Vorwissen:** M3, M4, M5.

**Darstellung:** Kanal-, Carrier- und Pumpenmodelle mit getrenntem Energiekonto; qualitative Ionenfälle, keine freie unvalidierte Elektrophysiologie.

**Handlung:** Transportfälle zuordnen, Datenargumente gewichten, ATP-Rolle benennen und Ionenfälle vergleichen.

**Hilfe:** Weg, Richtung und Energiequelle als drei verschiedene Fragen behandeln.

**Transfer:** Bei gegensätzlichem elektrischem und chemischem Antrieb eine unzureichende Information erkennen.

**Abnahme:** Kein aktiver Wasserkanal; direkte ATP-Spaltung nicht aus bloßer ATP-Abhängigkeit ableiten.


### M7.01 · Weg, Richtung und Energie

**Format:** `match` · **Denkhandlung:** Anwendung

**Material:** A ungeladener Stoff direkt durch Lipide entlang seines Konzentrationsgefälles; B ungeladener Stoff über Carrier entlang seines Gefälles ohne weitere Kopplung; C Transport gegen das antreibende Gefälle gekoppelt an ATP-Spaltung im betreffenden Transportprotein; D Transport gegen das eigene Gefälle gekoppelt an den Abwärtstransport eines anderen Stoffes.

**Auftrag:** Ordne den vier Fällen den passenden Transportmechanismus zu.

**Antwort-/Bedienstruktur:**
```json
{
  "one_to_one": true
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "pairs": {
    "A": "einfache Diffusion",
    "B": "erleichterte Diffusion",
    "C": "primär aktiver Transport",
    "D": "sekundär aktiver Transport"
  }
}
```

**Kriterien-IDs:** M7.01.C01, M7.01.C02, M7.01.C03, M7.01.C04.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Jedes Transportprotein verbraucht unmittelbar ATP; eine hohe Rate beweist aktiven Transport.


### M7.02 · Eine hohe Rate ist kein Energienachweis

**Format:** `single` · **Denkhandlung:** Anwendung

**Material:** Der Stoff wird nicht chemisch verändert oder gebunden. Eine Energiequelle oder Energieabhängigkeit wurde nicht untersucht.

**Auftrag:** Mit Protein P ist die Aufnahme eines ungeladenen Stoffes schneller als ohne P. Außen ist seine Konzentration höher. Was folgt sicher?

**Antwort-/Bedienstruktur:**
```json
{
  "options": {
    "a": "P ist sicher eine ATP-getriebene Pumpe.",
    "b": "P ermöglicht einen zusätzlichen Transportweg; die Daten allein belegen keinen aktiven Transport.",
    "c": "P ist für alle Moleküle gleich durchlässig."
  }
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "correct_id": "b",
  "wrong_reasons": {
    "a": "Ein Protein kann passiv transportieren; die Rate allein beweist keinen ATP-Verbrauch.",
    "c": "Schnellerer Transport ist ein Unterschied, sagt aber nicht, dass jedes andere Molekül transportiert wird."
  }
}
```

**Kriterien-IDs:** M7.02.C01.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Jedes Transportprotein verbraucht unmittelbar ATP; eine hohe Rate beweist aktiven Transport.


### M7.03 · ATP funktional einordnen

**Format:** `bounded_text` · **Denkhandlung:** Anwendung

**Material:** Gefragt ist die Funktion, nicht die vollständige chemische Struktur. ATP ist kein Enzym.

**Auftrag:** Welche grundlegende Rolle hat ATP bei energiegekoppelten Zellprozessen? Ein kurzer Ausdruck genügt.

**Antwort-/Bedienstruktur:**
```json
{
  "fields": [
    {
      "id": "role",
      "mode": "one_relation",
      "hard_limit_chars": 4096
    }
  ]
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "rule_id": "TERM_ATP_ROLE",
  "known_wrong": [
    "Enzym",
    "Transportkanal"
  ],
  "partial": [
    "Energie"
  ],
  "required_any_of": [
    "Energieträger",
    "Energieüberträger",
    "stellt nutzbare Energie für gekoppelte Prozesse bereit",
    "Energielieferant für Zellprozesse"
  ],
  "confidence_policy": "Keine fachliche Abwertung allein wegen vorsichtiger Formulierung."
}
```

**Kriterien-IDs:** M7.03.C01.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Jedes Transportprotein verbraucht unmittelbar ATP; eine hohe Rate beweist aktiven Transport.


### M7.04 · Bei Ionen wirken zwei Beiträge

**Format:** `match` · **Denkhandlung:** Anwendung

**Material:** Eine Membran besitzt einen offenen Kanal für ein positives Ion. A Konzentrations- und elektrischer Antrieb beide nach innen. B beide nach außen. C Konzentrationsantrieb nach innen, elektrischer Antrieb nach außen; ihre Stärke ist unbekannt.

**Auftrag:** Ordne zu, ob die passive Anfangsrichtung nach innen, nach außen oder ohne weitere Größenangaben nicht bestimmbar ist.

**Antwort-/Bedienstruktur:**
```json
{
  "one_to_one": true
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "pairs": {
    "A": "nach innen",
    "B": "nach außen",
    "C": "nicht bestimmbar ohne Größenverhältnis"
  }
}
```

**Kriterien-IDs:** M7.04.C01, M7.04.C02, M7.04.C03.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Jedes Transportprotein verbraucht unmittelbar ATP; eine hohe Rate beweist aktiven Transport.


## M8 · Von Zellraum zu Zellraum

**Frage:** Wie gelangt ein Sekretprotein nach außen, ohne frei durch das Cytosol zu wandern?

**Ziel:** ER-Lumen, Vesikel, Golgi und Exocytose verbinden; Orientierung bei Membranfusion nachvollziehen.

**Bezug:** SFC24 Vorentlastung Leben und Energie SF3/SF5/SF6; SM AB15.1 S.21. **Vorwissen:** Z2, M3, M7.

**Darstellung:** Schnittmodell mit durchgehend markierter luminaler und cytosolischer Seite; vergrößerte Vesikel gekennzeichnet.

**Handlung:** Weg ordnen, Membranseiten verfolgen, Vesikel- und Proteintransport vergleichen.

**Hilfe:** Der farbige luminale Marker bleibt bei der Abschnürung auf derselben Seite.

**Transfer:** Eine Markierung von der ER-Innenseite zur späteren Außenseite der Zellmembran verfolgen.

**Abnahme:** Topologie bleibt im vollständigen Animationsweg erhalten; kein falscher Mitochondrien-Zwischenschritt.


### M8.01 · Den Sekretionsweg legen

**Format:** `order` · **Denkhandlung:** Anwendung

**Material:** Das Protein bleibt auf dem hier dargestellten Transportweg in membranumgrenzten Räumen. Die Aufgabe beginnt ausdrücklich nach der Aufnahme ins ER.

**Auftrag:** Ordne den Weg eines bereits im ER-Lumen befindlichen Sekretproteins bis nach außen.

**Antwort-/Bedienstruktur:**
```json
{
  "items": [
    "ER-Lumen",
    "Transportvesikel",
    "Golgi-Lumen",
    "Sekretvesikel",
    "Außenraum nach Fusion"
  ],
  "evaluation": "sequence"
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "sequence": [
    "ER-Lumen",
    "Transportvesikel",
    "Golgi-Lumen",
    "Sekretvesikel",
    "Außenraum nach Fusion"
  ]
}
```

**Kriterien-IDs:** M8.01.C01.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Bei Fusion kehrt die Membran ihre Seiten um; Vesikelcargo diffundiert durch den hydrophoben Kern.


### M8.02 · Membranseiten verfolgen

**Format:** `single` · **Denkhandlung:** Anwendung

**Material:** Es gibt keinen Wechsel des Proteins zwischen den Membranseiten. Vesikel schnüren sich ab und verschmelzen orientierungserhaltend.

**Auftrag:** Eine Markierung liegt auf der zum ER-Lumen gerichteten Seite eines Membranproteins. Wo liegt sie nach dem dargestellten Vesikelweg und der Fusion mit der Zellmembran?

**Antwort-/Bedienstruktur:**
```json
{
  "options": {
    "a": "Auf der zum Außenraum gerichteten Seite.",
    "b": "Auf der zum Cytosol gerichteten Seite.",
    "c": "Das Protein muss verschwunden sein."
  }
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "correct_id": "a",
  "wrong_reasons": {
    "b": "Die luminale Seite wird bei dieser Fusion nach außen zugänglich, nicht ins Cytosol gewendet.",
    "c": "Eine Fusion entfernt nicht automatisch das Membranprotein."
  }
}
```

**Kriterien-IDs:** M8.02.C01.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Bei Fusion kehrt die Membran ihre Seiten um; Vesikelcargo diffundiert durch den hydrophoben Kern.


### M8.03 · Zwei Transportprinzipien

**Format:** `match` · **Denkhandlung:** Anwendung

**Material:** A ein einzelner geeigneter Stoff übertritt die Membran an einem Carrier; B Inhalt bleibt in einem umhüllten Raum und wird durch Fusion am Ziel abgegeben; C der Weg setzt keinen Durchtritt des gesamten Cargos durch den hydrophoben Membrankern voraus.

**Auftrag:** Ordne die Beschreibungen entweder Membranproteintransport oder Vesikeltransport zu.

**Antwort-/Bedienstruktur:**
```json
{
  "one_to_one": false
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "pairs": {
    "A": "Membranproteintransport",
    "B": "Vesikeltransport",
    "C": "Vesikeltransport"
  }
}
```

**Kriterien-IDs:** M8.03.C01, M8.03.C02, M8.03.C03.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Bei Fusion kehrt die Membran ihre Seiten um; Vesikelcargo diffundiert durch den hydrophoben Kern.


### M8.04 · Getrennt und verbunden

**Format:** `multi` · **Denkhandlung:** Anwendung

**Material:** In der betrachteten Zelle existieren verschiedene Reaktionsräume. Manche Stoffe passieren über Proteine, andere werden in Vesikeln transportiert.

**Auftrag:** Welche Aussagen beschreiben den Nutzen von Kompartimentierung und Austausch gemeinsam?

**Antwort-/Bedienstruktur:**
```json
{
  "options": {
    "a": "Räume können unterschiedliche Bedingungen erhalten.",
    "b": "Alle Räume müssen dauerhaft vollständig voneinander isoliert sein.",
    "c": "Kontrollierter Austausch verbindet die Teilprozesse.",
    "d": "Jedes Sekretprotein muss zur Energieaufnahme durch ein Mitochondrium laufen."
  }
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "correct_ids": [
    "a",
    "c"
  ],
  "wrong_reasons": {
    "b": "Vollständige Isolation würde die Zusammenarbeit der Räume verhindern.",
    "d": "Energieumwandlung ist nicht gleich Stofftransport; ein Cargo durchläuft nicht deshalb Mitochondrien."
  }
}
```

**Kriterien-IDs:** M8.04.C01, M8.04.C02, M8.04.C03, M8.04.C04.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Bei Fusion kehrt die Membran ihre Seiten um; Vesikelcargo diffundiert durch den hydrophoben Kern.


## M9 · Innere Bedingungen stabilisieren

**Frage:** Wann führt eine Veränderung im Zellinneren zur Wasseraufnahme – und wann setzt eine Gegenreaktion ein?

**Ziel:** Drei Wasserpotenziale vergleichen; vereinfachte tierische Volumenregulation als negative Rückkopplung erklären und Grenzen benennen.

**Bezug:** SFC24 SR1/SF6; SM AB15.2–15.3 S.21–22. **Vorwissen:** M5, M7, M8.

**Darstellung:** Berechnete Wasserwege plus ausdrücklich szenariobasierter Regelkreis einer Epithelzelle; keine universelle Zellphysiologie.

**Handlung:** Flussrichtungen bestimmen, Sollbereich prüfen, Regelkreis legen, Kanalblockade vergleichen.

**Hilfe:** Außenraum–Cytosol und Cytosol–Vakuole einzeln prüfen; danach beim Regelkreis den Rückpfeil ergänzen.

**Transfer:** Die Gegenreaktion muss mit geringer werdender Abweichung nachlassen.

**Abnahme:** Sensor erfasst indirekt; K-/Cl-Auswärtsgradienten sind Voraussetzung; Prozentwerte didaktisch; keine unkalibrierte Vorhersage biologischer Zeit.


### M9.01 · Drei Räume getrennt bilanzieren

**Format:** `match` · **Denkhandlung:** Anwendung

**Material:** Wasserpotenziale in MPa, bereits einschließlich Druck: Fall A außen −0,10, Cytosol −0,30, Vakuole −0,50. Fall B außen −0,70, Cytosol −0,30, Vakuole −0,50. Beide Membranen sind wasserpermeabel. Wasser bewegt sich netto zum niedrigeren Wasserpotenzial.

**Auftrag:** Bestimme in beiden Fällen die anfängliche Wasserbewegung über Zellmembran und Tonoplast.

**Antwort-/Bedienstruktur:**
```json
{
  "one_to_one": false
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "pairs": {
    "A Zellmembran": "außen → Cytosol",
    "A Tonoplast": "Cytosol → Vakuole",
    "B Zellmembran": "Cytosol → außen",
    "B Tonoplast": "Cytosol → Vakuole"
  },
  "conclusion": "Eine Aufnahme in die Vakuole beweist nicht gleichzeitig Wasseraufnahme aus der Umgebung."
}
```

**Kriterien-IDs:** M9.01.C01, M9.01.C02, M9.01.C03, M9.01.C04.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Solutanreicherung in der Vakuole reicht immer für äußere Wasseraufnahme; ein Kanal ist eine aktive Wasserpumpe.


### M9.02 · Abweichung und Sollbereich

**Format:** `numeric` · **Denkhandlung:** Anwendung

**Material:** Die Prozentwerte beziehen sich auf ein Referenzvolumen; sie sind Unterrichtsmodellwerte, keine allgemeinen biologischen Grenzwerte.

**Auftrag:** Ein didaktisches Zellmodell hat Zielwert 100 %, Sollbereich 95–105 % und aktuellen Wert 112 %. Gib die Abweichung vom Zielwert sowie die Überschreitung der oberen Grenze in Prozentpunkten an.

**Antwort-/Bedienstruktur:**
```json
{
  "fields": [
    "target_difference",
    "upper_difference"
  ],
  "units_preprinted": true
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "fields": {
    "target_difference": {
      "value": 12,
      "unit": "Prozentpunkte",
      "abs_tolerance": 0
    },
    "upper_difference": {
      "value": 7,
      "unit": "Prozentpunkte",
      "abs_tolerance": 0
    }
  }
}
```

**Kriterien-IDs:** M9.02.C01, M9.02.C02.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Solutanreicherung in der Vakuole reicht immer für äußere Wasseraufnahme; ein Kanal ist eine aktive Wasserpumpe.


### M9.03 · Negative Rückkopplung legen

**Format:** `causal_map` · **Denkhandlung:** Anwendung

**Material:** Funktionales Modell einer tierischen Epithelzelle: verdünnte Außenlösung → Wasseraufnahme/Schwellung. Ein mechanosensitives Protein erfasst die Dehnung indirekt. Ein Signalweg fördert K+- und Cl−-Kanalaktivität. Im Beispiel treiben elektrochemische Gefälle beide Ionen nach außen. Nach Salzverlust kann Wasser netto austreten. Geringere Schwellung schwächt Sensorsignal und Kanalaktivierung.

**Auftrag:** Verbinde Störung, Erfassung, Gegenreaktion und Rückkopplung. Kennzeichne den abschwächenden Rückweg.

**Antwort-/Bedienstruktur:**
```json
{
  "edge_types": [
    "verstärkt",
    "begünstigt",
    "vermindert"
  ]
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "required_edges": [
    [
      "verdünnte Außenlösung",
      "Schwellung",
      "verstärkt"
    ],
    [
      "Schwellung",
      "Sensorsignal",
      "verstärkt"
    ],
    [
      "Sensorsignal",
      "Kanalaktivität",
      "verstärkt"
    ],
    [
      "Kanalaktivität",
      "Salzausstrom",
      "verstärkt"
    ],
    [
      "Salzausstrom",
      "Wasserausstrom",
      "begünstigt"
    ],
    [
      "Wasserausstrom",
      "Schwellung",
      "vermindert"
    ]
  ],
  "limit": "Bestimmtes vereinfachtes Beispiel, kein universeller zentraler Regler."
}
```

**Kriterien-IDs:** M9.03.C01, M9.03.C02, M9.03.C03, M9.03.C04, M9.03.C05, M9.03.C06.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Solutanreicherung in der Vakuole reicht immer für äußere Wasseraufnahme; ein Kanal ist eine aktive Wasserpumpe.


### M9.04 · Eine Kanalblockade prüfen

**Format:** `experiment` · **Denkhandlung:** Anwendung

**Material:** Zwei ansonsten gleiche Modellzellen erhalten dieselbe Verdünnung. In einer können die hier benötigten K+-/Cl−-Kanäle nicht aktiviert werden. Andere Regulationswege sind in diesem begrenzten Modell nicht enthalten.

**Auftrag:** Plane einen Vergleich im vorgegebenen Regelkreismodell und wähle die erwartete Einschränkung der Gegenreaktion.

**Antwort-/Bedienstruktur:**
```json
{
  "options": [
    "gleiche Ausgangsgröße",
    "gleiche Außenlösung",
    "gleiche Beobachtungszeit",
    "Volumenverlauf vergleichen",
    "Wasser kann dann keine Membran mehr passieren",
    "Blockade verändert zugleich die Außenkonzentration"
  ],
  "prediction_choices": [
    "ohne Kanalaktivierung geringere Volumenrückkehr im Modell",
    "alle Wasserbewegung endet sofort"
  ]
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "required_selections": [
    "gleiche Ausgangsgröße",
    "gleiche Außenlösung",
    "gleiche Beobachtungszeit",
    "Volumenverlauf vergleichen"
  ],
  "prediction": "ohne Kanalaktivierung geringere Volumenrückkehr im Modell",
  "reject": [
    "Wasser kann dann keine Membran mehr passieren",
    "Blockade verändert zugleich die Außenkonzentration"
  ]
}
```

**Kriterien-IDs:** M9.04.C01, M9.04.C02, M9.04.C03, M9.04.C04, M9.04.C05.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Solutanreicherung in der Vakuole reicht immer für äußere Wasseraufnahme; ein Kanal ist eine aktive Wasserpumpe.


## M10 · Daten kritisch nutzen

**Frage:** Was erlauben Messwerte zu folgern – und was nicht?

**Ziel:** Relative Änderungen, Einheiten, Diagramme, Interpolation und kontrollierte Vergleiche sicher anwenden.

**Bezug:** SFC22 Erkenntnisgewinnung/Kommunikation; SFC23–24 SF6; SM AB16–17 S.23–24. **Vorwissen:** M5, M7, M9.

**Darstellung:** Neue didaktische Datensätze, Diagrammwerkzeug und strukturierte Versuchsplanung; keine Echtmessungen.

**Handlung:** Rechnen, Achsen setzen, Punkte darstellen, Näherung erklären, Kontrollen und Messgrößen auswählen.

**Hilfe:** Anfangswert und Endwert auseinanderhalten; Gesamtgröße und normierte Größe getrennt betrachten.

**Transfer:** Einen Flächeneffekt bei konstant gehaltener Proteindichte richtig interpretieren.

**Abnahme:** Zahlen, Einheiten, zulässige Toleranzen und alternative valide Designs explizit getestet.


### M10.01 · Relative Massenänderung

**Format:** `numeric` · **Denkhandlung:** Anwendung

**Material:** Neue didaktische Daten, kein realer Versuch: Außenkonzentrationen 0,00/0,10/0,20/0,30/0,40 mol/L eines im Zeitfenster nicht permeierenden Stoffes. Anfangsmasse jeweils 3,00 g; Endmassen 3,24/3,09/2,97/2,85/2,76 g. Formel: 100 × (Endmasse − Anfangsmasse) / Anfangsmasse.

**Auftrag:** Berechne für alle fünf Ansätze die relative Massenänderung in Prozent.

**Antwort-/Bedienstruktur:**
```json
{
  "fields": [
    "c0",
    "c10",
    "c20",
    "c30",
    "c40"
  ],
  "units_preprinted": true
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "fields": {
    "c0": {
      "value": 8,
      "unit": "%",
      "abs_tolerance": 0.05
    },
    "c10": {
      "value": 3,
      "unit": "%",
      "abs_tolerance": 0.05
    },
    "c20": {
      "value": -1,
      "unit": "%",
      "abs_tolerance": 0.05
    },
    "c30": {
      "value": -5,
      "unit": "%",
      "abs_tolerance": 0.05
    },
    "c40": {
      "value": -8,
      "unit": "%",
      "abs_tolerance": 0.05
    }
  }
}
```

**Kriterien-IDs:** M10.01.C01, M10.01.C02, M10.01.C03, M10.01.C04, M10.01.C05.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Ein interpolierter Nullpunkt ist exakt gemessen; gleiche Proteindichte bedeutet gleiche gesamte Proteinzahl.


### M10.02 · Ein Diagramm erstellen

**Format:** `graph` · **Denkhandlung:** Anwendung

**Material:** Daten: (0,00 mol/L; +8 %), (0,10; +3), (0,20; −1), (0,30; −5), (0,40; −8). Dies sind didaktisch erstellte Werte. Das Einzeichnen dient der Datendarstellung, nicht dem Nachweis eines allgemeinen linearen Gesetzes.

**Auftrag:** Trage die relativen Massenänderungen gegen die Außenkonzentration auf. Beschrifte beide Achsen mit Größen und Einheiten.

**Antwort-/Bedienstruktur:**
```json
{
  "tap_alternative": "Koordinatenpaare als Zahleneingabe",
  "view": "svg_plot"
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "x_label": "Außenkonzentration",
  "x_unit": "mol/L",
  "y_label": "relative Massenänderung",
  "y_unit": "%",
  "points": [
    [
      0,
      8
    ],
    [
      0.1,
      3
    ],
    [
      0.2,
      -1
    ],
    [
      0.3,
      -5
    ],
    [
      0.4,
      -8
    ]
  ],
  "point_tolerance": {
    "x": 0.005,
    "y": 0.2
  },
  "allowed_axis_scaling": "jede monotone lineare Skalierung, die alle Werte und null einschließt"
}
```

**Kriterien-IDs:** M10.02.C01, M10.02.C02, M10.02.C03.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Ein interpolierter Nullpunkt ist exakt gemessen; gleiche Proteindichte bedeutet gleiche gesamte Proteinzahl.


### M10.03 · Eine Näherung von einer Messung unterscheiden

**Format:** `numeric` · **Denkhandlung:** Anwendung

**Material:** Zwischenwerte wurden nicht gemessen; Messdauer und Gewebezustand begrenzen die Aussage. Der Zellsaft enthält verschiedene Stoffe, und Druck kann mitwirken.

**Auftrag:** Schätze zwischen 0,10 mol/L (+3 %) und 0,20 mol/L (−1 %) linear die Außenkonzentration ohne beobachtbare Massenänderung. Wähle anschließend die zulässige Schlussfolgerung.

**Antwort-/Bedienstruktur:**
```json
{
  "fields": [
    "number",
    "conclusion"
  ],
  "unit_choices": [
    "mol/L",
    "mmol/L"
  ],
  "convert_units": true,
  "conclusions": [
    "Näherung für ausbleibende Netto-Massenänderung unter den angegebenen Bedingungen",
    "exakt gemessene Konzentration sämtlicher Zellsaftstoffe"
  ]
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "value": 0.175,
  "unit": "mol/L",
  "abs_tolerance": 0.005,
  "accepted_conclusion": "Näherung für ausbleibende Netto-Massenänderung unter den angegebenen Bedingungen",
  "reject_conclusion": "exakt gemessene Konzentration sämtlicher Zellsaftstoffe"
}
```

**Kriterien-IDs:** M10.03.C01, M10.03.C02, M10.03.C03.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Ein interpolierter Nullpunkt ist exakt gemessen; gleiche Proteindichte bedeutet gleiche gesamte Proteinzahl.


### M10.04 · Fläche und Proteindichte trennen

**Format:** `experiment` · **Denkhandlung:** Strukturierte Planung

**Material:** Zwei Membranflächen A und 2A enthalten dieselbe Anzahl Transportproteine pro Flächeneinheit. Konzentrationsgefälle, Temperatur und Messdauer bleiben gleich; Stoffversorgung ist nicht begrenzend. Die Membranfläche wird in diesem Modell durch doppelte Zahl ansonsten gleicher Vesikel vergrößert.

**Auftrag:** Prüfe einen Flächeneffekt auf die Gesamtaufnahme. Stelle zwei vergleichbare Ansätze zusammen und wähle zusätzlich eine geeignete normierte Messgröße.

**Antwort-/Bedienstruktur:**
```json
{
  "options": [
    "gleiche Proteindichte",
    "gleiches Konzentrationsgefälle",
    "gleiche Temperatur",
    "gleiche Messdauer",
    "Gesamtaufnahme pro Zeit",
    "Aufnahme pro Zeit und Membranfläche",
    "gleiche gesamte Proteinzahl trotz doppelter Fläche"
  ]
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "required_selections": [
    "gleiche Proteindichte",
    "gleiches Konzentrationsgefälle",
    "gleiche Temperatur",
    "gleiche Messdauer",
    "Gesamtaufnahme pro Zeit",
    "Aufnahme pro Zeit und Membranfläche"
  ],
  "prediction": "bei linearer Skalierung doppelte Gesamtrate, gleiche flächenbezogene Rate",
  "note": "Die gesamte Proteinzahl ist bei 2A doppelt, nicht konstant."
}
```

**Kriterien-IDs:** M10.04.C01, M10.04.C02, M10.04.C03, M10.04.C04, M10.04.C05, M10.04.C06, M10.04.C07.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Ein interpolierter Nullpunkt ist exakt gemessen; gleiche Proteindichte bedeutet gleiche gesamte Proteinzahl.


## E1 · Grundlagen: Ursprung des Lebens

**Frage:** Was erklären Modelle zum Ursprung des Lebens jeweils?

**Ziel:** Bausteinbildung, Informationssysteme und Abgrenzung als Teilprobleme unterscheiden; Kriterien des Lebendigen anwenden.

**Bezug:** SFC23 Einstieg; SM E1 S.25. **Vorwissen:** keine zusätzlichen Voraussetzungen.

**Darstellung:** Schematische Karten und begrenzte Aufgaben, kein Laborversuch.

**Handlung:** Zuordnen, ordnen, gezielt rechnen.

**Hilfe:** Begriffskarten und ein ausgearbeitetes Beispiel.

**Transfer:** Bekannte Regel auf ein neues begrenztes Beispiel anwenden.

**Abnahme:** Nur nach Diagnose als Lernbedarf empfehlen; kein Vorziehen von Mitose/Meiose oder detaillierter Genetik.


### E1.01 · Teilprobleme der Lebensentstehung

**Format:** `match` · **Denkhandlung:** Anwendung

**Material:** A abiotische Bildung organischer Bausteine; B RNA-Welt-Modelle; C Modelle membranumgrenzter Vorstufen; D Eintrag organischer Moleküle aus dem Weltraum.

**Auftrag:** Ordne jedem Ansatz sein untersuchtes Teilproblem zu.

**Antwort-/Bedienstruktur:**
```json
{}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "pairs": {
    "A": "Entstehung von Bausteinen",
    "B": "Verknüpfung von Information und katalytischer Funktion in frühen Systemen",
    "C": "Abgrenzung und räumliche Organisation",
    "D": "mögliche zusätzliche Herkunft von Bausteinen"
  }
}
```

**Kriterien-IDs:** E1.01.C01, E1.01.C02, E1.01.C03, E1.01.C04.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Ein Teilprozess wird mit der vollständigen Lebensentstehung oder Vermehrung gleichgesetzt.


### E1.02 · Ein Kristall als Grenzfall

**Format:** `multi` · **Denkhandlung:** Anwendung

**Material:** Ein Kristall wächst durch Anlagerung von Stoffen; das allein belegt kein Leben.

**Auftrag:** Welche Aussagen unterscheiden einen wachsenden Kristall von einer lebenden Zelle?

**Antwort-/Bedienstruktur:**
```json
{
  "options": {
    "a": "Lebende Zellen besitzen einen organisierten Stoffwechsel.",
    "b": "Jedes Wachstum beweist Leben.",
    "c": "Zelluläre Organisation gehört zum Kriterienbündel des Lebendigen."
  }
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "correct_ids": [
    "a",
    "c"
  ],
  "wrong_reasons": {
    "b": "Wachstum allein genügt nicht als Kriterium."
  }
}
```

**Kriterien-IDs:** E1.02.C01, E1.02.C02, E1.02.C03.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Ein Teilprozess wird mit der vollständigen Lebensentstehung oder Vermehrung gleichgesetzt.


### E1.03 · Bausteinbildung und Beweis

**Format:** `single` · **Denkhandlung:** Anwendung

**Material:** Untersucht wurde ausschließlich die Bildung bestimmter organischer Moleküle.

**Auftrag:** Was folgt daraus, dass unter Modellbedingungen Aminosäuren ohne Lebewesen entstehen?

**Antwort-/Bedienstruktur:**
```json
{
  "options": {
    "a": "Ein möglicher Teilprozess der Bausteinbildung ist unter diesen Bedingungen gezeigt.",
    "b": "Die vollständige Entstehung einer lebenden Zelle ist bewiesen.",
    "c": "Der einzig mögliche historische Ablauf ist vollständig bekannt."
  }
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "correct_id": "a",
  "wrong_reasons": {
    "b": "Molekülbildung ist keine vollständige Zellbildung.",
    "c": "Ein Modellversuch rekonstruiert nicht automatisch die einzige historische Abfolge."
  }
}
```

**Kriterien-IDs:** E1.03.C01.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Ein Teilprozess wird mit der vollständigen Lebensentstehung oder Vermehrung gleichgesetzt.


## E2 · Grundlagen: Nukleinsäuren

**Frage:** Wie hängen Bausteine und Aufgaben von Nukleinsäuren zusammen?

**Ziel:** Nukleotide, DNA/RNA, Basenpaarung und ATP auf grundlegendem Niveau unterscheiden.

**Bezug:** SFC23 §1 SF3; SM E2 S.26. **Vorwissen:** keine zusätzlichen Voraussetzungen.

**Darstellung:** Schematische Karten und begrenzte Aufgaben, kein Laborversuch.

**Handlung:** Zuordnen, ordnen, gezielt rechnen.

**Hilfe:** Begriffskarten und ein ausgearbeitetes Beispiel.

**Transfer:** Bekannte Regel auf ein neues begrenztes Beispiel anwenden.

**Abnahme:** Nur nach Diagnose als Lernbedarf empfehlen; kein Vorziehen von Mitose/Meiose oder detaillierter Genetik.


### E2.01 · Ein Nukleotid aufbauen

**Format:** `match` · **Denkhandlung:** Anwendung

**Material:** Symbole stehen für Zucker, Phosphat und eine Base; keine atomgetreue Strukturformel.

**Auftrag:** Ordne die drei Bausteine eines DNA-Nukleotids zu.

**Antwort-/Bedienstruktur:**
```json
{}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "pairs": {
    "Z": "Desoxyribose",
    "P": "Phosphatgruppe",
    "B": "Base"
  }
}
```

**Kriterien-IDs:** E2.01.C01, E2.01.C02, E2.01.C03.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Ein Teilprozess wird mit der vollständigen Lebensentstehung oder Vermehrung gleichgesetzt.


### E2.02 · DNA und RNA vergleichen

**Format:** `match` · **Denkhandlung:** Anwendung

**Material:** Für die Basenpaarung gilt A–T und G–C. RNA enthält statt Thymin Uracil; die typische Struktur wird vereinfacht.

**Auftrag:** Ordne typische Merkmale DNA oder RNA zu und ergänze zur DNA-Folge A–C–G–T die komplementäre Folge.

**Antwort-/Bedienstruktur:**
```json
{}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "pairs": {
    "Desoxyribose": "DNA",
    "Ribose": "RNA",
    "Uracil": "RNA",
    "typisch zwei komplementäre Ketten": "DNA"
  },
  "complement": [
    "T",
    "G",
    "C",
    "A"
  ]
}
```

**Kriterien-IDs:** E2.02.C01, E2.02.C02, E2.02.C03, E2.02.C04, E2.02.C05.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Ein Teilprozess wird mit der vollständigen Lebensentstehung oder Vermehrung gleichgesetzt.


### E2.03 · Information und Energie unterscheiden

**Format:** `single` · **Denkhandlung:** Anwendung

**Material:** Beide stehen mit Nukleotidbausteinen in Zusammenhang, haben aber unterschiedliche Strukturzusammenhänge und Funktionen.

**Auftrag:** Welche Aussage unterscheidet ATP und DNA fachlich passend?

**Antwort-/Bedienstruktur:**
```json
{
  "options": {
    "a": "Beide speichern ausschließlich dieselbe Erbinformation.",
    "b": "DNA trägt Information in einer Basenfolge; ATP dient vor allem als Energieüberträger.",
    "c": "ATP ist ein proteinisches Enzym."
  }
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "correct_id": "b",
  "wrong_reasons": {
    "a": "Ein gemeinsamer Bausteintyp erzwingt keine gleiche Funktion.",
    "c": "ATP ist kein proteinisches Enzym."
  }
}
```

**Kriterien-IDs:** E2.03.C01.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Ein Teilprozess wird mit der vollständigen Lebensentstehung oder Vermehrung gleichgesetzt.


## E3 · Grundlagen: Bakterielle Information

**Frage:** Wie vermehren Bakterien sich und wie kann Information übertragen werden?

**Ziel:** DNA-Verdopplung, Verteilung, Zweiteilung und horizontalen Transfer unterscheiden.

**Bezug:** SFC23 §2 E1; SM E3 S.27. **Vorwissen:** keine zusätzlichen Voraussetzungen.

**Darstellung:** Schematische Karten und begrenzte Aufgaben, kein Laborversuch.

**Handlung:** Zuordnen, ordnen, gezielt rechnen.

**Hilfe:** Begriffskarten und ein ausgearbeitetes Beispiel.

**Transfer:** Bekannte Regel auf ein neues begrenztes Beispiel anwenden.

**Abnahme:** Nur nach Diagnose als Lernbedarf empfehlen; kein Vorziehen von Mitose/Meiose oder detaillierter Genetik.


### E3.01 · Zweiteilung ordnen

**Format:** `order` · **Denkhandlung:** Anwendung

**Material:** Vereinfachtes Modell eines Bakteriums mit einem Chromosom; keine Mitosephasen werden vorausgesetzt.

**Auftrag:** Ordne die grundlegenden Schritte der bakteriellen Zweiteilung.

**Antwort-/Bedienstruktur:**
```json
{
  "items": [
    "DNA vervielfältigen",
    "Kopien räumlich verteilen",
    "zwei Tochterzellen bilden"
  ],
  "evaluation": "sequence"
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "sequence": [
    "DNA vervielfältigen",
    "Kopien räumlich verteilen",
    "zwei Tochterzellen bilden"
  ]
}
```

**Kriterien-IDs:** E3.01.C01.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Ein Teilprozess wird mit der vollständigen Lebensentstehung oder Vermehrung gleichgesetzt.


### E3.02 · Ideales Wachstum berechnen

**Format:** `numeric` · **Denkhandlung:** Anwendung

**Material:** Ideale Modellannahme; in realen Kulturen begrenzen Ressourcen und weitere Bedingungen das Wachstum.

**Auftrag:** Eine Modellpopulation beginnt mit 12 Bakterien und verdoppelt sich alle 20 Minuten. Wie viele sind nach 60 Minuten vorhanden?

**Antwort-/Bedienstruktur:**
```json
{
  "fields": [
    "number"
  ],
  "unit": "Bakterien"
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "value": 96,
  "unit": "Bakterien",
  "abs_tolerance": 0,
  "unit_preprinted": true
}
```

**Kriterien-IDs:** E3.02.C01, E3.02.C02.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Ein Teilprozess wird mit der vollständigen Lebensentstehung oder Vermehrung gleichgesetzt.


### E3.03 · Informationsaustausch ist nicht Zellteilung

**Format:** `single` · **Denkhandlung:** Anwendung

**Material:** Das Modell beschreibt Konjugation, nicht eine gleichzeitig stattfindende Teilung.

**Auftrag:** Zwei Bakterien übertragen durch Kontakt genetisches Material. Was folgt daraus unmittelbar für die Zellzahl?

**Antwort-/Bedienstruktur:**
```json
{
  "options": {
    "a": "Die Zellzahl verdoppelt sich durch den Kontakt.",
    "b": "Die Zellzahl halbiert sich.",
    "c": "Aus dem Informationstransfer allein folgt keine Veränderung der Zellzahl."
  }
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "correct_id": "c",
  "wrong_reasons": {
    "a": "Informationstransfer allein erzeugt keine zusätzlichen Zellen.",
    "b": "Informationstransfer verlangt nicht das Verschmelzen zu einer Zelle."
  }
}
```

**Kriterien-IDs:** E3.03.C01.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Ein Teilprozess wird mit der vollständigen Lebensentstehung oder Vermehrung gleichgesetzt.


## D0 · Standortbestimmung

**Frage:** Welche Grundlagen sind bereits abrufbar?

**Ziel:** Sechs kurze Bereiche prüfen; Empfehlungen statt Note und statt endgültiger Kompetenzdiagnose.

**Bezug:** SFC23 Einstieg–§2; SM D0 S.2. **Vorwissen:** keine zusätzlichen Voraussetzungen.

**Darstellung:** Kurze geschlossene Aufgaben und Selbsteinschätzung.

**Handlung:** Antworten, Unsicherheit angeben, gezielt Grundlagen aufsuchen.

**Hilfe:** Alle Missionen bleiben zugänglich.

**Transfer:** Ergebnisse für die Reihenfolge der Wiederholung verwenden.

**Abnahme:** Kein Benotungs- oder Freischaltzwang; fachliche Unklarheit nicht als Softwarefehler umdeuten.


### D0.01 · Merkmale des Lebendigen

**Format:** `single` · **Denkhandlung:** Diagnose

**Material:** Betrachte eine lebende Zelle und einen wachsenden Kristall.

**Auftrag:** Welche Aussage ist fachlich angemessen?

**Antwort-/Bedienstruktur:**
```json
{
  "options": {
    "a": "Wachstum allein beweist Leben.",
    "b": "Mehrere Merkmale müssen gemeinsam betrachtet werden."
  },
  "confidence_options": [
    "sicher",
    "unsicher",
    "weiß ich noch nicht"
  ]
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "correct_id": "b",
  "wrong_reasons": {
    "a": "Prüfe die zugehörige Grundlage im empfohlenen Modul."
  }
}
```

**Kriterien-IDs:** D0.01.C01.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Ein richtiges Kreuz belegt vollständige Beherrschung.


### D0.02 · Stoffgruppen

**Format:** `single` · **Denkhandlung:** Diagnose

**Material:** Wähle ohne Hilfe die passende Zuordnung. Bei Unsicherheit darfst du dies zusätzlich angeben.

**Auftrag:** Welche Zuordnung stimmt?

**Antwort-/Bedienstruktur:**
```json
{
  "options": {
    "a": "Aminosäurekette → Protein.",
    "b": "Aminosäurekette → Lipid."
  },
  "confidence_options": [
    "sicher",
    "unsicher",
    "weiß ich noch nicht"
  ]
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "correct_id": "a",
  "wrong_reasons": {
    "b": "Prüfe die zugehörige Grundlage im empfohlenen Modul."
  }
}
```

**Kriterien-IDs:** D0.02.C01.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Ein richtiges Kreuz belegt vollständige Beherrschung.


### D0.03 · Zelltheorie

**Format:** `multi` · **Denkhandlung:** Diagnose

**Material:** Wähle alle zutreffenden Kernaussagen. Die Entstehung der allerersten Zellen ist eine gesonderte Frage.

**Auftrag:** Welche drei Aussagen gehören zur Zelltheorie?

**Antwort-/Bedienstruktur:**
```json
{
  "options": {
    "a": "Lebewesen bestehen aus einer oder mehreren Zellen.",
    "b": "Die Zelle ist eine grundlegende Einheit des Lebens.",
    "c": "Heutige Zellen entstehen aus vorhandenen Zellen.",
    "d": "Jede Zelle muss Chloroplasten besitzen.",
    "e": "Nur Tierzellen enthalten Erbinformation."
  },
  "confidence_options": [
    "sicher",
    "unsicher",
    "weiß ich noch nicht"
  ]
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "correct_ids": [
    "a",
    "b",
    "c"
  ],
  "wrong_reasons": {
    "d": "Chloroplasten gehören nicht zu jeder Zelle.",
    "e": "Auch Pflanzenzellen und Procyten enthalten genetische Information."
  }
}
```

**Kriterien-IDs:** D0.03.C01, D0.03.C02, D0.03.C03, D0.03.C04, D0.03.C05.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Ein richtiges Kreuz belegt vollständige Beherrschung.


### D0.04 · Procyte und Eucyte

**Format:** `single` · **Denkhandlung:** Diagnose

**Material:** Vergleiche eine typische bakterielle Zelle mit einer Eucyte.

**Auftrag:** Welche Aussage unterscheidet beide Grundformen?

**Antwort-/Bedienstruktur:**
```json
{
  "options": {
    "a": "Nur Eucyten enthalten DNA.",
    "b": "Eucyten besitzen einen membranumhüllten Zellkern; typische Procyten nicht."
  },
  "confidence_options": [
    "sicher",
    "unsicher",
    "weiß ich noch nicht"
  ]
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "correct_id": "b",
  "wrong_reasons": {
    "a": "Prüfe die zugehörige Grundlage im empfohlenen Modul."
  }
}
```

**Kriterien-IDs:** D0.04.C01.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Ein richtiges Kreuz belegt vollständige Beherrschung.


### D0.05 · Nukleotid

**Format:** `single` · **Denkhandlung:** Diagnose

**Material:** Es geht um einen Grundbaustein, nicht um eine ganze DNA-Kette.

**Auftrag:** Welche Kombination bildet ein DNA-Nukleotid?

**Antwort-/Bedienstruktur:**
```json
{
  "options": {
    "a": "Zucker, Phosphat und Base.",
    "b": "Drei Fettsäuren und Glycerin."
  },
  "confidence_options": [
    "sicher",
    "unsicher",
    "weiß ich noch nicht"
  ]
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "correct_id": "a",
  "wrong_reasons": {
    "b": "Prüfe die zugehörige Grundlage im empfohlenen Modul."
  }
}
```

**Kriterien-IDs:** D0.05.C01.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Ein richtiges Kreuz belegt vollständige Beherrschung.


### D0.06 · Beobachtung und Wissen

**Format:** `single` · **Denkhandlung:** Diagnose

**Material:** Eine Struktur ist im Präparat nicht sicher zu erkennen.

**Auftrag:** Was gehört in eine Beobachtungszeichnung?

**Antwort-/Bedienstruktur:**
```json
{
  "options": {
    "a": "Sie wird trotzdem aus dem Lehrbuch ergänzt.",
    "b": "Nur sicher Beobachtetes wird als Beobachtung eingezeichnet."
  },
  "confidence_options": [
    "sicher",
    "unsicher",
    "weiß ich noch nicht"
  ]
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "correct_id": "b",
  "wrong_reasons": {
    "a": "Prüfe die zugehörige Grundlage im empfohlenen Modul."
  }
}
```

**Kriterien-IDs:** D0.06.C01.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Ein richtiges Kreuz belegt vollständige Beherrschung.


## T · Klausurtraining

**Frage:** Kann ich neue, klar begrenzte Materialien selbstständig auswerten?

**Ziel:** Wissen, Anwendung und selbstständige Prüfung mit neuen Fällen verbinden; Grenzen der automatischen Rückmeldung offenhalten.

**Bezug:** SFC22–24; FA46–47/79–80/84–85; SM AB01–17. **Vorwissen:** Z1–Z4 und M1–M10 je Aufgabensatz.

**Darstellung:** Neue Modelle, Tabellen und Problemlagen; keine Originalklausur.

**Handlung:** Aufgaben in kurzen Sets bearbeiten, erst nach Abgabe auswerten; freiwilliges Schreiben mit Kriterienvergleich separat.

**Hilfe:** Im Üben Hilfen; im Prüfen erst nach Abgabe, ohne echte Prüfungssicherheit zu behaupten.

**Transfer:** Neue Fehleranalyse und Versuchsplanung; Transferanforderung nach vorausgegangener Übung erneut prüfen.

**Abnahme:** Jeder Fall gegen geschützte Klausur auf strukturelle Nähe prüfen; geschlossene Form nicht automatisch als AFB I klassifizieren.


### T.01 · Strukturen und Bedingungen

**Format:** `match` · **Denkhandlung:** Abruf

**Material:** Es werden eine Zellwand, eine Vakuole, ein Tonoplast und Mitochondrien gezeigt; Chloroplasten sind nicht dargestellt.

**Auftrag:** Ordne Struktur und Funktion in einer nicht fotosynthetischen Pflanzenzelle zu.

**Antwort-/Bedienstruktur:**
```json
{}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "pairs": {
    "Zellwand": "mechanische Stabilität",
    "Tonoplast": "selektive Vakuolengrenze",
    "Mitochondrien": "ATP-Bereitstellung",
    "Vakuole": "Speicherraum mit gelösten Stoffen"
  }
}
```

**Kriterien-IDs:** T.01.C01, T.01.C02, T.01.C03, T.01.C04.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Ein Trainingsscore ist eine prognostizierte Klausurnote; verdeckte Clientantworten sind technisch geheim.


### T.02 · Eine Membranaussage prüfen

**Format:** `single` · **Denkhandlung:** Anwendung

**Material:** Ein Ion ist klein und geladen; Sauerstoff ist klein und unpolar. Betrachtet wird zunächst die reine Lipidschicht.

**Auftrag:** Welche Begründung korrigiert die Aussage „kleine Teilchen passieren eine Lipidschicht immer leicht“?

**Antwort-/Bedienstruktur:**
```json
{
  "options": {
    "a": "Die Aussage gilt wegen der geringen Größe ohne Ausnahme.",
    "b": "Ladung und Polarität beeinflussen den Durchtritt zusätzlich zur Größe.",
    "c": "Wasserpumpen entfernen die Ionen."
  }
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "correct_id": "b",
  "wrong_reasons": {
    "a": "Teilchengröße ist nicht das einzige relevante Merkmal.",
    "c": "Eine reine Lipidschicht enthält in diesem Vergleich keine eingebauten Wasserpumpen."
  }
}
```

**Kriterien-IDs:** T.02.C01.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Ein Trainingsscore ist eine prognostizierte Klausurnote; verdeckte Clientantworten sind technisch geheim.


### T.03 · Ein neuer Nettotransport

**Format:** `numeric` · **Denkhandlung:** Anwendung

**Material:** Gleich große Räume, keine Reaktion und kein Verlust.

**Auftrag:** Links liegen 28, rechts 12 Teilchen. Es wechseln 6 nach rechts und 2 zurück. Bestimme den Nettotransport nach rechts und beide Endbestände.

**Antwort-/Bedienstruktur:**
```json
{
  "fields": [
    "net",
    "left",
    "right"
  ],
  "units_preprinted": true
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "fields": {
    "net": {
      "value": 4,
      "unit": "Teilchen",
      "abs_tolerance": 0
    },
    "left": {
      "value": 24,
      "unit": "Teilchen",
      "abs_tolerance": 0
    },
    "right": {
      "value": 16,
      "unit": "Teilchen",
      "abs_tolerance": 0
    }
  }
}
```

**Kriterien-IDs:** T.03.C01, T.03.C02, T.03.C03.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Ein Trainingsscore ist eine prognostizierte Klausurnote; verdeckte Clientantworten sind technisch geheim.


### T.04 · Druck und Konzentration

**Format:** `single` · **Denkhandlung:** Anwendung

**Material:** Wasserpermeable Membran; die Werte enthalten den Konzentrations- und Druckbeitrag bereits.

**Auftrag:** Innen beträgt das Wasserpotenzial −0,15 MPa, außen −0,35 MPa. Welcher anfängliche Nettofluss folgt?

**Antwort-/Bedienstruktur:**
```json
{
  "options": {
    "a": "Nach innen.",
    "b": "Nach außen.",
    "c": "Keiner."
  }
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "correct_id": "b",
  "wrong_reasons": {
    "a": "Das höhere Potenzial liegt innen; Wasser fließt netto zum niedrigeren außen.",
    "c": "Die Potenziale unterscheiden sich."
  }
}
```

**Kriterien-IDs:** T.04.C01.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Ein Trainingsscore ist eine prognostizierte Klausurnote; verdeckte Clientantworten sind technisch geheim.


### T.05 · Eine Messänderung

**Format:** `numeric` · **Denkhandlung:** Anwendung

**Material:** Formel: 100 × (Endmasse − Anfangsmasse) / Anfangsmasse. Negative Änderung ist keine negative Endmasse.

**Auftrag:** Eine Probe verändert ihre Masse von 5,00 g auf 4,65 g. Berechne die relative Änderung in Prozent.

**Antwort-/Bedienstruktur:**
```json
{
  "fields": [
    "number"
  ],
  "unit": "%"
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "value": -7,
  "unit": "%",
  "abs_tolerance": 0.05,
  "unit_preprinted": true
}
```

**Kriterien-IDs:** T.05.C01, T.05.C02.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Ein Trainingsscore ist eine prognostizierte Klausurnote; verdeckte Clientantworten sind technisch geheim.


### T.06 · Die untersuchte Markierung

**Format:** `single` · **Denkhandlung:** Anwendung

**Material:** Nur Lipide sind markiert. Nach lokalem Bleichen nimmt die Fluoreszenz im Bereich wieder zu, bei unveränderter Aufnahme und ohne Neusynthese.

**Auftrag:** Welche Aussage ist aus dem Befund gedeckt?

**Antwort-/Bedienstruktur:**
```json
{
  "options": {
    "a": "Alle Proteine bewegen sich jederzeit gleich schnell.",
    "b": "Die gebleichten Moleküle müssen neu synthetisiert worden sein.",
    "c": "Der Befund stützt einen seitlichen Austausch markierter Lipide."
  }
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "correct_id": "c",
  "wrong_reasons": {
    "a": "Die Bewegung aller Proteine wurde nicht gemessen.",
    "b": "Lipide können seitlich aus benachbarten Bereichen in den betrachteten Bereich gelangen."
  }
}
```

**Kriterien-IDs:** T.06.C01.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Ein Trainingsscore ist eine prognostizierte Klausurnote; verdeckte Clientantworten sind technisch geheim.


### T.07 · Eine alternative Erklärung prüfen

**Format:** `experiment` · **Denkhandlung:** Transferkandidat; AFB erst nach tatsächlicher Vorbereitung festlegen

**Material:** Verfügbar sind: erneute Aufnahmen mit unveränderter Kameraverstärkung; eine ungebleichte Referenzregion in derselben Membran; ein gleichartig fluoreszierender unbeweglicher Referenzstandard; Wiederholungen. Helligkeitswerte sind nur bei vergleichbarer Aufnahme direkt vergleichbar. Die Fluoreszenz soll Lipidbeweglichkeit anzeigen.

**Auftrag:** Nach dem Bleichen wird eine Region heller. Zwischen den Bildern wurde jedoch die Kameraverstärkung erhöht. Wähle einen Untersuchungsplan, der diese Alternativerklärung prüft.

**Antwort-/Bedienstruktur:**
```json
{
  "design_families": [
    "fixed_acquisition",
    "reference_standard"
  ],
  "select_conditions": true,
  "prediction_choices": [
    "regionsspezifischer Anstieg relativ zu stabiler Referenz",
    "jede Helligkeitszunahme beweist Transport"
  ],
  "bounded_reason": "eine Schlussfolgerung aus vorgegebenen Kausalkarten zusammensetzen"
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "valid_design_families": [
    {
      "id": "fixed_acquisition",
      "required": [
        "erneut mit fester Verstärkung messen",
        "gebleichte und ungebleichte Region vergleichen",
        "gleiche Beleuchtung und Zeitabstände",
        "Wiederholungen"
      ],
      "prediction": "Spezifische Erholung der gebleichten Region bei stabiler Referenz stützt lateralen Austausch."
    },
    {
      "id": "reference_standard",
      "required": [
        "gebleichte Region und unbeweglichen Standard unter derselben Aufnahme erfassen",
        "Verstärkung dokumentieren",
        "relative Änderung zur Referenz bestimmen",
        "Wiederholungen"
      ],
      "prediction": "Eine reine gemeinsame Helligkeitssteigerung genügt nicht; ein über die Referenz hinausgehender regionsspezifischer Anstieg ist nötig."
    }
  ],
  "reject": [
    "nur Endbilder mit unterschiedlicher Verstärkung vergleichen",
    "Helligkeitsanstieg ungeprüft vollständig Lipidbewegung zuschreiben"
  ]
}
```

**Kriterien-IDs:** T.07.C01, T.07.C02, T.07.C03, T.07.C04.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Ein Trainingsscore ist eine prognostizierte Klausurnote; verdeckte Clientantworten sind technisch geheim.


### T.08 · Ein fehlerhaftes Diffusionsmodell reparieren

**Format:** `experiment` · **Denkhandlung:** Transferkandidat; AFB erst nach tatsächlicher Vorbereitung festlegen

**Material:** Beide Räume enthalten dieselbe Teilchenart. Konzentration = Anzahl/Volumen. Es gibt keine Reaktion. Die Regel des Entwicklers lautet: „Gleiche Zahlen bedeuten Gleichgewicht.“ Eine korrekturfreie Alternative darf auch den Gültigkeitsbereich des Modells einschränken.

**Auftrag:** Ein Modell mit Raumvolumina 2 und 1 stoppt, sobald auf jeder Seite 12 Teilchen liegen. Prüfe die Gleichgewichtsbehauptung und wähle eine passende Korrektur.

**Antwort-/Bedienstruktur:**
```json
{
  "fields": [
    "concentration_left",
    "concentration_right",
    "equilibrium_left",
    "equilibrium_right",
    "repair",
    "motion"
  ],
  "numeric_expected": [
    6,
    12,
    16,
    8
  ],
  "repair_choices": [
    "volumenabhängige Übergangsraten",
    "Gültigkeit auf gleiche Volumina beschränken",
    "gleiche Zahl unabhängig vom Volumen erzwingen"
  ],
  "motion_choices": [
    "weiterer Austausch",
    "alle Teilchen anhalten"
  ]
}
```

**Erwartung, Kriterien und konkrete Fehlergründe:**
```json
{
  "criteria": [
    "Konzentrationen sind 6 und 12 Teilchen pro Volumeneinheit, also ungleich",
    "bei Gesamtzahl 24 gehören für gleiche Konzentration 16 nach links und 8 nach rechts",
    "entweder Übergangsregel volumenabhängig gestalten oder Modell ausdrücklich auf gleiche Raumvolumina beschränken",
    "Teilchen dürfen auch im Gleichgewicht weiter wechseln"
  ],
  "valid_repairs": [
    "volumenabhängige Übergangsraten; kein Stoppen der Einzelbewegung",
    "gleiche Volumina als Gültigkeitsbedingung; kein Stoppen der Einzelbewegung"
  ]
}
```

**Kriterien-IDs:** T.08.C01, T.08.C02, T.08.C03, T.08.C04.

**Hilfen:** 1. Prüfe zuerst die im Material festgelegten Bedingungen. 2. Vergleiche deine Antwort mit dem betroffenen Merkmal oder der einzelnen Beziehung, nicht nur mit einem Fachwort. 3. Vergleichslösung aus der Erwartung; Nutzung als Lösung angesehen dokumentieren.

**Fehlvorstellung:** Ein Trainingsscore ist eine prognostizierte Klausurnote; verdeckte Clientantworten sind technisch geheim.
