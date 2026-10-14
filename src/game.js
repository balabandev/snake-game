import { CONFIG } from './config.js';

export class Game {
  #snake;
  #food;
  #direction;
  #turnQueue;
  #score;
  #status;

  constructor() {
    this.reset();
  }

  reset() {
    const { GRID_SIZE, INITIAL_SNAKE_LENGTH, DIRECTIONS, STATUS } = CONFIG;
    const center = Math.floor(GRID_SIZE / 2);

    this.#direction = DIRECTIONS.RIGHT;
    this.#turnQueue = [];
    this.#snake = Array.from({ length: INITIAL_SNAKE_LENGTH }, (_, i) => ({
      x: center - i,
      y: center,
    }));
    this.#score = 0;
    this.#status = STATUS.PLAYING;
    this.#food = this.#spawnFood();
  }

  get state() {
    return {
      snake: this.#snake,
      food: this.#food,
      score: this.#score,
      status: this.#status,
    };
  }

  get tickMs() {
    const { TICK_MS, MIN_TICK_MS, SPEED_STEP_MS } = CONFIG;
    return Math.max(MIN_TICK_MS, TICK_MS - this.#score * SPEED_STEP_MS);
  }

  restart() {
    const { GAME_OVER, WON } = CONFIG.STATUS;
    if (this.#status === GAME_OVER || this.#status === WON) this.reset();
  }

  pause() {
    if (this.#status === CONFIG.STATUS.PLAYING) {
      this.#status = CONFIG.STATUS.PAUSED;
    }
  }

  togglePause() {
    if (this.#status === CONFIG.STATUS.PAUSED) {
      this.#status = CONFIG.STATUS.PLAYING;
    } else {
      this.pause();
    }
  }

  turn(direction) {
    if (this.#status !== CONFIG.STATUS.PLAYING) return;
    if (this.#turnQueue.length >= CONFIG.MAX_QUEUED_TURNS) return;

    const reference = this.#turnQueue.at(-1) ?? this.#direction;
    if (isSame(reference, direction) || isOpposite(reference, direction)) return;

    this.#turnQueue.push(direction);
  }

  tick() {
    if (this.#status !== CONFIG.STATUS.PLAYING) return;

    if (this.#turnQueue.length > 0) {
      this.#direction = this.#turnQueue.shift();
    }

    const head = this.#snake[0];
    const newHead = {
      x: head.x + this.#direction.x,
      y: head.y + this.#direction.y,
    };
    const willEat = this.#food !== null && isSame(newHead, this.#food);

    if (isOutOfBounds(newHead) || this.#hitsSelf(newHead, willEat)) {
      this.#status = CONFIG.STATUS.GAME_OVER;
      return;
    }

    this.#snake.unshift(newHead);

    if (willEat) {
      this.#score += CONFIG.POINTS_PER_FOOD;
      this.#food = this.#spawnFood();
      if (this.#food === null) this.#status = CONFIG.STATUS.WON;
    } else {
      this.#snake.pop();
    }
  }

  #hitsSelf(newHead, willEat) {
    // Если змейка не ест, хвост в этот тик уйдёт, и его клетка свободна
    const body = willEat ? this.#snake : this.#snake.slice(0, -1);
    return body.some((segment) => isSame(segment, newHead));
  }

  #spawnFood() {
    const { GRID_SIZE } = CONFIG;
    const occupied = new Set(this.#snake.map(({ x, y }) => `${x},${y}`));
    const freeCells = [];

    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        if (!occupied.has(`${x},${y}`)) freeCells.push({ x, y });
      }
    }

    if (freeCells.length === 0) return null;
    return freeCells[Math.floor(Math.random() * freeCells.length)];
  }
}

function isSame(a, b) {
  return a.x === b.x && a.y === b.y;
}

function isOpposite(a, b) {
  return a.x + b.x === 0 && a.y + b.y === 0;
}

function isOutOfBounds({ x, y }) {
  const { GRID_SIZE } = CONFIG;
  return x < 0 || y < 0 || x >= GRID_SIZE || y >= GRID_SIZE;
}