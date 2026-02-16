import { CONFIG } from '../config.js';

/**
 * Call API to generate PDF
 * @param {import('../types').Quotation} quotation
 * @returns {Promise<Blob>}
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
    throw new Error(`Failed to generate PDF: ${response.statusText} - ${errorText}`);
  }

  return await response.blob();
}
