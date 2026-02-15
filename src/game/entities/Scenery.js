import { BaseEntity } from "./BaseEntity.js";

/**
 * Scenery - Represents start and finish images
 * Handles scenery rendering
 */
export class Scenery extends BaseEntity {
  constructor(x, y, type, image = null) {
    super(x, y);

    this.type = type; // 'start' or 'finish'
    this.image = image;

    if (image) {
      this.width = image.width;
      this.height = image.height;
    }
  }

  /**
   * Set the scenery image
   */
  setImage(image) {
    this.image = image;
    if (image) {
      this.width = image.width;
      this.height = image.height;
    }
  }

  /**
   * Update scenery (static)
   */
  update(deltaTime) {
    // Static entity
    void deltaTime;
  }

  /**
   * Render the scenery
   */
  render(renderer) {
    if (!this.visible || !this.image) return;

    // For finish image, only show half
    if (this.type === "finish") {
      renderer.drawImage(this.image, this.x, this.y, this.width, this.height);
    } else {
      renderer.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  }
}
