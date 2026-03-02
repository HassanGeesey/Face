/**
 * Storage Service for Quotly.
 * Supports offline-ready functionality through a dependency injection pattern.
 */

let storageEngine = {
  getItem: async (key) => {
    console.warn("Storage engine not set. Using volatile memory storage.");
    return memoryStorage[key] || null;
  },
  setItem: async (key, value) => {
    console.warn("Storage engine not set. Using volatile memory storage.");
    memoryStorage[key] = value;
  },
  removeItem: async (key) => {
    console.warn("Storage engine not set. Using volatile memory storage.");
    delete memoryStorage[key];
  },
  getAllKeys: async () => {
    console.warn("Storage engine not set. Using volatile memory storage.");
    return Object.keys(memoryStorage);
  }
};

const memoryStorage = {};
const QUOTATION_PREFIX = "@quotly_quotation_";

/**
 * Injects a storage engine (e.g., AsyncStorage from React Native).
 * @param {Object} engine - Object with getItem, setItem, removeItem, and optionally getAllKeys methods.
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
  const key = `${QUOTATION_PREFIX}${id}`;
  await storageEngine.setItem(key, JSON.stringify(quotation));
}

/**
 * Retrieves a quotation from storage.
 * @param {string} id - Unique identifier for the quotation.
 * @returns {Promise<Object|null>}
 */
export async function getQuotation(id) {
  const key = `${QUOTATION_PREFIX}${id}`;
  const data = await storageEngine.getItem(key);
  return data ? JSON.parse(data) : null;
}

/**
 * Deletes a quotation from storage.
 * @param {string} id - Unique identifier for the quotation.
 */
export async function deleteQuotation(id) {
  const key = `${QUOTATION_PREFIX}${id}`;
  await storageEngine.removeItem(key);
}

/**
 * Retrieves all saved quotations.
 * @returns {Promise<Object[]>}
 */
export async function getAllQuotations() {
  let keys = [];
  if (storageEngine.getAllKeys) {
    keys = await storageEngine.getAllKeys();
  } else if (storageEngine.keys) {
    // Some storage engines might use .keys()
    keys = await storageEngine.keys();
  }

  const quotationKeys = keys.filter(key => key.startsWith(QUOTATION_PREFIX));
  const quotations = [];

  for (const key of quotationKeys) {
    try {
      const data = await storageEngine.getItem(key);
      if (data) {
        quotations.push(JSON.parse(data));
      }
    } catch (err) {
      console.error(`Failed to parse quotation data for key ${key}:`, err);
    }
  }

  return quotations;
}
