export const CONFIG = {
    GRID_SIZE: 20,
    CELL_SIZE: 24,
    CELL_PADDING: 2,
    CELL_RADIUS: 6,
    TICK_MS: 120,
    INITIAL_SNAKE_LENGTH: 3,
    DIRECTIONS: {
    UP:    { x: 0,  y: -1 },
    DOWN:  { x: 0,  y: 1 },
    LEFT:  { x: -1, y: 0 },
    RIGHT: { x: 1,  y: 0 },
    },
    MAX_QUEUED_TURNS: 2,
    KEY_BINDINGS: {
        ArrowUp: 'UP', KeyW: 'UP',
        ArrowDown: 'DOWN', KeyS: 'DOWN',
        ArrowLeft: 'LEFT', KeyA: 'LEFT',
        ArrowRight: 'RIGHT', KeyD: 'RIGHT',
    },
    MAX_FRAME_MS: 250,
    COLORS: {
        BACKGROUND: '#1b1e27',
        GRID: '#242834',
        SNAKE_HEAD: '#7ee787',
        SNAKE_BODY: '#3fb950',
        FOOD: '#ff6b6b',
    },
}