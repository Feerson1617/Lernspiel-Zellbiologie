# P02a – Nachbesserung nach der Gegenprüfung von PR #5

**Codex-Selbstprüfung. Keine Freigabe, kein Merge, kein P02b.**

- Ausgang auf `feature/p02a-tonoplast-korrektor`:
  `32ac6f4264aff92a83a7fcd5868daf9c034a755f`.
- Vollständig geprüfter Korrekturcommit:
  `6a319fe268098748fe07c95d2e0def4d51c792bd`.
- Der nachfolgende Berichtscommit ergänzt nur diese Datei und
  `p02a-revision-review.json`; Veröffentlichungsschutz und Berichtsschema werden
  danach erneut geprüft. PR: <https://github.com/Feerson1617/Lernspiel-Zellbiologie/pull/5>.
- Quellen: AGENTS, Festlegungen A–F, insbesondere C/Z1.02, unveränderte
  TERM_TONOPLAST-Rubrik, Aufgaben-/Ergebnisverträge sowie P01b/P01c.

## Ausgangsbefund und Ursachen

Der Nutzer berichtet eine separat von ChatGPT ausgeführte Gegenprüfung:
36/52 richtige Antworten grün (69,2 %), 16 unberechtigt unklar; 25/30 falsche
Antworten rot, fünf unklar; 9/14 Teilantworten teilweise, fünf unklar; alle
18 mehrdeutigen Antworten unklar. Für weitere 180 Widerspruchskombinationen
wird kein falsches Grün berichtet. Diese Aggregate sind **übermittelte
Fremdbefunde**, keine hier ausgeführte Wiederholung des vollständigen Bestands.
Bereitgestellt wurden 16 konkrete richtige und vier konkrete falsche Eingaben.
Alle 20 lieferten beim eigenen Vorlauf auf dem Ausgangsstand `clarify`.

Ursachen: fehlende harmlose Rahmen/Zeichensetzung, nur ein enges Verb-/Passivmuster,
fehlende bestimmte Vakuolenbeschreibungen und Appositionen sowie fehlende
Fachsynonyme. Vorsicht verhinderte Falschgrün im übermittelten Bestand, erkannte
aber übliche vollständige Antworten zu selten.

## Konkrete Änderungen

- `term-grammar.ts`: zusätzliche begrenzte Benennungs-/Unsicherheitsrahmen,
  Doppelpunkt nach Unsicherheit, modales „könnte/müsste … sein“, Appositionen
  mit Klammern, Schrägstrich und Gedankenstrich; alle Namen werden ausgewertet.
- Umschließen/begrenzen/umgeben mit aktivem oder passivem Subjekt-/Objektbezug;
  ausdrückliche Benennung der Membran eines Raums. Negation wird nicht gelöscht.
- Bestimmte Beschreibungen der Vakuolengrenze, ergänzend die explizite Trennung
  von Vakuolenraum und Cytosol. Kein allgemeiner Kausal-/Relationskorrektor.
- `tonoplast.ts`: Plasmamembran/Plasmalemma sind bekannte Zellmembranbezeichnungen;
  Kernmembran bzw. Membran um den Zellkern bezeichnet die Kernhülle.
  Diese Begriffe sind keine Tippfehler des Tonoplasten. Vakuolenraum und
  Vakuoleninnere bleiben Raumnamen, keine richtigen Membrannamen.
- Die konkrete Benennungsfrage bezieht Umschließung auf die **direkte markierte
  Vakuolengrenze**. Aussagen über allgemeine indirekte räumliche Verschachtelung
  werden nicht abgedeckt. Fachfremde oder unbekannte Bezüge bleiben unklar.
- `feedback.ts`: getrennte fachliche Gründe für falsche Grenzzuordnung und
  verneinte Trennung von Vakuolenraum/Cytosol. Ergebnisverträge unverändert.
- Ganze Originalspannen einschließlich konsumierter Modalendungen/Klammern;
  ein „Danke!“ verdeckt keine nachfolgende Behauptung. Kein Abschneiden von Text.
