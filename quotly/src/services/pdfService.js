import { QUOTLY_API_KEY, QUOTLY_BASE_URL, QUOTLY_TEMPLATE_ID } from "../config.js";

/**
 * Generate PDF from quotation data via API
 * @param {Object} quotation
 * @returns {Promise<Blob>}
 */
export async function generatePDF(quotation) {
  const url = `${QUOTLY_BASE_URL}?templateId=${QUOTLY_TEMPLATE_ID}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api_key": QUOTLY_API_KEY,
    },
    body: JSON.stringify({ data: quotation }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(`Failed to generate PDF: ${response.status} ${errorText}`);
  }

  return await response.blob();
}
