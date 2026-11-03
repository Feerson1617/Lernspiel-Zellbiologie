import { expect, test } from '@playwright/test';
import type { Locator, Page, TestInfo } from '@playwright/test';
import fixtures from '../fixtures/m604-cases.json' with { type: 'json' };

// Pre-implementation biological inputs. All submissions use the public UI;
// no controller, result or focus injection and no pupil data.
const steps = [ ['hypothesis','predictionType'], ['design','independent','dependent','fields','repetitions','sequence'],
  ['control','constants'], ['observation','observationType'], ['interpretation','mechanism','explanationType'], ['limits','nextCheck'] ];
type Answer = Record<string, readonly string[]>;
const result = (page: Page) => page.getByRole('region',{name:'Rückmeldung zur Untersuchung',exact:true});
const support = (page: Page) => page.getByRole('region',{name:'Unterstützung und Sitzungsstand',exact:true});
const problems = new WeakMap<Page,string[]>();
test.beforeEach(async ({ page,baseURL }) => {
  const events: string[] = []; problems.set(page,events);
  page.on('pageerror',e => events.push(e.message));
  page.on('requestfailed',r => events.push(`Request failed: ${r.url()}`));
  page.on('request',r => { if (!r.url().startsWith(baseURL!)) events.push(`External: ${r.url()}`); });
  page.on('response',r => { if (r.status() >= 400) events.push(`HTTP ${r.status()}`); });
});
test.afterEach(async ({ page }) => { expect(problems.get(page)).toEqual([]); });
async function press(page: Page, locator: Locator) { if (await page.evaluate(() => navigator.maxTouchPoints > 0)) await locator.tap(); else await locator.click(); }
async function open(page: Page) {
  await page.goto('./'); await press(page,page.getByRole('link',{name:'Untersuchung planen – Kontrolle und Rücktausch',exact:true}));
  await expect(page.getByRole('heading',{level:1})).toHaveText('Kontrolle und Rücktausch untersuchen');
}
async function step(page: Page,index: number) { await press(page,page.getByRole('navigation',{name:'Schritte der Untersuchung'}).getByRole('button').nth(index)); }
async function choose(page: Page,field: string,values: readonly string[]) {
  const group = page.locator(`fieldset[data-field="${field}"]`);
  for (const input of await group.locator('input').all()) {
    if (await input.isChecked() && !(values.includes(await input.inputValue()))) {
      if (await input.getAttribute('type') === 'checkbox') await press(page,input);
    }
  }
  if (!values.length) await press(page,group.getByRole('button'));
  for (const id of values) { const input = page.locator(`#m604-${field}-${id}`); if (!await input.isChecked()) await press(page,input); }
}
async function complete(page: Page,answer: Answer = fixtures.complete) {
  for (let index = 0; index < steps.length; index++) {
    await step(page,index);
    if (index === 3 && await page.locator('#m604-reveal').isEnabled()) await press(page,page.locator('#m604-reveal'));
    for (const field of steps[index]!) await choose(page,field,answer[field]!);
  }
  await press(page,page.locator('#m604-check'));
}
async function shot(page: Page,info: TestInfo,name: string,selector = '.investigation-step:not([hidden])') {
  const path = info.outputPath(`${name}.png`); await page.locator(selector).screenshot({path}); await info.attach(name,{path,contentType:'image/png'});
}

