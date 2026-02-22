import { updateLineItemsTotals, calculateGrandTotal } from './utils/calculations.js';
import { validateQuotation } from './utils/validation.js';
import { generatePDF } from './services/pdfService.js';

/**
 * Main manager for Quotly operations
 * @param {import('./types').Quotation} quotation
 * @param {'A'|'B'|'C'} mode
 */
export async function quotlyManager(quotation, mode) {
  // Sync totals before any operation
  const updatedItems = updateLineItemsTotals(quotation.lineItems || []);
  const updatedQuotation = {
    ...quotation,
    lineItems: updatedItems,
    grandTotal: calculateGrandTotal(updatedItems),
  };

  switch (mode) {
    case 'A':
      // Mode A: Return JSON for debugging
      return updatedQuotation;

    case 'B':
      // Mode B: Call API to generate PDF
      const validationB = validateQuotation(updatedQuotation);
      if (!validationB.valid) {
        throw new Error(`Validation failed for Mode B: ${validationB.errors.join(', ')}`);
      }
      return await generatePDF(updatedQuotation);

    case 'C':
      // Mode C: Validate & review totals
      const validationC = validateQuotation(updatedQuotation);

      // Integrity check: recalculate grand total and compare
      const integrityCheckTotal = calculateGrandTotal(updatedItems);
      const integrityMatch = updatedQuotation.grandTotal === integrityCheckTotal;

      return {
        ...validationC,
        quotation: updatedQuotation,
        integrityCheck: {
          match: integrityMatch,
          calculated: integrityCheckTotal,
          provided: updatedQuotation.grandTotal,
        }
      };

    default:
      throw new Error(`Invalid mode: ${mode}. Use A, B, or C.`);
  }
}
