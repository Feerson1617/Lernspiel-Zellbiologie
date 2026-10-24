import { createHash } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import cases from '../tests/fixtures/naming-v1-cases.json' with { type: 'json' };
import { namingInput, INDEPENDENT_SUPPORT } from '../tests/helpers/naming-v1.ts';
import { evaluateNaming } from '../src/assessment/naming-v1.ts';
import type { NamingTaskId } from '../src/domain/naming-contract.ts';
import { R8_CORPUS, executeR8 } from '../tests/helpers/p02b-r8.ts';

function canonicalReviewData(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalReviewData);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(key => [key, canonicalReviewData((value as Record<string, unknown>)[key])]));
  return value;
}

const sha = (input: string) => createHash('sha256').update(input).digest('hex');
const files = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], { encoding: 'utf8' }).trim().split('\n');
const measured = files.filter(f => /^(src\/|contracts\/|tests\/|tools\/|\.github\/)|(?:config\.ts|package(?:-lock)?\.json|publish\.allowlist\.json)$/.test(f));
const sourceHashes = Object.fromEntries(measured.map(f => [f, sha(readFileSync(f, 'utf8'))]));
const metadata = { head: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  prHead: process.env['PR_HEAD_SHA'] ?? null,
  dirty: execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).length > 0,
  executedAtUTC: new Date().toISOString(), node: process.version, platform: process.platform,
  sourceHashes, sourceHash: sha(JSON.stringify(sourceHashes)), independence: 'Codex self-check, NOT an independent countercheck; synthetic cases and finite configurations, no student-frequency claim.' };
const rows = cases.map(c => ({ ...c, outcome: evaluateNaming(namingInput(c.taskId as NamingTaskId, c.termText, c.additionalStatements), INDEPENDENT_SUPPORT) }));
const count = (values: readonly string[]) => Object.fromEntries([...new Set(values)].sort().map(v => [v, values.filter(x => x === v).length]));
const fields = Object.fromEntries((['Z1.02', 'M6.02'] as const).map(taskId => {
  const list = rows.filter(r => r.taskId === taskId), complete = list.filter(r => r.expectedTerm === 'correct');
  const correct = complete.filter(r => r.outcome.termResult.status === 'correct').length;
  return [taskId, { cases: list.length, termStatuses: count(list.map(r => r.outcome.termResult.status)), overallStatuses: count(list.map(r => r.outcome.overallStatus)),
    completeDenominator: complete.length, completeCorrect: correct, completeClarify: complete.filter(r => r.outcome.termResult.status === 'clarify').length, correctRate: correct / complete.length,
    mandatoryMismatches: list.filter(r => r.outcome.termResult.status !== r.expectedTerm || r.outcome.overallStatus !== r.expectedOverall).map(r => r.id),
    criticalFalseGreen: list.filter(r => (r.outcome.termResult.status === 'correct' && r.expectedTerm !== 'correct') || (r.outcome.overallStatus === 'correct' && r.expectedOverall !== 'correct')).map(r => r.id),
    criticalFalseRed: list.filter(r => (r.outcome.termResult.status === 'incorrect' && r.expectedTerm !== 'incorrect') || (r.outcome.overallStatus === 'incorrect' && r.expectedOverall !== 'incorrect')).map(r => r.id),
  }];
}));
const legacyGroups = Object.fromEntries(Object.entries(R8_CORPUS.groups).map(([name, list]) => {
  const records = list.map(c => ({ ...c, ...executeR8(c) }));
  return [name, { count: records.length, statuses: count(records.map(r => r.result.status)), originalSollMatched: records.filter(r => r.expected.includes(r.result.status)).length,
    completeResultFeedbackSHA256: sha(JSON.stringify(canonicalReviewData(records.map(({ result, feedback }) => ({ result, feedback }))))), records }];
}));
const legacyShort = ['short-correct', 'tonoplast-correct'].map(group => {
  const list = legacyGroups['main']!.records.filter(c => c.group === group);
  const correct = list.filter(r => r.result.status === 'correct').length;
  return { group, denominator: list.length, correct, statuses: count(list.map(r => r.result.status)), requirement: .95, passed: correct / list.length >= .95 };
});
const schemas = ['contracts/naming-v1.schema.json', 'spec/result.schema.json'].map(p => JSON.parse(readFileSync(p, 'utf8')) as unknown);
const legacyResults = Object.values(legacyGroups).flatMap(g => g.records.map(r => r.result));
const validation = spawnSync(existsSync('.venv/bin/python') ? '.venv/bin/python' : 'python3', ['-c', [
  'import json,sys,jsonschema', 'd=json.load(sys.stdin)', 'count=0',
  'for schema,records in [(d["schemas"][0],d["envelopes"]),(d["schemas"][1],d["results"])]:',
  ' jsonschema.Draft202012Validator.check_schema(schema)', ' v=jsonschema.Draft202012Validator(schema)',
  ' for r in records: v.validate(r); count+=1', 'print(count)',
].join('\n')], { input: JSON.stringify({ schemas, envelopes: rows.map(r => r.outcome), results: [...rows.map(r => r.outcome.termResult), ...legacyResults] }), encoding: 'utf8', timeout: 20000 });
if (validation.error || validation.status !== 0) throw new Error('Actual schema validation failed; see local stderr without treating the run as passed.');
const output = 'qa/generated'; mkdirSync(output, { recursive: true });
writeFileSync(`${output}/naming-v1-results.json`, JSON.stringify({ metadata, contractVersion: 'naming-input/1.0.0', fields, schemaValidatedObjects: Number(validation.stdout), rows }, null, 2) + '\n');
writeFileSync(`${output}/p02b-r8-results.json`, JSON.stringify({ metadata, contractVersion: 'legacy sentence contract review9', sources: R8_CORPUS.sources, versions: { taskVersion: 'review9-task-20261023', rubricVersion: 'review9-rubric-20261023', contentVersion: 'concept-1.0-20261023', modelVersion: 'review-no-simulation' }, historicalQuality: legacyShort, groups: legacyGroups }, null, 2) + '\n');
console.log(JSON.stringify({ sourceHash: metadata.sourceHash, fields, legacyShort, schemaValidatedObjects: Number(validation.stdout) }, null, 2));
if (Object.values(fields).some(f => f.correctRate < .95 || f.mandatoryMismatches.length || f.criticalFalseGreen.length || f.criticalFalseRed.length)) process.exitCode = 1;
if (Object.entries(legacyGroups).some(([name, group]) => group.completeResultFeedbackSHA256 !== R8_CORPUS.expectedResultHashes[name as keyof typeof R8_CORPUS.expectedResultHashes])) process.exitCode = 1;
