import config from '../config.js';

/**
 * Generates a PDF for the given quotation using the pdfgen.app API.
 * @param {Object} quotation
 * @returns {Promise<Blob>}
 */
export async function generatePDF(quotation) {
  const url = `${config.baseUrl}?templateId=${config.templateId}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api_key": config.apiKey,
    },
    body: JSON.stringify({ data: quotation }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to generate PDF: ${response.status} ${response.statusText} - ${errorText}`);
  }

  // In Node.js environment (for tests), response.blob() might need a polyfill
  // but in React Native it is available.
  return await response.blob();
}
