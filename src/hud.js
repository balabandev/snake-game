export class Hud {
  #scoreElement;
  #highScoreElement;
  #score = null;
  #highScore = null;

  constructor() {
    this.#scoreElement = document.getElementById('score');
    this.#highScoreElement = document.getElementById('high-score');
  }

  update(score, highScore) {
    if (score !== this.#score) {
      this.#scoreElement.textContent = score;
      this.#score = score;
    }
    if (highScore !== this.#highScore) {
      this.#highScoreElement.textContent = highScore;
      this.#highScore = highScore;
    }
  }
}