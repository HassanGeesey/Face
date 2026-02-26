/**
 * Safe helper to fetch environment variables, ensuring React Native compatibility.
 * @param {string} key - Environment variable name.
 * @returns {string|undefined} - Value of the environment variable or undefined.
 */
const getEnv = (key) => {
  try {
    if (typeof process !== 'undefined' && process.env) {
      return process.env[key];
    }
  } catch (err) {
    // Environment variables might not be accessible in all mobile environments.
  }
  return undefined;
};

/**
 * App Configuration containing API settings.
 * Defaults are based on the Quotly specification.
 */
export const CONFIG = {
  TEMPLATE_ID: getEnv('QUOTLY_TEMPLATE_ID') || "fa5790d",
  API_KEY: getEnv('QUOTLY_API_KEY') || "lCi76rUCD3onQBnGIifE7",
  API_URL: "https://pdfgen.app/api/generate",
};
