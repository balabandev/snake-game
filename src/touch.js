import { CONFIG } from './config.js';

export class TouchInput {
  #onDirection;
  #onTap;
  #startX = 0;
  #startY = 0;
  #swiped = false;

  constructor(element, { onDirection, onTap }) {
    this.#onDirection = onDirection;
    this.#onTap = onTap;

    element.addEventListener('pointerdown', this.#handleDown);
    element.addEventListener('pointermove', this.#handleMove);
    element.addEventListener('pointerup', this.#handleUp);
  }

  #handleDown = (event) => {
    this.#startX = event.clientX;
    this.#startY = event.clientY;
    this.#swiped = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  #handleMove = (event) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;

    const dx = event.clientX - this.#startX;
    const dy = event.clientY - this.#startY;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < CONFIG.SWIPE_MIN_PX) return;

    this.#onDirection(CONFIG.DIRECTIONS[swipeDirectionName(dx, dy)]);
    this.#swiped = true;
    this.#startX = event.clientX;
    this.#startY = event.clientY;
  };

  #handleUp = () => {
    if (!this.#swiped) this.#onTap();
  };
}

function swipeDirectionName(dx, dy) {
  if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? 'RIGHT' : 'LEFT';
  return dy > 0 ? 'DOWN' : 'UP';
}