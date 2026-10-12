import { CONFIG } from './config.js';

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const sizePx = CONFIG.GRID_SIZE * CONFIG.CELL_SIZE;
canvas.width = sizePx;
canvas.height = sizePx;

let tickCount = 0;
let lastTime = performance.now();
let accumulator = 0;

function update() {
  tickCount++;
}

function render() {
  ctx.fillStyle = CONFIG.COLORS.BACKGROUND;
  ctx.fillRect(0, 0, sizePx, sizePx);

  ctx.strokeStyle = CONFIG.COLORS.GRID;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 1; i < CONFIG.GRID_SIZE; i++) {
    const pos = i * CONFIG.CELL_SIZE + 0.5;
    ctx.moveTo(pos, 0);
    ctx.lineTo(pos, sizePx);
    ctx.moveTo(0, pos);
    ctx.lineTo(sizePx, pos);
  }
  ctx.stroke();

  ctx.fillStyle = CONFIG.COLORS.TEXT;
  ctx.font = '16px monospace';
  ctx.fillText(`ticks: ${tickCount}`, 10, 24);
}

function frame(now) {
  const delta = Math.min(now - lastTime, CONFIG.MAX_FRAME_MS);
  lastTime = now;
  accumulator += delta;

  while (accumulator >= CONFIG.TICK_MS) {
    update();
    accumulator -= CONFIG.TICK_MS;
  }

  render();
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);