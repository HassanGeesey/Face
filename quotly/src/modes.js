import { validateQuotation } from './utils/validation.js';
import { generatePDF } from './services/pdfService.js';

/**
 * Manages different operation modes for Quotly
 * @param {Object} quotation
 * @param {string} mode - 'A' (Debug JSON), 'B' (Generate PDF), 'C' (Validate)
 * @returns {Promise<any>}
 */
export async function quotlyManager(quotation, mode = 'A') {
  const validation = validateQuotation(quotation);

  switch (mode) {
    case 'A':
      return {
        mode: 'Debug JSON',
        data: quotation,
        validation,
      };

    case 'B':
      if (!validation.isValid) {
        throw new Error(`Validation failed for PDF generation: ${validation.errors.join(', ')}`);
      }
      return await generatePDF(quotation);

    case 'C':
      return {
        mode: 'Validate & Review',
        ...validation,
      };

    default:
      throw new Error(`Invalid mode: ${mode}. Use 'A', 'B', or 'C'.`);
  }
}
