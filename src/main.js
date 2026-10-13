import { CONFIG } from './config.js';
import { Renderer } from './renderer.js';
import { Game } from './game.js';
import { Input } from './input.js';

const canvas = document.getElementById('game-canvas');
const renderer = new Renderer(canvas);
const game = new Game();
const scoreElement = document.getElementById('score');
let displayedScore = 0;
new Input((direction) => game.turn(direction));

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

    const { score } = game.state;
  if (score !== displayedScore) {
    scoreElement.textContent = score;
    displayedScore = score;
  }

  renderer.render(game.state);
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);