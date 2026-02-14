import { validateQuotation } from './utils/validation.js';
import { generatePDF } from './services/pdfService.js';

/**
 * Manager function to handle different operation modes
 * @param {Object} quotation - The quotation data
 * @param {string} mode - 'A' (Debug JSON), 'B' (Generate PDF), 'C' (Validate)
 * @returns {Promise<any>}
 */
export async function quotlyManager(quotation, mode = 'C') {
  const validation = validateQuotation(quotation);

  switch (mode) {
    case 'A':
      // Mode A: Return JSON for debugging
      return {
        mode: 'DEBUG_JSON',
        isValid: validation.isValid,
        errors: validation.errors,
        data: quotation
      };

    case 'B':
      // Mode B: Generate PDF (validates first)
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }
      return await generatePDF(quotation);

    case 'C':
    default:
      // Mode C: Validate & review
      return validation;
  }
}
