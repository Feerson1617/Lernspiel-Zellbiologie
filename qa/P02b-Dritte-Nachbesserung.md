# P02b – dritte Nachbesserung, 23.10.2026

**Selbstprüfung; keine unabhängige Gegenprüfung, kein Merge, kein P02c und keine Unterrichtsfreigabe.**

Geprüfte Anwendungs-/Testfassung: `afe8d99e4f379733f2a630f995fce02333b0d2d2`. Ausgang war `b9eddd757e4b7cffe04e86006ad4cc3de02682c4`,
unverändert offener [PR #6](https://github.com/Feerson1617/Lernspiel-Zellbiologie/pull/6)
gegen `main` (`b155936443745d98c8133788872c9c5ff44d7fb2`).
Ein anschließender Abgabecommit ergänzt Nachweise/Provenienz und die kompakte
CI-Diagnoseausgabe, keine Anwendungs- oder Testlogik. Endgültigen Head und dessen
Actions-Run weist die PR-Beschreibung aus. Bericht erstellt 2026-10-23T08:26:04+02:00 (Europe/Berlin).

## Ergebnis und verbleibende Blocker

- Lokaler vollständiger `npm run check`: **2.612 technische Tests bestanden**,
  0 fehlgeschlagen/übersprungen; **694 Konzeptprüfungen separat bestanden**.
- WebKit 27.2 auf eigenem macOS-arm64-CI-Prüflauf: **45/48 unveränderte
  Standardtests bestanden, 3 Fokusfehler**; **6/6 zusätzliche Tests bestanden**.
  Diese 3 Fehler bleiben als Fehler erhalten, der WebKit-Job bleibt rot.
- Kurze bekannte richtige Osmosebenennungen **60/60 grün**, zuvor 11/60.
  Eigener neuer Kurzbestand **50/50 grün**, zuvor 0/50. Ziel 95 % im
  Selbstprüfbestand erreicht; keine unabhängige oder empirische Sprachquote.
- Längere richtige Erklärungen **0/20 grün, 20 gelb**, unverändert alle im Nenner.
  Die Beschränkung auf process/C01 bleibt bestehen; keine Erklärungskorrektur.
- Die bestätigten P1-Namensgleichsetzungsfehler sind im geprüften Bestand
  behoben. Frische unabhängige Gegenprüfung, echte Geräteprobe und wirksamer
  Branchschutz bleiben offen. Keine Behauptung allgemeiner Fehlerfreiheit.

## Grundlagen und Umgang mit dem Paket

Der gelieferte Nachbesserungsprompt ist die Arbeitsbeschreibung; der Bericht
liefert Fremdbefunde zum alten Head. Sie werden nicht als eigene Tests ausgegeben.
AGENTS, C insbesondere 3–5/9–11, D und F M6.02 sowie Aufgaben-/Rubrik-, Kontext-
und Ergebnisverträge bilden die unveränderte Grundlage.

Archiv außerhalb des Repositorys inventarisiert und sicher entpackt;
55 beigefügte Dateihashes ohne Abweichung.
Reproduktionsskripte vor Ausführung gelesen. Kein Archiv, Prompt, fremdes Log,
privates Unterrichts-/Klausuroriginal oder extrahierter Erwartungshorizont wurde
kopiert. Ausschließlich die ausdrücklich beauftragten neu formulierten
Prüfsätze wurden kontrolliert als Fixtures übernommen.

**180 Hauptfälle + 24 + 8 Diagnosefälle = 212 bekannte Regressionen.** Texte,
IDs und ursprüngliche Sollwerte bleiben exakt erhalten; drei kanonische Hashes
binden die Übernahme an den gelieferten Inhalt. Das ist kein neuer unabhängiger
Erkennungsbestand für diese Korrektur.

## Konkrete Änderungen

`term-grammar.ts` erhält Benennung (`designation`), Gleichbedeutung,
Klassifikation und biologische Eigenschaft einschließlich Negation. Die
Konstruktion „der Name der Diffusion“ wird nicht mehr als Eigenschaft Diffusion
umgeschrieben. Positive und negative breite Gleichsetzungen bleiben hier
`clarify`; insbesondere erfindet das Feedback keine Verneinung passiven Transports.
„Osmose ist keine Diffusion“ bleibt als ausdrücklich verneinte wahre Eigenschaft
konkret falsch. Tonoplast trennt ebenfalls generische Namensgleichsetzung von
Membraneigenschaft und qualifizierter Vakuolengrenze.

`naming-syntax.ts` setzt Nominalgruppen, Referenzen, Benennungsverben und
obligatorische Satzendungen zusammen. Feldprofile besitzen die zulässigen
Bezugsnomen: Prozess und Membran werden nicht ausgetauscht. Keine vollständigen
Antworttexte im Parser, keine Schlüsselwortwertung, kein Entfernen beliebiger
Textreste. Auch Genitivformen und Einschübe dürfen Namensrelationen nicht in
eine umgekehrte Antwortbenennung verwandeln. Bereits bekannte Fachbegriffe
bleiben vor Tippfehlernähe geschützt.

Explizite „Es ist in Wirklichkeit …“-Korrektur kann nur eine unmittelbar
vorangehende einzelne Benennung zurücknehmen; wissenschaftliche Prädikate,
Alternativen und unbekannte Behauptungen werden nicht gelöscht. Ganze Texte
und originale UTF-16-Positionen bleiben erhalten, auch nach „Danke!“.

Keine neuen Aufgaben, Modelle, Simulationen, UI, Abhängigkeiten, Persistenz-
oder Materialänderungen. M6.02 bleibt process/C01; direction/volume bleiben
unimplementiert, der Gesamtabschluss wirft `IncompleteTaskAssessmentError`.
Vier explizite Versionslabels, Hilfentrennung und Kontextbindung bleiben erhalten.

## Eigene Fälle und vollständige Statusverteilungen

50 weitere kurze natürliche richtige Antworten und 400 zugehörige falsche,
teilweise, mehrdeutige, widersprüchliche/ungeprüfte Varianten wurden **vor ihrem
ersten Lauf und vor Runtimeänderungen** festgelegt. Neuheit der 50 Kurzantworten
gegen alle alten/neuen gelieferten Fixtures, QA und Referenzen auch nach NFC,
Kleinschreibung und Entfernung von Satzzeichen geprüft: keine Überschneidung.
Fixture-Hash vor dem Lauf:
`1a5da4bab4eaee97d4bc4664e771614b58e38cbfbbcd0d306bf4538ed63a38e2`.
Weitere Sicherheitsprüfungen entstanden während der Implementierung und sind
kein ungesehener Erkennungsbestand.

Die Rohvorgabe `expected` wird nie überschrieben. `accepted` dokumentiert daneben
die begründete Nachbeurteilung bzw. ausdrücklich begrenzte Auswertungsreichweite.

| Gruppe | Anzahl | correct | partial | incorrect | clarify | Abweichungen vom Rohsoll |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| short-correct | 60 | 60 | 0 | 0 | 0 | 0 |
| long-correct | 20 | 0 | 0 | 0 | 20 | 20 |
| wrong-name | 12 | 0 | 0 | 12 | 0 | 0 |
| partial | 8 | 0 | 8 | 0 | 0 | 0 |
| ambiguous | 12 | 0 | 0 | 0 | 12 | 0 |
| contradiction | 12 | 0 | 0 | 12 | 0 | 0 |
| unsafe-extra | 12 | 0 | 0 | 0 | 12 | 0 |
| correct-distinction | 8 | 8 | 0 | 0 | 0 | 0 |
| semantic-trap | 8 | 0 | 0 | 0 | 8 | 0 |
| tonoplast-correct | 12 | 12 | 0 | 0 | 0 | 0 |
| tonoplast-wrong | 8 | 0 | 0 | 8 | 0 | 0 |
| tonoplast-boundary | 8 | 0 | 0 | 0 | 8 | 0 |
| not-generic-name | 4 | 0 | 0 | 0 | 4 | 4 |
| generic-name | 4 | 0 | 0 | 0 | 4 | 0 |
| explicit-negation | 4 | 0 | 0 | 4 | 0 | 0 |
| evidence | 4 | 4 | 0 | 0 | 0 | 0 |
| unassessed-unicode | 4 | 0 | 0 | 0 | 4 | 0 |
| tonoplast-property | 4 | 0 | 0 | 2 | 2 | 2 |
| explicit-name-not-alias | 3 | 0 | 0 | 0 | 3 | 3 |
| explicit-name-alias | 2 | 0 | 0 | 0 | 2 | 0 |
| explicit-name-equivalence | 1 | 0 | 0 | 0 | 1 | 0 |
| membrane-no-synonym | 1 | 0 | 0 | 0 | 1 | 0 |
| membrane-not-membrane | 1 | 0 | 0 | 1 | 0 | 0 |
| fresh-short | 50 | 50 | 0 | 0 | 0 | 0 |
| fresh-wrong | 200 | 0 | 0 | 200 | 0 | 0 |
| fresh-partial | 50 | 0 | 50 | 0 | 0 | 0 |
| fresh-alternative | 50 | 0 | 0 | 0 | 50 | 0 |
| fresh-contradiction | 50 | 0 | 0 | 50 | 0 | 0 |
| fresh-unassessed | 50 | 0 | 0 | 0 | 50 | 0 |

Die **29 Rohsollabweichungen** werden nicht verschwiegen oder zu einer globalen
Trefferquote umgerechnet:

- 20 längere richtige Erklärungen bleiben wegen ungeprüfter Zusatzbehauptung
  gelb. Das 95-%-Ziel ist für diesen Bereich nicht erreicht; alle bleiben im Nenner.
- Vier alleinstehende und drei ausdrücklich mit „Osmose“ beginnende verneinte
  generische Namensgleichsetzungen bleiben konservativ gelb. Die Rohvorgabe
  grün bleibt erhalten; Bericht/Nachbesserungsauftrag erlauben bei Bezugsunsicherheit
  Klärung. Entscheidend: kein falsches Rot/kein falsches Eigenschaftsfeedback.
- `tonoplast-property-2/-3` bleiben im Rohdatensatz `clarify`, werden aber
  entsprechend der ausdrücklichen fachlichen Nachbeurteilung im Fremdbericht
  begründet rot. Keine Anpassung an eine willkürliche Implementierung.

Vollständige **662 Eingaben, ursprüngliche Sollwerte, separate Nachbeurteilung,
tatsächliche Ergebnisobjekte und Feedbacktexte**:
[p02b-third-results.json](p02b-third-results.json). 60 bekannte Kurzrahmen wurden
zusätzlich mit falschen Begriffen, Teilansatz, drei Alternativen, späteren
Widersprüchen und Verneinung geprüft; zehn neue einfache Tonoplast-Rahmen mit
eigener Rubrik ebenso. Weitere relationale/feldbezogene Sicherheitstests stehen
im ausgeführten Unitbestand. Keine Aussage über sämtliche Wortkombinationen.

## Tatsächlich ausgeführte Prüfung

| Prüfung | Bestanden | Fehlgeschlagen | Übersprungen |
| --- | ---: | ---: | ---: |
| Unit, lokal | 2361 | 0 | 0 |
| Content/Schema, lokal | 181 | 0 | 0 |
| Build, lokal | 16 | 0 | 0 |
| Chromium, lokal | 54 | 0 | 0 |
| **Lokal technisch** | **2612** | **0** | **0** |
| WebKit unveränderte Standardtests, macOS CI | 45 | 3 | 0 |
| WebKit zusätzliche Runtime-/Plattformtests, macOS CI | 6 | 0 | 0 |
| **Technischer Prüfumfang lokal + WebKit** | **2663** | **3** | **0** |
| Konzeptprüfung, separat | 694 | 0 | 0 |

Keine flaky Tests in diesen Läufen. TypeScript strict, 79 Aufgabenidentitäten,
19 Missionen geprüft; keine Behauptung von 79 implementierten Aufgaben.
Konzeptprüfungen sind redaktionelle Schema-/Rechen-/Deklarationsprüfungen, keine
694 unabhängigen biologischen Korrektortests. 1.618 tatsächliche Ergebnisobjekte
gegen das unveränderte Schema geprüft: bisherige 956 plus zusätzliche 662.
Alle bestehenden Z1.02-/M6.02-Regressionen und 13/39 Redaktionsreferenzen bestanden.

Alle drei gelieferten Runner wurden auf dem angegebenen Code erneut ausgeführt.
Ihre unveränderten Rohsollvergleiche melden die obigen 20/6/3 Abweichungen.
Alle 69 unterschiedlichen Material-/Versions-/Eingabe-/Ergebnisschutzprüfungen
bestanden; Wiederholungen zählen nicht als 207 neue Guards.
Illustratives Material: intakte Zwiebel-Epidermis, frühe Wasserabgabe, Pa
-120000 > -350000 > -810000, beide Membranen wasserpermeabel,
Saccharose `largely_retained`, `otherTransport=excluded`, `modelState={}`.
Keine Konzentrationsableitung und keine erfundene Simulation.

Die echten API-Aufrufe lauten unverändert
`createOsmosisEvaluator(versions).evaluate(context, {fieldId:'process', text}, assistance)`
bzw. `createTonoplastEvaluator(...).evaluate(..., {fieldId:'term', text}, ...)`.
Vier getrennte technische Labels stehen vollständig im Manifest und Rohresultat;
sie sind keine neu behaupteten fachlichen Releaseversionen.

## Browser, Plattformprofil und CI

662 zusätzliche Fälle je Desktop-/Tablet-/Mobilprofil in Chromium und WebKit:
3.972 tatsächliche Auswertungen, vollständige Node-/Browser-Parität einschließlich
Feedback, Statusdeskriptoren und Originalevidenz. Keine externen Anfragen oder
Browserfehler in diesen Fällen; Markup wird nicht ausgeführt und fremder
Storage-Sentinel bleibt erhalten. Die Startseite lädt keinen Korrektor. Keine
sichtbare Schüler-Aufgaben-/Feedbackoberfläche wurde als fertig ausgegeben.

Lokaler WebKitversuch: erst fehlender Cachepfad, dann trotz erlaubtem lokalen
Zielverzeichnis **403 „Domain forbidden“** von den Downloadhosts. Keine Umgehung
der Netzrichtlinie und kein behaupteter lokaler WebKit-Erfolg.
Der eigene CI-Prüflauf verwendet macOS arm64/WebKit 27.2 mit expliziter
Trennung: `WEBKIT_SUITE=baseline` führt exakt die unveränderten 48 alten
Standardtests mit Tab aus. Drei Fokusprüfungen scheitern; **45/48 bleibt das
Ergebnis**. `WEBKIT_SUITE=additional` führt die sechs neuen Prüfungen aus:
alle bestanden. macOS-WebKit nutzt dort ausdrücklich Option-/Alt-Tab;
Tab lässt BODY aktiv, Alt-Tab fokussiert „Zum Inhalt“. Fokussierte Links lassen
sich mit Enter aktivieren. Das ist mit Plattformvoreinstellungen vereinbar,
belegt aber keine Produktursache und ersetzt keine echte Safari-/iPad-Prüfung.

Ein abschließender CI-Gate-Schritt wertet echte JSON-Zahlen aus und schlägt bei
Fehlern/Skips fehl. Die temporär weiterlaufenden Einzelsteps machen den Job
deshalb **nicht grün**. Die Standardtests wurden nicht auf Option-Tab umgeschrieben.
Counts, Plattformprofil und Fehlernamen werden über Check-Annotationen zugänglich
gemacht. Erstlauf:
[39909989678](https://github.com/Feerson1617/Lernspiel-Zellbiologie/actions/runs/39909989678),
Head `b94a03adae594a6fc80530d64a0c19f4dc52bce9`, WebKit-Job rot.
Die PR-Abschlussbeschreibung nennt zusätzlich den tatsächlich geprüften endgültigen
Head und dessen Run. Kein roter Gesamtlauf wird als vollständig bestanden ausgegeben.

## Fehlversuche und unveränderte Historie

| Beleg unter qa/generated | Bestanden | Fehlgeschlagen | Übersprungen |
| --- | ---: | ---: | ---: |
| `p02b-third-before-tests.json` | 226 | 437 | 0 |
| `p02b-third-relations.json` | 1119 | 424 | 0 |
| `p02b-third-syntax-first.json` | 1912 | 67 | 0 |
| `p02b-third-syntax-second.json` | 1979 | 0 | 0 |
| `p02b-third-safety.json` | 1985 | 0 | 0 |
| `p02b-third-compositions.json` | 737 | 0 | 0 |
| `p02b-third-designation-verified.json` | 737 | 0 | 0 |
| `p02b-third-designation-final.json` | 740 | 0 | 0 |
| `p02b-third-history-verified.json` | 8 | 0 | 0 |

Der erste Lauf reproduziert den alten Stand. Der erste Syntaxzwischenstand hatte
noch fehlende Bausteine; nach Korrektur bestehen alle festen Statusnormen.
Zwei zusätzliche Fehlgrün-Proben („Name des Wassertransports“ / „Name des
Transports von Wasser“) wurden während der Entwicklung gefunden und durch den
allgemeinen Relationsschutz ebenfalls geschlossen. Negation und Einschübe
sind zusätzlich geprüft. Kein Sollstatus wurde dafür umdefiniert.

Ein TypeScriptversuch scheiterte an optionalen Playwright-Projekten im strikten
Konfigurationsvertrag; explizite Prüfung vorhandener Profilnamen behebt dies.
Der erste vollständige Lauf bestand Konzept und 2.361 Unitprüfungen, dann
**180 Contenttests bestanden/1 fehlgeschlagen**, Build/Browser noch nicht erreicht.
Der Fehler war ein technischer Archivvergleich: Der historische Fall `L2-05`
„Ich nenne den Vorgang Osmose. Osmose ist Wassertransport.“ wurde nun grün statt
gelb. Seine unveränderte fachliche Sollmenge ist bereits `correct|clarify`.
Der alte Bericht bleibt bytegleich an Code `29d12d1` gebunden. Der Archivtest
prüft nun diesen Commit, Originaleingaben und den unveränderten Berichtshash;
Live-Regressionen behalten ihre ursprünglichen fachlichen Sollmengen. Auch neue
Ausführungsberichte werden von normativen Sollwerten getrennt. Keine historischen
Resultate nachträglich durch neue Resultate ersetzt. Danach vollständiger
Komplettlauf auf `afe8d99e4f379733f2a630f995fce02333b0d2d2` erneut erfolgreich. Der erste Actions-build war rot;
für den endgültigen Head wird der Status gesondert geprüft.

## Befehle, Umgebung und Veröffentlichungsschutz

```sh
npm run check:types
npm run build
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test tests/browser/p02b-third.spec.ts tests/browser/keyboard-platform.spec.ts
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run check
# Im macOS-CI-Job:
WEBKIT_SUITE=baseline npx playwright test --config=playwright.webkit.config.ts
WEBKIT_SUITE=additional npx playwright test --config=playwright.webkit.config.ts
npm run check:publish
git diff --check
```

Weitere ausgeführte Zielprüfungen, drei Originalrunner, Versionen und Hashes:
[p02b-third-review.json](p02b-third-review.json). Vollständiger lokaler Log:
`qa/generated/p02b-third-final-check.log`; Rohlogs/JSONs werden ignoriert und
über SHA256 nachgewiesen. Sie enthalten keine privaten Prüfungsoriginale.

Lokal Linux x86_64, Node 24.19.0/npm 11.9.0, Python 3.12.14 und exakt
jsonschema 4.26.0, Chromium 154.0.8037.57. Eigenes WebKit in GitHub Actions:
macOS arm64, Node 24.19.0, WebKit 27.2. Der Fremdbericht hatte Node 24.21.0/
npm 11.19.0 und Chromium 156; seine Läufe werden nicht als eigene ausgegeben.

21 geschützte Konzept-/Spezifikationsdateien SHA256-unverändert. Aufgaben,
Rubriken, Referenzen, Modellwerte, package.json und Lockfile unverändert.
Workflow ausschließlich um getrennte WebKit-Prüfung/Diagnose ergänzt;
Pages-Veröffentlichung weiter nur von `main` und nur aus geprüftem `dist`.
154 exakt freigegebene Pfade einschließlich Historie, zwölf zusätzliche QA-/
Entwicklungspfade, neun echte negative Vite-Importversuche auch mit `?raw`.
Vier Dist-Dateien byte-/SHA256-gleich zum Ausgangsbuild; drei lokale Assetpfade
unter `/Lernspiel-Zellbiologie/`. Keine Korrektoren oder redaktionellen Daten im
öffentlichen Startbundle, keine Quellenkarten oder unerwarteten externen Anfragen.

Private Originale standen nicht zur Verfügung und wurden nicht geöffnet oder
kopiert. Der fremde private Datei-/14-Wörter-Fenster-Vergleich wurde nicht
unabhängig wiederholt; keine Garantie gegen jede semantische Nähe behauptet.

`main` erneut gelesen: `protected=false`, `enforcement_level=off`, keine
Rulesets/Pflichtchecks. Bestehender administrativer Regelvorschlag bleibt
unaktiviert; keine Einstellungen verändert. Auch der neue CI-Job ist kein
administrativ erzwungenes Merge-Gate.

## Offenes und Rückgabe

Die 3 WebKit-Standard-Fokusfehler, echte Safari/iPad-Probe, frische unabhängige
Gegenprüfung und administrative Branchabsicherung bleiben offen. Keine reale
Geräte-/Schülerstudie, keine Firefoxprüfung, keine Unterrichtsfreigabe.
Breite Erklärungen bleiben in diesem Schritt ungeprüft. Nur P02b nachgebessert;
kein P02c, keine neue Mission, Simulation, Bewertung von direction/volume oder
Speicherung. Fachliche Richtigkeit hat weiterhin Vorrang vor Offenheit.
