/**
 * EntityManager - Manages all game entities
 * Handles entity lifecycle and batch operations
 */
export class EntityManager {
  constructor() {
    this.entities = [];
    this.entitiesToAdd = [];
    this.entitiesToRemove = [];
  }

  /**
   * Add an entity
   */
  addEntity(entity) {
    this.entitiesToAdd.push(entity);
  }

  /**
   * Remove an entity
   */
  removeEntity(entity) {
    this.entitiesToRemove.push(entity);
  }

  /**
   * Get all entities
   */
  getEntities() {
    return this.entities;
  }

  /**
   * Get entities of a specific type
   */
  getEntitiesOfType(type) {
    return this.entities.filter((entity) => entity instanceof type);
  }

  /**
   * Update all entities
   */
  update(deltaTime) {
    // Process additions (batch operation)
    if (this.entitiesToAdd.length > 0) {
      this.entities.push(...this.entitiesToAdd);
      this.entitiesToAdd.length = 0; // Faster than = []
    }

    // Update active entities
    for (let i = 0; i < this.entities.length; i++) {
      const entity = this.entities[i];
      if (entity.active) {
        entity.update(deltaTime);
      }
    }

    // Process removals (batch operation)
    if (this.entitiesToRemove.length > 0) {
      // Use filter for better performance with many removals
      const toRemoveSet = new Set(this.entitiesToRemove);
      this.entities = this.entities.filter((entity) => {
        if (toRemoveSet.has(entity)) {
          entity.destroy();
          return false;
        }
        return true;
      });
      this.entitiesToRemove.length = 0;
    }
  }

  /**
   * Render all entities
   */
  render(renderer) {
    // Optimized: use for loop instead of for...of for better performance
    for (let i = 0; i < this.entities.length; i++) {
      const entity = this.entities[i];
      if (entity.visible) {
        entity.render(renderer);
      }
    }
  }

  /**
   * Clear all entities
   */
  clear() {
    // Optimized: destroy all and clear arrays efficiently
    for (let i = 0; i < this.entities.length; i++) {
      this.entities[i].destroy();
    }
    this.entities.length = 0;
    this.entitiesToAdd.length = 0;
    this.entitiesToRemove.length = 0;
  }

  /**
   * Get entity count
   */
  getEntityCount() {
    return this.entities.length;
  }
}
