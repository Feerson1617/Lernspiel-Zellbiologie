import {test,expect} from '@playwright/test';
import type {Page,Locator} from '@playwright/test';
const step=async(page:Page,n:number)=>page.getByRole('navigation',{name:'Schritte der Untersuchung'}).getByRole('button').nth(n).click();
const activate=async(page:Page,control:Locator)=>{if(await page.evaluate(()=>navigator.maxTouchPoints>0))await control.tap();else await control.click();};
const unseen='Die Befunde wurden bereits angesehen.';

test('DID-V1 advanced fields, all steps and non-solution help keep findings closed; first prediction remains original',async({page})=>{
 await page.goto('#/m604');await page.locator('#m604-prediction').fill('Vor Daten: eigene Erwartung');
 await page.locator('#m604-planning').fill('Ich möchte Veränderungen mit einer Handhabungskontrolle vergleichen.');
 expect(await page.locator('.investigation-foundation').innerText()).not.toContain('6 Minuten');
 await page.locator('#m604-standard-plan summary').click();await expect(page.locator('#m604-standard-plan')).toContainText('6 Minuten');
 await page.locator('#m604-depth').click();
 for(const n of [0,1,2,3,4,5,6]){
  await step(page,n);
  expect(await page.locator('main').innerText()).not.toMatch(/61\s*%|89\s*%/);
  expect(await page.locator('main').ariaSnapshot()).not.toMatch(/61\s*%|89\s*%/);
 }
 for(const level of [1,2]){await page.locator(`#m604-help-${level}`).click();expect(await page.locator('main').innerText()).not.toMatch(/61\s*%|89\s*%/);}
 await step(page,3);await expect(page.locator('[data-field=observationType]')).toBeHidden();
 await expect(page.locator('#m604-observationType-observation')).toBeDisabled();await page.locator('#m604-check').click();
 expect(await page.locator('main').ariaSnapshot()).not.toMatch(/61\s*%|89\s*%/);
 await page.locator('#m604-reveal').click();await step(page,0);await expect(page.locator('#m604-step-0')).toContainText(unseen);
 await page.locator('#m604-prediction').fill('Nach Daten: eine Erklärung');await page.getByText('Meine Vorhersage vor der ersten Datenansicht',{exact:true}).click();
 await expect(page.locator('#m604-step-0 details')).toContainText('Vor Daten: eigene Erwartung');await expect(page.locator('#m604-step-0 details')).not.toContainText('Nach Daten: eine Erklärung');
 await page.locator('#m604-case').click();await step(page,3);
 expect(await page.locator('main').ariaSnapshot()).not.toMatch(/58\s*%|60\s*%/);
 await page.locator('#m604-help-3').click();await expect(page.locator('.investigation-data')).toContainText('58 %');
 await step(page,0);await expect(page.locator('#m604-step-0')).toContainText(unseen);
 await page.locator('#m604-case').click();await expect(page.locator('#m604-step-0')).toContainText(unseen);
});

test('DID-V1 compact investigation completion stays partial and C18 remains mandatory',async({page})=>{
 await page.goto('#/m604');await page.locator('#m604-hypothesis-loss_prediction').check();
 await step(page,1);await page.locator('#m604-dependent-detached_fraction').check();
 await step(page,2);for(const id of ['water','handling','times','fresh'])await page.locator(`#m604-control-${id}`).check();
 await step(page,3);await page.locator('#m604-reveal').click();await page.locator('#m604-observation-volume_rises').check();
 await step(page,4);await page.locator('#m604-interpretation-recovery_compatible').check();
 await step(page,5);for(const id of ['not_unique','exchange'])await page.locator(`#m604-limits-${id}`).check();
 await page.locator('#m604-check').click();await expect(page.locator('#m604-core-progress')).toContainText('Kernweg bearbeitet.');
 await expect(page.locator('.investigation-feedback')).toHaveAttribute('data-status','partial');
 await expect(page.locator('[data-criterion-feedback="M6.04.C18"]')).toHaveAttribute('data-status','partial');
 await expect(page.locator('.learning-support')).toContainText('Kein aktueller Erfolgsbeleg');
 await step(page,1);await page.locator('#m604-dependent-relative_volume').check();await page.locator('#m604-check').click();
 await expect(page.locator('[data-criterion-feedback="M6.04.C18"]')).toHaveAttribute('data-status','correct');
 await expect(page.locator('.investigation-feedback')).toHaveAttribute('data-status','partial');
 await page.locator('#m604-depth').click();await expect(page.locator('[data-field-feedback]')).toHaveCount(17);
 await step(page,1);await page.locator('#m604-independent-volume_result').check();await page.locator('#m604-check').click();
 await page.locator('#m604-depth').click();await expect(page.locator('[data-field=independent]')).toBeHidden();
 await expect(page.locator('[data-field-feedback=independent]')).toHaveAttribute('data-status','incorrect');
 await page.getByRole('button',{name:'Unabhängige Größe selbst überarbeiten',exact:true}).click();
 await expect(page.locator('[data-field=independent]')).toBeVisible();await expect(page.locator('#m604-independent-volume_result')).toBeFocused();
});

