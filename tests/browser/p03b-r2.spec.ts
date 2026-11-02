import { expect, test } from '@playwright/test';
import type { Page, TestInfo } from '@playwright/test';

const seven = [['A','B','causes'], ['A','C','causes'], ['B','D','enables_if'], ['C','D','requires_zero'], ['B','C','coupled'], ['C','B','coupled'], ['A','D','possible_together']] as const;
async function add(page: Page, edge: readonly string[]) {
  await page.locator('#causal-from').selectOption(edge[0]!);
  await page.locator('#causal-to').selectOption(edge[1]!);
  await page.locator('#causal-relation').selectOption(edge[2]!);
  await page.locator('#causal-add').click();
}
async function settle(page: Page) {
  await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
}
async function capture(page: Page, info: TestInfo, name: string) {
  const path = info.outputPath(`${name}.png`);
  await page.locator('.causal-figure').screenshot({ path });
  await info.attach(name, { path, contentType: 'image/png' });
}
for (const count of [7, 8, 12, 24]) for (const kind of (count === 7 ? ['valid'] : ['redundant', 'mixed'])) {
  test(`R2 dense map: ${count} ${kind} connections retain every answer and stay inside both layouts`, async ({ page }, info) => {
    await page.goto('./#/m603');
    const edges: readonly string[][] = Array.from({ length: count }, (_, i) => {
      if (kind === 'redundant') return [...seven[0]];
      if (i < 7) return [...seven[i]!];
      // Includes opposite direction and several meanings on the same pair.
      return [...[['B','A','causes'], ['A','B','prevents'], ['A','B','coupled'], ...seven][(i - 7) % 10]!];
    });
    for (const edge of edges) await add(page, edge);
    await page.locator('#causal-check').click();
    const feedback = page.locator('.causal-feedback');
    await expect(feedback).toHaveAttribute('data-status', kind === 'valid' ? 'correct' : kind === 'redundant' ? 'clarify' : 'incorrect');
    const observations = [];
    for (const zoom of [100, 200]) for (const layout of ['default', 'alternate']) {
      await page.evaluate(value => { document.documentElement.style.fontSize = `${value}%`; }, zoom);
      if (await page.locator('.causal-board').getAttribute('data-layout') !== layout) await page.getByRole('button', { name: 'Karten anders anordnen', exact: true }).click();
      await settle(page);
      const metrics = await page.locator('.causal-board').evaluate(board => {
        const svg = board.querySelector<SVGSVGElement>('.causal-arrows')!, bounds = svg.viewBox.baseVal;
        const outside: string[] = [];
        const paths = [...svg.querySelectorAll<SVGPathElement>('path[data-from]')];
        paths.forEach((path, index) => {
          const length = path.getTotalLength();
          for (let step = 0; step <= 100; step++) {
            const p = path.getPointAtLength(length * step / 100);
            if (p.x < 2 || p.y < 2 || p.x > bounds.width - 2 || p.y > bounds.height - 2) outside.push(`path ${index + 1}`);
          }
          const end = path.getPointAtLength(length);
          if (end.x < 8 || end.y < 8 || end.x > bounds.width - 8 || end.y > bounds.height - 8) outside.push(`tip ${index + 1}`);
        });
        for (const item of svg.querySelectorAll<SVGGraphicsElement>('circle, text')) {
          const r = item.getBBox();
          if (r.x < 1 || r.y < 1 || r.x + r.width > bounds.width - 1 || r.y + r.height > bounds.height - 1) outside.push(`${item.tagName} ${item.textContent}`);
        }
        const groups = [...board.querySelectorAll<HTMLElement>('[data-dense-group]')].map(row => ({
          indices: row.dataset['indices']!.split(',').map(Number), from: row.dataset['from'], to: row.dataset['to'], relation: row.dataset['relation'],
          text: row.textContent, overflow: row.scrollWidth > row.clientWidth,
        }));
        return { outside, groups, projection: paths.map(p => [p.dataset['from'], p.dataset['to'], p.dataset['relation']]),
          pageOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth };
      });
      observations.push({ zoom, layout, ...metrics });
      if (count === 24 || count === 7) await capture(page, info, `r2-${count}-${kind}-${layout}-${zoom}`);
    }
    await info.attach('dense-observations.json', { body: JSON.stringify(observations, null, 2), contentType: 'application/json' });
    for (const o of observations) {
      expect(o.outside, `${o.layout}/${o.zoom}: painted geometry`).toEqual([]);
      expect(o.pageOverflow).toBe(false); expect(o.projection).toEqual(edges);
      if (count > 7) {
        expect(o.groups.flatMap(g => g.indices).sort((a,b) => a-b)).toEqual(Array.from({ length: count }, (_, i) => i + 1));
        for (const group of o.groups) {
          expect(group.overflow).toBe(false);
          expect(group.text).toContain(`${group.indices.length}×`);
          for (const index of group.indices) expect([group.from, group.to, group.relation]).toEqual(edges[index - 1]);
        }
      }
    }
    await expect(page.locator('.causal-edge-list > li')).toHaveCount(count);
    for (let i = 1; i <= count; i++) await expect(page.getByRole('button', { name: `Verbindung ${i} bearbeiten`, exact: true })).toBeVisible();
    await page.getByRole('button', { name: `Verbindung ${count} bearbeiten`, exact: true }).click();
    await expect(page.locator('#causal-from')).toHaveValue(edges[count - 1]![0]!);
    const changedTarget = ['A','B','C','D'].find(id => id !== edges[count - 1]![0] && id !== edges[count - 1]![1])!;
    await page.locator('#causal-to').selectOption(changedTarget); await page.locator('#causal-add').click();
    await expect(feedback).toHaveAttribute('data-status', 'stale');
    await page.getByRole('button', { name: `Verbindung ${count} entfernen`, exact: true }).click();
    await expect(page.locator('.causal-edge-list > li')).toHaveCount(count - 1);
  });
}