test('normal start and prior exercises reach M6.04 without prerequisites or automatic extra missions',async ({ page },info) => {
  await open(page); await expect(page).toHaveURL(/#\/m604$/); await expect(result(page)).toHaveAttribute('data-color','neutral');
  await expect(page.locator('input:checked')).toHaveCount(0); await expect(page.locator('.investigation-foundation')).toContainText('Gesamtwasserpotenziale einschließlich Druck');
  await shot(page,info,'m604-initial','.investigation-workspace');
  await page.getByRole('link',{name:'Ursache und Wirkung verknüpfen (M6.03)',exact:true}).click();
  await expect(page.locator('.causal-edge-list')).toContainText('Noch keine Verbindung');
  await page.getByRole('link',{name:'Weitere Übung: Kontrolle und Rücktausch',exact:true}).click();
  await expect(result(page)).toHaveAttribute('data-status','empty');
  await page.getByRole('link',{name:'Wasserhaushalt wiederholen (M6.02)',exact:true}).click(); await expect(page.locator('#learner-process')).toHaveValue('');
  await page.goto('./#/m901'); await expect(page.getByRole('link',{name:'Untersuchung planen – Kontrolle und Rücktausch',exact:true})).toBeVisible();
});

test('mouse or touch completes prediction, plan, control, recovery data, limited conclusion and unassessed writing',async ({ page },info) => {
  await open(page); await page.locator('#m604-prediction').fill('Ich erwarte unter den gegebenen Bedingungen einen Unterschied zur Kontrolle.');
  await complete(page); await expect(result(page)).toHaveAttribute('data-status','correct'); await expect(result(page)).toHaveAttribute('data-color','green');
  await expect(result(page)).toContainText('✓'); await expect(page.locator('[data-field-feedback][data-status="correct"]')).toHaveCount(17);
  await expect(support(page)).toContainText('Aktueller geprüfter Sitzungsbeleg');
  await expect(result(page)).toBeFocused(); await shot(page,info,'m604-recovery-correct','.investigation-feedback');
  await step(page,0); await page.locator('#m604-prediction').fill('Nach der Datenansicht überarbeitet.');
  const original = page.getByText('Meine Vorhersage vor der ersten Datenansicht',{exact:true}); await press(page,original);
  await expect(original.locator('..')).toContainText('Ich erwarte unter den gegebenen Bedingungen einen Unterschied zur Kontrolle.');
  await expect(page.locator('#m604-step-0')).toContainText('Nach Einsicht in die Befunde formuliert oder überarbeitet.');
  await expect(result(page)).toHaveAttribute('data-status','correct');
  await step(page,3); await expect(page.getByRole('region',{name:'Didaktische Beobachtungsdaten'})).toContainText('89 %');
  for (const summary of await page.locator('.investigation-run summary').all()) if (!await summary.locator('..').evaluate(el => (el as HTMLDetailsElement).open)) await press(page,summary);
  await expect(page.locator('.investigation-series')).toHaveCount(6); await shot(page,info,'m604-recovery-data');
  await step(page,6); await expect(page.locator('#m604-step-6')).toContainText('Plane eine Untersuchung, mit der du die aufgestellte Hypothese überprüfen kannst.');
  await page.locator('#m604-writing').fill('Mein eigener Plan mit Begründung der Kontrolle, Messgrößen, Wiederholungen und Aussagegrenzen.');
  await expect(page.locator('.investigation-rubric > li')).toHaveCount(5); await shot(page,info,'m604-writing');
  await expect(result(page)).toHaveAttribute('data-status','correct');
});

test('second scenario accepts a different valid design and distinguishes uncertainty from observed recovery',async ({ page },info) => {
  await open(page); await page.locator('#m604-case').click();
  const answer = { ...fixtures.complete,...fixtures.limitedOverrides, hypothesis:['return_prediction'], design:['staggered_pairs'], dependent:['relative_volume','detached_fraction'], limits:['not_unique','damage'], nextCheck:['check_integrity'] };
  await complete(page,answer); await expect(result(page)).toHaveAttribute('data-status','correct');
  await step(page,3); await expect(page.locator('.investigation-data')).toContainText('58 %'); await expect(page.locator('.investigation-data')).toContainText('60 %');
  await shot(page,info,'m604-limited-data');
  await step(page,4); await choose(page,'interpretation',['recovery_compatible']); await page.locator('#m604-check').click();
  await expect(result(page)).toHaveAttribute('data-color','red');
  const criterion = page.locator('[data-field-feedback="interpretation"]');
  await criterion.locator('summary').click(); await expect(criterion).toContainText('1–2 Prozentpunkte');
  await expect(page.locator('[data-field-feedback="hypothesis"]')).toHaveAttribute('data-status','correct');
  await page.locator('#m604-case').click(); await expect(result(page)).toHaveAttribute('data-status','empty'); await expect(page.locator('input:checked')).toHaveCount(0);
});

test('proven contradictions stay red, correct parts remain green and self revision invalidates stale success',async ({ page },info) => {
  await open(page); await complete(page);
  const changes = [[2,'control',['water','handling','times','fresh','old_stained']], [1,'independent',['volume_result']], [1,'repetitions',['three_photos']], [4,'interpretation',['death_proven']], [5,'limits',['not_unique','time','exchange_certain']]] as const;
  for (const [index,field,values] of changes) {
    await step(page,index); await choose(page,field,values); await expect(result(page)).toHaveAttribute('data-status','stale');
    await page.locator('#m604-check').click(); await expect(result(page)).toHaveAttribute('data-status','incorrect');
    await expect(page.locator(`[data-field-feedback="${field}"]`)).toHaveAttribute('data-color','red');
    await expect(page.locator('[data-field-feedback="dependent"]')).toHaveAttribute('data-color','green');
    await expect(support(page)).toContainText('Kein aktueller Erfolgsbeleg');
    if (field === 'control') {
      await page.locator('[data-field-feedback="control"] summary').click();
      await expect(page.locator('[data-field-feedback="control"] [data-color="green"]')).toHaveCount(4);
      await shot(page,info,'m604-error','.investigation-feedback');
    }
    await page.locator(`[data-field-feedback="${field}"] button`).click();
    await expect(page.locator(`fieldset[data-field="${field}"] input`).first()).toBeFocused();
    await choose(page,field,(fixtures.complete as Answer)[field]!); await page.locator('#m604-check').click(); await expect(result(page)).toHaveAttribute('data-status','correct');
  }
  await expect(support(page)).toContainText('Nach Rückmeldung selbst überarbeitet');
});

test('empty, incomplete and unsure decisions have distinct neutral or yellow feedback',async ({ page }) => {
  await open(page); await page.locator('#m604-check').click(); await expect(result(page)).toHaveAttribute('data-status','empty');
  await step(page,2); await choose(page,'control',['water']); await page.locator('#m604-check').click();
  await expect(result(page)).toHaveAttribute('data-status','partial'); await expect(page.locator('[data-field-feedback="control"]')).toHaveAttribute('data-color','yellow');
  await expect(page.locator('[data-field-feedback="hypothesis"]')).toHaveAttribute('data-status','empty');
  await step(page,0); await choose(page,'hypothesis',['unsure']); await page.locator('#m604-check').click();
  await expect(result(page)).toHaveAttribute('data-status','clarify'); await expect(result(page)).toContainText('kein nachgewiesener biologischer Fehler');
  await expect(page.locator('[data-field-feedback="control"]')).toHaveAttribute('data-status','partial');
});

test('three explicit help levels do not insert answers, survive context changes and invalidate result evidence',async ({ page },info) => {
  await open(page); await complete(page);
  for (const level of [1,2,3]) {
    const before = await page.locator('input:checked').evaluateAll(inputs => inputs.map(el => (el as HTMLInputElement).id));
    await page.locator(`#m604-help-${level}`).click();
    expect(await page.locator('input:checked').evaluateAll(inputs => inputs.map(el => (el as HTMLInputElement).id))).toEqual(before);
    await expect(result(page)).toHaveAttribute('data-status','stale'); await page.locator('#m604-check').click(); await expect(result(page)).toHaveAttribute('data-status','correct');
  }
  await expect(support(page)).toContainText('Vergleichslösung angesehen'); await shot(page,info,'m604-help','.learning-helpers');
  await page.locator('#m604-case').click(); await expect(page.locator('input:checked')).toHaveCount(0); await expect(support(page)).toContainText('Vergleichslösung angesehen');
  await page.locator('#m604-reset').click(); await expect(support(page)).toContainText('Vergleichslösung angesehen');
});

test('actual prior exercise help is attributed and route changes preserve volatile writing and answers',async ({ page }) => {
  await open(page); await page.locator('#m604-prediction').fill('Synthetischer Vorhersageentwurf'); await choose(page,'hypothesis',['loss_prediction']);
  await page.getByRole('link',{name:'Ursache und Wirkung verknüpfen (M6.03)',exact:true}).click();
  await page.getByRole('button',{name:'Begründete Vergleichslösung ausdrücklich ansehen',exact:true}).click();
  await page.getByRole('link',{name:'Weitere Übung: Kontrolle und Rücktausch',exact:true}).click();
  await expect(page.locator('#m604-prediction')).toHaveValue('Synthetischer Vorhersageentwurf'); await expect(page.locator('#m604-hypothesis-loss_prediction')).toBeChecked();
  await expect(support(page)).toContainText('Vergleichslösung angesehen'); await support(page).locator('summary').click(); await expect(support(page)).toContainText('M6.03');
});

test('free writing is literal, ungraded and volatile; no answer, help or text telemetry or new persistence',async ({ page }) => {
  await open(page); await page.evaluate(() => localStorage.setItem('foreign.test','untouched'));
  await complete(page); await step(page,6);
  const text = '<img src=x onerror="document.body.dataset.leak=1"> Freier Plan: Zelltod ist sicher.';
  await page.locator('#m604-writing').fill(text); await page.locator('.investigation-rubric input').first().check();
  await expect(result(page)).toHaveAttribute('data-status','correct'); await expect(result(page)).not.toContainText(text);
  expect(await page.locator('body').getAttribute('data-leak')).toBeNull(); await expect(page.locator('img[src="x"]')).toHaveCount(0);
  const storage = await page.evaluate(() => ({ local: Object.entries(localStorage), session: Object.entries(sessionStorage) }));
  expect(storage).toEqual({ local:[['foreign.test','untouched']],session:[] });
  await page.reload(); await expect(result(page)).toHaveAttribute('data-status','empty'); await step(page,6); await expect(page.locator('#m604-writing')).toHaveValue('');
  await expect(support(page)).toContainText('Frühere Hilfehistorie nicht gesichert'); expect(await page.evaluate(() => localStorage.getItem('foreign.test'))).toBe('untouched');
});

for (const caseId of ['recovery','limited'] as const) for (const hypothesis of ['loss_prediction','return_prediction']) {
  test(`M604R1 ${caseId}/${hypothesis}: volume hypothesis requires volume and allows supplementary detachment`, async ({page},info) => {
    await open(page); if (caseId === 'limited') await press(page,page.locator('#m604-case'));
    const answer = {...fixtures.complete,...(caseId === 'limited' ? fixtures.limitedOverrides : {}),hypothesis:[hypothesis],dependent:['detached_fraction']};
    await complete(page,answer);
    const coherence = page.locator('[data-criterion-feedback="M6.04.C18"]');
    await expect(result(page)).toHaveAttribute('data-status','partial'); await expect(result(page)).toHaveAttribute('data-color','yellow');
    await expect(coherence).toHaveAttribute('data-status','partial'); await expect(coherence).toHaveAttribute('data-color','yellow');
    await expect(coherence).toContainText('Ergänze das relative Protoplastvolumen'); await expect(coherence).toContainText('Ablösungsanteil');
    await expect(page.locator('[data-field-feedback="hypothesis"]')).toHaveAttribute('data-status','correct');
    await expect(page.locator('[data-field-feedback="dependent"]')).toHaveAttribute('data-status','correct');
    await expect(page.locator('[data-field-feedback][data-status="correct"]')).toHaveCount(17);
    await expect(support(page)).toContainText('Kein aktueller Erfolgsbeleg');
    await shot(page,info,`m604-r1-${caseId}-${hypothesis}-partial`,'.investigation-feedback');
    await press(page,coherence.getByRole('button'));
    await expect(page.locator('#m604-dependent-relative_volume')).toBeFocused();
    await expect(page.locator('#m604-dependent-relative_volume')).toHaveAttribute('type','checkbox');
    await choose(page,'dependent',['relative_volume','detached_fraction']);
    await expect(result(page)).toHaveAttribute('data-status','stale'); await press(page,page.locator('#m604-check'));
    await expect(result(page)).toHaveAttribute('data-status','correct'); await expect(coherence).toHaveAttribute('data-status','correct');
    await expect(page.locator('[data-criterion-feedback][data-status="correct"]')).toHaveCount(18);
    await expect(support(page)).toContainText('Aktueller geprüfter Sitzungsbeleg');
    await expect(coherence).toContainText('Prüfbarkeit bedeutet nicht');
    await step(page,1); await choose(page,'dependent',['relative_volume']); await press(page,page.locator('#m604-check'));
    await expect(result(page)).toHaveAttribute('data-color','green'); await expect(coherence).toHaveAttribute('data-status','correct');
  });
  test(`M604R1 ${caseId}/${hypothesis}: missing, unsure and contradictory measurements retain specific feedback`, async ({page}) => {
    await open(page); if (caseId === 'limited') await press(page,page.locator('#m604-case'));
    await complete(page,{...fixtures.complete,...(caseId === 'limited' ? fixtures.limitedOverrides : {}),hypothesis:[hypothesis]});
    for (const [values,overall,field,cross] of [
      [[], 'partial','empty','partial'], [['unsure'],'clarify','clarify','clarify'],
      [['relative_volume','solution_sequence'],'incorrect','incorrect','partial'],
    ] as const) {
      await step(page,1); await choose(page,'dependent',values); await press(page,page.locator('#m604-check'));
      await expect(result(page)).toHaveAttribute('data-status',overall);
      const measurement = page.locator('[data-field-feedback="dependent"]');
      await expect(measurement).toHaveAttribute('data-status',field);
      await expect(page.locator('[data-criterion-feedback="M6.04.C18"]')).toHaveAttribute('data-status',cross);
      await expect(page.locator('[data-field-feedback="hypothesis"]')).toHaveAttribute('data-status','correct');
      await expect(support(page)).toContainText('Kein aktueller Erfolgsbeleg');
      if (overall === 'incorrect') {
        await press(page,measurement.locator('summary')); await expect(measurement).toContainText('unabhängige Größe');
        await expect(measurement.locator('[data-color="green"]')).toHaveCount(1);
        await expect(measurement.locator('[data-color="red"]')).toHaveCount(1);
      }
    }
  });
}

test('keyboard alone completes the investigation, opens findings, uses help and writes without focus injection',async ({ page,browserName },info) => {
  await page.goto('./#/m604'); await expect(page.getByRole('heading',{level:1})).toBeFocused();
  const tab = browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab';
  async function tabTo(target: Locator) {
    for (let attempt = 0; attempt < 160; attempt++) {
      if (await target.evaluate(el => el === document.activeElement)) return;
      await page.keyboard.press(tab);
    }
    throw new Error(`Unreachable by ${tab}: ${await target.getAttribute('id')}`);
  }
  for (let index = 0; index < steps.length; index++) {
    const nav = page.getByRole('navigation',{name:'Schritte der Untersuchung'}).getByRole('button').nth(index);
    await tabTo(nav); await page.keyboard.press('Enter');
    if (index === 3) { await tabTo(page.locator('#m604-reveal')); await page.keyboard.press('Enter'); }
    for (const field of steps[index]!) {
      const values = (fixtures.complete as Answer)[field]!, group = page.locator(`fieldset[data-field="${field}"]`);
      if (await group.locator('input').first().getAttribute('type') === 'radio') {
        await tabTo(group.locator('input').first()); await page.keyboard.press('Space');
        for (let turns = 0; await group.locator('input:checked').inputValue() !== values[0]; turns++) {
          if (turns > 12) throw new Error('Radio target not reachable.'); await page.keyboard.press('ArrowDown');
        }
      } else for (const value of values) { await tabTo(page.locator(`#m604-${field}-${value}`)); await page.keyboard.press('Space'); }
    }
  }
  await tabTo(page.locator('#m604-check')); await page.keyboard.press('Enter'); await expect(result(page)).toHaveAttribute('data-status','correct'); await expect(result(page)).toBeFocused();
  await tabTo(page.locator('#m604-help-1')); await page.keyboard.press('Enter'); await expect(result(page)).toHaveAttribute('data-status','stale');
  const last = page.getByRole('navigation',{name:'Schritte der Untersuchung'}).getByRole('button').nth(6); await tabTo(last); await page.keyboard.press('Enter');
  await tabTo(page.locator('#m604-writing')); await page.keyboard.type('Eigener unbewerteter Versuchsplan.'); await expect(page.locator('#m604-writing')).toHaveValue('Eigener unbewerteter Versuchsplan.');
  expect(await page.locator('#m604-writing').evaluate(el => getComputedStyle(el).outlineStyle)).not.toBe('none');
  await shot(page,info,'m604-keyboard-writing');
});

test('200 percent text and narrow fallback keep planning, data, feedback and writing usable',async ({ page },info) => {
  await open(page); await complete(page);
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  for (const index of [0,2,3,6]) {
    await step(page,index);
    const metrics = await page.locator('.investigation-step:not([hidden])').evaluate(panel => ({
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      clipped: [...panel.querySelectorAll<HTMLElement>('fieldset, legend, label, textarea, .investigation-series')].filter(el => el.getClientRects().length && (el.scrollWidth > el.clientWidth + 1)).map(el => el.tagName),
      fonts: [...panel.querySelectorAll('.investigation-option span')].map(el => parseFloat(getComputedStyle(el).fontSize)),
      rootFont: parseFloat(getComputedStyle(document.documentElement).fontSize),
    }));
    expect(metrics.overflow).toBe(false); expect(metrics.clipped).toEqual([]); expect(metrics.fonts.every(f => f >= metrics.rootFont)).toBe(true);
    await shot(page,info,`m604-step-${index}-200`);
  }
  await page.setViewportSize({width:320,height:844}); await page.evaluate(() => { document.documentElement.style.fontFamily = '"DejaVu Sans", sans-serif'; });
  await step(page,3); expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true); await shot(page,info,'m604-320-data-200');
  await step(page,6); await expect(page.locator('.investigation-rubric h3').first()).toHaveText('Hypothese prüfbar machen');
  await shot(page,info,'m604-r1-320-writing-200');
  await shot(page,info,'m604-r1-320-first-rubric-200','.investigation-rubric > li:first-child');
  await page.locator('#m604-writing').fill('Auch mit großer Schrift bearbeitbar.'); await expect(result(page)).toHaveAttribute('data-status','correct');
});
