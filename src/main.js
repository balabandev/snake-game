import { CONFIG } from './config.js';
import { Renderer } from './renderer.js';

const canvas = document.getElementById('game-canvas');
const renderer = new Renderer(canvas);

// ВРЕМЕННО: тестовое состояние. На этапе 3 его заменит модуль game.js
const state = {
  snake: [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ],
  food: { x: 15, y: 6 },
};

let lastTime = performance.now();
let accumulator = 0;

function update() {
  // пока пусто: логика появится на этапе 3
}

function frame(now) {
  const delta = Math.min(now - lastTime, CONFIG.MAX_FRAME_MS);
  lastTime = now;
  accumulator += delta;

  while (accumulator >= CONFIG.TICK_MS) {
    update();
    accumulator -= CONFIG.TICK_MS;
  }

  renderer.render(state);
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);