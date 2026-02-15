/**
 * Camera - Manages viewport transformation and panning
 * Handles coordinate transformation between world and screen space
 */
export class Camera {
  constructor(width = 800, height = 600) {
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;
    this.scale = 1;
    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartY = 0;
    this.dragStartCameraX = 0;
    this.dragStartCameraY = 0;
  }

  /**
   * Set camera position
   */
  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * Move camera by delta
   */
  move(dx, dy) {
    this.x += dx;
    this.y += dy;
  }

  /**
   * Set camera dimensions
   */
  setSize(width, height) {
    this.width = width;
    this.height = height;
  }

  /**
   * Start dragging
   */
  startDrag(screenX, screenY) {
    this.isDragging = true;
    this.dragStartX = screenX;
    this.dragStartY = screenY;
    this.dragStartCameraX = this.x;
    this.dragStartCameraY = this.y;
  }

  /**
   * Update drag position
   */
  updateDrag(screenX, screenY) {
    if (!this.isDragging) return;

    const dx = (screenX - this.dragStartX) * 1.5;
    const dy = (screenY - this.dragStartY) * 1.5;

    this.x = this.dragStartCameraX - dx;
    this.y = this.dragStartCameraY - dy;
  }

  /**
   * Stop dragging
   */
  stopDrag() {
    this.isDragging = false;
  }

  /**
   * Apply camera transformation to context
   */
  applyTransform(context) {
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.scale(this.scale, this.scale);
    context.translate(-this.x, -this.y);
  }

  /**
   * Reset camera transformation
   */
  resetTransform(context) {
    context.setTransform(1, 0, 0, 1, 0, 0);
  }

  /**
   * Convert screen coordinates to world coordinates
   */
  screenToWorld(screenX, screenY) {
    return {
      x: screenX / this.scale + this.x,
      y: screenY / this.scale + this.y,
    };
  }

  /**
   * Convert world coordinates to screen coordinates
   */
  worldToScreen(worldX, worldY) {
    return {
      x: (worldX - this.x) * this.scale,
      y: (worldY - this.y) * this.scale,
    };
  }
}
