import { updateLineItemsTotals, calculateDetailedTotals } from './utils/calculations.js';
import { validateQuotation } from './utils/validation.js';
import { generatePDF } from './services/pdfService.js';

/**
 * Main manager for Quotly operations
 * @param {import('./types').Quotation} quotation
 * @param {'A'|'B'|'C'} mode
 * @param {Object} [options] - Optional overrides (templateId, apiKey)
 */
export async function quotlyManager(quotation, mode, options = {}) {
  // Sync totals before any operation
  const updatedItems = updateLineItemsTotals(quotation.lineItems || []);
  const totals = calculateDetailedTotals(updatedItems, quotation.taxRate, quotation.discount);

  const updatedQuotation = {
    ...quotation,
    lineItems: updatedItems,
    subTotal: totals.subTotal,
    taxAmount: totals.taxAmount,
    grandTotal: totals.grandTotal,
    templateId: options.templateId || quotation.templateId,
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
      return await generatePDF(updatedQuotation, {
        templateId: updatedQuotation.templateId,
        apiKey: options.apiKey
      });

    case 'C':
      // Mode C: Validate & review totals
      const validationC = validateQuotation(updatedQuotation);

      // Integrity check: recalculate grand total and compare
      const integrityCheck = calculateDetailedTotals(updatedItems, quotation.taxRate, quotation.discount);
      const integrityMatch = quotation.grandTotal === integrityCheck.grandTotal;

      return {
        ...validationC,
        quotation: updatedQuotation,
        integrityCheck: {
          match: integrityMatch,
          calculated: integrityCheck.grandTotal,
          provided: quotation.grandTotal || '0.00',
        }
      };

    default:
      throw new Error(`Invalid mode: ${mode}. Use A, B, or C.`);
  }
}
