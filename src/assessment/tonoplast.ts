import type { Assistance, Status, VersionInfo } from '../domain/contracts.ts';
import { ContextContractError, readDataRecord } from '../domain/context-data.ts';
import { createContextBinding, parseTaskContext } from '../domain/task-context.ts';
import type { TaskContext } from '../domain/task-context.ts';
import { AssessmentContractError, parseEvaluationResult, requireAssistance, requireAssessmentLabel } from './result.ts';
import type { EvaluationResult } from './result.ts';
import type { TonoplastFeedbackCode } from './feedback.ts';
import { parseTermAnswer } from './term-grammar.ts';
import type { TermClause, TermMeaning, TermRef } from './term-grammar.ts';
import { isSupportedText, MAX_ANSWER_LENGTH, tokenizeText } from './text.ts';

export const TONOPLAST_TASK_ID = 'Z1.02';
export const TONOPLAST_FIELD_ID = 'term';
export const TONOPLAST_RUBRIC_ID = 'TERM_TONOPLAST';
export const TONOPLAST_CRITERION_ID = 'Z1.02.C01';

/** Explicit controlled projection of the one authorized rubric, never fixture texts. */
const MEANINGS: readonly TermMeaning[] = [
  { id: 'tonoplast', forms: [['tonoplast'], ['tonoplasten'], ['vakuolenmembran']], spellingTargets: ['tonoplast', 'vakuolenmembran'] },
  { id: 'boundary', forms: [['membran'], ['huelle'], ['vakuolenhuelle'], ['innere', 'grenze']] },
  { id: 'cell_wall', forms: [['zellwand']] },
  { id: 'cell_membrane', forms: [['zellmembran']] },
  { id: 'vacuole', forms: [['vakuole']] },
  { id: 'nuclear_envelope', forms: [['kernhuelle']] },
  { id: 'nucleus', forms: [['zellkern']] },
];
const WRONG_CODES: Readonly<Record<string, TonoplastFeedbackCode>> = Object.freeze({
  cell_wall: 'TONOPLAST_WRONG_CELL_WALL', cell_membrane: 'TONOPLAST_WRONG_CELL_MEMBRANE',
  vacuole: 'TONOPLAST_WRONG_VACUOLE', nuclear_envelope: 'TONOPLAST_WRONG_NUCLEAR_ENVELOPE', nucleus: 'TONOPLAST_WRONG_NUCLEUS',
});
interface Decision { readonly status: Status; readonly code: TonoplastFeedbackCode; readonly unassessed: boolean }
const decision = (status: Status, code: TonoplastFeedbackCode, unassessed = false): Decision => ({ status, code, unassessed });
const unknown = () => decision('clarify', 'TONOPLAST_UNASSESSED', true);
const correct = () => decision('correct', 'TONOPLAST_CORRECT');
const contradiction = () => decision('incorrect', 'TONOPLAST_CONTRADICTION');
function name(ref: TermRef): Decision {
  if (ref.id === 'tonoplast') return decision('correct', ref.typo ? 'TONOPLAST_TYPO' : 'TONOPLAST_CORRECT');
  if (ref.id === 'boundary') return decision('partial', 'TONOPLAST_PARTIAL');
  const code = WRONG_CODES[ref.id];
  return code ? decision('incorrect', code) : unknown();
}

function assessClause(clause: TermClause): Decision {
  if (clause.kind === 'name') {
    const ids = new Set(clause.terms.map((term) => term.id));
    const first = clause.terms[0]!;
    if (clause.negated) {
      if (first.id === 'tonoplast') return decision('incorrect', 'TONOPLAST_NEGATED');
      return WRONG_CODES[first.id] ? decision('partial', 'TONOPLAST_EXCLUDED_OTHER') : unknown();
    }
    if (ids.size > 1) return decision('clarify', 'TONOPLAST_COMPETING');
    if (clause.terms.some((term) => term.typo) && first.id === 'tonoplast') return decision('correct', 'TONOPLAST_TYPO');
    return name(first);
  }
  if (clause.kind === 'contrast') {
    if (clause.excluded.id === clause.chosen.id) return contradiction();
    if (clause.excluded.id === 'tonoplast') {
      return clause.chosen.id === 'boundary' ? decision('incorrect', 'TONOPLAST_NEGATED') : name(clause.chosen);
    }
    return WRONG_CODES[clause.excluded.id] ? name(clause.chosen) : unknown();
  }
  if (clause.kind === 'conjoined_negation') {
    if (clause.positive.id === clause.negative.id) return contradiction();
    if (clause.negative.id === 'tonoplast') return decision('incorrect', 'TONOPLAST_NEGATED');
    return WRONG_CODES[clause.negative.id] ? name(clause.positive) : unknown();
  }
  if (clause.kind === 'encloses') {
    if (clause.subject.id !== 'tonoplast' || clause.object.id !== 'vacuole') return unknown();
    return clause.negated ? decision('incorrect', 'TONOPLAST_FALSE_ENCLOSURE') : name(clause.subject);
  }
  // Identity statements are interpreted only when they actually involve the target.
  const ids = [clause.subject.id, clause.object.id];
  if (!ids.includes('tonoplast')) return unknown();
  const sameBoundary = ids.every((id) => id === 'tonoplast' || id === 'boundary');
  // A generic membrane as subject is not an identification of THIS marked membrane.
  // In particular, never turn "eine Membran" into a universal identity assertion.
  if (clause.subject.id === 'boundary') return decision('clarify', 'TONOPLAST_NO_POSITIVE_NAME', true);
  if (sameBoundary) return clause.negated ? decision('incorrect', ids.every((id) => id === 'tonoplast') ? 'TONOPLAST_FALSE_SYNONYMY' : 'TONOPLAST_NOT_BOUNDARY') : correct();
  if (ids.some((id) => WRONG_CODES[id])) {
    if (!clause.negated) return decision('incorrect', 'TONOPLAST_FALSE_IDENTITY');
    return clause.subject.id === 'tonoplast' ? correct() : decision('clarify', 'TONOPLAST_NO_POSITIVE_NAME');
  }
  return unknown();
}

