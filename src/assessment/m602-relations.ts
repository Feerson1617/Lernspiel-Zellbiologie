import type { Status } from '../domain/contracts.ts';
import { isSupportedText, normalizeWord } from './text.ts';

export type RelationField = 'direction' | 'volume';
export interface RelationDecision { readonly status: Status; readonly reason: string }
interface Atom { readonly tag: string; readonly negative: boolean; readonly individual: boolean; readonly net: boolean }
const unclear: RelationDecision = Object.freeze({ status: 'clarify', reason: 'scope' });
const out = ['nach aussen', 'hinaus', 'raus', 'aus der zelle', 'in den aussenraum', 'in die aussenloesung', 'vom cytosol in die umgebung', 'vom cytosol in den aussenraum', 'aus dem cytosol in den aussenraum'];
const inward = ['nach innen', 'hinein', 'rein', 'in die zelle', 'vom aussenraum in das cytosol'];
const down = ['kleiner', 'weniger', 'nimmt ab', 'schrumpft', 'verkleinert sich', 'wird kleiner', 'wird geringer', 'verringert sich', 'volumenabnahme', 'verliert volumen'];
const up = ['groesser', 'mehr', 'nimmt zu', 'waechst', 'wird groesser', 'vergroessert sich'];

// Semantic slots: a subject supplies substance/quantity, a path supplies both
// compartments, a predicate supplies change. No complete-answer lookup table.
const compartments: Readonly<Record<string, string>> = {
  innen: 'cell', zelle: 'cell', zellinneren: 'cell', zellinnere: 'cell', cytosol: 'cell',
  aussen: 'external', aussenraum: 'external', aussenloesung: 'external', umgebung: 'external',
  vakuole: 'vacuole', vakuolenraum: 'vacuole',
};
function room(value: string): string | undefined {
  return compartments[value.replace(/^(?:der|die|das|den|dem) /u, '')];
}
function pathTag(input: string): string | null {
  // Dative location (in der Zelle) is not an accusative destination.
  if (/\bin (?:der|dem) /u.test(input)) return null;
  if (out.includes(input) || ['auswaerts', 'nach draussen'].includes(input)) return 'out';
  if (inward.includes(input) || input === 'einwaerts') return 'in';
  const arrow = input.split(/\s*→\s*/u);
  let from: string | undefined, to: string | undefined;
  if (arrow.length === 2) { from = room(arrow[0]!); to = room(arrow[1]!); }
  else {
    const route = input.replace(/^vom /u, 'von dem ').replace(/ ins /u, ' in das ').replace(/ (?:heraus|aus)$/u, '');
    const pair = route.match(/^(?:von|aus) (.+?) (?:nach|in) (.+)$/u);
    if (pair) { from = room(pair[1]!); to = room(pair[2]!); }
    else {
      const source = route.match(/^aus (.+)$/u), target = route.match(/^(?:in|nach) (.+)$/u);
      if (source) { from = room(source[1]!); to = from === 'cell' ? 'external' : undefined; }
      if (target) { to = room(target[1]!); from = to === 'external' ? 'cell' : to === 'cell' ? 'external' : undefined; }
    }
  }
  if (from === 'cell' && to === 'external') return 'out';
  if (from === 'external' && to === 'cell') return 'in';
  if (from === 'vacuole' && to === 'cell') return 'inner';
  return null;
}
function atom(input: string, field: RelationField): Atom | null {
  let text = input.trim().replace(/^(?:hier|jetzt|im angezeigten zustand|in dieser phase|in dieser fruehen phase|in der fruehen wasserverlustphase) /u, '');
  let net = /\b(?:netto|insgesamt|nettostrom|nettowasserstrom|nettowassertransport|nettotransport)\b/u.test(text);
  const negativeTokens = text.match(/\b(?:nicht|kein|keine|keinen)\b/gu) ?? [];
  if (negativeTokens.length > 1) return null;
  const negative = negativeTokens.length === 1;
  const result = (tag: string, individual = false, neg = negative): Atom => ({ tag, negative: neg, individual, net });
  text = text.replace(/^(?:netto|insgesamt) /u, '');
  if (field === 'direction' && /^(?:kein (?:wassertransport|wasserfluss|nettofluss|nettostrom)|wasser steht still|es gibt keine wasserbewegung|es fliesst netto kein wasser)$/u.test(text)) return result('still', false, false);
  text = text.replace(/\b(?:nicht|kein|keine|keinen)\b/gu, '').replace(/\s+/gu, ' ').trim();
  if (field === 'volume') {
    const unchanged = /^(?:die vakuole veraendert ihr volumen|(?:das )?(?:vakuolenvolumen|volumen) veraendert sich)$/u.test(text) && negative;
    if (unchanged) return result('same', false, false);
    // Only the explicitly modelled water-loss cause may qualify the change.
    text = text.replace(/(?:durch|wegen|aufgrund|infolge) (?:den |der )?(?:wasserverlust|wasserabgabe) /gu, '').replace(/ (?:durch|wegen|aufgrund|infolge) (?:den |der )?(?:wasserverlust|wasserabgabe)$/u, '');
    text = text.replace(/^(nimmt|wird|verringert sich|vermindert sich|reduziert sich) (.+?) (ab|kleiner)$/u, '$2 $1 $3');
    const cause = text.match(/^(?:der )?(?:wasserverlust|wasserabgabe) (verkleinert|fuehrt zu einem kleineren) (?:die |einem )?(vakuole|vakuolenvolumen)$/u);
    if (cause) return result('down');
    if (/^(?:wasser verlaesst die vakuole|die vakuole (?:verliert wasser|gibt wasser ab|verliert inhalt))$/u.test(text)) return result('loss');
    if (/^die zellmembran loest sich von der zellwand$/u.test(text)) return result('protoplast_down');
    if (/^es gibt eine volumenaenderung$/u.test(text)) return result('change');
    const nominal = text.match(/^(abnahme|verringerung|zunahme) des vakuolenvolumens$/u);
    if (nominal) return result(nominal[1] === 'zunahme' ? 'up' : 'down');
    text = text.replace(/^(schrumpft|sinkt|waechst|steigt|verringert sich|vermindert sich|reduziert sich) ((?:die|das) .+)$/u, '$2 $1');
    const subject = text.match(/^(?:(?:die|das|der|ihr) )?(volumen der (?:vakuole|zellwand)|vakuolenvolumen|vakuole|volumen|zellwand|protoplast|es) (.+)$/u);
    const object = subject?.[1] ?? 'vakuole', predicate = subject?.[2] ?? text;
    let tag = [...down, 'sinkt', 'reduziert sich', 'vermindert sich', 'nimmt an volumen ab', 'verliert an volumen', 'nimmt weniger raum ein', 'wird weniger voluminoes', 'abnehmend', 'abnahme'].includes(predicate) ? 'down'
      : [...up, 'steigt', 'erhoeht sich', 'schwillt an', 'zunahme'].includes(predicate) ? 'up'
      : ['bleibt gleich', 'gleich', 'bleibt konstant', 'bleibt unveraendert'].includes(predicate) ? 'same'
      : ['aendert sich', 'veraendert sich', 'ist betroffen'].includes(predicate) ? 'change' : predicate === 'wasserverlust' ? 'loss' : null;
    if (object.includes('zellwand')) tag = tag === 'down' ? 'wall_down' : tag === 'same' ? 'wall_same' : null;
    if (object === 'protoplast') tag = tag === 'down' ? 'protoplast_down' : null;
    return tag ? result(tag) : null;
  }
  text = text.replace(/^(?:netto|insgesamt) /u, '');
  if (['in beide richtungen', 'wasser tritt ein und aus', 'wasser bewegt sich in beide richtungen', 'wasser tritt in beide richtungen ueber', 'einzelne molekuele gehen hinein und hinaus'].includes(text)) return result('both', true);
  if (['wasser bewegt sich', 'osmose', 'wassertransport', 'wasser fliesst', 'wasser diffundiert', 'es gibt eine wasserbewegung', 'wasser kann die membran passieren', 'durch die zellmembran'].includes(text)) return result('movement');
  const comparison = text.match(/^(?:es treten )?mehr (?:wasser|wassermolekuele)(?: tritt| treten)? (aus|ein) als (aus|ein)$/u);
  if (comparison) { net = true; return comparison[1] === comparison[2] ? null : result(comparison[1] === 'aus' ? 'out' : 'in'); }
  const excess = text.match(/^(?:es (?:fliesst|bewegt sich) mehr wasser|mehr wasser (?:fliesst|geht)) (.+?) als (.+)$/u);
  if (excess) { const a = pathTag(excess[1]!.replace(/ heraus$/u, '')), b = pathTag(excess[2]!); net = true; return a && b && a !== b ? result(a) : null; }
  if (/^mehr wasser verlaesst die zelle als hineinstroemt$/u.test(text)) { net = true; return result('out'); }
  const cell = text.match(/^(?:die )?zelle (verliert wasser|gibt wasser ab|nimmt wasser auf)$/u);
  if (cell) return result(cell[1] === 'nimmt wasser auf' ? 'in' : 'out');
  // Inversion preserves the same subject slot; optional net markers do not erase rest.
  text = text.replace(/^(bewegt sich|fliesst|stroemt|tritt|geht|diffundiert|verlaesst|wandert) wasser /u, 'wasser $1 ');
  const subject = text.match(/^(ein wassermolekuel|einzelne wassermolekuele|manche wassermolekuele|einzelne molekuele|alle wassermolekuele|alle wasserteilchen|wasserteilchen|(?:das )?wasser|(?:die )?saccharose|zucker|(?:der )?(?:nettostrom|nettowasserstrom|nettowassertransport|nettotransport)) (.+)$/u);
  const noun = subject?.[1] ?? '', individual = /^(?:ein |einzelne |manche |wasserteilchen$)/u.test(noun), all = /^alle /u.test(noun);
  const substance = /saccharose|zucker/u.test(noun);
  text = subject?.[2] ?? text;
  if (/^verlaesst (?:netto )?die zelle$/u.test(text)) text = 'nach aussen';
  else text = text.replace(/^(?:bewegt sich|bewegen sich|fliessen|fliesst|stroemt|stroemen|geht|gehen|tritt|treten|wandert|wandern|gelangt|gelangen|diffundiert|ist) /u, '');
  text = text.replace(/^(?:netto|insgesamt) (?:aber )?/u, '').replace(/^(?:aber |auch |nur |ausschliesslich )/u, '').replace(/ gerichtet$/u, '');
  if (text === 'es aus') text = 'hinaus'; if (text === 'es ein') text = 'hinein';
  if (text === 'in die zelle ein') text = 'in die zelle';
  const tag = pathTag(text);
  if (!tag || (individual && net)) return null;
  return result(substance ? 'substance' : all ? 'all_one_way' : tag, individual);
}
function atomDecision(a: Atom): RelationDecision {
  if (a.negative) return ['out', 'down'].includes(a.tag) && !a.individual ? { status: 'incorrect', reason: 'negated' } : { status: 'clarify', reason: 'exclusion_only' };
  if (a.individual) return { status: 'partial', reason: 'individual' };
  if (a.tag === 'out' || a.tag === 'down') return { status: 'correct', reason: a.tag };
  if (['in', 'still', 'substance', 'all_one_way', 'up', 'same', 'wall_down'].includes(a.tag)) return { status: 'incorrect', reason: a.tag };
  return { status: 'partial', reason: a.tag };
}
/** Bounded T2 semantic composition. Each relation consumes its whole input;
 * no sentence corpus, fuzzy direction repair or generic keyword extraction. */
