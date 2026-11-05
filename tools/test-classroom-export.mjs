import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';

const root = process.cwd();
const htmlPath = join(root, 'classroom-export/Zelllabor11-Backup.html');
const stage = join(root, 'classroom-export/scorm-stage');
const errors = [];
const browser = await chromium.launch({ headless: true });

async function verifyLoaded(page, context) {
  await page.getByRole('heading', { name: /Zelllabor 11/ }).first().waitFor({ timeout: 15000 });
  for (const route of ['m602', 'm603', 'm604', 'm1001', 'm1002', 'm702']) {
    const links = page.locator('a[href="#/' + route + '"]');
    assert((await links.count()) > 0, 'Missing route ' + route + ' on ' + context);
  }
  await page.locator('a[href="#/m702"]').first().click();
  await page.getByRole('heading', { name: /schnellere Stoffaufnahme/i }).first().waitFor({ timeout: 15000 });
  await page.locator('#m702-argument').fill('Ein eigener Testtext mit Vergleich und Aussagegrenze.');
  assert.match(await page.locator('#m702-argument').inputValue(), /eigener Testtext/);
}

try {
  const backupPage = await browser.newPage();
  backupPage.on('pageerror', e => errors.push('Backup JavaScript: ' + e.message));
  backupPage.on('request', req => {
    if (/^https?:\/\//i.test(req.url())) errors.push('Backup unexpected network request: ' + req.url());
  });
  await backupPage.goto(pathToFileURL(htmlPath).href);
  await verifyLoaded(backupPage, 'offline file');
  await backupPage.close();

  const server = createServer((req, res) => {
    const path = (req.url || '/').split('?')[0];
    if (path !== '/' && path !== '/index.html') {
      res.statusCode = 404;
      res.end('No external assets permitted');
      return;
    }
    res.setHeader('content-type', 'text/html; charset=utf-8');
    res.end(readFileSync(join(stage, 'index.html')));
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  try {
    const url = 'http://127.0.0.1:' + server.address().port + '/index.html';
    const scormPage = await browser.newPage();
    scormPage.on('pageerror', e => errors.push('SCORM JavaScript: ' + e.message));
    scormPage.on('request', req => {
      if (/^https?:\/\//.test(req.url()) && !req.url().startsWith(url)) errors.push('SCORM unexpected network request: ' + req.url());
    });
    await scormPage.addInitScript(() => {
      window.__scormCalls = [];
      window.API = {
        LMSInitialize: (arg) => { window.__scormCalls.push(['init', arg]); return 'true'; },
        LMSFinish: (arg) => { window.__scormCalls.push(['finish', arg]); return 'true'; },
        LMSSetValue: (...args) => { window.__scormCalls.push(['SETVALUE', ...args]); return 'true'; },
        LMSCommit: (...args) => { window.__scormCalls.push(['COMMIT', ...args]); return 'true'; },
      };
    });
    await scormPage.goto(url);
    await verifyLoaded(scormPage, 'SCORM launch');
    await scormPage.goto(url);
    await scormPage.evaluate(() => window.localStorage.setItem('zelllabor11.progress.v1', 'EXISTING_EXTERNAL_VALUE'));
    await scormPage.locator('a[href="#/m602"]').click();
    await scormPage.locator('#learner-process').fill('Osmose');
    await scormPage.locator('#learner-direction').fill('nach außen');
    await scormPage.locator('#learner-volume').fill('sinkt');
    await scormPage.getByRole('button', { name: 'Drei Antworten prüfen' }).click();
    const values = await scormPage.evaluate(() => ({
      storage: window.localStorage.getItem('zelllabor11.progress.v1'),
      calls: window.__scormCalls
    }));
    assert.equal(values.storage, 'EXISTING_EXTERNAL_VALUE', 'SCORM modified persistent progress');
    assert(values.calls.some(c => c[0] === 'init'), 'SCORM did not initialize');
    assert(values.calls.every(c => c[0] !== 'SETVALUE' && c[0] !== 'COMMIT'), 'SCORM tried to report learner data');
    await scormPage.goto(url + '#/m702');
    await scormPage.locator('#m702-argument').fill('Nicht dauerhaft gespeichert.');
    await scormPage.reload();
    assert.equal(await scormPage.locator('#m702-argument').inputValue(), '', 'SCORM persisted free answer after reload');
    await scormPage.close();
  } finally {
    server.close();
  }
  assert.deepEqual(errors, [], 'Browser export errors');
  console.log('EXPORT CHECK PASSED: standalone file, all six links, M7.02, SCORM API, no LMS values, no browser progress persistence, no external requests.');
} finally {
  await browser.close();
}