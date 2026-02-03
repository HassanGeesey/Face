import { API_CONFIG } from '../config.js';

/**
 * Generate PDF via pdfgen.app API
 * @param {Object} quotation - The quotation data object
 * @returns {Promise<Blob>} - The PDF blob
 */
export async function generatePDF(quotation) {
  const response = await fetch(
    `${API_CONFIG.baseUrl}?templateId=${API_CONFIG.templateId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api_key": API_CONFIG.apiKey,
      },
      body: JSON.stringify({ data: quotation }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to generate PDF: ${response.status} ${response.statusText} - ${errorText}`);
  }

  // Consistent with prompt's suggestion to return blob
  return await response.blob();
}
