import { CONFIG } from '../config.js';

/**
 * Generate PDF via pdfgen.app
 * @param {import('../types').Quotation} quotation
 * @param {Object} [options]
 * @param {string} [options.templateId]
 * @param {string} [options.apiKey]
 * @returns {Promise<Blob>}
 */
export async function generatePDF(quotation, options = {}) {
  const finalTemplateId = options.templateId || CONFIG.TEMPLATE_ID;
  const finalApiKey = options.apiKey || CONFIG.API_KEY;

  if (!finalTemplateId) throw new Error('Template ID is required for PDF generation');
  if (!finalApiKey) throw new Error('API Key is required for PDF generation');

  const url = `${CONFIG.BASE_URL}?templateId=${finalTemplateId}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api_key': finalApiKey,
    },
    body: JSON.stringify({ data: quotation }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to generate PDF: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return await response.blob();
}
