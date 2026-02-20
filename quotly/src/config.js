/**
 * Configuration for the Quotly library.
 */

// In React Native, you might use react-native-config or similar.
// For this library, we use process.env or defaults.
const config = {
  templateId: process.env.QUOTLY_TEMPLATE_ID || "fa5790d",
  apiKey: process.env.QUOTLY_API_KEY || "lCi76rUCD3onQBnGIifE7",
  baseUrl: process.env.QUOTLY_BASE_URL || "https://pdfgen.app/api/generate",
};

export default config;
