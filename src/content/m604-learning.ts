import { M604_FIELDS } from '../domain/m604-contract.ts';
import type { M604CaseId, M604Field } from '../domain/m604-contract.ts';
import type { InvestigationField, InvestigationOption } from '../domain/structured-investigation.ts';

const option = (id: string, label: string, status: InvestigationOption['status'], reason: string): InvestigationOption => Object.freeze({ id, label, status, reason });
const yes = (id: string, label: string, reason: string) => option(id, label, 'correct', reason);
const no = (id: string, label: string, reason: string) => option(id, label, 'incorrect', reason);
const part = (id: string, label: string, reason: string) => option(id, label, 'partial', reason);
const uncertain = option('unsure', 'Noch unsicher', 'clarify', 'Die Bedeutung ist noch nicht entschieden. Nutze das Material oder eine Hilfe und überarbeite deine Auswahl.');

export function m604Fields(caseId: M604CaseId): readonly InvestigationField<M604Field>[] {
  const recovered = caseId === 'recovery';
  function field(id: M604Field, question: string, options: InvestigationOption[], required: string[] = [], minimumCorrect = 1): InvestigationField<M604Field> {
    return Object.freeze({ id, criterion: `M6.04.C${String(M604_FIELDS.indexOf(id) + 1).padStart(2, '0')}`, question,
      mode: ['control','constants','limits','dependent'].includes(id) ? 'multi' : 'single', required: Object.freeze(required), minimumCorrect,
      options: Object.freeze([...options, uncertain]) });
  }
  function classify(id: 'predictionType' | 'observationType' | 'explanationType', question: string, expected: string) {
    return field(id, question, [['prediction','Vorhersage / Hypothese'],['observation','Beobachtung / Befund'],['explanation','Interpretation / Erklärung']].map(([value,label]) =>
      option(value!, label!, value === expected ? 'correct' : 'incorrect', expected === 'prediction'
        ? 'Der Satz beschreibt eine vor dem Versuch prüfbare Erwartung, noch keinen erhobenen Befund.'
        : expected === 'observation' ? 'Der Satz gibt einen bereitgestellten Zahlenbefund wieder, ohne bereits seine Ursache zu behaupten.'
          : 'Wasseraufnahme deutet einen Befund biologisch. Sie wurde durch die Volumenschätzung nicht unmittelbar als Molekülbewegung beobachtet.')));
  }
  return Object.freeze([
    field('control', 'Stelle einen Kontrollansatz zusammen, der Handhabung und Zeit vergleichbar macht. Mehrere Bausteine sind nötig.', [
      yes('water','In der Kontrolle Wasser gegen Wasser austauschen.', 'Die Kontrollgruppe erhält dieselben Wechsel ohne Saccharosebehandlung.'),
      no('none','Auf eine Kontrolle verzichten; der Vorher-Nachher-Vergleich reicht sicher aus.', 'Ohne parallel vergleichbare Handhabung kann der Vorher-Nachher-Unterschied auch Zeit- oder Handhabungseffekte enthalten.'),
      yes('handling','Dieselben Handgriffe und Austauschschritte ausführen.', 'Auch Nachziehen und Berühren können Veränderungen verursachen; sie müssen vergleichbar sein.'),
      yes('times','Gleiche Abstände zwischen Eingriff und Beobachtung einhalten.', 'Vergleiche dieselbe Behandlungsdauer, auch wenn die Uhrzeiten der Ansätze verschieden sind.'),
      no('old_stained','Als Kontrolle ein altes gefärbtes Präparat verwenden.', 'Alter und Färbung verändern weitere Bedingungen. Das isoliert den Einfluss der Saccharosebehandlung nicht.'),
      yes('fresh','Vergleichbare frische Epidermis derselben Zwiebel zufällig auf gepaarte Ansätze verteilen.', 'Vergleichbares Ausgangsmaterial und zufällige Zuteilung begrenzen systematische Unterschiede.'),
      no('untouched','Die Kontrolle unberührt stehen lassen; das kontrolliert alle Handgriffe.', 'Ein unberührter Ansatz kann Zeitwirkungen zeigen, kontrolliert aber gerade nicht die Austauschhandgriffe.'),
      part('water_only','Nur das Kontrollmedium Wasser nennen; weitere Bedingungen noch offen lassen.', 'Wasser ist passend; Handgriffe, Zeiten und Ausgangsmaterial müssen noch vergleichbar festgelegt werden.'),
    ], ['water','handling','times','fresh'], 4),
    field('interpretation', 'Welche Schlussfolgerung ist für den geöffneten Befundfall zulässig?', [
      option('recovery_compatible','Hier ist die Volumenzunahme nach dem Rücktausch klar größer als die Unsicherheit. Sie ist mit erneuter Wasseraufnahme und unvollständiger Erholung vereinbar.', recovered ? 'correct' : 'incorrect', recovered
        ? 'Alle drei Behandlungsfelder nehmen deutlich zu, bleiben aber unter dem Ausgangswert. Das stützt eine begrenzte Erholung, nicht die vollständige Wiederherstellung aller Funktionen.'
        : 'Die Unterschiede betragen hier nur 1–2 Prozentpunkte bei ±4 Prozentpunkten je Schätzung. Eine klare Zunahme über der Unsicherheit ist damit nicht belegt.'),
      no('death_proven','Die fehlende vollständige Erholung beweist Zelltod.', 'Ausbleibende oder unvollständige Erholung allein ist kein Zelltodnachweis. Austausch, Beobachtungsdauer und mögliche Schädigung sind zu unterscheiden.'),
      option('no_clear_recovery','Hier ist zum gewählten Zeitpunkt keine klare Erholung nachgewiesen; die Ursache bleibt offen.', recovered ? 'incorrect' : 'correct', recovered
        ? 'Die vorliegenden deutlichen Volumenzunahmen übersteigen die Unsicherheit und gehen mit weniger Ablösungen einher. Eine unvollständige Erholung ist hier durchaus erkennbar.'
        : 'Die kleinen Unterschiede liegen innerhalb der Unsicherheit, die Ablösungszahlen ändern sich nicht. Das zeigt keinen eindeutigen Erholungsbefund und diagnostiziert keine Ursache.'),
      no('immediate_complete','Wasser bewirkt immer sofort vollständige Deplasmolyse.', 'Wasserangebot garantiert weder sofortigen vollständigen Lösungsaustausch noch intakte Membranfunktion oder vollständige Erholung.'),
      no('damage_proven','Die Befunde beweisen eine bestimmte Membranschädigung.', 'Membranfunktion und Schädigungsursache wurden nicht unmittelbar geprüft. Die Volumenreihe allein identifiziert sie nicht.'),
    ]),
    field('limits', 'Begrenze die Aussage: Wähle die Erkenntnisgrenze und mindestens eine bedingt formulierte Alternative für fehlende Erholung.', [
      yes('exchange','Unvollständiger Austausch könnte Saccharose im Außenraum zurücklassen.', 'Restliche Saccharose könnte das äußere Wasserpotenzial beeinflussen. Ob sie vorhanden ist, müsste gesondert geprüft werden.'),
      yes('not_unique','Ohne zusätzliche Befunde lässt sich fehlende Erholung keiner eindeutigen Ursache zuordnen.', 'Der beobachtete Endpunkt unterscheidet Austausch, Dauer und Schädigung nicht sicher.'),
      no('death_certain','Fehlende Erholung bedeutet sicher, dass alle Zellen tot sind.', 'Ein einzelner fehlender Erholungsbefund beweist weder Zelltod noch die Aussage über alle Zellen.'),
      yes('time','Der gewählte Beobachtungszeitraum könnte zu kurz sein.', 'Spätere Beobachtungen könnten eine langsamere Erholung zeigen; ihr Auftreten wird nicht garantiert.'),
      yes('damage','Eine Schädigung könnte die Erholung beeinträchtigen.', 'Das ist eine zu prüfende Möglichkeit, kein aus der fehlenden Erholung abgeleiteter Befund.'),
      no('exchange_certain','Fehlende Erholung beweist, dass ausschließlich der Austausch unvollständig war.', 'Auch Dauer und Schädigung sind möglich. Der Endpunkt beweist weder Restzucker noch seine ausschließliche Wirkung.'),
      no('all_cells','Die drei Durchgänge beweisen dasselbe Verhalten für alle Pflanzenzellen.', 'Drei technische Wiederholungen an einer Zwiebel erlauben keine Verallgemeinerung auf alle Pflanzenzellen.'),
    ], ['not_unique'], 2),
    field('hypothesis', 'Wähle eine überprüfbare, bedingte Hypothese. Entscheidend ist ihre Prüfbarkeit, nicht die spätere Bestätigung.', [
      yes('loss_prediction','Unter dem gegebenen Wasserpotenzialgefälle nimmt das Protoplastvolumen nach Saccharosebehandlung stärker ab als in der Handhabungskontrolle.', 'Behandlung, Vergleich, Messgröße und erwartete Richtung sind angegeben. Die Befunde können dieser Erwartung entsprechen oder widersprechen.'),
      part('change_unspecified','Die Zellen verändern sich irgendwie.', 'Ein Bezug ist vorhanden; Messgröße, Vergleich und erwartete Veränderung fehlen noch.'),
      yes('return_prediction','Wenn der Rücktausch das Gefälle zur Wasseraufnahme herstellt und die Membranen funktionsfähig bleiben, steigt das Protoplastvolumen gegenüber dem Zustand nach Saccharose.', 'Die bedingte Vorhersage ist überprüfbar. Auch fehlende Erholung macht sie nicht rückwirkend zu einer unprüfbaren Hypothese; ihre Bedingungen wären gesondert zu prüfen.'),
      no('already_proven','Schon vor der Untersuchung ist bewiesen, dass jede Zelle sofort vollständig regeneriert.', 'Eine vorweg behauptete universelle Bestätigung ersetzt keine zu prüfende Hypothese. Sofortige vollständige Erholung ist nicht garantiert.'),
    ]),
    field('design', 'Wie organisierst du einen fairen Vergleich?', [
      yes('parallel_pairs','Behandlung und Kontrolle paarweise parallel ansetzen und zu gleichen relativen Zeitpunkten beobachten.', 'Gepaarte Ansätze mit vergleichbarer Dauer unterscheiden die Lösung und kontrollieren Handhabung sowie Zeit.'),
      no('unmatched_clock','Versetzt beginnen, dann alle Ansätze nur nach derselben Uhrzeit vergleichen, unabhängig von ihrer Behandlungsdauer.', 'Unterschiedliche Einwirkungsdauern werden mit der Behandlung vermischt. Gleiche Uhrzeit ist nicht automatisch gleiche Untersuchungsphase.'),
      yes('staggered_pairs','Gepaarte Ansätze versetzt beginnen und für jeden Ansatz dieselben Abstände seit dem jeweiligen Wechsel einhalten.', 'Eine zeitliche Staffelung ist zulässig, wenn Phasen und relative Beobachtungsabstände vergleichbar bleiben.'),
    ]),
    field('independent', 'Welche Größe veränderst du gezielt zwischen Behandlung und Kontrolle?', [
      no('volume_result','Das gemessene Protoplastvolumen.', 'Das Volumen ist eine Reaktion, die erfasst wird. Es wird nicht als Behandlung vorgegeben.'),
      yes('solution_sequence','Die Lösungsfolge: Wasser → Saccharose → Wasser gegenüber Wasser → Wasser → Wasser.', 'Diese gezielt unterschiedliche Behandlung ist die unabhängige Größe.'),
      no('microscope_zoom','Die Mikroskopvergrößerung als einzigen Unterschied.', 'Die Fragestellung betrifft die Lösung. Unterschiedliche Optik würde zusätzlich die Vergleichbarkeit der Messung verändern.'),
    ]),
    field('dependent', 'Welche Messgrößen planst du? Wähle die direkte Messgröße deiner Hypothese; ergänzende Reaktionsgrößen sind möglich.', [
      yes('relative_volume','Mittleres Protoplastvolumen aus gedachten Bildstapeln, relativ zum eigenen Ausgangswert.', 'Die Volumenschätzung erfasst eine Reaktion auf die Behandlung; die Unsicherheit muss berücksichtigt werden.'),
      no('solution_sequence','Die von mir gewählte Lösungsfolge.', 'Die Lösungsfolge wird vorgegeben und ist hier die unabhängige Größe, kein gemessenes Reaktionsergebnis.'),
      yes('detached_fraction','Anteil der zehn markierten Zellen mit sichtbarer Protoplastablösung.', 'Die Ablösung ist eine geeignete ergänzende Reaktionsgröße. Sie ersetzt weder die direkte Volumenmessung für eine Volumenhypothese noch einen Turgor- oder Vitalitätsnachweis.'),
      no('temperature','Die als gleich festgelegte Temperatur.', 'In diesem Plan wird die Temperatur konstant gehalten und nicht als biologische Reaktion ausgewertet.'),
    ]),
    field('constants', 'Welche Bedingungen hältst du zusätzlich gleich? Wähle alle drei passenden Bedingungen.', [
      yes('temperature','Temperatur.', 'Temperatur kann Prozesse beeinflussen und soll zwischen den Ansätzen vergleichbar bleiben.'),
      no('same_solution','In beiden Ansätzen immer dieselbe Saccharosebehandlung.', 'Damit entfiele der beabsichtigte Behandlungsunterschied zur Wasser-Kontrolle.'),
      yes('optics','Optik, Beleuchtung und Verfahren zur Erfassung der Bildstapel.', 'Gleiche Erfassungsbedingungen begrenzen methodische Unterschiede der Messgrößen.'),
      yes('exchange_volume','Nachgezogenes Lösungsvolumen und Austauschverfahren.', 'Vergleichbare Austauschhandgriffe und Volumina begrenzen Handhabungseinflüsse.'),
      no('same_result','Dasselbe gemessene Ergebnis vor der Auswertung erzwingen.', 'Messwerte sind Ergebnisse und dürfen nicht auf einen gewünschten Gleichstand zurechtgewählt werden.'),
      part('temperature_only','Nur die Temperatur nennen; weitere Bedingungen noch offen lassen.', 'Temperatur ist passend. Optik und Austauschverfahren fehlen noch.'),
    ], ['temperature','optics','exchange_volume'], 3),
    field('fields', 'Wie kannst du Veränderungen derselben Zellen verfolgen?', [
      no('different_each_time','Jedes Mal andere unmarkierte Zellen wählen und ihre Unterschiede als Verlauf derselben Zellen ausgeben.', 'Dann sind Unterschiede zwischen Zellen mit zeitlichen Veränderungen vermischt. Der Verlauf derselben markierten Zellen ist so nicht belegt.'),
      yes('same_marked','In jedem Ansatz dieselben zehn markierten Zellen des jeweiligen Feldes zu allen drei Zeitpunkten wiederfinden.', 'Der zeitliche Vergleich bleibt an dieselben Zellidentitäten gebunden; Behandlung und Kontrolle haben jeweils eigene markierte Felder.'),
      no('best_looking','Nachher nur die am besten erholten Zellen auswählen.', 'Eine Auswahl nach dem gewünschten Ergebnis verzerrt den Vergleich und lässt fehlende Erholung verschwinden.'),
    ]),
    field('repetitions', 'Wie berücksichtigst du den ersten Durchgang und zwei Wiederholungen?', [
      no('one_only','Ein Durchgang genügt als Nachweis; die zwei geforderten Wiederholungen entfallen.', 'Der beauftragte Vergleich verlangt drei Durchgänge. Ein Einzelansatz kann die Streuung zwischen Durchgängen nicht zeigen.'),
      yes('first_plus_two','Drei gepaarte Durchgänge an vergleichbaren frischen Präparaten derselben Zwiebel, jeweils mit vollständiger Lösungsfolge.', 'Erster Durchgang und zwei technische Wiederholungen werden getrennt dokumentiert. Das sind noch keine unabhängigen Zwiebeln.'),
      no('three_photos','Drei Fotos desselben Zustands ersetzen drei vollständige Durchgänge.', 'Mehrere Fotos eines Zustands wiederholen weder die Behandlung noch den Rücktausch und sind keine drei Untersuchungsdurchgänge.'),
      part('more_unspecified','Mehrmals wiederholen, ohne Anzahl oder vollständigen Ablauf festzulegen.', 'Die Wiederholungsidee passt; erster Durchgang plus zwei vollständige Wiederholungen müssen noch festgelegt werden.'),
    ]),
    field('sequence', 'Welche zeitliche Folge prüft Wasserverlust und späteren Rücktausch?', [
      yes('baseline_sucrose_return','Ausgangsbefund in Wasser → Saccharosebehandlung und Befund nach 6 min → Rücktausch zu Wasser und weiterer Befund nach 6 min; Kontrolle mit gleichen Schritten.', 'Der Ausgangswert, die Behandlungsphase und die spätere Rücktauschphase sind getrennt vergleichbar. Die Abstände sind gewählte Planungszeiten.'),
      no('return_first','Zuerst Rücktausch auswerten, dann Saccharose zugeben und zuletzt erst den Ausgangsbefund erheben.', 'Ein erst nach der Behandlung erhobener Wert ist kein unbeeinflusster Ausgangswert. Der Rücktausch setzt die vorherige Behandlung voraus.'),
      no('no_return','Nach Saccharose abbrechen und daraus die Erholung nach Wasser ableiten.', 'Ohne Rücktausch und spätere Beobachtung liegt kein Befund zur Erholung nach Wasser vor.'),
      part('treatment_only','Saccharosebehandlung beobachten; spätere Schritte noch nicht festlegen.', 'Die Behandlungsphase ist vorgesehen; Ausgangsvergleich und Rücktausch fehlen noch im Plan.'),
    ]),
    field('observation', 'Welche Beschreibung gibt die bereitgestellten Zahlen wieder, ohne eine Ursache vorwegzunehmen?', [
      option('volume_rises','In allen drei Behandlungsfeldern steigt das Volumen nach dem Rücktausch deutlich über die Unsicherheit; die Ablösungszahlen sinken.', recovered ? 'correct' : 'incorrect', recovered
        ? '61/64/60 werden zu 89/91/86 Prozent; 8/7/8 Ablösungen werden zu 2/1/3. Das ist eine Beschreibung dieser Daten.'
        : 'Hier steigen die Zahlen nur um 1–2 Prozentpunkte, die Ablösungszahlen bleiben gleich. Die gewählte Beschreibung passt nicht zu diesem Fall.'),
      no('wall_shrinks','Die Zellwand schrumpft im gleichen Ausmaß wie der Protoplast.', 'Die bereitgestellten Befunde nennen eine vergleichsweise formstabile Wand. Wand und Protoplast sind verschiedene Strukturen.'),
      option('within_uncertainty','Die Rücktauschunterschiede liegen innerhalb der Unsicherheit; die Ablösungszahlen bleiben gleich.', recovered ? 'incorrect' : 'correct', recovered
        ? 'Die Zunahmen um 26–28 Prozentpunkte liegen deutlich über ±4 je Schätzung, und die Ablösungszahlen nehmen ab.'
        : '58/63/60 werden zu 60/65/61 Prozent; 8/7/8 Ablösungen bleiben 8/7/8. Ein klarer Erholungsbefund folgt daraus nicht.'),
      no('death_seen','In den Daten wurde unmittelbar beobachtet, dass die Zellen tot sind.', 'Es wurde keine Vitalitätsmessung bereitgestellt. Fehlende Erholung ist nicht die Beobachtung von Zelltod.'),
    ]),
    classify('predictionType', 'Ordne zu: „Unter den angegebenen Bedingungen erwarte ich nach Saccharose ein geringeres Volumen als in der Kontrolle.“', 'prediction'),
    classify('observationType', recovered ? 'Ordne zu: „Im Feld B1 stehen nach Saccharose 61 %, nach Rücktausch 89 %.“' : 'Ordne zu: „Im Feld B1 stehen nach Saccharose 58 %, nach Rücktausch 60 %.“', 'observation'),
    classify('explanationType', 'Ordne zu: „Eine gesicherte Volumenzunahme wäre mit erneuter osmotischer Wasseraufnahme vereinbar.“', 'explanation'),
    field('mechanism', 'Welche biologische Erklärung passt zur anfänglichen Wasserverlustphase?', [
      no('active_water','Eine aktive Wasserpumpe zieht die Vakuole leer.', 'Im Fall ist passive Wasserbewegung durch wasserpermeable Membranen gegeben. Eine aktive Wasserpumpe ist weder belegt noch erforderlich.'),
      yes('potential_membranes','Wasser bewegt sich entlang der gegebenen Gesamtwasserpotenziale durch Zellmembran und Tonoplast; Wasserverlust kann Volumen und Turgor vermindern, während die Wand vergleichsweise stabil bleibt.', 'Gesamtwasserpotenzial einschließlich Druck und Membranpermeabilität begründen die Wasserbilanz. Hinreichender weiterer Wasserverlust bei verlorenem Turgor kann Ablösung ermöglichen.'),
      no('wall_collapse','Saccharose lässt die Zellwand im selben Ausmaß wie den Protoplasten zusammenfallen.', 'Der Befund unterscheidet eine vergleichsweise formstabile Zellwand vom veränderlichen Protoplasten.'),
      no('concentration_always','Allein die Saccharosekonzentration bestimmt immer die Wasserrichtung; Druck spielt nie eine Rolle.', 'Die Richtung hängt vom Gesamtwasserpotenzial einschließlich Druck ab. Konzentration allein ist keine universelle Richtungsregel.'),
      part('water_only','Wasser verändert die Zelle.', 'Die Stoffart ist genannt; Potenziale, Membranen und die begrenzte Folge fehlen noch.'),
    ]),
    field('nextCheck', 'Welche weitere Untersuchung könnte eine Alternative gezielt eingrenzen, ohne ihre Ursache schon zu behaupten?', [
      yes('check_exchange','Restliche Saccharose in der Außenlösung nach dem Austausch mit geeigneter Konzentrationsmessung prüfen und einen kontrolliert vollständigen Austausch vergleichen.', 'Das prüft die Austauschhypothese. Ein Befund allein schließt zusätzliche Schädigung oder Zeitwirkungen nicht aus.'),
      no('declare_dead','Bei fehlender Erholung ohne weitere Messung Zelltod eintragen.', 'Das wäre dieselbe unbelegte Diagnose, keine unterscheidende Untersuchung.'),
      yes('extend_observation','Nach geprüftem Austausch dieselben Felder zu vorab festgelegten späteren Zeitpunkten weiterbeobachten, mit derselben Kontrolle.', 'Das prüft einen möglichen verzögerten Verlauf. Auch später fehlende Erholung beweist für sich keinen Zelltod.'),
      yes('check_integrity','Bei kontrolliertem Austausch zusätzliche, für das Präparat geeignete Membranintegritäts- oder Vitalitätsbefunde mit eigenen Kontrollen erheben.', 'Zusätzliche unabhängige Befunde können eine Schädigungshypothese eingrenzen. Eine bestimmte Ursache folgt nicht bereits aus der Volumenreihe.'),
      no('select_recovered','Nur nachträglich gut erholte Zellen in die Auswertung aufnehmen.', 'Ergebnisabhängige Auswahl verwirft Gegenbefunde und prüft keine Ursache zuverlässig.'),
    ]),
  ]);
}

