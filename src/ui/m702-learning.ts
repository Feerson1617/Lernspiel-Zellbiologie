import type { M702Learning } from '../application/m702-learning.ts';
import type { M702Feedback } from '../assessment/m702.ts';
import type { Status } from '../domain/contracts.ts';
import { M702_CRITERIA, M702_HELP, M702_MATERIAL, M702_OPTIONS } from '../content/m702.ts';
import { STATUS_PRESENTATION } from './feedback-presentation.ts';
import './m602-learning.css';
import './m702-learning.css';

export function mountM702Learning(root: HTMLElement, model: M702Learning): void {
  function node<K extends keyof HTMLElementTagNameMap>(tag: K, text = '', parent: HTMLElement = root, cls = '') {
    const element = document.createElement(tag); element.textContent = text; element.className = cls; parent.append(element); return element;
  }
  function button(text: string, parent: HTMLElement, action: () => void) {
    const b = node('button', text, parent); b.type = 'button'; b.addEventListener('click', action); return b;
  }
  function focus(element: HTMLElement) { element.focus(); element.scrollIntoView({ block: 'start' }); }
  const skip = node('a', 'Zum Inhalt', root, 'skip-link'); skip.href = '#inhalt';
  skip.addEventListener('click', event => { event.preventDefault(); focus(main); });
  const header = node('header', '', root, 'site-header'); node('a', 'Zelllabor 11 · Zur Startseite', header, 'brand').href = '#/';
  const main = node('main', '', root, 'learning-page transport-page'); main.id = 'inhalt'; main.tabIndex = -1; main.lang = 'de';
  node('p', 'Einzelner Trainingsbaustein · M7.02', main, 'eyebrow');
  node('h1', 'Was zeigt die schnellere Stoffaufnahme?', main).tabIndex = -1;
  node('p', 'Material lesen → selbst argumentieren → zusätzliche Information begründen → vergleichen und überarbeiten', main, 'learning-lead');
  node('p', 'Deine Argumentation und dein Untersuchungsvorschlag werden nicht automatisch fachlich bewertet. Es gibt keine Note und keinen automatischen Nachweis für den gesamten Text.', main, 'learning-note');
  const material = node('div', '', main, 'transport-materials');
  const conditions = node('section', '', material, 'learning-material'); conditions.dataset['materialCard'] = 'conditions';
  node('h2', 'Material 1 · Vergleichsbedingungen', conditions);
  node('p', 'Neu konstruierter didaktischer Modellfall, keine realen Messdaten: Ein ungeladener Stoff X gelangt durch eine Biomembran in einen abgegrenzten Innenraum. X wird dabei weder chemisch verändert noch gebunden oder in andere Kompartimente verschoben.', conditions);
  node('p', `Zu Beginn beträgt die Konzentration außen ${M702_MATERIAL.outside} mmol/L und innen ${M702_MATERIAL.inside} mmol/L. Zwei Ansätze unterscheiden sich nur darin, ob Protein P in der Membran vorhanden ist. Temperatur, Membranfläche und Anfangskonzentrationen sind gleich.`, conditions);
  const findings = node('section', '', material, 'learning-material'); findings.dataset['materialCard'] = 'findings';
  node('h2', 'Material 2 · Anfangsaufnahme', findings);
  const table = node('table', '', findings); node('caption', 'Anfängliche Nettoaufnahme in den Innenraum', table);
  const tr = node('tr', '', node('thead', '', table)); node('th', 'Ansatz', tr).scope = 'col'; node('th', 'Aufnahmerate', tr).scope = 'col';
  const tbody = node('tbody', '', table);
  for (const [label, value] of [['Ohne P', M702_MATERIAL.withoutP], ['Mit P', M702_MATERIAL.withP]] as const) {
    const row = node('tr', '', tbody); node('th', label, row).scope = 'row'; node('td', `${value} ${M702_MATERIAL.rateUnit}`, row);
  }
  node('p', 'Die Rate gibt die Stoffmenge je Minute und Membranfläche an. Eine Energiequelle oder Energieabhängigkeit wurde nicht untersucht.', findings);
  const initial = model.getState();
  const writingInputs: HTMLTextAreaElement[] = [], writingLabels: HTMLLabelElement[] = [];
  function writingStep(id: 'argument' | 'investigation', title: string, prompt: string, labelText: string) {
    const section = node('section', '', main, 'transport-step'); section.dataset['workOrder'] = id;
    node('h2', title, section); node('p', prompt, section);
    const label = node('label', labelText, section); label.htmlFor = `m702-${id}`; writingLabels.push(label);
    const input = node('textarea', '', section); input.id = label.htmlFor; input.rows = 5; input.autocomplete = 'off'; input.value = initial.writing[id];
    input.addEventListener('input', () => model.edit(id, input.value)); writingInputs.push(input); return input;
  }
  const argument = writingStep('argument', 'A · Begründe deine erste Einschätzung', 'Formuliere einen konkreten Materialbeleg, eine daraus begründete Schlussfolgerung und eine Aussagegrenze. Verbinde diese drei Teile in einer kurzen eigenen Argumentation.', 'Meine Argumentation');
  writingStep('investigation', 'B · Begründe eine zusätzliche Information', 'Welche zusätzliche Untersuchung oder Information könnte die offene Energiefrage klären? Erkläre kurz, warum sie deine Schlussfolgerung erweitern oder einschränken könnte. Gefragt ist ein erster begründeter Vorschlag, kein vollständiger Versuchsplan.', 'Mein Untersuchungsvorschlag');
  const revisionNote = node('p', '', main, 'learning-note'); revisionNote.id = 'm702-writing-state';
  writingInputs.forEach(input => input.setAttribute('aria-describedby', revisionNote.id));
  const stepC = node('section', '', main, 'transport-step'); stepC.dataset['workOrder'] = 'review';
  node('h2', 'C · Vergleiche und überarbeite', stepC);
  node('p', 'Halte deine Erstfassung fest, bevor du die Kriterien öffnest. Du kannst den Vergleich auch früher öffnen; ein fehlender eigener Entwurf wird dann nicht als ursprüngliche Eigenleistung ausgewiesen.', stepC);
  button('Erstfassung festhalten und Kriterien vergleichen', stepC, () => { model.openReview(); refresh(); focus(criteriaTitle); });
  const review = node('div', '', stepC); review.id = 'm702-review';
  const criteriaTitle = node('h3', 'Kriterien für Selbst-, Partner- oder Lehrkraftprüfung', review); criteriaTitle.tabIndex = -1;
  const rubric = node('ul', '', review); M702_CRITERIA.forEach(text => node('li', text, rubric));
  const first = node('details', '', review); node('summary', 'Festgehaltene Erstfassung anzeigen', first);
  const firstInfo = node('p', '', first, 'learning-note');
  node('h3', 'Argumentation beim ersten Vergleich', first); const firstArgument = node('p', '', first, 'transport-original'); firstArgument.id = 'm702-original-argument';
  node('h3', 'Untersuchungsvorschlag beim ersten Vergleich', first); const firstInvestigation = node('p', '', first, 'transport-original'); firstInvestigation.id = 'm702-original-investigation';
  button('Eigene Fassung überarbeiten', review, () => focus(argument));
  const selection = node('details', '', review); node('summary', 'Einzelne Aussagen zum Material prüfen (freiwillig)', selection);
  node('p', 'Wähle alle Aussagen zu Befund und Energiegrenze, die du vertreten möchtest. Dieser kleine Abgleich prüft nur deine Auswahl; er ersetzt weder deine Begründung noch den Untersuchungsvorschlag.', selection);
  const form = node('form', '', selection); const fieldset = node('fieldset', '', form);
  node('legend', 'Welche Aussagen sind durch das Material gerechtfertigt?', fieldset);
  const checks = new Map<string, HTMLInputElement>(), outputs = new Map<string, HTMLElement>();
  for (const option of M702_OPTIONS) {
    const row = node('div', '', fieldset, 'transport-choice'); const label = node('label', '', row);
    const input = node('input', '', label); input.type = 'checkbox'; input.value = option.id; input.id = `m702-choice-${option.id}`; input.checked = initial.selected.includes(option.id);
    node('span', option.text, label); checks.set(option.id, input);
    const output = node('div', '', row, 'field-feedback'); output.id = `m702-feedback-${option.id}`; outputs.set(option.id, output); input.setAttribute('aria-describedby', output.id);
    input.addEventListener('change', () => { model.select(option.id, input.checked); refresh(); });
  }
  const submit = node('button', 'Nur diese Aussagen prüfen', form, 'learning-primary'); submit.type = 'submit';
  const outcome = node('div', '', selection, 'learning-feedback'); outcome.id = 'm702-outcome'; outcome.tabIndex = -1; outcome.setAttribute('role', 'status');
  form.addEventListener('submit', event => { event.preventDefault(); model.submit(); refresh(); focus(outcome); });
  node('p', 'Auch eine vollständig richtige Auswahl bestätigt keinen freien Erklärungstext. Besprecht die Argumentation und den Vorschlag anhand der Kriterien.', review, 'learning-note');
  const help = node('aside', '', main, 'learning-helpers'); help.setAttribute('aria-label', 'Freiwillige Hilfen');
  node('h2', 'Hilfe nach Bedarf', help);
  node('p', 'Alle Hilfen sind freiwillig. Sie setzen keine Antworten ein. Die Vergleichserklärung hält deinen bisherigen Entwurf vor dem Öffnen fest.', help);
  const actions = node('div', '', help, 'help-actions');
  for (const [level, label] of [[1, 'Denkimpuls'], [2, 'Argumentation strukturieren'], [3, 'Vergleichserklärung ansehen']] as const) button(label, actions, () => showHelp(level));
  const helpText = node('div', '', help, 'help-text'); helpText.id = 'm702-help'; helpText.tabIndex = -1;
  const support = node('p', '', main, 'learning-note'); support.id = 'm702-support';
  node('p', 'Texte, Auswahl und Hilfenhistorie bleiben flüchtig in dieser Sitzung. Ein Wechsel zur Startseite erhält sie; Neuladen verwirft sie. Es erfolgt keine dauerhafte Speicherung oder Übertragung. Dieser einzelne Baustein ersetzt keine vollständige Transportmission.', main, 'learning-note');
  button('Neue Bearbeitung beginnen', main, () => {
    model.reset(); writingInputs.forEach(input => { input.value = ''; }); checks.forEach(input => { input.checked = false; }); first.open = false; selection.open = false; refresh(); focus(argument);
  });
  node('a', 'Zurück zu den Lernwegen', main, 'learning-jump').href = '#/';
  function showHelp(level: 1 | 2 | 3) { model.help(level); refresh(); focus(helpText); }
  function paint(target: HTMLElement, status: Status, feedback: M702Feedback) {
    const display = STATUS_PRESENTATION[status]; target.replaceChildren(); target.dataset['status'] = status; target.dataset['color'] = display.color;
    node('p', `${display.symbol} ${display.label}: ${feedback.recognized}`, target);
    node('p', feedback.reason, target); node('p', `Nächster Schritt: ${feedback.next}`, target);
  }
  function refresh() {
    const state = model.getState(); const snapshot = state.firstDraft; review.hidden = snapshot === null;
    writingLabels[0]!.textContent = `Meine Argumentation · ${snapshot ? 'Überarbeitung' : 'Erstfassung'} · unbenotet`;
    writingLabels[1]!.textContent = `Mein Untersuchungsvorschlag · ${snapshot ? 'Überarbeitung' : 'Erstfassung'} · unbenotet`;
    revisionNote.textContent = snapshot ? snapshot.hadWriting
      ? 'Deine festgehaltene Erstfassung bleibt unten erhalten. Änderungen hier sind eine zweite Fassung nach dem Vergleich; die Texte bleiben ungeprüft.'
      : 'Vor dem ersten Vergleich war noch kein eigener Text vorhanden. Was du jetzt formulierst, ist eine Bearbeitung nach dem Vergleich, keine unbeeinflusste Erstfassung.'
      : 'Deine eigene Erstfassung ist noch nicht festgehalten. Beide Textfelder bleiben unbenotet und werden nicht automatisch fachlich geprüft.';
    if (snapshot) {
      firstArgument.textContent = snapshot.argument || 'Noch kein eigener Text vorhanden.'; firstInvestigation.textContent = snapshot.investigation || 'Noch kein eigener Vorschlag vorhanden.';
      firstInfo.textContent = `${snapshot.assistance === 'solution_viewed' ? 'Eine Vergleichserklärung war zuvor bereits angesehen.' : snapshot.assistance === 'hint' ? 'Vor dem Festhalten waren bereits Hinweise oder Kriterien geöffnet.' : 'In dieser Sitzung war vor dem Festhalten keine digitale Hilfe geöffnet.'} ${snapshot.historyUnverified ? 'Frühere Hilfenutzung ist nicht gesichert; daraus folgt kein Nachweis einer unbeeinflussten Erstfassung.' : 'Das ist eine zeitliche Dokumentation, keine fachliche Bewertung.'}`;
    }
    for (const [id, output] of outputs) {
      const part = state.result?.parts.find(p => p.id === id); output.hidden = !part || !state.selected.includes(id);
      if (part && state.selected.includes(id)) { paint(output, part.status, part); button('Denkimpuls dazu anfordern', output, () => showHelp(1)); }
    }
    if (state.stale) paint(outcome, 'empty', { recognized: 'Auswahl geändert; Gesamtprüfung nicht mehr aktuell.', reason: 'Unveränderte, bereits geprüfte Teilaussagen bleiben sichtbar. Deine freien Texte werden nicht bewertet.', next: 'Prüfe die geänderte Auswahl erneut.' });
    else if (state.result) paint(outcome, state.result.status, state.result.feedback);
    else paint(outcome, 'empty', { recognized: 'Noch keine Auswahl geprüft.', reason: 'Die Kriterien sind eine Hilfe zur eigenen Textprüfung, kein automatisches Texturteil.', next: 'Überarbeite zunächst eine Stelle deiner eigenen Argumentation anhand der Kriterien.' });
    helpText.textContent = state.lastHelp ? M702_HELP[state.lastHelp] : '';
    support.textContent = `${state.assistance === 'solution_viewed' ? 'Vergleichserklärung angesehen.' : state.assistance === 'hint' ? 'Hinweise oder Kriterien geöffnet.' : 'Bisher keine digitale Hilfe geöffnet.'} ${state.historyUnverified ? 'Frühere Hilfenutzung nach Neuladen nicht gesichert. Das verändert keine fachlich richtige Auswahl in eine falsche.' : 'Hilfenutzung und fachliches Ergebnis werden getrennt angezeigt.'} Hilfen bleiben auch nach einer neuen Bearbeitung vermerkt.`;
  }
  refresh();
}
