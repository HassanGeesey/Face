/**
 * Safe helper to get environment variables, compatible with React Native.
 * @param {string} key - The environment variable key.
 * @param {string} defaultValue - The default value if not found.
 * @returns {string}
 */
export function getEnv(key, defaultValue) {
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key];
    }
  } catch (e) {
    // process.env might be restricted or throw in some environments
  }
  return defaultValue;
}

export const CONFIG = {
  TEMPLATE_ID: getEnv('QUOTLY_TEMPLATE_ID', 'fa5790d'),
  API_KEY: getEnv('QUOTLY_API_KEY', 'lCi76rUCD3onQBnGIifE7'),
  BASE_URL: 'https://pdfgen.app/api/generate',
};
