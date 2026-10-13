import { CONFIG } from './config.js';

export class Game {
    #snake;
    #food;
    #direction;
    #turnQueue;
    #score;

    constructor() {
        this.reset();
    }

    reset() {
        const { GRID_SIZE, INITIAL_SNAKE_LENGTH, DIRECTIONS } = CONFIG;
        const center = Math.floor(GRID_SIZE / 2);

        this.#direction = DIRECTIONS.RIGHT;
        this.#turnQueue = [];
        this.#snake = Array.from({length: INITIAL_SNAKE_LENGTH}, (_, i) => ({
            x: center - i,
            y: center,
        }));
        this.#score = 0;
        this.#food = this.#spawnFood();
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

        if (freeCells.length === 0) return null; // поле заполнено, обработаем на этапе 6
        return freeCells[Math.floor(Math.random() * freeCells.length)];
    }

    get state() {
        return { snake: this.#snake, food: this.#food, score: this.#score };
    }

    turn(direction) {
        if (this.#turnQueue.length >= CONFIG.MAX_QUEUED_TURNS) return;

        const reference = this.#turnQueue.at(-1) ?? this.#direction;
        if (isSame(reference, direction) || isOpposite(reference, direction)) return;

        this.#turnQueue.push(direction);
    }

    tick() {
        if (this.#turnQueue.length > 0) {
        this.#direction = this.#turnQueue.shift();
        }

        const head = this.#snake[0];
        const newHead = {
            x: wrap(head.x + this.#direction.x),
            y: wrap(head.y + this.#direction.y),
        };

        this.#snake.unshift(newHead);

        if (this.#food && isSame(newHead, this.#food)) {
        this.#score += CONFIG.POINTS_PER_FOOD;
        this.#food = this.#spawnFood();
        } else {
        this.#snake.pop();
        }

    }
}

function isSame(a, b) {
  return a.x === b.x && a.y === b.y;
}

function isOpposite(a, b) {
  return a.x + b.x === 0 && a.y + b.y === 0;
}

function wrap(value){
    return (value + CONFIG.GRID_SIZE) % CONFIG.GRID_SIZE;
}