import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { CONFIG } from '../src/config.js';
import { Game } from '../src/game.js';

const { UP, DOWN, LEFT } = CONFIG.DIRECTIONS;
const { PLAYING, PAUSED, GAME_OVER } = CONFIG.STATUS;
const CENTER = Math.floor(CONFIG.GRID_SIZE / 2);
const TICKS_TO_RIGHT_WALL = CONFIG.GRID_SIZE - 1 - CENTER;

// random = () => 0: еда всегда в первой свободной клетке, то есть в (0, 0)
function createGame({ length = CONFIG.INITIAL_SNAKE_LENGTH, random = () => 0 } = {}) {
  const original = CONFIG.INITIAL_SNAKE_LENGTH;
  CONFIG.INITIAL_SNAKE_LENGTH = length;
  try {
    return new Game(random);
  } finally {
    CONFIG.INITIAL_SNAKE_LENGTH = original;
  }
}

function head(game) {
  return game.state.snake[0];
}

function tickTimes(game, count) {
  for (let i = 0; i < count; i++) game.tick();
}

function steer(game, ...directions) {
  for (const direction of directions) {
    game.turn(direction);
    game.tick();
  }
}

function isOnSnake(game, cell) {
  return game.state.snake.some(({ x, y }) => x === cell.x && y === cell.y);
}

describe('Game', () => {
  describe('начальное состояние', () => {
    it('змейка в центре, игра идёт, счёт нулевой', () => {
      const { snake, score, status } = createGame().state;

      assert.equal(snake.length, CONFIG.INITIAL_SNAKE_LENGTH);
      assert.deepEqual(snake[0], { x: CENTER, y: CENTER });
      assert.equal(score, 0);
      assert.equal(status, PLAYING);
    });

    it('еда никогда не появляется на змейке', () => {
      for (const value of [0, 0.25, 0.5, 0.75, 0.999]) {
        const game = createGame({ random: () => value });
        assert.ok(!isOnSnake(game, game.state.food));
      }
    });
  });

  describe('движение', () => {
    it('за тик голова сдвигается на клетку, длина не меняется', () => {
      const game = createGame();
      game.tick();

      assert.deepEqual(head(game), { x: CENTER + 1, y: CENTER });
      assert.equal(game.state.snake.length, CONFIG.INITIAL_SNAKE_LENGTH);
    });

    it('игнорирует разворот на 180°', () => {
      const game = createGame();
      game.turn(LEFT);
      game.tick();

      assert.deepEqual(head(game), { x: CENTER + 1, y: CENTER });
    });

    it('два быстрых поворота применяются на двух тиках подряд', () => {
      const game = createGame();
      game.turn(UP);
      game.turn(LEFT);

      game.tick();
      assert.deepEqual(head(game), { x: CENTER, y: CENTER - 1 });
      game.tick();
      assert.deepEqual(head(game), { x: CENTER - 1, y: CENTER - 1 });
    });

    it('новый поворот проверяется относительно последнего в очереди', () => {
      const game = createGame();
      game.turn(UP);
      game.turn(DOWN); // противоположен UP, а не текущему RIGHT: должен быть отброшен

      tickTimes(game, 2);
      assert.deepEqual(head(game), { x: CENTER, y: CENTER - 2 });
    });
  });

  describe('столкновения', () => {
    it('удар о стену заканчивает игру', () => {
      const game = createGame();

      tickTimes(game, TICKS_TO_RIGHT_WALL);
      assert.equal(game.state.status, PLAYING);

      game.tick();
      assert.equal(game.state.status, GAME_OVER);
    });

    it('удар о собственное тело заканчивает игру', () => {
      const game = createGame({ length: 6 });
      steer(game, UP, LEFT);
      assert.equal(game.state.status, PLAYING);

      steer(game, DOWN);
      assert.equal(game.state.status, GAME_OVER);
    });

    it('в клетку, которую освобождает хвост, ходить можно', () => {
      const game = createGame({ length: 4 });
      steer(game, UP, LEFT, DOWN);

      assert.equal(game.state.status, PLAYING);
    });
  });

  describe('еда', () => {
    it('поедание увеличивает счёт и длину, еда переезжает', () => {
      const game = createGame();
      game.turn(UP);
      tickTimes(game, CENTER);
      game.turn(LEFT);
      tickTimes(game, CENTER); // голова доходит до еды в (0, 0)

      assert.equal(game.state.score, CONFIG.POINTS_PER_FOOD);
      assert.equal(game.state.snake.length, CONFIG.INITIAL_SNAKE_LENGTH + 1);
      assert.equal(game.state.status, PLAYING);
      assert.ok(!isOnSnake(game, game.state.food));
      assert.ok(game.tickMs < CONFIG.TICK_MS);
    });
  });

  describe('пауза и рестарт', () => {
    it('на паузе змейка стоит, после снятия паузы идёт дальше', () => {
      const game = createGame();

      game.togglePause();
      assert.equal(game.state.status, PAUSED);

      const before = { ...head(game) };
      game.tick();
      assert.deepEqual(head(game), before);

      game.togglePause();
      assert.equal(game.state.status, PLAYING);
    });

    it('рестарт не сбрасывает идущую партию', () => {
      const game = createGame();
      game.tick();
      game.restart();

      assert.deepEqual(head(game), { x: CENTER + 1, y: CENTER });
    });

    it('после проигрыша рестарт начинает игру заново', () => {
      const game = createGame();
      tickTimes(game, TICKS_TO_RIGHT_WALL + 1);
      assert.equal(game.state.status, GAME_OVER);

      game.restart();
      assert.equal(game.state.status, PLAYING);
      assert.deepEqual(head(game), { x: CENTER, y: CENTER });
      assert.equal(game.state.score, 0);
    });
  });
});