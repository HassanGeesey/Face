import { updateLineItemsTotals, calculateGrandTotal } from './utils/calculations.js';
import { validateQuotation } from './utils/validation.js';
import { generatePDF } from './services/pdfService.js';

/**
 * Main manager function for Quotly operations.
 * @param {Object} quotation
 * @param {'A' | 'B' | 'C'} mode
 * @returns {Promise<any>}
 */
export async function quotlyManager(quotation, mode) {
  // 1. Automatically recalculate and synchronize all totals
  const updatedLineItems = updateLineItemsTotals(quotation.lineItems || []);
  const updatedQuotation = {
    ...quotation,
    lineItems: updatedLineItems,
    grandTotal: calculateGrandTotal(updatedLineItems),
  };

  switch (mode) {
    case 'A': // Mode A: Return JSON for debugging
      return updatedQuotation;

    case 'B': // Mode B: Call API to generate PDF and return file (blob)
      // We should probably validate before calling the API in Mode B too
      const validationB = validateQuotation(updatedQuotation);
      if (!validationB.valid) {
        throw new Error(`Validation failed for PDF generation: ${validationB.errors.join(', ')}`);
      }
      return await generatePDF(updatedQuotation);

    case 'C': // Mode C: Validate & review totals, line items, errors
      return validateQuotation(updatedQuotation);

    default:
      throw new Error(`Invalid mode: ${mode}. Supported modes are A, B, and C.`);
  }
}