- Prüfungen in neuer Fixture-/Unit-Datei sowie erweiterten Content-/Browsertests;
  Dokumentation und vier konkrete Allowlist-Pfade ergänzt.

Keine vollständigen Antwortsätze als Runtime-Whitelist, keine Test-/Specimporte
in der Runtime. Konzepte, geschützte Spezifikationen, bestehende Sollwerte,
Kontextbindung, Hilfenutzung und Persistenzschema bleiben unverändert.

## Neue Fälle und Erkennungsrate

Alle Eingaben/Statusgründe stehen in
`tests/fixtures/tonoplast-revision-cases.ts`. Sollwerte wurden vor der
Grammatikerweiterung festgelegt. Eine exakt schon im Altbestand vorkommende
richtige Eingabe wurde beim Neuheitsabgleich aus dem neuen Nenner entfernt;
sie bleibt unverändert im bisherigen Regressionstest. Ein Contenttest sichert
die Neuheit aller 40 neuen richtigen Eingaben gegenüber Alt-/Redaktions- und
übermitteltem Gegenprüfbestand.

| Zusätzlich geprüfter fester Bestand | Fälle | Sollstatus erreicht |
| --- | ---: | ---: |
| Übermittelte richtige Gegenprüffälle | 16 | 16 `correct` |
| Übermittelte falsche Gegenprüffälle | 4 | 4 `incorrect` |
| Neue vollständige richtige Antworten | 40 | 40 `correct` |
| Neue eindeutige Fachfehler | 14 | 14 `incorrect` |
| Neue falsche Zusätze/Widersprüche | 8 | 8 `incorrect` |
| Neue unklare Antworten | 20 | 20 `clarify` |
| Neue Teilantworten | 6 | 6 `partial` |
| **Gesamt** | **108** | **108** |

Grün-Erkennung im **neuen eigenen** richtigen Bestand: **40/40 = 100 %**
(vor Änderung: 6/40 = 15 %). Kein gelber Fall wurde aus dem Nenner entfernt,
um die Quote zu erhöhen. Keine falsche Grün-/Rotbewertung im final geprüften
Bestand. Die 40 Fälle umfassen neben Benennungsrahmen auch konkrete räumliche
Beschreibungen, Cytosol-/Vakuolentrennung, zusammengesetzte Aussagen und
Gleichbedeutung. Sie sind keine empirische Schülerstichprobe und keine neue
unabhängige Gegenprüfung oder allgemeine Fehlerfreiheitsgarantie.

Zusätzlich: 80 Namensaustausche in zehn neuen Rahmen, 120 unbekannte oder
widersprüchliche Zusätze zu **jeder** neuen richtigen Antwort, 24 aktive/passive
Relations-/Negationsvarianten und 16 Alias-/Konkurrenzkombinationen. Eigene Tests
prüfen Originaloffsets, zwei semantische Grenzfälle und P01c-Hilfe nach
angesehener Lösung. Bestehende P01b/P01c-Regressionen laufen vollständig mit.

