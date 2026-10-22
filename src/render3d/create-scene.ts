import { Scene } from 'three';

/** Empty adapter entry point. No biological state, WebGL context or loop in P00. */
export function createScene(): Scene {
  const scene = new Scene();
  scene.name = 'zelllabor11';
  return scene;
}
