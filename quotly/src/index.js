import { updateLineItemsTotals, calculateGrandTotal } from './utils/calculations.js';
import { validateQuotation } from './utils/validation.js';
import { generatePDF } from './services/api.js';
import { deepMerge } from './utils/merge.js';
import { initialQuotation } from './types/quotation.js';

/**
 * Quotly Main Class
 * Implements Modes A, B, and C as described in the Master Prompt.
 */
export class Quotly {
  /**
   * @param {Object} quotation - The quotation data (partial or full)
   */
  constructor(quotation = {}) {
    // Deep merge provided data with initial quotation to ensure all nested properties exist
    this.quotation = deepMerge(JSON.parse(JSON.stringify(initialQuotation)), quotation);
  }

  /**
   * Mode C: Validate & review totals, line items, errors
   * Also updates all totals before validation.
   * @returns {Object} - Validation result { valid: boolean, errors: array }
   */
  validate() {
    // Run updateLineItemsTotals → updates all totals.
    this.quotation.lineItems = updateLineItemsTotals(this.quotation.lineItems);
    // Calculate grandTotal.
    this.quotation.grandTotal = calculateGrandTotal(this.quotation.lineItems);

    return validateQuotation(this.quotation);
  }

  /**
   * Mode A: Return JSON for debugging.
   * @returns {string} - Pretty printed JSON
   */
  getJSON() {
    this.validate(); // Ensure totals are updated before returning JSON
    return JSON.stringify({ data: this.quotation }, null, 2);
  }

  /**
   * Mode B: Call API to generate PDF and return result.
   * @returns {Promise<Blob>} - PDF blob
   */
  async generate() {
    const validation = this.validate();
    if (!validation.valid) {
      throw new Error("Validation failed: " + validation.errors.join("; "));
    }
    return await generatePDF(this.quotation);
  }

  /**
   * Update quotation data using deep merge to preserve nested properties
   * @param {Object} data - Partial or full quotation data
   */
  updateData(data) {
    this.quotation = deepMerge(this.quotation, data);
  }
}

export * from './types/quotation.js';
