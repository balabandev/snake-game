export const CONFIG = {
  GRID_SIZE: 20,
  CELL_SIZE: 24,
  CELL_PADDING: 2,
  CELL_RADIUS: 6,

  TICK_MS: 120,
  MIN_TICK_MS: 60,
  SPEED_STEP_MS: 3,
  MAX_FRAME_MS: 250,

  INITIAL_SNAKE_LENGTH: 3,
  POINTS_PER_FOOD: 1,
  MAX_QUEUED_TURNS: 2,

  STORAGE_KEY_HIGH_SCORE: 'snake:highScore',

  STATUS: {
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAME_OVER: 'game_over',
    WON: 'won',
  },

  DIRECTIONS: {
    UP: { x: 0, y: -1 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 },
  },

  KEY_BINDINGS: {
    ArrowUp: 'UP', KeyW: 'UP',
    ArrowDown: 'DOWN', KeyS: 'DOWN',
    ArrowLeft: 'LEFT', KeyA: 'LEFT',
    ArrowRight: 'RIGHT', KeyD: 'RIGHT',
  },
  RESTART_KEYS: ['Space', 'Enter'],
  PAUSE_KEYS: ['KeyP', 'Escape'],

  FONT: {
    TITLE: 'bold 32px monospace',
    HINT: '16px monospace',
  },

  COLORS: {
    BACKGROUND: '#1b1e27',
    GRID: '#242834',
    SNAKE_HEAD: '#7ee787',
    SNAKE_BODY: '#3fb950',
    FOOD: '#ff6b6b',
    OVERLAY: 'rgba(18, 20, 26, 0.75)',
    TEXT: '#e6e6e6',
    TEXT_MUTED: '#9aa0ad',
  },
};