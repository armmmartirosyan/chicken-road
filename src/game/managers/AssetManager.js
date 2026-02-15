/**
 * AssetManager - Handles loading and caching of game assets
 * Provides centralized asset management
 */
export class AssetManager {
  constructor() {
    this.images = new Map();
    this.loadingPromises = new Map();
  }

  /**
   * Load an image asset
   * @param {string} key - Unique identifier for the asset
   * @param {string} url - Path to the image
   * @returns {Promise<HTMLImageElement>}
   */
  loadImage(key, url) {
    // Return cached image if already loaded
    if (this.images.has(key)) {
      return Promise.resolve(this.images.get(key));
    }

    // Return existing promise if currently loading
    if (this.loadingPromises.has(key)) {
      return this.loadingPromises.get(key);
    }

    // Create new loading promise
    const promise = new Promise((resolve, reject) => {
      const image = new Image();

      image.onload = () => {
        this.images.set(key, image);
        this.loadingPromises.delete(key);
        resolve(image);
      };

      image.onerror = () => {
        this.loadingPromises.delete(key);
        reject(new Error(`Failed to load image: ${url}`));
      };

      image.src = url;
    });

    this.loadingPromises.set(key, promise);
    return promise;
  }

  /**
   * Load multiple images
   * @param {Array<{key: string, url: string}>} assets
   * @returns {Promise<void>}
   */
  async loadImages(assets) {
    const promises = assets.map(({ key, url }) => this.loadImage(key, url));
    await Promise.all(promises);
  }

  /**
   * Get a loaded image
   * @param {string} key
   * @returns {HTMLImageElement|null}
   */
  getImage(key) {
    return this.images.get(key) || null;
  }

  /**
   * Check if an image is loaded
   * @param {string} key
   * @returns {boolean}
   */
  hasImage(key) {
    return this.images.has(key);
  }

  /**
   * Clear all assets
   */
  clear() {
    this.images.clear();
    this.loadingPromises.clear();
  }

  /**
   * Get all loaded asset keys
   * @returns {string[]}
   */
  getLoadedKeys() {
    return Array.from(this.images.keys());
  }
}
