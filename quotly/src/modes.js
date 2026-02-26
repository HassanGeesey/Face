import { updateLineItemsTotals, calculateDetailedTotals } from './utils/calculations.js';
import { validateQuotation } from './utils/validation.js';
import { generatePDF } from './services/pdfService.js';

/**
 * Orchestrates quotation operations across different modes.
 *
 * Mode A: Debug JSON - returns the quotation with updated totals.
 * Mode B: Generate PDF - validates, generates PDF via API, and returns Blob.
 * Mode C: Validate & Review - returns detailed validation and integrity checks.
 *
 * @param {Object} quotation - Quotation object.
 * @param {string} mode - Operation mode ('A', 'B', or 'C').
 * @param {Object} [options] - Optional runtime overrides (apiKey, templateId).
 * @returns {Promise<any>} - Output depends on the selected mode.
 */
export async function quotlyManager(quotation, mode, options = {}) {
  // 1. Recalculate totals to ensure data consistency
  const updatedItems = updateLineItemsTotals(quotation.lineItems || []);
  const detailed = calculateDetailedTotals({ ...quotation, lineItems: updatedItems });

  const processedQuotation = {
    ...quotation,
    lineItems: updatedItems,
    subTotal: detailed.subTotal,
    taxAmount: detailed.taxAmount,
    grandTotal: detailed.grandTotal,
  };

  switch (mode) {
    case 'A': // Debug JSON
      return processedQuotation;

    case 'B': // Generate PDF
      const errors = validateQuotation(processedQuotation);
      if (errors.length > 0) {
        throw new Error(`Validation failed before PDF generation: ${errors.join('; ')}`);
      }
      return await generatePDF(processedQuotation, options);

    case 'C': // Validate & Review
      const validationErrors = validateQuotation(processedQuotation);

      // Integrity check: compare original grandTotal with recalculated one
      const originalTotal = parseFloat(quotation.grandTotal || "0").toFixed(2);
      const integrityCheck = originalTotal === processedQuotation.grandTotal;

      return {
        isValid: validationErrors.length === 0,
        errors: validationErrors,
        integrityCheck,
        recalculatedTotals: detailed,
        quotation: processedQuotation,
      };

    default:
      throw new Error(`Unsupported mode: ${mode}. Use 'A', 'B', or 'C'.`);
  }
}
