import type { Status } from '../domain/contracts.ts';
import { isSupportedText, normalizeWord, MAX_ANSWER_LENGTH } from './text.ts';
import type { RelationField, RelationDecision } from './m602-relations.ts';

const unclear: RelationDecision = Object.freeze({ status: 'clarify', reason: 'scope' });
// Student text may name inherited properties; only declared entries carry meaning.
function ownValue<T>(lexicon: Readonly<Record<string, T>>, key: string): T | undefined {
  return Object.hasOwn(lexicon, key) ? lexicon[key] : undefined;
}
const dirs: Readonly<Record<string, string>> = Object.fromEntries([
  ...['nach aussen', 'hinaus', 'raus', 'auswaerts', 'nach draussen'].map(x => [x, 'out']),
  ...['nach innen', 'hinein', 'rein', 'einwaerts', 'nach drinnen'].map(x => [x, 'in']),
  ...['kein nettotransport', 'kein nettostrom', 'kein nettowassertransport', 'kein wassertransport'].map(x => [x, 'net_zero']),
  ...['in beide richtungen', 'hin und her', 'wechselseitig'].map(x => [x, 'individual']),
  ...['bewegt sich', 'wasserbewegung', 'osmose'].map(x => [x, 'movement']),
]);
const changes: Readonly<Record<string, string>> = Object.fromEntries([
  ...['kleiner', 'weniger', 'nimmt ab', 'wird kleiner', 'schrumpft', 'verkleinert sich', 'verringert sich', 'vermindert sich', 'reduziert sich', 'sinkt', 'wird geringer', 'nimmt an volumen ab', 'verliert volumen', 'verliert an volumen', 'volumenabnahme', 'abnahme', 'abnehmend', 'geht zurueck'].map(x => [x, 'down']),
  ...['groesser', 'mehr', 'nimmt zu', 'waechst', 'steigt', 'wird groesser', 'vergroessert sich', 'erhoeht sich', 'schwillt an', 'zunahme'].map(x => [x, 'up']),
  ...['gleich', 'konstant', 'unveraendert', 'bleibt gleich', 'bleibt konstant', 'bleibt unveraendert'].map(x => [x, 'same']),
  ...['veraendert sich', 'aendert sich', 'veraenderung', 'volumenaenderung'].map(x => [x, 'change']),
]);
type Room = 'cell' | 'external' | 'vacuole';
const rooms: Readonly<Record<string, Room>> = Object.fromEntries([
  ...['zelle', 'zellinneres', 'zellinneren', 'zellinnere', 'cytosol'].map(x => [x, 'cell' as const]),
  ...['aussenraum', 'aussenloesung', 'aussenmedium', 'umgebung', 'umgebende loesung', 'umgebenden loesung'].map(x => [x, 'external' as const]),
  ...['vakuole', 'vakuolenraum'].map(x => [x, 'vacuole' as const]),
]);
const room = (x: string): Room | undefined => ownValue(rooms, x.replace(/^(?:der|die|das|den|dem) /u, ''));
function path(value: string): string | null {
  const text = value.replace(/^vom /u, 'von dem ').replace(/^ins /u, 'in das ').replace(/ ins /u, ' in das ');
  let from: Room | undefined, to: Room | undefined;
  const particle = text.match(/ (heraus|hinaus)$/u)?.[1];
  const body = particle ? text.slice(0, -particle.length - 1) : text;
  const pair = body.match(/^(?:aus|von) (.+?) in (.+)$/u), arrow = body.split(/\s*→\s*/u);
  const source = body.match(/^aus (.+)$/u), target = body.match(/^in (?!der |dem )(.+)$/u);
  if (pair) { from = room(pair[1]!); to = room(pair[2]!); }
  else if (arrow.length === 2) { from = room(arrow[0]!); to = room(arrow[1]!); }
  else if (source) { from = room(source[1]!); if (from === 'cell') to = 'external'; }
  else if (target) { to = room(target[1]!); if (to === 'cell') from = 'external'; if (to === 'external') from = 'cell'; }
  if (particle && to !== 'external') return null;
  return from === 'cell' && to === 'external' ? 'out' : from === 'external' && to === 'cell' ? 'in' : from === 'vacuole' && to === 'cell' ? 'inner' : null;
}
interface Meaning { readonly tag: string; readonly negative: boolean }
// Negate only existing finite predicates at their verb/reflexive boundary.
// Full lookup retains every complement; unknown tails and double negation
// cannot be repaired by deleting a token from arbitrary input.
const finiteVerbs = new Set(['nimmt', 'wird', 'schrumpft', 'verkleinert', 'verringert', 'vermindert', 'reduziert', 'sinkt', 'verliert', 'geht', 'waechst', 'steigt', 'vergroessert', 'erhoeht', 'schwillt', 'bleibt', 'veraendert', 'aendert']);
const negatedChanges: Readonly<Record<string, Meaning>> = Object.fromEntries(Object.entries(changes)
  .filter(([predicate]) => finiteVerbs.has(predicate.split(' ')[0]!))
  .flatMap(([predicate, tag]) => {
    const words = predicate.split(' '); words.splice(words[1] === 'sich' ? 2 : 1, 0, 'nicht');
    const meaning = { tag: tag === 'change' ? 'same' : tag, negative: tag !== 'change' };
    return [[words.join(' '), meaning], ['nicht ' + predicate, meaning]];
  }));
