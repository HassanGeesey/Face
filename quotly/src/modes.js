import { generatePDF } from './services/pdfService.js';
import { validateQuotation } from './utils/validation.js';

/**
 * Manage quotation based on selected mode
 * @param {import('./types').Quotation} quotation
 * @param {'A' | 'B' | 'C'} mode
 * @returns {Promise<any>}
 */
export async function quotlyManager(quotation, mode) {
  switch (mode) {
    case 'A':
      // Mode A: Return JSON for debugging
      return quotation;

    case 'B':
      // Mode B: Call API to generate PDF and return file (blob)
      const validation = validateQuotation(quotation);
      if (!validation.isValid) {
        throw new Error("Validation failed before PDF generation: " + validation.errors.join(", "));
      }
      return await generatePDF(quotation);

    case 'C':
      // Mode C: Validate & review totals, line items, errors
      return validateQuotation(quotation);

    default:
      throw new Error(`Invalid mode: ${mode}. Supported modes: A, B, C.`);
  }
}
