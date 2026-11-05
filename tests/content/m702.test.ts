import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import contract from '../../contracts/m702-evidence-1.0.0.json';
import { M702_HELP, M702_MATERIAL, M702_CRITERIA, M702_OPTIONS } from '../../src/content/m702.ts';

it('keeps the public evidence assumptions and labels the new data as constructed', () => {
  expect(M702_MATERIAL).toMatchObject({ source: 'constructed_not_measured', substance: 'uncharged_X', chemicalChange: false, binding: false, redistribution: false, outside: 4, inside: 1, withoutP: 1, withP: 3, energyInvestigated: false });
  expect(contract.version).toBe('m702-evidence/1.0.0'); expect(contract.scope).toContain('never parsed');
});
it('distinguishes a possible mechanism, energy dependence and direct protein ATP hydrolysis', () => {
  expect(M702_HELP[3]).toContain('Ein passiver Proteinweg ist damit vereinbar'); expect(M702_HELP[3]).toContain('schließt eine Kopplung nicht aus');
  expect(M702_HELP[3]).toContain('beweist noch keine direkte ATP-Spaltung durch P'); expect(M702_HELP[3]).toContain('Membranintegrität');
  expect(M702_HELP[1]).not.toMatch(/passiver Proteinweg|ATP-Verfügbarkeit/); expect(M702_HELP[2]).not.toContain('3 statt 1');
});
it('keeps the optional choice scope small and the four criteria ungraded', () => {
  expect(M702_OPTIONS).toHaveLength(6); expect(M702_CRITERIA).toHaveLength(4);
  expect(Object.keys(contract.options)).toEqual(['rate', 'energy_open', 'atp_pump', 'active_proven', 'passive_proven', 'other']);
});
it('keeps public catalogue M7.02 and its original answer unchanged', () => {
  const data = JSON.parse(readFileSync(new URL('../../spec/tasks.json', import.meta.url), 'utf8'));
  const tasks = Array.isArray(data) ? data : data.tasks;
  const task = tasks.find((t: { id: string }) => t.id === 'M7.02');
  expect(task.expected.correct_id).toBe('b'); expect(task.response_spec.options.a).toBe('P ist sicher eine ATP-getriebene Pumpe.');
});
