# Benennung mit naming-input/1.0.0

Nur `{Z1.02,term}` und `{M6.02,process}`. Originalfrage und C01 unverändert;
keine Richtungs-/Volumenkorrektur. Normativer, vor Code und erster Bewertung
fixierter Vertrag: `review/naming-input-1.0.0.md`; Freeze mit Zeit/Hashes:
`qa/naming-v1-freeze.json`. Der alte Satzkorrektor wird nicht nachtrainiert.

`namingVersions(taskId, modelVersion)` liefert die drei genehmigten technischen
Versionslabels; das vierte Label ist zwingend explizit. Keine Simulationsversion
wird erfunden. `parseNamingSubmission(unknown)` prüft die exakte geschlossene
Form und kopiert/friert alle verschachtelten Daten. Das vorhandene TaskContext-
Hashverfahren bindet vier Versionen, Instanz, Seed, Phase, Material und Modell.
Z1 braucht zusätzlich ein explizites Pflanzenprofil. M6 prüft weiter sieben
exakte Materialschlüssel, Gesamtwasserpotenziale einschließlich Druck in Pa,
beide Wasserpermeabilitäten und weitgehende Saccharoserückhaltung.

`evaluateNaming(submission, support)` ist rein. `naming-profiles.ts` enthält
ausschließlich Konzepte/Benennungen; `classifyNamingTerm` konsumiert das ganze
Feld innerhalb der vorab begrenzten Grammatik. Keine Satzmusterliste und kein
Herausschneiden eines passenden Worts. Die neue Hülle verändert weder
`EvaluationResult` noch `spec/`. Ihr `termResult` bewertet nur C01; getrennt
stehen `notAssessed`, Gesamtstatus, offene Kriterien und reale Hilfeherkunft.
Originaltexte und UTF-16-Spannen bleiben vollständig. Zusätze verhindern
Z1-Gesamterfolg; M6-C01 allein bleibt insgesamt partial. Ungültige Einreichungen
werden ausdrücklich technisch abgewiesen oder technisch markiert.

`naming-feedback.ts` trennt die beiden Fachprofile von der gemeinsamen
Darstellung. Jeder Grund enthält Erkanntes, konkreten Unterschied und nächsten
Schritt. Standardfeedback auf falsche/teilweise Namen verrät die Lösung nicht.
Hinweis, Wortbank, Auswahlklärung und ausdrücklich aufgerufene Lösung sind
sichtbar getrennt. Unsicherheit ist keine biologische Fehlvorstellung.

`createNamingSession(context, {idPrefix,resumed,loadedAttempts})` hält nur RAM-
Historie. Für jeden bearbeiteten Entwurf `edit()`, dann `makeSubmission(...)`
und `submit(...)`. Identische Wiederholung ist idempotent. Vorgänger, Revision,
ID und voller Kontext werden gegen die eigene Ausstellerhistorie geprüft.
`help(kind)` protokolliert echte Hilfe; Herkunft wird nicht aus Richtigkeit
abgeleitet. Hilfe bleibt in derselben Instanz, auch bei Kontextwechseln.
`activate(next,'new_case')` braucht einen unbenutzten Fall, anderen Seed UND
anderes Material. Rückkehr stellt bekannte Hilfe wieder her.

`session.record(outcome)` akzeptiert nur den vollständig ausgestellten aktuellen
Umschlag derselben Sitzung und prüft seine gesamte Aggregation erneut.
`createEvaluatedAttempt` lehnt neue Aufgabenversionslabels ausdrücklich ab;
ein isoliertes grünes termResult kann den Umfang nicht umgehen. M6 bleibt
gesperrt. Gleiche Buchung liefert denselben Acht-Felder-Beleg. Keine Rohtexte,
Evidenz, Hashes, Hilfeereignisse oder Vorgänger werden in schemaVersion 1 ergänzt.

`resumed` ist eine explizite vertrauenswürdige Integrationsinformation, kein
vom Antwortfeld ableitbarer Wert. Die Testansicht setzt sie bei Reload und
back_forward; geladene Metadaten kennzeichnen bekannte Instanzen zusätzlich.
Wo frühere Hilfe nicht rekonstruierbar ist, wird keine Hilfe erfunden und kein
neuer Erfolg dieser Instanz gebucht. Rückmeldungen können weiterhin üben lassen,
zeigen aber den technischen Vorbehalt und behaupten keine Eigenständigkeit.
Eine spätere produktive Navigation muss dieses Herkunftssignal durchgehend
liefern. Browserneustart bei vollständig fehlenden Daten beweist keine neue
eigenständige Leistung. Hier entsteht kein Kompetenzzertifikat.

## Echte, isolierte Bedienprobe

`src/ui/naming-lab.ts` mountet dieselbe DOM-Komponente mit zwei Fachprofilen.
Originalfrage/Material, statisches Schema, Eingaben, Umfang/Feedback, Hilfen und
Fehler sind bedienbar. Die Ansicht ist **rein testintern**: kein öffentlicher
Pfad und kein main.ts-Import. Vite lehnt sogar ihren direkten Produktionsbuild
ab; nur der exakt benannte virtuelle Test-Harness darf sie bündeln.

Reproduktion nach `npm ci`, Python-Abhängigkeiten und Browserinstallation:

```sh
npm run build
npx playwright test tests/browser/naming-v1.spec.ts
npx playwright test tests/browser/p02b-r8.spec.ts
WEBKIT_SUITE=additional npx playwright test --config=playwright.webkit.config.ts
npm run report:naming
npm run test:legacy
```

System-Chromium ist über `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` nutzbar. Der
Playwright-Test liefert die Test-HTML und das bewachte Runtime-Modul nur im
lokalen Testbrowser aus. Keine redaktionellen Testdaten im Produktionsbundle.
Desktop, Tablet und Mobil testen echtes Tippen, Maus/Touch, Tastaturnavigation,
Feedback, alle Hilfestufen, Duplikate, Kontextwechsel, Reload/Zurück sowie
Quota-/Zugriffsfehler. Bilder liegen in `test-results/`, Rohberichte/Logs in
`qa/generated/`; CI hängt technische Nachweise als Artefakte an.

Die neue Abnahme zählt alle 78 bzw. 74 vorab als vollständig definierten
Begriffseingaben; sämtliche gelben Fälle bleiben im Nenner. Die 109.980
endlichen Artikel-/Hüllen-/Interpunktions-/Unsicherheitskonfigurationen sind
keine unabhängigen Schülerantworten. Legacy-R2–R8 und Redaktionsreferenzen laufen
weiter unverändert. Die alten 95-%-Assertions sind nachprüfbar verschoben und
werden weiterhin wirklich rot ausgeführt, ohne Skip/xfail.

Mac-WebKit: Statt der belegten falschen Standard-Tab-Annahme prüft der bestehende
Navigationstest Option-Tab → echter Linkfokus → Enter → Inhalt → weiterer Link.
Der zusätzliche Test erfasst weiterhin Standard-Tab und Option-Tab separat.
Keine direkte Fokuszuweisung ersetzt den reparierten Navigationsweg. Reale
Safari-/iPad-Geräte, Rotation/Bildschirmtastatur und neue unabhängige Gegenfälle
bleiben eine eigene Abnahme. Keine P02c-/P03- oder Unterrichtsfreigabe.
