# Verbindlicher P02b-Vertrag naming-input/1.0.0

Stand 24.10.2026. Vor Implementierung und erster Anwendung der neuen Regeln
festgelegt. Ausschließlich Z1.02/term und M6.02/process. Keine Unterrichts-,
Merge- oder Veröffentlichungsfreigabe. Der alte Satzkorrektor bleibt erhalten.

## Autorisierung und Quellen

Der neu abgesandte überarbeitete Option-B-Auftrag enthält den Beschluss:
„Ich entscheide mich als fachlich verantwortliche Person für Option B …
AUSSCHLIESSLICH für Z1.02/term und M6.02/process“ und genehmigt den vorab
dokumentierten, versionierten Eingabe-/Rückmeldevertrag sowie eine minimale
interaktive Testansicht. Dies ist der Umsetzungsauftrag; die frühere bloße
Prüfentscheidung B war keine solche Genehmigung.

Maßstab: AGENTS, A–F/Konzept 1.0, unveränderte Aufgaben/Rubriken/Referenzen
und technische Kontext-/Ergebnis-/Fortschrittsverträge. Private Originale
sind hier nicht zugänglich. Der neue Vertrag ändert Eingabe-/Ergebnisumfang,
nicht Operator, Frage oder fachliche Pflichtleistung. Originaldateien bleiben
unverändert; der Entwurf naming-input/0.2-draft wird nicht als Runtime-ID verwendet.

## Identität, Versionen und Material

Zulässige Paare sind eine echte Union:
`{taskId: Z1.02, fieldId: term}` oder `{taskId: M6.02, fieldId: process}`.
Keine direction-/volume-Korrektur und keine weitere Aufgabe.

| Bindung | Z1.02/term | M6.02/process |
| --- | --- | --- |
| contractVersion | naming-input/1.0.0 | naming-input/1.0.0 |
| taskVersion | Z1.02@term-input-1 | M6.02@term-input-1 |
| rubricVersion | Z1.02.C01@concept-1-scope-1 | M6.02.C01@concept-1-scope-1 |
| contentVersion | zelllabor11.naming-content/1.0.0 | zelllabor11.naming-content/1.0.0 |
| modelVersion | ausdrücklich vom Aufrufer, validiert und gebunden | ausdrücklich vom Aufrufer, validiert und gebunden |

Diese neuen Aufgaben-/Rubrik-/Inhaltskennungen bezeichnen den genehmigten
technischen Antwortumfang und seine Aggregation. Die fachliche Rubrik bleibt
Konzept 1.0. Keine fachliche Modellversionsnummer wird erfunden. Testkontexte
verwenden das vorhandene explizite Label review-no-simulation; es bezeichnet
keinen bereits implementierten Simulator. Alle vier Werte müssen übereinstimmen.

TaskContext bleibt vollständig: Aufgabe, vier Versionen, Instanz, Seed, Phase,
Material, Modellzustand und reproduzierter Hash. Kein DOM als Wahrheitsquelle.
Z1.02 verlangt eine markierte Vakuolengrenze in einem ausdrücklich benannten
Pflanzenprofil (plant_leaf oder onion_epidermis), leerer Modellzustand.
M6.02 verwendet unverändert die sieben geprüften Materialschlüssel: intakte
Zwiebel-Epidermiszelle, frühe Wasserverlustphase, Wasserpermeabilität beider
Membranen, weitgehende Saccharoserückhaltung, keine Zusatztransporte und endliche
Gesamtwasserpotenziale in Pa einschließlich Druck mit Ψv > Ψc > Ψe, Modellzustand {}.
Fehlende/zusätzliche oder widersprechende M6-Schlüssel sind technisch ungültig.

Die Originalfragen aus spec/tasks bleiben wörtlich sichtbar. Z1.02 erfüllt
weiterhin nur die Benennung Tonoplast/Vakuolenmembran; M6.02/process nur Osmose/C01.
M6.02.C02/C03 werden weder bewertet noch als abgeschlossen gespeichert.

## Sichtbarer Umfang vor der ersten Eingabe

> Fachbegriff: Ein Begriff genügt. Du musst keinen Satz schreiben.

Ein Fachbegriff darf mehrere Wörter enthalten. Unter einem zunächst geschlossenen
Bereich steht schon vor dessen Benutzung: „Weitere Aussagen (optional) – in diesem
Benennungsfeld noch nicht fachlich geprüft“. Diese Aussagen bleiben erhalten und
sichtbar; keine Aufforderung, richtige Gedanken für ein grünes Symbol zu löschen.
Eine spätere gesonderte Erklärungsaufgabe wird als notwendig benannt, nicht erfunden.

