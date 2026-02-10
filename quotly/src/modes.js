import { validateQuotation } from './utils/validation.js';
import { generatePDF } from './services/pdfService.js';

/**
 * Manage quotation based on selected mode
 * @param {import('./types').Quotation} quotation
 * @param {'A' | 'B' | 'C'} mode
 */
export async function quotlyManager(quotation, mode) {
  switch (mode) {
    case 'A': // Debug JSON
      return JSON.stringify({ data: quotation }, null, 2);

    case 'B': // Generate PDF
      const validation = validateQuotation(quotation);
      if (!validation.valid) {
        throw new Error("Validation failed: " + validation.errors.join(", "));
      }
      return await generatePDF(quotation);

    case 'C': // Validate
      return validateQuotation(quotation);

    default:
      throw new Error("Invalid mode: " + mode);
  }
}
