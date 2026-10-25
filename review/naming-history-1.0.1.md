# P02b-R9: Historienvertrauen 1.0.1

Diese gezielte Provenienzkorrektur berichtigt die Annahme in
`naming-input/1.0.0` Zeilen 174–178: Nach Verlust der vollständigen RAM-Historie
beweist ein lokal unbekannter Materialfall keine Neuheit. Der alte normative
Text und sein Vorab-Hash bleiben historische Belege; seine genannte Annahme
wird durch dieses Erratum ersetzt. Begriffssprache, C01-Rubriken, vier fachliche
Versionslabels, Ergebnisform und persistierte acht Metadatenfelder bleiben gleich.

R9 ist vor jeder Reparatur am unveränderten Head 056d760 reproduziert: offizielle
openLab-Funktion direkt extrahiert, B ohne Abgabe mit Lösung betrachtet, Reload,
identischen B erneut geöffnet. Vollständiger Kontext gleich, Speicher vorher leer,
danach falscher eigenständiger Z1-Erfolg. Fremder R9-Bericht und eigenes Replay
sind getrennte Nachweise; nach Übernahme sind die gelieferten Fälle Regression.

Die kleine Reparatur bindet das Vertrauen an die gesamte Sitzung. `resumed=true`
oder irgendein geladener Versuch bedeutet `history_unverified` auch für danach
lokal unbekannte Instanzen. Kein Material-/Seed-/ID-Wechsel kann diesen fehlenden
Nachweis ersetzen. Der Korrektor darf C01 weiterhin biologisch bestätigen; die
Gesamtrückmeldung bleibt technisch eingeschränkt und `record` weist die Buchung ab.
Alte Hilfe wird nicht erfunden oder als solution_viewed rekonstruiert. Eigene
aktuelle Hilfeereignisse bleiben wahrheitsgemäß erhalten. M6 bleibt unvollständig.

Eine ausdrücklich frische, vertrauenswürdig gestartete RAM-Sitzung ohne geladene
Versuche darf weiterhin neue Materialfälle mit unbenutzter Instanz, anderem Seed
und anderem Material prüfen. Dies ist eine begrenzte Integrationsvoraussetzung,
kein Beweis weltweiter Neuheit oder eine Kompetenzzertifizierung. Bei unklarem
Neustart muss die Integration `resumed` setzen. Ohne zusätzliche Persistenz lässt
sich vollständige frühere Hilfenutzung nicht wiederherstellen; es gibt in diesem
Auftrag keine neue Migration und keinen versteckten lokalen Merker.

Die interne Quelle besitzt zwei explizite deterministische Fälle A/B. Der erste
B-Kontext behält seine bisherigen Werte; wiederholtes Anfordern verändert dessen
Identität nicht durch Zähler oder Zufall. Bei echter BFCache-Rückkehr mit vollständig
erhaltenem RAM bleiben belegte Hilfen erhalten; bei rekonstruiertem Dokument bleibt
Unsicherheit bestehen. Beide Wege verhindern einen unabhängigen Erfolg desselben
bereits unterstützten Falls.

Vorab-Sollmatrix: `qa/p02b-r9-plan.json`. 24 negative Unitkonfigurationen und zwei
positive frische Sitzungen; im DOM 64 Wiederkehrkonfigurationen je Profil plus
zwei positive Gegenproben. Ganzer Kontext, vier Hilfestufen, beide Aufgaben,
Reload/Zurück, leerer/alter/Quota-/denied-Speicher, keine Rohtextpersistenz,
kein falscher Eigenständigkeitstext. R9 300+384 und R8 3586 bleiben unverändert.

Nach erfolgreicher Phase A darf ausschließlich der direkte Zusatzauftrag des
Nutzers P02c auf separatem Branch/PR beginnen. Er überstimmt dafür die alte
P02c-Grenze des angehängten R9-Prompts; keine andere Freigabe folgt daraus.
PR #6 bleibt danach für die unabhängige Gegenprüfung unverändert. Kein Merge,
Deployment, Geräte- oder Unterrichtsfreigabe.
