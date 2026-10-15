import { CONFIG } from './config.js';
import { Game } from './game.js';
import { Hud } from './hud.js';
import { Input } from './input.js';
import { Renderer } from './renderer.js';
import { loadHighScore, saveHighScore } from './storage.js';
import { TouchInput } from './touch.js';

const canvas = document.getElementById('game-canvas');
const renderer = new Renderer(canvas);
const hud = new Hud();
const game = new Game();
let highScore = loadHighScore();

new Input({
  onDirection: (direction) => game.turn(direction),
  onRestart: () => game.restart(),
  onPause: () => game.togglePause(),
});

new TouchInput(canvas, {
  onDirection: (direction) => game.turn(direction),
  onTap: () => {
    if (game.state.status === CONFIG.STATUS.PAUSED) game.togglePause();
    else game.restart();
  },
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) game.pause();
});

let lastTime = performance.now();
let accumulator = 0;

function updateHighScore(score) {
  if (score <= highScore) return;
  highScore = score;
  saveHighScore(highScore);
}

function frame(now) {
  const delta = Math.min(now - lastTime, CONFIG.MAX_FRAME_MS);
  lastTime = now;
  accumulator += delta;

  while (accumulator >= game.tickMs) {
    accumulator -= game.tickMs;
    game.tick();
  }

  const state = game.state;
  updateHighScore(state.score);
  hud.update(state.score, highScore);
  renderer.render(state);

  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);