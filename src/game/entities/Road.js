import { BaseEntity } from "./BaseEntity.js";

/**
 * Road - Represents the road with lanes
 * Handles road rendering
 */
export class Road extends BaseEntity {
  constructor(x, y, config) {
    super(x, y);

    this.laneWidth = config.laneWidth || 300;
    this.laneCount = config.laneCount || 30;
    this.height = config.roadHeight || 600;
    this.width = this.laneWidth * this.laneCount;

    this.backgroundColor = config.roadColor || "#716c69";
    this.lineColor = config.lineColor || "#ffffff";
    this.lineWidth = config.roadLineWidth || 5;
    this.dashPattern = config.dashPattern || [40, 40];
  }

  /**
   * Road doesn't need updates
   */
  update(deltaTime) {
    // Static entity
    void deltaTime;
  }

  /**
   * Render the road
   */
  render(renderer) {
    if (!this.visible) return;

    const context = renderer.getContext();

    // Draw road background
    renderer.drawRect(
      this.x,
      this.y,
      this.width,
      this.height,
      this.backgroundColor,
    );

    // Optimize: Set line style once before drawing all lanes
    context.strokeStyle = this.lineColor;
    context.lineWidth = this.lineWidth;
    context.setLineDash(this.dashPattern);

    // Begin path for all lane dividers (batch rendering)
    context.beginPath();
    for (let i = 1; i < this.laneCount; i++) {
      const laneX = this.x + i * this.laneWidth;
      context.moveTo(laneX, this.y);
      context.lineTo(laneX, this.y + this.height);
    }
    context.stroke();

    // Reset line dash once after all lanes drawn
    context.setLineDash([]);
  }

  /**
   * Get lane index at x position
   */
  getLaneAtPosition(x) {
    if (x < this.x || x > this.x + this.width) {
      return -1;
    }
    return Math.floor((x - this.x) / this.laneWidth);
  }

  /**
   * Get x position of lane center
   */
  getLaneCenter(laneIndex) {
    if (laneIndex < 0 || laneIndex >= this.laneCount) {
      return null;
    }
    return this.x + (laneIndex + 0.5) * this.laneWidth;
  }
}
