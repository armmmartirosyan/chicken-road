/**
 * InputSystem - Handles mouse/touch input for the game
 * Manages input state and event handling
 */
export class InputSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.isDragging = false;
    this.mouseX = 0;
    this.mouseY = 0;
    this.dragStartX = 0;
    this.dragStartY = 0;

    // Event listeners
    this.onDragStartCallbacks = [];
    this.onDragMoveCallbacks = [];
    this.onDragEndCallbacks = [];

    this.setupEventListeners();
  }

  /**
   * Setup mouse/touch event listeners
   */
  setupEventListeners() {
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);

    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    this.canvas.addEventListener("mouseup", this.handleMouseUp);
    this.canvas.addEventListener("mouseleave", this.handleMouseLeave);
  }

  /**
   * Handle mouse down
   */
  handleMouseDown(event) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouseX = event.clientX - rect.left;
    this.mouseY = event.clientY - rect.top;
    this.dragStartX = this.mouseX;
    this.dragStartY = this.mouseY;
    this.isDragging = true;

    this.onDragStartCallbacks.forEach((callback) => {
      callback(this.mouseX, this.mouseY);
    });
  }

  /**
   * Handle mouse move
   */
  handleMouseMove(event) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouseX = event.clientX - rect.left;
    this.mouseY = event.clientY - rect.top;

    if (this.isDragging) {
      this.onDragMoveCallbacks.forEach((callback) => {
        callback(this.mouseX, this.mouseY);
      });
    }
  }

  /**
   * Handle mouse up
   */
  handleMouseUp() {
    if (this.isDragging) {
      this.isDragging = false;
      this.onDragEndCallbacks.forEach((callback) => {
        callback();
      });
    }
  }

  /**
   * Handle mouse leave
   */
  handleMouseLeave() {
    if (this.isDragging) {
      this.isDragging = false;
      this.onDragEndCallbacks.forEach((callback) => {
        callback();
      });
    }
  }

  /**
   * Register drag start callback
   */
  onDragStart(callback) {
    this.onDragStartCallbacks.push(callback);
  }

  /**
   * Register drag move callback
   */
  onDragMove(callback) {
    this.onDragMoveCallbacks.push(callback);
  }

  /**
   * Register drag end callback
   */
  onDragEnd(callback) {
    this.onDragEndCallbacks.push(callback);
  }

  /**
   * Update input system (called each frame)
   */
  update(deltaTime) {
    // Process any input state updates
    void deltaTime;
  }

  /**
   * Clean up event listeners
   */
  destroy() {
    this.canvas.removeEventListener("mousedown", this.handleMouseDown);
    this.canvas.removeEventListener("mousemove", this.handleMouseMove);
    this.canvas.removeEventListener("mouseup", this.handleMouseUp);
    this.canvas.removeEventListener("mouseleave", this.handleMouseLeave);

    this.onDragStartCallbacks = [];
    this.onDragMoveCallbacks = [];
    this.onDragEndCallbacks = [];
  }
}
