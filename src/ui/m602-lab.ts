import { createM602Session, createM602CuedSession } from '../application/m602-session.ts';
import { M602_FIELDS } from '../domain/m602-contract.ts';
import type { M602Field } from '../domain/m602-contract.ts';
import type { M602ContractVersion, M602VersionedOutcome } from '../domain/m602-cued-contract.ts';
import type { M602SessionController } from '../application/m602-session.ts';
import type { NamingSessionOptions } from '../application/naming-session.ts';
import type { TaskContext } from '../domain/task-context.ts';
import type { NamingLabOptions } from './naming-lab.ts';
import { createProgressStore } from '../persistence/progress-store.ts';
import { appendAttempt } from '../domain/progress.ts';
import { STATUS_PRESENTATION, ASSISTANCE_LABELS } from './feedback-presentation.ts';
import { NAMING_HELP } from '../assessment/naming-feedback.ts';
import { RELATION_HELP } from '../assessment/m602-feedback.ts';

const labels = Object.freeze({ process: 'a) Fachbegriff', direction: 'b) Nettorichtung', volume: 'c) Vakuolenvolumen' });
const helpLabels = Object.freeze({ process: 'Fachbegriff', direction: 'Nettorichtung', volume: 'Vakuolenvolumen' });
/** Purely test-internal, shared status vocabulary and existing metadata store. */
function mountLab<V extends M602ContractVersion>(root: HTMLElement, options: NamingLabOptions,
  factory: (context: TaskContext, configuration: NamingSessionOptions) => M602SessionController<V>, cued: boolean) {
  const store = createProgressStore(options.initialContext.contentVersion, options.acquireStorage);
  const loaded = store.getState();
  const session = factory(options.initialContext, { idPrefix: options.idPrefix, resumed: options.resumed, loadedAttempts: [...loaded.progress.attempts, ...(loaded.history?.attempts ?? [])] });
  const drafts: string[] = [];
  root.replaceChildren();
  function node<K extends keyof HTMLElementTagNameMap>(tag: K, text = '', parent: HTMLElement = root): HTMLElementTagNameMap[K] {
    const el = document.createElement(tag); el.textContent = text; parent.append(el); return el;
  }
  node('style').textContent = `:root{font-family:system-ui,sans-serif;line-height:1.6;overflow-wrap:anywhere;color:#183c32;background:#eff4ef}*{box-sizing:border-box}body{margin:0}main{max-width:920px;margin:auto;padding:20px}section,form{padding:18px;background:white;border:1px solid #b2c4b9;border-radius:12px;margin:16px 0}h1,h2{line-height:1.3}input,textarea,button,summary{font:inherit;min-height:46px}input,textarea{display:block;width:100%;padding:10px;margin:8px 0 18px;border:2px solid #5d786a;border-radius:6px}button{padding:9px 13px;margin:6px 8px 6px 0;border:1px solid #527565;border-radius:7px;background:#edf4ee;color:#183c32;cursor:pointer}button[type=submit]{background:#235b47;color:white}:focus-visible{outline:3px solid #2256da;outline-offset:3px}summary{cursor:pointer;padding:8px}[data-color=green]{border-left:7px solid #287447}[data-color=red]{border-left:7px solid #b03939}[data-color=yellow]{border-left:7px solid #977000}[data-color=neutral]{border-left:7px solid #6d7472}dt{font-weight:700}dd{margin:0 0 12px}table{width:100%;border-collapse:collapse}td,th{text-align:left;padding:7px;border-bottom:1px solid #ccdacf}@media(max-width:480px){main{padding:12px}section,form{padding:12px}button{width:100%;margin-right:0}}`;
  const main = node('main'); node('p', 'ZELLLABOR 11 · INTERNE P02c-BEDIENPROBE', main); node('h1', 'Wasserverlust schrittweise erklären', main);
  node('p', 'Entwicklungsansicht für M6.02, keine vollständige Mission und keine Unterrichtsfreigabe.', main);
  node('p', cued ? 'Aktueller Vertrag: kurze selbst eingetragene Relationsausdrücke. Keine Bewertung freier Erklärungsaufsätze.' : 'Historische Satzprüfung, kein aktueller Relationsvertrag und keine aktuelle Freigabe.', main);
  const material = node('section', '', main); material.setAttribute('aria-label', 'Frage und Material');
  node('h2', 'Beantworte die drei Teilfragen getrennt: a) Wie heißt der Wassertransportvorgang? b) In welche Richtung bewegt sich Wasser im angezeigten Zustand netto über die Zellmembran? c) Wie verändert sich in dieser Phase das Vakuolenvolumen?', material);
  node('p', 'Betrachtet wird eine frühe Phase der Wasserabgabe nach dem Lösungswechsel, nicht der mathematische Zeitpunkt des Austauschs. Für den angezeigten Zustand gilt ausdrücklich: Wasserpotenzial Vakuole > Cytosol > Außenlösung. Zellmembran und Tonoplast lassen Wasser passieren. Saccharose wird im Beobachtungszeitraum weitgehend zurückgehalten. Die Zelle ist intakt; weitere Stofftransporte werden ausgeblendet. Ein höheres Wasserpotenzial liegt hier vor, wenn der Wert weniger negativ ist.', material);
  const potentials = node('p', '', material);
  const form = node('form', '', main); node('h2', 'Deine drei Antworten', form);
  node('p', cued ? 'Gegeben sind Wasser, Nettobetrachtung, Zellmembran und die frühe Phase sowie Vakuole und Volumen. Trage nur deine kurze Richtung und Veränderung ein. Die Felder starten leer. Ganze Sätze und unbekannte Zusätze werden nicht automatisch bewertet; das ist kein biologischer Fehler.' : 'Fachbegriff: Ein Begriff genügt. Du musst keinen Satz schreiben. Für Richtung und Volumen: Antworte je Feld mit einer kurzen Beziehung für den angezeigten Zustand. Einzelbewegung und Nettostrom sind verschieden. Nicht eindeutige Zeitbezüge oder weitere ungeprüfte Aussagen benötigen Klärung.', form);
  const inputs = {} as Record<M602Field, HTMLInputElement>;
  let activeField: M602Field = 'process';
  for (const field of M602_FIELDS) {
    const label = node('label', cued && field !== 'process' ? field === 'direction' ? 'Wasser bewegt sich NETTO über die ZELLMEMBRAN: deine Richtung' : 'Das VAKUOLENVOLUMEN: deine Veränderung' : labels[field], form); label.htmlFor = `m602-${field}`;
    const input = node('input', '', form); input.id = label.htmlFor; input.autocomplete = 'off'; inputs[field] = input;
    input.addEventListener('focus', () => { activeField = field; });
    input.addEventListener('input', () => { session.edit(field); message('Entwurf geändert. Das vorige Ergebnis gilt nicht als aktuelle Bewertung. Prüfe erneut.'); renderMeta(); });
  }
  node('p', 'Weitere Aussagen (optional) – noch nicht fachlich geprüft', form);
  const extras = node('details', '', form); node('summary', 'Weitere Aussagen öffnen', extras);
  const extraLabel = node('label', 'Weitere Aussagen – ungeprüft', extras); extraLabel.htmlFor = 'm602-extra';
  if (cued) node('p', 'Weitere Aussagen gehören zu derselben Einreichung. Ungeprüfter relevanter Text bleibt sichtbar und verhindert das grüne Gesamturteil.', extras);
  const extra = node('textarea', '', extras); extra.id = extraLabel.htmlFor;
  extra.addEventListener('input', () => { session.edit(); message('Zusatz geändert. Dieser Text bleibt sichtbar und wird nicht stillschweigend mitbestätigt.'); renderMeta(); });
  const check = node('button', 'Drei Antworten prüfen', form); check.type = 'submit';
  const feedback = node('section', '', main); feedback.setAttribute('aria-label', 'Gesamtrückmeldung'); feedback.setAttribute('aria-live', 'polite'); feedback.tabIndex = -1;
  const helpers = node('section', '', main); helpers.setAttribute('aria-label', 'Überarbeiten und Hilfen');
  const revise = node('button', 'Antwort selbst überarbeiten', helpers); revise.addEventListener('click', () => { session.edit(); message('Selbstüberarbeitung: Prüfe deinen neuen Entwurf anschließend erneut.'); inputs[activeField].focus(); });
  const helpGroups: { bank: HTMLButtonElement; solution: HTMLButtonElement; text: HTMLDivElement }[] = [];
  for (const field of M602_FIELDS) {
    const group = node('section', '', helpers); group.setAttribute('aria-label', `Hilfen ${field}`); node('h3', helpLabels[field], group);
    const profile = field === 'process' ? NAMING_HELP['M6.02'] : RELATION_HELP[field];
    const hint = node('button', `Hinweis: ${helpLabels[field]}`, group), bank = node('button', `Wortbank: ${helpLabels[field]}`, group), solution = node('button', `Lösung ansehen: ${helpLabels[field]}`, group);
    bank.hidden = solution.hidden = true; const text = node('div', '', group); text.setAttribute('aria-live', 'polite'); helpGroups.push({ bank, solution, text });
    hint.addEventListener('click', () => { session.help(field, 'hint'); text.replaceChildren(); node('p', profile.hint, text); bank.hidden = false; message('Hinweis aufgerufen. Weitere Versuche dieser Instanz behalten die tatsächliche Hilfe.'); renderMeta(); });
    bank.addEventListener('click', () => {
      session.help(field, 'wordbank'); text.replaceChildren(); node('p', 'Wähle eine Antwort und prüfe sie als neuen unterstützten Versuch.', text);
      for (const value of profile.wordbank) { const option = node('button', `Übernehmen ${helpLabels[field]}: ${value}`, text); option.addEventListener('click', () => {
        session.help(field, 'clarified'); inputs[field].value = value; message('Auswahl übernommen, noch nicht geprüft.'); renderMeta(); inputs[field].focus();
      }); }
      solution.hidden = false; message('Wortbank geöffnet; die Hilfe wird getrennt von der fachlichen Richtigkeit erfasst.'); renderMeta();
    });
    solution.addEventListener('click', () => { session.help(field, 'solution_viewed'); text.replaceChildren(); node('h4', 'Ausdrücklich aufgerufene Lösung', text); node('p', profile.solution, text); message('Lösung angesehen. Abschreiben in dieser Instanz ist kein eigenständiger Erfolgsnachweis.'); renderMeta(); });
  }
  const supportInfo = node('p', '', helpers), storageInfo = node('p', '', main); storageInfo.setAttribute('role', 'status');
  const history = node('section', '', main); history.setAttribute('aria-label', 'Versuchsverlauf');
  const dev = node('section', '', main); node('h2', 'Interne Testfall-Steuerung', dev); node('p', 'Synthetische Fälle, keine Simulation. Neue Fälle starten leer; vorige Eingaben bleiben RAM-Notizen.', dev);
  const change = node('button', 'Materialzustand wechseln', dev), fresh = node('button', 'Neuen Materialfall starten', dev);
  const debug = node('details', '', dev); node('summary', 'Technische Bindung ansehen', debug); const binding = node('p', '', debug);
  const answers = () => Object.fromEntries(M602_FIELDS.map(f => [f, inputs[f].value])) as Record<M602Field, string>;
  function message(text: string) { feedback.replaceChildren(); feedback.dataset['status'] = 'technical'; feedback.dataset['color'] = 'yellow'; node('h2', '! Technischer Hinweis, kein fachliches Urteil', feedback); node('p', text, feedback); }
  function renderMeta() {
    const s = session.getState(), saved = store.getState();
    potentials.textContent = `Gesamtwasserpotenziale einschließlich Druck in Pa: ${JSON.stringify(s.context.material['waterPotential'])}`;
    binding.textContent = JSON.stringify(s.context);
    supportInfo.textContent = s.history === 'history_unverified' ? 'Frühere Hilfen unbekannt. Auch ein Materialwechsel stellt kein verlorenes Historienvertrauen wieder her; fachliches Üben bleibt möglich.'
      : M602_FIELDS.map(f => `${helpLabels[f]}: ${ASSISTANCE_LABELS[s.fields[f].assistance]}`).join(' · ');
    storageInfo.textContent = saved.issue ? `Speicherhinweis (${saved.issue}): Arbeit bleibt in dieser Sitzung, fremde Daten bleiben erhalten.` : 'Nur acht Metadatenfelder je vollständigem Versuch werden gespeichert, keine Rohtexte oder Hilfeereignisse.';
    history.replaceChildren(); node('h2', 'Versuchsverlauf – nur RAM', history);
    for (const o of s.outcomes) node('p', `${o.submission.attemptId} · Vorgänger ${o.submission.predecessorId ?? 'keiner'} · ${o.submission.context.contextHash === s.context.contextHash ? 'damaliger Versuch' : 'Veraltet – keine aktuelle Bewertung'} · ${STATUS_PRESENTATION[o.overallStatus].label} · ${JSON.stringify(o.submission.answers)} · ursprünglicher Kontext ${o.submission.context.contextHash}`, history);
    for (const draft of drafts) node('p', draft, history);
  }
  function renderOutcome(o: M602VersionedOutcome<V>) {
    feedback.replaceChildren(); const status = STATUS_PRESENTATION[o.overallStatus]; feedback.dataset['status'] = o.overallStatus; feedback.dataset['color'] = status.color;
    node('h2', `${status.symbol} M6.02 insgesamt: ${status.label}`, feedback);
    for (const field of M602_FIELDS) {
      const f = o.fields[field], display = STATUS_PRESENTATION[f.result.status], panel = node('section', '', feedback); panel.setAttribute('aria-label', `Bewertung ${field}`); panel.dataset['status'] = f.result.status; panel.dataset['color'] = display.color;
      node('h3', `${display.symbol} ${labels[field]} · ${f.result.criteria[0]!.id}: ${display.label}`, panel);
      const dl = node('dl', '', panel);
      for (const [title, value] of [['Erkannter Ansatz', f.feedback.recognized], ['Unterschied und Begründung', f.feedback.difference], ['Nächster Schritt', f.feedback.next]]) { node('dt', title, dl); node('dd', value, dl); }
    }
    for (const n of o.notAssessed) node('p', `Nicht geprüft (not_assessed), ${n.field}: ${n.value}`, feedback);
    if (o.pendingCriteria.length) node('p', `Noch offen: ${o.pendingCriteria.join(', ')}`, feedback);
    node('p', o.support.history === 'verified' ? ASSISTANCE_LABELS[o.support.assistance] : 'Historie ungesichert: Frühere Hilfe ist unbekannt. Kein neuer Erfolgsnachweis, auch nach Materialwechsel.', feedback);
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    try {
      const o = session.submit(session.makeSubmission(answers(), [extra.value])); renderOutcome(o);
      if (o.overallStatus === 'correct' && o.support.history === 'verified') {
        const receipt = session.record(o);
        if (!store.getState().progress.attempts.some(a => a.attemptId === receipt.attemptId)) store.save(appendAttempt(store.getState().progress, receipt));
      }
      renderMeta(); feedback.focus();
    } catch { message('Einreichung technisch nicht aktuell oder gültig. Kein fachliches Fehlurteil und keine Erfolgsbuchung.'); feedback.focus(); }
  });
  function activate(freshCase: boolean) {
    try {
      const old = session.getState().context, draft = `${old.contextHash}: ${JSON.stringify(answers())} · Zusatz: ${extra.value} · Keine Übernahme als neue Antwort.`;
      session.activate(freshCase ? options.newCase(old) : options.changedContext(old), freshCase ? 'new_case' : 'same_instance');
      if (freshCase) { drafts.push(draft); for (const f of M602_FIELDS) inputs[f].value = ''; extra.value = ''; }
      for (const h of helpGroups) { h.bank.hidden = h.solution.hidden = true; h.text.replaceChildren(); }
      message('Kontext gewechselt. Vorige Ergebnisse sind keine aktuelle Bewertung. Neue Materialfälle benötigen neue Eingaben; ungesicherte Historie bleibt ungesichert.'); renderMeta();
    } catch { message('Dieser Materialfall ist nicht nachweislich neu oder technisch ungültig. Die vorige Bindung bleibt erhalten.'); }
  }
  change.addEventListener('click', () => activate(false)); fresh.addEventListener('click', () => activate(true));
  renderMeta(); node('p', 'Noch kein Entwurf geprüft.', feedback);
  return Object.freeze({ session, store, destroy: () => root.replaceChildren() });
}

/** Historical regression view only. The current view has a distinct versioned entry. */
export function mountM602Lab(root: HTMLElement, options: NamingLabOptions) {
  return mountLab(root, options, createM602Session, false);
}
export function mountM602CuedLab(root: HTMLElement, options: NamingLabOptions) {
  return mountLab(root, options, createM602CuedSession, true);
}
