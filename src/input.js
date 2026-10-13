import { CONFIG } from './config.js';

export class Input {
    #onDirection;

    constructor(onDirection) {
        this.#onDirection = onDirection;
        window.addEventListener('keydown', this.#handleKeyDown);
    }

    #handleKeyDown = (event) => {
        const name = CONFIG.KEY_BINDINGS[event.code];
        if (!name) return;

        event.preventDefault();
        if (event.repeat) return;

        this.#onDirection(CONFIG.DIRECTIONS[name]);
    }
}