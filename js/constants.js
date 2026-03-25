// ============================================================
// Game Configuration Constants
// ============================================================

export const CONFIG = {
    // Virtual game resolution (16:9 landscape)
    BASE_WIDTH: 800,
    BASE_HEIGHT: 450,

    // Pixel art scale factor (native pixels * PIXEL_SCALE = screen pixels)
    PIXEL_SCALE: 4,

    // Physics
    GRAVITY: 0.55,
    JUMP_FORCE: -11,
    DOUBLE_JUMP_FORCE: -9,
    GROUND_Y: 360,
    PLAYER_X: 120,

    // Scrolling speed
    BASE_SPEED: 2.2,
    SPEED_INCREMENT: 0.0004,
    MAX_SPEED: 4.5,

    // Obstacle spawning (milliseconds)
    SPAWN_MIN_INTERVAL: 1800,
    SPAWN_MAX_INTERVAL: 3500,

    // Game progression
    FINALE_DISTANCE: 2000,
    DISTANCE_FACTOR: 0.15,

    // Player
    MAX_LIVES: 3,
    INVINCIBILITY_MS: 2000,

    // Parallax speed multipliers
    BG_WALL_SPEED: 0.3,
    BG_FLOOR_SPEED: 1.0,

    // Floor area height below ground line
    FLOOR_HEIGHT: 90,
};

export const COLORS = {
    // School colors
    SCHOOL_BLUE: '#003366',
    SCHOOL_BLUE_LIGHT: '#1a5c99',
    SCHOOL_GRAY: '#808080',
    SCHOOL_GRAY_LIGHT: '#b0b0b0',
    SCHOOL_WHITE: '#f0f0f0',

    // Character
    SUIT_DARK: '#1a1a3e',
    SUIT_MID: '#2a2a5e',
    SHIRT_WHITE: '#e8e8e8',
    TIE_RED: '#cc3333',
    SHOE_BLACK: '#111111',
    SKIN: '#c68642',
    COFFEE_CUP: '#f0f0f0',
    COFFEE_LIQUID: '#6b3a1f',

    // Background
    FLOOR_COLOR: '#a0a0a0',
    FLOOR_LINE: '#909090',
    WALL_COLOR: '#d0d8e0',
    WALL_TRIM: '#003366',
    LOCKER_BODY: '#2a4d8f',
    LOCKER_DARK: '#1a3060',
    LOCKER_HANDLE: '#c0c0c0',

    // Obstacles
    PAPER_WHITE: '#f8f8f0',
    PAPER_LINE: '#c0c0d0',
    PAPER_SHADOW: '#d0d0c0',
    SNOW_WHITE: '#e8f0f8',
    SNOW_SHADOW: '#b8c8d8',
    SIGN_WOOD: '#8b6914',
    FOOTBALL_BROWN: '#8b4513',
    FOOTBALL_LACE: '#ffffff',
    FOOTBALL_DARK: '#6b2f0a',

    // Finale
    CAKE_BASE: '#f5e6d3',
    CAKE_FROSTING: '#ff6699',
    CAKE_LAYER: '#e8c8a0',
    CANDLE_YELLOW: '#ffcc00',
    FLAME_ORANGE: '#ff6600',
    STAGE_WOOD: '#8b6b3d',
    STAGE_DARK: '#6b4b2d',

    // UI
    HEART_RED: '#ff3366',
    HEART_HIGHLIGHT: '#ff6699',
    TEXT_WHITE: '#ffffff',
    TEXT_SHADOW: '#000000',
};

export const GAME_STATE = {
    LOADING: 'loading',
    MENU: 'menu',
    PLAYING: 'playing',
    GAME_OVER: 'gameOver',
    FINALE_TRANSITION: 'finaleTransition',
    FINALE: 'finale',
};

export const OBSTACLE_TYPE = {
    PAPERWORK: 'paperwork',
    SNOW: 'snow',
    PAPER_PLANE: 'paperPlane',
    FOOTBALL: 'football',
};
