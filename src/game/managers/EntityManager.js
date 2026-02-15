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
    // Process additions
    if (this.entitiesToAdd.length > 0) {
      this.entities.push(...this.entitiesToAdd);
      this.entitiesToAdd = [];
    }

    // Update active entities
    for (const entity of this.entities) {
      if (entity.active) {
        entity.update(deltaTime);
      }
    }

    // Process removals
    if (this.entitiesToRemove.length > 0) {
      for (const entityToRemove of this.entitiesToRemove) {
        const index = this.entities.indexOf(entityToRemove);
        if (index !== -1) {
          this.entities.splice(index, 1);
          entityToRemove.destroy();
        }
      }
      this.entitiesToRemove = [];
    }
  }

  /**
   * Render all entities
   */
  render(renderer) {
    for (const entity of this.entities) {
      if (entity.visible) {
        entity.render(renderer);
      }
    }
  }

  /**
   * Clear all entities
   */
  clear() {
    for (const entity of this.entities) {
      entity.destroy();
    }
    this.entities = [];
    this.entitiesToAdd = [];
    this.entitiesToRemove = [];
  }

  /**
   * Get entity count
   */
  getEntityCount() {
    return this.entities.length;
  }
}
