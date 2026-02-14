import { CONFIG } from '../config.js';

/**
 * Generate a PDF quotation via pdfgen.app API
 * @param {Object} quotation - The quotation data object
 * @returns {Promise<Blob>} - Resolves to the PDF blob
 */
export async function generatePDF(quotation) {
  const url = `${CONFIG.BASE_URL}?templateId=${CONFIG.TEMPLATE_ID}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api_key": CONFIG.API_KEY,
    },
    body: JSON.stringify({ data: quotation }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to generate PDF: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return await response.blob();
}
