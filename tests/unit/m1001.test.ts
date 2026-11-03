import { describe, it, expect } from 'vitest';
import cases from '../fixtures/m1001-numeric-cases.json';
import { evaluateNumeric, interpretNumeric } from '../../src/assessment/numeric.ts';
import { createM1001Learning } from '../../src/application/m1001-learning.ts';
import { createM1001Context, validateM1001Context, M1001_ROWS } from '../../src/content/m1001.ts';
import { createTaskContext } from '../../src/domain/task-context.ts';
import { getAttemptOutcome } from '../../src/domain/progress.ts';
describe('Frozen independent numeric references',()=>{
  for(const [i,c] of cases.entries()) it(`${i}: ${c.field} ${JSON.stringify(c.input)} => ${c.expected}`,()=>{
    expect(evaluateNumeric(c.input,{expected:String(c.reference),tolerance:'0.05',unit:'percent'}).status).toBe(c.expected);
  });
});
it('separates units without conversion and consumes the complete input',()=>{
  for(const unit of ['percent','percentage_points','gram','dimensionless'] as const) {
    expect(evaluateNumeric('8',{expected:'8',tolerance:'0',unit}).status).toBe('correct');
    for(const [suffix,kind] of [['%','percent'],['Prozentpunkte','percentage_points'],['g','gram']]) expect(evaluateNumeric(`8 ${suffix}`,{expected:'8',tolerance:'0',unit}).status).toBe(unit===kind?'correct':'incorrect');
  }
  for(const input of ['NaN','Infinity','8e0','8/1','8 % = 8','8\n9','8 % g','8,','8.','++8','−-8',null,8,{},'9'.repeat(129)]) expect(interpretNumeric(input).kind).toBe('clarify');
});
it('exact arbitrary decimal boundaries and outside neighbours',()=>{
  for(const [input,status] of [['8.0500000000000000000000000000000000000','correct'],['8.0500000000000000000000000000000000001','incorrect'],['7.9499999999999999999999999999999999999','incorrect'],['7.9500000000000000000000000000000000000','correct']]) expect(evaluateNumeric(input,{expected:'8',tolerance:'0.05',unit:'percent'}).status).toBe(status);
  expect(()=>evaluateNumeric('8',{expected:'8',tolerance:'-1',unit:'percent'})).toThrow();
});
it('rejects altered material and old versions even with recomputed hash',()=>{
  const c=createM1001Context('test');expect(validateM1001Context(c)).toEqual(c);
  const {contextHash,...input}=c;
  for(const change of [{material:{...c.material,extra:'changed'}},{taskVersion:'old'},{rubricVersion:'old'},{contentVersion:'old'},{modelVersion:'old'},{phase:'investigate' as const},{seed:'other'},{modelState:{x:1}}]) expect(()=>validateM1001Context(createTaskContext({...input,...change}))).toThrow();
});
it('invalidates results on edit/help/reset and preserves metadata-only history',()=>{
 const m=createM1001Learning({resumed:false});
 for(const row of M1001_ROWS)m.edit(row.field,row.expected);
 m.submit();let s=m.getState();expect(s.receipt).not.toBeNull();
 const previous=s.receipt!;expect(getAttemptOutcome(s.progress,previous.attemptId,s.context).independent).toBe(true);
 m.edit('c0','0,08');expect(m.getState().stale).toBe(true);expect(m.getState().receipt).toBeNull();
 m.edit('c0','8');m.help(3);m.submit();s=m.getState();expect(s.receipt?.assistance).toBe('solution_viewed');expect(getAttemptOutcome(s.progress,s.receipt!.attemptId,s.context).successful).toBe(false);
 m.editWriting('PRIVATE WRITING');expect(JSON.stringify(m.getState().progress)).not.toContain('PRIVATE');
 m.reset();s=m.getState();expect(s.assistance).toBe('solution_viewed');expect(s.results).toBeNull();expect(s.writing).toBe('');expect(getAttemptOutcome(s.progress,previous.attemptId,s.context).validity).toBe('context_mismatch');
 for(const row of M1001_ROWS)m.edit(row.field,row.expected);m.help(1);m.submit();expect(m.getState().receipt?.assistance).toBe('solution_viewed');
 const reload=createM1001Learning({resumed:true});for(const row of M1001_ROWS)reload.edit(row.field,row.expected);reload.submit();expect(reload.getState().receipt).toBeNull();
});
