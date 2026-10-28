import type { OsmosisMaterial } from '../assessment/osmosis-context.ts';

/** Static topology only. Values come from the application's validated context.
 * Line endpoints label structures; they are not movement arrows. */
export function renderOnionCell(parent: HTMLElement, material: OsmosisMaterial): void {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 420 390');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-labelledby', 'onion-title');
  svg.setAttribute('aria-describedby', 'onion-description');
  svg.classList.add('onion-schema');
  function shape(tag: string, attrs: Record<string, string>, text = '') {
    const item = document.createElementNS(ns, tag);
    for (const [key, value] of Object.entries(attrs)) item.setAttribute(key, value);
    item.textContent = text; svg.append(item); return item;
  }
  shape('title', { id: 'onion-title' }, 'Zwiebel-Epidermiszelle: drei Räume und ihre Grenzen');
  shape('desc', { id: 'onion-description' }, 'Die Zellwand liegt außen. Die Zellmembran begrenzt den Zellinhalt gegen den Außenraum. Im Cytosol liegt die Vakuole, umschlossen vom Tonoplasten. Keine Bewegung oder zeitliche Veränderung dargestellt. Die drei Gesamtwasserpotenziale stehen zusätzlich in der Materialtabelle.');
  shape('rect', { x: '2', y: '2', width: '416', height: '386', rx: '20', fill: '#eaf2ee' });
  shape('rect', { x: '64', y: '88', width: '288', height: '250', rx: '33', fill: '#eaf2ee', stroke: '#8b9562', 'stroke-width': '10' });
  shape('rect', { x: '75', y: '99', width: '266', height: '228', rx: '26', fill: '#f7edce', stroke: '#315c4b', 'stroke-width': '3' });
  shape('rect', { x: '111', y: '170', width: '194', height: '126', rx: '35', fill: '#d5e9ed', stroke: '#477786', 'stroke-width': '3' });
  const label = (x: number, y: number, value: string, cls = '') => shape('text', { x: String(x), y: String(y), 'text-anchor': 'middle', class: cls }, value);
  label(242, 34, 'Außenraum', 'schema-region');
  label(242, 58, `${material.waterPotential.external} Pa`, 'schema-value');
  label(208, 128, 'Cytosol', 'schema-region');
  label(208, 151, `${material.waterPotential.cytosol} Pa`, 'schema-value');
  label(208, 222, 'Vakuole', 'schema-region');
  label(208, 247, `${material.waterPotential.vacuole} Pa`, 'schema-value');
  shape('path', { d: 'M64 150 L31 69 L31 46 M340 151 L385 108 L385 92 M304 267 L370 313 L370 344', class: 'schema-label-line', fill: 'none' });
  label(54, 33, 'Zellwand', 'schema-label');
  label(348, 81, 'Zellmembran', 'schema-label');
  label(353, 368, 'Tonoplast', 'schema-label');
  parent.append(svg);
}