test('DID-V1 water path uses neutral material, actual feedback, isolated writing and conscious comparison',async({page},info)=>{
 await page.goto('./');await activate(page,page.getByRole('link',{name:'Erste Übung ausprobieren – Wasserhaushalt der Zelle',exact:true}));
 const material=page.locator('#lernmaterial');await expect(material.locator('tbody tr')).toHaveCount(3);
 await expect(material).toContainText('Druck');await expect(material).toContainText('Saccharose');
 expect(await material.innerText()).not.toMatch(/Wasserverlust|ΨVakuole >|netto.*außen/);
 for(const [field,value] of [['process','Osmose'],['direction','nach innen'],['volume','kleiner']])await page.locator(`#learner-${field}`).fill(value!);
 await page.getByRole('button',{name:'Drei Antworten prüfen',exact:true}).click();await expect(page.locator('[aria-label="Bewertung direction"]')).toHaveAttribute('data-status','incorrect');
 await page.locator('#learner-direction').fill('nach außen');await page.getByRole('button',{name:'Drei Antworten prüfen',exact:true}).click();
 await expect(page.getByRole('region',{name:'Gesamtrückmeldung',exact:true})).toHaveAttribute('data-status','correct');
 await page.getByRole('link',{name:'Nächster Lernschritt: eigene biologische Erklärung schreiben',exact:true}).click();
 await expect(page.locator('.causal-node')).toHaveCount(4);
 await page.getByRole('link',{name:'3 Eigene Erklärung',exact:true}).click();
 await expect(page.locator('.causal-workspace')).toBeHidden();await expect(page.locator('#kausal-hilfen')).toBeHidden();
 await expect(page.locator('#kausal-erklaerung')).toContainText('Der Turgor einer Pflanzenzelle sinkt. Kann man daraus bereits auf eine sichtbare Ablösung des Protoplasten schließen? Begründe.');
 await expect(page.locator('#causal-writing-example')).toBeEmpty();await expect(page.locator('#causal-writing-rubric')).not.toHaveAttribute('open','');
 await page.locator('#causal-explanation').fill('Synthetische eigene Erklärung vor dem Vergleich.');
 await page.locator('#kausal-erklaerung').screenshot({path:info.outputPath('water-own-writing.png')});
 await page.locator('#causal-writing-rubric summary').click();await expect(page.locator('#causal-writing-rubric input:checked')).toHaveCount(0);
 await activate(page,page.getByRole('button',{name:'Mustererklärung zum eigenen Vergleich öffnen',exact:true}));
 await expect(page.locator('#causal-writing-example')).toContainText('allein');await expect(page.locator('.learning-support')).toContainText('Lösung angesehen');
 await page.getByRole('link',{name:'Vorherige Übung: Wasserhaushalt',exact:true}).click();await expect(page.locator('#learner-direction')).toHaveValue('nach außen');
 await page.getByRole('link',{name:'Weiter zu M6.03: eigenes Kausalnetz aufbauen',exact:true}).click();await expect(page.locator('#causal-explanation')).toHaveValue('Synthetische eigene Erklärung vor dem Vergleich.');
});

