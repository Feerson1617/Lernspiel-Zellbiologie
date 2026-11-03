# M6.04-R1 – Prüfvertrag vor Implementierung

Auftrag vom 02.11.2026, Ausgangshead `26794c5ff451018c9fec671303a2138a8ffe2fac`.
Eigene Reproduktion: ausschließlich Ablösungsanteil ergibt bei beiden Hypothesen
und beiden Materialien fälschlich Grün (vier Fälle). Das externe Gegenprüfpaket
liegt nicht vor. Beide vorhandenen CI-Fehlertraces sind lokal gesichert.

[Vertrag 1.1.0](../contracts/m604-investigation-1.1.0.json) und
[36 eigene Kombinationsfälle plus sieben Bindungsfälle](../tests/fixtures/m604-r1-cases.json)
werden vor der Bewertungsänderung festgeschrieben. Beide Hypothesen betreffen
Volumen. C07 bestätigt weiterhin beide biologischen Reaktionsgrößen; C18
fordert zusätzlich deren Passung zur Hypothese. Ausschließlich Ablösungsanteil
führt zu Gelb/partial mit konkreter Ergänzung der relativen Volumenmessung.
Die Mehrfachauswahl erlaubt Volumen plus Ablösung, prüft aber auch jede falsche
oder unsichere zusätzliche Auswahl. Rot bleibt einem belegten Widerspruch in
den Einzelkriterien vorbehalten. C18 verdoppelt keinen solchen Fehler.

Aufgaben-, Rubrik- und Inhaltsversion werden erhöht. Daten-/Modellversion bleiben
unverändert, da keine Beobachtungsdaten oder physikalischen Modelle geändert
werden. Historische Verträge und 50 ursprüngliche Sollfallvorlagen bleiben
bytegleich erhalten. Die einzige geänderte historische Gesamterwartung wird
explizit in der neuen Fixture begründet; keine Anpassung an Fehlverhalten.
Eine gültige Rücktauschhypothese bleibt auch beim Material ohne klare Erholung
prüfbar. Freitexte, Datenschutz, technische Wiederholungen einer Zwiebel und
alle Aussagegrenzen gelten unverändert. Schreibüberschrift: „Hypothese prüfbar
machen“, mit vollständig erhaltenen Kriterienbeschreibungen.

Der alte Browser-Sammeltest enthält 14 unbekannte Eingaben und einen separaten
Hilfe-/Überarbeitungspfad. Die 14 IDs werden vor der Aufteilung eingefroren.
Jeder Fall soll eigenständig dieselben Originalaktionen, Status-, Evidenz-,
Paritäts-, Vorgänger- und Speicherprüfungen ausführen; Startaufbau und finale
Datenschutzprüfungen werden absichtlich je isolierter Sitzung wiederholt.
Eingaben und originale Prüfkörper werden durch Hash-/Mengenvergleich gebunden.
Keine Änderung von Timeout, Workern, Retryzahl oder fachlichen M6.02-Sollwerten.
Drei gezielte Intel-WebKit-Proben gehen dem vollständigen Pflichtlauf voraus.
Der Nutzerauftrag ersetzt die frühere Empfehlung dreier vollständiger Läufe;
ein vollständiger finaler Lauf nach den gezielten Stabilitätsproben genügt.
