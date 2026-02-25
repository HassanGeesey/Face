const getEnv = (key, defaultValue) => {
  try {
    // Attempt to access process.env (Node.js) or global environment variables (React Native)
    const value = typeof process !== 'undefined' && process.env ? process.env[key] : null;
    return value || defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

export const CONFIG = {
  TEMPLATE_ID: getEnv('QUOTLY_TEMPLATE_ID', 'fa5790d'),
  API_KEY: getEnv('QUOTLY_API_KEY', 'lCi76rUCD3onQBnGIifE7'),
  BASE_URL: 'https://pdfgen.app/api/generate',
};
