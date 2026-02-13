import { CONFIG } from "../config.js";

/**
 * Generate a PDF quotation using the pdfgen.app API
 * @param {Object} quotation
 * @returns {Promise<Blob>}
 */
export async function generatePDF(quotation) {
  const url = `${CONFIG.BASE_URL}/api/generate?templateId=${CONFIG.TEMPLATE_ID}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      api_key: CONFIG.API_KEY,
    },
    body: JSON.stringify({ data: quotation }),
  });

  if (!response.ok) {
    let errorMessage = response.statusText;
    try {
      const errorData = await response.text();
      if (errorData) errorMessage += `: ${errorData}`;
    } catch (e) {
      // Ignore text parse error
    }
    throw new Error(`Failed to generate PDF: ${response.status} ${errorMessage}`);
  }

  return await response.blob();
}
