import { createM602Learning } from './m602-learning.ts';
import { mountM602Learning } from '../ui/m602-learning.ts';

/** Lazy production entry; internal regression labs remain excluded by Vite. */
export function createM602View(): HTMLElement {
  const view = document.createElement('div');
  mountM602Learning(view, createM602Learning());
  return view;
}
