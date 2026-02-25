import { calculateDetailedTotals } from './utils/calculations.js';
import { validateQuotation } from './utils/validation.js';
import { generatePDF } from './services/pdfService.js';

/**
 * Manager function to handle different operation modes.
 * @param {import('./types').Quotation} quotation
 * @param {'A' | 'B' | 'C'} mode - A: Debug JSON, B: Generate PDF, C: Validate
 * @param {Object} [options] - Overrides for templateId, apiKey, etc.
 * @returns {Promise<any>}
 */
export async function quotlyManager(quotation, mode, options = {}) {
  // Always synchronize totals before any operation
  const synchronizedQuotation = calculateDetailedTotals(quotation);

  switch (mode) {
    case 'A': // Mode A: Return JSON for debugging
      return synchronizedQuotation;

    case 'B': // Mode B: Call API to generate PDF
      const errors = validateQuotation(synchronizedQuotation);
      if (errors.length > 0) {
        throw new Error(`Validation failed: ${errors.join(' ')}`);
      }
      return await generatePDF(synchronizedQuotation, options);

    case 'C': // Mode C: Validate & review totals
      const validationErrors = validateQuotation(synchronizedQuotation);

      // Integrity check: Compare provided grandTotal with recalculated one
      const integrityIssues = [];
      if (quotation.grandTotal && quotation.grandTotal !== synchronizedQuotation.grandTotal) {
        integrityIssues.push(`Grand total mismatch: Provided ${quotation.grandTotal}, Recalculated ${synchronizedQuotation.grandTotal}`);
      }

      return {
        valid: validationErrors.length === 0 && integrityIssues.length === 0,
        errors: validationErrors,
        integrityIssues,
        quotation: synchronizedQuotation,
      };

    default:
      throw new Error(`Unknown mode: ${mode}`);
  }
}
