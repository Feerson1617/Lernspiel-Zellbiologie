import { it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { M1001_ROWS } from '../../src/content/m1001.ts';
import { evaluateNumeric } from '../../src/assessment/numeric.ts';
const catalog=JSON.parse(readFileSync('spec/tasks.json','utf8'));
it('retains the five public field identities, criteria, data and independently specified values',()=>{
 const task=catalog.tasks.find((t:{id:string})=>t.id==='M10.01');
 expect(M1001_ROWS.map(r=>r.field)).toEqual(task.response_spec.fields);
 expect(M1001_ROWS.map(r=>r.criterion)).toEqual(task.criteria.map((c:{id:string})=>c.id));
 expect(M1001_ROWS.map(r=>r.final)).toEqual(['3,24','3,09','2,97','2,85','2,76']);
 for(const row of M1001_ROWS) {
  expect(row.initial).toBe('3,00');expect(Number(row.expected)).toBe(task.expected.fields[row.field].value);
  expect(task.expected.fields[row.field].abs_tolerance).toBe(.05);
 }
});
it('rejects end-mass denominator and omitted factor 100 without inventing a cause',()=>{
 for(const [expected,input] of [['8','7.4074'],['3','2.9126'],['-1','-1.010101'] ,['-5','-5.2632'],['-8','-8.6957']] as const) {
  // -1.010101 remains within the agreed tolerance; do not punish a guessed method.
  expect(evaluateNumeric(input,{expected,tolerance:'0.05',unit:'percent'}).status).toBe(expected==='-1'?'correct':'incorrect');
 }
 for(const expected of ['8','3','-1','-5','-8']) expect(evaluateNumeric(String(Number(expected)/100),{expected,tolerance:'0.05',unit:'percent'}).status).toBe('incorrect');
});