termText wird als GANZES geprüft. Ein Satz im Feld wird nicht in ein passendes
Wort und Rest aufgespalten. Lernende können ihren Text selbst in die getrennten
sichtbaren Felder überarbeiten. Satzform oder unbekannte Sprache allein erzeugt
niemals ein rotes biologisches Urteil.

## Vorab festgelegte vollständige Eingabematrix

Die endliche Begriffstabelle umfasst ausschließlich fachlich begründete Namen,
Teilansätze und Gegenbegriffe; sie ist keine Liste vollständiger Testantworten.
Bekannte korrekte UND falsche Begriffe werden vor einer Schreibvariante geprüft.

| Klasse | Vorab verbindliche Behandlung |
| --- | --- |
| Tonoplast, Tonoplasten, Vakuolenmembran | correct; dasselbe Konzept, Vakuolenraum–Cytosol |
| Vakuolen-Membran / Vakuolen Membran | geprüfte Schreib-/Trennvariante desselben Fachbegriffs; correct, Schreibhinweis |
| Membran, Hülle, Vakuolenhülle, innere Grenze; Membran/Hülle/Grenze um/der Vakuole | partial; Strukturebene/Beschreibung erkannt, spezifische Benennung fehlt |
| Zellwand | incorrect; feste äußere Hülle statt innerer Membrangrenze |
| Zellmembran, Plasmamembran, Plasmalemma | incorrect; äußere Protoplastgrenze statt Vakuolengrenze |
| Kernhülle, Kernmembran, Membran um den Zellkern/des Zellkerns; Zellkern | incorrect; andere Struktur/Begrenzung |
| Vakuole, Vakuolenraum, Vakuoleninnere | incorrect; Raum statt Membranname |
| Osmose | correct ausschließlich C01 |
| Diffusion / Diffusion von Wasser / Diffusion des Wassers | partial; übergeordnet, spezielle Benennung fehlt |
| Wassertransport / Transport von Wasser / Wasserbewegung / Bewegung von Wasser; passiver Transport / passiver Wassertransport / passive Wasserbewegung | partial; zutreffende allgemeine Beschreibung, kein spezifischer Vorgangsname |
| Plasmolyse | incorrect; Zellreaktion statt Transportmechanismus |
| aktiver Transport / aktiver Wassertransport / aktive Pumpe / ATP-Pumpe | incorrect; keine aktive Energie-Kopplung dieses Wassertransports im Material |
| Endocytose/Endozytose, Exocytose/Exozytose | incorrect; vesikuläre Aufnahme bzw. Abgabe statt selektivem Wasserübertritt |
| andere Begriffe oder unbekannte Wortteile | clarify, keine erfundene Fehlvorstellung |

Rein syntaktische, vollständig zu konsumierende Hüllen:

- NFC-/Großschreibungs-/Leerraumvergleich einschließlich ä/ae, ö/oe, ü/ue, ß/ss;
  Originaltext und UTF-16-Positionen bleiben unverändert erhalten.
- Höchstens ein Artikel vor jedem Begriff: der/die/das/den/dem/des/ein/eine/einen/
  einem/einer/eines. Artikelflexion ist kein biologisches Bewertungskriterium.
- Ein bekannter Unsicherheitsmarker vor oder nach der ganzen Benennung:
  vielleicht, vermutlich, wahrscheinlich, wohl oder eventuell; optionales Komma.
  Ein Fragezeichen ist ebenfalls keine fachliche Einschränkung.
- Ein passendes äußeres Paar "…", '…', „…“, «…» oder (…) um einen Begriff bzw.
  die ganze Eingabe; höchstens zwei Hüllenebenen. Ein bis drei abschließende
  Zeichen aus . ! ? ; : , sind zulässig. Keine beliebigen Textlücken.
- Lokal abgegrenztes „, danke“ am Ende mit anschließendem Ende/Satzzeichen ist
  Höflichkeit. Ein weiterer Satz im selben Feld bleibt außerhalb des Umfangs;
  er darf nicht verschluckt werden.
