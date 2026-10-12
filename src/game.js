import { CONFIG } from './config.js';

export class Game {
    #snake;
    #food;
    #direction;

    constructor() {
        this.reset();
    }

    reset() {
        const { GRID_SIZE, INITIAL_SNAKE_LENGTH, DIRECTIONS } = CONFIG;
        const center = Math.floor(GRID_SIZE / 2);

        this.#direction = DIRECTIONS.RIGHT;
        this.#snake = Array.from({length: INITIAL_SNAKE_LENGTH}, (_, i) => ({
            x: center - i,
            y: center,
        }));
        this.#food = { x: 15, y: 6 };
    }

    get state() {
        return { snake: this.#snake, food: this.#food };
    }

    tick() {
        const head = this.#snake[0];
        const newHead = {
            x: wrap(head.x + this.#direction.x),
            y: wrap(head.y + this.#direction.y),
        };

        this.#snake.unshift(newHead);
        this.#snake.pop();
    }
}

function wrap(value){
    return (value + CONFIG.GRID_SIZE) % CONFIG.GRID_SIZE;
}