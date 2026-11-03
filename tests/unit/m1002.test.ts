import { it,expect } from 'vitest';
import { readFileSync } from 'node:fs';
import cases from '../fixtures/m1002-diagram-cases.json';
import legacy from '../fixtures/m1001-numeric-cases.json';
import { assessDiagram,scaleNumbers } from '../../src/assessment/diagram.ts';
import type { DiagramAnswer } from '../../src/assessment/diagram.ts';
import { evaluateNumeric,interpretNumeric,numericFormatMessage } from '../../src/assessment/numeric.ts';
import { createM1002Learning } from '../../src/application/m1002-learning.ts';
import { createM1002Context,validateM1002Context } from '../../src/content/m1002.ts';
import { createTaskContext } from '../../src/domain/task-context.ts';
import { getAttemptOutcome } from '../../src/domain/progress.ts';
const good=cases[0]!.answer as unknown as DiagramAnswer;
for(const c of cases)it(`frozen diagram: ${c.id}`,()=>{const r=assessDiagram(c.answer);expect(r.status).toBe(c.status);expect(r.criteria.map(v=>v.status)).toEqual(c.criteria);});
it('preserves every old numeric outcome and diagnoses formats without changing statuses',()=>{
 for(const c of legacy)expect(evaluateNumeric(c.input,{expected:String(c.reference),tolerance:'0.05',unit:'percent'}).status).toBe(c.expected);
 expect(interpretNumeric('8,000')).toEqual({kind:'clarify'});expect(numericFormatMessage('8,000')).toContain('8 oder 8,00');
 expect(numericFormatMessage('1'.repeat(129))).toContain('128 Zeichen');expect(numericFormatMessage('1'.repeat(41))).toContain('40 Ziffern');
});
it('uses an explicit mol/L grammar and exact inclusive boundaries, never unit conversion',()=>{
 const rule={expected:'0.100',tolerance:'0.005',unit:'mol_per_litre',grammar:'coordinate-decimal/1.0.0'} as const;
 for(const input of ['0.095','0,095 mol/L','0.105','+0,105 mol/L','0.100','0.1000','0.1050000000000000000000000000000000000'])expect(evaluateNumeric(input,rule).status).toBe('correct');
 for(const input of ['0.0949999999999999999999999999999999999','0.1050000000000000000000000000000000001','100','0.1 %','0.1 g'])expect(evaluateNumeric(input,rule).status).toBe('incorrect');
 for(const input of ['1,000','0.100 und 0.200','0,100.0','0.1 mmol/L','0.1 mol/L = 100 mmol/L','0.1 garbage'])expect(evaluateNumeric(input,rule).status).toBe('clarify');
 expect(interpretNumeric('0.100').kind).toBe('clarify');expect(interpretNumeric('0.1 mol/L').kind).toBe('clarify');
 expect(()=>evaluateNumeric('0.1',{expected:'0.1',tolerance:'0.005',unit:'mol_per_litre'})).toThrow();
});
it('matches permutations one to one, preserves correct partial decisions, rejects extra structure and duplicate identities',()=>{
 const reverse={...good,points:[...good.points].reverse()};expect(assessDiagram(reverse).status).toBe('correct');
 const changed={...good,points:good.points.map((p,i)=>i===2?{...p,y:'1'}:p)};const r=assessDiagram(changed);expect(r.points.map(p=>p.status)).toEqual(['correct','correct','incorrect','correct','correct']);expect(r.axes?.x.status).toBe('correct');
 expect(assessDiagram({...good,unverified:'another claim'}).status).toBe('clarify');
 expect(assessDiagram({...good,points:good.points.map(p=>({...p,id:'same'}))}).status).toBe('clarify');
 expect(assessDiagram({xAxis:{quantity:'',unit:'',ticks:['','','']},yAxis:{quantity:'',unit:'',ticks:['','','']},points:[]}).status).toBe('empty');
 expect(scaleNumbers({...good.xAxis,ticks:['0','0.1','0.4']},'x')).toBeNull();
});
it('rejects changed material, context and every contract version even after recomputing its hash',()=>{
 const context=createM1002Context('test'),{contextHash,...data}=context;expect(validateM1002Context(context)).toEqual(context);
 for(const change of [{taskId:'M10.01' as const},{material:{...context.material,xTolerance:'1'}},{taskVersion:'old'},{rubricVersion:'old'},{contentVersion:'old'},{modelVersion:'old'},{phase:'investigate' as const},{seed:'other'},{modelState:{curve:true}}])expect(()=>validateM1002Context(createTaskContext({...data,...change}))).toThrow();
});
it('binds revision and help to receipts, retains metadata only, and never grades writing',()=>{
 const m=createM1002Learning({resumed:false});m.setAxis('x',good.xAxis);m.setAxis('y',good.yAxis);const ids=good.points.map(p=>m.addPoint(p.x,p.y));m.submit();
 const first=m.getState();expect(first.receipt).not.toBeNull();expect(Object.keys(first.receipt!)).toHaveLength(8);expect(getAttemptOutcome(first.progress,first.receipt!.attemptId,first.context).independent).toBe(true);
 m.editWriting('PRIVATE TEXT');expect(m.getState().receipt).toBe(first.receipt);expect(JSON.stringify(m.getState().progress)).not.toContain('PRIVATE');
 m.setPoint(ids[0]!,'0','-8');expect(m.getState().stale).toBe(true);expect(m.getState().receipt).toBeNull();m.submit();expect(m.getState().outcome?.status).toBe('incorrect');
 m.setPoint(ids[0]!,'0','8');m.submit();m.help(3);expect(m.getState().stale).toBe(true);m.submit();expect(m.getState().receipt?.assistance).toBe('solution_viewed');
 m.help(1);m.reset();expect(m.getState().assistance).toBe('solution_viewed');expect(m.getState().answer.points).toEqual([]);expect(m.getState().writing).toBe('');expect(getAttemptOutcome(m.getState().progress,first.receipt!.attemptId,m.getState().context).validity).toBe('context_mismatch');
 const reload=createM1002Learning({resumed:true});reload.setAxis('x',good.xAxis);reload.setAxis('y',good.yAxis);for(const p of good.points)reload.addPoint(p.x,p.y);reload.submit();expect(reload.getState().outcome?.status).toBe('correct');expect(reload.getState().receipt).toBeNull();
});
it('keeps the preimplementation corpus and coordinate contract separate from the frozen M10.01 contract',()=>{
 const coordinate=JSON.parse(readFileSync('contracts/coordinate-decimal-1.0.0.json','utf8'));expect(coordinate.version).toBe('coordinate-decimal/1.0.0');
 const old=JSON.parse(readFileSync('contracts/m1001-numeric-1.0.0.json','utf8'));expect(old.version).toBe('numeric-input/1.0.0');expect(cases.length).toBe(102);
});
