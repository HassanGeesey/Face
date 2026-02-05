import { CONFIG } from '../config.js';

/**
 * Generate PDF from quotation data using pdfgen.app API
 * @param {Object} quotation
 * @returns {Promise<Blob>}
 */
export async function generatePDF(quotation) {
  const { TEMPLATE_ID, API_KEY, BASE_URL } = CONFIG.PDF_GEN;
  const url = `${BASE_URL}?templateId=${TEMPLATE_ID}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api_key": API_KEY,
    },
    body: JSON.stringify({ data: quotation }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to generate PDF: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return await response.blob();
}
