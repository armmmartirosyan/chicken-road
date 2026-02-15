/**
 * Game Configuration
 * Central configuration for all game parameters and settings
 */

/**
 * Core game configuration
 */
export const GAME_CONFIG = {
  // Road settings
  laneWidth: 300,
  laneCount: 30,
  roadColor: "#716c69",
  lineColor: "#ffffff",
  roadLineWidth: 5,
  dashPattern: [40, 40],

  // Chicken settings
  chickenSize: 280, // Slightly smaller than lane width (300px)
  chickenScale: 1,

  // Performance
  targetFPS: 60,

  // Asset paths
  assets: {
    start: "/start.png",
    finish: "/finish.png",
    chicken: "/assets/chicken.png",
  },
};

/**
 * Difficulty settings for future game modes
 */
export const DIFFICULTY_SETTINGS = {
  Easy: {
    obstacleSpawnChance: 0.3,
    obstacleSpeed: 2,
    rewardChance: 0.8,
  },
  Medium: {
    obstacleSpawnChance: 0.5,
    obstacleSpeed: 3,
    rewardChance: 0.6,
  },
  Hard: {
    obstacleSpawnChance: 0.7,
    obstacleSpeed: 4,
    rewardChance: 0.4,
  },
  Hardcore: {
    obstacleSpawnChance: 0.9,
    obstacleSpeed: 5,
    rewardChance: 0.2,
  },
};

/**
 * Get default game configuration
 */
export function getDefaultConfig() {
  return { ...GAME_CONFIG };
}
