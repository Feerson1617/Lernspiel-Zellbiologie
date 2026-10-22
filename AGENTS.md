# AGENTS.md – Zelllabor 11

Diese Projektregeln gelten für alle Implementierungs-, Inhalts-, Review- und Veröffentlichungsaufträge in diesem Repository. Sie ersetzen keine tatsächlich ausgeführten Prüfungen. Ein Auftrag muss diese Datei und die zugehörigen Spezifikationen ausdrücklich als Grundlage verwenden; die bloße Existenz der Datei garantiert nicht, dass jedes externe Werkzeug sie automatisch liest.

## Unverhandelbare Reihenfolge

Biologische Fachlichkeit → zuverlässige Korrektur/Rückmeldung → Lernwert → Methodenvielfalt/Offenheit → Grafik.

Aufgaben sind nur so offen, wie ihre Auswertung nachweislich beherrscht wird. Bei Unsicherheit Aufgabe enger gestalten, in Teilfragen zerlegen oder das Format wechseln. Nie fachliche Fehlbewertungen zugunsten einer offenen Oberfläche akzeptieren. Viele gelbe Rückmeldungen bei üblichen richtigen Antworten sind ebenfalls ein Mangel.

## Quellen und Projektstand

- A–F sowie `spec/` sind die gemeinsame Konzeptionsgrundlage. Änderungen fachlicher Aussagen oder Bewertungsregeln dokumentieren und gegenprüfen.
- Maßgeblich ist das Unterrichtspaket Variante A vom 22.10.2026, soweit im privaten Arbeitskontext zugänglich, sowie das schulinterne Curriculum S.22–24 bis Ende Abschnitt 3.
- Quelle tatsächlich lesen. Unzugängliche Dokumente und nicht ausgeführte Prüfungen nicht als gelesen/bestanden ausgeben.
- Das alte Sinneslabor nur als geprüfte Architektur-Referenz verwenden; keine unveränderte Übernahme fachfremder Antwortregeln.

## Antwortprüfung

- Grün nur für vollständig richtig hinsichtlich der konkreten Frage, ohne ungeprüfte relevante Zusatzbehauptung.
- Rot nur mit konkretem fachlichem Gegenbeleg aus dem Fall; richtige Antworten dürfen nicht wegen Form, Länge oder Rechtschreibung rot werden.
- Gelb unterscheidet teilweise richtig, mehrdeutig und technisch nicht sicher auswertbar. Leere Antworten neutral.
- Farbe immer mit Symbol und Text; Ergebnis und Hilfenutzung separat.
- Jedes Feld hat eigene Kriterien, zulässige Alternativen, Fehlerbilder, konkrete Rückmeldungen und Prüfbeispiele.
- Keine bloße Schlüsselwortwertung, keine abgeschnittenen Textreste, kein unscharfes Umdeuten gegensätzlicher Fachwörter oder Vorzeichen.
- Bekannte richtige/falsche Begriffe vor Tippfehlerähnlichkeit prüfen. Negationsbereich, Richtung und Zeitbezug erhalten.
- Unbekannte Bedeutung führt zu Klärung, nicht zur erfundenen Fehlvorstellung. Auswahlklärung ist ein neuer unterstützter Versuch.
- Keine unvalidierte KI-API und kein lokales Sprachmodell als benotende Instanz in V1.
- Nach Änderungen am gemeinsamen Korrektor sämtliche bereits implementierten Aufgaben erneut prüfen.

## Modelle und Oberfläche

