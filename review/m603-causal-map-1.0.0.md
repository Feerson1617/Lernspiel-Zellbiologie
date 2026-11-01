# M6.03 – Kausalnetz 1.0.0

Am 01.11.2026 **vor der Implementierung** festgelegt, auf Main
`61b788469f28d6356a0de3fe9ee8bc450b6f8664`. Autorisierung: P03b-Auftrag.
Grundlage: AGENTS, A §§3,6–8, B §§2–4,8,13–14, C §§2–6,8–11,
D/P03, E §§6–11, F/M6.02–.04, spec/tasks.json und spec/missions.json,
P03a-Abschluss-R10 und P03a-Folgebacklog. Eigene Prüfung ist keine
unabhängige Gegenprüfung oder Unterrichtsfreigabe.

## Fachliche Präzisierung gegenüber dem eingefrorenen Entwurf

Der historische Entwurf in F/spec nennt A→B und A→C („führt zu“), B→D
(„bei ausreichendem Ausmaß“) und C→D („nach Verlust des Wanddrucks“).
Er lässt offen, ob eine einzelne Bedingung bereits Ablösung bestätigt.
**Diese Auslegung ist nicht zulässig.** Der vorliegende versionierte Vertrag
präzisiert ausschließlich M6.03. Die geschützten Konzeptdateien und der
M6.02-Vertrag bleiben als Quellenstand erhalten; dies ist eine ausdrückliche
Ergänzung, keine stille Änderung ihrer historischen Sollwerte.

- A: Wasserverlust; B: abnehmendes Vakuolen-/Protoplastvolumen;
  C: sinkender Turgor; D: bei hinreichendem Wasserverlust **mögliche** Ablösung
  des Protoplasten von der Zellwand.
- Intakte Zwiebel-Epidermiszelle, frühe Wasserverlustphase. Wasser kann
  Zellmembran und Tonoplast passieren; Saccharose bleibt weitgehend außen.
  Keine weiteren Transporte. Gegebene Gesamtwasserpotenziale enthalten Druck:
  Vakuole −120000 Pa > Cytosol −300000 Pa > Außenraum −700000 Pa.
  Ein zweiter öffentlicher Fall wiederholt denselben Beziehungstyp mit
  −200000 > −450000 > −900000 Pa. Keine Zeitintegration oder neue Simulation.
- Osmotischer Wassertransport ist passiv; Richtung aus den Gesamtpotenzialen,
  keine Pumpe oder Absicht. Wasserbilanz verändert Vakuolenvolumen. Turgor
  nimmt bei Wasserverlust ab. Volumen und Druck hängen zusammen; B und C
  müssen nicht in eine strikte zeitliche Reihenfolge gebracht werden.
- Für D sind **vollständiger Turgorverlust und hinreichender weiterer
  Wasserverlust/Volumenrückgang gemeinsam** zu berücksichtigen. Bereits eine
  anfängliche Abnahme von B oder C beweist keine sichtbare Ablösung. Auch das
  gemeinsame Bedingungspaar ist keine Beobachtung oder Garantie: reale
  Adhäsion, Geometrie und zeitlicher Verlauf werden nicht berechnet.
  Die Zellwand bleibt vergleichsweise formstabil.

## Endliche Antwort und Bewertung

Technischer Antwortvertrag: contracts/m603-causal-map.json. Semantische IDs
statt Koordinaten; gerichtete Kanten `{from,to,relation}` und optionale
ausdrücklich ausgewählte `claims`. Keine freien Texte im Prüfer. Reihenfolge
der Kanten/Claims, Layout und räumliche Position sind bedeutungslos.

| Kriterium | Notwendige Kante | Bedeutung |
|---|---|---|
| M6.03.C01 | A→B / causes | Wasserverlust führt zur Volumenabnahme |
| M6.03.C02 | A→C / causes | Wasserverlust führt zur Turgorabnahme |
| M6.03.C03 | B→D / enables_if | Weitere hinreichende Volumenabnahme kann Ablösung ermöglichen; nur gemeinsam mit vollständigem Turgorverlust |
| M6.03.C04 | C→D / requires_zero | Vollständiger Turgorverlust ist notwendig, allein nicht hinreichend |

Eine einzelne passende D-Kante wird als richtige **Teilbeziehung** erklärt;
ihr Kriterium bleibt partial, solange die zweite fehlt. D wird immer als
Möglichkeit bezeichnet, niemals als bereits beobachtete Plasmolyse.

Zulässige zusätzliche Beziehungen: B↔C jeweils `coupled` (Zusammenhang ohne
strikte Zeitfolge), A→D / `possible_together` als ausdrücklich konditionale
Zusammenfassung. Beide optionalen B/C-Richtungen sind gleichwertig.
Sie ersetzen keine der vier verlangten differenzierten Beziehungen.

Sicher falsch: umgekehrte Kernpfeile (die behauptete Erklärung kehrt die im
Material vorgegebene Richtung um), `prevents` auf Kernpaaren,
unkonditionales `causes` nach D, `strictly_before` zwischen B und C sowie
falsche Typen auf Kernpaaren. Insbesondere ist „sinkt“ nicht „vollständig
verloren“. Sonstige bekannte Knoten-/Typkombinationen werden als außerhalb
dieses begrenzten Vertrags **clarify** behandelt, nicht erfunden rot.
`causes` zwischen B und C ist wegen realer Druck-Volumen-Kopplung ebenfalls
clarify; es wird keine falsche Unabhängigkeit behauptet.

