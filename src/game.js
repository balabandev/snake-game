import { CONFIG } from './config.js';

export class Game {
    #snake;
    #food;
    #direction;
    #turnQueue;

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
        this.#food = { x: 15, y: 6 };
    }

    get state() {
        return { snake: this.#snake, food: this.#food };
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
        this.#snake.pop();
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