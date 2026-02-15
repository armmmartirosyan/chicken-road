/**
 * Renderer - Handles all canvas rendering operations
 * Provides drawing utilities and manages render context
 */
export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.camera = null;
    this.width = canvas.width;
    this.height = canvas.height;
  }

  /**
   * Set the camera for rendering
   */
  setCamera(camera) {
    this.camera = camera;
  }

  /**
   * Clear the entire canvas
   */
  clear(color = "#2a2a2a") {
    this.context.fillStyle = color;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Begin rendering with camera transform
   */
  begin() {
    this.context.save();
    if (this.camera) {
      this.camera.applyTransform(this.context);
    }
  }

  /**
   * End rendering and restore context
   */
  end() {
    this.context.restore();
  }

  /**
   * Draw an image
   */
  drawImage(image, x, y, width, height) {
    if (!image) return;

    if (width !== undefined && height !== undefined) {
      this.context.drawImage(image, x, y, width, height);
    } else {
      this.context.drawImage(image, x, y);
    }
  }

  /**
   * Draw a rectangle
   */
  drawRect(x, y, width, height, color) {
    this.context.fillStyle = color;
    this.context.fillRect(x, y, width, height);
  }

  /**
   * Draw a stroked rectangle
   */
  strokeRect(x, y, width, height, color, lineWidth = 1) {
    this.context.strokeStyle = color;
    this.context.lineWidth = lineWidth;
    this.context.strokeRect(x, y, width, height);
  }

  /**
   * Draw text
   */
  drawText(text, x, y, font = "16px Arial", color = "#000000", align = "left") {
    this.context.font = font;
    this.context.fillStyle = color;
    this.context.textAlign = align;
    this.context.fillText(text, x, y);
  }

  /**
   * Draw a line
   */
  drawLine(x1, y1, x2, y2, color = "#000000", lineWidth = 1, lineDash = []) {
    this.context.strokeStyle = color;
    this.context.lineWidth = lineWidth;
    this.context.setLineDash(lineDash);
    this.context.beginPath();
    this.context.moveTo(x1, y1);
    this.context.lineTo(x2, y2);
    this.context.stroke();
    this.context.setLineDash([]);
  }

  /**
   * Draw a circle
   */
  drawCircle(x, y, radius, color) {
    this.context.fillStyle = color;
    this.context.beginPath();
    this.context.arc(x, y, radius, 0, Math.PI * 2);
    this.context.fill();
  }

  /**
   * Update canvas size
   */
  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.width = width;
    this.height = height;
  }

  /**
   * Get the rendering context
   */
  getContext() {
    return this.context;
  }
}
