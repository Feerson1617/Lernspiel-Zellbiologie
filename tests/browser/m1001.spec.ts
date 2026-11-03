import { test, expect } from '@playwright/test';
const fields=['c0','c10','c20','c30','c40'];
const values=['+8 %','3,00','−1','-5.00','−8 Prozent'];
test('M10.01 public learning cycle, feedback, help and privacy',async({page},testInfo)=>{
 await page.goto('');await page.getByRole('link',{name:'Relative Massenänderung berechnen'}).click();
 await expect(page.getByRole('heading',{name:'Relative Massenänderung',exact:true})).toBeVisible();
 for(const f of fields)await expect(page.locator(`#mass-${f}`)).toHaveValue('');
 await page.locator('#mass-c0').fill('0,08');await page.getByRole('button',{name:'Zahlen überprüfen',exact:true}).click();
 await expect(page.locator('#mass-feedback-c0')).toHaveAttribute('data-status','incorrect');
 await page.locator('#mass-c0').fill('8 oder 9');await page.getByRole('button',{name:'Zahlen überprüfen',exact:true}).click();
 await expect(page.locator('#mass-feedback-c0')).toHaveAttribute('data-status','clarify');
 for(let i=0;i<fields.length;i++)await page.locator(`#mass-${fields[i]}`).fill(values[i]!);
 await page.getByRole('button',{name:'Zahlen überprüfen',exact:true}).click();
 await expect(page.getByRole('status').first()).toContainText('5 von 5');
 await page.locator('#mass-writing').fill('PRIVATE unbewerteter Entwurf');
 await page.getByRole('button',{name:'Hinweis',exact:true}).click();
 await expect(page.locator('#mass-feedback-c0')).toHaveAttribute('data-status','stale');
 await page.getByRole('button',{name:'Vergleichsrechnung ansehen'}).click();
 await expect(page.getByText('Ansatz 1: 100 ×', {exact:false})).toBeVisible();
 await page.getByRole('button',{name:'Zahlen überprüfen',exact:true}).click();
 await expect(page.getByText('Lösung angesehen.',{exact:false})).toBeVisible();
 expect(await page.evaluate(()=>JSON.stringify(localStorage))).not.toContain('PRIVATE');
 await page.screenshot({path:testInfo.outputPath('m1001-completed.png'),fullPage:true});
 await page.getByRole('link',{name:'Zelllabor 11 · Zur Startseite'}).click();await page.getByRole('link',{name:'Relative Massenänderung berechnen'}).click();
 await expect(page.locator('#mass-writing')).toHaveValue('PRIVATE unbewerteter Entwurf');
 await page.getByRole('button',{name:'Neue Bearbeitung beginnen'}).click();
 await expect(page.locator('#mass-c0')).toHaveValue('');await expect(page.getByText('Lösung angesehen.',{exact:false})).toBeVisible();
});
test('M10.01 keyboard, touch, large text and narrow layout',async({page},testInfo)=>{
 await page.goto('#/m1001');const input=page.locator('#mass-c0');await input.focus();await page.keyboard.type('+8');await page.keyboard.press('Tab');
 await expect(page.locator('#mass-c10')).toBeFocused();
 const check=page.getByRole('button',{name:'Zahlen überprüfen',exact:true});
 if(testInfo.project.use.hasTouch)await check.tap();else {await check.focus();await page.keyboard.press('Enter');}
 await expect(page.locator('#mass-feedback-c0')).toHaveAttribute('data-status','correct');
 await page.addStyleTag({content:'html {font-size:200% !important;}'});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 await page.screenshot({path:testInfo.outputPath('m1001-large-text.png'),fullPage:true});
});