function combine(decisions: readonly Decision[]): Decision {
  const incorrect = decisions.find((value) => value.status === 'incorrect');
  if (incorrect) {
    const code = decisions.some((value) => value.status === 'correct') && ['TONOPLAST_NEGATED', 'TONOPLAST_FALSE_SYNONYMY', 'TONOPLAST_NOT_BOUNDARY', 'TONOPLAST_FALSE_ENCLOSURE'].includes(incorrect.code)
      ? 'TONOPLAST_CONTRADICTION' : incorrect.code;
    return decision('incorrect', code, decisions.some((value) => value.unassessed));
  }
  const unclear = decisions.find((value) => value.status === 'clarify');
  if (unclear) return decision('clarify', unclear.code, decisions.some((value) => value.unassessed));
  const positive = decisions.find((value) => value.status === 'correct');
  if (positive) return decision('correct', decisions.some((value) => value.code === 'TONOPLAST_TYPO') ? 'TONOPLAST_TYPO' : 'TONOPLAST_CORRECT');
  return decisions[0] ?? unknown();
}

/** Caller binds this implementation to explicit versions; none are silently invented. */
export function createTonoplastEvaluator(versions: VersionInfo) {
  const record = readDataRecord(versions);
  const fields = ['taskVersion', 'rubricVersion', 'contentVersion', 'modelVersion'] as const;
  if (Object.keys(record).length !== fields.length || !fields.every((key) => Object.hasOwn(record, key))) throw new AssessmentContractError();
  const expected: Record<string, string> = {};
  for (const field of fields) { requireAssessmentLabel(record[field]); expected[field] = record[field]; }
  const boundVersions = Object.freeze(expected) as unknown as VersionInfo;

  function evaluate(context: TaskContext, response: unknown, assistance: Assistance): EvaluationResult {
    // Invalid context/assistance cannot yield an honest bound result: explicit contract error.
    const active = parseTaskContext(context);
    requireAssistance(assistance);
    function result(value: Decision, text = '', spans: readonly Readonly<{ start: number; end: number }>[] = []): EvaluationResult {
      return parseEvaluationResult({ ...createContextBinding(active), status: value.status,
        criteria: [{ id: TONOPLAST_CRITERION_ID, status: value.status, reasonCode: value.code,
          evidence: spans.map(({ start, end }) => ({ kind: 'input_span', start, end, value: text.slice(start, end) })) }],
        unassessedRelevantText: value.unassessed, assistance, feedbackCode: value.code });
    }
    if (active.taskId !== TONOPLAST_TASK_ID) return result(decision('technical', 'TONOPLAST_WRONG_FIELD'));
    if (fields.some((field) => active[field] !== boundVersions[field])) return result(decision('technical', 'TONOPLAST_VERSION'));
    if (active.material['highlightedStructureId'] !== 'tonoplast') return result(decision('technical', 'TONOPLAST_CONTEXT'));
    let input: Readonly<Record<string, unknown>>;
    try { input = readDataRecord(response); }
    catch (error) {
      if (error instanceof ContextContractError) return result(decision('technical', 'TONOPLAST_TECHNICAL_INPUT', true));
      throw error;
    }
    if (Object.keys(input).length !== 2 || !Object.hasOwn(input, 'fieldId') || !Object.hasOwn(input, 'text')) return result(decision('technical', 'TONOPLAST_TECHNICAL_INPUT', true));
    if (input['fieldId'] !== TONOPLAST_FIELD_ID) return result(decision('technical', 'TONOPLAST_WRONG_FIELD'));
    const text = input['text'];
    if (typeof text !== 'string') return result(decision('technical', 'TONOPLAST_TECHNICAL_INPUT', true));
    if (text.length > MAX_ANSWER_LENGTH) return result(decision('technical', 'TONOPLAST_TOO_LONG', true));
    if (!isSupportedText(text)) return result(decision('technical', 'TONOPLAST_TECHNICAL_INPUT', true));
    if (text.trim() === '') return result(decision('empty', 'TONOPLAST_EMPTY'));
    const parsed = parseTermAnswer(tokenizeText(text), MEANINGS);
    if (!parsed.complete) return result(unknown(), text, [{ start: 0, end: text.length }]);
    if (parsed.clauses.every((clause) => clause.kind === 'name' && !clause.negated)) {
      const ids = new Set(parsed.clauses.flatMap((clause) => clause.kind === 'name' ? clause.terms.map((term) => term.id) : []).filter((id) => id !== 'boundary'));
      if (ids.size > 1) return result(decision('clarify', 'TONOPLAST_COMPETING'), text, parsed.clauses);
    }
    return result(combine(parsed.clauses.map(assessClause)), text, parsed.clauses);
  }
  return Object.freeze({ taskId: TONOPLAST_TASK_ID, fieldId: TONOPLAST_FIELD_ID, rubricId: TONOPLAST_RUBRIC_ID, versions: boundVersions, evaluate });
}
