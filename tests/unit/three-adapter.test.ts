import { expect, it } from 'vitest';
import { createScene } from '../../src/render3d/create-scene.ts';

it('provides independent, empty Three.js scene roots without a DOM or biological state', () => {
  const scene = createScene();
  expect(scene.isScene).toBe(true);
  expect(scene.name).toBe('zelllabor11');
  expect(scene.children).toEqual([]);
  expect(scene).not.toBe(createScene());
});
