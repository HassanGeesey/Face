import { validateQuotation } from "./utils/validation.js";
import { generatePDF } from "./services/pdfService.js";
import { updateLineItemsTotals, calculateGrandTotal } from "./utils/calculations.js";

/**
 * Main manager for Quotly operations
 * @param {Object} quotation
 * @param {'A' | 'B' | 'C'} mode
 */
export async function quotlyManager(quotation, mode) {
  // Always update totals first to ensure consistency
  const updatedQuotation = {
    ...quotation,
    lineItems: updateLineItemsTotals(quotation.lineItems),
  };
  updatedQuotation.grandTotal = calculateGrandTotal(updatedQuotation.lineItems);

  switch (mode) {
    case 'A': // Debug JSON
      return updatedQuotation;

    case 'B': // Generate PDF
      const errors = validateQuotation(updatedQuotation);
      if (errors.length > 0) {
        throw new Error(`Validation failed: ${errors.join(", ")}`);
      }
      return await generatePDF(updatedQuotation);

    case 'C': // Validate & Review
      const validationErrors = validateQuotation(updatedQuotation);
      return {
        isValid: validationErrors.length === 0,
        errors: validationErrors,
        quotation: updatedQuotation,
      };

    default:
      throw new Error(`Invalid mode: ${mode}`);
  }
}
