/**
 * Volatile memory-based storage engine (Default).
 */
let memoryStorage = {};

const defaultStorage = {
  getItem: async (key) => memoryStorage[key] || null,
  setItem: async (key, value) => { memoryStorage[key] = value; },
  removeItem: async (key) => { delete memoryStorage[key]; },
  getAllKeys: async () => Object.keys(memoryStorage),
};

let storageEngine = defaultStorage;

/**
 * Injects a custom storage engine (e.g., AsyncStorage for React Native).
 * @param {Object} engine - Object with getItem, setItem, removeItem, and getAllKeys methods.
 */
export function setStorageEngine(engine) {
  storageEngine = engine;
}

/**
 * Saves a quotation to persistent storage.
 * @param {string} id - Unique identifier for the quotation.
 * @param {Object} quotation - Quotation data.
 */
export async function saveQuotation(id, quotation) {
  const data = JSON.stringify(quotation);
  await storageEngine.setItem(`quotation_${id}`, data);
}

/**
 * Retrieves a single quotation by ID.
 * @param {string} id - Unique identifier.
 * @returns {Promise<Object|null>}
 */
export async function getQuotation(id) {
  try {
    const data = await storageEngine.getItem(`quotation_${id}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error parsing quotation ${id}:`, error);
    return null;
  }
}

/**
 * Retrieves all stored quotations.
 * @returns {Promise<Object[]>}
 */
export async function getAllQuotations() {
  const keys = await storageEngine.getAllKeys();
  const quotationKeys = keys.filter(key => key.startsWith('quotation_'));

  const results = await Promise.all(
    quotationKeys.map(key => storageEngine.getItem(key))
  );

  return results
    .map(data => {
      try {
        return JSON.parse(data);
      } catch (e) {
        return null;
      }
    })
    .filter(q => q !== null);
}

/**
 * Deletes a quotation from storage.
 * @param {string} id - Unique identifier.
 */
export async function deleteQuotation(id) {
  await storageEngine.removeItem(`quotation_${id}`);
}