test('R2 narrow text: 320 px, wide fallback and 200 percent retain all statements and joint conditions', async ({ page }, info) => {
  await page.setViewportSize({ width: 320, height: 844 }); await page.goto('./#/m603');
  for (const edge of seven) await add(page, edge);
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; document.documentElement.style.fontFamily = '"DejaVu Sans", sans-serif'; });
  const observations = [];
  for (const layout of ['default', 'alternate']) {
    if (await page.locator('.causal-board').getAttribute('data-layout') !== layout) await page.getByRole('button', { name: 'Karten anders anordnen', exact: true }).click();
    await settle(page);
    const observed = await page.evaluate(() => {
      const outside: string[] = [];
      for (const element of document.querySelectorAll<HTMLElement>('.causal-node, .causal-edge-list > li')) {
        if (element.scrollWidth > element.clientWidth + 1 || element.scrollHeight > element.clientHeight + 1) outside.push(element.textContent!);
        const bounds = element.getBoundingClientRect(), walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) {
          const range = document.createRange(); range.selectNodeContents(walker.currentNode);
          for (const rect of range.getClientRects()) if (rect.left < bounds.left - 1 || rect.right > bounds.right + 1) outside.push(walker.currentNode.textContent!);
        }
      }
      return { outside, overflow: document.documentElement.scrollWidth > innerWidth,
        cards: [...document.querySelectorAll('.causal-node')].map(el => ({ text: el.lastElementChild!.textContent!.replaceAll('\u00ad', ''), font: parseFloat(getComputedStyle(el).fontSize) })), rootFont: parseFloat(getComputedStyle(document.documentElement).fontSize) };
    });
    observations.push({ layout, ...observed }); await capture(page, info, `r2-320-wide-200-${layout}`);
  }
  await info.attach('narrow-observations.json', { body: JSON.stringify(observations, null, 2), contentType: 'application/json' });
  for (const o of observations) {
    expect(o.outside).toEqual([]); expect(o.overflow).toBe(false);
    expect(o.cards.map(c => c.text)).toEqual(['Wasserverlust', 'Abnehmendes Vakuolen-/Protoplastvolumen', 'Sinkender Turgor', 'Bei hinreichendem Wasserverlust mögliche Ablösung des Protoplasten von der Zellwand']);
    expect(o.cards.every(c => c.font >= o.rootFont)).toBe(true);
  }
  await page.locator('#causal-check').click();
  await expect(page.locator('.causal-feedback')).toHaveAttribute('data-status', 'correct');
  await expect(page.locator('.causal-edge-list')).toContainText('vollständigem Turgorverlust');
  await expect(page.locator('.causal-edge-list')).toContainText('Wasserverlust');
});
