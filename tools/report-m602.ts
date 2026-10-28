import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { evaluateM602 } from '../src/assessment/m602.ts';
import { m602Input, M602_SUPPORT } from '../tests/helpers/m602.ts';
import type { RelationField } from '../src/assessment/m602-relations.ts';
const sha = (s: string) => createHash('sha256').update(s).digest('hex');
const own = JSON.parse(readFileSync('tests/fixtures/p02c-cases.json', 'utf8')) as { id: string; field: RelationField; text: string; expected: string; group: string }[];
const refs = (JSON.parse(readFileSync('spec/reference-fixtures.json', 'utf8')) as { cases: { id: string; task_id: string; field_id: string; input: string; expected_status: string }[] }).cases.filter(c => c.task_id === 'M6.02' && ['direction', 'volume'].includes(c.field_id));
const rows = own.map(c => ({ ...c, outcome: evaluateM602(m602Input({ [c.field]: c.text }), M602_SUPPORT) }));
const editorial = refs.map(c => ({ ...c, outcome: evaluateM602(m602Input({ [c.field_id]: c.input }), M602_SUPPORT) }));
const fields = Object.fromEntries((['direction', 'volume'] as const).map(field => {
  const list = rows.filter(c => c.field === field), complete = list.filter(c => c.expected === 'correct');
  const correct = complete.filter(c => c.outcome.fields[field].result.status === 'correct').length;
  return [field, { total: list.length, completeDenominator: complete.length, completeCorrect: correct, rate: correct / complete.length,
    semanticCompleteDenominator: complete.filter(c => c.group === 'semantic').length,
    mismatches: list.filter(c => c.outcome.fields[field].result.status !== c.expected).map(c => c.id),
    falseGreen: list.filter(c => c.outcome.fields[field].result.status === 'correct' && c.expected !== 'correct').map(c => c.id),
    falseRed: list.filter(c => c.outcome.fields[field].result.status === 'incorrect' && c.expected !== 'incorrect').map(c => c.id) }];
}));
const files = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], { encoding: 'utf8' }).trim().split('\n').filter(f => /m602|p02c|publish|config\.ts|package(?:-lock)?\.json/.test(f) && !/^qa\//.test(f));
const metadata = { head: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(), prHead: process.env['PR_HEAD_SHA'] ?? null,
  dirty: execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).length > 0, executedAtUTC: new Date().toISOString(), node: process.version, platform: process.platform,
  sourceHashes: Object.fromEntries(files.map(f => [f, sha(readFileSync(f, 'utf8'))])), independentAcceptance: false,
  limitation: 'Own preregistered synthetic tests and finite configurations; no independent acceptance or student-frequency claim.' };
const editorialMismatches = editorial.filter(c => c.outcome.fields[c.field_id as RelationField].result.status !== c.expected_status).map(c => c.id);
mkdirSync('qa/generated', { recursive: true });
writeFileSync('qa/generated/p02c-runtime.json', JSON.stringify({ metadata, fields, editorialMismatches, rows, editorial }, null, 2) + '\n');
console.log(JSON.stringify({ metadata: { head: metadata.head, dirty: metadata.dirty }, fields, editorialCases: editorial.length, editorialMismatches }, null, 2));
if (Object.values(fields).some(f => f.rate < .95 || f.mismatches.length || f.falseGreen.length || f.falseRed.length) || editorialMismatches.length) process.exitCode = 1;
