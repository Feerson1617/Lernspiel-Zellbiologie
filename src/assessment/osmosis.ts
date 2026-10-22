import type { Status, VersionInfo } from '../domain/contracts.ts';
import { createBoundTermEvaluator } from './term-evaluator.ts';
import { supportsOsmosisContext } from './osmosis-context.ts';
import type { OsmosisFeedbackCode } from './osmosis-feedback.ts';
import { parseTermAnswer } from './term-grammar.ts';
import type { TermClause, TermGrammarProfile, TermMeaning, TermRef } from './term-grammar.ts';
import { tokenizeText } from './text.ts';

export const OSMOSIS_TASK_ID = 'M6.02';
export const OSMOSIS_FIELD_ID = 'process';
export const OSMOSIS_RUBRIC_ID = 'TERM_OSMOSIS';
export const OSMOSIS_CRITERION_ID = 'M6.02.C01';

const SUBJECTS = [
  ['der', 'vorgang'], ['dieser', 'vorgang'], ['der', 'beschriebene', 'vorgang'],
  ['der', 'gesuchte', 'vorgang'], ['der', 'wassertransport'], ['dieser', 'wassertransport'],
  ['der', 'wassertransportvorgang'], ['der', 'transportvorgang'], ['der', 'prozess'],
  ['dieser', 'prozess'], ['die', 'transportart'],
  ['der', 'transport'], ['die', 'gesuchte', 'transportart'],
];
/** Field-specific naming subjects; none of the membrane frames are inherited. */
const PROFILE: TermGrammarProfile = {
  frames: [
    ...SUBJECTS.flatMap((subject) => [['heisst'], ['ist'], ['nennt', 'man'], ['wird']].flatMap((verb) =>
      [[...subject, ...verb], [...subject, 'hier', ...verb]])),
    ['der', 'fachbegriff', 'ist'], ['der', 'gesuchte', 'begriff', 'ist'],
    ['die', 'bezeichnung', 'lautet'], ['die', 'bezeichnung', 'ist'], ['der', 'name', 'ist'],
    ['meine', 'antwort', 'ist'], ['meine', 'antwort', ':'], ['gemeint', 'ist'], ['gesucht', 'ist'],
    ['gesucht', 'wird'], ['ich', 'meine'], ['das', 'ist'], ['es', 'ist'], ['ist', 'es'],
    ['das', 'muesste'], ['es', 'muesste'], ['das', 'koennte'], ['es', 'koennte'],
    ['man', 'nennt', 'das'], ['man', 'nennt', 'diesen', 'vorgang'],
    ['dabei', 'handelt', 'es', 'sich', 'um'], ['hier', 'handelt', 'es', 'sich', 'um'],
    ['wir', 'sprechen', 'hier', 'von'],
    ['den', 'vorgang', 'nennt', 'man'], ['den', 'transport', 'nennt', 'man'],
  ], contextAdverbs: ['hier', 'dabei'],
};
const MEANINGS: readonly TermMeaning[] = [
  { id: 'osmosis', forms: [['osmose']], spellingVariants: ['osmosse', 'osmosee', 'ossmose', 'osmsoe'] },
  { id: 'diffusion', forms: [['diffusion'], ['diffusion', 'von', 'wasser'], ['diffusion', 'des', 'wassers']] },
  { id: 'movement', forms: [['wasserbewegung'], ['bewegung', 'von', 'wasser']] },
  { id: 'transport', forms: [['wassertransport'], ['transport', 'von', 'wasser']] },
  { id: 'passive', forms: [['passiver', 'transport'], ['passiven', 'transport'], ['passiven', 'transports'], ['passiver', 'wassertransport'], ['passive', 'wasserbewegung']] },
  { id: 'active', forms: [['aktiver', 'transport'], ['aktiven', 'transport'], ['aktiven', 'transports'], ['aktiver', 'wassertransport'], ['aktive', 'pumpe'], ['atp', '-', 'pumpe'], ['atp', 'pumpe'], ['atppumpe']] },
  { id: 'endocytosis', forms: [['endocytose'], ['endozytose']] },
  { id: 'exocytosis', forms: [['exocytose'], ['exozytose']] },
  { id: 'plasmolysis', forms: [['plasmolyse']] },
];
const WRONG: Readonly<Record<string, OsmosisFeedbackCode>> = Object.freeze({
  active: 'OSMOSIS_WRONG_ACTIVE', endocytosis: 'OSMOSIS_WRONG_ENDOCYTOSIS',
  exocytosis: 'OSMOSIS_WRONG_EXOCYTOSIS', plasmolysis: 'OSMOSIS_WRONG_PLASMOLYSIS',
});
const PROPERTIES = new Set(['diffusion', 'movement', 'transport', 'passive']);
interface Decision { readonly status: Status; readonly code: OsmosisFeedbackCode; readonly unassessed: boolean }
const decision = (status: Status, code: OsmosisFeedbackCode, unassessed = false): Decision => ({ status, code, unassessed });
const unknown = () => decision('clarify', 'OSMOSIS_UNASSESSED', true);
const correct = (typo = false) => decision('correct', typo ? 'OSMOSIS_TYPO' : 'OSMOSIS_CORRECT');
const contradiction = () => decision('incorrect', 'OSMOSIS_CONTRADICTION');
function name(term: TermRef): Decision {
  if (term.id === 'osmosis') return correct(term.typo);
  if (term.id === 'diffusion') return decision('partial', 'OSMOSIS_PARTIAL_DIFFUSION');
  if (term.id === 'movement' || term.id === 'transport') return decision('partial', 'OSMOSIS_PARTIAL_WATER');
  return WRONG[term.id] ? decision('incorrect', WRONG[term.id]!) : decision('clarify', 'OSMOSIS_NO_NAME');
}
function assess(clause: TermClause): Decision {
  if (clause.kind === 'name') {
    const first = clause.terms[0]!;
    const ids = new Set(clause.terms.map(({ id }) => id));
    if (clause.negated) return first.id === 'osmosis' ? decision('incorrect', 'OSMOSIS_NEGATED') : decision('clarify', 'OSMOSIS_NO_NAME');
    if (ids.size > 1) {
      if (clause.connector === 'explanation' && clause.terms.length === 2 && ids.has('osmosis') && [...ids].every((id) => id === 'osmosis' || PROPERTIES.has(id))) return correct();
      return decision('clarify', 'OSMOSIS_COMPETING');
    }
    return name(clause.terms.find(({ typo }) => typo) ?? first);
  }
  if (clause.kind === 'contrast') {
    if (clause.excluded.id === clause.chosen.id) return contradiction();
    if (clause.excluded.id === 'osmosis') return decision('incorrect', 'OSMOSIS_NEGATED');
    return name(clause.chosen);
  }
  if (clause.kind === 'conjoined_negation') {
    if (clause.positive.id === clause.negative.id) return contradiction();
    if (clause.negative.id === 'osmosis') return decision('incorrect', 'OSMOSIS_NEGATED');
    return WRONG[clause.negative.id] ? name(clause.positive) : unknown();
  }
  if (clause.kind !== 'identity' && clause.kind !== 'synonymy') return unknown();
  if (clause.subject.id !== 'osmosis') {
    return clause.object.id === 'osmosis' ? (clause.negated ? decision('clarify', 'OSMOSIS_NO_NAME') : unknown()) : unknown();
  }
  if (clause.object.id === 'osmosis') return clause.negated ? contradiction() : correct(clause.subject.typo || clause.object.typo);
  if (WRONG[clause.object.id]) return clause.negated ? correct() : decision('incorrect', WRONG[clause.object.id]!);
  if (PROPERTIES.has(clause.object.id) && clause.relation === 'property') return clause.negated ? decision('incorrect', 'OSMOSIS_FALSE_PROPERTY') : correct();
  return unknown();
}
function combine(values: readonly Decision[]): Decision {
  const wrong = values.find(({ status }) => status === 'incorrect');
  if (wrong) {
    const contradicted = ['OSMOSIS_NEGATED', 'OSMOSIS_FALSE_PROPERTY'].includes(wrong.code) && values.some(({ status }) => status === 'correct');
    return decision('incorrect', contradicted ? 'OSMOSIS_CONTRADICTION' : wrong.code, values.some(({ unassessed }) => unassessed));
  }
  const unclear = values.find(({ status }) => status === 'clarify');
  if (unclear) return decision('clarify', unclear.code, values.some(({ unassessed }) => unassessed));
  if (values.some(({ status }) => status === 'correct')) return correct(values.some(({ code }) => code === 'OSMOSIS_TYPO'));
  return values[0] ?? unknown();
}

