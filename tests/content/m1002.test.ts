import {it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {M1002_POINTS} from '../../src/content/m1002.ts';
import {assessDiagram} from '../../src/assessment/diagram.ts';
import cases from '../fixtures/m1002-diagram-cases.json';
it('preserves the public diagram data, tolerances and three original criteria',()=>{
 const task=JSON.parse(readFileSync('spec/tasks.json','utf8')).tasks.find((t:{id:string})=>t.id==='M10.02');
 expect(M1002_POINTS.map(p=>[Number(p.x),Number(p.y)])).toEqual([[0,8],[.1,3],[.2,-1],[.3,-5],[.4,-8]]);
 expect(task.expected.points).toEqual(M1002_POINTS.map(p=>[Number(p.x),Number(p.y)]));expect(task.expected.point_tolerance).toEqual({x:.005,y:.2});
 expect(assessDiagram(cases[0]!.answer).criteria.map(c=>c.id)).toEqual(task.criteria.map((c:{id:string})=>c.id));
});