Exakte Doppelkanten/-claims: gelber Hinweis, einmalige Anerkennung, kein
Gesamtgrün bis zur Bereinigung. Verschiedene Kanten desselben Paares werden
einzeln geprüft; richtige und gegenteilige Beziehung ergeben Widerspruch/rot.
Unbekannte IDs/Struktur, zusätzliche technische Felder, dünne Arrays,
Zugriffseigenschaften oder >24 Kanten/>8 Claims: technical/gelb, kein
fachliches Urteil oder Präfixabschneiden. Leere gültige Antwort: neutral.

Optionale sichere Claims: formstabile Wand, passiver Potenzialtransport.
Sicher falsche Claims: mitgeschrumpfte Wand, bereits sichtbare Plasmolyse allein
aus anfänglicher Volumenabnahme, aktive Wasserpumpe, absichtlicher Wasserverlust,
universelle Richtung allein aus Stoffkonzentration. Unbekanntes ist technical.
Priorität: ungültiger Kontext/Antwort → technical; sicherer Fehler → incorrect;
ungeklärte Kante/Duplikat → clarify; leer → empty; alle Kriterien → correct;
sonst partial. Richtige Teile bleiben einzeln sichtbar. Symbol/Text/Farbe immer
gemeinsam. Jeder rote Befund nennt ausgewählte IDs und konkreten Gegenbeleg.

## Lernhandlung, Hilfen, Text und aktuelle Belege

Leere Ausgangsantwort, kein vorgezeichnetes Netz. Start/Ziel/Typ auswählen,
hinzufügen, bearbeiten/entfernen, prüfen, selbst verbessern. SVG und HTML-Liste
zeigen dieselben IDs; alternative Knotenlage ändert keine Bewertung.
Maus/Touch/Tastatur nutzen dieselben nativen Formulare. Pfeilspitze, Buchstaben,
Kantennummer und Bedeutung erklären Richtung ohne Farbe.

Drei Hilfestufen pro Schwerpunkt Wasserbilanz / Turgor / Ablösung:
kurzer fachlicher Impuls; strukturierender Verbindungshinweis; ausdrücklich
aufgerufene begründete Vergleichslösung. Die erste Hilfe nennt kein komplettes
Netz. Keine Hilfe fügt Kanten ein. Lösung ausdrücklich als angesehen erfassen.
Ereignisse enthalten Aufgabe, Kontext, Quelle und Stufe; monotone Hilfehistorie
auch nach Rückkehr zu einem Fall und über Navigationswechsel. Neuer Fall ist
Wiederholung, kein Transfernachweis. Reload: frühere Hilfehistorie unbekannt.

Nur der unveränderte, aktuelle, vom eigenen Controller ausgegebene Ergebnis-
Gegenstand kann einen flüchtigen Erfolgsbeleg erzeugen. Kontext-, Antwort- oder
Hilfewechsel invalidieren ihn. Kopierte/manipulierte, alte oder fremde Ergebnisse
werden abgelehnt. Idempotente Abgabe ohne Änderung erzeugt keinen neuen Beleg.
Die acht Fortschrittsfelder enthalten keinen Kontext-/Antwort-/Hilfehash;
M6.03 speichert deshalb **überhaupt keinen** dauerhaften Fortschritt. Vorhandene
M6.02-Daten bleiben unberührt. Reload rekonstruiert keinen Erfolgsbeleg.

Nach Erfolg: „Erkläre den Zusammenhang in eigenen Worten“, zwei bis vier
zusammenhängende Sätze im Heft oder flüchtigen Arbeitsbereich. Vier Kriterien:
Potenziale mit Druck; beide Membranen; Wasserbilanz/Volumen/Turgor; mögliche
Ablösung/formstabile Wand/Modellgrenzen. Keine automatische Textbewertung,
Note, Klausurprognose, Telemetrie oder Rohtextpersistenz. Eigener Text ist
ausdrücklich außerhalb der bewerteten Netzeinreichung; Häkchen zertifizieren ihn
nicht. M6.02→M6.03 und separater Startseitenzugang ohne Bearbeitungssperre.

## Quellenabweichung und Umfang

AGENTS/A beziehen sich auf Unterricht vom 22.10.2026 und 17 Kernstunden.
Der Auftrag übermittelt Hinweise auf eine private Klausurfassung vom 26.10.
und Unterrichtsplanung vom 27.10.2026. Diese privaten Dateien sind hier nicht
verfügbar und wurden nicht gelesen. Verbindliche Stundenfassung (13–16/17),
AFB- und Klausurzuordnung bleiben mit der Lehrkraft abzustimmen. Keine
Curriculumrevision oder Kopie geschützter Prüfungslogik. Nur allgemeine
Fachkompetenzen und neu verfasste Materialien. M6 bleibt unvollständig;
M6.04, Rücktausch/Deplasmolyse, Schäden, Dynamik und P04–P06 sind Folgeaufträge.

Vorab-Sollfälle in tests/fixtures/m603-cases.json: vollständig/teilweise,
beide D-Einzelbedingungen, Umkehrung, falscher Typ, Widerspruch, Duplikat,
Zusatz, Layout-/Reihenfolgenäquivalenz, leer/ungültig. Spätere ergänzende
Implementierungstests werden als eigene Tests, nicht unabhängig bezeichnet.
