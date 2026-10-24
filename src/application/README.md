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

P02c ist ein eigener Folgebranch ab dem eingefrorenen R9-Commit 09d2cd1.
`m602-session.ts` koordiniert nur M6.02/C01–C03 unter dem neuen geschlossenen
`m602-response/1.0.0`-Vertrag. Die bisherige Benennungssitzung und ihr gesperrter
M6-Gesamtumfang bleiben unverändert. Erst alle drei aktuellen Kriterien ohne
ungeprüften Rest können einen Gesamtbeleg erzeugen. Nur selbst ausgestellte,
unveränderte, aktuelle Umschläge derselben Sitzung sind buchbar; Duplikate bleiben
idempotent. Unterstützung wird pro Feld erfasst und für die Instanz konservativ
zusammengeführt. Nach Laden/Zurück ungesicherte Historie bleibt in jedem neuen
Materialfall ungesichert. Keine neuen Speicherfelder oder Rohtextpersistenz.
