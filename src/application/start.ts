import { renderStartPage } from '../ui/start-page.ts';

/** P00 mounts the informational page; there is no mission state yet. */
export function startApplication(root: HTMLElement): void {
  renderStartPage(root);
}