- Geprüfte Osmose-Schreibvarianten: Osmosse, Osmosee, Ossmose, Osmsoe.
  Für isoliertes Tonoplast/Vakuolenmembran: höchstens eine Auslassung,
  Buchstabenverdoppelung oder benachbarte Vertauschung gemäß bestehender
  konservativer Funktion, mindestens acht Zeichen und klarer Abstand zu anderen
  bekannten Begriffen. Keine beliebige Substitution oder Mehrwort-Fuzzykorrektur.

| Bindung zwischen Begriffen | Statusregel vorab |
| --- | --- |
| A oder B, A/B, A und B | gleiche Konzept-ID und gleiche positive Benennung: wie ein Begriff; unterschiedliche Konzepte: clarify |
| nicht/kein/keine/keinen A | Zielkonzept ausgeschlossen: incorrect mit Beleg; anderes Konzept ausgeschlossen: clarify, positive Benennung fehlt |
| Nicht A, sondern B oder B statt A | B ist die erklärte Wahl; A und B gleiches Konzept: incorrect, widersprüchlicher Kontrast; Ausschluss des Zielkonzepts: incorrect; sonst B nach Begriffstabelle |
| mehrere Negationen, unklare Korrektur, unbekannter Rest, voller Satz | clarify/not_assessed, kein biologisches Rot allein aus der Form und keine Schlüsselwortextraktion |
| leer/Leerraum | empty; keine Fachbewertung |
| >4096 UTF-16-Codeeinheiten je Feld, mehr als drei Zusatzfelder, ungültiger Typ/Schlüssel, Kontroll-/Bidi-/ungültige Unicode-Zeichen | technical oder explizite technische Ablehnung; nichts abschneiden |
| zusätzliche bekannte/falsche/wahre/unbekannte Aussage im separaten Zusatzfeld | immer sichtbar not_assessed; kein zusätzlicher Fachkorrektor wird dafür vorgetäuscht |

## Ergebnisumschlag und Aggregation

Neue geschlossene, immutable Typen und ein eigenes JSON-Schema; keine Änderung
von EvaluationResult/TaskContext oder Erweiterung des fachlichen Statusvokabulars.
not_assessed ist ausschließlich ein Umfangsstatus. Das Ergebnis trägt Zielpaar,
Vertragsversion, vollständige Einreichung/Kontextbindung, termResult, Scope,
ungeprüfte Zusätze mit Originalbelegen, Grundcode, Unterstützung/Herkunft und
overallStatus/unassessedRelevantText. Alle Rohfelder und Sitzungsbezüge nur RAM.

Priorität der Gesamtentscheidung:
1. Ungültiger/veralteter Kontext, unpassende Version oder Einreichung: technical;
   nicht als biologischer Fehler. Ohne valide Bindung kein erfundenes Fachresultat.
2. Sicher bewerteter falscher Name/Negation/Kontrast: incorrect mit konkretem Beleg,
   auch wenn ein Zusatz richtig klingt. Zusätze bleiben zusätzlich not_assessed.
3. Ungeprüfter nichtleerer relevanter Zusatz oder nicht interpretierbarer Feldtext:
   clarify; ein zutreffendes Kriterium bleibt getrennt sichtbar.
4. Ohne bewertbaren Text: empty. Teilansatz: partial.
5. Z1.02: nur correct ohne ungeprüfte Zusätze kann die Aufgabe vollständig erfüllen.
6. M6.02: correct termResult betrifft nur C01; overallStatus bleibt bei sonst
   richtiger Benennung partial, pendingCriteria C02/C03. Kein grünes Gesamtbanner.

Der Fortschrittsadapter prüft den GANZEN im selben Sitzungsverlauf ausgestellten
Umschlag und aktuelle Bindung, nicht ein isoliertes termResult. Der alte Adapter
muss für die neuen Aufgabenversionskennungen ausdrücklich die Übergabe ablehnen.
M6.02 bleibt grundsätzlich nicht als ganze Aufgabe buchbar. Z1.02 speichert
höchstens den tatsächlichen Gesamtstatus; clarify mit Zusatz wird kein Erfolg.
Keine Rohtexte, Belege, Korrekturbezüge oder neuen Felder in schemaVersion 1.

## Versuche, Hilfe, Neuladen und Datenschutz

Jeder neue geprüfte Entwurf erhält eine eigene ID und Revisionsnummer. Eine echte
Überarbeitung zeigt den Vorgänger samt dessen ursprünglichem Kontext; fremde,
veraltete und manipulierte Bezüge werden technisch zurückgewiesen. Derselbe
Doppelklick/Request wird idempotent behandelt. Keine zweite Erfolgsbuchung.

