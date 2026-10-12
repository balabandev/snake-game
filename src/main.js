import { CONFIG } from './config.js';
import { Renderer } from './renderer.js';
import { Game } from './game.js';

const canvas = document.getElementById('game-canvas');
const renderer = new Renderer(canvas);
const game = new Game();

let lastTime = performance.now();
let accumulator = 0;

function frame(now) {
  const delta = Math.min(now - lastTime, CONFIG.MAX_FRAME_MS);
  lastTime = now;
  accumulator += delta;

  while (accumulator >= CONFIG.TICK_MS) {
    game.tick();
    accumulator -= CONFIG.TICK_MS;
  }

  renderer.render(game.state);
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);