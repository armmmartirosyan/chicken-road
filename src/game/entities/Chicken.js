import { BaseEntity } from "./BaseEntity.js";

/**
 * Chicken - The player character entity using Spine animation
 * Handles chicken rendering and animation with hardware acceleration
 */
export class Chicken extends BaseEntity {
  constructor(x, y, config) {
    super(x, y);

    this.config = config;
    this.baseSize = config.chickenSize || 280;
    this.scale = config.chickenScale || 0.5; // Reduced default scale for Spine
    this.width = this.baseSize * this.scale;
    this.height = this.baseSize * this.scale;

    this.facingRight = true;
    this.currentAnimation = "idle";
    this.spine = null;

    // Jump state
    this.isJumping = false;
    this.jumpStartX = x;
    this.jumpEndX = x;
    this.jumpStartY = y;
    this.jumpProgress = 0;
    this.jumpDuration = 0.4; // 400ms jump animation for smooth arc
    this.worldOffsetX = 0; // Track world offset for fixed chicken position
    this.minY = 50; // Minimum Y position to prevent going too high
    this.hasStartedJumpAnimation = false; // Track if animation has started

    // World movement animation
    this.shouldMoveWorld = false;
    this.startWorldOffset = 0;
    this.endWorldOffset = 0;
    this.maxWorldOffset = 0; // Maximum allowed offset to prevent showing black space
    this.stage = null; // Reference to Pixi stage for world movement
    this.fixedViewportX = null; // Fixed X position in viewport during world movement
  }

  /**
   * Set the Spine animation
   */
  setSpine(spine) {
    // Guard against destroyed container
    if (!this.container) {
      console.warn("Cannot set spine: container is null");
      return;
    }

    if (this.spine) {
      this.spine.destroy();
    }

    this.spine = spine;

    if (!this.spine) {
      console.warn("Spine instance is null");
      return;
    }

    // Set scale
    this.spine.scale.set(this.scale);

    // Center the spine animation
    // Spine animations are typically centered at origin, but we may need to adjust
    this.spine.x = 0;
    this.spine.y = 0;

    // Disable culling to ensure Spine is always rendered
    this.spine.cullable = false;

    // Ensure container is always visible and not masked
    this.container.cullable = false;
    this.container.mask = null;
    this.container.zIndex = 100; // High z-index to keep chicken on top

    // Ensure Spine bounds are properly calculated for visibility
    if (this.spine.getBounds) {
      this.spine.getBounds(true); // Force bounds calculation
    }

    // Set initial animation state
    if (this.spine.state) {
      // Try to play idle animation
      const animationNames = ["idle", "idle_front", "walk", "stand"];
      let foundAnimation = false;

      for (const animName of animationNames) {
        try {
          this.spine.state.setAnimation(0, animName, true);
          this.currentAnimation = animName;
          foundAnimation = true;
          console.log(`✅ Playing Spine animation: ${animName}`);
          break;
        } catch {
          // Animation doesn't exist, try next
        }
      }

      if (!foundAnimation) {
        console.warn(
          "No idle animation found, trying first available animation",
        );
        const animations = this.spine.spineData?.animations;
        if (animations && animations.length > 0) {
          this.spine.state.setAnimation(0, animations[0].name, true);
          this.currentAnimation = animations[0].name;
          console.log(`✅ Playing first animation: ${animations[0].name}`);
        }
      }

      // Set up animation event listener for smooth transitions
      this.spine.state.addListener({
        complete: (entry) => {
          // When jump animation completes, return to idle
          if (entry.animation.name === "jump" && !this.isJumping) {
            this.spine.state.timeScale = 1;
            this.playAnimation("idle", true);
          }
        },
      });
    }

    // Update scale based on facing direction
    if (!this.facingRight) {
      this.spine.scale.x = -Math.abs(this.spine.scale.x);
    }

    this.container.addChild(this.spine);
  }

  /**
   * Set the direction the chicken is facing
   */
  setDirection(facingRight) {
    this.facingRight = facingRight;
    if (this.spine) {
      this.spine.scale.x =
        Math.abs(this.spine.scale.x) * (facingRight ? 1 : -1);
    }
  }

  /**
   * Play animation
   */
  playAnimation(animationName, loop = true) {
    if (
      this.spine &&
      this.spine.state &&
      this.currentAnimation !== animationName
    ) {
      try {
        this.spine.state.setAnimation(0, animationName, loop);
        this.currentAnimation = animationName;
      } catch {
        console.warn(`Animation ${animationName} not found`);
      }
    }
  }

