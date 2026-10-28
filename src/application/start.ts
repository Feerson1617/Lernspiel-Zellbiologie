import { renderStartPage } from '../ui/start-page.ts';

/** Hash routes work under GitHub Pages without server-side rewrite rules.
 * Keep the learning view and its volatile ledger alive when returning home. */
export function startApplication(root: HTMLElement): void {
  let view: HTMLElement | undefined;
  let pending: Promise<HTMLElement> | undefined;
  let route = '', sequence = 0;
  async function render() {
    const next = location.hash.startsWith('#/m602') ? 'm602' : 'home';
    if (route === next) return;
    route = next;
    const request = ++sequence;
    if (next === 'home') { renderStartPage(root); return; }
    if (!view) {
      root.innerHTML = '<main id="inhalt"><p role="status">Die Übung wird geladen …</p><a href="#/">Zur Startseite</a></main>';
      try {
        pending ??= import('./m602-entry.ts').then(module => module.createM602View());
        view = await pending;
      } catch {
        pending = undefined; route = '';
        if (request === sequence) root.innerHTML = '<main id="inhalt"><h1>Die Übung konnte nicht geladen werden.</h1><p>Dein Lernstand wird dadurch nicht überschrieben. Kehre zur Startseite zurück und öffne die Übung erneut.</p><a href="#/">Zur Startseite</a></main>';
        return;
      }
    }
    if (request === sequence) {
      root.replaceChildren(view);
      view.querySelector<HTMLElement>('h1')?.focus();
      window.scrollTo(0, 0);
    }
  }
  window.addEventListener('hashchange', () => { void render(); });
  void render();
}
