/**
 * BaseEntity - Abstract base class for all game entities
 * Provides common entity functionality
 */
export class BaseEntity {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
    this.width = 0;
    this.height = 0;
    this.active = true;
    this.visible = true;
  }

  /**
   * Update entity state
   * @param {number} deltaTime - Time since last update in seconds
   */
  update(deltaTime) {
    // Override in subclasses
    // deltaTime is used by subclasses
    void deltaTime;
  }

  /**
   * Render entity
   * @param {Renderer} renderer - The renderer instance
   */
  render(renderer) {
    // Override in subclasses
    // renderer is used by subclasses
    void renderer;
  }

  /**
   * Set entity position
   */
  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * Get entity bounds
   */
  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }

  /**
   * Check if point is inside entity
   */
  containsPoint(x, y) {
    return (
      x >= this.x &&
      x <= this.x + this.width &&
      y >= this.y &&
      y <= this.y + this.height
    );
  }

  /**
   * Destroy entity and cleanup resources
   */
  destroy() {
    this.active = false;
    this.visible = false;
  }
}
