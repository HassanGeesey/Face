import { config } from '../config.js';

/**
 * Generate PDF from quotation data
 * @param {Object} quotation
 * @returns {Promise<Blob|Object>}
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

  return await response.blob();
}
