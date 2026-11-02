import type { Status } from './contracts.ts';
import type { ContextBinding } from './task-context.ts';
import type { InvestigationAnswer, InvestigationCriterion } from './structured-investigation.ts';

export const M604_CONTRACT = 'm604-controlled-investigation/1.0.0';
export const M604_VERSIONS = Object.freeze({
  taskVersion: 'M6.04@controlled-investigation-1', rubricVersion: 'M6.04.C01-C17@investigation-1.0.0',
  contentVersion: 'zelllabor11.m604-content/1.0.0', modelVersion: 'm604-didactic-observations/1.0.0',
});
export const M604_FIELDS = Object.freeze(['control', 'interpretation', 'limits', 'hypothesis', 'design', 'independent', 'dependent', 'constants', 'fields', 'repetitions', 'sequence', 'observation', 'predictionType', 'observationType', 'explanationType', 'mechanism', 'nextCheck'] as const);
export type M604Field = (typeof M604_FIELDS)[number];
export const M604_CASE_IDS = Object.freeze(['recovery', 'limited'] as const);
export type M604CaseId = (typeof M604_CASE_IDS)[number];
export type M604Answer = InvestigationAnswer<M604Field>;
export interface M604Outcome {
  readonly contractVersion: typeof M604_CONTRACT;
  readonly binding: ContextBinding | null;
  readonly status: Status;
  readonly criteria: readonly InvestigationCriterion<M604Field>[];
  readonly message: string;
}
