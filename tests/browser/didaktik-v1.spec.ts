import {test,expect} from '@playwright/test';

test('DID-V1-M604 direct evidence step does not disclose closed findings',async({page},info)=>{
 await page.goto('#/m604');
 await page.getByRole('navigation',{name:'Schritte der Untersuchung'}).getByRole('button').nth(3).click();
 await page.locator('.investigation-workspace').screenshot({path:info.outputPath('before-reveal.png')});
 expect.soft(await page.locator('main').innerText()).not.toMatch(/61\s*%|89\s*%/);
 await expect.soft(page.locator('[data-field="observationType"]')).toBeHidden();
 await page.locator('#m604-reveal').click();
 await expect(page.locator('.investigation-data')).toContainText('89 %');
 await page.getByRole('navigation',{name:'Schritte der Untersuchung'}).getByRole('button').first().click();
 await expect(page.locator('#m604-step-0')).toContainText('Die Befunde wurden bereits angesehen.');
 await page.locator('#m604-prediction').fill('Erklärung nach Einsicht');
 await expect(page.locator('#m604-step-0')).toContainText('Nach Einsicht');
});

test('DID-V1-M604 comparison discloses data honestly and preserves original prediction',async({page},info)=>{
 await page.goto('#/m604');await page.locator('#m604-prediction').fill('Mein ursprünglicher Entwurf');
 await page.locator('#m604-help-3').click();
 await expect.soft(page.locator('#m604-step-0')).toContainText('Die Befunde wurden bereits angesehen.');
 await page.getByText('Meine Vorhersage vor der ersten Datenansicht',{exact:true}).click();
 await expect(page.locator('#m604-step-0')).toContainText('Mein ursprünglicher Entwurf');
 await page.locator('#m604-prediction').fill('Neue Erklärung');
 await page.locator('#m604-step-0').screenshot({path:info.outputPath('after-comparison.png')});
 await page.locator('#m604-reset').click();await expect(page.locator('#m604-step-0')).toContainText('Die Befunde wurden bereits angesehen.');
 await page.locator('#m604-case').click();await expect(page.locator('#m604-prediction')).toHaveValue('');
 await page.locator('#m604-case').click();await expect(page.locator('#m604-step-0')).toContainText('Die Befunde wurden bereits angesehen.');
});
