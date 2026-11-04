import './m602-learning.css';
import './m1002-learning.css';
import { M1002_POINTS } from '../content/m1002.ts';
import type { DiagramAnswer, DiagramAxis, Decision } from '../assessment/diagram.ts';
import type { M1002Learning } from '../application/m1002-learning.ts';
import { STATUS_PRESENTATION, ASSISTANCE_LABELS } from './feedback-presentation.ts';
import { drawM1002Plot, pointerCoordinates, disposeM1002Plot } from './m1002-plot.ts';
const quantities=[['concentration','Außenkonzentration'],['mass_change','Relative Massenänderung'],['final_mass','Endmasse'],['temperature','Temperatur']] as const;
const units=['mol/L','mmol/L','%','g','Prozentpunkte'];
const NS='http://www.w3.org/2000/svg';
export function mountM1002Learning(root:HTMLElement,model:M1002Learning) {
  function node<K extends keyof HTMLElementTagNameMap>(tag:K,text='',parent:HTMLElement=root,cls='') {const n=document.createElement(tag);n.textContent=text;n.className=cls;parent.append(n);return n;}
  function button(text:string,parent:HTMLElement,fn:()=>void){const n=node('button',text,parent);n.type='button';n.addEventListener('click',fn);return n;}
  function label(text:string,id:string,parent:HTMLElement){const l=node('label',text,parent);l.htmlFor=id;}
  function choice(text:string,id:string,options:readonly (readonly [string,string])[],parent:HTMLElement,change:(value:string)=>void) {
    const group=node('fieldset','',parent,'axis-choice');group.id=id;node('legend',text,group);
    const radios=options.map(([value,caption],i)=>{
      const l=node('label','',group),r=node('input','',l);r.type='radio';r.name=id;r.id=`${id}-${i}`;r.value=value;node('span',caption,l);
      r.addEventListener('change',()=>{if(r.checked){change(r.value);refresh();}});return r;
    });
    return {setValue:(value:string)=>{for(const r of radios)r.checked=r.value===value;},focus:()=>radios[0]!.focus()};
  }
  function input(text:string,id:string,parent:HTMLElement,oninput:(value:string)=>void){label(text,id,parent);const i=node('input','',parent);i.id=id;i.type='text';i.autocomplete='off';i.spellcheck=false;i.addEventListener('input',()=>{oninput(i.value);refresh();});return i;}
  function present(p:HTMLElement,d:Decision){const v=STATUS_PRESENTATION[d.status];p.dataset['status']=d.status;p.dataset['color']=v.color;p.textContent=`${v.symbol} ${v.label}. ${d.message}`;}
  const header=node('header','',root,'site-header');node('a','Zelllabor 11 · Zur Startseite',header,'brand').href='#/';
  const main=node('main','',root,'learning-page diagram-page');main.lang='de';
  node('p','Übungsvorschau · M10.02',main,'eyebrow');node('h1','Ein Diagramm selbst erstellen',main).tabIndex=-1;
  node('p','Material lesen → Achsen und Skalen festlegen → fünf Punkte eintragen → prüfen und verbessern → Daten beschreiben',main,'learning-lead');
  node('h2','1. Material verstehen',main);
  node('p','Diese fünf Datensätze sind ausdrücklich konstruiert, keine realen Messungen. Stelle die relative Massenänderung gegen die Außenkonzentration dar.',main);
  const table=node('table','',node('div','',main,'material-table'));node('caption','Didaktische Daten',table);
  const tr=node('tr','',node('thead','',table));for(const t of ['Außenkonzentration (mol/L)','Relative Massenänderung (%)'])node('th',t,tr).scope='col';
  const tb=node('tbody','',table);for(const p of M1002_POINTS){const row=node('tr','',tb);node('td',p.x.replace('.',','),row);node('td',p.y.replace('-','−'),row);}
  node('h2','2. Achsen und lineare Skalen festlegen',main);
  node('p','Wähle Größen und Einheiten selbst. Beschrifte je Achse drei gleich weit auseinanderliegende Marken. Gleiche Abstände brauchen gleiche Zahlenschritte. Die Skala muss null und alle Datenwerte einschließen. Klar beschriftete umgekehrte Richtungen sind ebenso zulässig.',main);
  const axisGrid=node('div','',main,'axis-grid');
  const axisControls={} as Record<'x'|'y',{quantity:ReturnType<typeof choice>;unit:ReturnType<typeof choice>;ticks:HTMLInputElement[];feedback:HTMLElement}>;
  for(const dimension of ['x','y'] as const) {
    const box=node('fieldset','',axisGrid);node('legend',`${dimension}-Achse`,box);
    const quantity=choice(`${dimension}-Achse · Größe`,`diagram-${dimension}-quantity`,quantities,box,v=>model.setAxis(dimension,{quantity:v}));
    const unit=choice(`${dimension}-Achse · Einheit`,`diagram-${dimension}-unit`,units.map(u=>[u,u] as const),box,v=>model.setAxis(dimension,{unit:v}));
    const tickGrid=node('div','',box,'tick-grid');
    const ticks=(dimension==='x'?['links','Mitte','rechts']:['unten','Mitte','oben']).map((name,i)=>{
      const holder=node('div','',tickGrid);
      return input(`${dimension}-Achse · ${name}`,`diagram-${dimension}-tick-${i}`,holder,v=>{
        const values=[...model.getState().answer[dimension==='x'?'xAxis':'yAxis'].ticks] as [string,string,string];values[i]=v;model.setAxis(dimension,{ticks:values});
      });
    });
    const feedback=node('div','',box);feedback.id=`diagram-${dimension}-feedback`;axisControls[dimension]={quantity,unit,ticks,feedback};
  }
  node('h2','3. Fünf eigene Punkte eintragen',main);
  node('p','Beide Wege bearbeiten dieselben Punkte: Klick/Tipp in das Diagramm oder vollständige Zahleneingabe. Für einen neuen Punkt tippe auf seine Position. Zum Versetzen wähle zuerst „Im Diagramm bearbeiten“ an der betreffenden Zeile. Ziehen ist nicht nötig.',main);
  node('p','Beim Tippen werden x-Koordinaten auf 0,001 mol/L und y-Koordinaten auf 0,1 Prozentpunkte gerundet, ohne Einrasten an Musterpunkten. Die Prüfung toleriert einschließlich ±0,005 mol/L und ±0,2 Prozentpunkte. Auch 0,095 und 0,105 sind als x-Werte zulässig. Keine Tausendertrennzeichen verwenden.',main);
  const mode=node('p','',main);mode.setAttribute('role','status');let selectedId:string|null=null;
  button('Neuen Punkt per Tipp setzen',main,()=>{selectedId=null;refresh();});
  const figure=node('figure','',main);figure.id='diagram-figure';
  const yLabel=node('p','',figure,'plot-axis-label');yLabel.id='diagram-y-label';
  const scroll=node('div','',figure,'plot-scroll');scroll.tabIndex=0;scroll.setAttribute('role','region');scroll.setAttribute('aria-label','Diagramm, bei Bedarf seitlich scrollen');
  scroll.addEventListener('keydown',e=>{if(e.target===scroll&&(e.key==='ArrowLeft'||e.key==='ArrowRight')){e.preventDefault();scroll.scrollLeft+=e.key==='ArrowRight'?64:-64;}});
  const svg=document.createElementNS(NS,'svg');svg.setAttribute('role','img');svg.setAttribute('aria-label','Mein Diagramm');svg.setAttribute('aria-describedby','diagram-y-label diagram-x-label');scroll.append(svg);
  const xLabel=node('p','',figure,'plot-axis-label');xLabel.id='diagram-x-label';const plotNote=node('p','',main);
  svg.addEventListener('click',e=>{
    const s=model.getState();const pair=pointerCoordinates(svg,s.answer,e.clientX,e.clientY);if(!pair)return;
    if(selectedId)model.setPoint(selectedId,pair[0],pair[1]);else if(s.answer.points.length<20)model.addPoint(pair[0],pair[1]);
    renderRows();refresh();
  });
  const rows=node('div','',main);let outputs:HTMLElement[]=[];
  const add=button('Koordinatenzeile hinzufügen',main,()=>{const id=model.addPoint();renderRows();refresh();document.getElementById(`${id}-x`)?.focus();});
  node('p','Jede Zeile gehört zu einem selbst eingetragenen Punkt. Zusätzliche oder doppelte Punkte müssen entfernt oder korrigiert werden. Höchstens 20 Zeilen können bearbeitet werden.',main);
  function renderRows(){rows.replaceChildren();outputs=[];const s=model.getState();
    s.answer.points.forEach((p,i)=>{
      const box=node('fieldset','',rows);box.dataset['pointId']=p.id;node('legend',`Punkt ${i+1}`,box);const fields=node('div','',box,'point-grid');
      let xi:HTMLInputElement,yi:HTMLInputElement;
      xi=input(`Punkt ${i+1} · x (mol/L)`,`${p.id}-x`,node('div','',fields),v=>model.setPoint(p.id,v,yi.value));
      yi=input(`Punkt ${i+1} · y (%)`,`${p.id}-y`,node('div','',fields),v=>model.setPoint(p.id,xi.value,v));xi.value=p.x;yi.value=p.y;
      button(`Punkt ${i+1} im Diagramm bearbeiten`,box,()=>{selectedId=p.id;refresh();scroll.focus();});
      button(`Punkt ${i+1} entfernen`,box,()=>{model.removePoint(p.id);if(selectedId===p.id)selectedId=null;renderRows();refresh();add.focus();});
      const feedback=node('p','',box);feedback.id=`${p.id}-feedback`;xi.setAttribute('aria-describedby',feedback.id);yi.setAttribute('aria-describedby',feedback.id);outputs.push(feedback);
    });
  }
  const check=button('Diagramm überprüfen',main,()=>{model.submit();refresh();summary.focus();});check.className='learning-primary';
  const summary=node('p','',main);summary.id='diagram-summary';summary.setAttribute('role','status');summary.tabIndex=-1;
  const pointsFeedback=node('p','',main);pointsFeedback.id='diagram-points-feedback';
  node('h2','4. Verbessern und vergleichen',main);const help=node('section','',main);help.setAttribute('aria-label','Rechen- und Zeichenhilfen');
  for(const level of [1,2,3] as const)button(level===1?'Hinweis':level===2?'Skalierung erklären':'Vergleichsdiagramm ansehen',help,()=>{
    model.help(level);clearHelpContent();
    if(level===1)node('p','Die Außenkonzentration ist die x-Größe. Die relative Massenänderung gehört auf die y-Achse. Prüfe zu jeder Größe die Einheit im Material.',helpContent);
    else if(level===2)node('p','Die mittlere Marke muss genau den Zahlenmittelwert der beiden äußeren Marken tragen. Null und die kleinsten und größten Materialwerte müssen zwischen den Endmarken liegen. Die Werte dürfen auch gleichmäßig abnehmen.',helpContent);
    else {
      node('p','Vergleich: x = Außenkonzentration (mol/L), Marken 0 / 0,2 / 0,4; y = relative Massenänderung (%), Marken −10 / 0 / 10. Diese Darstellung wird nicht in deine Antwort übernommen.',helpContent);
      const comparison:DiagramAnswer={xAxis:{quantity:'concentration',unit:'mol/L',ticks:['0','0.2','0.4']},yAxis:{quantity:'mass_change',unit:'%',ticks:['-10','0','10']},points:M1002_POINTS.map((p,i)=>({id:`solution-${i}`,...p}))};
      const pane=node('div','',helpContent,'plot-scroll');pane.tabIndex=0;pane.setAttribute('role','region');pane.setAttribute('aria-label','Vergleichsdiagramm seitlich scrollen');
      pane.addEventListener('keydown',e=>{if(e.target===pane&&(e.key==='ArrowLeft'||e.key==='ArrowRight')){e.preventDefault();pane.scrollLeft+=e.key==='ArrowRight'?64:-64;}});
      const drawing=document.createElementNS(NS,'svg');drawing.setAttribute('role','img');drawing.setAttribute('aria-label','Ausdrücklich geöffnetes Vergleichsdiagramm');pane.append(drawing);drawM1002Plot(drawing,comparison);
      node('p','Punkte: (0; +8), (0,10; +3), (0,20; −1), (0,30; −5), (0,40; −8). x in mol/L, y in %. Andere geeignete lineare Skalen sind ebenfalls richtig.',helpContent);
    }
    refresh();
  });
  const helpContent=node('div','',help);helpContent.setAttribute('role','status');
  function clearHelpContent(){for(const svg of helpContent.querySelectorAll('svg'))disposeM1002Plot(svg);helpContent.replaceChildren();}
  node('h2','5. Daten beschreiben und Grenzen erklären',main);
  node('p','Beschreibe die dargestellten Veränderungen mit mindestens zwei Zahlenbelegen und erkläre, welche Aussagen sich aus dem Diagramm allein nicht sicher ableiten lassen.',main);
  label('Meine Erklärung – nicht automatisch bewertet','diagram-writing',main);const writing=node('textarea','',main);writing.id='diagram-writing';writing.rows=6;writing.addEventListener('input',()=>model.editWriting(writing.value));
  const rubric=node('ul','',main);for(const text of ['Ich beschreibe die Daten fachlich richtig.','Ich verwende mindestens zwei passende Zahlenbelege.','Ich benenne die Größen und Einheiten präzise.','Ich trenne den Datenbefund von einer biologischen Erklärung.','Ich begründe Schlussfolgerungsgrenzen: kein allgemeines lineares Gesetz, keine exakt bestimmte innere Zellkonzentration und keine unmittelbare Messung von Vakuolenvolumen, Turgor oder Membranintegrität.'])node('li',text,rubric);
  node('p','Die Punkte werden nicht durch eine Musterkurve verbunden. Das Diagramm belegt weder zusätzliche Messwerte zwischen den Punkten noch ein allgemeines biologisches Gesetz. Ein grünes Diagramm bestätigt nur die geprüfte Diagrammleistung, nicht deinen Erklärungstext.',main);
  const support=node('p','',main,'learning-note');support.id='diagram-support';node('p','Koordinaten und Texte bleiben nur in dieser Sitzung. Es gibt keine dauerhafte Rohantwortspeicherung und keine automatische Übertragung. Nach Neuladen ist die frühere Hilfehistorie ungesichert.',main,'learning-note');
  button('Neue Bearbeitung beginnen',main,()=>{model.reset();selectedId=null;clearHelpContent();syncInputs();renderRows();refresh();axisControls.x.quantity.focus();});
  function syncInputs(){const s=model.getState();for(const dim of ['x','y'] as const){const a=s.answer[dim==='x'?'xAxis':'yAxis'],c=axisControls[dim];c.quantity.setValue(a.quantity);c.unit.setValue(a.unit);c.ticks.forEach((t,i)=>{t.value=a.ticks[i]!;});}writing.value=s.writing;}
  function axisLabel(a:DiagramAxis){return `${quantities.find(q=>q[0]===a.quantity)?.[1]??'Größe noch offen'} (${a.unit||'Einheit noch offen'})`;}
  function refresh(){const s=model.getState(),r=s.outcome,stale=s.stale;
    xLabel.textContent=`x-Achse: ${axisLabel(s.answer.xAxis)}`;yLabel.textContent=`y-Achse: ${axisLabel(s.answer.yAxis)}`;
    const plot=drawM1002Plot(svg,s.answer);plotNote.textContent=plot.ready?`${s.answer.points.length-plot.undrawn} Punkte gezeichnet.${plot.undrawn?` ${plot.undrawn} Punkte sind wegen fehlender/unklarer Koordinaten oder ihrer Lage außerhalb der Zeichenfläche nicht sichtbar; sie bleiben unten bearbeitbar und werden vollständig geprüft.`:''}`:'Für das Setzen per Tipp werden zwei gültige lineare Skalen benötigt. Deine Koordinateneingaben bleiben erhalten.';
    mode.textContent=selectedId?`Nächster Tipp versetzt Punkt ${s.answer.points.findIndex(p=>p.id===selectedId)+1}.`:'Nächster Tipp setzt einen neuen Punkt.';
    add.disabled=s.answer.points.length>=20;
    for(const dim of ['x','y'] as const){const box=axisControls[dim].feedback;box.replaceChildren();const axis=r?.axes?.[dim];if(!axis||stale)node('p',stale?'○ Antwort oder Hilfe geändert. Erneut prüfen.':'○ Noch nicht geprüft.',box);else for(const key of ['quantity','unit','scale'] as const)present(node('p','',box),axis[key]);}
    outputs.forEach((p,i)=>{if(r?.points[i]&&!stale)present(p,r.points[i]!);else{p.dataset['status']=stale?'stale':'empty';p.dataset['color']='neutral';p.textContent=stale?'○ Antwort oder Hilfe geändert. Erneut prüfen.':'○ Noch nicht geprüft.';}});
    if(r&&!stale){present(summary,{status:r.status,message:'Geprüft sind Achsen, Skalen und die fünf Datenpunkte. Eigene Erklärung nicht bewertet.'});present(pointsFeedback,r.criteria[2]!);}else{summary.dataset['status']=stale?'stale':'empty';summary.removeAttribute('data-color');summary.textContent=stale?'○ Rückmeldung nicht mehr aktuell. Diagramm erneut überprüfen.':'○ Noch kein Diagramm geprüft.';pointsFeedback.textContent='';pointsFeedback.removeAttribute('data-color');}
    support.textContent=`${s.assistance==='independent'&&!s.receipt?'Bisher keine digitale Hilfe aufgerufen':ASSISTANCE_LABELS[s.assistance]}. ${s.historyUnverified?'Frühere Hilfehistorie ungesichert; kein aktueller Erfolgsbeleg.':s.receipt?'Aktueller Sitzungsbeleg für die Diagrammleistung.':'Kein aktueller Erfolgsbeleg.'} Hilfen bleiben nach neuer Bearbeitung erfasst.`;
  }
  syncInputs();renderRows();refresh();
}
