/**
 * ChickenAnimation - Professional chicken sprite renderer and animator
 * Handles loading, animating, and rendering the chicken character
 */
export class ChickenAnimation {
  constructor() {
    this.chickenImage = null;
    this.isLoaded = false;
    this.currentAnimation = "idle";
    this.animationTime = 0;
    this.scale = 0.5;
    this.facingRight = true;
  }

  /**
   * Load the chicken sprite image
   * @returns {Promise<void>}
   */
  async load() {
    return new Promise((resolve, reject) => {
      this.chickenImage = new Image();
      this.chickenImage.onload = () => {
        this.isLoaded = true;
        resolve();
      };
      this.chickenImage.onerror = () => {
        reject(new Error("Failed to load chicken image"));
      };
      this.chickenImage.src = "/assets/chicken.png";
    });
  }

  /**
   * Set the current animation
   * @param {string} animationName - Name of the animation (idle, jump, death, etc.)
   */
  playAnimation(animationName) {
    if (this.currentAnimation !== animationName) {
      this.currentAnimation = animationName;
      this.animationTime = 0;
    }
  }

  /**
   * Update the animation state   * @param {number} delta - Time delta in seconds
   */
  update(delta) {
    if (!this.isLoaded) return;
    this.animationTime += delta;
  }

  /**
   * Set the direction the chicken is facing
   * @param {boolean} facingRight - True if facing right, false if facing left
   */
  setDirection(facingRight) {
    this.facingRight = facingRight;
  }

  /**
   * Render the chicken at the specified position
   * @param {CanvasRenderingContext2D} context
   * @param {number} x - X position (center)
   * @param {number} y - Y position (center)
   */
  render(context, x, y) {
    if (!this.isLoaded || !this.chickenImage) return;

    context.save();

    // Calculate chicken dimensions
    const chickenWidth = 120 * this.scale;
    const chickenHeight = 120 * this.scale;

    // Simple idle animation - subtle bob
    const bobOffset = Math.sin(this.animationTime * 3) * 2;

    // Center position for drawing
    const centerX = x;
    const centerY = y + bobOffset;

    // Draw the chicken
    this.drawChicken(context, centerX, centerY, chickenWidth, chickenHeight);

    context.restore();
  }

  /**
   * Draw the chicken character
   * @param {CanvasRenderingContext2D} context
   * @param {number} x - X position (center)
   * @param {number} y - Y position (center)
   * @param {number} width - Width to draw
   * @param {number} height - Height to draw
   */
  drawChicken(context, x, y, width, height) {
    // Draw shadow
    context.fillStyle = "rgba(0, 0, 0, 0.2)";
    context.beginPath();
    context.ellipse(
      x,
      y + height * 0.4,
      width * 0.4,
      height * 0.15,
      0,
      0,
      Math.PI * 2,
    );
    context.fill();

    // Body (main circle)
    context.fillStyle = "#FFFFFF";
    context.beginPath();
    context.ellipse(x, y, width * 0.35, height * 0.4, 0, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = "#E0E0E0";
    context.lineWidth = 2;
    context.stroke();

    // Head
    context.fillStyle = "#FFFFFF";
    context.beginPath();
    context.arc(
      x + width * 0.2,
      y - height * 0.25,
      width * 0.25,
      0,
      Math.PI * 2,
    );
    context.fill();
    context.strokeStyle = "#E0E0E0";
    context.lineWidth = 2;
    context.stroke();

    // Comb (red top thing)
    context.fillStyle = "#FF0000";
    context.beginPath();
    context.moveTo(x + width * 0.15, y - height * 0.45);
    context.lineTo(x + width * 0.2, y - height * 0.52);
    context.lineTo(x + width * 0.25, y - height * 0.45);
    context.lineTo(x + width * 0.28, y - height * 0.5);
    context.lineTo(x + width * 0.3, y - height * 0.42);
    context.lineTo(x + width * 0.25, y - height * 0.35);
    context.closePath();
    context.fill();

    // Beak
    context.fillStyle = "#FFB347";
    context.beginPath();
    context.moveTo(x + width * 0.4, y - height * 0.2);
    context.lineTo(x + width * 0.52, y - height * 0.23);
    context.lineTo(x + width * 0.4, y - height * 0.15);
    context.closePath();
    context.fill();

    // Eye
    context.fillStyle = "#000000";
    context.beginPath();
    context.arc(
      x + width * 0.28,
      y - height * 0.28,
      width * 0.04,
      0,
      Math.PI * 2,
    );
    context.fill();

    // Eye highlight
    context.fillStyle = "#FFFFFF";
    context.beginPath();
    context.arc(
      x + width * 0.29,
      y - height * 0.3,
      width * 0.018,
      0,
      Math.PI * 2,
    );
    context.fill();

    // Wattle (red thing under beak)
    context.fillStyle = "#FF4444";
    context.beginPath();
    context.ellipse(
      x + width * 0.3,
      y - height * 0.12,
      width * 0.06,
      height * 0.08,
      0.3,
      0,
      Math.PI * 2,
    );
    context.fill();

    // Wing
    context.fillStyle = "#F5F5F5";
    context.beginPath();
    context.ellipse(
      x - width * 0.05,
      y + height * 0.05,
      width * 0.25,
      height * 0.2,
      -0.3,
      0,
      Math.PI * 2,
    );
    context.fill();
    context.strokeStyle = "#D0D0D0";
    context.lineWidth = 1.5;
    context.stroke();

    // Feet (simple orange triangles)
    context.fillStyle = "#FFB347";
    // Left foot
    context.beginPath();
    context.moveTo(x - width * 0.15, y + height * 0.4);
    context.lineTo(x - width * 0.25, y + height * 0.48);
    context.lineTo(x - width * 0.05, y + height * 0.48);
    context.closePath();
    context.fill();
    // Right foot
    context.beginPath();
    context.moveTo(x + width * 0.05, y + height * 0.4);
    context.lineTo(x - width * 0.05, y + height * 0.48);
    context.lineTo(x + width * 0.15, y + height * 0.48);
    context.closePath();
    context.fill();
  }

  /**
   * Get the current bounding box of the chicken
   * @returns {Object} Bounding box {width, height}
   */
  getBounds() {
    return {
      width: 120 * this.scale,
      height: 120 * this.scale,
    };
  }

  /**
   * Clean up resources
   */
  dispose() {
    this.chickenImage = null;
    this.isLoaded = false;
  }
}
