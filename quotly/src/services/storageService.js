/**
 * @typedef {Object} StorageEngine
 * @property {function(string, string): Promise<void>} setItem
 * @property {function(string): Promise<string|null>} getItem
 * @property {function(string): Promise<void>} removeItem
 * @property {function(): Promise<string[]>} getAllKeys
 */

let storageEngine = {
  _data: new Map(),
  async setItem(key, value) {
    console.warn("StorageService: Using volatile memory fallback. Data will not persist across restarts.");
    this._data.set(key, value);
  },
  async getItem(key) {
    return this._data.get(key) || null;
  },
  async removeItem(key) {
    this._data.delete(key);
  },
  async getAllKeys() {
    return Array.from(this._data.keys());
  }
};

const QUOTATION_PREFIX = "@quotly_quotation_";

/**
 * Sets a custom storage engine (e.g., AsyncStorage for React Native).
 * @param {StorageEngine} engine - The storage engine to use.
 */
export function setStorageEngine(engine) {
  if (engine && typeof engine.setItem === 'function' && typeof engine.getItem === 'function') {
    storageEngine = engine;
  } else {
    throw new Error("Invalid storage engine provided.");
  }
}

/**
 * Saves a quotation to persistent storage.
 * @param {string} id - Unique identifier for the quotation.
 * @param {Object} quotation - Quotation object.
 */
export async function saveQuotation(id, quotation) {
  const key = `${QUOTATION_PREFIX}${id}`;
  await storageEngine.setItem(key, JSON.stringify(quotation));
}

/**
 * Retrieves a quotation from storage.
 * @param {string} id - Unique identifier.
 * @returns {Promise<Object|null>} - The quotation or null if not found.
 */
export async function getQuotation(id) {
  const key = `${QUOTATION_PREFIX}${id}`;
  const data = await storageEngine.getItem(key);
  return data ? JSON.parse(data) : null;
}

/**
 * Retrieves all saved quotations.
 * @returns {Promise<Object[]>} - Array of quotation objects.
 */
export async function getAllQuotations() {
  const allKeys = await storageEngine.getAllKeys();
  const quotlyKeys = allKeys.filter(key => key.startsWith(QUOTATION_PREFIX));

  const quotations = [];
  for (const key of quotlyKeys) {
    const data = await storageEngine.getItem(key);
    if (data) {
      quotations.push(JSON.parse(data));
    }
  }
  return quotations;
}

/**
 * Deletes a quotation from storage.
 * @param {string} id - Unique identifier.
 */
export async function deleteQuotation(id) {
  const key = `${QUOTATION_PREFIX}${id}`;
  await storageEngine.removeItem(key);
}

export const storageService = {
  saveQuotation,
  getQuotation,
  getAllQuotations,
  deleteQuotation,
};