export function classifyM602Relation(original: string, field: RelationField): RelationDecision {
  if (original.length > 4096 || !isSupportedText(original)) return { status: 'technical', reason: 'technical' };
  if (!original.trim()) return { status: 'empty', reason: 'empty' };
  let text = normalizeWord(original).trim().replace(/\s+/gu, ' ');
  const punctuation = text.match(/[.!?;:,]+$/u)?.[0] ?? '';
  if (punctuation.length > 3) return unclear;
  text = text.slice(0, text.length - punctuation.length).trim().replace(/, danke$/u, '');
  text = text.replace(/^(?:vielleicht|vermutlich|wahrscheinlich|wohl|eventuell|ich denke|ich glaube|ich vermute),? /u, '');
  function parse(value: string, depth: number): RelationDecision {
    if (depth > 4) return unclear;
    value = value.trim();
    if (value.includes(' und ')) value = value.replace(/\bgleichzeitig\b/gu, '').replace(/\s+/gu, ' ').trim();
    const withdrawn = value.match(/^ich dachte (?:zunaechst|erst|zuerst) (.+?)[;,] jetzt meine ich (.+)$/u);
    if (withdrawn) return atom(withdrawn[1]!, field) ? parse(withdrawn[2]!, depth + 1) : unclear;
    if (/\b(?:erst|spaeter|dann|immer|dauerhaft|zunaechst|zukuenftig|austauschzeitpunkt|loesungswechsel)\b/u.test(value)) return { status: 'clarify', reason: 'time' };
    const correction = value.match(/^(?:nicht|kein|keine|keinen) (.+?),? sondern (.+)$/u);
    const instead = value.match(/^(.+) statt (.+)$/u);
    if (correction || instead) {
      const excluded = atom(correction ? correction[1]! : instead![2]!, field), chosen = atom(correction ? correction[2]! : instead![1]!, field);
      if (!excluded || !chosen || excluded.negative || chosen.negative) return unclear;
      return excluded.tag === chosen.tag ? { status: 'incorrect', reason: 'contradiction' } : atomDecision(chosen);
    }
    const cause = value.match(/^(.+?),? weil (.+)$/u);
    if (cause) {
      const left = atom(cause[1]!, field);
      if (field !== 'volume' || !left || !['sie wasser verliert', 'sie wasser abgibt', 'wasser austritt', 'wasser die vakuole verlaesst'].includes(cause[2]!)) return unclear;
      const d = atomDecision(left); return { ...d, reason: d.status === 'correct' ? 'loss_volume' : d.status === 'incorrect' ? 'balance' : d.reason };
    }
    const direct = atom(value, field);
    if (direct) return atomDecision(direct);
    const alternatives = value.split(/ oder /u);
    if (alternatives.length === 2) {
      const a = atom(alternatives[0]!, field), b = atom(alternatives[1]!, field);
      return a && b && a.tag === b.tag && a.negative === b.negative && a.individual === b.individual ? atomDecision(a) : { status: 'clarify', reason: 'alternatives' };
    }
    // Preserve an atomic exchange clause ("tritt ein und aus") when a
    // separate net clause follows. Split conjunctions only within one clause.
    let parts = value.split(/;\s*|\.\s+|,\s*(?:aber )?/u);
    if (parts.length === 1) parts = value.split(/ und gleichzeitig | und /u);
    if (parts.length < 2 || parts.length > 4) return unclear;
    const inheritedNet = /^(?:der )?netto(?:wasser)?strom /u.test(parts[0]!);
    const atoms = parts.map(p => atom(p.replace(/^dadurch /u, ''), field)).map(a => a && inheritedNet ? { ...a, net: true } : a);
    if (atoms.some(a => !a)) return unclear;
    const known = atoms as Atom[];
    if (known.some(a => known.some(b => a.tag === b.tag && a.negative !== b.negative && a.individual === b.individual))) return { status: 'incorrect', reason: 'contradiction' };
    if (field === 'direction') {
      const opposite = known.filter(a => !a.individual && !a.negative && ['out', 'in'].includes(a.tag));
      if (new Set(opposite.map(a => a.tag)).size > 1) return opposite.every(a => a.net) ? { status: 'incorrect', reason: 'contradiction' } : { status: 'partial', reason: 'individual' };
    } else if (known.some(a => a.tag === 'down' && !a.negative) && known.some(a => ['up', 'same'].includes(a.tag) && !a.negative)) return { status: 'incorrect', reason: 'contradiction' };
    const decisions = known.map(atomDecision);
    const wrong = decisions.find(d => d.status === 'incorrect'); if (wrong) return wrong;
    if (decisions.some(d => d.status === 'clarify')) return { status: 'clarify', reason: 'scope' };
    const correct = decisions.find(d => d.status === 'correct');
    return correct ?? decisions[0]!;
  }
  return parse(text, 0);
}
