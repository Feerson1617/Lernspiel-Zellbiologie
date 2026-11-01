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
      const svg = board.querySelector<SVGSVGElement>('svg')!, rect = board.getBoundingClientRect();
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
    const svg = page.locator('.causal-arrows'), capture = page.locator('.causal-board');
    // HTML bounds remain stable across engines and visibility changes in SVG.
    const png = await capture.screenshot(), raster = readPngRaster(png);
    // Actual raster comparisons, including glyph pixels. Hiding the lines must
    // not change any badge interior. A second reference isolates marker paint.
    await svg.locator('path[data-from]').evaluateAll(paths => paths.forEach(path => { (path as SVGPathElement).style.visibility = 'hidden'; }));
    const withoutLines = readPngRaster(await capture.screenshot());
    await svg.locator('path[data-from]').evaluateAll(paths => paths.forEach(path => { (path as SVGPathElement).style.visibility = ''; (path as SVGPathElement).style.markerEnd = 'none'; }));
    const withoutMarkers = readPngRaster(await capture.screenshot());
    await svg.locator('path[data-from]').evaluateAll(paths => paths.forEach(path => { (path as SVGPathElement).style.markerEnd = ''; }));
    const sx = raster.width / metrics.width, sy = raster.height / metrics.height;
    expect([withoutLines.width, withoutLines.height]).toEqual([raster.width, raster.height]);
    expect([withoutMarkers.width, withoutMarkers.height]).toEqual([raster.width, raster.height]);
    const pixel = (source: ReturnType<typeof readPngRaster>, x: number, y: number) => {
      const px = Math.round(x * sx), py = Math.round(y * sy);
      if (px < 0 || py < 0 || px >= source.width || py >= source.height) throw new Error(`${layout}/${zoom}: sample ${px},${py} outside ${source.width}×${source.height}; SVG ${metrics.width}×${metrics.height}`);
      return source.rgb(px, py);
    };
    const changed = (source: ReturnType<typeof readPngRaster>, x: number, y: number) => pixel(raster, x, y).some((value, channel) => Math.abs(value - pixel(source, x, y)[channel]!) > 24);
    const darkBadgeSamples: string[] = [], hiddenTips: string[] = [];
    for (const badge of metrics.badges) for (let y = -Math.floor(badge.radius - 2); y <= badge.radius - 2; y++) for (let x = -Math.floor(badge.radius - 2); x <= badge.radius - 2; x++) {
      if (Math.hypot(x, y) <= badge.radius - 2 && changed(withoutLines, badge.x + x, badge.y + y)) darkBadgeSamples.push(`${badge.number}/${x}/${y}`);
    }
    for (const tip of metrics.tips) {
      for (const side of [-1, 1]) {
        let markerPixels = 0;
        for (let back = 2; back <= 12; back++) for (let normal = 2; normal <= 7; normal++) {
          if (changed(withoutMarkers, tip.x - tip.dx * back - tip.dy * normal * side, tip.y - tip.dy * back + tip.dx * normal * side)) markerPixels++;
        }
        if (markerPixels < 4) hiddenTips.push(`${tip.from}/${tip.to}/${side}`);
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
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT), texts: Text[] = [];
        while (walker.nextNode()) texts.push(walker.currentNode as Text);
        const position = (offset: number, end = false): [Text, number] => {
          for (const child of texts) { if (offset < child.length || (end && offset === child.length)) return [child, offset]; offset -= child.length; }
          throw new Error('Missing text range.');
        };
        for (const word of element.textContent!.matchAll(/[A-Za-zÄÖÜäöüß]+/g)) {
          const range = document.createRange(); range.setStart(...position(word.index)); range.setEnd(...position(word.index + word[0].length, true));
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
  // CI's Linux system font is wider than this workspace's OpenAI Sans. Keep
  // whole scientific words within the list at 200 %, including that fallback.
  if (page.viewportSize()!.width === 390) {
    await page.evaluate(() => { document.documentElement.style.fontFamily = '"DejaVu Sans", sans-serif'; });
    await frame(page, 200, 'alternate');
    const fallback = await page.locator('.causal-edge-list').evaluate(list => {
      const box = list.getBoundingClientRect(), outside: string[] = [];
      for (const element of list.querySelectorAll('.causal-edge-text')) for (const word of element.textContent!.matchAll(/[A-Za-zÄÖÜäöüß]+/g)) {
        const range = document.createRange(); range.setStart(element.firstChild!, word.index); range.setEnd(element.firstChild!, word.index + word[0].length);
        for (const rect of range.getClientRects()) if (rect.left < box.left - 1 || rect.right > box.right + 1) outside.push(word[0]);
      }
      return { font: getComputedStyle(list).fontFamily, outside, pageWidth: document.documentElement.scrollWidth, viewport: innerWidth };
    });
    await info.attach('r1-fallback-font-observations.json', { body: JSON.stringify(fallback), contentType: 'application/json' });
    expect(fallback.outside).toEqual([]); expect(fallback.pageWidth).toBeLessThanOrEqual(fallback.viewport);
  }
  await expect(page.getByRole('region', { name: 'Rückmeldung zum Kausalnetz', exact: true })).toHaveAttribute('data-status', 'correct');
  await page.getByRole('button', { name: 'Verbindung 7 bearbeiten', exact: true }).click(); await expect(page.locator('#causal-from')).toBeFocused();
});
