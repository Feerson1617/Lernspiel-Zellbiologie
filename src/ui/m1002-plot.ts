import { coordinateNumber, scaleNumbers } from '../assessment/diagram.ts';
import type { DiagramAnswer } from '../assessment/diagram.ts';
export const PLOT = Object.freeze({left:90,top:40,width:520,height:320,viewWidth:720,viewHeight:430});
const NS='http://www.w3.org/2000/svg';
export function drawM1002Plot(svg:SVGSVGElement, answer:DiagramAnswer): {ready:boolean;undrawn:number} {
  svg.replaceChildren();svg.setAttribute('viewBox',`0 0 ${PLOT.viewWidth} ${PLOT.viewHeight}`);
  const title=document.createElementNS(NS,'title');title.textContent='Eigene Diagrammdarstellung. Koordinaten können auch vollständig in den Zahlenfeldern bearbeitet werden.';svg.append(title);
  function el(tag:string,attrs:Record<string,string|number>,text='') {
    const n=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,String(v));n.textContent=text;svg.append(n);return n;
  }
  const xs=scaleNumbers(answer.xAxis,'x'),ys=scaleNumbers(answer.yAxis,'y');
  el('rect',{x:PLOT.left,y:PLOT.top,width:PLOT.width,height:PLOT.height,fill:'#fff',stroke:'#647d77','stroke-width':2});
  for(let i=0;i<3;i++){
    const x=PLOT.left+PLOT.width*i/2,y=PLOT.top+PLOT.height*(1-i/2);
    el('line',{x1:x,x2:x,y1:PLOT.top,y2:PLOT.top+PLOT.height,stroke:'#d5dfda'});
    el('line',{x1:PLOT.left,x2:PLOT.left+PLOT.width,y1:y,y2:y,stroke:'#d5dfda'});
    el('text',{x,y:PLOT.top+PLOT.height+35,'text-anchor':'middle'},answer.xAxis.ticks[i]||'?');
    el('text',{x:PLOT.left-12,y:y+6,'text-anchor':'end'},answer.yAxis.ticks[i]||'?');
  }
  if(!xs||!ys)return {ready:false,undrawn:answer.points.length};
  let undrawn=0;
  answer.points.forEach((p,i)=>{
    const x=coordinateNumber(p.x,'mol_per_litre'),y=coordinateNumber(p.y,'percent');
    if(x===null||y===null){undrawn++;return;}
    const px=PLOT.left+(x-xs[0])/(xs[2]-xs[0])*PLOT.width,py=PLOT.top+(1-(y-ys[0])/(ys[2]-ys[0]))*PLOT.height;
    if(px<10||px>PLOT.viewWidth-10||py<10||py>PLOT.viewHeight-10){undrawn++;return;}
    const circle=el('circle',{cx:px,cy:py,r:6,fill:'#245e54',stroke:'#fff','stroke-width':2,'data-point-id':p.id});
    const tip=document.createElementNS(NS,'title');tip.textContent=`Punkt ${i+1}: ${p.x} mol/L; ${p.y} %`;circle.append(tip);
    el('text',{x:px+9,y:py-9,'class':'point-number'},String(i+1));
  });
  return {ready:true,undrawn};
}
/** Pointer coordinates are rounded only for editing; no reference-data snapping. */
export function pointerCoordinates(svg:SVGSVGElement,answer:DiagramAnswer,clientX:number,clientY:number):readonly [string,string]|null {
  const xs=scaleNumbers(answer.xAxis,'x'),ys=scaleNumbers(answer.yAxis,'y'),matrix=svg.getScreenCTM();
  if(!xs||!ys||!matrix)return null;
  const p=new DOMPoint(clientX,clientY).matrixTransform(matrix.inverse());
  // Include the one-unit half-width of the visible frame stroke. This is a
  // pointer hit area, not an assessment tolerance or reference-point snap.
  if(p.x<PLOT.left-1||p.x>PLOT.left+PLOT.width+1||p.y<PLOT.top-1||p.y>PLOT.top+PLOT.height+1)return null;
  const fx=Math.max(0,Math.min(1,(p.x-PLOT.left)/PLOT.width)),fy=Math.max(0,Math.min(1,1-(p.y-PLOT.top)/PLOT.height));
  const x=(xs[0]+fx*(xs[2]-xs[0])).toFixed(3);
  return [/^[+-]?0\./.test(x)?x:x+'0',(ys[0]+fy*(ys[2]-ys[0])).toFixed(1)];
}
