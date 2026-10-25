import type { Assistance, Status, VersionInfo } from '../domain/contracts.ts';
import type { TaskId } from '../domain/identities.ts';
import { ContextContractError, readDataRecord } from '../domain/context-data.ts';
import { createContextBinding, parseTaskContext } from '../domain/task-context.ts';
import type { TaskContext } from '../domain/task-context.ts';
import { AssessmentContractError, parseEvaluationResult, requireAssistance, requireAssessmentLabel } from './result.ts';
import type { EvaluationResult } from './result.ts';
import { isSupportedText, MAX_ANSWER_LENGTH } from './text.ts';

export interface TextDecision { readonly status: Status; readonly code: string; readonly unassessed: boolean }
export interface TextAssessment extends TextDecision { readonly spans: readonly Readonly<{ start: number; end: number }>[] }
interface TermDefinition {
  readonly taskId: TaskId;
  readonly fieldId: string;
  readonly criterionId: string;
  readonly supportsContext: (context: TaskContext) => boolean;
  readonly assessText: (text: string) => TextAssessment;
  readonly codes: Readonly<{ wrongField: string; version: string; context: string; input: string; tooLong: string; empty: string }>;
}

/** Shared contract/input envelope only. Biological decisions and grammar profiles belong to each field. */
export function createBoundTermEvaluator(versions: VersionInfo, definition: TermDefinition) {
  const record = readDataRecord(versions);
  const fields = ['taskVersion', 'rubricVersion', 'contentVersion', 'modelVersion'] as const;
  if (Object.keys(record).length !== fields.length || !fields.every((key) => Object.hasOwn(record, key))) throw new AssessmentContractError();
  const expected: Record<string, string> = {};
  for (const field of fields) { requireAssessmentLabel(record[field]); expected[field] = record[field]; }
  const boundVersions = Object.freeze(expected) as unknown as VersionInfo;
  function evaluate(context: TaskContext, response: unknown, assistance: Assistance): EvaluationResult {
    const active = parseTaskContext(context);
    requireAssistance(assistance);
    function result(value: TextDecision, text = '', spans: TextAssessment['spans'] = []): EvaluationResult {
      return parseEvaluationResult({ ...createContextBinding(active), status: value.status,
        criteria: [{ id: definition.criterionId, status: value.status, reasonCode: value.code,
          evidence: spans.map(({ start, end }) => ({ kind: 'input_span', start, end, value: text.slice(start, end) })) }],
        unassessedRelevantText: value.unassessed, assistance, feedbackCode: value.code });
    }
    const technical = (code: string, unassessed = false) => result({ status: 'technical', code, unassessed });
    if (active.taskId !== definition.taskId) return technical(definition.codes.wrongField);
    if (fields.some((field) => active[field] !== boundVersions[field])) return technical(definition.codes.version);
    if (!definition.supportsContext(active)) return technical(definition.codes.context);
    let input: Readonly<Record<string, unknown>>;
    try { input = readDataRecord(response); }
    catch (error) {
      if (error instanceof ContextContractError) return technical(definition.codes.input, true);
      throw error;
    }
    if (Object.keys(input).length !== 2 || !Object.hasOwn(input, 'fieldId') || !Object.hasOwn(input, 'text')) return technical(definition.codes.input, true);
    if (input['fieldId'] !== definition.fieldId) return technical(definition.codes.wrongField);
    const text = input['text'];
    if (typeof text !== 'string') return technical(definition.codes.input, true);
    if (text.length > MAX_ANSWER_LENGTH) return technical(definition.codes.tooLong, true);
    if (!isSupportedText(text)) return technical(definition.codes.input, true);
    if (text.trim() === '') return result({ status: 'empty', code: definition.codes.empty, unassessed: false });
    const assessment = definition.assessText(text);
    return result(assessment, text, assessment.spans);
  }
  return Object.freeze({ versions: boundVersions, evaluate });
}