Zuerst Selbstüberarbeitung anbieten. Danach auf ausdrücklichen Wunsch Hinweis,
Wortbank, Auswahlklärung und Lösung. Hilfeereignisse sind explizit und nicht aus
Richtigkeit abgeleitet. Rangfolge independent < hint < wordbank < clarified <
solution_viewed ist konservative Zusammenführung der tatsächlichen Historie;
die einzelnen Ereignisse bleiben in der Sitzung sichtbar. Hilfe bleibt bei
Kontextänderung derselben Aufgabeninstanz erhalten. Frühere Versuche werden
nicht umgeschrieben oder nachträglich grün.

Ein neuer unabhängiger Fall braucht eine ausdrücklich neue, zuvor unbenutzte
Instanz UND einen anderen Seed UND tatsächlich andere Materialdaten. Nur eine
umbenannte Instanz oder erneutes Abschreiben hebt Hilfe nicht auf. Rückkehr zu
einer bekannten Instanz stellt deren bestehende Hilfe wieder her.

Beim Laden alter achtfeldriger Metadaten fehlen Rohtexte, Kontextvertrauen und
ggf. noch nicht eingereichte Hilfeereignisse. Keine neue Historie erfinden:
ein frisch geladener/über Browser-Zurück rekonstruierter alter Fall ist
history_unverified und darf keinen neuen Erfolgsnachweis buchen. Kriteriumsübung
bleibt möglich, der technische Vorbehalt sichtbar. Erst ein ausdrücklich neuer
Materialfall kann wieder eigenständig dokumentiert werden. Die Testansicht
stellt alte Texte/Erfolge nicht automatisch wieder her. Diese konservative
Grenze vermeidet einen unzulässigen Persistenzwechsel; keine neue Migration.
Bei Speicherausfall bleibt die aktuelle RAM-Kette erhalten, Fehler wird sichtbar.

## Feedback-Matrix und echte Bedienprobe

Jeder Feedbackpfad enthält Status/Farbe/Symbol/Text, sicher Erkanntes, konkreten
Unterschied und eine nächste Handlung. Keine technische ReasonCode-Ausgabe als
Ersatz für Lernfeedback. Standardfeedback für falsche/teilweise Namen nennt
nicht ungefragt den gesuchten Namen. Richtige Namen/Schreibvarianten dürfen als
bereits gegebene Antwort bestätigt werden. Fachliche Erläuterung/Lösung ist
getrennt ausdrücklich aufrufbar und beeinflusst spätere Hilfehistorie.

| Reason-Familie | Beleg/Fachbegründung | Nächster Schritt / Eskalation |
| --- | --- | --- |
| richtig/Schreibvariante | vollständige Benennung; Z1 Vakuolenraum–Cytosol, M6 nur C01 | Umfang prüfen, Erläuterung optional; Schreibhinweis ohne biologische Abwertung |
| Membran/Teilbeschreibung | richtige Strukturebene, spezifischer Name fehlt | selbst präzisieren → Hinweis zur inneren Grenze → Wortbank → Lösung |
| Zellwand | feste äußere Hülle | Grenzen vergleichen, selbst überarbeiten; kein Name vorweg |
| Zellmembran | äußere Protoplastgrenze | inneren Speicherraum und äußere Zellgrenze unterscheiden |
| Kernhülle/Zellkern | Kernbezug statt Vakuolengrenze | im Material umschlossenen Raum prüfen |
| Vakuolenraum | Raum statt Name der Membran | Raum/Grenze trennen |
| Diffusion/allgemeiner Transport | allgemeiner zutreffender Ansatz | speziellen selektiven Wassertransport benennen |
| Plasmolyse | Zellreaktion statt Transportmechanismus | Mechanismus und sichtbare Folge trennen |
| aktiv/Endo-/Exocytose | Energie-Kopplung bzw. Vesikelweg passt nicht zum Material | angegebenen passiven Membranübertritt mit dem benannten Mechanismus vergleichen |
| Negation/Kontrast/Konkurrenz | Originalstellen/Begriffsidentitäten erhalten | Widerspruch auflösen oder eine Benennung wählen, keine stillschweigende Auswahl |
| unbekannter Rest/Format | keine sicher prüfbare gesamte Benennung | Text selbst auf sichtbare Eingaben verteilen; weitere Gedanken nicht löschen müssen |
| leer/technisch/veraltet/Historie ungesichert | keine biologische Fehlvorstellung behaupten | ergänzen bzw. passende neue Prüfung/neuen Materialfall starten |

