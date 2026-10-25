/** Small, field-specific semantic units. A failed full parse never supplies a
 * biological judgment. No dependency on test texts, DOM or persistence. */
export type Room = 'cytosol' | 'external' | 'vacuole';
export interface WaterRelation {
  readonly quantity: 'transport_amount';
  readonly substance: 'water' | 'sucrose';
  readonly membrane: 'cell_membrane' | 'tonoplast';
  readonly source: Room;
  readonly target: Room;
  readonly phase: 'given_early_state';
  readonly scale: 'balance' | 'individual' | 'all';
  readonly net: boolean;
  readonly negative: boolean;
}
export interface SemanticAtom { readonly tag: string; readonly negative: boolean; readonly individual: boolean; readonly net: boolean }
const rooms: Readonly<Record<string, Room>> = Object.fromEntries([
  ...['zelle', 'pflanzenzelle', 'cytosol', 'cytoplasma', 'zellinneren', 'zellinnere', 'innen', 'drinnen', 'zellinnenseite', 'inneren der zelle', 'innenraum der zelle'].map(k => [k, 'cytosol']),
  ...['aussen', 'draussen', 'aussenraum', 'aussenloesung', 'aussenmedium', 'umgebung', 'umgebende loesung', 'umgebenden loesung', 'umgebende medium', 'umgebenden medium'].map(k => [k, 'external']),
  ...['vakuole', 'zentralvakuole', 'vakuolenraum'].map(k => [k, 'vacuole']),
]);
function room(s: string): Room | undefined { return rooms[s.replace(/^(?:der|die|das|den|dem|ihre|ihrer) /u, '')]; }
const membranes: Readonly<Record<string, WaterRelation['membrane']>> = { zellmembran: 'cell_membrane', plasmamembran: 'cell_membrane', tonoplast: 'tonoplast', tonoplasten: 'tonoplast' };
const directions: Readonly<Record<string, readonly [Room, Room]>> = {
  aus: ['cytosol', 'external'], ein: ['external', 'cytosol'],
  'nach aussen': ['cytosol', 'external'], 'nach draussen': ['cytosol', 'external'], auswaerts: ['cytosol', 'external'], hinaus: ['cytosol', 'external'], raus: ['cytosol', 'external'],
  'nach innen': ['external', 'cytosol'], 'nach drinnen': ['external', 'cytosol'], einwaerts: ['external', 'cytosol'], hinein: ['external', 'cytosol'], rein: ['external', 'cytosol'],
};
const currentModifiers = /\b(?:netto|insgesamt|ueberwiegend|in der bilanz|in der summe|in der nettobilanz|im ergebnis|im moment|im betrachteten zustand|in dieser fruehen phase|jetzt)\b/gu;
function modifiers(s: string): string { return s.replace(currentModifiers, '').replace(/\s+/gu, ' ').trim(); }
/** Complete path, including an explicit membrane when given. No dative-location
 * inference: "in der Zelle" is not a destination. */
