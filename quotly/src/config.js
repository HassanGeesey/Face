const getEnv = (key, fallback = '') => {
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key];
    }
  } catch (e) {
    // process.env might be restricted or throw in some environments
  }
  return fallback;
};

export const CONFIG = {
  TEMPLATE_ID: getEnv('QUOTLY_TEMPLATE_ID'),
  API_KEY: getEnv('QUOTLY_API_KEY'),
  BASE_URL: getEnv('QUOTLY_BASE_URL', 'https://pdfgen.app/api/generate'),
};
