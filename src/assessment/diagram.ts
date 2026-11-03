import type { Status } from '../domain/contracts.ts';
import { snapshotContextData, readDataRecord } from '../domain/context-data.ts';
import { compareDecimal, decimal, subtractDecimal, interpretNumeric, evaluateNumeric, numericFormatMessage } from './numeric.ts';
import type { NumericUnit } from './numeric.ts';
import { M1002_POINTS } from '../content/m1002.ts';
export interface DiagramAxis { readonly quantity: string; readonly unit: string; readonly ticks: readonly [string,string,string] }
export interface DiagramPoint { readonly id: string; readonly x: string; readonly y: string }
export interface DiagramAnswer { readonly xAxis: DiagramAxis; readonly yAxis: DiagramAxis; readonly points: readonly DiagramPoint[] }
export interface Decision { readonly status: Status; readonly message: string }
const grammar = 'coordinate-decimal/1.0.0' as const;
const result = (status: Status,message: string): Decision=>Object.freeze({status,message});
export function combineStatuses(statuses: readonly Status[]): Status {
  if(statuses.every(s=>s==='empty'))return 'empty';
  for(const s of ['incorrect','technical','clarify'] as const)if(statuses.includes(s))return s;
  return statuses.every(s=>s==='correct')?'correct':'partial';
}
function coordinate(input: string, unit: NumericUnit) {
  const p=interpretNumeric(input,grammar);
  if(p.kind==='empty')return {parsed:p,decision:result('empty','Ergänze den Zahlenwert.')} as const;
  if(p.kind==='clarify')return {parsed:p,decision:result('clarify',numericFormatMessage(input,grammar))} as const;
  if(p.unit!==null && p.unit!==unit)return {parsed:p,decision:result('incorrect',`Hier wird ${unit==='mol_per_litre'?'mol/L':'%'} benötigt; die angegebene Einheit passt nicht.`)} as const;
  return {parsed:p,decision:result('correct','Zahlenformat und Einheit sind eindeutig.')} as const;
}
export function checkScale(axis: DiagramAxis, dimension: 'x'|'y'): Decision {
  const parts=axis.ticks.map(t=>coordinate(t,dimension==='x'?'mol_per_litre':'percent'));
  const status=combineStatuses(parts.map(p=>p.decision.status));
  if(status!=='correct')return result(status,status==='empty'||status==='partial'?'Beschrifte alle drei gleich weit auseinanderliegenden Achsenmarken.':parts.find(p=>p.decision.status===status)!.decision.message);
  const v=parts.map(p=>p.parsed.kind==='number'?p.parsed.value:decimal('0'));
  const [a,b,c]=v as [typeof v[number],typeof v[number],typeof v[number]];
  if(compareDecimal(a,c)===0 || compareDecimal(subtractDecimal(b,a),subtractDecimal(c,b))!==0)return result('incorrect','Gleiche Zeichenabstände müssen gleiche, von null verschiedene Zahlenschritte darstellen. Prüfe die drei Marken.');
  const min=compareDecimal(a,c)<0?a:c,max=compareDecimal(a,c)<0?c:a;
  if(compareDecimal(min,decimal(dimension==='x'?'0':'-8'))>0 || compareDecimal(max,decimal(dimension==='x'?'0.4':'8'))<0)return result('incorrect',`Die Skala muss null und alle Datenwerte einschließen: ${dimension==='x'?'0 bis 0,40 mol/L':'−8 bis +8 %'}.`);
  return result('correct',`Lineare Skala mit vollständigem Wertebereich; ${compareDecimal(a,c)<0?'zunehmende':'ausdrücklich beschriftete abnehmende'} Richtung ist zulässig.`);
}
export function checkAxis(axis: DiagramAxis, dimension: 'x'|'y') {
  const expected=dimension==='x'?'concentration':'mass_change',unit=dimension==='x'?'mol/L':'%';
  const quantity=result(!axis.quantity?'empty':axis.quantity===expected?'correct':['concentration','mass_change','final_mass','temperature'].includes(axis.quantity)?'incorrect':'clarify',`Die ${dimension}-Achse stellt ${dimension==='x'?'die Außenkonzentration':'die relative Massenänderung'} dar.`);
  const units=result(!axis.unit?'empty':axis.unit===unit?'correct':['mol/L','mmol/L','%','g','Prozentpunkte'].includes(axis.unit)?'incorrect':'clarify',`Die zugehörige Einheit ist ${unit}.`);
  const scale=checkScale(axis,dimension);
  return Object.freeze({quantity,unit:units,scale,status:combineStatuses([quantity.status,units.status,scale.status])});
}
/** Drawing conversion only; the assessor above compares exact rational values. */
export function coordinateNumber(input: string, unit: NumericUnit): number|null {
  const p=coordinate(input,unit);
  return p.decision.status==='correct' && p.parsed.kind==='number'?Number(p.parsed.value.numerator)/Number(p.parsed.value.denominator):null;
}
export function scaleNumbers(axis: DiagramAxis,dimension:'x'|'y'): readonly [number,number,number]|null {
  return checkScale(axis,dimension).status==='correct'?axis.ticks.map(t=>coordinateNumber(t,dimension==='x'?'mol_per_litre':'percent')!) as [number,number,number]:null;
}
function parseAnswer(input: unknown): DiagramAnswer|null {
  try {
    const a=snapshotContextData(input).value;
    if(Object.keys(a).sort().join()!=='points,xAxis,yAxis')return null;
    for(const key of ['xAxis','yAxis']) {
      const v=readDataRecord(a[key]);
      if(Object.keys(v).sort().join()!=='quantity,ticks,unit'||typeof v['quantity']!=='string'||typeof v['unit']!=='string'||!Array.isArray(v['ticks'])||v['ticks'].length!==3||!v['ticks'].every(t=>typeof t==='string'))return null;
    }
    if(!Array.isArray(a['points']))return null;
    const ids=new Set<string>();
    for(const p of a['points']) {
      if(!p||typeof p!=='object'||Array.isArray(p)||Object.keys(p).sort().join()!=='id,x,y'||typeof p['id']!=='string'||!p['id']||typeof p['x']!=='string'||typeof p['y']!=='string'||ids.has(p['id']))return null;
      ids.add(p['id']);
    }
    return a as unknown as DiagramAnswer;
  }catch{return null;}
}
export function assessDiagram(input: unknown) {
  const answer=parseAnswer(input);
  if(!answer) {
    const d=result('clarify','Die Antwortstruktur enthält unbekannte oder widersprüchliche Angaben.');
    return Object.freeze({status:d.status,axes:null,points:[],criteria:[1,2,3].map(i=>({...d,id:`M10.02.C0${i}`}))});
  }
  const x=checkAxis(answer.xAxis,'x'), y=checkAxis(answer.yAxis,'y');
  const points=answer.points.map(p=>{
    const px=coordinate(p.x,'mol_per_litre'),py=coordinate(p.y,'percent');
    const status=combineStatuses([px.decision.status,py.decision.status]);
    if(status!=='correct')return {...result(status==='empty'?'partial':status,status==='empty'||status==='partial'?'Ergänze beide Koordinaten dieses Punktes.':(px.decision.status===status?px:py).decision.message),row:-1};
    const row=M1002_POINTS.findIndex(r=>evaluateNumeric(p.x,{expected:r.x,tolerance:'0.005',unit:'mol_per_litre',grammar}).status==='correct' && evaluateNumeric(p.y,{expected:r.y,tolerance:'0.2',unit:'percent',grammar}).status==='correct');
    return {...result(row<0?'incorrect':'correct',row<0?'Dieses Koordinatenpaar stimmt mit keinem Materialpaar innerhalb ±0,005 mol/L und ±0,2 Prozentpunkten überein. Vergleiche beide Werte gemeinsam.':`Materialpaar ${row+1} ist innerhalb der Toleranzen richtig eingetragen.`),row};
  });
  for(const p of points)if(p.row>=0 && points.filter(q=>q.row===p.row).length>1)Object.assign(p,result('incorrect',`Materialpaar ${p.row+1} wurde mehrfach eingetragen. Entferne das Duplikat oder korrigiere seine Koordinaten.`));
  let ps=combineStatuses(points.map(p=>p.status));
  if(answer.points.length>5)ps='incorrect';
  else if(answer.points.length<5 && ps==='correct')ps='partial';
  const pointDecision=result(ps,answer.points.length>5?'Es gibt mehr als fünf Punkte. Das Material enthält genau fünf Paare; zusätzliche Werte sind nicht belegt.':`Eingetragen: ${answer.points.length} von 5 Punkten. Jeder Materialpunkt muss genau einmal vorkommen.`);
  const criteria=Object.freeze([{id:'M10.02.C01',status:x.status,message:'x-Achse: Größe, Einheit und lineare Skalierung.'},{id:'M10.02.C02',status:y.status,message:'y-Achse: Größe, Einheit und lineare Skalierung.'},{id:'M10.02.C03',...pointDecision}]);
  return Object.freeze({status:combineStatuses(criteria.map(c=>c.status)),axes:Object.freeze({x,y}),points:Object.freeze(points.map(p=>Object.freeze(p))),criteria});
}
export type DiagramOutcome = ReturnType<typeof assessDiagram>;
