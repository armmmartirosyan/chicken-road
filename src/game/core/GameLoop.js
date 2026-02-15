/**
 * GameLoop - Manages the main game loop with advanced anti-flickering
 * Uses fixed timestep and frame smoothing for consistent rendering
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
    this.fixedTimeStep = 1 / this.targetFPS; // 0.0167 seconds (~16.67ms)
    this.maxFrameTime = 0.25; // Maximum frame time to prevent spiral of death

    // Frame smoothing for anti-flickering
    this.frameTimes = [];
    this.maxFrameTimeSamples = 10;

    // Performance optimization: pause when tab not visible
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
  }

  /**
   * Handle visibility change to pause/resume rendering
   */
  handleVisibilityChange() {
    if (document.hidden && this.isRunning) {
      // Tab is hidden - pause to save resources
      this.lastTime = performance.now(); // Reset time to prevent huge delta
    }
  }

  /**
   * Start the game loop
   */
  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.lastTime = performance.now();
    this.accumulatedTime = 0;

    // Listen for visibility changes
    document.addEventListener("visibilitychange", this.handleVisibilityChange);

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

    // Remove visibility listener
    document.removeEventListener(
      "visibilitychange",
      this.handleVisibilityChange,
    );
  }

  /**
   * Main loop function with fixed timestep (anti-flickering)
   */
  loop = () => {
    if (!this.isRunning) return;

    const currentTime = performance.now();
    let deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
    this.lastTime = currentTime;

    // Skip heavy processing if tab is hidden (optimization)
    if (document.hidden) {
      // Still schedule next frame to resume quickly when tab becomes visible
      this.animationFrameId = requestAnimationFrame(this.loop);
      return;
    }

    // Clamp delta time to prevent huge jumps (spiral of death prevention)
    if (deltaTime > this.maxFrameTime) {
      deltaTime = this.maxFrameTime;
    }

    // Frame smoothing - track recent frame times for stability
    this.frameTimes.push(deltaTime);
    if (this.frameTimes.length > this.maxFrameTimeSamples) {
      this.frameTimes.shift();
    }

    // Use fixed timestep for consistent physics/updates (anti-jitter)
    this.accumulatedTime += deltaTime;

    let updateSteps = 0;
    const maxUpdateSteps = 5; // Prevent too many updates in one frame

    while (
      this.accumulatedTime >= this.fixedTimeStep &&
      updateSteps < maxUpdateSteps
    ) {
      // Update game logic with fixed timestep
      if (this.updateCallback) {
        this.updateCallback(this.fixedTimeStep);
      }
      this.accumulatedTime -= this.fixedTimeStep;
      updateSteps++;
    }

    // Always render (interpolation would go here for ultra-smooth rendering)
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

    // Remove visibility listener if still attached
    document.removeEventListener(
      "visibilitychange",
      this.handleVisibilityChange,
    );

    this.updateCallback = null;
    this.renderCallback = null;
  }
}
