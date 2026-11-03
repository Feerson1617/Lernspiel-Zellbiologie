import { test,expect } from '@playwright/test';
import type { Page } from '@playwright/test';
const pairs=[['0','8'],['0.100','3'],['0.2','-1'],['0.3','-5'],['0.4','-8']];
async function axes(page:Page,reverse=false,native=false){
 for(const [id,value,steps] of [['x-quantity','concentration',1],['x-unit','mol/L',1],['y-quantity','mass_change',2],['y-unit','%',3]] as const){
  const s=page.locator(`#diagram-${id}`);
  if(native){await s.focus();await page.keyboard.press('Space');for(let i=0;i<steps;i++)await page.keyboard.press('ArrowDown');await page.keyboard.press('Enter');await expect(s).toHaveValue(value);}else await s.selectOption(value);
 }
 const values=reverse?['0.4','0.2','0','10','0','-10']:['0','0.2','0.4','-10','0','10'];
 for(const [i,id] of ['x-tick-0','x-tick-1','x-tick-2','y-tick-0','y-tick-1','y-tick-2'].entries()){
  const input=page.locator(`#diagram-${id}`);if(native){await input.focus();await page.keyboard.type(values[i]!);}else await input.fill(values[i]!);
 }
}
async function addPairs(page:Page,native=false){
 for(const [i,p] of pairs.entries()){
  const b=page.getByRole('button',{name:'Koordinatenzeile hinzufügen'});if(native){await b.focus();await page.keyboard.press('Enter');}else await b.click();
  const x=page.getByLabel(`Punkt ${i+1} · x (mol/L)`,{exact:true}),y=page.getByLabel(`Punkt ${i+1} · y (%)`,{exact:true});
  if(native){await expect(x).toBeFocused();await page.keyboard.type(p[0]!);await page.keyboard.press('Tab');await expect(y).toBeFocused();await page.keyboard.type(p[1]!);}else{await x.fill(p[0]!);await y.fill(p[1]!);}
 }
}
async function plotPoint(page:Page,x:number,y:number,touch:boolean){
 const svg=page.getByRole('img',{name:'Mein Diagramm',exact:true});await svg.scrollIntoViewIfNeeded();
 // Independent screen oracle for the explicitly reversed 0.4 -> 0 and 10 -> -10 scales.
 const p=await svg.evaluate((element,{x,y})=>{
  const svg=element as SVGSVGElement,box=svg.closest('.plot-scroll') as HTMLElement;
  const sx=90+(0.4-x)/0.4*520,sy=40+(y+10)/20*320;
  const matrix=svg.getScreenCTM()!;const initial=new DOMPoint(sx,sy).matrixTransform(matrix);
  box.scrollLeft+=initial.x-(box.getBoundingClientRect().left+box.clientWidth/2);
  // Native touch dispatch may quantize CSS coordinates. Choose the nearest
  // whole screen pixel explicitly; keep all data/pixel expectations unchanged.
  const target=new DOMPoint(sx,sy).matrixTransform(svg.getScreenCTM()!);return {x:Math.round(target.x),y:Math.round(target.y)};
 },{x,y});
 if(touch)await page.touchscreen.tap(p.x,p.y);else await page.mouse.click(p.x,p.y);
}
test('M10.02 complete native keyboard learning path and private writing',async({page},info)=>{
 const external:string[]=[];page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:4173/')&&!r.url().startsWith('data:'))external.push(r.url());});
 await page.goto('');await page.evaluate(()=>localStorage.setItem('foreign-test-sentinel','keep'));
 await page.getByRole('link',{name:'Ein Diagramm selbst erstellen',exact:true}).focus();await page.keyboard.press('Enter');
 await expect(page.getByRole('heading',{name:'Ein Diagramm selbst erstellen',exact:true})).toBeFocused();
 await expect(page.getByRole('img',{name:'Mein Diagramm',exact:true}).locator('circle')).toHaveCount(0);await expect(page.locator('#diagram-x-quantity')).toHaveValue('');
 await axes(page,false,true);await addPairs(page,true);
 await page.getByRole('button',{name:'Diagramm überprüfen',exact:true}).focus();await page.keyboard.press('Enter');
 await expect(page.locator('#diagram-summary')).toHaveAttribute('data-status','correct');await expect(page.locator('#diagram-summary')).toBeFocused();
 await page.getByLabel('Punkt 2 · x (mol/L)',{exact:true}).fill('0,095 mol/L');await expect(page.locator('#diagram-summary')).toHaveAttribute('data-status','stale');
 await page.getByRole('button',{name:'Diagramm überprüfen',exact:true}).click();await expect(page.locator('#diagram-summary')).toHaveAttribute('data-status','correct');
 await page.getByLabel('Meine Erklärung – nicht automatisch bewertet').fill('PRIVATE synthetic writing: two examples');
 expect(await page.evaluate(()=>({...localStorage}))).toEqual({'foreign-test-sentinel':'keep'});expect(external).toEqual([]);
 await page.screenshot({path:info.outputPath('m1002-keyboard-complete.png'),fullPage:true});
 await page.locator('#diagram-figure').screenshot({path:info.outputPath('m1002-diagram-detail.png')});
 await page.getByRole('link',{name:'Zelllabor 11 · Zur Startseite'}).click();await page.getByRole('link',{name:'Ein Diagramm selbst erstellen',exact:true}).click();
 await expect(page.getByLabel('Meine Erklärung – nicht automatisch bewertet')).toHaveValue('PRIVATE synthetic writing: two examples');
 await page.reload();await expect(page.getByRole('img',{name:'Mein Diagramm',exact:true}).locator('circle')).toHaveCount(0);await expect(page.getByLabel('Meine Erklärung – nicht automatisch bewertet')).toHaveValue('');
 await expect(page.locator('#diagram-support')).toContainText('Frühere Hilfehistorie ungesichert');
});
test('M10.02 mouse/touch creates and edits the same semantic points on reversed axes',async({page},info)=>{
 await page.goto('#/m1002');await axes(page,true);
 for(const p of pairs)await plotPoint(page,Number(p[0]),Number(p[1]),Boolean(info.project.use.hasTouch));
 await expect(page.getByRole('img',{name:'Mein Diagramm',exact:true}).locator('circle')).toHaveCount(5);
 await expect(page.getByLabel('Punkt 2 · x (mol/L)',{exact:true})).toHaveValue('0.100');
 expect(Number(await page.getByRole('img',{name:'Mein Diagramm',exact:true}).locator('circle').nth(1).getAttribute('cx'))).toBeCloseTo(480,6);
 await page.getByRole('button',{name:'Diagramm überprüfen',exact:true}).click();await expect(page.locator('#diagram-summary')).toHaveAttribute('data-status','correct');
 await page.getByRole('button',{name:'Punkt 2 im Diagramm bearbeiten',exact:true}).click();await plotPoint(page,.1,-3,Boolean(info.project.use.hasTouch));
 await page.getByRole('button',{name:'Diagramm überprüfen',exact:true}).click();await expect(page.locator('#diagram-summary')).toHaveAttribute('data-status','incorrect');
 await expect(page.getByLabel('Punkt 2 · y (%)',{exact:true})).toHaveValue('-3.0');
 await page.getByLabel('Punkt 2 · y (%)',{exact:true}).fill('3');await page.getByRole('button',{name:'Diagramm überprüfen',exact:true}).click();await expect(page.locator('#diagram-summary')).toHaveAttribute('data-status','correct');
 await page.getByRole('button',{name:'Punkt 5 entfernen',exact:true}).click();await expect(page.getByRole('button',{name:'Koordinatenzeile hinzufügen'})).toBeFocused();
 await page.getByRole('button',{name:'Diagramm überprüfen',exact:true}).click();await expect(page.locator('#diagram-summary')).toHaveAttribute('data-status','partial');
 await page.screenshot({path:info.outputPath('m1002-pointer-reversed.png'),fullPage:true});
});
test('M10.02 specific errors, aid provenance and separate comparison solution',async({page})=>{
 await page.goto('#/m1002');await axes(page);await addPairs(page);
 await page.locator('#diagram-x-tick-1').fill('0.1');await page.getByRole('button',{name:'Diagramm überprüfen',exact:true}).click();
 await expect(page.locator('#diagram-x-feedback')).toContainText('Gleiche Zeichenabstände');await expect(page.locator('#diagram-y-feedback [data-status=correct]')).toHaveCount(3);
 await page.locator('#diagram-x-tick-1').fill('0.2');await page.getByLabel('Punkt 1 · x (mol/L)',{exact:true}).fill('0 mol/L oder 10 mol/L');
 await page.getByRole('button',{name:'Diagramm überprüfen',exact:true}).click();await expect(page.locator('#diagram-summary')).toHaveAttribute('data-status','clarify');
 await page.getByLabel('Punkt 1 · x (mol/L)',{exact:true}).fill('0');
 await page.getByRole('button',{name:'Koordinatenzeile hinzufügen'}).click();await page.getByRole('button',{name:'Diagramm überprüfen',exact:true}).click();await expect(page.locator('#diagram-summary')).toHaveAttribute('data-status','partial');await expect(page.locator('#point-6-feedback')).toHaveAttribute('data-status','empty');await page.getByLabel('Punkt 6 · x (mol/L)',{exact:true}).fill('0.2');await page.getByLabel('Punkt 6 · y (%)',{exact:true}).fill('-1');
 await page.getByRole('button',{name:'Diagramm überprüfen',exact:true}).click();await expect(page.locator('#diagram-points-feedback')).toContainText('mehr als fünf');await expect(page.locator('#point-3-feedback')).toContainText('mehrfach');
 await page.getByRole('button',{name:'Punkt 6 entfernen',exact:true}).click();await page.getByRole('button',{name:'Diagramm überprüfen',exact:true}).click();await expect(page.locator('#diagram-summary')).toHaveAttribute('data-status','correct');
 await page.getByRole('button',{name:'Hinweis',exact:true}).click();await expect(page.locator('#diagram-summary')).toHaveAttribute('data-status','stale');
 await page.getByRole('button',{name:'Vergleichsdiagramm ansehen',exact:true}).click();await expect(page.getByRole('img',{name:'Ausdrücklich geöffnetes Vergleichsdiagramm'}).locator('circle')).toHaveCount(5);
 await expect(page.getByRole('img',{name:'Mein Diagramm',exact:true}).locator('circle')).toHaveCount(5);
 await page.getByRole('button',{name:'Diagramm überprüfen',exact:true}).click();await expect(page.getByText('Lösung angesehen.',{exact:false})).toBeVisible();
 await page.getByRole('button',{name:'Neue Bearbeitung beginnen'}).click();await expect(page.locator('#diagram-x-quantity')).toBeFocused();await expect(page.getByRole('img',{name:'Mein Diagramm',exact:true}).locator('circle')).toHaveCount(0);await expect(page.getByText('Lösung angesehen.',{exact:false})).toBeVisible();
});
test('M10.02 narrow 320/390 layouts and large text retain focus and complete coordinate controls',async({page},info)=>{
 await page.goto('#/m1002');await axes(page);await page.getByRole('button',{name:'Koordinatenzeile hinzufügen'}).click();
 await page.addStyleTag({content:'html {font-size:200% !important;}'});
 for(const width of [320,390]){
  await page.setViewportSize({width,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  const x=page.getByLabel('Punkt 1 · x (mol/L)',{exact:true});await x.focus();await page.keyboard.type('0.100');await page.keyboard.press('Tab');await expect(page.getByLabel('Punkt 1 · y (%)',{exact:true})).toBeFocused();
  const region=page.getByRole('region',{name:'Diagramm, bei Bedarf seitlich scrollen',exact:true});await region.evaluate(e=>{e.scrollLeft=0;});await region.focus();await page.keyboard.press('ArrowRight');await expect.poll(()=>region.evaluate(e=>e.scrollLeft)).toBeGreaterThan(0);
  await page.screenshot({path:info.outputPath(`m1002-${width}-large-text.png`),fullPage:true});await x.fill('');
 }
});
test('M10.01 explains preserved ambiguous and over-limit formats concretely',async({page})=>{
 await page.goto('#/m1001');const field=page.locator('#mass-c0'),feedback=page.locator('#mass-feedback-c0'),check=page.getByRole('button',{name:'Zahlen überprüfen',exact:true});
 await field.fill('8,000');await check.click();await expect(feedback).toHaveAttribute('data-status','clarify');await expect(feedback).toContainText('8 oder 8,00');
 await field.fill('1'.repeat(129));await check.click();await expect(feedback).toHaveAttribute('data-status','clarify');await expect(feedback).toContainText('128 Zeichen');
 await field.fill('1'.repeat(41));await check.click();await expect(feedback).toHaveAttribute('data-status','clarify');await expect(feedback).toContainText('40 Ziffern');
 await field.fill('8,00');await check.click();await expect(feedback).toHaveAttribute('data-status','correct');
});
