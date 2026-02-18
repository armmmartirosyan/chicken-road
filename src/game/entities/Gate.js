import { BaseEntity } from "./BaseEntity.js";
import { Sprite } from "pixi.js";

/**
 * Gate - Barrier that stops cars
 * Positioned on a specific lane to block car movement
 */
export class Gate extends BaseEntity {
  constructor(x, y, texture, config = {}) {
    super(x, y);

    this.sprite = null;
    this.scale = config.scale || 0.7;
    this.laneIndex = config.laneIndex || 0;

    if (texture) {
      this.setTexture(texture);
    }
  }

  /**
   * Set the gate texture
   */
  setTexture(texture) {
    if (!this.container) {
      console.warn("Cannot set texture: container is null");
      return;
    }

    if (this.sprite) {
      this.sprite.destroy();
    }

    this.sprite = new Sprite(texture);
    this.sprite.anchor.set(0.5);
    this.sprite.scale.set(this.scale);
    this.container.addChild(this.sprite);

    this.width = texture.width * this.scale;
    this.height = texture.height * this.scale;
  }

  /**
   * Get the Y position where cars should stop
   */
  getStopY() {
    // Cars should stop before the gate (at the top edge)
    return this.y - this.height / 2 - 50; // 50px buffer before gate
  }

  /**
   * Update gate (static)
   */
  update(deltaTime) {
    super.update(deltaTime);
    void deltaTime;
  }

  /**
   * Destroy and cleanup
   */
  destroy() {
    if (this.sprite) {
      this.sprite.destroy();
      this.sprite = null;
    }
    super.destroy();
  }
}
