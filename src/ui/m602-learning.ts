import './m602-learning.css';
import type { M602LearningController } from '../application/m602-learning.ts';
import { M602_FIELDS } from '../domain/m602-contract.ts';
import type { M602Field } from '../domain/m602-contract.ts';
import type { Assistance } from '../domain/contracts.ts';
import { NAMING_HELP } from '../assessment/naming-feedback.ts';
import { RELATION_HELP } from '../assessment/m602-feedback.ts';
import { renderOnionCell } from '../render2d/onion-cell.ts';
import { STATUS_PRESENTATION } from './feedback-presentation.ts';

const names = { process: 'Fachbegriff', direction: 'Nettorichtung', volume: 'Vakuolenvolumen' } as const;
const questions = {
  process: 'Wie heißt der Wassertransportvorgang?',
  direction: 'Wasser bewegt sich NETTO über die ZELLMEMBRAN: deine Richtung',
  volume: 'Das VAKUOLENVOLUMEN: deine Veränderung',
} as const;
const usedHelp: Record<Assistance, string> = {
  independent: 'Bisher keine zusätzliche Hilfe genutzt', hint: 'Hinweis genutzt', wordbank: 'Wortbank genutzt',
  clarified: 'Mit Auswahl geklärt', solution_viewed: 'Lösung angesehen',
};
const submittedHelp: Record<Assistance, string> = {
  ...usedHelp, independent: 'Ohne zusätzlich aufgerufene Hilfe beantwortet', hint: 'Mit aufgerufenem Hinweis beantwortet', wordbank: 'Mit aufgerufener Wortbank beantwortet',
};

/** Learner presentation of existing contracts. No biological classification or
 * persistence decisions live here; input text is always inserted as text. */
