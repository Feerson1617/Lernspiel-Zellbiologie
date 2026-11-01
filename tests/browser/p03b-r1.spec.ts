import { expect, test } from '@playwright/test';
import type { Page, TestInfo } from '@playwright/test';
import { readPngRaster } from '../helpers/png-raster.ts';

const edges = [['A','B','causes'], ['A','C','causes'], ['B','D','enables_if'], ['C','D','requires_zero'], ['B','C','coupled'], ['C','B','coupled'], ['A','D','possible_together']] as const;
const text = {
  A: 'Wasserverlust', B: 'Abnehmendes Vakuolen-/Protoplastvolumen', C: 'Sinkender Turgor',
  D: 'Bei hinreichendem Wasserverlust mögliche Ablösung des Protoplasten von der Zellwand',
};
const problems = new WeakMap<Page, string[]>();
test.beforeEach(async ({ page, baseURL }) => {
  const errors: string[] = []; problems.set(page, errors);
  page.on('pageerror', error => errors.push(error.message));
  page.on('requestfailed', request => errors.push(request.url()));
  page.on('request', request => { if (!request.url().startsWith(baseURL!)) errors.push(`External: ${request.url()}`); });
  page.on('response', response => { if (response.status() >= 400) errors.push(`HTTP ${response.status()}`); });
  await page.goto('./#/m603'); await page.locator('#causal-from').waitFor();
});
test.afterEach(async ({ page }) => { expect(problems.get(page)).toEqual([]); });
async function add(page: Page, edge: readonly [string, string, string]) {
  await page.locator('#causal-from').selectOption(edge[0]); await page.locator('#causal-to').selectOption(edge[1]);
  await page.locator('#causal-relation').selectOption(edge[2]); await page.locator('#causal-add').click();
}
async function allSeven(page: Page) { for (const edge of edges) await add(page, edge); await page.locator('#causal-check').click(); }
async function frame(page: Page, zoom: number, layout: string) {
  await page.evaluate(size => { document.documentElement.style.fontSize = `${size}%`; }, zoom);
  if (await page.locator('.causal-board').getAttribute('data-layout') !== layout) await page.getByRole('button', { name: 'Karten anders anordnen', exact: true }).click();
  // Wait for actual ResizeObserver projection, without changing any timeout.
  await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
}
async function image(page: Page, info: TestInfo, name: string) {
  const path = info.outputPath(`${name}.png`); await page.locator('.causal-figure').screenshot({ path });
  await info.attach(name, { path, contentType: 'image/png' });
}

test('R1 F01: all seven arrows paint below opaque, readable number badges and retain visible tips', async ({ page }, info) => {
  await allSeven(page);
  const observations = [];
  for (const zoom of [100, 200]) for (const layout of ['default', 'alternate']) {
    await frame(page, zoom, layout);
    const metrics = await page.locator('.causal-board').evaluate(board => {
      const svg = board.querySelector<SVGSVGElement>('svg')!, rect = svg.getBoundingClientRect();
      const paths = [...svg.querySelectorAll<SVGPathElement>('path[data-from]')];
      const circles = [...svg.querySelectorAll<SVGCircleElement>('circle')];
      const lines = svg.querySelector('[data-layer="connections"]'), numbers = svg.querySelector('[data-layer="numbers"]');
      const paintOrderCorrect = !!lines && !!numbers && !!(lines.compareDocumentPosition(numbers) & Node.DOCUMENT_POSITION_FOLLOWING)
        && paths.every(path => lines.contains(path)) && circles.every(circle => numbers.contains(circle));
      const badges = circles.map(circle => ({ x: +circle.getAttribute('cx')!, y: +circle.getAttribute('cy')!, radius: +circle.getAttribute('r')!, number: circle.nextElementSibling?.textContent }));
      const compact = board.dataset['presentation'] === 'compact';
      const targets = [...board.querySelectorAll<HTMLElement>(compact ? '[data-map-node]' : '.causal-node')];
      const boxes = targets.map(el => ({ id: el.dataset['mapNode'] ?? el.dataset['node'], box: el.getBoundingClientRect() }));
      const inside: string[] = [], endpoints: string[] = [];
      const tips = paths.map(path => {
        const length = path.getTotalLength(), end = path.getPointAtLength(length), previous = path.getPointAtLength(Math.max(0, length - 1)), start = path.getPointAtLength(0);
        const dx = end.x - previous.x, dy = end.y - previous.y, scale = Math.hypot(dx, dy);
        for (const [id, point] of [[path.dataset['from'], start], [path.dataset['to'], end]] as const) {
          const target = boxes.find(item => item.id === id)!.box, x = point.x + rect.x, y = point.y + rect.y;
          const distance = Math.hypot(x - Math.max(target.left, Math.min(target.right, x)), y - Math.max(target.top, Math.min(target.bottom, y)));
          if (distance < 1 || distance > 6) endpoints.push(`${path.dataset['from']}/${path.dataset['to']}`);
        }
        for (let step = 0; step <= 60; step++) {
          const point = path.getPointAtLength(length * step / 60), x = point.x + rect.x, y = point.y + rect.y;
          if (boxes.some(item => x > item.box.left + 1 && x < item.box.right - 1 && y > item.box.top + 1 && y < item.box.bottom - 1)) inside.push(`${path.dataset['from']}/${path.dataset['to']}`);
        }
        return { from: path.dataset['from'], to: path.dataset['to'], relation: path.dataset['relation'], marker: path.getAttribute('marker-end'), x: end.x, y: end.y, dx: dx / scale, dy: dy / scale };
      });
      return { width: rect.width, height: rect.height, paintOrderCorrect, badges, tips, inside, endpoints };
    });
    const png = await page.locator('.causal-arrows').screenshot(), raster = readPngRaster(png);
    const sx = raster.width / metrics.width, sy = raster.height / metrics.height;
    const pixel = (x: number, y: number) => raster.rgb(Math.round(x * sx), Math.round(y * sy));
    const darkBadgeSamples: string[] = [], hiddenTips: string[] = [];
    for (const badge of metrics.badges) for (let step = 0; step < 64; step++) {
      const angle = step * Math.PI / 32, radius = badge.radius - 3;
      if (pixel(badge.x + Math.cos(angle) * radius, badge.y + Math.sin(angle) * radius).some(value => value < 220)) darkBadgeSamples.push(`${badge.number}/${step}`);
    }
    for (const tip of metrics.tips) {
      for (const side of [-2, 2]) {
        const rgb = pixel(tip.x - tip.dx * 6 - tip.dy * side, tip.y - tip.dy * 6 + tip.dx * side);
        if (rgb.every(value => value > 190)) hiddenTips.push(`${tip.from}/${tip.to}/${side}`);
      }
    }
    observations.push({ zoom, layout, ...metrics, darkBadgeSamples, hiddenTips });
    await image(page, info, `r1-paint-${layout}-${zoom}`);
  }
  await info.attach('r1-paint-observations.json', { body: JSON.stringify(observations, null, 2), contentType: 'application/json' });
  for (const observed of observations) {
    expect(observed.paintOrderCorrect, `${observed.layout}/${observed.zoom}: SVG layers`).toBe(true);
    expect(observed.badges.map(badge => badge.number)).toEqual(['1','2','3','4','5','6','7']);
    expect(observed.darkBadgeSamples, `${observed.layout}/${observed.zoom}: painted number backgrounds`).toEqual([]);
    expect(observed.hiddenTips, `${observed.layout}/${observed.zoom}: arrowhead pixels`).toEqual([]);
    expect(observed.inside).toEqual([]); expect(observed.endpoints).toEqual([]);
    expect(observed.tips.map(tip => [tip.from, tip.to, tip.relation])).toEqual(edges);
    expect(observed.tips.every(tip => tip.marker?.includes('causal-arrow-tip'))).toBe(true);
  }
  // The original maximum remains available, even for a redundant draft.
  for (let index = 7; index < 24; index++) await add(page, edges[0]);
  await expect(page.locator('.causal-arrows path[data-from]')).toHaveCount(24);
});

