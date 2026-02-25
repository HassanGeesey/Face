import { CONFIG } from '../config.js';

/**
 * Generate a PDF for the given quotation.
 * @param {import('../types').Quotation} quotation
 * @param {Object} [options]
 * @param {string} [options.templateId]
 * @param {string} [options.apiKey]
 * @returns {Promise<Blob>}
 */
export async function generatePDF(quotation, options = {}) {
  const templateId = options.templateId || quotation.templateId || CONFIG.TEMPLATE_ID;
  const apiKey = options.apiKey || CONFIG.API_KEY;

  const url = `${CONFIG.BASE_URL}?templateId=${templateId}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api_key': apiKey,
    },
    body: JSON.stringify({ data: quotation }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to generate PDF: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return await response.blob();
}
