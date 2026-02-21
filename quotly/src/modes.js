import { updateLineItemsTotals, calculateGrandTotal } from './utils/calculations.js';
import { validateQuotation } from './utils/validation.js';
import { generatePDF } from './services/pdfService.js';

/**
 * Operation Modes:
 * Mode A: Debug JSON
 * Mode B: Generate PDF
 * Mode C: Validate
 */

/**
 * Manages quotation operations with automatic data synchronization
 * @param {Object} quotation
 * @param {string} mode 'A', 'B', or 'C'
 * @returns {Promise<any>}
 */
export async function quotlyManager(quotation, mode) {
  // 1. Sync data (Recalculate totals)
  const updatedLineItems = updateLineItemsTotals(quotation.lineItems);
  const updatedQuotation = {
    ...quotation,
    lineItems: updatedLineItems,
    grandTotal: calculateGrandTotal(updatedLineItems),
  };

  // 2. Execute mode
  switch (mode) {
    case 'A':
      return updatedQuotation;

    case 'B':
      // Validate before calling API
      const validationB = validateQuotation(updatedQuotation);
      if (!validationB.isValid) {
        throw new Error(`Validation failed for PDF generation: ${validationB.errors.join(', ')}`);
      }
      return await generatePDF(updatedQuotation);

    case 'C':
      return validateQuotation(updatedQuotation);

    default:
      throw new Error(`Invalid mode: ${mode}. Use 'A' (Debug), 'B' (PDF), or 'C' (Validate).`);
  }
}
