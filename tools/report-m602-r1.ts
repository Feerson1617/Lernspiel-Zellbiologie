import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { evaluateM602 } from '../src/assessment/m602.ts';
import { m602Input, M602_SUPPORT } from '../tests/helpers/m602.ts';
interface Case { id?: string; field: 'direction' | 'volume'; group?: string; text: string; expected: string; extra?: string[] }
const corpus = JSON.parse(readFileSync('tests/fixtures/p02c-r1-cases.json', 'utf8')) as { cases: Case[]; systematic: Case[] };
const own = JSON.parse(readFileSync('tests/fixtures/p02c-r1-own.json', 'utf8')) as Case[];
const rows = [...corpus.cases, ...corpus.systematic, ...own.map((c, i) => ({ ...c, id: `OWN-${i}`, group: 'own' }))].map(c => ({ ...c, outcome: evaluateM602(m602Input({ [c.field]: c.text }, c.extra ?? []), M602_SUPPORT) }));
const summary = Object.fromEntries((['direction', 'volume'] as const).map(field => {
  const list = rows.filter(r => r.field === field && r.group !== 'own'), full = list.filter(r => r.expected === 'correct');
  return [field, { total: list.length, matched: list.filter(r => r.expected === r.outcome.fields[field].result.status).length,
    fullCorrectDenominator: full.length, fullCorrectRecognized: full.filter(r => r.outcome.fields[field].result.status === 'correct').length,
    groups: Object.fromEntries([...new Set(list.map(r => r.group!))].map(group => { const g = list.filter(r => r.group === group); return [group, { count: g.length, matched: g.filter(r => r.expected === r.outcome.fields[field].result.status).length }]; })),
    falseGreen: list.filter(r => r.expected !== 'correct' && r.outcome.fields[field].result.status === 'correct').map(r => r.id), falseRed: list.filter(r => r.expected !== 'incorrect' && r.outcome.fields[field].result.status === 'incorrect').map(r => r.id) }];
}));
const gaps = rows.filter(r => r.expected !== r.outcome.fields[r.field].result.status).map(r => ({ id: r.id, group: r.group, text: r.text, expected: r.expected, actual: r.outcome.fields[r.field].result.status }));
mkdirSync('qa/generated', { recursive: true });
writeFileSync('qa/generated/p02c-r1-results.json', JSON.stringify({ head: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(), independentAcceptance: false, summary, gaps, rows }, null, 2) + '\n');
console.log(JSON.stringify({ summary, gaps }, null, 2));
if (Object.values(summary).some(s => s.falseGreen.length || s.falseRed.length || s.groups['short-correct']!.matched / 60 < .95) || rows.some(r => r.group === 'own' && r.expected !== r.outcome.fields[r.field].result.status)) process.exitCode = 1;
