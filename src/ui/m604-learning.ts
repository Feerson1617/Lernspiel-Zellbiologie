import './m602-learning.css';
import './m604-learning.css';
import type { M604LearningController } from '../application/m604-learning.ts';
import { m604Fields, M604_STEPS, M604_WRITING_RUBRIC, M604_WRITTEN_PROMPT } from '../content/m604-learning.ts';
import type { M604Field } from '../domain/m604-contract.ts';
import { STATUS_PRESENTATION } from './feedback-presentation.ts';
import { mountInvestigationField } from './investigation-fields.ts';

const criterionNames: Record<M604Field,string> = {
  control:'Kontrollansatz', interpretation:'Rücktausch deuten', limits:'Aussagegrenzen', hypothesis:'Prüfbare Hypothese', design:'Fairer Vergleich',
  independent:'Unabhängige Größe', dependent:'Abhängige Größe', constants:'Konstante Bedingungen', fields:'Markierte Zellfelder',
  repetitions:'Wiederholungen', sequence:'Zeitlicher Ablauf', observation:'Befund beschreiben', predictionType:'Vorhersage erkennen',
  observationType:'Beobachtung erkennen', explanationType:'Erklärung erkennen', mechanism:'Biologische Begründung', nextCheck:'Alternative gezielt prüfen',
};
export function mountM604Learning(root: HTMLElement, model: M604LearningController, remount: () => void) {
  root.replaceChildren();
  function node<K extends keyof HTMLElementTagNameMap>(tag: K, text = '', parent: HTMLElement = root, cls = ''): HTMLElementTagNameMap[K] {
    const element = document.createElement(tag); element.textContent = text; if (cls) element.className = cls; parent.append(element); return element;
  }
  function button(text: string, parent: HTMLElement, action: () => void, cls = '') {
    const value = node('button',text,parent,cls); value.type = 'button'; value.addEventListener('click',action); return value;
  }
  const skip = node('a','Zur Untersuchungsplanung',root,'skip-link'); skip.href = '#untersuchung';
  const header = node('header','',root,'site-header learning-header'); node('a','Zelllabor 11',header,'brand').href = '#/';
  node('span','Biologie · Jahrgang 11',header,'header-subject');
  const main = node('main','',root,'learning-page investigation-page'); main.lang = 'de';
  const intro = node('section','',main,'learning-intro');
  node('p','Übungsvorschau · M6.04',intro,'eyebrow');
  const h1 = node('h1','Kontrolle und Rücktausch untersuchen',intro); h1.tabIndex = -1;
  node('p','Wie lässt sich prüfen, ob eine Zwiebelzelle durch die Lösungsbehandlung verändert wird – und was lässt sich aus einer späteren Erholung schließen?',intro,'learning-lead');
  node('p','Eine virtuelle Untersuchung mit eigens erstellten didaktischen Befunden. Du planst, vergleichst und begründest. Hier wird kein Laborversuch ausgeführt und keine neue physikalische Simulation berechnet.',intro,'learning-note');
  const routeNav = node('nav','',intro,'learning-steps'); routeNav.setAttribute('aria-label','Verbundene Übungen');
  node('a','Wasserhaushalt wiederholen (M6.02)',routeNav).href = '#/m602';
  node('a','Ursache und Wirkung verknüpfen (M6.03)',routeNav).href = '#/m603';
  node('a','Zur Startseite',routeNav).href = '#/';
  const live = node('p','',main,'visually-hidden'); live.setAttribute('role','status'); live.setAttribute('aria-atomic','true');
  const initial = model.getState(), material = initial.material, definitions = m604Fields(initial.caseId);
  const caseCard = node('section','',main,'investigation-case');
  node('h2',initial.caseId === 'recovery' ? 'Untersuchungsfall A' : 'Untersuchungsfall B',caseCard);
  node('p','Beide Fälle verwenden denselben Untersuchungsplan, aber unterschiedliche Rücktauschbefunde. Jeder ist frei erreichbar. Beim Wechsel werden Antworten und eigene Texte geleert; aufgerufene Hilfen bleiben in dieser Sitzung erfasst.',caseCard,'learning-note');
  button(initial.caseId === 'recovery' ? 'Zu Untersuchungsfall B wechseln' : 'Zu Untersuchungsfall A wechseln',caseCard,() => {
    model.activateCase(model.getState().caseId === 'recovery' ? 'limited' : 'recovery'); remount(); root.querySelector<HTMLElement>('h1')?.focus();
  }).id = 'm604-case';
  const foundation = node('details','',main,'learning-material investigation-foundation'); foundation.open = initial.step === 0;
  node('summary','Material und biologische Grundlage',foundation);
  node('p','Ausgangsmaterial: frische, zunächst intakte Zwiebel-Epidermis ohne Chloroplasten. Zu Beginn besteht positiver Turgor. Wie sich die Membranfunktion später entwickelt, wurde nicht eigens gemessen.',foundation);
  node('p','In der betrachteten Wasserverlustphase gilt für die Gesamtwasserpotenziale einschließlich Druck: Vakuole > Cytosol > Außenraum. Wasser kann Tonoplast und Zellmembran passieren; Saccharose bleibt im Beobachtungszeitraum weitgehend außen. Ein höheres Wasserpotenzial bedeutet hier einen weniger negativen Wert.',foundation);
  node('p','Wasserverlust kann Vakuolen- und Protoplastvolumen und Turgor vermindern. Die Zellwand bleibt vergleichsweise formstabil. Nach vollständigem Turgorverlust kann hinreichender weiterer Wasserverlust eine Ablösung des Protoplasten ermöglichen. Anfangs Wasserverlust bedeutet noch keine garantierte Ablösung.',foundation);
  node('p','Beim Rücktausch wird wieder Wasser angeboten. Aufnahme hängt erneut von Gesamtwasserpotenzialen und funktionsfähigen wasserpermeablen Membranen ab. Vollständiger Austausch, spätere Potenziale und Membranfunktion sind keine gesicherten Messwerte. Eine sofortige vollständige Deplasmolyse wird nicht vorausgesetzt.',foundation);
  node('p','Verfügbare Methoden: Lösungswechsel, wiederholte Bildstapel zur Volumenschätzung und Zählen sichtbarer Ablösungen. Überlege selbst: Welche Messgröße prüft deine Hypothese? Womit vergleichst du? Welche Bedingungen hältst du gleich?',foundation);
  const planningLabel = node('label','Mein erster Plan: Messgröße, Vergleich und konstante Bedingungen – unbewertet',foundation); planningLabel.htmlFor = 'm604-planning';
  const planning = node('textarea','',foundation); planning.id = planningLabel.htmlFor; planning.rows = 3; planning.value = initial.planning;
  planning.addEventListener('input',() => model.editPlanning(planning.value));
  node('p','Notiere zuerst deinen Plan. Danach kannst du ihn mit dem Standardplan vergleichen, aus dem die bereitgestellten Daten stammen.',foundation);
  const standardPlan = node('details','',foundation); standardPlan.id = 'm604-standard-plan';
  node('summary','Standardplan zum Vergleich bewusst öffnen',standardPlan);
  standardPlan.addEventListener('toggle',() => { if (standardPlan.open) { model.help('planning',2); refresh(); } });
  node('p','Versuchsrahmen: drei gepaarte Durchgänge an frischen Präparaten derselben Zwiebel – ein erster Durchgang und zwei technische Wiederholungen. Behandlung und Kontrolle erhalten jeweils eigene markierte Felder mit zehn Zellen. In jedem Feld werden dieselben Zellen erneut betrachtet.',standardPlan);
  node('p','Geplante Zeitpunkte: Ausgangsbefund in Wasser; Befund 6 Minuten nach Saccharosezugabe (Kontrolle: Wasser); weiterer Befund 6 Minuten nach Rücktausch zu Wasser. Das sind didaktisch gewählte Beobachtungsabstände, keine gemessene universelle Reaktionsdauer.',standardPlan);
  node('p','Messgrößen: mittleres relatives Protoplastvolumen, als Schätzung aus gedachten Bildstapeln (eigener Ausgangswert = 100 %; Unsicherheit ±4 Prozentpunkte je Schätzung), und Zahl abgelöster Protoplasten unter den zehn markierten Zellen. Ein einzelnes flaches Bild würde keine direkte Volumenmessung liefern.',standardPlan);
  node('p','Drei technische Wiederholungen derselben Zwiebel sind kein Nachweis für alle Zwiebeln oder Pflanzenzellen. Die Übung bestätigt weder praktisches Präparieren noch Mikroskopieren.',standardPlan,'learning-note');

  const workspace = node('section','',main,'investigation-workspace'); workspace.id = 'untersuchung'; workspace.tabIndex = -1;
  skip.addEventListener('click',event => { event.preventDefault(); workspace.focus(); workspace.scrollIntoView({ block:'start' }); });
  const coreFields: readonly M604Field[] = ['hypothesis','dependent','control','observation','interpretation','limits'];
  let expanded = false;
  node('p','Kernweg: Hypothese → Messgröße → Kontrolle → Befund → begrenzte Deutung. Die Vertiefung ergänzt weitere Entscheidungen. Ein bearbeiteter Kernweg bestätigt noch keine vollständige Untersuchung.',workspace,'learning-note');
  const depth = button('Vertiefung: alle Entscheidungen anzeigen',workspace,() => { expanded = !expanded; depth.setAttribute('aria-expanded',String(expanded)); depth.textContent = expanded ? 'Kernweg anzeigen' : 'Vertiefung: alle Entscheidungen anzeigen'; refresh(); }); depth.id = 'm604-depth'; depth.setAttribute('aria-expanded','false');
  const coreProgress = node('p','',workspace,'learning-note'); coreProgress.id = 'm604-core-progress';
  const stepsNav = node('nav','',workspace,'investigation-steps'); stepsNav.setAttribute('aria-label','Schritte der Untersuchung');
  const stepButtons = M604_STEPS.map((step,index) => button(`${index + 1}. ${step.title}`,stepsNav,() => go(index)));
  const panels = M604_STEPS.map((step,index) => {
    const section = node('section','',workspace,'investigation-step'); section.dataset['step'] = String(index); section.id = `m604-step-${index}`;
    const title = node('h2',`${index + 1}. ${step.title}`,section); title.tabIndex = -1;
    section.setAttribute('aria-labelledby',`m604-step-title-${index}`); title.id = `m604-step-title-${index}`;
    return section;
  });
  node('p','Formuliere zunächst eine eigene Erwartung. Du kannst eine der überprüfbaren Hypothesen wählen und/oder einen eigenen unbewerteten Satz notieren. Eine überprüfbare Hypothese muss nicht durch jeden späteren Befund bestätigt werden.',panels[0]);
  const predictionLabel = node('label','Meine eigene Vorhersage – nicht automatisch bewertet',panels[0]); predictionLabel.htmlFor = 'm604-prediction';
  const prediction = node('textarea','',panels[0]); prediction.id = 'm604-prediction'; prediction.rows = 3; prediction.value = initial.prediction;
  const predictionNote = node('p','',panels[0],'learning-note');
  const originalPrediction = node('details','',panels[0]);
  node('summary','Meine Vorhersage vor der ersten Datenansicht',originalPrediction);
  const originalText = node('p','',originalPrediction), originalChoice = node('p','',originalPrediction);
  prediction.addEventListener('input',() => { model.editPrediction(prediction.value); updatePrediction(); });
  node('p','Lege deine Messgröße fest. In der Vertiefung ergänzt du Behandlung und zeitlichen Vergleich. Die bereitgestellten Befunde stammen aus dem bewusst aufrufbaren Standardplan. Sie werden durch deine Auswahl nicht neu simuliert.',panels[1]);
  node('p','Ein geeigneter Kontrollansatz lässt die Behandlung als gezielten Unterschied stehen und macht andere Einflüsse vergleichbar. Wähle die Bausteine einzeln.',panels[2]);
  node('p','Öffne die Befunde nach deiner Planung. Die erste Vorhersage bleibt in dieser Sitzung als Entwurf vor der Datenansicht nachvollziehbar. Eine spätere Änderung wird als Überarbeitung nach Einsicht gekennzeichnet. Du darfst die Daten auch schon vor deiner Planung öffnen.',panels[3]);
  const reveal = button('Didaktische Befunde öffnen',panels[3]!,() => { model.revealObservations(); refresh(); data.focus(); live.textContent = 'Befunde geöffnet. Die eigene Vorhersage bleibt unbewertet.'; },'learning-primary'); reveal.id = 'm604-reveal';
  const data = node('section','',panels[3],'investigation-data'); data.tabIndex = -1; data.setAttribute('aria-label','Didaktische Beobachtungsdaten'); data.hidden = !initial.observationsVisible;
  node('h3','Bereitgestellte Befunde · keine echten Messungen',data);
  node('p','Jede Zeile gehört zum selben markierten Zellfeld. Vakuolen sind nach Saccharose kleiner; die Zellwand bleibt in allen dargestellten Phasen vergleichsweise formstabil. Für das Protoplastvolumen gilt ±4 Prozentpunkte Unsicherheit je Schätzung.',data);
  const phaseNames = ['Ausgangsbefund · 0 min','Nach Behandlung · 6 min','Nach Rücktausch · 12 min'] as const;
  for (let run = 0; run < 3; run++) {
    const details = node('details','',data,'investigation-run'); details.open = run === 0;
    node('summary',run === 0 ? 'Erster Durchgang · Felder B1 und K1' : `Wiederholung ${run} · Felder B${run + 1} und K${run + 1}`,details);
    const pair = node('div','',details,'investigation-pair');
    for (const kind of ['treatment','control'] as const) {
      const column = node('section','',pair,'investigation-series');
      node('h3',kind === 'treatment' ? `B${run + 1} · Saccharose → Wasser` : `K${run + 1} · Wasser → Wasser`,column);
      const list = node('ol','',column);
      phaseNames.forEach((phase,index) => {
        const li = node('li','',list); node('strong',phase,li);
        const values = node('dl','',li);
        node('dt','Relatives Protoplastvolumen',values); node('dd',`${material.records[`${kind}Volume`][run]![index]} %`,values);
        node('dt','Abgelöste Protoplasten',values); node('dd',`${material.records[`${kind}Detached`][run]![index]} von 10`,values);
      });
    }
  }
  node('p','Beobachtungsdaten verändern sich nicht, wenn du deine Antworten änderst. Sie sind keine Live-Simulation.',data,'learning-note');
  const dataNeeded: HTMLElement[] = [];
  for (const index of [4,5]) {
    const note = node('p','Öffne zuerst die bereitgestellten Befunde in Schritt 4. Du kannst deine Planung unabhängig davon bearbeiten.',panels[index],'learning-note'); dataNeeded.push(note);
  }
  const fields = new Map<M604Field,ReturnType<typeof mountInvestigationField<M604Field>>>();
  M604_STEPS.forEach((step,index) => {
    for (const id of step.fields) {
      const definition = definitions.find(f => f.id === id)!;
      fields.set(id,mountInvestigationField(panels[index]!,definition,selected => {
        model.edit(id,selected); refresh(); live.textContent = `${criterionNames[id]} geändert. Prüfe die aktuellen Entscheidungen erneut.`;
      },'m604'));
    }
  });
  node('p','Ein Anstieg kann eine begrenzte Deutung stützen. Eine konkrete Schädigungsursache oder Zelltod erfordert zusätzliche Befunde. Wähle eine passende weitere Untersuchung, nicht nur eine weitere Behauptung.',panels[5]);

  node('p',M604_WRITTEN_PROMPT,panels[6],'investigation-writing-prompt');
  node('p','Schreibe auf Papier oder hier im flüchtigen Arbeitsbereich. Der vollständige eigene Text wird ausdrücklich nicht automatisch benotet. Ein grünes Ergebnis der Auswahlfelder bewertet diesen Text nicht.',panels[6],'learning-note');
  const writingLabel = node('label','Mein eigener Versuchsplan – nicht automatisch bewertet',panels[6]); writingLabel.htmlFor = 'm604-writing';
  const writing = node('textarea','',panels[6]); writing.id = 'm604-writing'; writing.rows = 10; writing.value = initial.writing;
  writing.addEventListener('input',() => model.editWriting(writing.value));
  node('h3','Kriterienraster für Jahrgang 11',panels[6]);
  node('p','Für Selbst-, Partner- oder Lehrkraftprüfung: Je Kriterium „begründet erfüllt“, „Ansatz vorhanden“ oder „noch nicht belegt“ markieren. Entscheidend sind nachvollziehbare Verknüpfungen und Gründe; eine bloße Fachwortliste genügt nicht. Es gibt keine automatische Gesamtnote.',panels[6]);
  const rubric = node('ol','',panels[6],'investigation-rubric');
  for (const criterion of M604_WRITING_RUBRIC) {
    const li = node('li','',rubric); node('h3',criterion.title,li); node('p',`Begründet erfüllt: ${criterion.evidence}`,li); node('p',`Noch nicht ausreichend: ${criterion.incomplete}`,li,'learning-note');
    const label = node('label','',li,'reflection-item'); const check = node('input','',label); check.type = 'checkbox';
    node('span','Ich habe dieses Kriterium im eigenen Text geprüft.',label);
  }
  node('p','Nutze den nächsten unbekannten Befund, um deinen Plan selbstständig anzupassen: Welche Annahmen, Messgrößen und Kontrollen müsstest du neu begründen? Die Übung bildet keine reservierte Klausuraufgabe nach.',panels[6]);
  const actions = node('div','',workspace,'investigation-actions');
  const previous = button('Voriger Schritt',actions,() => go(model.getState().step - 1)); previous.id = 'm604-previous';
  const next = button('Nächster Schritt',actions,() => go(model.getState().step + 1)); next.id = 'm604-next';
  const check = button('Strukturierte Entscheidungen prüfen',workspace,() => { model.submit(); refresh(); feedback.focus(); live.textContent = `Strukturierte Untersuchung: ${STATUS_PRESENTATION[model.getState().outcome!.status].label}. Eigene Texte sind nicht bewertet.`; },'learning-primary'); check.id = 'm604-check';
  node('p','Alle Schritte sind frei anwählbar. Du kannst auch einen unvollständigen Entwurf prüfen und selbst überarbeiten.',workspace,'learning-note');

  const feedback = node('section','',main,'learning-feedback investigation-feedback'); feedback.tabIndex = -1; feedback.setAttribute('aria-label','Rückmeldung zur Untersuchung');
  const help = node('section','',main,'learning-helpers'); help.setAttribute('aria-label','Hilfen zur Untersuchung'); node('h2','Hilfen zum aktuellen Schritt',help);
  node('p','Die Vergleichslösung öffnet auch die Befunde. Hinweise, Strukturhilfe und eine ausdrücklich aufgerufene Vergleichslösung bleiben getrennt vom fachlichen Ergebnis vermerkt. Deine Auswahl wird nicht automatisch ausgefüllt.',help,'learning-note');
  const helpActions = node('div','',help,'help-actions'), helpText = node('div','',help,'help-text'); helpText.setAttribute('role','status');
  const hints = {
    planning: ['Welche Einflüsse außer der Lösung könnten einen Unterschied erzeugen? Welche Messgröße würde deine Erwartung überhaupt prüfen?', 'Trenne gezielt veränderte Lösung, gemessene Reaktion und konstante Bedingungen. Plane dieselben markierten Felder, vergleichbare Zeitabstände sowie einen ersten Durchgang und zwei vollständige Wiederholungen.'],
    evidence: ['Was steht tatsächlich in den Daten, und welche Aussage erklärt es erst biologisch? Vergleiche auch die Unsicherheit.', 'Vergleiche nach dem Rücktausch mit der Saccharosephase und mit der Kontrolle. Ein klarer Anstieg muss größer als die Schätzunsicherheit sein. Eine Volumenreihe zeigt nicht unmittelbar die Membranfunktion oder Zelltod.'],
    limits: ['Welche weitere Beobachtung könnte zwischen Restlösung, Zeit und möglicher Schädigung unterscheiden?', 'Formuliere Ursachen als Möglichkeiten. Prüfe den Austausch gezielt, verlängere kontrolliert die Beobachtung oder erhebe zusätzliche geeignete Integritätsbefunde. Keine einzelne fehlende Erholung legt die Ursache eindeutig fest.'],
  } as const;
  for (const level of [1,2,3] as const) {
    const value = button(level === 1 ? 'Hinweis' : level === 2 ? 'Strukturhilfe' : 'Vergleichslösung ansehen',helpActions,() => {
      const step = model.getState().step, topic = step < 3 ? 'planning' : step < 5 ? 'evidence' : 'limits';
      model.help(level === 3 ? 'comparison' : topic,level); helpText.replaceChildren();
      if (level < 3) node('p',hints[topic][level - 1]!,helpText);
      else {
        node('p','Eine mögliche vollständige strukturierte Untersuchung. Andere ausdrücklich zulässige Wege bleiben richtig. Der eigene schriftliche Plan wird damit nicht bewertet.',helpText);
        const list = node('ul','',helpText);
        for (const field of definitions) {
          const selected = field.options.filter(o => field.required.includes(o.id));
          for (const o of field.options) if (o.status === 'correct' && selected.length < field.minimumCorrect && !selected.includes(o)) selected.push(o);
          node('li',`${criterionNames[field.id]}: ${selected.map(o => o.label).join(' ')} ${selected.map(o => o.reason).join(' ')}`,list);
        }
      }
      refresh(); live.textContent = level === 3 ? 'Vergleichslösung als angesehen erfasst.' : 'Digitale Hilfe erfasst. Aktuelle Entscheidungen erneut prüfen.';
    }); value.id = `m604-help-${level}`;
  }
  const support = node('section','',main,'learning-support'); support.setAttribute('aria-label','Unterstützung und Sitzungsstand');
  const reset = node('section','',main,'learning-repeat');
  node('p','Ein Neuladen verliert eigene Texte, Entscheidungen und Sitzungsbelege. Zur Startseite und zwischen den Übungen kannst du innerhalb dieser Sitzung wechseln. Hilfeereignisse und frühere Datenansicht werden durch das Leeren nicht als ungesehen ausgegeben.',reset,'learning-note');
  button('Entwurf für diesen Fall leeren',reset,() => { model.reset(); remount(); root.querySelector<HTMLElement>('h1')?.focus(); }).id = 'm604-reset';
  const footer = node('footer','',root,'site-footer'); node('span','Übungsvorschau · keine Unterrichtsfreigabe und kein praktischer Methodennachweis',footer);

  function updatePrediction() {
    const current = model.getState(); predictionNote.textContent = (current.seenDataBefore ? 'Die Befunde wurden bereits angesehen. Eine jetzt formulierte Erklärung ist keine ursprüngliche Vorhersage mehr. ' : '') + (current.predictionAfterData
      ? 'Nach Einsicht in die Befunde formuliert oder überarbeitet. Der eigene Satz bleibt unbewertet.'
      : current.predictionBeforeData ? 'Die erste Vorhersage wurde vor der Datenansicht in dieser Sitzung festgehalten. Der eigene Satz bleibt unbewertet.'
        : 'Noch vor der ersten Datenansicht dieses Falls in dieser Sitzung. Eigener Text wird nicht automatisch bewertet.');
    originalPrediction.hidden = current.predictionBeforeData === null;
    originalText.textContent = current.predictionBeforeData?.text || 'Vor der ersten Datenansicht war kein eigener Satz notiert.';
    const hypothesis = definitions.find(field => field.id === 'hypothesis')!;
    originalChoice.textContent = current.predictionBeforeData?.hypothesis.map(id => hypothesis.options.find(option => option.id === id)!.label).join(' ')
      || 'Vor der ersten Datenansicht war keine Hypothese ausgewählt.';
  }
  function go(index: number) {
    model.setStep(index); refresh(); const target = panels[index]!.querySelector<HTMLElement>('h2')!; target.focus(); target.scrollIntoView({ block:'start' });
  }
  function refresh() {
    const current = model.getState();
    panels.forEach((panel,index) => { panel.hidden = current.step !== index; });
    stepButtons.forEach((btn,index) => { if (index === current.step) btn.setAttribute('aria-current','step'); else btn.removeAttribute('aria-current'); });
    previous.disabled = current.step === 0; next.disabled = current.step === 6;
    for (const [id,field] of fields) {
      field.refresh(current.answer[id]);
      const closedData = !current.observationsVisible && ['observation','observationType','interpretation'].includes(id);
      field.element.hidden = closedData || (!expanded && !coreFields.includes(id));
      field.element.disabled = field.element.hidden;
    }
    const coreDone = current.observationsVisible && coreFields.every(id => current.answer[id].length > 0);
    coreProgress.textContent = coreDone ? 'Kernweg bearbeitet. Dies beschreibt den Bearbeitungsstand, keine fachliche Richtigkeit und keinen vollständigen Untersuchungsbeleg. Prüfe deine Entscheidungen; für die vollständige strukturierte Leistung sind auch alle Vertiefungen nötig.' : 'Kernweg noch offen. Bearbeite Hypothese, Messgröße, Kontrolle, Befund und begrenzte Deutung.';
    data.hidden = !current.observationsVisible; reveal.disabled = current.observationsVisible; reveal.textContent = current.observationsVisible ? 'Befunde sind geöffnet' : 'Didaktische Befunde öffnen';
    dataNeeded.forEach(note => { note.hidden = current.observationsVisible; }); updatePrediction();
    feedback.replaceChildren();
    const status = current.stale ? 'empty' : current.outcome?.status ?? 'empty', presentation = STATUS_PRESENTATION[status];
    feedback.dataset['status'] = current.stale ? 'stale' : status; feedback.dataset['color'] = current.stale ? 'neutral' : presentation.color;
    node('h2',current.stale ? '○ Rückmeldung nicht mehr aktuell' : !current.outcome ? '○ Noch keine Entscheidungen geprüft' : `${presentation.symbol} Strukturierte Untersuchung: ${presentation.label}`,feedback);
    if (current.stale) node('p','Entscheidungen, Datenansicht oder Unterstützung geändert. Prüfe den aktuellen Entwurf erneut. Der frühere Beleg bestätigt diesen Stand nicht.',feedback);
    else if (current.outcome) {
      node('p',current.outcome.message,feedback);
      const list = node('ol','',feedback,'investigation-criteria');
      for (const criterion of current.outcome.criteria) {
        if ((!current.observationsVisible && ['observation','observationType','interpretation'].includes(criterion.field))
          || (!expanded && !coreFields.includes(criterion.field) && criterion.id !== 'M6.04.C18' && current.answer[criterion.field].length === 0)) continue;
        const display = STATUS_PRESENTATION[criterion.status], li = node('li','',list);
        const title = criterion.id === 'M6.04.C18' ? 'Hypothese und Messgröße verbinden' : criterionNames[criterion.field];
        li.dataset['criterionFeedback'] = criterion.id;
        if (criterion.id !== 'M6.04.C18') li.dataset['fieldFeedback'] = criterion.field;
        li.dataset['color'] = display.color; li.dataset['status'] = criterion.status;
        node('h3',`${display.symbol} ${title}: ${display.label}`,li);
        node('p',criterion.text,li);
        const detail = node('details','',li); node('summary','Gewählte Entscheidungen und Begründung',detail);
        for (const decision of criterion.decisions) {
          const choice = STATUS_PRESENTATION[decision.status], p = node('p',`${choice.symbol} ${decision.label} ${decision.reason}`,detail); p.dataset['color'] = choice.color;
        }
        if (criterion.status !== 'correct') button(`${title} selbst überarbeiten`,li,() => {
          const index = M604_STEPS.findIndex(s => s.fields.includes(criterion.field)); go(index);
          fields.get(criterion.field)!.element.querySelector<HTMLInputElement>('input:not(:disabled)')?.focus();
        });
      }
      if (status === 'correct') button('Zum eigenen schriftlichen Versuchsplan',feedback,() => go(6));
    } else node('p','Wähle und begründe deinen Untersuchungsweg. Richtige Teilentscheidungen bleiben bei der Prüfung sichtbar.',feedback);
    support.replaceChildren(); node('h2','Unterstützung und Sitzungsstand',support);
    node('p',current.assistance === 'solution_viewed' ? 'Vergleichslösung angesehen – auch beim Fallwechsel bleibt diese Unterstützung erfasst.'
      : current.assistance === 'hint' ? 'Digitale Hilfe aufgerufen. Fachliches Ergebnis und Hilfenutzung bleiben getrennt.'
        : 'In dieser Sitzung keine zusätzliche digitale Hilfe aufgerufen. Das ist kein Erstleistungs- oder Beherrschensnachweis.',support);
    if (current.historyUnverified) node('p','Frühere Hilfehistorie nicht gesichert. Fachliche Rückmeldung ist möglich, ein aktueller Erfolgsbeleg wird nicht erzeugt.',support);
    node('p',current.receipt ? 'Aktueller geprüfter Sitzungsbeleg für die strukturierten Entscheidungen. Keine Benotung des freien Versuchsplans.' : 'Kein aktueller Erfolgsbeleg für diese Untersuchung.',support);
    if (current.revisedAfterFeedback) node('p','Nach Rückmeldung selbst überarbeitet.',support);
    node('p','Entwürfe, Rohantworten, Hilfeereignisse und Belege bleiben flüchtig. Es gibt keine dauerhafte M6.04-Speicherung und keine Übertragung deiner Texte. Externe Unterstützung kann die Anwendung nicht erkennen.',support,'learning-note');
    const history = node('details','',support); node('summary',`Herkunft der digitalen Hilfen (${current.help.length})`,history);
    const log = node('ol','',history); for (const event of current.help) node('li',`${event.taskId} · ${event.source} · Stufe ${event.level} · ${event.kind === 'solution_viewed' ? 'Lösung angesehen' : 'Hinweis/Strukturhilfe'}`,log);
  }
  refresh();
}
