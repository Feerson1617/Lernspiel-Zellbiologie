# PR7 R11/R2 – Ursachenreparatur und Freigabegrenze

Ausgang PR7 `37c356a0d02f554f9de5de9cd65031bafd9066df`.
PR6 ist bereits durch den Nutzer gemergt: Head
`7a12d11d4c6e6a96efb4be6348202ec3064aebb5`, Merge/main
`82f7a28237e3d11194a8951a4ab7566b0cd57574`. Nur PR7 wurde um diesen
konfliktfreien Main-Merge ergänzt. Kein Rebase/Force-Push und keine PR6-Änderung.
142 Dateien des gelieferten R11/R2-Pakets stimmen mit seiner Hashliste überein.
Private Originale für einen eigenen Quellenvergleich stehen hier nicht bereit.

## Umsetzung

P1: Nicht mehr `verschiedene Richtungstags => Nettobilanz`. `m602-semantics.ts`
trägt Stoff, Transportgröße, Quelle, Ziel, konkrete Membran, aktuelle Phase,
Einzel-/Bilanzmaßstab, Netto- und Negationsbezug. Nur inverse Wege derselben
Membran, Größe, Phase und desselben Wassers dürfen eine Vergleichsbilanz begründen.
Eine fremde Membran, ein anderer Stoff, unbekannte Räume, Zeit oder ein einzelnes
Molekül reichen nicht. Ungeklärte Vergleiche erhalten `comparison_scope` mit
vollständiger Originalevidenz/notAssessed und ohne Fortschrittsbeleg. Keine neue
Simulation oder quantitativen Daten aus den Potenzialen erfunden.

P2: In einer koordinierten Aussage erbt die subjektlose Richtungsergänzung den
Netto-Bezug; eine neue explizite Einzelbewegung bleibt eigenständig. X07/X08 sind
widersprüchlich; X12 bleibt korrekt. Mechanismus/Bewegung benutzt weiter movement.
Das neue Vergleichsfeedback beschreibt nur zwei Bewegungsangaben und erklärt den
fehlenden gemeinsamen Bilanzbezug. Parserunsicherheit ist ausdrücklich kein
Nachweis fehlenden biologischen Wissens. Kein ungefragtes Vorwegnehmen der Lösung.

Sprachverarbeitung: kleine feldspezifische Raum-/Membran-/Größenlexika und komplett
konsumierende Subjekt–Verb–Weg-/Größen–Änderungs-Konstruktionen. Begrenzte Inversion,
Verbpartikeln und ausdrücklich bekannte aktuelle Zeit-/Bilanzmodifikatoren.
Keine Satzkorpusimporte, Ähnlichkeitsänderungen gegensätzlicher Begriffe oder
akzeptierte Vollsatzsammlung. Bestehende Hüllen, Versionen, Sitzung und Persistenz
bleiben. Die frühe Phase wird nur bei vollständig erkanntem aktuellem Bezug
angenommen; unbekannte Zeitsätze bleiben unklar. Materielle Kontextvalidatoren
bleiben vorgelagert wirksam.

P3: Vitest legt `qa/generated` bereits in seiner Konfiguration idempotent an;
separater R1-/R2-Reporter ebenfalls. Direkte Tests benötigen keinen vorangegangenen
Konzeptlauf. Python/jsonschema bleibt dokumentierte Voraussetzung der Konzeptprüfung.
Suite-/Hookfehler müssen neben bestandenen Assertions berichtet werden.

## Einmalige Sprachmessung und Entscheidung

Vor neuem Parserlauf eingefroren: 180 gelieferte Fälle plus 12 gezielte Gegenfälle,
82 eigene Slot-/Grenzfälle. Hashes: `qa/p02c-r2-freeze.json`.
Die eigenen Fälle wurden nach Kenntnis des Berichts entwickelt, nicht unabhängig.

| Bestand | Richtung | Volumen |
|---|---:|---:|
| Ältere 642: Sollklassifikationen | 314/321 | 316/321 |
| Ältere 642: alle vollständigen richtigen Antworten | 136/143 | 138/143 |
| Ältere 642: gewöhnliche kurze richtige Antworten | 60/60 | 60/60 |
| R2: alle Sollklassifikationen | 55/90 | 53/90 |
| R2: vollständige richtige Antworten, alle Nenner | 37/52 | 34/52 |
| R2: gewöhnliche kurze richtige Antworten | 35/45 | 32/45 |
| Eigene neue kurze richtige Kombinationen | 32/32 | 28/28 |
| Eigene neue Fälle insgesamt | 46/47 | 35/35 |
| Gezielt X01–X12 | 12/12 | – |
| Kritisches Falschgrün / Falschrot im geprüften Bestand | 0 / 0 | 0 / 0 |

