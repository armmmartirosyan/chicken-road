import { BaseEntity } from "./BaseEntity.js";

/**
 * Car - Vehicle obstacle entity
 * Handles car rendering, movement, and lifecycle
 */
export class Car extends BaseEntity {
  constructor(x, y, config) {
    super(x, y);

    this.config = config;
    this.lane = config.lane || 0;
    this.speed = config.speed || 200; // pixels per second (moving down)
    this.carType = config.carType || "truck"; // truck, car, etc.
    this.roadBottomY = config.roadBottomY || 1000; // Bottom boundary for offscreen detection

    // Size: 20px smaller than lane width (300px -> 280px)
    this.width = 280;
    this.height = 140; // Will be recalculated based on image aspect ratio

    this.image = null;
    this.isOffscreen = false;

    // For object pooling
    this.inUse = true;
  }

  /**
   * Set the car sprite image and calculate height to maintain aspect ratio
   */
  setImage(image) {
    this.image = image;

    // Calculate height to maintain image aspect ratio (prevent distortion)
    if (image && image.width > 0 && image.height > 0) {
      const aspectRatio = image.height / image.width;
      this.height = this.width * aspectRatio;
    }
  }

  /**
   * Reset car for object pool reuse
   */
  reset(x, y, config) {
    this.x = x;
    this.y = y;
    this.lane = config.lane || 0;
    this.speed = config.speed || 200;
    this.carType = config.carType || "truck";
    this.roadBottomY = config.roadBottomY || 1000;
    this.active = true;
    this.visible = true;
    this.isOffscreen = false;
    this.inUse = true;
  }

  /**
   * Update car position
   */
  update(deltaTime) {
    if (!this.active) return;

    // Move car downward along the lane
    this.y += this.speed * deltaTime;
  }

  /**
   * Render the car (optimized for performance and anti-flickering)
   */
  render(renderer) {
    if (!this.visible || !this.image) return;

    const context = renderer.getContext();

    // Center the car in its lane
    const renderX = Math.round(this.x - this.width / 2); // Round to avoid sub-pixel rendering
    const renderY = Math.round(this.y - this.height / 2);
    const renderWidth = Math.round(this.width);
    const renderHeight = Math.round(this.height);

    // Draw car image (maintaining aspect ratio, no distortion)
    // Using rounded values prevents sub-pixel rendering artifacts and flickering
    context.drawImage(this.image, renderX, renderY, renderWidth, renderHeight);
  }

  /**
   * Release car back to pool
   */
  release() {
    this.inUse = false;
    this.active = false;
    this.visible = false;
  }

  /**
   * Check collision with another entity (for future use)
   */
  checkCollision(entity) {
    const bounds = this.getBounds();
    const otherBounds = entity.getBounds();

    return (
      bounds.x < otherBounds.x + otherBounds.width &&
      bounds.x + bounds.width > otherBounds.x &&
      bounds.y < otherBounds.y + otherBounds.height &&
      bounds.y + bounds.height > otherBounds.y
    );
  }

  /**
   * Check if car is visible in viewport (for optimized cleanup)
   */
  isInViewport(scrollX, scrollY, viewportWidth, viewportHeight) {
    const bounds = this.getBounds();

    // Add buffer zone to keep cars slightly outside viewport
    const buffer = 300;

    return (
      bounds.x + bounds.width > scrollX - buffer &&
      bounds.x < scrollX + viewportWidth + buffer &&
      bounds.y + bounds.height > scrollY - buffer &&
      bounds.y < scrollY + viewportHeight + buffer
    );
  }

  /**
   * Get actual bounds (accounting for centered position)
   */
  getBounds() {
    return {
      x: this.x - this.width / 2,
      y: this.y - this.height / 2,
      width: this.width,
      height: this.height,
    };
  }
}