## Tatsächlich ausgeführte Prüfungen

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run check
```

Linux x86_64, Node 24.19.0, npm 11.9.0, Python 3.12.14 mit den dokumentierten
Spec-Abhängigkeiten, Chromium 154.0.8037.57. Vollständiger Lauf auf dem genannten
Korrekturcommit; keine Tests fehlgeschlagen, übersprungen oder als flaky gezählt.

| Prüfung | Bestanden |
| --- | ---: |
| Unit, einschließlich sämtlicher bisheriger Unit-Regressionen | 643 |
| Content, 79 Identitäten, Redaktion und Ergebnisschema | 156 |
| Produktions-/geschützter Vorbereitungsbuild | 8 |
| Browser: Desktop/Tablet/Mobilgerät in Chromium | 36 |
| **Technische Tests gesamt** | **843** |
| **Separate unveränderte Konzeptprüfung** | **694** |

TypeScript strict, Katalogprüfung, Produktionsbuild, Pages-Basispfad und
Veröffentlichungsschutz bestanden. Das unveränderte Ergebnisschema validiert
**291 tatsächlich erzeugte Resultate** (144 alte eigene, 39 redaktionelle,
108 zusätzliche). Das ist Strukturprüfung, keine biologische Gegenprüfung.

Die neuen 108 Fälle laufen zusätzlich im echten gebauten Browsermodul auf allen
drei Chromium-Profilen; geprüft werden Status, Kriterien, Originalspannen,
Feedbacktexte, Farb-/Symbol-/Textdaten, Kontextbindung und Unterstützung.
Keine sichtbare Aufgabenansicht oder echtes Touchgerät wird damit behauptet.
Die Startseite bleibt unverändert; vier Dist-Dateien sind bytegleich zum
Ausgangsstand. Drei lokale Assetpfade, keine unerwarteten externen Startanfragen,
keine Testantworten/Specdaten/privaten Dateien im Bundle. Alle 21 geschützten
Dateien bleiben SHA-256-identisch. Neues Testmaterial liegt nur im Prüfbereich.

## Fehlgeschlagene Vorläufe und Behebung

Die fachlichen Sollwerte wurden nicht abgeschwächt. Protokolle liegen lokal,
ignoriert unter `qa/generated/` und werden nicht veröffentlicht.

| Vorlauf | Tatsächliches Ergebnis | Behebung |
| --- | --- | --- |
| `p02a-revision-before.json` | 27 bestanden, 83 fehlgeschlagen; anfänglich noch eine Dopplung im neuen richtigen Bestand | Fehlende Grammatik/Fachformen; oben beschriebene Erweiterung |
| `p02a-revision-first-fix.json` | 274 bestanden, 1 fehlgeschlagen | Nachgestelltes „ist es nicht“ vor Passivversuch erkennen; Teilansatz bleibt Teilansatz |
| `p02a-revision-adversarial.json` | 367 bestanden, 1 fehlgeschlagen | Spätere bekannte Verneinung nach „Danke!“ weiter auswerten; zuvor unklar statt falsch |
| `p02a-revision-semantic-before.json` | 170 bestanden, 1 fehlgeschlagen | Zwei zu großzügige Eingaben im selben Gruppentest, zusätzlich einzeln reproduziert; siehe unten |

**Selbst gefundener P1-Freigabeblocker im uncommitteten Zwischenstand:**
„Tonoplast ist ein anderer Name für Membran“ und der sprachlich unstimmige Satz
„Tonoplast umschließt ein anderer Name für Vakuole“ erhielten `correct`.
Ursache war die Gleichsetzung einer Klasseneigenschaft mit strikter Synonymie
bzw. ein unzulässig übersprungener Benennungszusatz. Die Grammatik behandelt
Synonymie nun getrennt und erlaubt solche Zusätze ausschließlich in
Identitäts-/Benennungsmustern. Beide erhalten final `clarify`; der entsprechende
Gruppentest bleibt erhalten. Kein nachgewiesener kritischer Fehler bleibt aus
diesen Vorläufen offen. Das ersetzt die erneute unabhängige Kontrolle nicht.

## Grenzen und ausstehende Prüfung

Die erneute unabhängige Gegenprüfung mit weiteren neuen Antworten steht aus;
P02a bleibt nicht freigegeben. Unbekannte wissenschaftliche Zusätze, komplexe
Negation, verschachtelte Klammern, wechselnde Zeitbezüge, weitere Sprachen und
freie längere Erklärungen bleiben Klärungsgrenzen. Auch weitere fachlich
richtige Satzformen können deshalb noch Gelb erhalten.

WebKit/echtes iPad/Safari und reale Schülerformulierungen wurden nicht geprüft.
Private Originalklausur/Erwartungshorizonte waren nicht zugänglich und wurden
nicht aufgenommen. Keine zusätzliche Bewertung anderer Textfelder, keine
Zahlenkorrektur, Missionen, Simulationen, UI-Freischaltung oder neuen 3D-Modelle.
**PR #5 aktualisieren, nicht automatisch mergen; P02b nicht begonnen.**