test('DID-V1 data path retains masses and volatile normalization notes on navigation',async({page})=>{
 await page.goto('#/m1001');await expect(page.locator('main')).toContainText('Neu formulierter didaktischer Kartoffelgewebe-Fall');
 await expect(page.locator('tbody tr')).toHaveText(['10,003,003,24','20,103,003,09','30,203,002,97','40,303,002,85','50,403,002,76']);
 await expect(page.locator('#mass-interpretation')).toBeEmpty();
 await expect(page.locator('main')).toContainText('2,00 g und 4,00 g');
 for(const [field,value] of [['c0','8'],['c10','3'],['c20','-1'],['c30','-5'],['c40','-8']])await page.locator(`#mass-${field}`).fill(value!);
 await page.getByRole('button',{name:'Zahlen überprüfen',exact:true}).click();await expect(page.locator('.mass-field [data-status=correct]')).toHaveCount(5);
 await page.locator('#mass-writing').fill('Synthetische Normierungsnotiz');
 await page.getByRole('link',{name:'Die Daten in einem eigenen Diagramm darstellen',exact:true}).click();
 await page.locator('#diagram-writing').fill('Synthetische Datenbeschreibung');
 await page.getByRole('link',{name:'Von der Tabelle zu meinem Diagramm',exact:true}).focus();await page.keyboard.press('Enter');await expect(page.locator('#diagram-figure')).toBeFocused();
 await page.getByRole('link',{name:'Vom Diagramm zurück zur Datentabelle',exact:true}).click();await expect(page.locator('#diagram-material')).toBeFocused();await expect(page).toHaveURL(/#\/m1002$/);
 await page.getByRole('link',{name:'Zurück zur Berechnung und zur Normierungsfrage',exact:true}).click();await expect(page.locator('#mass-writing')).toHaveValue('Synthetische Normierungsnotiz');await expect(page.locator('#mass-c0')).toHaveValue('8');
 await page.getByRole('button',{name:'Biologische Deutung zum Vergleich öffnen',exact:true}).click();await expect(page.locator('#mass-interpretation')).toContainText('10 %');
 await page.getByRole('link',{name:'Die Daten in einem eigenen Diagramm darstellen',exact:true}).click();await expect(page.locator('#diagram-writing')).toHaveValue('Synthetische Datenbeschreibung');
 expect(await page.evaluate(()=>({...localStorage}))).toEqual({});expect(await page.evaluate(()=>({...sessionStorage}))).toEqual({});
});

test('DID-V1 broad valid scale stays green independently of readability and ungraded writing',async({page},info)=>{
 await page.goto('#/m1002');
 for(const [group,value] of [['x-quantity','concentration'],['x-unit','mol/L'],['y-quantity','mass_change'],['y-unit','%']])await page.locator(`#diagram-${group} input[value="${value}"]`).check();
 for(const [dim,values] of [['x',['-100','0','100']],['y',['-1000','0','1000']]] as const)for(const [i,value]of values.entries())await page.locator(`#diagram-${dim}-tick-${i}`).fill(value);
 for(const [i,pair] of [['0','8'],['0.1','3'],['0.2','-1'],['0.3','-5'],['0.4','-8']].entries()){
  await page.getByRole('button',{name:'Koordinatenzeile hinzufügen'}).click();
  await page.getByLabel(`Punkt ${i+1} · x (mol/L)`,{exact:true}).fill(pair[0]!);await page.getByLabel(`Punkt ${i+1} · y (%)`,{exact:true}).fill(pair[1]!);
 }
 await page.getByRole('button',{name:'Diagramm überprüfen',exact:true}).click();await expect(page.locator('#diagram-summary')).toHaveAttribute('data-status','correct');
 await expect(page.locator('#diagram-readability')).toHaveText('Prüfe, ob andere Personen die fünf Datenpunkte in deiner Darstellung gut unterscheiden können.');
 await expect(page.locator('#diagram-writing-rubric')).not.toHaveAttribute('open','');
 await page.locator('#diagram-writing').fill('Synthetischer ungeprüfter Text');await expect(page.locator('#diagram-summary')).toHaveAttribute('data-status','correct');
 await expect(page.locator('#diagram-writing-feedback')).toHaveText('Strukturierte Teilaufgaben geprüft – schriftliche Erklärung noch nicht fachlich überprüft.');
 await page.locator('#diagram-writing-rubric summary').click();await expect(page.locator('#diagram-writing-rubric li')).toHaveCount(4);
 await page.locator('#diagram-figure').screenshot({path:info.outputPath('broad-valid-scale.png')});
});

test('DID-V1 open investigation drafts survive route changes and remain private',async({page})=>{
 await page.goto('#/m604');await page.locator('#m604-prediction').fill('Synthetische erste Erwartung');await page.locator('#m604-planning').fill('Synthetischer erster Plan');
 await page.getByRole('link',{name:'Ursache und Wirkung verknüpfen (M6.03)',exact:true}).click();
 await page.getByRole('link',{name:'Optionale Vertiefung: Kontrolle und Rücktausch',exact:true}).click();
 await expect(page.locator('#m604-prediction')).toHaveValue('Synthetische erste Erwartung');await expect(page.locator('#m604-planning')).toHaveValue('Synthetischer erster Plan');
 expect(await page.evaluate(()=>({...localStorage}))).toEqual({});expect(await page.evaluate(()=>({...sessionStorage}))).toEqual({});
 await page.reload();await expect(page.locator('#m604-planning')).toHaveValue('');await expect(page.locator('#m604-prediction')).toHaveValue('');
});

for(const width of [1440,820,390,320])for(const font of [100,200])test(`DID-V1 layout ${width}px ${font}% keeps both paths and writing accessible`,async({page},info)=>{
 await page.setViewportSize({width,height:1000});await page.goto('./');
 await page.evaluate(font=>{document.documentElement.style.fontSize=`${font}%`;},font);
 await expect(page.getByRole('heading',{name:'A · Wasserhaushalt erklären',exact:true})).toBeVisible();
 await expect(page.getByRole('heading',{name:'B · Daten darstellen und deuten',exact:true})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 if(info.project.name.startsWith('desktop'))await page.screenshot({path:info.outputPath('paths.png'),fullPage:true});
 await activate(page,page.getByRole('link',{name:'Kausalnetz ausprobieren – Ursache und Wirkung',exact:true}));await activate(page,page.getByRole('link',{name:'3 Eigene Erklärung',exact:true}));
 await page.locator('#causal-explanation').fill('Synthetischer eigener Satz.');
 expect(await page.locator('#causal-explanation').evaluate(el=>parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(16*font/100);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 if(info.project.name.startsWith('desktop'))await page.locator('#kausal-erklaerung').screenshot({path:info.outputPath('writing.png')});
 await page.getByRole('link',{name:'Optionale Vertiefung: Kontrolle und Rücktausch',exact:true}).click();await step(page,3);
 await expect(page.locator('#m604-reveal')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 if(info.project.name.startsWith('desktop'))await page.locator('#m604-step-3').screenshot({path:info.outputPath('closed-findings.png')});
});