  /**
   * Jump to a target X position with vertical arc
   * @param {number} targetX - Target world X position
   * @param {boolean} shouldMoveWorld - If true, world moves instead of chicken after lane 2
   * @param {Object} worldAnimationData - Data for world movement animation {stage, startOffset, endOffset, fixedViewportX}
   */
  jumpTo(targetX, shouldMoveWorld = false, worldAnimationData = null) {
    if (this.isJumping) return; // Already jumping

    this.isJumping = true;
    this.jumpStartX = this.x;
    this.jumpEndX = targetX;
    this.jumpStartY = this.y;
    this.jumpProgress = 0;
    this.shouldMoveWorld = shouldMoveWorld;
    this.hasStartedJumpAnimation = false; // Reset animation flag

    // Set up world movement animation if needed
    if (shouldMoveWorld && worldAnimationData) {
      this.stage = worldAnimationData.stage;
      this.startWorldOffset = worldAnimationData.startOffset;
      this.endWorldOffset = worldAnimationData.endOffset;
      this.maxWorldOffset = worldAnimationData.maxWorldOffset || Infinity;
      this.fixedViewportX = worldAnimationData.fixedViewportX;
      console.log(
        `🌍 Preparing world animation from ${this.startWorldOffset} to ${this.endWorldOffset} (max: ${this.maxWorldOffset})`,
      );
    } else {
      this.stage = null;
      this.startWorldOffset = 0;
      this.endWorldOffset = 0;
      this.maxWorldOffset = 0;
      this.fixedViewportX = null;
    }

    // Animation will start in update() right before position changes
    console.log(
      "🐔 Jump initiated, animation will start before position changes",
    );
  }

  /**
   * Update chicken state
   */
  update(deltaTime) {
    if (!this.active) return;

    // Handle jump movement with vertical arc
    if (this.isJumping) {
      this.jumpProgress += deltaTime / this.jumpDuration;

      // Start jump animation right before horizontal position starts changing
      if (!this.hasStartedJumpAnimation && this.jumpProgress > 0) {
        this.hasStartedJumpAnimation = true;
        if (this.spine && this.spine.state) {
          try {
            this.spine.state.setAnimation(0, "jump", false);
            this.spine.state.timeScale = 2;
            this.currentAnimation = "jump";
            console.log("✅ Playing jump animation before position changes");
          } catch {
            console.warn("Jump animation not found, falling back to walk");
            const fallbackAnimations = ["walk", "idle_front", "idle"];
            for (const anim of fallbackAnimations) {
              try {
                this.spine.state.setAnimation(0, anim, false);
                this.currentAnimation = anim;
                break;
              } catch {
                // Continue to next fallback
              }
            }
          }
        }
      }

      if (this.jumpProgress >= 1) {
        // Jump complete
        this.jumpProgress = 1;
        this.isJumping = false;

        // Update internal world position
        this.x = this.jumpEndX;

        // Update visual position only if not moving world
        // When moving world, chicken stays at fixed viewport position
        if (!this.shouldMoveWorld) {
          this.container.position.x = this.x;
        } else if (this.fixedViewportX !== null) {
          // Ensure chicken stays at fixed position
          this.container.position.x = this.fixedViewportX;
        }

        // Finalize world position if animating
        if (this.shouldMoveWorld && this.stage) {
          // Clamp to valid range
          const clampedOffset = Math.max(
            0,
            Math.min(this.endWorldOffset, this.maxWorldOffset),
          );
          this.stage.x = -clampedOffset;
          console.log(
            `🌍 World animation complete at offset: ${-clampedOffset}`,
          );
        }

        // Reset Y position to ground level
        this.y = this.jumpStartY;
        this.container.position.y = this.y;

        // Ensure container visibility
        this.container.visible = true;
        this.container.alpha = 1.0;
      } else {
        // Interpolate position with easing
        const easeProgress = this.easeInOutQuad(this.jumpProgress);

        // Update internal world position
        this.x =
          this.jumpStartX + (this.jumpEndX - this.jumpStartX) * easeProgress;

        // Horizontal position handling
        if (!this.shouldMoveWorld) {
          // Normal mode: chicken moves horizontally
          this.container.position.x = this.x;
        } else {
          // World movement mode: chicken stays fixed, world moves
          if (this.fixedViewportX !== null) {
            this.container.position.x = this.fixedViewportX;
          }

          // Animate world/stage offset smoothly
          if (this.stage) {
            const currentWorldOffset =
              this.startWorldOffset +
              (this.endWorldOffset - this.startWorldOffset) * easeProgress;
            // Clamp to valid range to prevent black space
            const clampedOffset = Math.max(
              0,
              Math.min(currentWorldOffset, this.maxWorldOffset),
            );
            this.stage.x = -clampedOffset;
          }
        }

        // Vertical movement - no arc, keep at ground level
        this.y = this.jumpStartY;
        this.container.position.y = this.y;

        // Ensure container remains visible during jump
        this.container.visible = true;
        this.container.alpha = 1.0;
      }
    }

    // Update visibility and ensure container state is correct
    if (this.container) {
      this.container.visible = this.visible;
      this.container.alpha = 1.0;
    }

    // Call parent update AFTER our position updates to sync x/y properties
    super.update(deltaTime);

    // Spine animation updates automatically via Pixi ticker
  }

  /**
   * Easing function for smooth jump (ease in-out)
   */
  easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  /**
   * Destroy and cleanup
   */
  destroy() {
    if (this.spine) {
      this.spine.destroy();
      this.spine = null;
    }
    super.destroy();
  }
}
