import { CONFIG } from "../config.js";

export async function generatePDF(quotation) {
  const url = `${CONFIG.BASE_URL}?templateId=${CONFIG.TEMPLATE_ID}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      api_key: CONFIG.API_KEY,
    },
    body: JSON.stringify({ data: quotation }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to generate PDF: ${response.statusText}. ${errorText}`);
  }

  // In a Node.js environment (like for tests), response.blob() might not be directly available
  // without a polyfill or using a different response method.
  // However, for React Native (as requested), response.blob() is standard.
  return response.blob();
}