export function mountM602Learning(root: HTMLElement, model: M602LearningController) {
  root.replaceChildren();
  function node<K extends keyof HTMLElementTagNameMap>(tag: K, text = '', parent: HTMLElement = root, cls = ''): HTMLElementTagNameMap[K] {
    const el = document.createElement(tag); el.textContent = text;
    if (cls) el.className = cls;
    parent.append(el); return el;
  }
  const skip = node('a', 'Zur Aufgabe', root, 'skip-link'); skip.href = '#lernantworten';
  function scrollLink(link: HTMLAnchorElement, targetId: string) {
    link.addEventListener('click', event => {
      event.preventDefault();
      const target = root.querySelector<HTMLElement>(`#${targetId}`);
      if (target) { target.tabIndex = -1; target.focus({ preventScroll: true }); target.scrollIntoView({ block: 'start' }); }
    });
  }
  scrollLink(skip, 'lernantworten');
  const header = node('header', '', root, 'site-header learning-header');
  const home = node('a', 'Zelllabor 11', header, 'brand'); home.href = '#/'; home.setAttribute('aria-label', 'Zelllabor 11 – Startseite');
  node('span', 'Biologie · Jahrgang 11', header, 'header-subject');
  const main = node('main', '', root, 'learning-page'); main.id = 'lerninhalt';
  const intro = node('section', '', main, 'learning-intro');
  node('p', 'Erste Übungsvorschau · M6.02', intro, 'eyebrow');
  const heading = node('h1', 'Wasserhaushalt der Zelle', intro); heading.tabIndex = -1;
  node('p', 'Wie hängen Membrangrenzen, Wasserbewegung und Vakuolenvolumen zusammen? Untersuche das Material, formuliere drei kurze Antworten und verbessere sie mit gezielter Rückmeldung.', intro, 'learning-lead');
  node('p', 'Du übst das Benennen und Anwenden dreier Beziehungen. Eine vollständige Kausalerklärung wird damit noch nicht geprüft.', intro, 'learning-note');
  const steps = node('nav', '', intro, 'learning-steps'); steps.setAttribute('aria-label', 'Dein Lernweg');
  for (const [title, target] of [['1 Vorwissen', 'vorwissen'], ['2 Material', 'lernmaterial'], ['3 Antworten', 'lernantworten'], ['4 Weiterdenken', 'weiterdenken']]) {
    const link = node('a', title, steps); link.href = `#${target}`; scrollLink(link, target!);
  }

  const knowledge = node('section', '', main, 'learning-preknowledge'); knowledge.id = 'vorwissen';
  node('h2', 'Vorwissen aktivieren', knowledge);
  node('p', 'Drei freiwillige Denkaufträge, ohne Bewertung oder Zugangssperre. Beim Prüfen erhältst du eine Erklärung; diese wird als aufgerufener Hinweis erfasst.', knowledge);
  const knowledgeDetails = node('details', '', knowledge); node('summary', 'Kurzen Vorwissencheck öffnen', knowledgeDetails);
  const checks = [
    { label: 'Räume und Grenzen', question: 'Welche Grenze trennt Vakuole und Cytosol?', choices: ['Zellmembran', 'Tonoplast', 'Zellwand'], correct: 'Tonoplast', explanation: 'Der Tonoplast umschließt die Vakuole. Die Zellmembran trennt Cytosol und Außenraum; die Zellwand liegt außerhalb der Zellmembran.', fields: ['volume'] as const, term: 'Tonoplast' },
    { label: 'Einzelbewegung und Nettobilanz', question: 'Können bei einer Nettobilanz null trotzdem Moleküle in beide Richtungen wechseln?', choices: ['Ja, gleich viele in beide Richtungen', 'Nein, alle Moleküle stehen still'], correct: 'Ja, gleich viele in beide Richtungen', explanation: 'Netto ist die Bilanz der beiden Richtungen im selben Zeitraum. Gleiche Anzahlen ergeben null, obwohl einzelne Moleküle weiter wechseln können. Das beschreibt keinen Stillstand.', fields: ['direction'] as const, term: 'Nettotransport' },
    { label: 'Gesamtwasserpotenziale vergleichen', question: 'Welcher Gesamtwert ist höher: −200 000 Pa oder −500 000 Pa?', choices: ['−200 000 Pa', '−500 000 Pa'], correct: '−200 000 Pa', explanation: '−200 000 Pa ist weniger negativ und daher höher als −500 000 Pa. Verglichen werden Gesamtwasserpotenziale einschließlich Druck, nicht allein Konzentrationen.', fields: ['direction', 'volume'] as const, term: 'Wasserpotenzial' },
  ];
  const knowledgeInputs = checks.map((check, index) => {
    const row = node('div', '', knowledgeDetails, 'knowledge-check');
    node('p', check.question, row);
    const label = node('label', check.label, row); label.htmlFor = `prior-${index}`;
    const select = node('select', '', row); select.id = label.htmlFor;
    const empty = node('option', 'Eigene Einschätzung wählen', select); empty.value = '';
    for (const text of check.choices) node('option', text, select).value = text;
    const explanation = node('p', '', row, 'knowledge-explanation'); explanation.hidden = true;
    return { select, explanation };
  });
  const knowledgeButton = node('button', 'Vorwissen prüfen', knowledgeDetails); knowledgeButton.type = 'button';
  knowledgeButton.addEventListener('click', () => perform(() => {
    checks.forEach((check, i) => {
      check.fields.forEach(field => model.help(field, 'hint'));
      const { select, explanation } = knowledgeInputs[i]!;
      explanation.hidden = false;
      explanation.textContent = `${select.value === check.correct ? 'Deine Einschätzung passt. ' : select.value ? `Vergleiche deine Einschätzung mit der Begriffskarte „${check.term}“. ` : 'Du kannst auch ohne Auswahl weiterarbeiten. '}${check.explanation} Dies ist keine zusätzliche Bewertung von M6.02.`;
    });
    update('Vorwissenerklärungen geöffnet. Die Übung bleibt jederzeit erreichbar.');
  }));

  const workspace = node('div', '', main, 'learning-workspace');
  const material = node('section', '', workspace, 'learning-material'); material.id = 'lernmaterial';
  material.setAttribute('aria-label', 'Frage und Material');
  material.dataset['case'] = model.getState().caseIndex === 0 ? 'water-loss-a' : 'water-loss-b';
  node('p', '02 · Material untersuchen', material, 'eyebrow');
  node('h2', `Materialfall ${model.getState().caseIndex === 0 ? 'A' : 'B'}`, material);
  node('p', 'Eine intakte Zwiebel-Epidermiszelle befindet sich in der frühen Phase des Wasserverlusts nach einem Lösungswechsel. Nicht betrachtet wird der exakte Austauschzeitpunkt.', material);
  const figure = node('figure', '', material);
  renderOnionCell(figure, model.getState().material);
  node('figcaption', 'Didaktisches Zustandsmodell. Keine Mikroskopaufnahme, keine Simulation; Grenzen sind zur Unterscheidung überhöht. Nicht alle Zellbestandteile sind dargestellt.', figure);
  const table = node('table', '', material); node('caption', 'Gesamtwasserpotenziale im aktuellen Zustand', table);
  const tr = node('tr', '', node('thead', '', table)); node('th', 'Raum', tr).scope = 'col'; node('th', 'Wasserpotenzial Ψ', tr).scope = 'col';
  const tbody = node('tbody', '', table), p = model.getState().material.waterPotential;
  for (const [label, value] of [['Vakuole', p.vacuole], ['Cytosol', p.cytosol], ['Außenraum', p.external]]) {
    const row = node('tr', '', tbody); node('th', String(label), row).scope = 'row'; node('td', `${value} Pa`, row);
  }
  node('p', 'Es gilt ausdrücklich: ΨVakuole > ΨCytosol > ΨAußenraum. Weniger negativ bedeutet hier höher. Die Gesamtwerte berücksichtigen auch Druckbeiträge; eine Konzentration allein genügt nicht für diesen Vergleich.', material, 'material-explanation');
  const conditions = node('ul', '', material, 'material-conditions');
  for (const text of ['Wasser kann Zellmembran und Tonoplast passieren.', 'Saccharose wird im betrachteten Zeitraum weitgehend zurückgehalten.', 'Andere Transportprozesse sind ausgeschlossen.', 'Die Zellwand bleibt eine vergleichsweise formstabile Struktur.']) node('li', text, conditions);

  const right = node('div', '', workspace, 'learning-answer-column');
  const form = node('form', '', right, 'learning-form'); form.id = 'lernantworten';
  node('p', '03 · Selbst antworten', form, 'eyebrow'); node('h2', 'Deine drei Antworten', form);
  node('p', 'Ein Fachbegriff, eine kurze Nettorichtung und eine kurze Volumenänderung genügen. Wasser, Zellmembran, Vakuolenvolumen und die frühe Phase sind vorgegeben.', form);
  node('p', 'Längere Sätze und unbekannte Zusätze können eine Klärung benötigen. Das allein ist kein biologischer Fehler.', form, 'learning-note');
  const inputs = {} as Record<M602Field, HTMLInputElement>;
  let activeField: M602Field = 'process';
  for (const [index, field] of M602_FIELDS.entries()) {
    const group = node('div', '', form, 'learner-field');
    node('span', `C0${index + 1} · ${names[field]}`, group, 'field-kicker');
    const label = node('label', questions[field], group); label.htmlFor = `learner-${field}`;
    const input = node('input', '', group); input.id = label.htmlFor; input.name = field; input.autocomplete = 'off'; input.spellcheck = false;
    input.value = model.getState().answers[field]; input.setAttribute('aria-describedby', 'answer-contract'); inputs[field] = input;
    input.addEventListener('focus', () => { activeField = field; });
    input.addEventListener('input', () => perform(() => { model.edit(field, input.value); update(); }));
  }
  const contractNote = node('p', 'Geprüft wird jeweils nur das genannte Kriterium. Deine Eingaben werden nicht abgeschnitten oder zu einem freien Erklärungstext umgedeutet.', form, 'learning-note'); contractNote.id = 'answer-contract';
  const extras = node('details', '', form, 'learning-extras'); node('summary', 'Weitere Aussagen ergänzen (optional)', extras);
  node('p', 'Zusätze gehören zu deiner Einreichung. Solange sie nicht geprüft sind, erhält die Gesamtantwort kein grünes Urteil.', extras);
  const extraLabel = node('label', 'Weitere Aussagen – ungeprüft', extras); extraLabel.htmlFor = 'learner-extra';
  const extra = node('textarea', '', extras); extra.id = extraLabel.htmlFor; extra.rows = 3; extra.value = model.getState().additional;
  extra.addEventListener('input', () => perform(() => { model.editAdditional(extra.value); update(); }));
  const submit = node('button', 'Drei Antworten prüfen', form, 'learning-primary'); submit.type = 'submit';
  const feedback = node('section', '', right, 'learning-feedback'); feedback.setAttribute('aria-label', 'Gesamtrückmeldung'); feedback.tabIndex = -1;
  const announcement = node('p', '', right, 'visually-hidden'); announcement.setAttribute('role', 'status'); announcement.setAttribute('aria-live', 'polite'); announcement.setAttribute('aria-atomic', 'true');
  const revise = node('button', 'Antwort selbst überarbeiten', right, 'learning-revise'); revise.type = 'button';
  revise.addEventListener('click', () => { inputs[activeField].focus(); inputs[activeField].scrollIntoView({ block: 'center' }); });
  const helpers = node('section', '', right, 'learning-helpers'); helpers.setAttribute('aria-label', 'Überarbeiten und Hilfen');
  node('h2', 'Eine Hilfe wählen', helpers); node('p', 'Überarbeite zuerst selbst oder rufe direkt eine passende Hilfe auf. Hilfen ändern nicht die fachlichen Kriterien und werden gesondert angezeigt.', helpers);
  for (const field of M602_FIELDS) {
    const group = node('section', '', helpers, 'help-group'); group.setAttribute('aria-label', `Hilfen ${names[field]}`); node('h3', names[field], group);
    const profile = field === 'process' ? NAMING_HELP['M6.02'] : RELATION_HELP[field];
    const actions = node('div', '', group, 'help-actions');
    const hint = node('button', `Hinweis: ${names[field]}`, actions), bank = node('button', `Wortbank: ${names[field]}`, actions), solution = node('button', `Lösung ansehen: ${names[field]}`, actions);
    const text = node('div', '', group, 'help-text'); text.setAttribute('aria-live', 'polite');
    hint.addEventListener('click', () => perform(() => { model.help(field, 'hint'); text.replaceChildren(); node('p', profile.hint, text); update('Hinweis geöffnet.'); }));
    bank.addEventListener('click', () => perform(() => {
      model.help(field, 'wordbank'); text.replaceChildren(); node('p', 'Wähle bei Bedarf selbst einen Ausdruck. Eine Übernahme ist ein neuer unterstützter Entwurf und wird erst mit „Prüfen“ bewertet.', text);
      for (const value of profile.wordbank) {
        const choice = node('button', `Übernehmen ${names[field]}: ${value}`, text);
        choice.addEventListener('click', () => perform(() => { model.choose(field, value); inputs[field].value = model.getState().answers[field]; update('Auswahl übernommen, noch nicht geprüft.'); inputs[field].focus(); }));
      }
      update('Wortbank geöffnet.');
    }));
    solution.addEventListener('click', () => perform(() => { model.help(field, 'solution_viewed'); text.replaceChildren(); node('p', profile.solution, text); update('Lösung ausdrücklich angesehen.'); }));
  }

  const glossary = node('section', '', main, 'learning-glossary'); node('h2', 'Begriffe nachschlagen', glossary);
  node('p', 'Erklärungen sind direkt zugänglich. Das Öffnen einer Karte wird als Hinweis für die betreffenden Felder erfasst.', glossary);
  const terms: ReadonlyArray<readonly [string, string, readonly M602Field[]]> = [
    ['Cytosol', 'Die flüssige Grundphase innerhalb der Zellmembran, außerhalb der membranumgrenzten Organellen. Cytosol und Vakuoleninhalt sind getrennte Räume.', ['direction']],
    ['Tonoplast', 'Die Membran um die Vakuole. Sie trennt Vakuoleninhalt und Cytosol. Die Zellmembran ist eine andere Grenze.', ['volume']],
    ['Selektive Permeabilität', 'Eine Membran lässt manche Stoffe leichter passieren als andere. Welche Stoffe das sind, muss für den betrachteten Fall angegeben sein.', ['process']],
    ['Wasserpotenzial', 'Eine Größe für den Zustand des Wassers. Der Gesamtwert berücksichtigt unter anderem gelöste Stoffe und Druck. Bei durchlässiger Grenze folgt die Nettowasserbewegung einem Unterschied der Gesamtwasserpotenziale, vom höheren zum niedrigeren Wert.', ['direction', 'volume']],
    ['Nettotransport', 'Die Differenz der Transporte in entgegengesetzte Richtungen über dieselbe Grenze im selben Zeitraum. Eine Nettobilanz null schließt fortgesetzte Einzelbewegungen nicht aus.', ['direction']],
  ];
  const termGrid = node('div', '', glossary, 'glossary-grid');
  for (const [term, definition, fields] of terms) {
    const card = node('details', '', termGrid); const summary = node('summary', term, card); node('p', definition, card);
    const contextHash = model.getState().context.contextHash;
    // Record before disclosing the content, also for keyboard activation. An
    // asynchronous toggle listener could otherwise race the next submission.
    summary.addEventListener('click', event => {
      event.preventDefault();
      if (card.open) { card.open = false; return; }
      if (card.isConnected && model.getState().context.contextHash === contextHash) perform(() => {
        fields.forEach(f => model.help(f, 'hint')); card.open = true; update(`Begriffskarte „${term}“ geöffnet.`);
      });
    });
  }
  const support = node('section', '', main, 'learning-support'); support.setAttribute('aria-label', 'Unterstützung und Lernstand');
  const notebook = node('section', '', main, 'learning-notebook'); notebook.id = 'weiterdenken';
  node('p', '04 · Weiterdenken', notebook, 'eyebrow'); node('h2', 'Erklären im Heft', notebook);
  node('p', 'Freiwillig: Erkläre auf Papier mit eigenen Worten, wie die Gesamtwasserpotenziale im bearbeiteten Material, die beiden Membrangrenzen und die Volumenfolge zusammenhängen. Verwende die Werte mit Einheit und unterscheide die Vakuole von der Zellwand.', notebook);
  node('p', 'Schreibe möglichst zuerst selbst. Vergleiche anschließend und besprich deine Begründung im Unterricht. Dieses Unterrichtsprodukt wird nicht durch C01–C03 automatisch bewertet und nicht in der Anwendung gespeichert.', notebook, 'learning-note');
  const notebookButton = node('button', 'Beispiellösung im Heftvergleich ansehen', notebook); const notebookText = node('div', '', notebook, 'notebook-example'); notebookText.setAttribute('aria-live', 'polite');
  notebookButton.addEventListener('click', () => perform(() => {
    model.showNotebookSolution(); notebookText.replaceChildren(); node('h3', 'Lösung angesehen · Vergleich nach dem eigenen Schreiben', notebookText);
    node('p', `Im Material besitzt die Vakuole mit ${p.vacuole} Pa ein höheres Gesamtwasserpotenzial als das Cytosol mit ${p.cytosol} Pa. Das Cytosol liegt wiederum über dem Außenraum mit ${p.external} Pa. Die Werte enthalten Druckbeiträge. Wasser kann beide Membranen passieren; Saccharose wird weitgehend zurückgehalten. Dieser passive Wassertransport heißt Osmose.`, notebookText);
    node('p', 'Über die Zellmembran ist die Nettowasserbewegung aus dem Cytosol in den Außenraum gerichtet. Über den Tonoplasten gibt die Vakuole Wasser an das Cytosol ab; ihr Volumen nimmt in dieser frühen Phase ab. Die Zellwand ist eine andere, vergleichsweise formstabile Struktur. Einzelne Wassermoleküle können trotzdem in beide Richtungen wechseln.', notebookText);
    node('p', 'Prüfe deinen Hefttext auf passende Räume, Grenzen, Potenzialwerte und Ursache-Wirkungs-Verknüpfungen. Das Lesen dieser Erklärung weist keine selbstständige Erklärungskompetenz nach.', notebookText);
    update('Beispiellösung angesehen. Die Unterstützung gilt für alle drei Felder.');
  }));
  const repeat = node('section', '', main, 'learning-repeat'); node('h2', 'Am zweiten Material weiterüben', repeat);
  node('p', 'Die beiden Fälle zeigen denselben frühen Wasserverlustzustand mit unterschiedlichen Gesamtwasserpotenzialen. Das ist Wiederholung desselben Beziehungstyps, kein Transfernachweis. Beim Wechsel starten alle Antworten leer.', repeat);
  const next = node('button', 'Weiterer Materialfall', repeat, 'learning-primary');
  next.addEventListener('click', () => perform(() => { model.activateCase(model.getState().caseIndex === 0 ? 1 : 0); mountM602Learning(root, model); root.querySelector<HTMLElement>('#lernmaterial h2')?.focus(); }));
  const footer = node('footer', '', root, 'site-footer'); node('span', 'Übungsvorschau · noch keine Unterrichtsfreigabe', footer); const back = node('a', 'Zur Startseite', footer); back.href = '#/';

  function perform(action: () => void) {
    try { action(); } catch {
      feedback.replaceChildren(); feedback.dataset['status'] = 'technical'; feedback.dataset['color'] = 'yellow';
      node('h2', '! Technischer Hinweis', feedback); node('p', 'Die Aktion konnte nicht sicher übernommen werden. Es wird kein fachlicher Fehler und kein neuer Erfolg behauptet. Prüfe den sichtbaren Entwurf erneut.', feedback);
      announcement.textContent = 'Technischer Hinweis: keine neue Bewertung.';
    }
  }
  function update(message = '') {
    const state = model.getState(); feedback.replaceChildren();
    if (state.stale) {
      feedback.dataset['status'] = 'stale'; feedback.dataset['color'] = 'neutral';
      node('h2', '○ Rückmeldung nicht mehr aktuell', feedback);
      node('p', 'Antwort oder Unterstützung geändert. Die vorige Rückmeldung bestätigt den aktuellen Entwurf nicht. Prüfe deine drei Antworten erneut.', feedback);
    } else if (state.outcome) {
      const o = state.outcome, display = STATUS_PRESENTATION[o.overallStatus];
      feedback.dataset['status'] = o.overallStatus; feedback.dataset['color'] = display.color;
      node('h2', `${display.symbol} M6.02 insgesamt: ${display.label}`, feedback);
      if (o.overallStatus === 'correct') node('p', 'Alle drei Kriterien sind für diesen Materialfall erfüllt. Bestätigt sind Fachbegriff, Nettorichtung und Volumenfolge – keine vollständige Kausalerklärung.', feedback);
      for (const field of M602_FIELDS) {
        const f = o.fields[field], status = STATUS_PRESENTATION[f.result.status], panel = node('section', '', feedback, 'field-feedback');
        panel.setAttribute('aria-label', `Bewertung ${field}`); panel.dataset['status'] = f.result.status; panel.dataset['color'] = status.color;
        node('h3', `${status.symbol} ${names[field]} · ${status.label}`, panel);
        const dl = node('dl', '', panel);
        for (const [title, value] of [['Erkannter Ansatz', f.feedback.recognized], ['Fachliche Einordnung und Begründung', f.feedback.difference]]) { node('dt', title, dl); node('dd', value, dl); }
        const values = field === 'direction' ? `Cytosol: ${p.cytosol} Pa; Außenraum: ${p.external} Pa.` : field === 'volume' ? `Vakuole: ${p.vacuole} Pa; Cytosol: ${p.cytosol} Pa.` : 'Wasser kann beide Membranen passieren; Saccharose wird im betrachteten Zeitraum weitgehend zurückgehalten.';
        node('dt', 'Bezug zum Material', dl); node('dd', values, dl);
        node('dt', 'Nächster Schritt', dl); node('dd', f.feedback.next, dl);
      }
      for (const extra of o.notAssessed) node('p', `Noch nicht geprüft: ${extra.value}`, feedback, 'unassessed-text');
      if (o.support.history === 'history_unverified') node('p', 'Frühere Hilfehistorie nicht gesichert. Die einzelnen fachlichen Rückmeldungen bleiben nutzbar; ein neuer vollständiger Erfolgsnachweis wird nicht gespeichert.', feedback);
    } else {
      feedback.dataset['status'] = 'empty'; feedback.dataset['color'] = 'neutral';
      node('h2', '○ Noch keine Antwort geprüft', feedback); node('p', 'Deine Rückmeldungen erscheinen hier nach der Abgabe.', feedback);
    }
    support.replaceChildren(); node('h2', 'Unterstützung und Lernstand', support);
    if (state.support.history === 'history_unverified') node('p', 'Frühere Hilfehistorie nicht gesichert. Ein Reload oder Materialwechsel stellt sie nicht wieder her; fachliches Üben bleibt möglich.', support);
    for (const field of M602_FIELDS) {
      const assistance = state.support.fields[field].assistance;
      const label = state.support.history === 'history_unverified' && assistance === 'independent'
        ? 'In dieser Sitzung keine zusätzliche Hilfe aufgerufen; frühere Hilfe unbekannt'
        : (state.hasSubmitted && !state.stale ? submittedHelp : usedHelp)[assistance];
      node('p', `${names[field]}: ${label}.`, support);
    }
    if (state.revisedAfterFeedback) node('p', 'Nach Rückmeldung überarbeitet – in diesem Sitzungsverlauf nachweisbar.', support);
    node('p', '„Ohne zusätzlich aufgerufene Hilfe“ bedeutet weder „beim ersten Versuch richtig“ noch „ohne vorheriges Feedback“ oder „dauerhaft beherrscht“.', support, 'learning-note');
    node('p', `${state.recordedCount} gespeicherte oder in dieser Sitzung vorgemerkte Bearbeitungsnachweise (einschließlich historischer Stände). Das ist kein aktueller Kompetenznachweis und keine Notenprognose.`, support);
    node('p', state.storage.issue ? 'Speicherhinweis: Lokales Speichern ist derzeit eingeschränkt oder vorhandene Daten passen nicht zur aktuellen Fassung. Du kannst in dieser Sitzung weiterüben; vorhandene fremde Daten bleiben erhalten.' : 'Deine Rohantworten und Hilfeereignisse bleiben nur in dieser Sitzung. Lokal gespeichert werden ausschließlich die acht vorhandenen Fortschrittsmetadaten je bestätigtem Versuch.', support, 'learning-note');
    if (message) announcement.textContent = message;
    else if (state.stale) announcement.textContent = 'Rückmeldung nicht mehr aktuell. Erneut prüfen.';
  }
  form.addEventListener('submit', event => {
    event.preventDefault(); perform(() => { const o = model.submit(); update(`Rückmeldung: ${STATUS_PRESENTATION[o.overallStatus].label}. Drei Feldrückmeldungen verfügbar.`); feedback.focus(); });
  });
  update();
  material.querySelector('h2')!.tabIndex = -1;
  return Object.freeze({ destroy: () => root.replaceChildren() });
}
