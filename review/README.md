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
Push und erledigte Reviewdiskussionen. Der erfolgreiche Check `build` muss vom
tatsächlich gelesenen App-Anbieter `github-actions` (Integration-ID 15368) kommen;
der Branch muss aktuell sein. Force-Push und Löschen sind untersagt.

Eine berechtigte Projektadministration muss die Regel gesondert prüfen/aktivieren
und danach die effektiven Regeln für `main` samt Check-Zuordnung erneut lesen.
Die Integration hat hier keine Kontoeinstellungen geändert. Verfügbarkeit und
Durchsetzung des vorbereiteten Regelwerks sind erst nach dieser Aktivierung
nachgewiesen; dessen JSON-Datei allein erzwingt nichts.
