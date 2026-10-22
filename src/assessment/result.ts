import { ASSISTANCE_KINDS, STATUSES } from '../domain/contracts.ts';
import type { Assistance, Status } from '../domain/contracts.ts';
import { ContextContractError, readDataRecord, snapshotContextData } from '../domain/context-data.ts';
import { isTaskId } from '../domain/identities.ts';
import type { ContextBinding } from '../domain/task-context.ts';

export type Evidence = Readonly<{ kind: 'input_span'; value: string; start: number; end: number }>
  | Readonly<{ kind: 'option_id' | 'state_value'; value: string }>;
export interface CriterionResult {
  readonly id: string;
  readonly status: Status;
  readonly evidence: readonly Evidence[];
  readonly reasonCode: string;
}
export interface EvaluationResult extends ContextBinding {
  readonly status: Status;
  readonly criteria: readonly CriterionResult[];
  readonly unassessedRelevantText: boolean;
  readonly assistance: Assistance;
  readonly feedbackCode: string;
}
export class AssessmentContractError extends Error {
  constructor() { super('Invalid assessment contract.'); this.name = 'AssessmentContractError'; }
}
function require(condition: unknown): asserts condition { if (!condition) throw new AssessmentContractError(); }
function fields(record: Readonly<Record<string, unknown>>, keys: readonly string[]): void {
  require(Object.keys(record).length === keys.length && keys.every((key) => Object.hasOwn(record, key)));
}
export function requireAssessmentLabel(input: unknown): asserts input is string {
  require(typeof input === 'string' && input.length > 0 && input.length <= 256
    && input.trim() === input && !/[\u0000-\u001f\u007f]/u.test(input));
}
export function requireAssistance(input: unknown): asserts input is Assistance {
  require(ASSISTANCE_KINDS.includes(input as Assistance));
}

/** Runtime refinement of result.schema.json; no answer interpretation or context trust. */
export function parseEvaluationResult(input: unknown): EvaluationResult {
  try {
    const value = snapshotContextData(input).value;
    fields(value, ['taskId', 'taskVersion', 'rubricVersion', 'contextHash', 'status', 'criteria', 'unassessedRelevantText', 'assistance', 'feedbackCode']);
    require(isTaskId(value['taskId']));
    for (const key of ['taskVersion', 'rubricVersion', 'feedbackCode']) requireAssessmentLabel(value[key]);
    require(typeof value['contextHash'] === 'string' && /^sha256-v1:[a-f0-9]{64}$/.test(value['contextHash']));
    require(STATUSES.includes(value['status'] as Status));
    requireAssistance(value['assistance']);
    require(typeof value['unassessedRelevantText'] === 'boolean' && Array.isArray(value['criteria']));
    const criteria = value['criteria'];
    const ids = new Set<string>();
    for (const item of criteria) {
      const criterion = readDataRecord(item);
      fields(criterion, ['id', 'status', 'evidence', 'reasonCode']);
      requireAssessmentLabel(criterion['id']); requireAssessmentLabel(criterion['reasonCode']);
      require(!ids.has(criterion['id'])); ids.add(criterion['id']);
      require(STATUSES.includes(criterion['status'] as Status) && Array.isArray(criterion['evidence']));
      for (const item of criterion['evidence']) {
        const evidence = readDataRecord(item);
        require(typeof evidence['value'] === 'string' && evidence['value'].length > 0);
        if (evidence['kind'] === 'input_span') {
          fields(evidence, ['kind', 'value', 'start', 'end']);
          require(Number.isSafeInteger(evidence['start']) && Number.isSafeInteger(evidence['end']));
          require((evidence['start'] as number) >= 0 && (evidence['end'] as number) > (evidence['start'] as number));
          require((evidence['end'] as number) - (evidence['start'] as number) === evidence['value'].length);
        } else {
          fields(evidence, ['kind', 'value']);
          require(evidence['kind'] === 'option_id' || evidence['kind'] === 'state_value');
        }
      }
      if (criterion['status'] === 'incorrect') require(criterion['evidence'].length > 0);
    }
    if (value['status'] === 'correct') require(!value['unassessedRelevantText'] && criteria.length > 0 && criteria.every((item) => readDataRecord(item)['status'] === 'correct'));
    if (value['status'] === 'incorrect') require(criteria.some((item) => readDataRecord(item)['status'] === 'incorrect'));
    return value as unknown as EvaluationResult;
  } catch (error) {
    if (error instanceof ContextContractError) throw new AssessmentContractError();
    throw error;
  }
}
