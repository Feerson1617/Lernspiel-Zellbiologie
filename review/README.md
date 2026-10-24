# Getrennte Gegenprüfung

P00 enthält keinen unabhängigen fachlichen Prüflauf. Spätere neue Fälle werden
aus Frage, Material und Rubrik abgeleitet und hier mit Sollwerten dokumentiert.
`npm run test:review` schlägt ohne tatsächliche `*.test.ts` fehl.
Nie aus `spec/reference-fixtures.json` einen unabhängigen Prüfnachweis ableiten.

## main-Schutz: Vorschlag, nicht aktiviert

Am 22.10.2026 meldeten die erfolgreich gelesenen GitHub-Endpunkte
`GET /repos/Feerson1617/Lernspiel-Zellbiologie/branches/main` und `/rulesets`:
`protected=false`, `enforcement_level=off`, keine Rulesets und keine
verpflichtenden Statuschecks. Ein grüner CI-Lauf ist damit kein erzwungenes
Merge-Gate. Diese Codeänderung verändert keine GitHub-Einstellungen.

`main-ruleset-proposal.json` ist ein vorbereiteter POST-Body für
`/repos/Feerson1617/Lernspiel-Zellbiologie/rulesets`, **kein eingerichteter Schutz**:
genau `refs/heads/main`, aktive Durchsetzung, keine Bypass-Akteure, PR-Pflicht,
eine Zustimmung, veraltete Zustimmungen verwerfen, Zustimmung nach dem letzten
Push und erledigte Reviewdiskussionen. Die erfolgreichen Checks `build` und
`webkit` müssen vom
tatsächlich gelesenen App-Anbieter `github-actions` (Integration-ID 15368) kommen;
der Branch muss aktuell sein. Force-Push und Löschen sind untersagt.

Eine berechtigte Projektadministration muss die Regel gesondert prüfen/aktivieren
und danach die effektiven Regeln für `main` samt Check-Zuordnung erneut lesen.
Die Integration hat hier keine Kontoeinstellungen geändert. Verfügbarkeit und
Durchsetzung des vorbereiteten Regelwerks sind erst nach dieser Aktivierung
nachgewiesen; dessen JSON-Datei allein erzwingt nichts.

Nach R7 enthält der JSON-Vorschlag beide Checks. Der getrennte, mit
`git apply --check review/pages-gates-proposal.patch` nur lesend prüfbare
Workflowvorschlag lässt WebKit auf PR und main-Push laufen und setzt
`deploy.needs: [build, webkit]`. Die aktive Deployment-Abhängigkeit bleibt
weiterhin nur `build`; keine Regel oder Veröffentlichung wurde aktiviert. Die Integration-ID und
Checknamen sind vor einer späteren autorisierten Aktivierung erneut abzugleichen.

## Genehmigte Umsetzung nach R8

Der neu abgesandte überarbeitete Auftrag vom 24.10.2026 genehmigt ausdrücklich
Option B ausschließlich für die zwei Benennungsfelder und ihre isolierte
Testansicht. Vor Implementierung fixiert: [naming-input/1.0.0](naming-input-1.0.0.md).
Die nachstehenden R6/R7-Texte dokumentieren den früheren Entscheidungsstand;
0.2-draft bleibt ein Entwurf. Keine fachliche/unterrichtliche Abnahme.
Alter Satzvertrag: unverändert, weiterhin rote Legacy-Gates. Neuer Umfang:
getrennte verpflichtende Matrix und Hilfen-/UI-/Fortschrittsprüfung.

## Historische Entscheidung nach R7

[Kurze Entscheidungsvorlage a/b](P02b-Eingabeentscheidung.md): Option b wird
begründet empfohlen. Die Prüfentscheidung „B: nicht freigegeben“ ist kein
Formatbeschluss. Kein Formatwechsel und keine weitere Satzmusterergänzung.

## Historische Entscheidung nach R6

[R6-Eingabeempfehlung](R6-Eingabeempfehlung.md): Die unabhängige 95-%-Grenze ist
erneut deutlich verfehlt. Konkrete Empfehlung eines Fachbegriff-Vertrags mit
optionaler Klärung, Vergleich und Auswirkungen auf bestehende Verträge.
Keine eigenmächtige Umsetzung oder Freigabe.
