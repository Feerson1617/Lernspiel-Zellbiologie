import { renderStartPage } from '../ui/start-page.ts';

/** Hash routes work under GitHub Pages without server-side rewrite rules.
 * Keep the learning view and its volatile ledger alive when returning home. */
export function startApplication(root: HTMLElement): void {
  let pending: Promise<typeof import('./m602-entry.ts')> | undefined;
  let route = '', sequence = 0;
  async function render() {
    const next = location.hash === '#/m1002' ? 'm1002' : location.hash === '#/m1001' ? 'm1001' : location.hash === '#/m604' ? 'm604' : location.hash === '#/m603' ? 'm603' : location.hash.startsWith('#/m602') ? 'm602' : 'home';
    if (route === next) return;
    route = next;
    const request = ++sequence;
    if (next === 'home') { renderStartPage(root); return; }
    root.innerHTML = '<main id="inhalt"><p role="status">Die Übung wird geladen …</p><a href="#/">Zur Startseite</a></main>';
    let entry: typeof import('./m602-entry.ts');
    try {
      pending ??= import('./m602-entry.ts'); entry = await pending;
    } catch {
      pending = undefined;
      if (request === sequence) { route = ''; root.innerHTML = '<main id="inhalt"><h1>Die Übung konnte nicht geladen werden.</h1><p>Dein Lernstand wird dadurch nicht überschrieben. Kehre zur Startseite zurück und öffne die Übung erneut.</p><a href="#/">Zur Startseite</a></main>'; }
      return;
    }
    if (request === sequence) {
      const view = next === 'm1002' ? entry.createM1002View() : next === 'm1001' ? entry.createM1001View() : next === 'm604' ? entry.createM604View() : next === 'm603' ? entry.createM603View() : entry.createM602View();
      root.replaceChildren(view);
      view.querySelector<HTMLElement>('h1')?.focus();
      window.scrollTo(0, 0);
    }
  }
  window.addEventListener('hashchange', () => { void render(); });
  void render();
}