test('R1 F02: full statements and scientific words remain readable at both text sizes and layouts', async ({ page }, info) => {
  await allSeven(page);
  const observations = [];
  for (const zoom of [100, 200]) for (const layout of ['default', 'alternate']) {
    await frame(page, zoom, layout);
    const observed = await page.locator('.causal-board').evaluate(board => {
      const fragments: string[] = [], clipping: string[] = [], cards: { id: string; text: string; font: number; height: number; width: number }[] = [];
      const elements = [...board.querySelectorAll<HTMLElement>('.causal-node > span:last-child'), ...document.querySelectorAll<HTMLElement>('.causal-edge-text')];
      for (const element of elements) {
        const child = element.firstChild!;
        for (const word of element.textContent!.matchAll(/[A-Za-zÄÖÜäöüß]+/g)) {
          const range = document.createRange(); range.setStart(child, word.index); range.setEnd(child, word.index + word[0].length);
          if (range.getClientRects().length > 1) fragments.push(word[0]);
        }
      }
      for (const element of board.querySelectorAll<HTMLElement>('.causal-node')) {
        const rect = element.getBoundingClientRect(), font = Number.parseFloat(getComputedStyle(element).fontSize);
        if (element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth) clipping.push(element.dataset['node']!);
        cards.push({ id: element.dataset['node']!, text: element.lastElementChild!.textContent!, font, height: rect.height, width: rect.width });
      }
      return { cards, fragments, clipping, rootFont: Number.parseFloat(getComputedStyle(document.documentElement).fontSize), overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth, presentation: board.dataset['presentation'] };
    });
    observations.push({ zoom, layout, ...observed }); await image(page, info, `r1-reading-${layout}-${zoom}`);
  }
  await info.attach('r1-reading-observations.json', { body: JSON.stringify(observations, null, 2), contentType: 'application/json' });
  for (const observed of observations) {
    expect(observed.fragments, `${observed.layout}/${observed.zoom}: split words`).toEqual([]);
    expect(observed.clipping).toEqual([]); expect(observed.overflow).toBe(false);
    for (const card of observed.cards) {
      expect(card.text).toBe(text[card.id as keyof typeof text]); expect(card.font).toBeGreaterThanOrEqual(observed.rootFont);
      expect(card.height / card.font, `${card.id}: natural card height`).toBeLessThanOrEqual(20);
    }
    if (observed.presentation === 'compact') await expect(page.locator('.causal-compact-map')).toContainText('A');
  }
  await expect(page.getByRole('region', { name: 'Rückmeldung zum Kausalnetz', exact: true })).toHaveAttribute('data-status', 'correct');
  await page.getByRole('button', { name: 'Verbindung 7 bearbeiten', exact: true }).click(); await expect(page.locator('#causal-from')).toBeFocused();
});
