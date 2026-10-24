# application

P00 startet ausschließlich die Informationsseite. Später Koordination von Missionen, Navigation, Versuchen und Kontextwechseln; Fachlogik und Bewertung werden nicht hier dupliziert.

P02b Option B: `naming-session.ts` koordiniert ausschließlich die zwei genehmigten
Benennungsfelder. Kontextprüfung und Biologie liegen im reinen Korrektor;
Sitzungshistorie, tatsächliche Hilfeereignisse, Revisions-/Vorgängerprüfung,
idempotente Abgabe und die gesicherte Gesamtumfangsübergabe bleiben hier.
Ungeprüfte Zusätze können auch bei Z1.02 keinen Gesamterfolg erzeugen. M6.02
bleibt als Gesamtaufgabe gesperrt. Nach Reload/Zurück ohne belegte Historie
keine neue Erfolgsbuchung; nur acht bestehende Metadatenfelder persistieren.
Die RAM-Sitzung ist eine Anwendungsschranke, keine manipulationssichere Prüfung.