export function createOsmosisEvaluator(versions: VersionInfo) {
  const evaluator = createBoundTermEvaluator(versions, {
    taskId: OSMOSIS_TASK_ID, fieldId: OSMOSIS_FIELD_ID, criterionId: OSMOSIS_CRITERION_ID,
    supportsContext: supportsOsmosisContext,
    codes: { wrongField: 'OSMOSIS_WRONG_FIELD', version: 'OSMOSIS_VERSION', context: 'OSMOSIS_CONTEXT', input: 'OSMOSIS_TECHNICAL_INPUT', tooLong: 'OSMOSIS_TOO_LONG', empty: 'OSMOSIS_EMPTY' },
    assessText(text) {
      const parsed = parseTermAnswer(tokenizeText(text), MEANINGS, PROFILE);
      if (!parsed.complete) return { ...unknown(), spans: [{ start: 0, end: text.length }] };
      if (parsed.clauses.every((clause) => clause.kind === 'name' && !clause.negated)
        && parsed.clauses.length > 1 && new Set(parsed.clauses.flatMap((clause) => clause.kind === 'name' ? clause.terms.map(({ id }) => id) : [])).size > 1) {
        return { ...decision('clarify', 'OSMOSIS_COMPETING'), spans: parsed.clauses };
      }
      return { ...combine(parsed.clauses.map(assess)), spans: parsed.clauses };
    },
  });
  return Object.freeze({ taskId: OSMOSIS_TASK_ID, fieldId: OSMOSIS_FIELD_ID, rubricId: OSMOSIS_RUBRIC_ID, ...evaluator });
}
