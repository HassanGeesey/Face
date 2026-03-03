let storageEngine = null;
const memoryStore = new Map();

/**
 * Sets the storage engine to be used (e.g., AsyncStorage).
 * @param {Object} engine - An object with getItem, setItem, and removeItem methods.
 */
export function setStorageEngine(engine) {
  storageEngine = engine;
}

/**
 * Gets the current storage engine or returns a memory-based fallback.
 * @returns {Object}
 */
function getEngine() {
  if (storageEngine) return storageEngine;

  console.warn("Quotly: No storage engine set. Using volatile memory storage.");
  return {
    getItem: async (key) => memoryStore.get(key) || null,
    setItem: async (key, value) => { memoryStore.set(key, value); },
    removeItem: async (key) => { memoryStore.delete(key); },
    getAllKeys: async () => Array.from(memoryStore.keys()),
  };
}

const STORAGE_KEY_PREFIX = "@quotly_quotation_";

/**
 * Saves a quotation to persistent storage.
 * @param {Object} quotation - The quotation to save.
 * @returns {Promise<void>}
 */
export async function saveQuotation(quotation) {
  const engine = getEngine();
  const id = quotation.id || Date.now().toString();
  const key = `${STORAGE_KEY_PREFIX}${id}`;
  const data = JSON.stringify({ ...quotation, id });
  await engine.setItem(key, data);
}

/**
 * Retrieves a quotation by ID.
 * @param {string} id - The quotation ID.
 * @returns {Promise<Object|null>}
 */
export async function getQuotation(id) {
  const engine = getEngine();
  const key = `${STORAGE_KEY_PREFIX}${id}`;
  const data = await engine.getItem(key);

  if (!data) return null;

  try {
    return JSON.parse(data);
  } catch (err) {
    console.error(`Quotly: Failed to parse quotation data for ID ${id}`, err);
    return null;
  }
}

/**
 * Retrieves all saved quotations.
 * @returns {Promise<Object[]>}
 */
export async function getAllQuotations() {
  const engine = getEngine();
  let keys = [];

  if (typeof engine.getAllKeys === 'function') {
    keys = await engine.getAllKeys();
  }

  const quotationKeys = keys.filter(key => key.startsWith(STORAGE_KEY_PREFIX));

  const results = await Promise.all(
    quotationKeys.map(async (key) => {
      const data = await engine.getItem(key);
      try {
        return data ? JSON.parse(data) : null;
      } catch (err) {
        console.error(`Quotly: Failed to parse quotation data for key ${key}`, err);
        return null;
      }
    })
  );

  return results.filter(item => item !== null);
}

/**
 * Deletes a quotation from storage.
 * @param {string} id - The quotation ID.
 * @returns {Promise<void>}
 */
export async function deleteQuotation(id) {
  const engine = getEngine();
  const key = `${STORAGE_KEY_PREFIX}${id}`;
  await engine.removeItem(key);
}
