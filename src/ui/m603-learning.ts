import './m602-learning.css';
import './m603-learning.css';
import type { M603LearningController } from '../application/m603-learning.ts';
import { M603_CASES } from '../content/m603-materials.ts';
import { M603_CLAIM_TEXT, M603_HELP, M603_HELP_TOPICS, M603_NODE_TEXT, M603_RELATION_TEXT, M603_SELF_CHECK } from '../content/m603-learning.ts';
import { M603_CLAIMS, M603_NODES, M603_RELATIONS, M603_REQUIRED } from '../domain/m603-contract.ts';
import type { M603Edge, M603Node, M603Relation } from '../domain/m603-contract.ts';
import { STATUS_PRESENTATION } from './feedback-presentation.ts';
import type { M603Feedback } from '../domain/m603-contract.ts';

const criterionNames = ['Wasserverlust und Volumen', 'Wasserverlust und Turgor', 'Volumen als Teilbedingung der Ablösung', 'Turgorverlust als Teilbedingung der Ablösung'];
const pa = (value: number) => `${value.toLocaleString('de-DE')} Pa`;

/** Native controls are the complete input path, including on touch and keyboard.
 * SVG is a projection of the same semantic answer, never a second assessor. */
export function mountM603Learning(root: HTMLElement, model: M603LearningController, remount: () => void) {
  root.replaceChildren();
  function node<K extends keyof HTMLElementTagNameMap>(tag: K, text = '', parent: HTMLElement = root, cls = ''): HTMLElementTagNameMap[K] {
    const element = document.createElement(tag); element.textContent = text;
    if (cls) element.className = cls;
    parent.append(element); return element;
  }
  function jump(link: HTMLAnchorElement, target: HTMLElement) {
    link.href = `#${target.id}`;
    link.addEventListener('click', event => { event.preventDefault(); target.focus({ preventScroll: true }); target.scrollIntoView({ block: 'start' }); });
  }
  const skip = node('a', 'Zum Kausalnetz', root, 'skip-link');
  const header = node('header', '', root, 'site-header learning-header');
  const home = node('a', 'Zelllabor 11', header, 'brand'); home.href = '#/';
  node('span', 'Biologie · Jahrgang 11', header, 'header-subject');
  const main = node('main', '', root, 'learning-page causal-page');
  const intro = node('section', '', main, 'learning-intro');
  node('p', 'Übungsvorschau · M6.03', intro, 'eyebrow');
  const h1 = node('h1', 'Ursache und Wirkung verknüpfen', intro); h1.tabIndex = -1;
  node('p', 'Wie kann Wasserverlust eine Pflanzenzelle verändern? Untersuche das Material und baue ein eigenes Kausalnetz. Wähle für jeden Pfeil auch seine Bedeutung.', intro, 'learning-lead');
  node('p', 'Eine begrenzte Erklärungsaufgabe. M6.02 und M6.03 sind noch nicht die vollständige Mission M6.', intro, 'learning-note');
  const nav = node('nav', '', intro, 'learning-steps'); nav.setAttribute('aria-label', 'Dein Lernweg');
  const back = node('a', 'Vorherige Übung: Wasserhaushalt', nav); back.href = '#/m602';
  const toMaterial = node('a', '1 Material', nav), toNet = node('a', '2 Netz bauen', nav), toHelp = node('a', 'Hilfen', nav), toWriting = node('a', '3 Eigene Erklärung', nav);
  const live = node('p', '', main, 'visually-hidden'); live.setAttribute('role', 'status'); live.setAttribute('aria-atomic', 'true');

  const material = node('section', '', main, 'causal-material learning-material'); material.id = 'kausal-material'; material.tabIndex = -1; material.setAttribute('aria-label', 'Material zum Kausalnetz');
  const state = model.getState(), potentials = state.material.waterPotential;
  node('h2', `${M603_CASES[state.caseIndex].title} · Eine intakte Zwiebelzelle`, material);
  const materialGrid = node('div', '', material, 'causal-material-grid');
  const table = node('table', '', materialGrid); node('caption', 'Gegebene Gesamtwasserpotenziale einschließlich Druck', table);
  const head = node('tr', '', node('thead', '', table)); node('th', 'Raum', head).scope = 'col'; node('th', 'Wasserpotenzial Ψ', head).scope = 'col';
  const tbody = node('tbody', '', table);
  for (const [label, value] of [['Vakuole', potentials.vacuole], ['Cytosol', potentials.cytosol], ['Außenraum', potentials.external]] as const) {
    const row = node('tr', '', tbody); node('th', label, row).scope = 'row'; node('td', pa(value), row);
  }
  const conditions = node('div', '', materialGrid);
  node('p', 'Frühe Wasserverlustphase nach dem Lösungswechsel. Wasser kann Zellmembran und Tonoplast passieren. Saccharose bleibt weitgehend außen; andere Transporte sind ausgeschlossen.', conditions);
  node('p', 'Der Tonoplast trennt Vakuole und Cytosol, die Zellmembran Cytosol und Außenraum. Ein höheres Gesamtwasserpotenzial ist hier weniger negativ. Die Zellwand bleibt vergleichsweise formstabil.', conditions);
  node('p', 'Statische didaktische Daten, keine Messung oder Simulation. Aus dieser frühen Phase folgt noch keine beobachtete Ablösung. Adhäsion, Geometrie und zeitlicher Verlauf werden nicht berechnet.', material, 'learning-note');
  const definitions = node('details', '', material); node('summary', 'Begriffe im Material', definitions);
  node('p', 'Protoplast: der von der Zellmembran umschlossene Zellinhalt ohne Zellwand. Turgor: Druck des Zellinhalts gegen die Zellwand. Plasmolyse: Ablösung des Protoplasten von der Wand infolge osmotischen Wasserverlusts.', definitions);
  definitions.addEventListener('toggle', () => { if (definitions.open) { model.help('turgor', 1); update('Begriffserklärung als Hinweis erfasst.'); } });

  const workspace = node('section', '', main, 'causal-workspace'); workspace.id = 'kausal-aufgabe'; workspace.tabIndex = -1; workspace.setAttribute('aria-label', 'Kausalnetz erstellen');
  const graphColumn = node('div', '', workspace, 'causal-graph-column');
  node('h2', 'Dein Kausalnetz', graphColumn);
  node('p', 'Verbinde die vier Aussagen. Es gibt mehrere zusammenwirkende Folgen; eine einzige zeitliche Kartenreihe genügt nicht. Du entscheidest, welche Pfeile passen.', graphColumn);
  const figure = node('figure', '', graphColumn, 'causal-figure');
  const board = node('div', '', figure, 'causal-board');
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg'); svg.classList.add('causal-arrows'); svg.setAttribute('aria-hidden', 'true'); board.append(svg);
  const nodeButtons = {} as Record<M603Node, HTMLButtonElement>;
  for (const id of M603_NODES) {
    const button = node('button', '', board, `causal-node node-${id}`); button.type = 'button'; button.dataset['node'] = id;
    button.id = `causal-node-${id}`;
    node('span', id, button, 'causal-letter'); node('span', M603_NODE_TEXT[id], button);
    button.setAttribute('aria-label', `${id}: ${M603_NODE_TEXT[id]} – als Start oder Ziel wählen`);
    nodeButtons[id] = button;
  }
  node('figcaption', 'Pfeilspitzen zeigen die Richtung. Die Nummern gehören zu den vollständigen Verbindungen in der Liste. Die Position der Karten hat keine fachliche Bedeutung.', figure);
  const layout = node('button', 'Karten anders anordnen', graphColumn); layout.type = 'button';
  layout.addEventListener('click', () => { model.setLayout(model.getState().layout === 'default' ? 'alternate' : 'default'); update('Anordnung geändert. Verbindungen und Bewertung bleiben gleich.'); });
  const list = node('ol', '', graphColumn, 'causal-edge-list'); list.setAttribute('aria-label', 'Deine gerichteten Verbindungen');

  const editor = node('section', '', workspace, 'learning-form causal-editor'); editor.setAttribute('aria-label', 'Verbindung auswählen');
  node('h2', 'Einen Pfeil hinzufügen', editor);
  node('p', 'Wähle Start, Ziel und Bedeutung. Du kannst auch erst zwei Karten antippen oder anklicken. Ziehen ist nicht nötig.', editor);
  node('p', 'Tastatur: Mit Tab (auf macOS ggf. Wahltaste+Tab) zu den Karten wechseln und mit der Leertaste Start und Ziel wählen. Die Bedeutung kannst du auch in der aufklappbaren Liste auswählen.', editor, 'learning-note');
  const form = node('form', '', editor); let editingIndex: number | null = null;
  function select(label: string, id: string, options: readonly (readonly [string, string])[]) {
    const field = node('div', '', form); const title = node('label', label, field); title.htmlFor = id;
    const control = node('select', '', field); control.id = id; control.required = true;
    const empty = node('option', 'Bitte wählen', control); empty.value = '';
    for (const [value, text] of options) node('option', text, control).value = value;
    return control;
  }
  const from = select('Startknoten', 'causal-from', M603_NODES.map(id => [id, `${id} · ${M603_NODE_TEXT[id]}`] as const));
  const to = select('Zielknoten', 'causal-to', M603_NODES.map(id => [id, `${id} · ${M603_NODE_TEXT[id]}`] as const));
  const relation = select('Bedeutung des Pfeils', 'causal-relation', M603_RELATIONS.map(id => [id, M603_RELATION_TEXT[id]] as const));
  const relationPreview = node('p', 'Noch keine Bedeutung gewählt.', form, 'causal-relation-preview'); relationPreview.id = 'causal-type-explanation'; relation.setAttribute('aria-describedby', relationPreview.id);
  const typeList = node('details', '', form); typeList.id = 'causal-type-list';
  const typeToggle = node('summary', 'Bedeutung als Liste wählen', typeList); typeToggle.id = 'causal-type-toggle';
  node('p', 'Alternative ohne Auswahlmenü: Wähle einen Eintrag mit Klick, Tippen oder Leertaste. Mit den Pfeiltasten wechselst du zwischen den Bedeutungen.', typeList, 'learning-note');
  const typeGroup = node('fieldset', '', typeList, 'causal-type-group'); node('legend', 'Alle Bedeutungen des Pfeils', typeGroup);
  const typeInputs = M603_RELATIONS.map(id => {
    const label = node('label', '', typeGroup, 'reflection-item'), input = node('input', '', label);
    input.type = 'radio'; input.name = 'causal-kind'; input.value = id; input.id = `causal-kind-${id}`;
    node('span', M603_RELATION_TEXT[id], label);
    input.addEventListener('change', () => { if (input.checked) { relation.value = id; syncType(); } });
    return input;
  });
  function syncType() {
    relationPreview.textContent = relation.value ? M603_RELATION_TEXT[relation.value as M603Relation] : 'Noch keine Bedeutung gewählt.';
    for (const input of typeInputs) input.checked = input.value === relation.value;
  }
  relation.addEventListener('change', syncType);
  const add = node('button', 'Verbindung hinzufügen', form, 'learning-primary'); add.type = 'submit'; add.id = 'causal-add';
  const cancel = node('button', 'Bearbeiten abbrechen', form); cancel.type = 'button'; cancel.hidden = true;
  const editorMessage = node('p', '', form); editorMessage.setAttribute('role', 'status');
  function clearEditor() {
    editingIndex = null; from.value = ''; to.value = ''; relation.value = '';
    syncType(); add.textContent = 'Verbindung hinzufügen'; cancel.hidden = true; editorMessage.textContent = '';
    updateNodeSelection();
  }
  cancel.addEventListener('click', () => { clearEditor(); from.focus(); });
  function updateNodeSelection() {
    for (const id of M603_NODES) nodeButtons[id].setAttribute('aria-pressed', String(from.value === id || to.value === id));
  }
  for (const control of [from, to]) control.addEventListener('change', updateNodeSelection);
  for (const id of M603_NODES) nodeButtons[id].addEventListener('click', () => {
    if (!from.value || to.value) { from.value = id; to.value = ''; live.textContent = `Start ${id} gewählt. Wähle jetzt das Ziel.`; }
    else if (from.value === id) { live.textContent = 'Start und Ziel müssen verschieden sein.'; }
    else { to.value = id; live.textContent = `${from.value} → ${id}. Wähle jetzt die Bedeutung.`; relation.focus(); }
    updateNodeSelection();
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (from.value === to.value) { editorMessage.textContent = 'Start und Ziel müssen verschieden sein.'; to.focus(); return; }
    try {
      const edge: M603Edge = { from: from.value as M603Node, to: to.value as M603Node, relation: relation.value as M603Relation };
      if (editingIndex === null) model.addEdge(edge); else model.replaceEdge(editingIndex, edge);
      clearEditor(); update('Verbindung übernommen. Der Entwurf ist noch nicht erneut geprüft.'); from.focus();
    } catch { editorMessage.textContent = 'Die Verbindung konnte nicht übernommen werden. Maximal 24 Verbindungen sind möglich. Dein bisheriger Entwurf bleibt erhalten.'; }
  });
  const extra = node('details', '', editor); node('summary', 'Zusätzliche Aussagen prüfen (optional)', extra);
  node('p', 'Nur markierte Aussagen gehören zu deiner bewerteten Netzeinreichung. Du musst keine auswählen.', extra, 'learning-note');
  const claimControls = M603_CLAIMS.map(claim => {
    const label = node('label', '', extra, 'reflection-item'); const check = node('input', '', label); check.type = 'checkbox'; check.checked = model.getState().answer.claims.includes(claim);
    node('span', M603_CLAIM_TEXT[claim], label);
    check.addEventListener('change', () => { model.toggleClaim(claim, check.checked); update('Zusatzbehauptung geändert. Erneut prüfen.'); }); return check;
  });
  const submit = node('button', 'Kausalnetz prüfen', editor, 'learning-primary'); submit.type = 'button'; submit.id = 'causal-check';
  submit.addEventListener('click', () => { model.submit(); update(); feedback.focus(); live.textContent = `Kausalnetz: ${STATUS_PRESENTATION[model.getState().outcome!.status].label}.`; });

  const feedback = node('section', '', main, 'learning-feedback causal-feedback'); feedback.id = 'kausal-feedback'; feedback.tabIndex = -1; feedback.setAttribute('aria-label', 'Rückmeldung zum Kausalnetz');
  const helpers = node('section', '', main, 'learning-helpers'); helpers.id = 'kausal-hilfen'; helpers.tabIndex = -1;
  node('h2', 'Gezielte Unterstützung', helpers);
  node('p', 'Du kannst jederzeit selbst überarbeiten oder eine Hilfe aufrufen. Hilfen bleiben erreichbar und werden mit ihrer Herkunft erfasst. Keine Hilfe setzt Pfeile für dich.', helpers);
  const helpGrid = node('div', '', helpers, 'causal-help-grid');
  for (const topic of M603_HELP_TOPICS) {
    const profile = M603_HELP[topic], group = node('section', '', helpGrid, 'help-group'); node('h3', profile.title, group);
    const actions = node('div', '', group, 'help-actions'), helpText = node('div', '', group, 'help-text'); helpText.setAttribute('aria-live', 'polite');
    for (const [level, title, text] of [[1, 'Kurzer Hinweis', profile.hint], [2, 'Verbindungshilfe', profile.structure], [3, 'Begründete Teillösung', profile.solution]] as const) {
      const button = node('button', title, actions); button.type = 'button'; button.setAttribute('aria-label', `${title}: ${profile.title}`);
      button.addEventListener('click', () => { model.help(topic, level); helpText.textContent = text; update(`${title} geöffnet: ${profile.title}.`); });
    }
  }
  const comparison = node('button', 'Begründete Vergleichslösung ausdrücklich ansehen', helpers); comparison.type = 'button';
  const comparisonText = node('div', '', helpers, 'notebook-example'); comparisonText.setAttribute('aria-live', 'polite');
  comparison.addEventListener('click', () => {
    model.help('comparison', 3); comparisonText.replaceChildren(); node('h3', 'Lösung angesehen · zum eigenen Vergleich', comparisonText);
    const solution = node('ol', '', comparisonText);
    for (const edge of M603_REQUIRED) node('li', `${edge.from} → ${edge.to}: ${M603_RELATION_TEXT[edge.relation]}.`, solution);
    for (const topic of M603_HELP_TOPICS) node('p', M603_HELP[topic].solution, comparisonText);
    node('p', 'B und C dürfen nebeneinander stehen. D ist nur eine Möglichkeit unter gemeinsamen Bedingungen, keine bereits beobachtete Ablösung. Vergleiche und überarbeite dein eigenes Netz; es wird nichts automatisch übernommen.', comparisonText);
    update('Vergleichslösung angesehen; dein Netz bleibt unverändert.');
  });

  const support = node('section', '', main, 'learning-support'); support.setAttribute('aria-label', 'Hilfehistorie und Sitzungsstand');
  const writing = node('section', '', main, 'learning-notebook'); writing.id = 'kausal-erklaerung'; writing.tabIndex = -1;
  node('h2', 'Erkläre den Zusammenhang in eigenen Worten.', writing);
  node('p', 'Formuliere zwei bis vier zusammenhängende biologische Sätze auf Papier oder im flüchtigen Arbeitsbereich. Nutze das Material und dein überarbeitetes Netz. Begründe die Zusammenhänge mit „weil“, „dadurch“ oder „unter der Bedingung“.', writing);
  node('p', 'Deine eigene Erklärung wird nicht automatisch bewertet. Sie erhält keine Note und kein Klausururteil. Der Text wird weder dauerhaft gespeichert noch übertragen und geht beim Neuladen oder Materialwechsel verloren.', writing, 'learning-note');
  const draftLabel = node('label', 'Eigene Erklärung – unbewerteter flüchtiger Arbeitsbereich', writing); draftLabel.htmlFor = 'causal-explanation';
  const draft = node('textarea', '', writing); draft.id = draftLabel.htmlFor; draft.rows = 5; draft.value = model.getState().explanation; draft.autocomplete = 'off';
  draft.addEventListener('input', () => { model.editExplanation(draft.value); });
  const reflection = node('details', '', writing); node('summary', 'Kriterien für Selbst- oder Partnerprüfung', reflection);
  node('p', 'Die Häkchen dienen nur deiner Selbstprüfung. Sie erzeugen keine automatische Fachbewertung oder Erfolgsbestätigung deiner Erklärung.', reflection);
  for (const text of M603_SELF_CHECK) {
    const label = node('label', '', reflection, 'reflection-item'); const check = node('input', '', label); check.type = 'checkbox'; node('span', text, label);
  }
  node('p', 'Überarbeite eine noch nicht begründete Verbindung in deinem Text. Besprich offene Fragen mit einer Partnerperson oder deiner Lehrkraft.', writing);
  const repeat = node('section', '', main, 'learning-repeat'); node('h2', 'Mit anderem Material wiederholen', repeat);
  node('p', 'Der zweite Fall verwendet andere Gesamtwasserpotenziale für denselben Beziehungstyp. Das ist kein Transfernachweis. Beim Wechsel werden Netz und eigener Text geleert; aufgerufene Hilfen bleiben erfasst.', repeat);
  const next = node('button', 'Materialfall wechseln', repeat); next.type = 'button';
  next.addEventListener('click', () => { model.activateCase(model.getState().caseIndex === 0 ? 1 : 0); remount(); root.querySelector<HTMLElement>('#kausal-material')?.focus(); });
  const footer = node('footer', '', root, 'site-footer'); node('span', 'Übungsvorschau · noch keine Unterrichtsfreigabe', footer); const footerHome = node('a', 'Zur Startseite', footer); footerHome.href = '#/';
  jump(skip, workspace); jump(toMaterial, material); jump(toNet, workspace); jump(toHelp, helpers); jump(toWriting, writing);

  function drawGraph() {
    const current = model.getState(), rect = board.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    svg.replaceChildren(); svg.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);
    function element<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number>, parent: SVGElement = svg) {
      const value = document.createElementNS(svgNS, tag); for (const [key, attr] of Object.entries(attrs)) value.setAttribute(key, String(attr)); parent.append(value); return value;
    }
    const defs = element('defs', {}), marker = element('marker', { id: 'causal-arrow-tip', viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 8, markerHeight: 8, orient: 'auto-start-reverse' }, defs);
    element('path', { d: 'M 0 0 L 10 5 L 0 10 z', fill: '#233d3b' }, marker);
    const groups = new Map<string, number>(), labels: { x: number; y: number }[] = [];
    const cards = M603_NODES.map(id => nodeButtons[id].getBoundingClientRect());
    let diagonalCount = 0;
    current.answer.edges.forEach((edge, index) => {
      const a = nodeButtons[edge.from].getBoundingClientRect(), b = nodeButtons[edge.to].getBoundingClientRect();
      const ax = a.x + a.width / 2 - rect.x, ay = a.y + a.height / 2 - rect.y, bx = b.x + b.width / 2 - rect.x, by = b.y + b.height / 2 - rect.y;
      const dx = bx - ax, dy = by - ay, length = Math.hypot(dx, dy);
      if (!length) return;
      const pair = [edge.from, edge.to].sort().join(''), count = groups.get(pair) ?? 0; groups.set(pair, count + 1);
      const offset = (count % 2 ? 1 : -1) * Math.ceil(count / 2) * 56;
      const boundary = (box: DOMRect) => Math.min(dx ? (box.width / 2 + 4) / Math.abs(dx) : Infinity, dy ? (box.height / 2 + 4) / Math.abs(dy) : Infinity);
      let pathData: string, pointAt: (t: number) => { x: number; y: number };
      if (Math.abs(dx) > 1 && Math.abs(dy) > 1) {
        // Opposite corners use the empty row gutter, even when large text makes
        // the rows unequal. A diagonal centre-to-centre line could cross a card.
        const top = ay < by ? a : b, bottom = ay < by ? b : a;
        const gap = bottom.top - top.bottom, lane = diagonalCount++;
        const shift = (lane % 2 ? -1 : 1) * Math.min(Math.ceil(lane / 2) * 14, Math.max(0, gap / 2 - 17));
        const y = (top.bottom + bottom.top) / 2 - rect.y + shift;
        const startY = (ay < by ? a.bottom + 4 : a.top - 4) - rect.y;
        const endY = (ay < by ? b.top - 4 : b.bottom + 4) - rect.y;
        pathData = `M ${ax} ${startY} L ${ax} ${y} L ${bx} ${y} L ${bx} ${endY}`;
        pointAt = t => ({ x: ax + (bx - ax) * t, y });
      } else {
        const ar = boundary(a), br = boundary(b), x1 = ax + dx * ar, y1 = ay + dy * ar, x2 = bx - dx * br, y2 = by - dy * br;
        const mx = (x1 + x2) / 2 - dy / length * offset, my = (y1 + y2) / 2 + dx / length * offset;
        pathData = `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
        pointAt = t => ({ x: (1 - t) ** 2 * x1 + 2 * (1 - t) * t * mx + t ** 2 * x2, y: (1 - t) ** 2 * y1 + 2 * (1 - t) * t * my + t ** 2 * y2 });
      }
      const path = element('path', { d: pathData, fill: 'none', stroke: '#233d3b', 'stroke-width': 2, 'marker-end': 'url(#causal-arrow-tip)' });
      path.dataset['from'] = edge.from; path.dataset['to'] = edge.to; path.dataset['relation'] = edge.relation;
      const candidates = [.5, .2, .8, .35, .65, .15, .85, .25, .75].map(pointAt);
      const point = candidates.find(p => labels.every(label => Math.hypot(p.x - label.x, p.y - label.y) >= 25)
        && cards.every(card => {
          const x = p.x + rect.x, y = p.y + rect.y;
          return Math.hypot(x - Math.max(card.left, Math.min(card.right, x)), y - Math.max(card.top, Math.min(card.bottom, y))) >= 13;
        })) ?? candidates[0]!;
      labels.push(point);
      const { x: tx, y: ty } = point;
      element('circle', { cx: tx, cy: ty, r: 12, fill: '#fffef9', stroke: '#233d3b' });
      element('text', { x: tx, y: ty + 4, 'text-anchor': 'middle', 'font-size': 12, fill: '#233d3b' }).textContent = String(index + 1);
    });
  }
  const observer = new ResizeObserver(drawGraph); observer.observe(board);
  function renderItem(parent: HTMLElement, value: M603Feedback) {
    const presentation = STATUS_PRESENTATION[value.status], p = node('p', `${presentation.symbol} ${presentation.label}: ${value.text}`, parent, 'causal-item-feedback'); p.dataset['color'] = presentation.color; p.dataset['status'] = value.status;
  }
  function update(message = '') {
    const current = model.getState(); board.dataset['layout'] = current.layout; updateNodeSelection(); list.replaceChildren();
    if (!current.answer.edges.length) node('li', 'Noch keine Verbindung. Wähle Start, Ziel und Bedeutung.', list, 'causal-empty');
    current.answer.edges.forEach((edge, index) => {
      const row = node('li', '', list); row.dataset['edgeIndex'] = String(index);
      node('p', `${edge.from} → ${edge.to}: ${M603_RELATION_TEXT[edge.relation]}`, row, 'causal-edge-text');
      if (current.outcome && !current.stale && current.outcome.edges[index]) renderItem(row, current.outcome.edges[index]!);
      const actions = node('div', '', row, 'causal-edge-actions'); const edit = node('button', 'Bearbeiten', actions), remove = node('button', 'Entfernen', actions);
      edit.type = remove.type = 'button'; edit.setAttribute('aria-label', `Verbindung ${index + 1} bearbeiten`); remove.setAttribute('aria-label', `Verbindung ${index + 1} entfernen`);
      edit.addEventListener('click', () => { editingIndex = index; from.value = edge.from; to.value = edge.to; relation.value = edge.relation; syncType(); add.textContent = 'Verbindung ändern'; cancel.hidden = false; updateNodeSelection(); from.focus(); });
      remove.addEventListener('click', () => { model.removeEdge(index); clearEditor(); update('Verbindung entfernt. Erneut prüfen.'); from.focus(); });
    });
    feedback.replaceChildren();
    if (current.stale) {
      feedback.dataset['status'] = 'stale'; feedback.dataset['color'] = 'neutral'; node('h2', '○ Rückmeldung nicht mehr aktuell', feedback);
      node('p', 'Netz oder Unterstützung geändert. Prüfe den aktuellen Entwurf erneut. Ein früher richtiges Netz wird dadurch nicht rückwirkend biologisch falsch; sein Beleg bestätigt diesen neuen Stand nicht.', feedback);
    } else if (!current.outcome) {
      feedback.dataset['status'] = 'empty'; feedback.dataset['color'] = 'neutral'; node('h2', '○ Noch kein Netz geprüft', feedback);
      node('p', 'Baue dein Netz und lasse die gewählten Verbindungen prüfen.', feedback);
    } else {
      const outcome = current.outcome, display = STATUS_PRESENTATION[outcome.status]; feedback.dataset['status'] = outcome.status; feedback.dataset['color'] = display.color;
      node('h2', `${display.symbol} Kausalnetz: ${display.label}`, feedback);
      if (outcome.status === 'correct') {
        node('p', 'Die gewählten Beziehungen sind für diesen Materialfall vollständig geprüft und richtig. Bestätigt ist nur das Kausalnetz. D bleibt eine mögliche Ablösung, keine Beobachtung oder Garantie.', feedback);
        const nextStep = node('a', 'Nächster Lernschritt: Zusammenhang in eigenen Worten erklären', feedback, 'learning-jump'); jump(nextStep, writing);
      } else if (outcome.status === 'incorrect') node('p', 'Mindestens eine gewählte Aussage widerspricht dem Material. Richtige Teilbeziehungen bleiben anerkannt. Überarbeite die konkret erklärten Fehler.', feedback);
      else if (outcome.status === 'partial') node('p', 'Ein Teil ist bearbeitet; notwendige Beziehungen oder gemeinsame Bedingungen fehlen noch. Ergänze dein Netz.', feedback);
      for (const item of outcome.messages) renderItem(feedback, item);
      const criteria = node('ul', '', feedback, 'causal-criteria');
      outcome.criteria.forEach((criterion, index) => {
        const display = STATUS_PRESENTATION[criterion.status]; const li = node('li', `${display.symbol} ${criterionNames[index]}: ${display.label}${criterion.reasonCode === 'JOINT_CONDITION_MISSING' ? ' – zweite gemeinsame Bedingung fehlt' : ''}`, criteria);
        li.dataset['color'] = display.color; li.dataset['criterion'] = criterion.id;
      });
      for (const item of outcome.claims) {
        node('p', `Zusatz: ${M603_CLAIM_TEXT[current.answer.claims[item.index]!]}`, feedback); renderItem(feedback, item);
      }
      if (outcome.status !== 'correct') {
        const revise = node('button', 'Netz selbst überarbeiten', feedback); revise.type = 'button'; revise.addEventListener('click', () => { from.focus(); from.scrollIntoView({ block: 'center' }); });
      }
    }
    support.replaceChildren(); node('h2', 'Unterstützung und Sitzungsstand', support);
    node('p', current.assistance === 'solution_viewed' ? 'Lösung angesehen. Ein richtiges Netz bleibt richtig, seine Unterstützung bleibt sichtbar.'
      : current.assistance === 'hint' ? 'Digitale Unterstützung aufgerufen. Die Bewertung und die Hilfenutzung werden getrennt angezeigt.'
        : 'In dieser Sitzung keine zusätzliche digitale Hilfe aufgerufen. Das ist kein Erstleistungs- oder Beherrschensnachweis.', support);
    if (current.historyUnverified) node('p', 'Frühere Hilfehistorie nicht gesichert. Fachliche Rückmeldung bleibt möglich; ein aktueller Erfolgsbeleg wird nicht erzeugt.', support);
    node('p', current.receipt ? 'Aktueller geprüfter Netzbeleg in dieser Sitzung. Keine Bewertung deiner freien Erklärung.' : 'Kein aktueller Netzbeleg in dieser Sitzung.', support);
    if (current.revisedAfterFeedback) node('p', 'Nach Rückmeldung selbst überarbeitet – in dieser Sitzung nachvollziehbar.', support);
    node('p', 'M6.03 speichert weder Fortschritt noch Netz, Hilfeereignisse oder Erklärung dauerhaft. Erfasst sind nur hier und in der vorherigen Übung aufgerufene digitale Hilfen; externe Unterstützung kann die Anwendung nicht erkennen.', support, 'learning-note');
    const history = node('details', '', support); node('summary', `Herkunft der digitalen Hilfen (${current.help.length})`, history);
    const log = node('ol', '', history);
    for (const event of current.help) {
      const topic = M603_HELP_TOPICS.find(item => item === event.source);
      node('li', `${event.taskId} · ${topic ? M603_HELP[topic].title : event.source === 'comparison' ? 'Vergleichslösung' : event.source} · Stufe ${event.level} · ${event.kind === 'solution_viewed' ? 'Lösung angesehen' : 'Hinweis/Strukturhilfe'} · Kontext ${event.contextHash.slice(-10)}`, log);
    }
    claimControls.forEach((check, i) => { check.checked = current.answer.claims.includes(M603_CLAIMS[i]!); });
    if (message) live.textContent = message;
    drawGraph();
  }
  function destroy() { observer.disconnect(); }
  update(); requestAnimationFrame(drawGraph);
  return Object.freeze({ destroy });
}
