import { CONFIG } from '../config.js';

/**
 * Sends quotation data to the pdfgen.app API to generate a PDF.
 * This service is designed for use in React Native environment.
 * @param {Object} quotation - The validated quotation object.
 * @param {Object} [options] - Optional runtime overrides for templateId and apiKey.
 * @returns {Promise<Blob>} - Promise resolving to a PDF Blob.
 */
export async function generatePDF(quotation, options = {}) {
  const templateId = options.templateId || quotation.templateId || CONFIG.TEMPLATE_ID;
  const apiKey = options.apiKey || CONFIG.API_KEY;
  const url = `${CONFIG.API_URL}?templateId=${templateId}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api_key": apiKey,
    },
    body: JSON.stringify({ data: quotation }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to generate PDF: ${response.statusText} (${response.status}) - ${errorText}`);
  }

  // Returns a Blob which can be saved to disk using react-native-fs or shared.
  return await response.blob();
}