function meaning(text: string, field: RelationField): Meaning | null {
  let body = text.replace(/^netto /u, ''), negative = false;
  const negated = field === 'volume' ? ownValue(negatedChanges, body) : undefined;
  if (negated) return negated;
  if (body.startsWith('nicht ')) { body = body.slice(6); negative = true; }
  const tag = field === 'volume' ? ownValue(changes, body) : ownValue(dirs, body) ?? path(body);
  return tag ? { tag, negative } : null;
}
function decision(m: Meaning): RelationDecision {
  const status: Status = m.negative ? ['out', 'down'].includes(m.tag) ? 'incorrect' : 'partial'
    : ['out', 'down'].includes(m.tag) ? 'correct' : ['in', 'net_zero', 'up', 'same'].includes(m.tag) ? 'incorrect' : 'partial';
  return { status, reason: m.negative ? status === 'incorrect' ? 'negated' : 'exclusion_only' : m.tag };
}
/** Complete expressions in the announced slots. No legacy sentence parser,
 * reference inference, fuzzy repair, hidden prefix or keyword extraction. */
export function classifyM602CuedRelation(original: string, field: RelationField): RelationDecision {
  if (typeof original !== 'string' || !['direction', 'volume'].includes(field) || original.length > MAX_ANSWER_LENGTH || !isSupportedText(original)) return { status: 'technical', reason: 'technical' };
  if (!original.trim()) return { status: 'empty', reason: 'empty' };
  let text = normalizeWord(original).trim().replace(/\s+/gu, ' ');
  text = text.replace(/[.!?]{1,3}$/u, '').trim();
  text = text.replace(/^(?:vielleicht|vermutlich|wahrscheinlich|wohl|eventuell|ich denke|ich glaube|ich vermute),? /u, '');
  const direct = meaning(text, field); if (direct) return decision(direct);
  const parts = text.split(/ (und|oder) /u);
  if (parts.length !== 3) return unclear;
  const a = meaning(parts[0]!, field), b = meaning(parts[2]!, field);
  if (!a || !b) return unclear;
  if (parts[1] === 'oder') return { status: 'clarify', reason: 'alternatives' };
  const opposing = a.tag === b.tag && a.negative !== b.negative || !a.negative && !b.negative &&
    (new Set([a.tag, b.tag]).has('out') && new Set([a.tag, b.tag]).has('in')
      || field === 'direction' && [a.tag, b.tag].includes('net_zero') && [a.tag, b.tag].some(t => ['out', 'in'].includes(t))
      || [a.tag, b.tag].includes('down') && [a.tag, b.tag].some(t => ['up', 'same'].includes(t)));
  if (opposing) return { status: 'incorrect', reason: 'contradiction' };
  return a.tag === b.tag && a.negative === b.negative ? decision(a) : unclear;
}
