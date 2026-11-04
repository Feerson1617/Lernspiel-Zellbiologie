import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import cases from '../fixtures/m1002-r1-cases.json';

const plot = (page: Page) => page.getByRole('img', { name: 'Mein Diagramm', exact: true });
const check = (page: Page) => page.getByRole('button', { name: 'Diagramm überprüfen', exact: true }).click();
const field = (page: Page, row: number, axis: 'x'|'y') => page.getByLabel(`Punkt ${row} · ${axis} (${axis === 'x' ? 'mol/L' : '%'})`, { exact: true });
async function chooseAxes(page: Page) {
  for (const [id, index] of [['x-quantity',0],['x-unit',0],['y-quantity',1],['y-unit',2]] as const)
    await page.locator(`#diagram-${id}`).getByRole('radio').nth(index).check();
}
async function ticks(page: Page, x: readonly string[], y: readonly string[]) {
  for (const [axis, values] of [['x',x],['y',y]] as const)
    for (let i=0;i<3;i++) await page.locator(`#diagram-${axis}-tick-${i}`).fill(values[i]!);
}
async function addReference(page: Page) {
  for (const [i,p] of cases.base.points.entries()) {
    await page.getByRole('button', { name: 'Koordinatenzeile hinzufügen' }).click();
    await field(page,i+1,'x').fill(p.x); await field(page,i+1,'y').fill(p.y);
  }
}
async function settled(page: Page) {
  await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
}
async function bounds(page: Page) {
  return plot(page).evaluate(element => {
    const svg=element as SVGSVGElement, v=svg.viewBox.baseVal, m=svg.getScreenCTM()!;
    const text=[...svg.querySelectorAll('text')].map(t=>{
      const b=t.getBBox();return {text:t.textContent,x:b.x,y:b.y,right:b.x+b.width,bottom:b.y+b.height};
    });
    return {viewBox:{x:v.x,y:v.y,right:v.x+v.width,bottom:v.y+v.height},text,
      scale:m.a,minimumScale:Math.max(svg.parentElement!.clientWidth,640)/720,
      font:parseFloat(getComputedStyle(svg).fontSize),rootFont:parseFloat(getComputedStyle(document.documentElement).fontSize)};
  });
}

for (const font of [100,200]) test(`M1002-R1 labels fit the actual SVG at ${font}% without shrinking`, async ({page},info) => {
  await page.goto('#/m1002'); await chooseAxes(page); await addReference(page);
  const widths=info.project.name.startsWith('desktop')?[1440]:info.project.name.startsWith('tablet')?[820]:[320,390];
  const records=[];
  for (const width of widths) {
    await page.setViewportSize({width,height:1000});
    for (const variant of cases.labels) {
      await page.evaluate(()=>{document.documentElement.style.fontSize='100%';});
      await ticks(page,variant.x,variant.y); await check(page);
      await expect(page.locator('#diagram-summary')).toHaveAttribute('data-status','correct');
      // Change text size after drawing, with no subsequent answer edit.
      await page.evaluate(size=>{document.documentElement.style.fontSize=`${size}%`;},font); await settled(page);
      await page.locator('#diagram-figure .plot-scroll').evaluate(e=>{e.scrollLeft=0;});
      const b=await bounds(page);records.push({width,fontPercent:font,variant:variant.id,...b});
      await page.locator('#diagram-figure').screenshot({path:info.outputPath(`labels-${width}-${font}-${variant.id}.png`)});
      for (const t of b.text) {
        expect.soft(t.x,`${variant.id}: left edge of ${t.text}`).toBeGreaterThanOrEqual(b.viewBox.x);
        expect.soft(t.y,`${variant.id}: top edge of ${t.text}`).toBeGreaterThanOrEqual(b.viewBox.y);
        expect.soft(t.right,`${variant.id}: right edge of ${t.text}`).toBeLessThanOrEqual(b.viewBox.right);
        expect.soft(t.bottom,`${variant.id}: bottom edge of ${t.text}`).toBeLessThanOrEqual(b.viewBox.bottom);
      }
      expect.soft(b.scale).toBeGreaterThanOrEqual(b.minimumScale-1e-6);
      expect.soft(b.font).toBe(b.rootFont);
      expect.soft(b.text.slice(0,6).map(t=>t.text)).toEqual(variant.x.flatMap((x,i)=>[x,variant.y[i]]));
      for (const [axis,values] of [['x',variant.x],['y',variant.y]] as const)
        for(let i=0;i<3;i++) await expect(page.locator(`#diagram-${axis}-tick-${i}`)).toHaveValue(values[i]!);
    }
  }
  await writeFile(info.outputPath('text-bounds.json'),JSON.stringify(records,null,2));
});

