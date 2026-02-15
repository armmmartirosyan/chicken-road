import { GameLoop } from "./GameLoop.js";
import { Renderer } from "./Renderer.js";
import { Camera } from "./Camera.js";
import { CarSpawner } from "../systems/CarSpawner.js";

/**
 * Game - Main game class that orchestrates all game systems
 * Manages game state, entities, and rendering
 */
export class Game {
  constructor(canvas, config) {
    this.canvas = canvas;
    this.config = config;
    this.state = "idle"; // idle, playing, paused, gameover

    // Core systems
    this.renderer = new Renderer(canvas);
    this.camera = new Camera(canvas.width, canvas.height);
    this.gameLoop = null;

    // Managers
    this.entityManager = null;
    this.assetManager = null;
    this.inputSystem = null;
    this.carSpawner = null;

    // Event listeners for React integration
    this.eventListeners = new Map();

    // Performance tracking
    this.fps = 0;
    this.frameCount = 0;
    this.lastFpsUpdate = 0;
  }

  /**
   * Initialize game systems
   */
  async initialize(entityManager, assetManager, inputSystem) {
    this.entityManager = entityManager;
    this.assetManager = assetManager;
    this.inputSystem = inputSystem;

    // Setup input callbacks for drag events (container scrolling)
    this.inputSystem.onDragStart((x, y) => {
      this.emit("dragStart", { x, y });
    });

    this.inputSystem.onDragMove((x, y) => {
      this.emit("dragMove", { x, y });
    });

    this.inputSystem.onDragEnd(() => {
      this.emit("dragEnd");
    });

    // Initialize car spawner
    this.carSpawner = new CarSpawner(this.config.carSpawner || {});

    // Emit initialization complete
    this.emit("initialized");
  }

  /**
   * Start the game loop
   */
  start() {
    if (this.gameLoop) {
      this.gameLoop.stop();
    }

    this.state = "playing";
    this.gameLoop = new GameLoop(
      this.update.bind(this),
      this.render.bind(this),
    );
    this.gameLoop.start();

    this.emit("stateChange", { state: "playing" });
  }

  /**
   * Pause the game
   */
  pause() {
    if (this.gameLoop) {
      this.gameLoop.stop();
    }
    this.state = "paused";
    this.emit("stateChange", { state: "paused" });
  }

  /**
   * Resume the game
   */
  resume() {
    if (this.gameLoop && this.state === "paused") {
      this.gameLoop.start();
      this.state = "playing";
      this.emit("stateChange", { state: "playing" });
    }
  }

  /**
   * Reset the game
   */
  reset() {
    if (this.gameLoop) {
      this.gameLoop.stop();
    }
    this.state = "idle";
    this.emit("stateChange", { state: "idle" });
  }

  /**
   * Update game logic
   */
  update(deltaTime) {
    if (this.state !== "playing") return;

    // Update input system
    if (this.inputSystem) {
      this.inputSystem.update(deltaTime);
    }

    // Update all entities
    if (this.entityManager) {
      this.entityManager.update(deltaTime);
    }

    // Update car spawner
    if (this.carSpawner) {
      this.carSpawner.update(deltaTime);
    }

    // Update FPS counter
    this.updateFPS(deltaTime);
  }

  /**
   * Render game
   */
  render() {
    // Clear canvas
    this.renderer.clear();

    // Begin rendering (prepares offscreen buffer if using double buffering)
    this.renderer.begin();

    // Render all entities without camera transform
    // (using container scroll instead for better performance)
    if (this.entityManager) {
      this.entityManager.render(this.renderer);
    }

    // End rendering (swaps buffers if using double buffering)
    this.renderer.end();
  }

  /**
   * Update FPS counter
   */
  updateFPS(deltaTime) {
    this.frameCount++;
    this.lastFpsUpdate += deltaTime;

    if (this.lastFpsUpdate >= 1.0) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastFpsUpdate = 0;
      this.emit("fpsUpdate", { fps: this.fps });
    }
  }

  /**
   * Resize canvas
   */
  resize(width, height) {
    this.renderer.resize(width, height);
    this.camera.setSize(width, height);
    this.emit("resize", { width, height });
  }

  /**
   * Event emitter for React integration
   */
  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
  }

  /**
   * Remove event listener
   */
  off(event, callback) {
    const callbacks = this.eventListeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * Emit event
   */
  emit(event, data = {}) {
    const callbacks = this.eventListeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  }

  /**
   * Get current game state
   */
  getState() {
    return {
      state: this.state,
      fps: this.fps,
      entityCount: this.entityManager ? this.entityManager.getEntityCount() : 0,
      cameraX: this.camera.x,
      cameraY: this.camera.y,
    };
  }

  /**
   * Destroy game and cleanup resources
   */
  destroy() {
    if (this.gameLoop) {
      this.gameLoop.destroy();
    }

    if (this.inputSystem) {
      this.inputSystem.destroy();
    }

    if (this.carSpawner) {
      this.carSpawner.cleanup();
    }

    if (this.entityManager) {
      this.entityManager.clear();
    }

    this.eventListeners.clear();
    this.emit("destroyed");
  }
}
