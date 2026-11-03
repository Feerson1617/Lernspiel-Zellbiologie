import './m602-learning.css';
import './m1001-learning.css';
import { M1001_ROWS } from '../content/m1001.ts';
import type { M1001Learning } from '../application/m1001-learning.ts';
import { STATUS_PRESENTATION, ASSISTANCE_LABELS } from './feedback-presentation.ts';
export function mountM1001Learning(root: HTMLElement, model: M1001Learning): void {
  function node<K extends keyof HTMLElementTagNameMap>(tag: K,text='',parent: HTMLElement=root,cls='') {
    const n=document.createElement(tag); n.textContent=text; n.className=cls; parent.append(n); return n;
  }
  function button(text: string,parent: HTMLElement,fn:()=>void) { const b=node('button',text,parent); b.type='button'; b.addEventListener('click',fn); return b; }
  const header=node('header','',root,'site-header'); node('a','Zelllabor 11 · Zur Startseite',header,'brand').href='#/';
  const main=node('main','',root,'learning-page mass-page'); main.lang='de';
  node('p','Übungsvorschau · M10.01',main,'eyebrow'); node('h1','Relative Massenänderung',main).tabIndex=-1;
  node('p','Material verstehen → selbst rechnen → Zahlen überprüfen → Fehler verbessern → biologisch deuten',main,'learning-lead');
  node('h2','1. Material verstehen',main);
  node('p','Fünf ausdrücklich didaktische Datensätze, kein realer Versuch. Die Außenkonzentrationen gelten für einen im betrachteten Zeitfenster nicht permeierenden Stoff.',main);
  node('p','Relative Massenänderung = 100 × (Endmasse − Anfangsmasse) / Anfangsmasse. Die Anfangsmasse ist die Bezugsgröße: Sie entspricht dem Ausgangswert von 100 %.',main);
  const scroll=node('div','',main,'mass-table'); scroll.tabIndex=0; scroll.setAttribute('role','region'); scroll.setAttribute('aria-label','Massentabelle, bei Bedarf seitlich scrollen'); const table=node('table','',scroll); node('caption','Material: Massen vor und nach der Behandlung',table);
  const head=node('tr','',node('thead','',table)); for(const t of ['Ansatz','Außenkonzentration (mol/L)','Anfangsmasse (g)','Endmasse (g)']) node('th',t,head).scope='col';
  const tbody=node('tbody','',table);
  M1001_ROWS.forEach((r,i)=>{ const tr=node('tr','',tbody); node('th',String(i+1),tr).scope='row'; for(const t of [r.concentration,r.initial,r.final]) node('td',t,tr); });
  node('h2','2. Selbst rechnen und überprüfen',main);
  node('p','Gib Prozentwerte ein, zum Beispiel 2,5 oder −2. Ein zusätzliches % ist möglich. Toleranz: einschließlich ±0,05 Prozentpunkte. Eine Dezimalzahl wie 0,08 bleibt 0,08 %; sie wird nicht zu 8 % umgerechnet. Nutze keine Tausendertrennzeichen.',main);
  const form=node('form','',main); const inputs: HTMLInputElement[]=[], feedback: HTMLElement[]=[];
  const initial=model.getState();
  M1001_ROWS.forEach((r,i)=>{
    const field=node('div','',form,'mass-field'); const label=node('label',`Ansatz ${i+1} · ${r.concentration} mol/L · Ergebnis in %`,field); label.htmlFor=`mass-${r.field}`;
    const input=node('input','',field); input.id=label.htmlFor; input.type='text'; input.inputMode='text'; input.autocomplete='off'; input.spellcheck=false; input.value=initial.answers[r.field]??'';
    const unit=node('span',' %',field); unit.setAttribute('aria-hidden','true');
    const output=node('p','',field); output.id=`mass-feedback-${r.field}`; input.setAttribute('aria-describedby',output.id); feedback.push(output); inputs.push(input);
    input.addEventListener('input',()=>{model.edit(r.field,input.value);refresh();});
  });
  const check=node('button','Zahlen überprüfen',form,'learning-primary'); check.type='submit';
  const summary=node('p','',main); summary.setAttribute('role','status'); summary.tabIndex=-1;
  form.addEventListener('submit',event=>{event.preventDefault();model.submit();refresh();summary.focus();});
  const helps=node('section','',main,'learning-helpers'); node('h2','3. Fehler verbessern · Rechenhilfen',helps);
  const helpText=node('div','',helps); helpText.setAttribute('role','status');
  for(const level of [1,2,3] as const) button(level===1?'Hinweis':level===2?'Rechenweg strukturieren':'Vergleichsrechnung ansehen',helps,()=>{
    model.help(level); helpText.replaceChildren();
    if(level===1) node('p','Ziehe zuerst die Anfangsmasse von der Endmasse ab. Zunahme und Abnahme haben unterschiedliche Vorzeichen.',helpText);
    else if(level===2) node('p','Teile die Massendifferenz durch 3,00 g, nicht durch die Endmasse. Multipliziere erst danach mit 100. Die Einheit g kürzt sich im Quotienten.',helpText);
    else M1001_ROWS.forEach((r,i)=>node('p',`Ansatz ${i+1}: 100 × (${r.final} − ${r.initial}) / ${r.initial} = ${Number(r.expected)>0?'+':''}${r.expected.replace('-','−')} %.`,helpText));
    refresh();
  });
  node('h2','4. Ergebnis biologisch deuten',main);
  node('p','Ein positives Ergebnis bedeutet eine Massenzunahme gegenüber dem Ausgangswert, ein negatives eine Massenabnahme. Die Daten können im gegebenen Versuchsrahmen einen Netto-Wasseraustausch stützen. Relative Massenänderungen messen jedoch nicht unmittelbar Vakuolenvolumen, Turgor oder Membranintegrität.',main);
  node('p','Erkläre, warum die Anfangsmasse die Bezugsgröße ist und was eine positive beziehungsweise negative relative Massenänderung bedeutet.',main);
  const label=node('label','Meine Erklärung – nicht automatisch bewertet',main);label.htmlFor='mass-writing';
  const writing=node('textarea','',main);writing.id=label.htmlFor;writing.rows=6;writing.value=initial.writing;writing.addEventListener('input',()=>model.editWriting(writing.value));
  node('h3','Kriterienraster für Selbst-, Partner- oder Lehrkraftprüfung',main);
  const rubric=node('ul','',main);
  for(const text of ['Ich begründe die Anfangsmasse als gemeinsamen Ausgangsbezug und unterscheide relative Änderung und Endmasse.','Ich erkläre positives und negatives Vorzeichen und verwende einen eigenen Zahlenbeleg aus der Tabelle.','Ich trenne Massendaten von Aussagen über Vakuolenvolumen, Turgor und Membranintegrität.']) node('li',text,rubric);
  const support=node('p','',main,'learning-note');
  node('p','Deine Zahlen und Texte bleiben nur in dieser Sitzung. Es gibt keine automatische Übertragung oder dauerhafte Speicherung. Eine grüne Zahlenprüfung bewertet deinen Erklärungstext nicht. Nach Neuladen ist die frühere Hilfenutzung nicht gesichert.',main,'learning-note');
  button('Neue Bearbeitung beginnen',main,()=>{model.reset();inputs.forEach(i=>{i.value='';});writing.value='';helpText.replaceChildren();refresh();inputs[0]?.focus();});
  function refresh() {
    const s=model.getState();
    feedback.forEach((p,i)=>{
      const r=s.results?.[i], row=M1001_ROWS[i]!;
      const status=s.stale?'empty':r?.status??'empty', display=STATUS_PRESENTATION[status];
      p.dataset['status']=s.stale?'stale':status;p.dataset['color']=display.color;
      p.textContent=s.stale?'○ Eingabe oder Hilfe geändert. Erneut prüfen.':`${display.symbol} ${display.label}. `+(!r||r.reason==='empty'?'Trage deine eigene Rechnung ein.':r.reason==='format'?'Bitte eine eindeutige Dezimalzahl ohne weitere Aussagen eingeben.':r.reason==='unit'?'Hier wird die relative Änderung in Prozent verlangt; Gramm und Prozentpunkte sind andere Größen.':r.reason==='value'?`Der Wert liegt außerhalb der Toleranz für 100 × (${row.final} − ${row.initial}) / ${row.initial}. Prüfe Vorzeichen, Anfangsmasse als Nenner und den Faktor 100.`:'Der Prozentwert stimmt innerhalb von ±0,05 Prozentpunkten.');
    });
    summary.textContent=s.stale?'Rückmeldung nicht mehr aktuell. Zahlen erneut überprüfen.':s.results?`${s.results.filter(r=>r.status==='correct').length} von 5 Zahlen stimmen. Eigene Erklärung nicht bewertet.`:'Noch keine Zahlen geprüft.';
    support.textContent=`${s.assistance==='independent' && !s.results ? 'Bisher keine digitale Hilfe aufgerufen' : ASSISTANCE_LABELS[s.assistance]}. ${s.historyUnverified?'Frühere Hilfehistorie ungesichert; kein aktueller Erfolgsbeleg.':s.receipt?'Aktueller Sitzungsbeleg für die fünf Zahlen.':'Kein aktueller Erfolgsbeleg.'} Hilfen bleiben auch nach einer neuen Bearbeitung erfasst.`;
  }
  refresh();
}
