/**
 * Game Constants
 * Defines immutable constants used throughout the game
 */

/**
 * Game states
 */
export const GAME_STATES = {
  IDLE: "idle",
  PLAYING: "playing",
  PAUSED: "paused",
  GAME_OVER: "gameover",
  WON: "won",
};

/**
 * Entity types
 */
export const ENTITY_TYPES = {
  CHICKEN: "chicken",
  ROAD: "road",
  SCENERY: "scenery",
  OBSTACLE: "obstacle",
  REWARD: "reward",
};

/**
 * Animation names
 */
export const ANIMATIONS = {
  IDLE: "idle",
  IDLE_FRONT: "idle_front",
  IDLE_BACK: "idle_back",
  JUMP: "jump",
  DEATH: "death",
  WIN: "win",
  FINISH_FRONT: "finish_front",
  FINISH_BACK: "finish_back",
};

/**
 * Input events
 */
export const INPUT_EVENTS = {
  DRAG_START: "dragStart",
  DRAG_MOVE: "dragMove",
  DRAG_END: "dragEnd",
  CLICK: "click",
  DOUBLE_CLICK: "doubleClick",
};

/**
 * Game events
 */
export const GAME_EVENTS = {
  STATE_CHANGE: "stateChange",
  INITIALIZED: "initialized",
  FPS_UPDATE: "fpsUpdate",
  RESIZE: "resize",
  DESTROYED: "destroyed",
};

/**
 * Layer z-indices for rendering order
 */
export const RENDER_LAYERS = {
  BACKGROUND: 0,
  ROAD: 1,
  OBSTACLES: 2,
  CHICKEN: 3,
  EFFECTS: 4,
  UI: 5,
};

/**
 * Color palette
 */
export const COLORS = {
  ROAD_SURFACE: "#716c69",
  ROAD_LINE: "#ffffff",
  CHICKEN_WHITE: "#FFFFFF",
  CHICKEN_RED: "#FF0000",
  CHICKEN_ORANGE: "#FFB347",
  SHADOW: "rgba(0, 0, 0, 0.2)",
  BACKGROUND: "#2a2a2a",
};

/**
 * Timing constants (in seconds)
 */
export const TIMING = {
  ANIMATION_SPEED: 3, // Speed multiplier for animations
  BOB_FREQUENCY: 3, // Frequency of idle bob animation
  FPS_UPDATE_INTERVAL: 1.0, // How often to update FPS counter
};
