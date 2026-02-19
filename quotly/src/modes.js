import { generatePDF } from "./services/pdfService.js";
import { updateLineItemsTotals, calculateGrandTotal, validateQuotation } from "./utils/index.js";

/**
 * Manage quotation operations based on modes
 * @param {Object} quotation
 * @param {string} mode - 'A' (Debug JSON), 'B' (Generate PDF), 'C' (Validate)
 * @returns {Promise<any>}
 */
export async function quotlyManager(quotation, mode) {
  // Sync totals before any operation
  const updatedLineItems = updateLineItemsTotals(quotation.lineItems || []);
  const updatedQuotation = {
    ...quotation,
    lineItems: updatedLineItems,
    grandTotal: calculateGrandTotal(updatedLineItems),
  };

  switch (mode) {
    case 'A':
      // Mode A: Return JSON for debugging
      return updatedQuotation;

    case 'B':
      // Mode B: Call API to generate PDF
      // We should probably validate before calling API
      const validationResult = validateQuotation(updatedQuotation);
      if (!validationResult.valid) {
        throw new Error(`Validation failed before PDF generation: ${validationResult.errors.join(', ')}`);
      }
      return await generatePDF(updatedQuotation);

    case 'C':
      // Mode C: Validate & review totals, line items, errors
      return validateQuotation(updatedQuotation);

    default:
      throw new Error(`Invalid mode: ${mode}. Supported modes are A, B, C.`);
  }
}
