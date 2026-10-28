# P02c: begrenzte R6-Robustheitsreparatur

Auftrag und externe R6-Gegenprüfung am 26.10.2026 gelesen. Ausgang PR #7:
`7e7f599b081a464e26b72d895b1d49e865e5a36a`; main unverändert
`82f7a28237e3d11194a8951a4ab7566b0cd57574`. PR #6 bereits gemergt,
keine Änderung daran. Die externe Matrix bleibt lokale Prüfgrundlage außerhalb
von Repository, Build und öffentlichen CI-Artefakten.

## Ursache und Änderung

Normale Objekte als Lexika lieferten bei nicht selbst deklarierten
Eigenschaftsnamen geerbte Werte. `Record<string, T>` validiert diese Werte
nicht zur Laufzeit. Ein generischer `Object.hasOwn`-Zugriff sichert ausschließlich
`dirs`, `changes`, `negatedChanges` und `rooms` ab. Keine Sonderwort-Blacklist,
Grammatikerweiterung, neue Abhängigkeit oder Änderung der Bedeutungen/Versionen.
Unbekannte vollständige Ausdrücke ergeben `clarify/scope`, keine Fachbehauptung.
Ungültige Vertragsobjekte werden weiterhin abgewiesen; ungültiges fachliches
Material bleibt technisch nicht beurteilbar.

Der kurze Aufrufpfad wurde auf weitere aus Schülertext indizierte Lexika geprüft:
Die Fachbegriffeingabe vergleicht Begriffe über Arrays; ihre Tabellen werden nur
mit validierten Aufgaben-IDs gelesen. Die Zeichenpaar-Tabelle verwendet ein
einzelnes Zeichen, keinen vollständigen Nutzerschlüssel. Feedback bekommt allein
intern erzeugte Gründe, Feldtabellen nur die drei validierten Feldnamen. Kein
weiterer gleicher Fehler in diesem Pfad festgestellt, kein Repository-Refactoring.

## Reproduktion und gezielte Prüfung

Alle zwölf unveränderten externen Sicherheitsfälle am Ausgangshead reproduziert:
5/12 Klärungen, sechs `AssessmentContractError`-Ausnahmen und ein unbegründetes
`partial/exclusion_only`. Nach Reparatur 12/12 `clarify/scope`, vollständige
Ergebnisobjekte, Originaltext-/UTF-16-Evidenz, `notAssessed`, kein Erfolgsbeleg.
Das ist eine eigene Regression des codegeleiteten Befunds, keine neue unabhängige
Spracherkennungsquote. Die UI fing die alten API-Ausnahmen technisch ab; nun
zeigt sie die vorgesehene nichtfachliche Klärung mit gelbem Fragezeichen.

52 eigene Kreuzfälle vor der ersten neuen Runtime-Ausführung festgeschrieben:
Eigenschaftsnamen, beide Felder, `netto`/`nicht`, unbekannte Zusätze/Operanden,
Quell-/Zielräume und richtige/falsche Kontrollen. Eigene Sollwerte unverändert;
kein Hinzufügen zum R5-192-/R6-133-Nenner. Baseline 40/52, nach Reparatur 52/52.
Gezielte Unit-Regression 283/283 einschließlich expliziter Vertragsfehler und
UTF-16-Kontrolle. Der absichtlich vor der Korrektur ausgeführte Testfilter
behält seine zwölf Fehler und 194 durch den Filter nicht ausgewählte Tests.

Die DOM-Regression prüft beide Slots, echte Abgaben, Tastatur/emuliertes Touch,
Node-/Browserparität, sichtbaren Rohtext, Status/Farbe/Symbol, konkreten nächsten
Schritt und eigene Überarbeitung derselben Sitzung. Ein altes Grün bleibt nicht
aktuell, ungeklärte Versuche werden nicht gebucht. Hilfe bleibt nach Überarbeitung
separat erhalten. Gespeichert werden ausschließlich die acht bisherigen Metadaten.

## Vollprüfung und Abschlussgrenze

Nach dem begrenzten Patch einmal auf dem finalen Commit: `npm ci`,
`npm run test:unit`, `npm run check:spec`, `npm run test:content`,
`npm run test:build`, externe lokale 192-/133-/12-/52-Regression,
`npx playwright test`, unveränderte Benennungs-/Relationsberichte und
`WEBKIT_SUITE=all npx playwright test --config=playwright.webkit.config.ts`
(WebKit auf macOS im bestehenden Workflow). Schwere lokale Läufe seriell,
keine Timeout-/Skip-/Sollwertänderung. Endgültiger SHA, tatsächliche Zähler,
Erstfehler und Ausführungsbelege stehen im zugehörigen PR-/Abschlussbericht.
Historische vier Satzgates sowie R2/R3 bleiben getrennt rot dokumentiert.
21 geschützte Quellen, 79 IDs/19 Module, Frage/Material/C01–C03 und alle
Versionsbindungen bleiben erhalten. Keine privaten Originalprüfungen verfügbar;
keinen eigenen Abgleich mit ihnen oder unabhängige Abnahme behaupten.

Bei bestandenen aktuellen Pflichtprüfungen ist diese P02c-Arbeit für Codex
abgeschlossen und bereit für gezielte unabhängige Merge-Nachprüfung. Offen:
echtes Safari/iPad mit Bildschirmtastatur/Rotation, Screenreader, Schultablet-
und Unterrichtsprobe; main ohne erzwungenen Branchschutz. Keine Adminänderung,
kein Merge, Deployment oder P03. Grün bestätigt nur Begriff, Nettorichtung und
Volumenfolge, keine freie Erklärung, Transfer- oder Mikroskopierkompetenz.
Nach unabhängiger positiver Prüfung und manuellem Merge ist P03 ein gesondert
zu beauftragender Schülerzyklus: Frage/Material → eigene Eingabe → konkrete
Kriterienrückmeldung → Überarbeitung → gestufte Hilfe → Fortschritt, Desktop/iPad.
