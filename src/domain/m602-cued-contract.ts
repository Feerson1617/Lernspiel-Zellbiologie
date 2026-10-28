import type { VersionInfo } from './contracts.ts';
import { readDataRecord } from './context-data.ts';
import { M602_CONTRACT, parseM602Submission } from './m602-contract.ts';
import type { M602Submission, M602Outcome } from './m602-contract.ts';
import { namingSnapshot, namingRequire } from './naming-contract.ts';
import { requireAssessmentLabel } from '../assessment/result.ts';

export const M602_CUED_CONTRACT = 'm602-cued-relations/1.0.0' as const;
export type M602ContractVersion = typeof M602_CONTRACT | typeof M602_CUED_CONTRACT;
export type M602VersionedSubmission<V extends M602ContractVersion> = Omit<M602Submission, 'contractVersion'> & Readonly<{ contractVersion: V }>;
export type M602VersionedOutcome<V extends M602ContractVersion> = Omit<M602Outcome, 'contractVersion' | 'submission'> & Readonly<{ contractVersion: V; submission: M602VersionedSubmission<V> }>;
export type M602CuedSubmission = M602VersionedSubmission<typeof M602_CUED_CONTRACT>;
export type M602CuedOutcome = M602VersionedOutcome<typeof M602_CUED_CONTRACT>;

export function m602CuedVersions(modelVersion: string): VersionInfo {
  requireAssessmentLabel(modelVersion);
  return Object.freeze({ taskVersion: 'M6.02@cued-relations-1', rubricVersion: 'M6.02.C01-C03@cued-relations-1', contentVersion: 'zelllabor11.m602-cued-content/1.0.0', modelVersion });
}
export function parseM602CuedSubmission(input: unknown): M602CuedSubmission {
  const s = namingSnapshot(readDataRecord(input));
  namingRequire(s['contractVersion'] === M602_CUED_CONTRACT, 'M602_CUED_CONTRACT');
  // Reuse the closed shape validator, not the old biological evaluator. Preserve
  // the supplied context; no conversion of old versions into current results.
  parseM602Submission({ ...s, contractVersion: M602_CONTRACT });
  return s as unknown as M602CuedSubmission;
}