export const M604_STEPS: readonly Readonly<{ title: string; fields: readonly M604Field[] }>[] = Object.freeze([
  { title: 'Frage & Vorhersage', fields: ['hypothesis','predictionType'] },
  { title: 'Versuch planen', fields: ['design','independent','dependent','fields','repetitions','sequence'] },
  { title: 'Kontrolle festlegen', fields: ['control','constants'] },
  { title: 'Befunde auswerten', fields: ['observation','observationType'] },
  { title: 'Biologisch deuten', fields: ['interpretation','mechanism','explanationType'] },
  { title: 'Aussage begrenzen', fields: ['limits','nextCheck'] },
  { title: 'Eigenen Plan begründen', fields: [] },
].map(step => Object.freeze({ ...step, fields: Object.freeze(step.fields as M604Field[]) })));

export const M604_WRITTEN_PROMPT = 'Plane eine Untersuchung, mit der du die aufgestellte Hypothese überprüfen kannst. Begründe deine Kontrolle, die Messgrößen und die Aussagekraft deiner Ergebnisse.';
export const M604_WRITING_RUBRIC = Object.freeze([
  { title: 'Hypothese prüfbar machen', evidence: 'Behandlung, Vergleich, Messgröße und erwarteten Unterschied so verknüpfen, dass ein möglicher Gegenbefund erkennbar ist.', incomplete: 'Fachwörter oder „etwas verändert sich“ ohne prüfbaren Vergleich.' },
  { title: 'Kontrolle begründen', evidence: 'Jede zentrale Kontrollbedingung einem möglichen Störeinfluss zuordnen; erklären, warum Wasser gegen Wasser bei gleichen Handgriffen und Zeiten hilft.', incomplete: 'Nur „Kontrollgruppe“ nennen oder bloß ein zweites beliebiges Präparat anbieten.' },
  { title: 'Reproduzierbar untersuchen', evidence: 'Markierte Zellfelder, vergleichbare Zeitpunkte, erster Durchgang plus zwei Wiederholungen, vollständige Lösungsfolge und Rücktausch nachvollziehbar festlegen.', incomplete: 'Eine unvollständige Schrittfolge oder mehrere Fotos desselben Zustands als Wiederholungen zählen.' },
  { title: 'Messqualität und Schlussfolgerung', evidence: 'Messgröße und Unsicherheit passend auswerten, Befund von Erklärung trennen, Ergebnisse auf diese Präparate begrenzen und fehlende Erholung ohne Zelltodbehauptung diskutieren.', incomplete: 'Zahlen oder Fachbegriffe wiederholen, ohne ihre Aussagekraft zu begründen.' },
  { title: 'Alternativen gezielt prüfen', evidence: 'Mindestens eine alternative Erklärung bedingt formulieren und eine weitere Untersuchung nennen, deren möglicher Befund zwischen Erklärungen unterscheiden hilft.', incomplete: 'Eine Ursache sicher behaupten oder nur „noch einmal testen“ ohne unterscheidenden Vergleich schreiben.' },
]);
