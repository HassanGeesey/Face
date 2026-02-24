import { CONFIG } from '../config.js';

/**
 * Generate a PDF for the given quotation using pdfgen.app API.
 * @param {import('../types').Quotation} quotation
 * @param {Object} [options]
 * @param {string} [options.templateId] - Override default Template ID.
 * @param {string} [options.apiKey] - Override default API Key.
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
    let errorDetail = '';
    try {
      const errorJson = await response.json();
      errorDetail = `: ${JSON.stringify(errorJson)}`;
    } catch (e) {
      errorDetail = `: ${response.statusText}`;
    }
    throw new Error(`Failed to generate PDF${errorDetail}`);
  }

  return await response.blob();
}
