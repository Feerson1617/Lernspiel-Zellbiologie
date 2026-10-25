import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { evaluateM602 } from '../src/assessment/m602.ts';
import { createM602Session } from '../src/application/m602-session.ts';
import { m602Input, M602_SUPPORT } from '../tests/helpers/m602.ts';
type Case = { id: string; field: 'direction' | 'volume'; text: string; expected?: string; accepted?: string[]; group?: string; extra?: string[] };
const json = (p: string) => JSON.parse(readFileSync(p, 'utf8'));
const stocks: Record<string, Case[]> = { supplied156: json('tests/fixtures/p02c-r3-cases.json'), coordination10: json('tests/fixtures/p02c-r3-coordination-cases.json').cases, own33: json('tests/fixtures/p02c-r3-own.json') };
const rows = Object.entries(stocks).flatMap(([stock, cases]) => cases.map(c => {
  const input = m602Input({ [c.field]: c.text }, c.extra ?? []), outcome = evaluateM602(input, M602_SUPPORT);
  const status = outcome.fields[c.field].result.status, accepted = c.accepted ?? [c.expected!];
  let receipt = null;
  const session = createM602Session(input.context, { idPrefix: `${stock}-${c.id}`, resumed: false, loadedAttempts: [] });
  const live = session.submit(session.makeSubmission(input.answers, input.additionalStatements));
  try { receipt = session.record(live); } catch { /* non-completion is expected for unclear/partial/wrong input */ }
  return { ...c, stock, accepted, outcome, status, matched: accepted.includes(status), receipt };
}));
const summary = Object.fromEntries(Object.keys(stocks).map(stock => [stock, Object.fromEntries((['direction', 'volume'] as const).map(field => {
  const list = rows.filter(c => c.stock === stock && c.field === field), correct = list.filter(c => c.accepted.includes('correct'));
  const short = list.filter(c => c.group === 'correct_short' || c.group === 'short-correct');
  return [field, { total: list.length, matched: list.filter(c => c.matched).length, correctDenominator: correct.length, correctRecognized: correct.filter(c => c.status === 'correct').length,
    shortDenominator: short.length, shortRecognized: short.filter(c => c.status === 'correct').length,
    falseGreen: list.filter(c => c.status === 'correct' && !c.accepted.includes('correct')).map(c => c.id),
    falseRed: list.filter(c => c.status === 'incorrect' && !c.accepted.includes('incorrect')).map(c => c.id) }];
}))]));
const gaps = rows.filter(c => !c.matched).map(({ id, stock, field, text, accepted, status }) => ({ id, stock, field, text, accepted, actual: status }));
mkdirSync('qa/generated', { recursive: true });
writeFileSync('qa/generated/p02c-r3-results.json', JSON.stringify({ head: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(), dirty: execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).trim() !== '', prHead: process.env['PR_HEAD_SHA'] ?? null, independentAcceptance: false, summary, gaps, rows }, null, 2) + '\n');
console.log(JSON.stringify({ summary, gaps }, null, 2));
// Do not conceal a corpus failure behind narrower gates. Raw biological Soll remains unchanged.
if (gaps.length) process.exitCode = 1;
