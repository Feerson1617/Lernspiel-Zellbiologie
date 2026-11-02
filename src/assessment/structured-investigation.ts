import { readDataRecord, snapshotContextData } from '../domain/context-data.ts';
import type { InvestigationAnswer, InvestigationCriterion, InvestigationField } from '../domain/structured-investigation.ts';
import type { Status } from '../domain/contracts.ts';

/** Exact bounded shape. No free text is accepted or interpreted here. */
export function parseInvestigationAnswer<Id extends string>(input: unknown, fields: readonly InvestigationField<Id>[]): InvestigationAnswer<Id> {
  const record = readDataRecord(input);
  if (Object.keys(record).length !== fields.length || fields.some(f => !Object.hasOwn(record, f.id))) throw new Error('Invalid planning fields.');
  for (const f of fields) {
    const values = record[f.id];
    if (!Array.isArray(values) || values.length > (f.mode === 'single' ? 1 : f.options.length)) throw new Error('Invalid planning selection.');
  }
  const safe = snapshotContextData(record).value;
  for (const f of fields) {
    const values = safe[f.id] as readonly unknown[];
    if (new Set(values).size !== values.length || values.some(v => !f.options.some(o => o.id === v))) throw new Error('Unknown or duplicate option.');
  }
  return safe as InvestigationAnswer<Id>;
}
export function assessInvestigationField<Id extends string>(field: InvestigationField<Id>, selected: readonly string[]): InvestigationCriterion<Id> {
  const decisions = selected.map(id => field.options.find(option => option.id === id)!);
  const missing = field.required.filter(id => !selected.includes(id));
  const status: Status = !selected.length ? 'empty'
    : decisions.some(d => d.status === 'incorrect') ? 'incorrect'
      : decisions.some(d => d.status === 'clarify') ? 'clarify'
        : decisions.some(d => d.status === 'partial') || missing.length || decisions.filter(d => d.status === 'correct').length < field.minimumCorrect ? 'partial' : 'correct';
  const text = status === 'empty' ? 'Noch keine Entscheidung in diesem Feld.'
    : status === 'correct' ? 'Alle geforderten Entscheidungen dieses Feldes sind begründet und vollständig.'
      : status === 'incorrect' ? 'Die bezeichnete Entscheidung widerspricht der Fragestellung oder den vorliegenden Befunden. Zutreffende Teile bleiben sichtbar.'
        : status === 'clarify' ? 'Die Entscheidung ist noch unsicher. Das ist kein nachgewiesener biologischer Fehler.'
          : missing.length ? `Ergänze noch: ${missing.map(id => field.options.find(o => o.id === id)!.label).join(' · ')}`
            : 'Ein zutreffender Ansatz ist vorhanden. Für das vollständige Kriterium fehlen noch die ausdrücklich geforderten Entscheidungen.';
  return Object.freeze({ id: field.criterion, field: field.id, status, reasonCode: `INVESTIGATION_${status.toUpperCase()}`, text,
    decisions: Object.freeze(decisions), evidence: Object.freeze(selected.map(value => Object.freeze({ kind: 'option_id' as const, value: `${field.id}/${value}` }))) });
}
export function aggregateInvestigation(criteria: readonly InvestigationCriterion[]): Status {
  if (criteria.some(c => c.status === 'incorrect')) return 'incorrect';
  if (criteria.some(c => c.status === 'clarify')) return 'clarify';
  if (criteria.every(c => c.status === 'empty')) return 'empty';
  return criteria.length && criteria.every(c => c.status === 'correct') ? 'correct' : 'partial';
}