test('M1002-R1 incomplete extra rows preserve correct points and clarify unknown input',async({page},info)=>{
  await page.goto('#/m1002');await chooseAxes(page);await ticks(page,cases.base.xAxis.ticks,cases.base.yAxis.ticks);await addReference(page);
  await page.getByRole('button',{name:'Koordinatenzeile hinzufügen'}).click();
  for(const [x,y,status,row] of [['','','partial','empty'],['0.3','','partial','partial'],['','−5','partial','partial'],['???','3','clarify','clarify'],['0.35','2','incorrect','incorrect']] as const){
    await field(page,6,'x').fill(x);await field(page,6,'y').fill(y);await check(page);
    expect.soft(await page.locator('#diagram-summary').getAttribute('data-status')).toBe(status);
    expect.soft(await page.locator('#diagram-points-feedback').getAttribute('data-status')).toBe(status);
    await expect(page.locator('#point-6-feedback')).toHaveAttribute('data-status',row);
    for(let i=1;i<=5;i++)await expect(page.locator(`#point-${i}-feedback`)).toHaveAttribute('data-status','correct');
    if(status==='partial'&&row==='partial'){
      expect.soft(await page.locator('#point-6-feedback').textContent()).toContain(x?'y-Koordinate':'x-Koordinate');
      await page.locator('#diagram-summary').screenshot({path:info.outputPath(x?'half-x.png':'half-y.png')});
    }
  }
  await field(page,6,'x').fill('0.3');await field(page,6,'y').fill('-5');await check(page);
  await expect(page.locator('#diagram-summary')).toHaveAttribute('data-status','incorrect');
  await expect(page.locator('#point-6-feedback')).toContainText('mehrfach');
  await page.getByRole('button',{name:'Punkt 6 entfernen',exact:true}).click();await check(page);
  await expect(page.locator('#diagram-summary')).toHaveAttribute('data-status','correct');
});

for(const reverse of [false,true])test(`M1002-R1 adaptive transform preserves ${reverse?'falling':'rising'} data, edges and edits`,async({page},info)=>{
  await page.goto('#/m1002');await chooseAxes(page);
  const x=[...cases.labels[1]!.x],y=[...cases.labels[1]!.y];if(reverse){x.reverse();y.reverse();}
  await ticks(page,x,y);await page.evaluate(()=>{document.documentElement.style.fontSize='200%';});await settled(page);
  async function place(x:number,y:number){
    const svg=plot(page);await svg.scrollIntoViewIfNeeded();
    // Independent oracle: the plotting rectangle and data endpoints are fixed;
    // the browser's actual CTM must include any adaptive viewBox translation.
    const p=await svg.evaluate((element,{x,y,reverse})=>{
      const svg=element as SVGSVGElement,box=svg.parentElement!;
      const sx=90+(reverse?(0.4-x):x)/0.4*520,sy=40+(reverse?(y+10):(10-y))/20*320;
      const first=new DOMPoint(sx,sy).matrixTransform(svg.getScreenCTM()!);
      box.scrollLeft+=first.x-(box.getBoundingClientRect().left+box.clientWidth/2);
      const target=new DOMPoint(sx,sy).matrixTransform(svg.getScreenCTM()!);return {x:Math.round(target.x),y:Math.round(target.y)};
    },{x,y,reverse});
    if(info.project.use.hasTouch)await page.touchscreen.tap(p.x,p.y);else await page.mouse.click(p.x,p.y);
  }
  for(const p of cases.base.points)await place(Number(p.x),Number(p.y));
  await check(page);await expect(page.locator('#diagram-summary')).toHaveAttribute('data-status','correct');
  await page.getByRole('button',{name:'Punkt 2 im Diagramm bearbeiten',exact:true}).click();await place(.123,4.6);
  await expect(field(page,2,'x')).toHaveValue('0.123');await expect(field(page,2,'y')).toHaveValue('4.6');
  expect(Number(await plot(page).locator('circle').nth(1).getAttribute('cx'))).toBeCloseTo(90+(reverse ? .4-.123 : .123)/.4*520,6);
  await place(.1,3);await page.getByRole('button',{name:'Neuen Punkt per Tipp setzen',exact:true}).click();await place(.2,10);
  await expect(field(page,6,'y')).toHaveValue('10.0');
  expect(Number(await plot(page).locator('circle').nth(5).getAttribute('cy'))).toBe(reverse?360:40);
  await page.getByRole('button',{name:'Punkt 6 im Diagramm bearbeiten',exact:true}).click();await place(.2,-10);
  await expect(field(page,6,'y')).toHaveValue('-10.0');
  expect(Number(await plot(page).locator('circle').nth(5).getAttribute('cy'))).toBe(reverse?40:360);
  await page.getByRole('button',{name:'Punkt 6 entfernen',exact:true}).click();await check(page);
  await expect(page.locator('#diagram-summary')).toHaveAttribute('data-status','correct');
  await page.locator('#diagram-figure').screenshot({path:info.outputPath('adaptive-points.png')});
});
