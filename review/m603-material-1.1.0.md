# M6.03 – qualitative Materialpräzisierung 1.1.0 (P03b-R1)

01.11.2026, vor der R1-Implementierung festgelegt. Ausgangscommit
`c78afaf9219a68e7996877bb512ff6833e6f821a`, Baum
`09ffa30d8249fb5860ff4daf6cf08f6fb1b158a5`. Autorisierung: P03b-R1.
Grundlage: AGENTS, A §§3,6–8, B/BM04, C §§2–6, D/P03, E §§6–11,
F/M6.02–.03, eingefrorene spec/tasks.json sowie beide bisherigen M6.03-Reviews.
Das externe Gegenprüfungs-ZIP ist hier nicht vorhanden. Seine im Auftrag
beschriebenen Befunde werden selbst reproduziert; fremde Fallzahlen sind kein
eigener Prüfnachweis und werden nicht als eigene Tests ausgegeben.

## Begründete biologische Änderung

Die bisherigen Materialien bestimmten Gesamtwasserpotenziale und Wasserverlust,
aber keinen anfänglich positiven Turgor. Wasserverlust allein begründet kein
weiteres Sinken eines bereits vollständig verlorenen Turgors. Für die bewertete
Beziehung A→C muss deshalb ausdrücklich **zu Beginn noch positiver Turgor**
gelten. Betrachtet wird die Abnahme vor beziehungsweise bis zum vollständigen
Turgorverlust. Ein Erreichen von null oder spätere Ablösung wird nicht simuliert
oder garantiert.

Eine qualitative Ergänzung genügt. Die drei Gesamtwasserpotenziale einschließlich
Druck lassen ohne getrennte Druck-/Solutbeiträge keinen absoluten Turgorwert
berechnen. Keine zusätzlichen Druckzahlen, keine neue Bilanz- oder Zeitsimulation.
Beide bisherigen Zahlenfälle bleiben unverändert. Sie sind Wiederholungen.

B und C bleiben gekoppelte Folgen ohne vorgeschriebene strikte Zeitfolge.
Vollständiger Turgorverlust und hinreichender weiterer Wasserverlust sind gemeinsam
Bedingungen einer **möglichen** Ablösung; null allein genügt nicht. D bleibt eine
Möglichkeit, keine Beobachtung oder Garantie. Die Wand bleibt vergleichsweise
formstabil. Die freie eigene Erklärung bleibt unbewertet.

## Versionen und Bindung

- Antwort-/Bewertungsvertrag **m603-causal-map/1.0.1 unverändert**; gleiche vier
  Pflichtkanten, optionale Beziehungen, Statusregeln und Rubrikversion.
- Aufgabe `M6.03@causal-map-2`.
- Inhalt `zelllabor11.m603-content/1.1.0`.
- Statisches Erklärungsmodell `m603-static-explanation/1.1.0`.
- Material `m603-water-loss-material/1.1.0`, Seeds `<caseId>/1.1.0`.
- Neue qualitative Pflichtfelder: `initialTurgor: positive` und
  `consideredTurgorPhase: before_or_until_complete_loss`.

Die historische Vertragsdatei wird vor Aktualisierung unverändert als
`contracts/m603-causal-map.material-1.0.0.json` gesichert. Historische Reviews,
Sollfälle, geschützte Konzepte und spec/tasks.json bleiben erhalten. Der neue
Materialvertrag ist `contracts/m603-material-1.1.0.json`.

Versionen, vollständiges Material und Seed gehen in den bestehenden TaskContext-
Hash ein. Alte oder lediglich umetikettierte Kontexte und Ergebnisse dürfen keinen
aktuellen Beleg ergeben. Hilfen bleiben konservativ zugeordnet; ein Versionswechsel
stellt keine gesicherte Eigenständigkeit wieder her. Keine Fortschrittspersistenz
oder Erweiterung der acht vorhandenen Metadaten. M6.02 bleibt unverändert.

## Vorab-Sollfälle für die Ergänzung

| Fall | Erwartung |
|---|---|
| Beide neuen Materialien, qualitative Anfangsbedingung vollständig | bisherige 49 Antwort-Sollfälle mit unveränderten Statuswerten |
| Bisheriges Material mit historischen Versionen/Seed | technical; kein aktueller Beleg |
| Alte Daten mit neuen Versionsetiketten und neu berechnetem Hash | technical; qualitative Bedingung fehlt |
| Neuer Kontext ohne initialTurgor, mit null/negativ/unknown oder erfundener Druckzahl | technical; außerhalb des freigegebenen Materials |
| Betrachtung nach bereits vollständigem Verlust | technical; A→C wäre nicht unverändert begründet |
| Falscher Hash oder alter Seed | technical |
| Wasserpotenziale unverändert, qualitative Ergänzung gültig | gleiche Flussrichtung; keine Ableitung eines absoluten Turgors |
| Altes, kopiertes oder kontextfremdes Ergebnis | kein aktueller Erfolgsbeleg |

## Grafik- und Lesbarkeitsvertrag für R1

Alle Pfade/Pfeilspitzen werden vor sämtlichen Nummernhintergründen/Ziffern
gemalt. Die Abnahme prüft DOM-Malreihenfolge **und tatsächliche Rasterpixel**
in den Nummernhintergründen bei allen sieben zulässigen Beziehungen, beiden
Kartenlagen und 100/200 % Schrift. Nummernmittelpunkte allein reichen nicht.

Wenn zwei Textspalten keine vollständigen Fachwörter aufnehmen können, erhalten
die vier Aussagen die volle verfügbare Breite. Eine separate kompakte Netzzeichnung
mit denselben Buchstaben/IDs zeigt die gewählten Pfeile. Zwischen gestapelten
Aussagen werden keine zeitlichen Folgepfeile ergänzt. Die editierbare vollständige
HTML-Verbindungsliste bleibt erhalten. Schrift wird nicht verkleinert; keine
Kanten werden entfernt und das Limit von 24 wird nicht gesenkt.

Geprüft werden tatsächliche Wortrechtecke, vollständige Texte, natürliche
Kartenhöhen, unbedeckte Zahlen, Pfeilspitzen, Gegenrichtungen, Tastatur und Touch
bei 390/820/1440 px und beiden Schriftgrößen. Zusätzlich vollständige bestehende
Regression mit zwei Workern, bisherigen Timeouts und null Retries.

AGENTS/A–F beziehen sich weiterhin auf 22.10.2026. Private Fassungen vom
26./27.10.2026 waren nicht verfügbar und wurden nicht gelesen. Eine spätere
Quellenrevision ist ein eigener Auftrag. Keine Unterrichtsfreigabe, kein Merge,
Deployment, M6.04 oder weitere Mission.