export function waterPath(input: string): Pick<WaterRelation, 'source' | 'target' | 'membrane'> | null {
  let text = input.trim(), membrane: WaterRelation['membrane'] | undefined;
  const boundary = /(?:^| )(?:durch|ueber|an) (?:die |der |den |dem )?(zellmembran|plasmamembran|tonoplasten?)(?= |$)/u;
  const m = text.match(boundary);
  if (m) { membrane = membranes[m[1]!]; text = text.replace(boundary, ' ').replace(/\s+/gu, ' ').trim(); }
  if (/^hinein(?:stroemt|fliesst|tritt|geht)$/u.test(text)) text = 'hinein';
  if (/^hinaus(?:stroemt|fliesst|tritt|geht)$/u.test(text)) text = 'hinaus';
  text = text.replace(/^vom /u, 'von dem ').replace(/\bzum /u, 'in den ').replace(/\bzur /u, 'in die ').replace(/\bins /u, 'in das ');
  // Verb particles must agree with the parsed path, rather than supply a new room.
  const particle = text.match(/ (heraus|hinaus|aus|ab|hinein|ein|ueber)$/u)?.[1];
  if (particle) text = text.slice(0, -particle.length - 1);
  let source: Room | undefined, target: Room | undefined;
  const direct = directions[text];
  if (direct) [source, target] = direct;
  else {
    const arrow = text.split(/\s*→\s*/u);
    const pair = text.match(/^(?:aus|von) (.+?)(?: aus| weg)? (?:in|nach) (.+)$/u);
    const from = text.match(/^aus (.+)$/u), to = text.match(/^(?:in|nach|in richtung) (.+)$/u);
    if (arrow.length === 2) { source = room(arrow[0]!); target = room(arrow[1]!); }
    else if (pair) { source = room(pair[1]!); target = room(pair[2]!); }
    else if (from) { source = room(from[1]!); target = source === 'cytosol' ? 'external' : source === 'vacuole' ? 'cytosol' : undefined; }
    else if (to && !/^in (?:der|dem) /u.test(text)) { target = room(to[1]!); source = target === 'external' ? 'cytosol' : target === 'cytosol' ? 'external' : undefined; }
  }
  if (!source || !target || source === target) return null;
  const actual = source === 'external' || target === 'external' ? source === 'vacuole' || target === 'vacuole' ? null : 'cell_membrane' : 'tonoplast';
  if (!actual || membrane && actual !== membrane) return null;
  if (['heraus', 'hinaus', 'aus', 'ab'].includes(particle ?? '') && target !== 'external') return null;
  if (['hinein', 'ein'].includes(particle ?? '') && target !== 'cytosol') return null;
  return { source, target, membrane: actual };
}
const subject = '(?:ein wassermolekuel|einzelne wassermolekuele|einzelne molekuele|manche wassermolekuele|alle wassermolekuele|alle wasserteilchen|wassermolekuele|wasserteilchen|(?:das )?wasser|(?:die )?saccharose|zucker|(?:der |die )?(?:gerichtete )?(?:nettowasserbewegung|nettobewegung des wassers|nettofluss des wassers|nettofluss von wasser|nettostrom|nettowasserstrom|nettowassertransport|nettotransport|wasserstrom|nettobewegung))';
const motionVerb = '(?:bewegt sich|bewegen sich|fliesst|fliessen|stroemt|stroemen|tritt|treten|geht|gehen|wandert|wandern|gelangt|gelangen|diffundiert|verlaesst|verlassen|verlaeuft|fuehrt|zeigt|ist|durchquert|passiert)';
export function parseWaterRelation(input: string): WaterRelation | null {
  const net = /\b(?:netto\w*|insgesamt|ueberwiegend|bilanz|summe)\b/u.test(input);
  const neg = input.match(/\b(?:nicht|kein|keine|keinen)\b/gu) ?? [];
  if (neg.length > 1) return null;
  let text = modifiers(input), noun = '', path = '';
  // A local predicate negation only; never erase a negated subject or cause.
  text = text.replace(/ (?:nicht|kein|keine|keinen) /u, ' ');
  const normal = text.match(new RegExp(`^(${subject}) (?:${motionVerb} )?(.+)$`, 'u'));
  const inverted = text.match(new RegExp(`^(?:es )?(${motionVerb}) (${subject})(?: (.+))?$`, 'u'));
  const fronted = text.match(new RegExp(`^(.+?) (${motionVerb}) (${subject})(?: (.+))?$`, 'u'));
  if (normal) { noun = normal[1]!; path = normal[2]!; }
  else if (inverted) { noun = inverted[2]!; path = inverted[3] ?? ''; }
  else if (fronted) { noun = fronted[3]!; path = `${fronted[1]} ${fronted[4] ?? ''}`.trim(); }
  else path = text; // Explicit short path uses the field's water subject.
  path = path.replace(/ gerichtet$/u, '');
  const leaving = input.match(/\b(?:verlaesst|verlassen)\b/u);
  if (leaving && noun) path = `aus ${path}`;
  const cell = text.match(/^(?:die )?(?:zelle|pflanzenzelle) (verliert|gibt|nimmt|gewinnt) wasser(?: (.+))?$/u);
  if (cell) { noun = 'wasser'; path = cell[1] === 'nimmt' || cell[1] === 'gewinnt' ? 'nach innen' : 'nach aussen';
    const rest = cell[2] ?? ''; if (!['', 'ab', 'auf', 'nach aussen'].includes(rest) && !/^(?:an|aus) (?:ihre |der |die )?(?:umgebung|aussenloesung)(?: ab)?$/u.test(rest)) return null;
  }
  const route = waterPath(path); if (!route || neg.length && !/\b(?:nicht|kein|keine|keinen)\b/u.test(input.replace(new RegExp(`^${subject} `, 'u'), ''))) return null;
  const scale = /^(?:ein |einzelne |manche )/u.test(noun) ? 'individual' : /^alle /u.test(noun) ? 'all' : /^(?:wasserteilchen|wassermolekuele)$/u.test(noun) && !net ? 'individual' : 'balance';
  if (scale === 'individual' && net) return null;
  return { ...route, quantity: 'transport_amount', substance: /saccharose|zucker/u.test(noun) ? 'sucrose' : 'water', phase: 'given_early_state', scale, net, negative: neg.length === 1 };
}
export function relationAtom(r: WaterRelation): SemanticAtom {
  return { tag: r.substance !== 'water' ? 'substance' : r.scale === 'all' ? 'all_one_way' : r.membrane === 'tonoplast' ? r.source === 'vacuole' ? 'inner' : 'inner_reverse' : r.target === 'external' ? 'out' : 'in', negative: r.negative, individual: r.scale === 'individual', net: r.net };
}
/** A balance requires opposite flows of the same substance across the SAME
 * membrane at the SAME phase; different compartments are not scalar opposites. */
