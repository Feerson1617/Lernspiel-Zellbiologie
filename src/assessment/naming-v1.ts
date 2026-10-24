import type { Status } from '../domain/contracts.ts';
import type { TaskContext } from '../domain/task-context.ts';
import { createContextBinding } from '../domain/task-context.ts';
import { NAMING_CONTRACT, namingSnapshot, namingVersions, parseNamingSubmission, createNamingSupport } from '../domain/naming-contract.ts';
import type { NamingOutcome, NamingSubmission, NamingSupport, NamingTaskId, UnassessedNamingText } from '../domain/naming-contract.ts';
import { supportsOsmosisContext } from './osmosis-context.ts';
import { parseEvaluationResult } from './result.ts';
import { editDistance, isLimitedTypo, isSupportedText, normalizeWord } from './text.ts';
import { NAMING_CONCEPTS, NAMING_SPELLINGS } from './naming-profiles.ts';
import { namingFeedback } from './naming-feedback.ts';

interface Decision { readonly status: Status; readonly reason: string }
interface Atom extends Decision { readonly concept: string }
const unknown: Decision = Object.freeze({ status: 'clarify', reason: 'scope' });
const article = /^(?:der|die|das|den|dem|des|ein|eine|einen|einem|einer|eines) /u;
const hedge = '(?:vielleicht|vermutlich|wahrscheinlich|wohl|eventuell)';
const pairs: Readonly<Record<string, string>> = Object.freeze({ '"': '"', "'": "'", '„': '“', '«': '»', '(': ')' });
function unquote(text: string, budget: number): Readonly<{ text: string; used: number }> {
  let used = 0;
  for (let depth = 0; depth < budget; depth++) {
    if (pairs[text[0] ?? ''] !== text.at(-1)) break;
    text = text.slice(1, -1).trim(); used++;
  }
  return { text, used };
}
function atom(text: string, taskId: NamingTaskId, wrapperBudget: number): Atom | null {
  const key = unquote(text.trim().replace(article, ''), wrapperBudget).text;
  const concepts = NAMING_CONCEPTS[taskId];
  // Exact accepted AND incorrect concepts always precede spelling correction.
  for (const c of concepts) if (c.names.some(n => normalizeWord(n) === key)) return { concept: c.id, status: c.status, reason: c.id === 'target' && /[ -]/u.test(key) ? 'spelling' : c.id };
  if (NAMING_SPELLINGS[taskId].some(n => normalizeWord(n) === key)) return { concept: 'target', status: 'correct', reason: 'spelling' };
  if (taskId === 'Z1.02' && !key.includes(' ')) {
    const targets = ['tonoplast', 'vakuolenmembran'];
    if (targets.some(t => isLimitedTypo(key, t) && concepts.filter(c => c.id !== 'target').every(c => c.names.every(n => editDistance(key, normalizeWord(n)) >= 3)))) return { concept: 'target', status: 'correct', reason: 'spelling' };
  }
  return null;
}
/** Closed grammar, consumes the entire field. No substring extraction or sentence parsing. */
export function classifyNamingTerm(text: string, taskId: NamingTaskId): Decision {
  if (!text.trim()) return { status: 'empty', reason: 'empty' };
  if (text.length > 4096 || !isSupportedText(text)) return { status: 'technical', reason: 'technical' };
  let key = normalizeWord(text).trim().replace(/\s+/gu, ' ');
  const end = key.match(/[.!?;:,]+$/u)?.[0] ?? '';
  if (end.length > 3) return unknown;
  key = key.slice(0, key.length - end.length).trim();
  key = key.replace(/, danke$/u, '').trim();
  const outer = unquote(key, 2);
  key = outer.text;
  // Exactly one outer confidence marker, never multiple hidden reductions.
  const front = new RegExp(`^${hedge}(?:,)? `, 'u');
  const back = new RegExp(`(?:,)? ${hedge}$`, 'u');
  if (front.test(key)) key = key.replace(front, '');
  else if (back.test(key)) key = key.replace(back, '');
  const inner = unquote(key, 2 - outer.used);
  key = inner.text;
  const budget = 2 - outer.used - inner.used;
  const direct = atom(key, taskId, budget);
  if (direct) return direct;
  const correction = key.match(/^(?:nicht|kein|keine|keinen) (.+?),? sondern (.+)$/u);
  const instead = key.match(/^(.+) statt (.+)$/u);
  if (correction || instead) {
    const excluded = atom(correction ? correction[1]! : instead![2]!, taskId, budget);
    const chosen = atom(correction ? correction[2]! : instead![1]!, taskId, budget);
    if (!excluded || !chosen) return unknown;
    if (excluded.concept === chosen.concept) return { status: 'incorrect', reason: 'contradiction' };
    if (excluded.concept === 'target') return { status: 'incorrect', reason: 'negated' };
    return chosen;
  }
  const negation = key.match(/^(?:nicht|kein|keine|keinen) (.+)$/u);
  if (negation) {
    const excluded = atom(negation[1]!, taskId, budget);
    return excluded?.concept === 'target' ? { status: 'incorrect', reason: 'negated' } : unknown;
  }
  const alternatives = key.split(/ (?:oder|und) |\s*\/\s*/u);
  if (alternatives.length === 2) {
    const left = atom(alternatives[0]!, taskId, budget), right = atom(alternatives[1]!, taskId, budget);
    if (left && right) return left.concept === right.concept ? left : { status: 'clarify', reason: 'alternatives' };
  }
  return unknown;
}
export function supportsNamingContext(context: TaskContext): boolean {
  if (context.taskId !== 'Z1.02' && context.taskId !== 'M6.02') return false;
  const versions = namingVersions(context.taskId, context.modelVersion);
  if (!Object.entries(versions).every(([k, v]) => context[k as keyof typeof versions] === v)) return false;
  if (context.taskId === 'M6.02') return supportsOsmosisContext(context);
  return Object.keys(context.modelState).length === 0 && Object.keys(context.material).length === 2
    && context.material['highlightedStructureId'] === 'tonoplast'
    && ['plant_leaf', 'onion_epidermis'].includes(context.material['cellProfile'] as string);
}
/** Pure, immutable scoped evaluation. Authority to book progress lives in NamingSession. */
export function evaluateNaming(input: unknown, provenance: NamingSupport): NamingOutcome {
  const submission: NamingSubmission = parseNamingSubmission(input);
  const support = createNamingSupport(provenance);
  const { context, target, termText, additionalStatements } = submission;
  const valid = supportsNamingContext(context) && additionalStatements.every(s => s.length <= 4096 && isSupportedText(s));
  const decision = valid ? classifyNamingTerm(termText, target.taskId) : { status: 'technical' as const, reason: 'technical' };
  const criterionId = `${target.taskId}.C01` as 'Z1.02.C01' | 'M6.02.C01';
  const termResult = parseEvaluationResult({ ...createContextBinding(context), status: decision.status,
    criteria: [{ id: criterionId, status: decision.status, reasonCode: decision.reason,
      evidence: termText.length ? [{ kind: 'input_span', value: termText, start: 0, end: termText.length }] : [] }],
    unassessedRelevantText: decision.status === 'clarify', assistance: support.assistance, feedbackCode: `naming-v1.${decision.reason}`,
  });
  const notAssessed: UnassessedNamingText[] = additionalStatements.flatMap((value, index) => value.trim() ? [{ field: 'additionalStatements' as const, index, status: 'not_assessed' as const, value, start: 0, end: value.length }] : []);
  if (decision.status === 'clarify') notAssessed.unshift({ field: 'termText', index: null, status: 'not_assessed', value: termText, start: 0, end: termText.length });
  const unassessedRelevantText = notAssessed.length > 0;
  const overallStatus: Status = decision.status === 'technical' || support.history === 'history_unverified' ? 'technical'
    : decision.status === 'incorrect' ? 'incorrect' : unassessedRelevantText ? 'clarify'
      : target.taskId === 'M6.02' && decision.status === 'correct' ? 'partial' : decision.status;
  return namingSnapshot({ contractVersion: NAMING_CONTRACT, submission, termResult,
    assessedScope: { fieldId: target.fieldId, criterionId }, notAssessed,
    pendingCriteria: target.taskId === 'M6.02' ? ['M6.02.C02', 'M6.02.C03'] : [],
    overallStatus, unassessedRelevantText, reasonCode: decision.reason,
    feedback: namingFeedback(target.taskId, decision.reason), support,
  });
}
