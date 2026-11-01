# P03a Abschluss – G01, G02 und G03

Ausgang: `b791f25549add0bb296f38a5ed30594e0d0af7d1`, bestehender Branch
`feature/p03a-lernzyklus`. Auftrag vom 28.10.2026. Das im Auftrag erwähnte neue
R10-ZIP wurde hier nicht mitgeliefert. Die konkret beschriebenen Befunde wurden
am tatsächlichen normalen Schülerweg überprüft. Die frühere allgemeine
Fachprüfung ist keine Gegenprüfung dieser neuen Oberfläche.

## Ursachen und gezielte Änderungen

- **G01:** Die Vorwissensauswahl hatte keinen Änderungslistener; der angezeigte
  Text gehörte deshalb weiterhin zur vorherigen Auswahl. Jede der drei Auswahlen
  setzt nun nur ihre eigene Rückmeldung auf neutral/erneut prüfen. Eine lokale
  Live-Region und `aria-describedby` ordnen die Meldung dem fokussierten Feld zu.
  Ausdrücklich aufgerufene Erklärungen bleiben in der bestehenden Hilfehistorie.
- **G02:** Bei vollständigem aktuellem Erfolg zeigt die Ansicht genau einen
  nächsten Lernschritt: eine eigene biologische Erklärung. Bestätigt sind
  Fachbegriff, Nettorichtung und Vakuolenvolumen, keine Klausurreife oder
  Kausalerklärung. Die Feldbegründungen bleiben aufklappbar; gegenseitige
  Prüfaufforderungen entfallen bei vollständigem Erfolg in der Darstellung.
  Bei allen anderen Ergebnissen bleiben die konkreten Verbesserungshinweise.
- **G03:** Der bisherige 800-px-Breakpoint ließ 820-px-Tablets in schmalen
  Spalten. Bis 1000 px wird jetzt eine volle Antwortspalte verwendet; auf breiten
  Tablets können Grafik und HTML-Grenzlegende nebeneinander stehen. Zellwand,
  Zellmembran und Tonoplast sind zusätzlich in normal skalierendem HTML benannt;
  die Tabelle ordnet Vakuole, Cytosol und Außenraum lesbare Pa-Werte zu.
  Zahlengliederung ändert nur die Darstellung, keine Kontextwerte. Kurze
  Sprunglinks verbinden Material und Eingabe mit Fokusübernahme ohne Routenwechsel.
  Kürzere Bedienhinweise und Buttons (weiterhin eindeutige zugängliche Namen),
  aufklappbare Speicherdetails und weniger Abstände reduzieren Wiederholungen.
  Bedingungen und Modellgrenzen bleiben sichtbar.
- **Heft:** Vier freiwillige Selbst-/Partnerprüfpunkte fragen nach Potenzialen
  mit Zahlen/Pa/Druck, beiden Membranwegen, begründeter Wasserbilanz und
  Volumenfolge sowie Zellwand und Aussagegrenzen. Kein Häkchen bewertet einen
  Hefttext oder erzeugt einen Beleg. Es gibt keine Rohtextspeicherung. Der
  Selbstlernmodus bleibt freiwillig; Unterrichtsverbindlichkeit legt die
  Lehrkraft fest. Die bewusst abrufbare Beispiellösung bleibt nachgelagerte Hilfe.
- **Hilfe nach Erfolg:** Ein älteres richtiges Ergebnis wird bei neuer Hilfe
  weiterhin als veraltet behandelt. Die neutrale Meldung erklärt nun ausdrücklich
  den damaligen richtigen Befund, die spätere Unterstützung und die notwendige
  neue Einreichung. Kein alter Beleg wird gelöscht, verändert oder umetikettiert.

Korrektor, fachliche Gründe, Ergebnisobjekte, Session-, Kontext-, Hilfe- und
Speicherverträge sind unverändert. Nur autorisierte Lernansicht/Diagrammbeschriftung,
Tests und Dokumentation wurden angepasst; keine weitere Mission oder Simulation.

## Gemessene Höhen im echten Produktions-Preview

