import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const source = readFileSync('tests/browser/m602-cued.spec.ts','utf8');
const frozen = JSON.parse(readFileSync('qa/m602-unknown-browser-freeze.json','utf8'));
const cases = JSON.parse(readFileSync('tests/fixtures/m602-unknown-browser-cases.json','utf8'));
const hash = (text: string) => createHash('sha256').update(text).digest('hex');
const normalize = (text: string) => text.split('\n').filter(line => !line.trim().startsWith('timing.mark(')).map(line => line.trim()).join('\n').trim();
const blocks: Record<string,string[]> = {};
for (const [name, expected] of Object.entries(frozen.blocks)) {
  const matches = [...source.matchAll(new RegExp(`// BEGIN frozen ${name}\\n([\\s\\S]*?)\\s*// END frozen ${name}`, 'g'))];
  assert.equal(matches.length, ['setup','privacy'].includes(name) ? 2 : 1);
  blocks[name] = matches.map(m => hash(normalize(m[1]!)));
  for (const actual of blocks[name]) assert.equal(actual, expected, `Original ${name} actions or assertions changed`);
}
assert.deepEqual(cases, frozen.cases);
assert.equal(new Set(cases.map((r: {id:string}) => r.id)).size,14);
assert.match(source,/for \(const row of unknownCases\) test\(`\$\{row.id\}:/);
assert.equal(source.split("test('M602-UNKNOWN-help-revision:").length - 1,1);
const report = { sourceCommit:frozen.sourceCommit, cases:cases.length, distinctCases:14, helpCases:1, blocks,
  casesSha256:hash(JSON.stringify(cases)), preserved:true, intentionalRepetition:frozen.intentionalRepetition };
writeFileSync('qa/generated/m602-browser-split.json',JSON.stringify(report,null,2));
console.log('M6.02 split: all 14 inputs and the help path preserved; original action/assertion block hashes match.');
