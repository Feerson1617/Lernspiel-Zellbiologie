# M6.04 – Fachvertrag vor Implementierung

Grundlage: AGENTS, A–F (insbesondere F/M6.04), die zugehörigen Einträge in
`spec/tasks.json` und `spec/missions.json`, Kontext-/Ergebnis-/Fortschrittsvertrag,
P03b und P03b-R1. Tatsächlicher Main nach manuellem Merge von PR #9:
`3c9da3f6c84e78cd1abb25bc6f6d2bb1000915f1`. Der neue Auftrag erweitert den
ursprünglichen dreifeldrigen M6.04-Entwurf ausdrücklich um überprüfbare Planung.
Die historischen Quellen und die Fachverträge von M6.02/M6.03 bleiben erhalten.

Der [versionierte Vertrag](../contracts/m604-investigation-1.0.0.json) und
[50 eigene Sollfälle](../tests/fixtures/m604-cases.json) werden vor dem neuen
Runtime-Prüfer festgeschrieben. Es sind eigene fachliche Sollwerte, keine
unabhängige Gegenprüfung. Ihre Ableitung erfolgt aus Frage, Daten und Rubrik.

## Fachliche Entscheidungen

- Zwei eigene statische Befundfälle: erkennbare, unvollständige Erholung und
  keine gegenüber der angegebenen Unsicherheit klare Erholung. Keine Animation
  oder berechnete Reaktionskinetik. Alle Zahlen sind ausdrücklich didaktisch.
- Drei gepaarte Präparate derselben Zwiebel, jeweils zehn markierte Zellen:
  erster Durchgang und zwei technische Wiederholungen. Es sind keine drei
  biologisch unabhängigen Zwiebeln. Wiederholtes Fotografieren eines einzigen
  Zustands ersetzt weder weitere Durchgänge noch den geplanten Rücktausch.
- Relative Volumenschätzungen beziehen sich auf gedachte Bildstapel, nicht
  auf eine behauptete Volumenmessung aus einer einzigen zweidimensionalen
  Fläche. Alternativ lässt sich der Anteil abgelöster Protoplasten auswerten.
  Messunsicherheit und begrenzte Aussagekraft bleiben sichtbar.
- Wasser-gegen-Wasser kontrolliert Handhabung und Zeit bei vergleichbarem
  frischem Material. Parallel gepaarte oder zeitlich versetzte gepaarte
  Untersuchungen mit gleichen relativen Beobachtungsabständen sind zulässig.
  Der absolute Uhrzeitvergleich unterschiedlich lange behandelter Ansätze
  genügt nicht.
- Die anfängliche Wasserabgabe folgt aus gegebenen **Gesamt**wasserpotenzialen
  und wasserpermeablen Membranen. Positiver Anfangsturgor ist qualitativ.
  Zellwand, Protoplast und Vakuole bleiben getrennt. Eine Rückkehr zum
  Ausgangsvolumen oder sofortige vollständige Deplasmolyse wird nicht garantiert.
- Spätere Zunahme ist mit Wasseraufnahme vereinbar; sie beweist keine
  vollständige Wiederherstellung aller Zellfunktionen. Beim zweiten Fall
  reichen die kleinen Unterschiede innerhalb der Unsicherheit nicht für einen
  eindeutigen Erholungsbefund. Anfangs intakt bedeutet nicht nachher geprüft intakt.
- Restliche Saccharose, Beobachtungsdauer und Schädigung sind verschiedene,
  bedingt formulierte Alternativerklärungen. Keine davon folgt eindeutig aus
  fehlender Erholung; insbesondere folgt daraus kein Zelltodnachweis.

## Bewertung und Lernhandlung

C01–C03 behalten die ursprünglichen Bedeutungen Kontrolle, begrenzte
Rücktauschdeutung und Erkenntnisgrenze. C04–C17 präzisieren die zusätzlich
beauftragte Hypothesenbildung, Variablen, Konstanten, Zellfelder, Wiederholungen,
Zeitbezüge, Befundauswertung, Aussagearten und einen unterscheidenden Folgetest.
Die vollständige Feld-/Optionsmatrix enthält zulässige Alternativen, klare
Gegenaussagen und unvollständige Ansätze. Eine überprüfbare Vorhersage kann
fachlich zulässig sein, auch wenn der spätere Befund sie nicht bestätigt.

Grün setzt alle Kriterien voraus; ein gesicherter Widerspruch erzeugt Rot mit
konkreter gewählter Option und Grund. Richtige Teilentscheidungen bleiben
sichtbar. Unvollständiges ist gelb, Unsicheres wird zur Klärung markiert, leere
Felder bleiben neutral. Unbekannte technische Eingaben werden vollständig
abgewiesen, nicht präfixweise interpretiert. Keine Punkte- oder Klausurnote.

Der eigene Hypothesensatz und die schriftliche Versuchsplanung sind ausdrücklich
unbewertet. Ein anspruchsvolles Raster prüft Operationalisierung, faire
Vergleiche, Wiederholungen/Messqualität, Schlussfolgerungsgrenzen und begründete
Fachkommunikation durch Selbst-/Partner-/Lehrkraftsicht. Fachwortnennung allein
erfüllt das Raster nicht. Kein allgemeiner neuer Satzparser.

Die aktuelle Fortschrittsstruktur wird nicht erweitert. Nur flüchtige
Sitzungsbelege mit Kontext-, Ergebnisobjekt- und Revisionsbindung; Änderungen,
Hilfen und Kontextwechsel machen Belege ungültig. Hilfen bleiben beim Wechsel
zwischen den Szenarien nachvollziehbar. Ein Reload stellt keine unbekannte
Hilfehistorie als eigenständig dar. Freie Texte erscheinen weder in Resultaten
noch in Persistenz oder Telemetrie.

## Quellen und Abnahmegrenzen

Öffentliche Konzeptfassung: 22.10.2026. Private Unterrichts-/Prüfungsoriginale
und der externe R2-Bericht mit seinen vollständigen Laufdaten liegen nicht vor;
sie wurden nicht gelesen. Die Szenarien wurden eigenständig aus allgemeinen
Planungs- und Auswertungskompetenzen erstellt. Eine vergleichende Prüfung gegen
unzugängliche reservierte Klausurmaterialien ist offen.

Der Nutzer berichtet eine unabhängige Prüfung von PR #9; dessen manueller
Merge ist über GitHub und Git bestätigt. Für die neuen Änderungen besteht
noch keine unabhängige Abnahme. Echte iPad-Safari-, Screenreader-Nutzer- und
Lerngruppentests sowie eine Unterrichtsfreigabe werden nicht beansprucht.
