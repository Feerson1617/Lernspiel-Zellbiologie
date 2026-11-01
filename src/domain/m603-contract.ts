import type { Status } from './contracts.ts';
import type { ContextBinding } from './task-context.ts';
import type { CriterionResult } from '../assessment/result.ts';

export const M603_CONTRACT = 'm603-causal-map/1.0.1';
export const M603_VERSIONS = Object.freeze({
  taskVersion: 'M6.03@causal-map-2', rubricVersion: 'M6.03.C01-C04@causal-map-1.0.1',
  contentVersion: 'zelllabor11.m603-content/1.1.0', modelVersion: 'm603-static-explanation/1.1.0',
});
export const M603_NODES = Object.freeze(['A', 'B', 'C', 'D'] as const);
export type M603Node = (typeof M603_NODES)[number];
export const M603_RELATIONS = Object.freeze(['causes', 'enables_if', 'requires_zero', 'coupled', 'possible_together', 'strictly_before', 'prevents'] as const);
export type M603Relation = (typeof M603_RELATIONS)[number];
export const M603_CLAIMS = Object.freeze(['wall_stable', 'passive_potential', 'wall_shrinks', 'already_detached', 'active_water_pump', 'intentional_loss', 'concentration_only'] as const);
export type M603Claim = (typeof M603_CLAIMS)[number];
export interface M603Edge { readonly from: M603Node; readonly to: M603Node; readonly relation: M603Relation }
export interface M603Answer { readonly edges: readonly M603Edge[]; readonly claims: readonly M603Claim[] }
export const M603_REQUIRED = Object.freeze([
  Object.freeze({ criterion: 'M6.03.C01', from: 'A', to: 'B', relation: 'causes' }),
  Object.freeze({ criterion: 'M6.03.C02', from: 'A', to: 'C', relation: 'causes' }),
  Object.freeze({ criterion: 'M6.03.C03', from: 'B', to: 'D', relation: 'enables_if' }),
  Object.freeze({ criterion: 'M6.03.C04', from: 'C', to: 'D', relation: 'requires_zero' }),
] as const);
export interface M603Feedback { readonly status: Status; readonly code: string; readonly text: string }
export interface M603ItemFeedback extends M603Feedback { readonly index: number }
export interface M603Outcome {
  readonly contractVersion: typeof M603_CONTRACT;
  readonly binding: ContextBinding | null;
  readonly status: Status;
  readonly criteria: readonly CriterionResult[];
  readonly edges: readonly M603ItemFeedback[];
  readonly claims: readonly M603ItemFeedback[];
  readonly messages: readonly M603Feedback[];
}