85 Abweichungen bleiben explizit im Rohbericht, einschließlich des eigenen O064
(„netto … und zugleich …“ noch clarify statt incorrect). Die ursprünglichen 16
Langantwortlücken bleiben mit ihren ursprünglichen Sollwerten nachvollziehbar;
vier davon werden nun erkannt, zwölf bleiben offen. Keine nachträgliche Umdeutung
von N026/N067 und keine Sensitivitätsrechnung als Ersatz des vollen Nenners.
R2-Langantworten sind vollständig enthalten. Diese Bestände sind keine Häufigkeits-
oder Generalisierungsaussage über Lernende. 736 P02b-Fälle bleiben erhalten.

**95-%-Ziel verfehlt: aktuelles Freitextformat nicht freigeben.** Keine weiteren
Sprachschleifen zur Anpassung an diese Beispiele. Die konkrete verbleibende Grenze
sind Satzglied-/Pronomen-/Passivvarianten sowie mehrteilige Mengen-/Kausalbezüge,
die noch nicht vollständig und sicher gebunden werden. Entscheidungsvorlage:
[explizite Relationsslots](../review/m602-structured-proposal.md), ausschließlich
Vorschlag. Keine Format-/Sollwert-/Versionsänderung implementiert und P03 nicht begonnen.

`npm run report:m602-r2` schreibt alle 916 vollständigen Auswertungen einschließlich
Session-Buchungsprobe, Nenner, kritischen Farben und sämtlichen Abweichungen;
wegen der Abweichungen bewusst Exit 1. Dieser Befund wird nicht als technischer
Pflichtsuite-Erfolg oder unabhängige Abnahme ausgegeben.

## Prüfverlauf und Abschlussnachweise

Vor Reparatur X01/X02 tatsächlich correct/independent gebucht, X03/X04 incorrect.
Erster gezielter Entwurf: zwei Regressionen in zusammengesetzten Vergleichen;
Vergleichsbindung auf das einzelne vollständige Relationsglied begrenzt. Zweiter
Lauf: fehlende elliptische Verbpartikel als Regression; regelhaft ergänzt. Danach
304/304 bestehende gezielte Tests und 319/319 einschließlich R2-Tests bestanden.
Neue gezielte Chromium-DOM-/Runtime-Proben: 6/6 auf Desktop, Tablet und Mobil;
X01/X03 gelb ohne Speicherung, X07 rot, X12 korrekt mit genau einem achtfeldrigen Beleg.
Erster Reporteraufruf ohne TypeScript-Transformflag technisch gescheitert; korrektes
Flag festgelegt. Eine externe Python-Archivkopie scheiterte an absichtlich ungültigem
Unicode im Korpus; Rohdatei wurde anschließend bytegleich kopiert, nicht repariert.
Alle Erstbefunde und Wiederholungsgründe bleiben im separaten Prüfarchiv.

Vollständige technische Tests und CI auf dem endgültigen Commit werden mit exakter
SHA, tatsächlichen Befehlen, Exitcodes, Assertion-/Suitefehlern und Ausführungsbaum
im PR und separaten Prüfarchiv festgehalten. Große lokale Suiten nacheinander.
Die vier alten Legacy-Satzgates bleiben separat rot. Veröffentlichungsschutz,
21 geschützte Quellen und 79 IDs sind weiterhin Pflicht. Keine private Quelle,
Testkorpora oder interne UI ins dist übernehmen.

Neue unabhängige Gegenprüfung, echte Safari/iPad-Hardware mit Bildschirmtastatur/
Rotation und Lernenden-/Unterrichtsprobe offen. Noch kein Unterrichtsprodukt.

Die CI erhält einen eigenen roten `Relations recognition readiness`-Job für den
vollständigen R2-Rohbericht. Sein Fehler ist der ehrliche offene Sprachbefund;
Build/Regression/WebKit werden davon unabhängig vollständig ausgeführt. Das ist
keine Abschwächung der Freigabekriterien und kein erfolgreicher Gesamtworkflow.

Abschließende Codeprüfung: Der neu zerlegte umgekehrte Tonoplastweg darf nicht den
Feedbacktext „Vakuole → Cytosol“ erhalten. Er bleibt im aktuellen Feldprofil
ausdrücklich ungeklärt. Ein zusätzlicher codegeleiteter Gegenfall prüft dies;
er gehört nicht zum vorab fixierten 82er-Sprachbestand. Der erste Abschlusslauf
am Zwischencommit wurde deshalb ersetzt; seine Teilergebnisse bleiben erhalten.
