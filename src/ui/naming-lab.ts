import { createNamingSession } from '../application/naming-session.ts';
import { NAMING_CONTENT, NamingContractError } from '../domain/naming-contract.ts';
import type { NamingOutcome } from '../domain/naming-contract.ts';
import type { TaskContext } from '../domain/task-context.ts';
import { appendAttempt } from '../domain/progress.ts';
import { createProgressStore } from '../persistence/progress-store.ts';
import type { StoragePort } from '../persistence/progress-store.ts';
import { NAMING_HELP } from '../assessment/naming-feedback.ts';
import { IncompleteTaskAssessmentError } from '../assessment/progress.ts';
import { ASSISTANCE_LABELS, STATUS_PRESENTATION } from './feedback-presentation.ts';

/** Exact public questions/material descriptions from concept 1.0, no editorial imports. */
const questions = Object.freeze({
  'Z1.02': 'Wie heißt die Membran, die die Vakuole umschließt? Ein Begriff genügt.',
  'M6.02': 'Beantworte die drei Teilfragen getrennt: a) Wie heißt der Wassertransportvorgang? b) In welche Richtung bewegt sich Wasser im angezeigten Zustand netto über die Zellmembran? c) Wie verändert sich in dieser Phase das Vakuolenvolumen?',
});
const materials = Object.freeze({
  'Z1.02': 'Im Modell ist ausschließlich die Grenze um den Vakuolenraum hervorgehoben, nicht die äußere Zellmembran.',
  'M6.02': 'Betrachtet wird eine frühe Phase der Wasserabgabe nach dem Lösungswechsel, nicht der mathematische Zeitpunkt des Austauschs. Für den angezeigten Zustand gilt ausdrücklich: Wasserpotenzial Vakuole > Cytosol > Außenlösung. Zellmembran und Tonoplast lassen Wasser passieren. Saccharose wird im Beobachtungszeitraum weitgehend zurückgehalten. Die Zelle ist intakt; weitere Stofftransporte werden ausgeblendet. Ein höheres Wasserpotenzial liegt hier vor, wenn der Wert weniger negativ ist.',
});
export interface NamingLabOptions {
  readonly initialContext: TaskContext;
  readonly idPrefix: string;
  readonly resumed: boolean;
  readonly acquireStorage: () => StoragePort | null;
  readonly changedContext: (current: TaskContext) => TaskContext;
  readonly newCase: (current: TaskContext) => TaskContext;
}
/** Test-internal mount, deliberately absent from main.ts and all production routes. */
export function mountNamingLab(root: HTMLElement, options: NamingLabOptions) {
  const store = createProgressStore(NAMING_CONTENT, options.acquireStorage);
  const loaded = store.getState();
  const session = createNamingSession(options.initialContext, { idPrefix: options.idPrefix, resumed: options.resumed,
    loadedAttempts: [...loaded.progress.attempts, ...(loaded.history?.attempts ?? [])] });
  const priorDrafts: { readonly context: TaskContext; readonly termText: string; readonly extraText: string }[] = [];
  root.replaceChildren();
  function node<K extends keyof HTMLElementTagNameMap>(tag: K, text = '', parent: HTMLElement = root): HTMLElementTagNameMap[K] {
    const element = document.createElement(tag); element.textContent = text; parent.append(element); return element;
  }
  const style = node('style');
  style.textContent = `:root{font-family:system-ui,sans-serif;color:#19352f;background:#eff3ef;line-height:1.6;overflow-wrap:anywhere}*{box-sizing:border-box}body{margin:0}main{max-width:900px;margin:auto;padding:24px}h1{line-height:1.2}section,form{background:#fff;border:1px solid #b4c7be;border-radius:14px;padding:20px;margin:20px 0}input,textarea,button,summary{font:inherit;min-height:46px}input,textarea{display:block;width:100%;padding:10px;border:2px solid #627e72;border-radius:7px;margin:6px 0 12px}textarea{min-height:95px}button{padding:8px 14px;margin:6px 8px 6px 0;border:1px solid #48695b;border-radius:8px;background:#f2f6f2;color:#19352f;cursor:pointer}button[type=submit]{background:#1c5947;color:white}button:focus-visible,input:focus-visible,textarea:focus-visible,summary:focus-visible{outline:3px solid #204eda;outline-offset:3px}summary{cursor:pointer;padding:8px}p,li,code{overflow-wrap:anywhere}code{font-size:.8em}[data-color=green]{border-left:7px solid #287044}[data-color=red]{border-left:7px solid #b03030}[data-color=yellow]{border-left:7px solid #997100}[data-color=neutral]{border-left:7px solid #6d7472}svg{max-width:100%;height:auto}dt{font-weight:700}dd{margin:0 0 12px}small{display:block} .muted{color:#495b54}@media(max-width:480px){main{padding:12px}section,form{padding:14px}button{width:100%;margin-right:0}}`;
  const main = node('main');
  node('p', 'ZELLLABOR 11 · INTERNE BEDIENPROBE', main);
  node('h1', 'Fachbegriff prüfen', main);
  node('p', 'Entwicklungsansicht für zwei Benennungsfelder. Keine Unterrichtsfreigabe.', main);
  const material = node('section', '', main); material.setAttribute('aria-label', 'Frage und Material');
  const question = node('h2', '', material);
  const description = node('p', '', material);
  const caseInfo = node('p', '', material);
  const diagram = node('div', '', material);
  const contextInfo = node('small', '', material);
  const form = node('form', '', main);
  const label = node('label', 'Fachbegriff', form); label.htmlFor = 'naming-term';
  const instruction = node('p', 'Fachbegriff: Ein Begriff genügt. Du musst keinen Satz schreiben.', form); instruction.id = 'naming-instruction';
  const term = node('input', '', form); term.id = 'naming-term'; term.name = 'term'; term.type = 'text'; term.autocomplete = 'off'; term.setAttribute('aria-describedby', instruction.id);
  node('p', 'Weitere Aussagen (optional) – in diesem Benennungsfeld noch nicht fachlich geprüft', form);
  const details = node('details', '', form); node('summary', 'Weitere Aussagen öffnen', details);
  const extraLabel = node('label', 'Weitere Aussagen – ungeprüft', details); extraLabel.htmlFor = 'naming-extra';
  const extra = node('textarea', '', details); extra.id = 'naming-extra'; extra.name = 'additional';
  node('p', 'Deine zusätzlichen Gedanken bleiben erhalten. Eine spätere gesonderte Erklärungsaufgabe benötigt eigene Kriterien; diese ist hier noch nicht implementiert.', details);
  const check = node('button', 'Begriff prüfen', form); check.type = 'submit';
  const feedback = node('section', '', main); feedback.setAttribute('aria-label', 'Rückmeldung'); feedback.setAttribute('aria-live', 'polite'); feedback.tabIndex = -1;
  const helpers = node('section', '', main); helpers.setAttribute('aria-label', 'Überarbeiten und Hilfen');
  node('h2', 'Nächster Versuch und Hilfen', helpers);
  const self = node('button', 'Antwort selbst überarbeiten', helpers); self.type = 'button';
  const hint = node('button', 'Hinweis anzeigen', helpers); hint.type = 'button';
  const bank = node('button', 'Wortbank öffnen', helpers); bank.type = 'button'; bank.hidden = true;
  const solution = node('button', 'Lösung ausdrücklich ansehen', helpers); solution.type = 'button'; solution.hidden = true;
  const helpText = node('div', '', helpers); helpText.setAttribute('aria-live', 'polite');
  const supportInfo = node('p', '', helpers);
  const storageInfo = node('p', '', main); storageInfo.setAttribute('role', 'status');
  const history = node('section', '', main); history.setAttribute('aria-label', 'Versuchsverlauf');
  const dev = node('section', '', main); dev.setAttribute('aria-label', 'Testfall-Steuerung');
  node('h2', 'Testfall-Steuerung', dev); node('p', 'Synthetische Materialfälle, kein Simulator.', dev);
  node('p', 'Ein neuer Materialfall beginnt mit leeren Eingabefeldern. Eingaben des vorherigen Falls bleiben zum Vergleich nur in den Sitzungsnotizen erhalten.', dev);
  const change = node('button', 'Materialzustand wechseln', dev);
  const fresh = node('button', 'Neuen Materialfall starten', dev);
  function renderContext(): void {
    const c = session.getState().context, task = session.getTaskId();
    question.textContent = questions[task]; description.textContent = materials[task];
    contextInfo.textContent = `Instanz ${c.instanceId} · ${c.phase} · ${c.contextHash} · ${c.taskVersion} · ${c.rubricVersion} · ${c.contentVersion} · ${c.modelVersion}`;
    caseInfo.textContent = task === 'Z1.02' ? `Pflanzenprofil: ${String(c.material['cellProfile'])}` : `Gesamtwasserpotenziale einschließlich Druck in Pa: ${JSON.stringify(c.material['waterPotential'])}`;
    diagram.replaceChildren();
    if (task === 'Z1.02') {
      // Static labelled schematic; target answer is not written onto the highlighted boundary.
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 500 210'); svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', 'Schema: markierte innere Grenze um den Vakuolenraum; außen liegt Cytosol');
      for (const [tag, attrs, text] of [
        ['rect', { x: '10', y: '10', width: '480', height: '190', rx: '25', fill: '#e4eee4', stroke: '#425b45', 'stroke-width': '3' }, ''],
        ['ellipse', { cx: '250', cy: '110', rx: '145', ry: '70', fill: '#e9f4ff', stroke: '#b75600', 'stroke-width': '7' }, ''],
        ['text', { x: '184', y: '115', fill: '#19352f' }, 'Vakuolenraum'],
        ['text', { x: '28', y: '42', fill: '#19352f' }, 'Cytosol'],
      ] as const) { const e = document.createElementNS(svg.namespaceURI, tag); for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v); e.textContent = text; svg.append(e); }
      diagram.append(svg); node('small', 'Schema · orange markiert: gesuchte innere Membrangrenze', diagram);
    } else node('p', 'Hier wird ausschließlich a) / C01 geprüft. b) / C02 und c) / C03 bleiben offen.', diagram);
  }
  function renderMeta(): void {
    const state = session.getState(), storage = store.getState();
    supportInfo.textContent = `${state.history === 'verified' ? ASSISTANCE_LABELS[state.assistance] + ' · Sitzungsverlauf bekannt' : 'Historie nach Laden/Zurück ungesichert: frühere Hilfen unbekannt; auch ein anderer Materialfall stellt diesen Nachweis nicht wieder her. Du kannst fachlich weiterüben; ein neuer eigenständiger Erfolg wird in dieser Sitzung nicht gebucht.'} · Hilfeereignisse dieser Sitzung: ${state.events.map(e => e.kind).join(', ') || 'keine'}`;
    storageInfo.textContent = storage.issue ? `Speicherhinweis (${storage.issue}): Die aktuelle Arbeit bleibt in dieser Sitzung erhalten. Vorhandene fremde Daten bleiben unberührt.` : 'Lokal gespeichert werden ausschließlich acht Metadatenfelder je Versuch, keine Antworttexte oder Belege.';
    history.replaceChildren(); node('h2', 'Versuchsverlauf · nur in dieser Sitzung', history);
    for (const o of state.outcomes) {
      const item = node('p', '', history);
      const old = o.submission.context.contextHash !== state.context.contextHash;
      const supportLabel = o.support.history === 'verified' ? ASSISTANCE_LABELS[o.support.assistance] : 'Frühere Hilfen unbekannt, keine bestätigte Eigenständigkeit';
      item.textContent = `${o.submission.attemptId} · Revision ${o.submission.revision} · Vorgänger ${o.submission.predecessorId ?? 'keiner'} · ${old ? 'Veraltet – keine aktuelle Bewertung' : 'damaliges Ergebnis'}: ${STATUS_PRESENTATION[o.overallStatus].label} · ${supportLabel} · Antwort: ${o.submission.termText} · ursprünglicher Kontext ${o.submission.context.instanceId} / ${o.submission.context.contextHash}`;
    }
    for (const draft of priorDrafts) node('p', `Sitzungsnotiz zum vorherigen Fall ${draft.context.instanceId} / ${draft.context.contextHash}: Fachbegriff: ${draft.termText} · Weitere Aussagen: ${draft.extraText} · Hier keine neue Bewertung. Nicht als Antwort des neuen Falls übernommen.`, history);
  }
  function showMessage(message: string): void {
    feedback.replaceChildren(); feedback.dataset['color'] = 'yellow'; feedback.dataset['status'] = 'technical';
    node('h2', '! Technischer Hinweis, kein fachliches Urteil', feedback); node('p', message, feedback);
  }
  function showOutcome(o: NamingOutcome): void {
    feedback.replaceChildren(); feedback.dataset['status'] = o.overallStatus;
    feedback.dataset['color'] = STATUS_PRESENTATION[o.overallStatus].color;
    const overall = STATUS_PRESENTATION[o.overallStatus], criterion = STATUS_PRESENTATION[o.termResult.status];
    node('h2', `${overall.symbol} Gesamtumfang: ${overall.label}`, feedback);
    const field = node('p', `${criterion.symbol} Fachbegriff / ${o.assessedScope.criterionId}: ${criterion.label}`, feedback); field.dataset['criterionStatus'] = o.termResult.status;
    field.dataset['color'] = criterion.color; field.style.paddingInlineStart = '12px';
    const dl = node('dl', '', feedback);
    for (const [title, text] of [['Sicher erkannt', o.feedback.recognized], ['Fachlicher Unterschied und Umfang', o.feedback.difference], ['Nächster Schritt', o.feedback.next]]) { node('dt', title, dl); node('dd', text, dl); }
    for (const unassessed of o.notAssessed) node('p', `Nicht geprüft (not_assessed) · ${unassessed.field === 'termText' ? 'vollständiger Feldtext' : 'Weitere Aussage'}: ${unassessed.value}`, feedback);
    if (o.notAssessed.length) node('p', 'Die ungeprüften Gedanken bleiben erhalten. Kein grünes Gesamturteil; eine gesonderte Erklärung benötigt eine spätere eigene Prüfung.', feedback);
    if (o.pendingCriteria.length) node('p', `Weiterhin offen: ${o.pendingCriteria.join(', ')}. Keine abgeschlossene M6.02-Aufgabe.`, feedback);
    if (o.support.history === 'history_unverified') node('p', 'Historie nach Laden/Zurück ungesichert: Die fachliche Übung bleibt möglich. Frühere Hilfen sind nicht belegbar; auch der Materialwechsel erzeugt keinen neuen eigenständigen Erfolgsnachweis in dieser Sitzung.', feedback);
    node('p', o.support.history === 'verified' ? ASSISTANCE_LABELS[o.support.assistance] : 'Frühere Hilfen unbekannt. Keine bestätigte Eigenständigkeit nach Laden/Zurück.', feedback);
  }
  function changed(): void { session.edit(); showMessage('Die Eingabe wurde geändert. Das vorherige Ergebnis gilt nicht für diesen ungeprüften Entwurf. Prüfe erneut.'); renderMeta(); }
  term.addEventListener('input', changed); extra.addEventListener('input', changed);
  self.addEventListener('click', () => { changed(); term.focus(); });
  form.addEventListener('submit', event => {
    event.preventDefault();
    try {
      const outcome = session.submit(session.makeSubmission(term.value, [extra.value]));
      showOutcome(outcome);
      try {
        const record = session.record(outcome);
        if (!store.getState().progress.attempts.some(a => a.attemptId === record.attemptId)) store.save(appendAttempt(store.getState().progress, record));
      } catch (error) {
        if (!(error instanceof IncompleteTaskAssessmentError || error instanceof NamingContractError)) throw error;
        node('p', 'Keine neue vollständige Erfolgsbuchung: Aufgaben-/Sitzungsumfang bleibt begrenzt.', feedback);
      }
      renderMeta(); feedback.focus();
    } catch { showMessage('Die Einreichung ist technisch nicht aktuell oder gültig. Überarbeite den Entwurf oder starte einen passenden Materialfall.'); feedback.focus(); }
  });
  hint.addEventListener('click', () => {
    session.help('hint'); helpText.replaceChildren(); node('p', NAMING_HELP[session.getTaskId()].hint, helpText); bank.hidden = false;
    showMessage('Ein Hinweis wurde aufgerufen. Prüfe den nächsten Entwurf neu; die Hilfe bleibt für diese Instanz erfasst.'); renderMeta();
  });
  bank.addEventListener('click', () => {
    session.help('wordbank'); helpText.replaceChildren(); node('p', 'Wähle selbst einen Begriff. Die Auswahl wird erst mit einem neuen Prüfklick bewertet.', helpText);
    for (const value of NAMING_HELP[session.getTaskId()].wordbank) {
      const option = node('button', `Begriff wählen: ${value}`, helpText); option.type = 'button';
      option.addEventListener('click', () => { session.help('clarified'); term.value = value; showMessage('Auswahl übernommen: neuer unterstützter Entwurf, noch nicht geprüft.'); renderMeta(); term.focus(); });
    }
    solution.hidden = false; showMessage('Die Wortbank wurde geöffnet. Sie zählt als Hilfe für weitere Versuche in dieser Instanz.'); renderMeta();
  });
  solution.addEventListener('click', () => {
    session.help('solution_viewed'); helpText.replaceChildren(); node('h3', 'Ausdrücklich aufgerufene Lösung', helpText); node('p', NAMING_HELP[session.getTaskId()].solution, helpText);
    showMessage('Lösung angesehen. Ein späteres Abschreiben in dieser Instanz ist kein eigenständiger Erfolgsnachweis.'); renderMeta();
  });
  function activate(next: TaskContext, mode: 'same_instance' | 'new_case'): void {
    try {
      const draft = { context: session.getState().context, termText: term.value, extraText: extra.value };
      session.activate(next, mode);
      if (mode === 'new_case') {
        if (draft.termText || draft.extraText) priorDrafts.push(draft);
        term.value = ''; extra.value = ''; details.open = false;
      }
      renderContext(); renderMeta(); helpText.replaceChildren(); bank.hidden = true; solution.hidden = true;
      showMessage(mode === 'new_case'
        ? 'Neuer Materialfall mit leeren Eingabefeldern. Vorherige Eingaben bleiben in den Sitzungsnotizen; sie werden nicht als neue eigenständige Antwort übernommen.'
        : 'Materialkontext gewechselt. Vorherige Ergebnisse sind keine aktuelle Bewertung. Dein Entwurf bleibt erhalten und muss neu geprüft werden.');
    } catch { showMessage('Dieser Fall ist kein nachweislich neuer Materialfall oder sein Kontext ist ungültig. Die bisherige Bindung bleibt aktiv.'); }
  }
  change.addEventListener('click', () => activate(options.changedContext(session.getState().context), 'same_instance'));
  fresh.addEventListener('click', () => activate(options.newCase(session.getState().context), 'new_case'));
  renderContext(); renderMeta(); node('p', 'Noch kein Entwurf geprüft.', feedback);
  return Object.freeze({ session, store, destroy: () => root.replaceChildren() });
}
