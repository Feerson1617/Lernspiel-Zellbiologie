import type { Status } from './contracts.ts';
import type { Evidence } from '../assessment/result.ts';

/** Reusable bounded planning fields; no task is enabled by defining a field. */
export interface InvestigationOption {
  readonly id: string;
  readonly label: string;
  readonly status: 'correct' | 'incorrect' | 'partial' | 'clarify';
  readonly reason: string;
}
export interface InvestigationField<Id extends string = string> {
  readonly id: Id;
  readonly criterion: string;
  readonly question: string;
  readonly mode: 'single' | 'multi';
  readonly required: readonly string[];
  readonly minimumCorrect: number;
  readonly options: readonly InvestigationOption[];
}
export type InvestigationAnswer<Id extends string> = Readonly<Record<Id, readonly string[]>>;
export interface InvestigationCriterion<Id extends string = string> {
  readonly id: string;
  readonly field: Id;
  readonly status: Status;
  readonly evidence: readonly Evidence[];
  readonly reasonCode: string;
  readonly text: string;
  readonly decisions: readonly InvestigationOption[];
}
