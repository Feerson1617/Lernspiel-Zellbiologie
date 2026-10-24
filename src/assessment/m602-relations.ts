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

function atom(input: string, field: RelationField): Atom | null {
  let text = input.trim().replace(/^(?:hier|jetzt|im angezeigten zustand|in dieser phase|in der fruehen wasserverlustphase) /u, '');
  const net = /\b(?:netto|insgesamt)\b/u.test(text);
  text = text.replace(/^(?:netto|insgesamt) /u, '');
  const result = (tag: string, negative = false, individual = false): Atom => ({ tag, negative, individual, net });
  if (field === 'direction' && ['kein wassertransport', 'kein nettofluss', 'wasser steht still', 'kein wasserfluss'].includes(text)) return result('still');
  const negations = text.match(/\b(?:nicht|kein|keine|keinen)\b/gu) ?? [];
  if (negations.length > 1) return null;
  const negative = negations.length === 1;
  text = text.replace(/\b(?:nicht|kein|keine|keinen)\b/gu, '').replace(/\s+/gu, ' ').trim();
  if (field === 'volume') {
    const subject = text.match(/^(?:(?:die|das|der) )?(vakuolenvolumen|volumen der vakuole|vakuole|volumen|zellwand|protoplast) (.+)$/u);
    const object = subject?.[1] ?? 'vakuole', predicate = subject?.[2] ?? text;
    let tag = down.includes(predicate) ? 'down' : up.includes(predicate) ? 'up'
      : ['bleibt gleich', 'gleich', 'veraendert sich nicht'].includes(predicate) ? 'same'
        : ['aendert sich', 'veraendert sich'].includes(predicate) ? 'change' : predicate === 'wasserverlust' ? 'loss' : null;
    if (object === 'zellwand') tag = tag === 'down' ? 'wall_down' : tag === 'same' ? 'wall_same' : null;
    if (object === 'protoplast') tag = tag === 'down' ? 'protoplast_down' : null;
    return tag ? result(tag, negative) : null;
  }
  if (['in beide richtungen', 'wasser tritt ein und aus', 'wasser bewegt sich in beide richtungen', 'wasser tritt in beide richtungen ueber'].includes(text)) return result('both', negative, true);
  if (['wasser bewegt sich', 'osmose'].includes(text)) return result('movement', negative, true);
  if (/^wasser tritt aus der vakuole in (?:das|den) cytosol$/u.test(text)) return result('inner', negative);
  const comparison = text.match(/^(?:es treten )?mehr (?:wasser|wassermolekuele)(?: tritt| treten)? (aus|ein) als (aus|ein)$/u);
  // A quantified excess already states a net balance, even without "netto".
  if (comparison) return comparison[1] === comparison[2] ? null : { ...result(comparison[1] === 'aus' ? 'out' : 'in', negative), net: true };
  const cell = text.match(/^(?:die )?zelle (verliert wasser|gibt wasser ab|nimmt wasser auf)$/u);
  if (cell) return result(cell[1] === 'nimmt wasser auf' ? 'in' : 'out', negative);
  const individual = /^(?:ein wassermolekuel|einzelne wassermolekuele|manche wassermolekuele) /u.test(text);
  const all = /^alle wassermolekuele /u.test(text);
  const substance = /^(?:die )?saccharose /u.test(text);
  text = text.replace(/^(fliesst|stroemt|tritt|geht|diffundiert) wasser /u, 'wasser $1 ');
  text = text.replace(/^(?:ein wassermolekuel|einzelne wassermolekuele|manche wassermolekuele|alle wassermolekuele|(?:das )?wasser|(?:die )?saccharose) /u, '');
  text = text.replace(/^(?:bewegt sich|bewegen sich|fliessen|fliesst|stroemt|stroemen|geht|tritt|treten|wandert|gelangt|diffundiert) /u, '');
  text = text.replace(/^(?:netto|insgesamt) (?:aber )?/u, '').replace(/^aber /u, '');
  if (text === 'es aus') text = 'hinaus';
  if (text === 'es ein') text = 'hinein';
  if (/^aus der zelle aus$/u.test(text)) text = 'aus der zelle';
  if (/^in die zelle ein$/u.test(text)) text = 'in die zelle';
  if (text === 'in beide richtungen ueber') text = 'in beide richtungen';
  const tag = out.includes(text) ? 'out' : inward.includes(text) ? 'in' : text === 'in beide richtungen' ? 'both' : null;
  if (!tag || (individual && net)) return null;
  return result(substance ? 'substance' : all && tag !== 'both' ? 'all_one_way' : tag, negative, individual || tag === 'both');
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
    const withdrawn = value.match(/^ich dachte (?:zunaechst|erst) (.+?)[;,] jetzt meine ich (.+)$/u);
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
    const atoms = parts.map(p => atom(p, field));
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
