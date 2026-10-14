import { CONFIG } from './config.js';

export class Input {
  #onDirection;
  #onRestart;

  constructor({ onDirection, onRestart }) {
    this.#onDirection = onDirection;
    this.#onRestart = onRestart;
    window.addEventListener('keydown', this.#handleKeyDown);
  }

  #handleKeyDown = (event) => {
    const directionName = CONFIG.KEY_BINDINGS[event.code];
    const isRestartKey = CONFIG.RESTART_KEYS.includes(event.code);
    if (!directionName && !isRestartKey) return;

    event.preventDefault(); 
    if (event.repeat) return;

    if (isRestartKey) {
      this.#onRestart();
    } else {
      this.#onDirection(CONFIG.DIRECTIONS[directionName]);
    }
  };
}