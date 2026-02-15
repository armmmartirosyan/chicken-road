import { BaseEntity } from "./BaseEntity.js";

/**
 * Chicken - The player character entity
 * Handles chicken rendering and animation
 */
export class Chicken extends BaseEntity {
  constructor(x, y, config) {
    super(x, y);

    this.config = config;
    this.baseSize = config.chickenSize || 280; // Slightly smaller than lane width (300px)
    this.scale = config.chickenScale || 1;
    this.width = this.baseSize * this.scale;
    this.height = this.baseSize * this.scale;

    this.facingRight = true;
    this.currentAnimation = "idle";
    this.animationTime = 0;
    this.image = null;
  }

  /**
   * Set the chicken sprite image
   */
  setImage(image) {
    this.image = image;
  }

  /**
   * Set the direction the chicken is facing
   */
  setDirection(facingRight) {
    this.facingRight = facingRight;
  }

  /**
   * Play animation
   */
  playAnimation(animationName) {
    if (this.currentAnimation !== animationName) {
      this.currentAnimation = animationName;
      this.animationTime = 0;
    }
  }

  /**
   * Update chicken state
   */
  update(deltaTime) {
    if (!this.active) return;

    this.animationTime += deltaTime;
  }

  /**
   * Render the chicken
   */
  render(renderer) {
    if (!this.visible) return;

    const context = renderer.getContext();
    context.save();

    // Calculate render dimensions
    const renderWidth = this.width;
    const renderHeight = this.height;

    // Simple idle animation - subtle bob
    const bobOffset = Math.sin(this.animationTime * 3) * 2;

    // Center position
    const centerX = this.x;
    const centerY = this.y + bobOffset;

    // Draw the chicken
    this.drawChicken(context, centerX, centerY, renderWidth, renderHeight);

    context.restore();
  }

  /**
   * Draw the chicken character (geometric representation)
   */
  drawChicken(context, x, y, width, height) {
    const scale = width / 120; // Base size is 120

    // Shadow
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

    // Body
    context.fillStyle = "#FFFFFF";
    context.beginPath();
    context.ellipse(x, y, width * 0.35, height * 0.4, 0, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = "#E0E0E0";
    context.lineWidth = 2 * scale;
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
    context.lineWidth = 2 * scale;
    context.stroke();

    // Comb (red top)
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
    context.lineWidth = 1.5 * scale;
    context.stroke();

    // Feet
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
}