export function compareWaterRelations(a: WaterRelation, b: WaterRelation): SemanticAtom | null {
  if (a.quantity !== b.quantity || a.substance !== b.substance || a.substance !== 'water' || a.membrane !== b.membrane || a.membrane !== 'cell_membrane' || a.phase !== b.phase || a.source !== b.target || a.target !== b.source || a.scale !== 'balance' || b.scale !== 'balance' || a.negative || b.negative) return null;
  return { ...relationAtom(a), net: true };
}

/** Quantity slot and a complete predicate. Discourse words are consumed only
 * inside a recognized clause, never by discarding an unknown sentence tail. */
export function parseVolumeAtom(input: string): SemanticAtom | null {
  const negs = input.match(/\b(?:nicht|kein|keine|keinen)\b/gu) ?? [];
  if (negs.length > 1) return null;
  let text = modifiers(input).replace(/\b(?:also|dabei)\b/gu, '').replace(/\s+/gu, ' ').trim();
  const q = '(?:(?:das|der|die|ihr|ihren) )?(?:volumen (?:der |des |im inneren der |innerhalb der |in der )?(?:zentralvakuole|vakuole|vakuolenraums)|(?:vakuolenvolumen|vakuole|zentralvakuole|vakuolenraum|vakuoleninhalt|zellwand|protoplast|volumen)|(?:groesse|rauminhalt) der (?:zentralvakuole|vakuole|zellwand))';
  // Harmless aspect/size qualifiers have a bounded, explicit interpretation.
  text = text.replace(/ (?:an volumen|im volumen|hinsichtlich ihres volumens)/u, '').replace(/ (?:durch|wegen) (?:den |der )?wasserverlust/u, '');
  const normal = text.match(new RegExp(`^(${q}) (.+)$`, 'u'));
  const inverse = text.match(new RegExp(`^(?:es )?(verkleinert sich|verringert sich|schrumpft|sinkt|waechst|steigt|vermindert sich|reduziert sich) (${q})$`, 'u'));
  const adjective = text.match(new RegExp(`^(kleiner|geringer|groesser) (wird|ist) (${q})$`, 'u'));
  let object: string, predicate: string;
  if (normal) { object = normal[1]!; predicate = normal[2]!; }
  else if (inverse) { object = inverse[2]!; predicate = inverse[1]!; }
  else if (adjective) { object = adjective[3]!; predicate = `${adjective[2]} ${adjective[1]}`; }
  else return null;
  if (/^(?:nicht|kein|keine|keinen) /u.test(text)) return null;
  predicate = predicate.replace(/\b(?:nicht|kein|keine|keinen)\b/gu, '').replace(/\s+/gu, ' ').trim();
  const down = ['nimmt ab', 'sinkt', 'schrumpft', 'schrumpft zusammen', 'verkleinert sich', 'vermindert sich', 'verringert sich', 'reduziert sich', 'geht zurueck', 'faellt ab', 'wird reduziert', 'wird kleiner', 'ist kleiner', 'wird geringer', 'verliert volumen', 'verliert an volumen', 'nimmt weniger raum ein', 'verringert ihren rauminhalt', 'verkleinert ihr volumen', 'zeigt eine volumenverminderung', 'buesst volumen ein', 'beansprucht ein kleineres volumen'];
  const up = ['nimmt zu', 'steigt', 'waechst', 'wird groesser', 'ist groesser', 'wird voluminoeser', 'gewinnt an volumen'];
  const same = ['bleibt gleich', 'bleibt konstant', 'bleibt unveraendert', 'bleibt in ihrem volumen unveraendert'];
  let tag = down.includes(predicate) ? 'down' : up.includes(predicate) ? 'up' : same.includes(predicate) ? 'same' : ['aendert sich', 'veraendert sich'].includes(predicate) ? 'change' : null;
  if (!tag) return null;
  if (object.includes('zellwand')) tag = tag === 'down' ? 'wall_down' : tag === 'same' ? 'wall_same' : null;
  if (object.includes('protoplast')) tag = tag === 'down' ? 'protoplast_down' : null;
  return tag ? { tag, negative: negs.length === 1, individual: false, net: false } : null;
}
