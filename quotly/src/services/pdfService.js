import { CONFIG } from '../config.js';

export async function generatePDF(quotation) {
  const response = await fetch(
    `${CONFIG.BASE_URL}?templateId=${CONFIG.TEMPLATE_ID}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api_key": CONFIG.API_KEY,
      },
      body: JSON.stringify({ data: quotation }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to generate PDF: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return await response.blob();
}
