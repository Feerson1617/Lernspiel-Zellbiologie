# Zelllabor 11 · Konzeptionspaket 1.0

**Stand 22. Oktober 2026**

Dieses Paket ist die fachliche, didaktische und technische Arbeitsgrundlage für die spätere schrittweise Umsetzung. **Es ist kein fertiges Lernspiel.** Originale Unterrichts- und Klausurdateien wurden nicht verändert und nicht in dieses Paket kopiert.

## Ergebnis in Zahlen

14 Kernmissionen in zwei Themenbereichen; zusätzlich Diagnose, drei Grundlagenmodule und Klausurtraining. 79 vollständig ausformulierte Aufgabenentwürfe: 56 Kern-, 9 Ergänzungs-, 6 Diagnose- und 8 Trainingsaufgaben. Die Aufgaben enthalten 219 redaktionelle Bewertungskriterien. Zehn Aufgabenformate, sieben eng begrenzte Textfelder, 137 konkrete Antwort-/Grenzfälle und 20 rechnerische Modellreferenzen sind vorbereitet.

Die Zahlen beschreiben **Spezifikationen**, keine bereits programmierten oder unterrichtlich erprobten Funktionen. Die sieben Textfelder verteilen sich auf fünf Aufgaben; die Plasmolyseaufgabe enthält drei getrennte Felder. Mehr Freitext kommt erst nach nachgewiesener Korrekturqualität hinzu.

## Lesereihenfolge

| Datei | Zweck |
|---|---|
| `A_Fach_Didaktik.md` | Gesamtkonzept, vollständiger Inhaltsabgleich, Lernprogression und Grenzen |
| `B_Technik_Modelle.md` | Softwaremodule, 3D-/2D-Konzept, sieben Fachmodellverträge, Speicherung und Veröffentlichung |
| `C_Feedback_Pruefung.md` | maßgebliche Korrekturregeln, zwei ausführliche Beispiele, Freigabemaßstäbe und unabhängige Prüfung |
| `D_Entwicklungsroadmap.md` | P00–P13 mit Abhängigkeiten, Nachweisen und Freigaben |
| `E_Codex_Masterauftrag.md` | konsolidierter Gesamtvertrag zur späteren Zerlegung; nicht als Komplettauftrag ausführen |
| `F_Aufgabenkatalog.md` | alle 79 Fragen mit Material, Antwortmöglichkeiten, Erwartung, Hilfen und Kriterien |
| `AGENTS.md` | dauerhaft geltende Regeln für jeden Implementierungs- und Prüfauftrag |
| `spec/` | maschinenlesbare Missions-/Aufgabendaten, Rubriken, Prüffälle, Schemata, Schnittstellen und Asset-Briefs |
| `QA/` | Quellen/Zugriffe, Anforderungsmatrix, tatsächliche Konzeptprüfung und offen gebliebene Produktprüfungen |

## Maßgebliche Entscheidungen

Fachlichkeit und verlässliche Rückmeldung gehen vor Aufgabenoffenheit. Ein korrektes Fachwort wird trotz Tippfehlern anerkannt, soweit die Bedeutung eindeutig ist. Vorsichtige Formulierungen wie „Vielleicht Tonoplast?“ werden nicht für mangelnde Selbstsicherheit abgewertet. Unbekannte Bedeutungen oder relevante ungeprüfte Zusätze führen zu Klärung, nicht zu erfundener Zustimmung oder Ablehnung.

Fachliches Ergebnis, Vollständigkeit und Unterstützung sind getrennt. Grün bedeutet nicht automatisch „ohne Hilfe beherrscht“. Wiederholte gelbe Rückfragen bei üblichen richtigen Formulierungen verhindern ebenso die Freigabe einer ungeeigneten Aufgabe wie bekannte kritische Falschbewertungen.

Die Lernreihenfolge bleibt Zellorganellen → Kompartimente/Endosymbiose → Membranen → Diffusion → Osmose → Plasmolyse → weitere Transportwege/Regulation. Die technische Entwicklung beginnt dennoch mit Feedback und zwei vollständigen Beispielmissionen Z1 und M6, nicht mit allen Grafiken gleichzeitig.

## Nächster Arbeitsauftrag

Das nächste Modell soll A–F und AGENTS gegenprüfen und E anhand D in kleine Codex-Aufträge zerlegen. Zunächst P00/P01 vorbereiten: tatsächliches neues Repository bestimmen, Schutzprüfung und Projektgerüst, dann stabile Aufgaben-/Kontextverträge. Kein erneutes Erfinden des gesamten Spiels, kein stilles Auslassen der Quellen- oder Korrekturregeln.

Die nachfolgenden Prüfaufträge erzeugen eigene zusätzliche Fälle aus den Originalmaterialien. Sie dürfen diesen Konzeptbericht nicht als Nachweis bereits bestandener Spieltests behandeln. Das Unterrichts-Gesamtpaket mit Originalklausur darf niemals pauschal in ein öffentliches Repository hochgeladen werden.

## Reproduzierbare Konzeptprüfung

Für den späteren technischen Bearbeiter, nicht als notwendiger Terminalschritt für die Lehrkraft:

```sh
python tools/check_spec.py
```

Benötigt Python ≥3.10 und das Paket `jsonschema`; ein vorhandener `tsc` prüft zusätzlich `spec/contracts.d.ts`. Der Prüflauf kontrolliert Konzeptdaten und Referenzarithmetik. Er implementiert oder testet **keine** Antwortinterpretation des späteren Spiels. Tatsächlich ausgeführte Ergebnisse stehen in `QA/Konzeptpruefung.json` und `QA/Pruefstatus.md`.

Freigaben für Unterricht und Zielgeräte bleiben bis zur Implementierung, getrennten Gegenprüfung und Erprobung ausstehend.
