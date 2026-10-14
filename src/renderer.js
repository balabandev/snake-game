import { CONFIG } from './config.js';

const OVERLAY_OFFSET_Y = { TITLE: -24, SCORE: 12, HINT: 40 };

const OVERLAY_TEXT = {
  [CONFIG.STATUS.GAME_OVER]: { title: 'Игра окончена', hint: 'Пробел или Enter: заново' },
  [CONFIG.STATUS.WON]: { title: 'Победа!', hint: 'Пробел или Enter: заново' },
  [CONFIG.STATUS.PAUSED]: { title: 'Пауза', hint: 'P или Esc: продолжить' },
};

export class Renderer {
  #ctx;
  #sizePx;

  constructor(canvas) {
    this.#sizePx = CONFIG.GRID_SIZE * CONFIG.CELL_SIZE;
    canvas.width = this.#sizePx;
    canvas.height = this.#sizePx;
    this.#ctx = canvas.getContext('2d');
  }

  render(state) {
    this.#drawBackground();
    this.#drawGrid();
    if (state.food) this.#drawFood(state.food);
    this.#drawSnake(state.snake);

    if (state.status !== CONFIG.STATUS.PLAYING) this.#drawOverlay(state);
  }

  #drawBackground() {
    this.#ctx.fillStyle = CONFIG.COLORS.BACKGROUND;
    this.#ctx.fillRect(0, 0, this.#sizePx, this.#sizePx);
  }

  #drawGrid() {
    const ctx = this.#ctx;
    ctx.strokeStyle = CONFIG.COLORS.GRID;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 1; i < CONFIG.GRID_SIZE; i++) {
      const pos = i * CONFIG.CELL_SIZE + 0.5;
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, this.#sizePx);
      ctx.moveTo(0, pos);
      ctx.lineTo(this.#sizePx, pos);
    }
    ctx.stroke();
  }

  #drawSnake(snake) {
    snake.forEach((segment, index) => {
      const color = index === 0 ? CONFIG.COLORS.SNAKE_HEAD : CONFIG.COLORS.SNAKE_BODY;
      this.#drawCell(segment, color);
    });
  }

  #drawFood({ x, y }) {
    const { CELL_SIZE, CELL_PADDING, COLORS } = CONFIG;
    const radius = CELL_SIZE / 2 - CELL_PADDING;
    this.#ctx.fillStyle = COLORS.FOOD;
    this.#ctx.beginPath();
    this.#ctx.arc(
      x * CELL_SIZE + CELL_SIZE / 2,
      y * CELL_SIZE + CELL_SIZE / 2,
      radius,
      0,
      Math.PI * 2,
    );
    this.#ctx.fill();
  }

  #drawCell({ x, y }, color) {
    const { CELL_SIZE, CELL_PADDING, CELL_RADIUS } = CONFIG;
    const size = CELL_SIZE - CELL_PADDING * 2;
    this.#ctx.fillStyle = color;
    this.#ctx.beginPath();
    this.#ctx.roundRect(
      x * CELL_SIZE + CELL_PADDING,
      y * CELL_SIZE + CELL_PADDING,
      size,
      size,
      CELL_RADIUS,
    );
    this.#ctx.fill();
  }

  #drawOverlay({ status, score }) {
    const ctx = this.#ctx;
    const center = this.#sizePx / 2;
    const { title, hint } = OVERLAY_TEXT[status];

    ctx.save();
    ctx.fillStyle = CONFIG.COLORS.OVERLAY;
    ctx.fillRect(0, 0, this.#sizePx, this.#sizePx);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = CONFIG.COLORS.TEXT;
    ctx.font = CONFIG.FONT.TITLE;
    ctx.fillText(title, center, center + OVERLAY_OFFSET_Y.TITLE);

    ctx.fillStyle = CONFIG.COLORS.TEXT_MUTED;
    ctx.font = CONFIG.FONT.HINT;
    ctx.fillText(`Счёт: ${score}`, center, center + OVERLAY_OFFSET_Y.SCORE);
    ctx.fillText(hint, center, center + OVERLAY_OFFSET_Y.HINT);
    ctx.restore();
  }
}