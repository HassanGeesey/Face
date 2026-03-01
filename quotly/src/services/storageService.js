/**
 * Memory-based storage engine (volatile).
 * Used as a fallback if no persistent engine is provided.
 */
class MemoryStorageEngine {
  constructor() {
    this.data = new Map();
    console.warn("Quotly: Using volatile MemoryStorageEngine. Data will be lost on app reload.");
  }

  async setItem(key, value) {
    this.data.set(key, value);
  }

  async getItem(key) {
    return this.data.get(key) || null;
  }

  async removeItem(key) {
    this.data.delete(key);
  }
}

let storageEngine = new MemoryStorageEngine();

/**
 * Injects a custom storage engine (e.g., AsyncStorage).
 * @param {Object} engine - Object with getItem, setItem, and removeItem methods.
 */
export function setStorageEngine(engine) {
  if (engine && typeof engine.getItem === 'function' && typeof engine.setItem === 'function' && typeof engine.removeItem === 'function') {
    storageEngine = engine;
  } else {
    throw new Error("Invalid storage engine provided. Must implement getItem, setItem, and removeItem.");
  }
}

const STORAGE_KEY = 'quotly_quotations';

/**
 * Offline Storage Service for Quotations.
 */
export const storageService = {
  /**
   * Saves a quotation to storage.
   * @param {Object} quotation - Quotation object.
   */
  async saveQuotation(quotation) {
    const quotations = await this.getAllQuotations();
    const id = quotation.id || Date.now().toString();
    const updatedQuotation = { ...quotation, id };

    const index = quotations.findIndex(q => q.id === id);
    if (index > -1) {
      quotations[index] = updatedQuotation;
    } else {
      quotations.push(updatedQuotation);
    }

    await storageEngine.setItem(STORAGE_KEY, JSON.stringify(quotations));
    return updatedQuotation;
  },

  /**
   * Retrieves all saved quotations.
   * @returns {Promise<Array>}
   */
  async getAllQuotations() {
    const data = await storageEngine.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  /**
   * Retrieves a single quotation by ID.
   * @param {string} id - Quotation ID.
   * @returns {Promise<Object|null>}
   */
  async getQuotation(id) {
    const quotations = await this.getAllQuotations();
    return quotations.find(q => q.id === id) || null;
  },

  /**
   * Deletes a quotation from storage.
   * @param {string} id - Quotation ID.
   */
  async deleteQuotation(id) {
    const quotations = await this.getAllQuotations();
    const filtered = quotations.filter(q => q.id !== id);
    await storageEngine.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }
};