Gemessen mit System-Chromium154 auf Linux; drei frische Browserkontexte mit
390×844, 820×1180 und 1440×1000. Gleiches Skript, gleicher öffentlicher Einstieg,
identische Antworten und Hilfeaktionen vorher/nachher. CSS-Pixel, auf volle Pixel
gerundet; kein allgemeiner Leistungs-/Lesbarkeitsnachweis. Rohdaten enthalten
alle Abschnittshöhen auch bei 200 % Textvergrößerung und liegen im Nachweispaket.

| Breite | Zustand | Seite vorher | Seite nachher |
|---|---|---:|---:|
| 390 | initial | 6503 | 6154 |
| 390 | correct | 7660 | 6760 |
| 390 | wrong | 7583 | 7235 |
| 390 | help | 6750 | 6402 |
| 820 | initial | 4153 | 4639 |
| 820 | correct | 5232 | 5067 |
| 820 | wrong | 5135 | 5449 |
| 820 | help | 4400 | 4787 |
| 1440 | initial | 3783 | 3683 |
| 1440 | correct | 4669 | 4136 |
| 1440 | wrong | 4593 | 4493 |
| 1440 | help | 3931 | 3831 |

Die höhere Tablet-Seite in einzelnen Zuständen ist die beabsichtigte Folge
der breiten Einspaltenansicht; sie wird nicht als Höhenreduktion ausgegeben.
Auf dem Smartphone sinkt die initiale Seite um 349 px, der Erfolgszustand um
900 px. Mehr Lesbarkeit hat Vorrang vor einer möglichst kurzen Seite.

Initiale Abschnittshöhen, jeweils vorher → nachher:

| Breite | Material | Eingabe | Feedback | Hilfen | Lernstand | Heft |
|---|---|---|---|---|---|---|
| 390 | 1274 → 1563 | 1022 → 993 | 138 → 138 | 857 → 503 | 629 → 315 | 479 → 619 |
| 820 | 1296 → 1095 | 955 → 800 | 149 → 125 | 728 → 416 | 418 → 267 | 330 → 417 |
| 1440 | 1226 → 1463 | 846 → 866 | 124 → 124 | 542 → 488 | 418 → 278 | 307 → 405 |

## Prüfung und Grenzen

G01 wurde vor dem Patch mit drei fehlgeschlagenen Desktoptests reproduziert;
Erstlog und Browserartefakte werden erhalten. Danach prüfen die neuen Tests für
jede Frage richtig → falsch, falsch → richtig und Auswahl → leer mit erneuter
Prüfung, Fokus, Live-Meldung und erhaltener Hilfehistorie. Die übrigen neuen Tests
prüfen vollständigen Erfolg, beide Hilfepfade nach Erfolg, den unbenoteten Heftbogen,
Tabletspalten, Legende, Pa-Gliederung, Sprunglinks und 200 % Textgröße.

Acht neue Browserfälle auf drei Profilen ergeben 24 zusätzliche Prüfungen. Alle
528 bisherigen Prüfungen bleiben erhalten: 552 je vollständiger Engine-Suite.
Bestehende numerische Kontext-Sollwerte bleiben unverändert; zwei SVG-Texttests
prüfen jetzt ausdrücklich dieselben Zahlen mit deutscher Zahlengliederung.
Keine Timeout-, Retry-, Skip- oder Sollstatusänderung. Eigene Prüfungen sind keine
unabhängige Abnahme. Exakte Endcommit-/Umgebungs-/Befehls-/Fallzahlnachweise,
Erstfehler, Wiederholungen und Screenshots stehen im mitgelieferten Abschlussbericht.

Aktuelle WebKit-Ausführung und CI am neuen Commit sind nur bei tatsächlich
verfügbarer Umgebung belegt. Frühere externe WebKit-Erfolge gelten nicht für
diesen neuen Stand. Echte iPad-/Safari-Hardware mit Bildschirmtastatur, Rotation
und Hintergrundwechsel, Screenreader-Nutzerprobe und Lerngruppenpilot bleiben
ohne Durchführung offen. Keine Unterrichtsfreigabe, kein Merge, kein Deployment.
Anschlussentwicklung nur nach gesondertem Auftrag gemäß
[P03a-Folgebacklog.md](P03a-Folgebacklog.md).
