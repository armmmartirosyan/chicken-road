/**
 * GameLoop - Manages the main game loop using requestAnimationFrame
 * Provides consistent timing and frame rate management
 */
export class GameLoop {
  constructor(updateCallback, renderCallback) {
    this.updateCallback = updateCallback;
    this.renderCallback = renderCallback;
    this.isRunning = false;
    this.animationFrameId = null;
    this.lastTime = performance.now();
    this.accumulatedTime = 0;
    this.targetFPS = 60;
    this.fixedTimeStep = 1000 / this.targetFPS; // ~16.67ms
  }

  /**
   * Start the game loop
   */
  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.lastTime = performance.now();
    this.accumulatedTime = 0;
    this.loop();
  }

  /**
   * Stop the game loop
   */
  stop() {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Main loop function
   */
  loop = () => {
    if (!this.isRunning) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    // Convert to seconds for game logic
    const deltaSeconds = deltaTime / 1000;

    // Update game logic
    if (this.updateCallback) {
      this.updateCallback(deltaSeconds);
    }

    // Render current state
    if (this.renderCallback) {
      this.renderCallback();
    }

    // Schedule next frame
    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  /**
   * Destroy the game loop
   */
  destroy() {
    this.stop();
    this.updateCallback = null;
    this.renderCallback = null;
  }
}
