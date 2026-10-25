import type { Status } from '../domain/contracts.ts';
import { createContextBinding, parseTaskContext } from '../domain/task-context.ts';
import type { TaskContext } from '../domain/task-context.ts';
import { M602_FIELDS, M602_CRITERIA } from '../domain/m602-contract.ts';
import { M602_CUED_CONTRACT as M602_CONTRACT, m602CuedVersions as m602Versions, parseM602CuedSubmission as parseM602Submission } from '../domain/m602-cued-contract.ts';
import type { M602Field, M602FieldOutcome, M602Unassessed } from '../domain/m602-contract.ts';
import type { M602CuedOutcome as M602Outcome } from '../domain/m602-cued-contract.ts';
import { namingSnapshot, createNamingSupport, exactNamingFields } from '../domain/naming-contract.ts';
import { readDataRecord } from '../domain/context-data.ts';
import type { NamingSupport } from '../domain/naming-contract.ts';
import { parseEvaluationResult } from './result.ts';
import { supportsOsmosisContext } from './osmosis-context.ts';
import { classifyNamingTerm } from './naming-v1.ts';
import { namingFeedback } from './naming-feedback.ts';
import { classifyM602CuedRelation as classifyM602Relation } from './m602-cued-relations.ts';
import { cuedRelationFeedback as relationFeedback } from './m602-cued-feedback.ts';
import { isSupportedText } from './text.ts';

export function supportsM602CuedContext(input: TaskContext): boolean {
  const c = parseTaskContext(input), v = m602Versions(c.modelVersion);
  return c.taskId === 'M6.02' && Object.entries(v).every(([k, value]) => c[k as keyof typeof v] === value) && supportsOsmosisContext(c);
}
export function evaluateM602Cued(input: unknown, provenance: Readonly<Record<M602Field, NamingSupport>>): M602Outcome {
  const submission = parseM602Submission(input), context = submission.context;
  const given = namingSnapshot(readDataRecord(provenance)); exactNamingFields(given, M602_FIELDS);
  const fieldSupport = Object.fromEntries(M602_FIELDS.map(f => [f, createNamingSupport(given[f] as NamingSupport)])) as Record<M602Field, NamingSupport>;
  const rank = ['independent', 'hint', 'wordbank', 'clarified', 'solution_viewed'] as const;
  const all = M602_FIELDS.map(f => fieldSupport[f]), assistance = all.reduce((a, b) => rank.indexOf(a) >= rank.indexOf(b.assistance) ? a : b.assistance, all[0]!.assistance);
  const history = all.some(s => s.history === 'history_unverified') ? 'history_unverified' : 'verified';
  const checkedSupport = createNamingSupport({ assistance, history, origin: 'typed', events: all.flatMap(s => s.events) });
  const support = { assistance: checkedSupport.assistance, history: checkedSupport.history, events: checkedSupport.events };
  const valid = supportsM602CuedContext(context), binding = createContextBinding(context);
  const fields = {} as Record<M602Field, M602FieldOutcome>;
  const notAssessed: M602Unassessed[] = [];
  for (const field of M602_FIELDS) {
    const text = submission.answers[field];
    const decision = valid ? field === 'process' ? classifyNamingTerm(text, 'M6.02') : classifyM602Relation(text, field) : { status: 'technical' as const, reason: 'technical' };
    if (decision.status === 'clarify') notAssessed.push({ field, index: null, status: 'not_assessed', value: text, start: 0, end: text.length });
    const result = parseEvaluationResult({ ...binding, status: decision.status, criteria: [{ id: M602_CRITERIA[field], status: decision.status,
      reasonCode: decision.reason, evidence: text.length ? [{ kind: 'input_span', value: text, start: 0, end: text.length }] : [] }],
      unassessedRelevantText: decision.status === 'clarify', assistance: fieldSupport[field].assistance, feedbackCode: `m602.${field}.${decision.reason}` });
    const feedback = field === 'process' ? decision.status === 'correct'
      ? { recognized: 'Du hast den Wassertransportvorgang als Osmose benannt.', difference: decision.reason === 'spelling' ? 'Die geprüfte Schreibvariante ist eindeutig; die Standardschreibweise ist Osmose. Bestätigt ist C01.' : 'Damit ist das Benennungskriterium C01 erfüllt. Richtung und Volumen werden in ihren eigenen Kriterien geprüft.', next: 'Prüfe die getrennten Rückmeldungen zu C02/C03 und den Gesamtumfang; die Benennung allein schließt M6.02 nicht ab.' }
      : namingFeedback('M6.02', decision.reason) : relationFeedback(field, decision.reason);
    fields[field] = { field, result, feedback };
  }
  for (const [index, value] of submission.additionalStatements.entries()) if (value.trim()) notAssessed.push({ field: 'additionalStatements', index, status: 'not_assessed', value, start: 0, end: value.length });
  const statuses = M602_FIELDS.map(f => fields[f].result.status);
  const technical = !valid || statuses.includes('technical') || history === 'history_unverified' || submission.additionalStatements.some(t => t.length > 4096 || !isSupportedText(t));
  const overallStatus: Status = technical ? 'technical' : statuses.includes('incorrect') ? 'incorrect' : notAssessed.length ? 'clarify'
    : statuses.every(s => s === 'empty') ? 'empty' : statuses.every(s => s === 'correct') ? 'correct' : 'partial';
  const fullResult = parseEvaluationResult({ ...binding, status: overallStatus, criteria: M602_FIELDS.flatMap(f => fields[f].result.criteria),
    unassessedRelevantText: notAssessed.length > 0, assistance: support.assistance, feedbackCode: `m602.overall.${overallStatus}` });
  return namingSnapshot({ contractVersion: M602_CONTRACT, submission, fields, fullResult, overallStatus,
    pendingCriteria: M602_FIELDS.filter(f => fields[f].result.status !== 'correct').map(f => M602_CRITERIA[f]), notAssessed, support, fieldSupport });
}