- Biologische Zustände, Einheiten und Bilanzen außerhalb des Renderers; gleiche Fachlogik in 2D und 3D.
- Wasserpotenzial einschließlich Druck; Cytosol/Vakuole/Außenraum getrennt; Wand nicht mit Protoplast schrumpfen lassen.
- Stochastische Einzelereignisse nicht als deterministisch vorhersehbare Schülerleistung bewerten.
- ATP-Abhängigkeit nicht mit direkter ATP-Spaltung des untersuchten Proteins gleichsetzen.
- Tierischer Regelkreis ist ein begrenztes Funktionsmodell, nicht universelle Zellphysiologie.
- Modell, didaktische Daten und echte Beobachtung unterscheiden. Praktisches Mikroskopieren nicht digital zertifizieren.
- Semantische Zielanker für Beschriftungen; keine verdeckten Zielstellen; ruhige Antwortansicht.
- Dragging benötigt Tipp-/Klickalternative und Tastaturweg. Kamera bei Formular/Modal/Zuordnung passend sperren.
- Ruhige, erwachsene Sprache; notwendige Fachbegriffe erklären; keine infantilisierenden Lobformeln.

## Prüfung und Nachweis

- Jeden Entwicklungsauftrag selbst fachlich und technisch prüfen. Fremde Berichte nicht als eigene Prüfung darstellen.
- Neue Fälle aus Frage/Material/Rubrik ableiten; nicht nur dieselben Golden Tests wiederholen.
- Gemeinsame Pure-Korrektorfunktionen in Spiel und Tests; keine Runtimeimporte des Testkorpus.
- Nach Änderung vollständige bestehende Regression; konkrete Farben, Texte, Pfeilziele und Bedienwege im Browser prüfen.
- WebKit-/Touch-Emulation nicht als echter iPad-/Safari-Gerätetest ausgeben.
- Unabhängige Gegenprüfung nur als erfolgt kennzeichnen, wenn ein getrennter Prüflauf tatsächlich eigene Sollwerte und neue Fälle entwickelt und ausgeführt hat.
- Fehlendes Werkzeug oder gesperrter Test = ausstehend/blockiert, niemals bestanden.
- Ein falsches Grün, falsches Rot oder falsches Fachmodell ist ein Freigabeblocker. Korrektur plus erneute Regression erforderlich.
- Sollwerte nicht an den fehlerhaften Code anpassen. Fachlich begründete Rubrikänderungen versionieren und gegenprüfen.
- Testmanifest: Commit-SHA, Quellen-/Inhaltsversion, Umgebung, Befehle, Fallzahlen, Fehler, Überspringungen und Belege.
- Keine Behauptung absoluter Fehlerfreiheit; keine Selbstzertifizierung als unabhängiger Gutachter.

## Kosten, Datenschutz und Schutz von Prüfungen

- Schülernutzung ohne Konto, Werbung, Bezahlung oder verpflichtende externe Dienste.
- Keine Namen, Rohtexte oder Antwort-Telemetrie standardmäßig dauerhaft speichern/übertragen. Lokaler Lernstand mit Fehlerbehandlung; fremde Browserdaten nicht löschen.
- Originalklausuren, Erwartungshorizonte, Lehrerpakete, ZIP-Quellen und extrahierte Prüfungsinhalte niemals in ein öffentliches Repository, Build, Log, Screenshot oder CI-Artefakt kopieren.
- Veröffentlichung ausschließlich über eine geprüfte Allowlist. `.gitignore` allein schützt nicht vor Git-Historie-Leaks.
- Neue Trainingsfälle dürfen anspruchsvolle Originalfälle nicht nur mit anderen Zahlen oder Buchstaben nachbilden.
- Statischer Selbsttest ist keine sichere Prüfungsplattform; Clientlösungen sind grundsätzlich inspizierbar.
- Assets lokal bündeln, Lizenz/Quelle und Bearbeitung dokumentieren; keine fremden Schriftdateien als Nutzerlieferung ausgeben.

## Arbeitsumfang und Freigabe

- Nur den ausdrücklich beauftragten, begrenzten Entwicklungsschritt implementieren. Der Masterprompt ist kein Auftrag, alles in einem Lauf zu bauen.
- Keine automatisch geschriebene PR-Abnahme, kein ungefragter Merge, keine destruktiven Git-Operationen.
- Existierende Funktionen und private Originale erhalten. Änderungen aller betroffenen Modi/Ansichten konsequent durchziehen.
- Endbericht nennt Geschaffenes, tatsächlich Getestetes und Offenes getrennt.
