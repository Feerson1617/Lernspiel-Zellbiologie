import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { evaluateM602Cued } from '../src/assessment/m602-cued.ts';
import { createM602CuedSession } from '../src/application/m602-session.ts';
import { M602_CUED_CONTRACT } from '../src/domain/m602-cued-contract.ts';
import { m602CuedInput, M602_SUPPORT } from '../tests/helpers/m602-cued.ts';
import type { RelationField } from '../src/assessment/m602-relations.ts';
const cases = ['cases','supplement'].flatMap(name => JSON.parse(readFileSync(`tests/fixtures/m602-cued-${name}.json`, 'utf8'))) as { id: string; field: RelationField; text: string; expected: string; group: string }[];
const rows = cases.map(c => {
  const input = m602CuedInput({ [c.field]: c.text }), outcome = evaluateM602Cued(input, M602_SUPPORT);
  const s = createM602CuedSession(input.context, { idPrefix: c.id, resumed: false, loadedAttempts: [] });
  const live = s.submit(s.makeSubmission(input.answers, [])); let receipt = null;
  try { receipt = s.record(live); } catch { /* non-completion is required except for fully correct input */ }
  const actual = outcome.fields[c.field].result.status;
  return { ...c, input, outcome, receipt, actual, passed: actual === c.expected && Boolean(receipt) === (c.expected === 'correct') };
});
const summary = Object.fromEntries((['direction', 'volume'] as const).map(field => {
  const list = rows.filter(c => c.field === field), valid = list.filter(c => c.group === 'valid');
  return [field, { total: list.length, passed: list.filter(c => c.passed).length,
    validDenominator: valid.length, validGreen: valid.filter(c => c.actual === 'correct').length,
    falseGreen: list.filter(c => c.actual === 'correct' && c.expected !== 'correct').map(c => c.id),
    falseRed: list.filter(c => c.actual === 'incorrect' && c.expected !== 'incorrect').map(c => c.id) }];
}));
const gaps = rows.filter(c => !c.passed);
const report = { contract: M602_CUED_CONTRACT, head: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  dirty: Boolean(execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).trim()), independentAcceptance: false,
  scope: 'Own predeclared current slot matrix; includes spelling, formatting and uncertainty variants, not independent natural pupil language. Historical free-text outcomes are separate, not successful current cases. R4 files are external and are not loaded by this reporter.', summary, gaps, rows };
mkdirSync('qa/generated', { recursive: true });
writeFileSync('qa/generated/m602-cued-results.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ summary, gaps: gaps.map(c => c.id) }, null, 2));
if (gaps.length || Object.values(summary).some(s => s.validDenominator === 0 || s.validGreen / s.validDenominator < .95 || s.falseGreen.length || s.falseRed.length)) process.exitCode = 1;
