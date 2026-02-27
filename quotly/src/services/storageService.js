/**
 * Offline storage service for Quotly.
 * Provides a standard interface for saving and retrieving quotations.
 */

const STORAGE_KEY = 'QUOTLY_OFFLINE_QUOTATIONS';

/**
 * Interface for the storage engine.
 * Users should provide an object with getItem and setItem methods (like AsyncStorage).
 */
let storageEngine = {
  getItem: async (key) => global.__quotlyMemoryStorage?.[key] || null,
  setItem: async (key, value) => {
    if (!global.__quotlyMemoryStorage) global.__quotlyMemoryStorage = {};
    global.__quotlyMemoryStorage[key] = value;
  }
};

/**
 * Configures a custom storage engine (e.g., @react-native-async-storage/async-storage).
 * @param {Object} engine - Storage engine with getItem and setItem methods.
 */
export function setStorageEngine(engine) {
  if (typeof engine.getItem !== 'function' || typeof engine.setItem !== 'function') {
    throw new Error('Storage engine must implement getItem and setItem methods.');
  }
  storageEngine = engine;
}

/**
 * Saves a quotation to local storage.
 * @param {Object} quotation - The quotation object to save.
 * @returns {Promise<void>}
 */
export async function saveQuotationLocally(quotation) {
  try {
    const existing = await getLocalQuotations();
    const updated = [...existing, {
      ...quotation,
      id: quotation.id || Date.now().toString(),
      savedAt: new Date().toISOString()
    }];

    await storageEngine.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    throw new Error(`Failed to save quotation locally: ${error.message}`);
  }
}

/**
 * Retrieves all saved quotations from local storage.
 * @returns {Promise<Array>} - List of saved quotations.
 */
export async function getLocalQuotations() {
  try {
    const data = await storageEngine.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading from local storage:', error);
    return [];
  }
}

/**
 * Clears all saved quotations from local storage.
 * @returns {Promise<void>}
 */
export async function clearLocalQuotations() {
  await storageEngine.setItem(STORAGE_KEY, JSON.stringify([]));
}
