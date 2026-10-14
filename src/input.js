import { CONFIG } from './config.js';

export class Input {
  #onDirection;
  #onRestart;
  #onPause;

  constructor({ onDirection, onRestart, onPause }) {
    this.#onDirection = onDirection;
    this.#onRestart = onRestart;
    this.#onPause = onPause;
    window.addEventListener('keydown', this.#handleKeyDown);
  }

  #handleKeyDown = (event) => {
    const { code } = event;
    const directionName = CONFIG.KEY_BINDINGS[code];
    const isRestartKey = CONFIG.RESTART_KEYS.includes(code);
    const isPauseKey = CONFIG.PAUSE_KEYS.includes(code);
    if (!directionName && !isRestartKey && !isPauseKey) return;

    event.preventDefault(); // стрелки и пробел не должны скроллить страницу
    if (event.repeat) return;

    if (isPauseKey) {
      this.#onPause();
    } else if (isRestartKey) {
      this.#onRestart();
    } else {
      this.#onDirection(CONFIG.DIRECTIONS[directionName]);
    }
  };
}