Eine gemeinsame DOM-Komponente, zwei getrennte Fachprofile. Rein testinterner
UI-Harness; kein Import in main.ts und kein öffentlicher Testpfad im dist.
Originalfrage/Material, Begriffsfeld, Zusatzbereich, Prüfen, Teil-/Gesamtstatus,
Überarbeitung, Hinweis, Wortbank/Auswahl und ausdrückliche Lösung sind echt bedienbar.
Statisches Schema ist als Schema beschriftet, kein 3D-/Simulationsersatz.

## Vorab beschlossene Abnahme und Gate-/Versionsmatrix

Eigene Matrixfälle werden vor der ersten neuen Auswertung eingefroren. Je Feld
mindestens 80 begründete Fälle einschließlich richtiger, falscher, teilweiser,
unklarer und technischer Eingaben; dazu Kontext-, Umschlag-, Feedback-, Hilfe-,
Duplikat-, Speicher- und DOM-Gegenfälle. Endliche Vokabulare/Orthografieregeln
möglichst exhaustiv prüfen. Generierte Schreib-/Interpunktionskombinationen
heißen Konfigurationen, nicht neue unabhängige Schülerformulierungen.

NEU: je Feld mindestens 95 % correct termResult unter ALLEN vorab als vollständige
Benennungen definierten Fällen, einschließlich zulässiger gelber Ergebnisse im
Nenner; null kritische Fehlfarben. Zusätze ändern die getrennte Feldquote nicht,
müssen aber jeden pauschalen Gesamterfolg verhindern. Alle geplanten Pflicht-
Status-/Scopefälle müssen stimmen; Feedback darf nicht irreführen oder ungefragt
Lösungen liefern. Kein neuer Gesamtcheck grün, solange eine neue Pflichtprüfung scheitert.

| Bestand / Gate | Ausführung und Aussage nach genehmigtem Wechsel |
| --- | --- |
| alle bisherigen Fach-/Sicherheits-/Schema-/Browserregressionen R2–R8 und redaktionellen Referenzen | verpflichtend weiter mit altem unverändertem Evaluator; keine Quelldaten/Sollwerte ändern |
| alte R6-56/60- und R7-41/60-95-%-Testkörper | unverändert in ausdrücklich getrennten Legacy-Gatelauf verlagern; wirklich ausführen, Exit 1 und Rohfehler erhalten, nicht xfail/skip und nicht als bestanden ausgeben |
| R8 26/60 Osmose und 9/20 Tonoplast | historisch fehlgeschlagene Legacy-Nachweise mit Quelle und Nenner; jetzt bekannte Regression |
| neuer 1.0.0-Begriffsumfang | neue Pflichtmatrix und ≥95 % JE FELD, Gesamtstatus-/Fortschritts-/Hilfekette vollständig prüfen |
| Freigabe | trotz eigener neuer grüner Tests erst nach neuer unabhängiger Gegenprobe und echten Geräten; keine Selbstzertifizierung |

Die alte Assert-Logik/Quellkörper werden beim Umzug mit Hashnachweis erhalten;
die übrigen alten Contentkontrollen bleiben aktiv. Der Legacy-Lauf bleibt als
eigenständiger tatsächlich roter CI-Nachweis sichtbar, außerhalb des neuen
Release-Gates. Dies ist die genehmigte versionierte Ablösung, kein Bestehen des
Satzvertrags und keine Absenkung seiner Schwelle. Aktive build-/webkit-Prüfungen
bleiben strikt. Branch-/Deployment-Schutz wird nur vorgeschlagen, nicht aktiviert.

Desktop/Tablet/Mobil: Maus, Touch und echte Tastaturaktionen, Fokus, Scrollen,
vollständige Texte, Screenshots, sämtliche Hilfe-/Fehler-/Kontext-/Reloadpfade.
Mac-WebKit-Standard-Tab-Annahme anhand tatsächlicher Plattformbeobachtung prüfen;
eine begründete Reparatur muss dieselbe Navigation/Enter-Aktivierung wirklich
nachweisen, nicht bloß grüne Zusatztests danebenstellen. Kein Timeoutkosmetik.
Eigene Prüfungen bleiben Selbstprüfungen. Safari/iPad real und private Quellen-
schutzprüfungen nur als bestanden kennzeichnen, wenn tatsächlich verfügbar und ausgeführt.
