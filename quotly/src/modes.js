import { validateQuotation } from "./utils/validation.js";
import { generatePDF } from "./services/pdfService.js";
import { updateLineItemsTotals, calculateGrandTotal } from "./utils/calculations.js";

/**
 * Main interface for different operation modes.
 * @param {string} mode - 'A' (Debug JSON), 'B' (Generate PDF), 'C' (Validate)
 * @param {Object} quotation
 */
export async function quotlyManager(mode, quotation) {
  if (!quotation) {
    throw new Error("Quotation object is required.");
  }

  // Always ensure totals are updated before processing
  const updatedQuotation = {
    ...quotation,
    lineItems: updateLineItemsTotals(quotation.lineItems || []),
  };
  updatedQuotation.grandTotal = calculateGrandTotal(updatedQuotation.lineItems);

  switch (mode) {
    case 'A':
      // Mode A: Return JSON for debugging.
      return updatedQuotation;

    case 'B':
      // Mode B: Call API to generate PDF and return file.
      const validation = validateQuotation(updatedQuotation);
      if (!validation.valid) {
        throw new Error("Validation failed: " + validation.errors.join(", "));
      }
      return await generatePDF(updatedQuotation);

    case 'C':
      // Mode C: Validate & review totals, line items, errors.
      return validateQuotation(updatedQuotation);

    default:
      throw new Error(`Unknown mode: ${mode}`);
  }
}
