import { validateQuotation } from './utils/validation.js';
import { generatePDF } from './services/pdfService.js';

/**
 * Manages quotation operations based on the specified mode.
 * @param {Object} quotation The quotation data.
 * @param {string} mode 'A' (Debug JSON), 'B' (Generate PDF), or 'C' (Validate).
 * @returns {Promise<any>}
 */
export async function quotlyManager(quotation, mode) {
  switch (mode) {
    case 'A': // Mode A: Return JSON for debugging
      return JSON.stringify(quotation, null, 2);

    case 'B': // Mode B: Call API to generate PDF
      const validation = validateQuotation(quotation);
      if (!validation.valid) {
        throw new Error("Validation failed: " + validation.errors.join(", "));
      }
      return await generatePDF(quotation);

    case 'C': // Mode C: Validate & review
      return validateQuotation(quotation);

    default:
      throw new Error("Invalid mode. Use A, B, or C.");
  }
}
