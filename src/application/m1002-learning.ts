import { createM1002Context, M1002_VERSIONS, validateM1002Context } from '../content/m1002.ts';
import { assessDiagram } from '../assessment/diagram.ts';
import type { DiagramAnswer, DiagramAxis } from '../assessment/diagram.ts';
import { createContextBinding } from '../domain/task-context.ts';
import { createAttemptRecord, appendAttempt, parseProgress } from '../domain/progress.ts';
import type { Assistance } from '../domain/contracts.ts';
const emptyAnswer=():DiagramAnswer=>({xAxis:{quantity:'',unit:'',ticks:['','','']},yAxis:{quantity:'',unit:'',ticks:['','','']},points:[]});
function freezeAnswer(a:DiagramAnswer):DiagramAnswer {
  const axis=(v:DiagramAxis)=>Object.freeze({...v,ticks:Object.freeze([...v.ticks]) as readonly [string,string,string]});
  return Object.freeze({xAxis:axis(a.xAxis),yAxis:axis(a.yAxis),points:Object.freeze(a.points.map(p=>Object.freeze({...p})))});
}
export function createM1002Learning(options:{resumed?:boolean}={}) {
  let context=createM1002Context(crypto.randomUUID()),answer=freezeAnswer(emptyAnswer()),revision=0,checked=-1,sequence=0,writing='';
  let assistance:Assistance='independent',outcome:ReturnType<typeof assessDiagram>|null=null,receipt:ReturnType<typeof createAttemptRecord>|null=null;
  let progress=parseProgress({schemaVersion:1,contentVersion:M1002_VERSIONS.contentVersion,attempts:[]});
  const navigation=globalThis.performance?.getEntriesByType('navigation')[0] as PerformanceNavigationTiming|undefined;
  const historyUnverified=options.resumed??(navigation!==undefined&&navigation.type!=='navigate');
  const invalidate=()=>{revision++;receipt=null;};
  function replace(a:DiagramAnswer){answer=freezeAnswer(a);invalidate();}
  return Object.freeze({
    setAxis(dimension:'x'|'y',change:Partial<DiagramAxis>){const key=dimension==='x'?'xAxis':'yAxis';replace({...answer,[key]:{...answer[key],...change}});},
    addPoint(x='',y=''){if(answer.points.length>=20)throw new Error('At most 20 editable points.');const id=`point-${++sequence}`;replace({...answer,points:[...answer.points,{id,x,y}]});return id;},
    setPoint(id:string,x:string,y:string){if(!answer.points.some(p=>p.id===id))throw new Error('Unknown point.');replace({...answer,points:answer.points.map(p=>p.id===id?{id,x,y}:p)});},
    removePoint(id:string){replace({...answer,points:answer.points.filter(p=>p.id!==id)});},
    editWriting(value:string){writing=value;},
    help(level:1|2|3){if(![1,2,3].includes(level))throw new Error('Unknown help.');assistance=level===3||assistance==='solution_viewed'?'solution_viewed':'hint';invalidate();},
    reset(){context=createM1002Context(crypto.randomUUID());answer=freezeAnswer(emptyAnswer());writing='';outcome=null;invalidate();},
    submit(){validateM1002Context(context);if(checked===revision&&outcome)return outcome;outcome=assessDiagram(answer);checked=revision;
      if(outcome.status==='correct'&&!historyUnverified){receipt=createAttemptRecord(crypto.randomUUID(),{...createContextBinding(context),status:'correct',assistance},context);progress=appendAttempt(progress,receipt);}return outcome;},
    getState:()=>Object.freeze({context,answer,revision,writing,assistance,historyUnverified,outcome,stale:outcome!==null&&revision!==checked,receipt,progress}),
  });
}
export type M1002Learning=ReturnType<typeof createM1002Learning>;
