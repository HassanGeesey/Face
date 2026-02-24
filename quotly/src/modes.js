import { calculateDetailedTotals } from './utils/calculations.js';
import { generatePDF } from './services/pdfService.js';

/**
 * Validate the quotation data.
 * @param {import('./types').Quotation} quotation
 * @returns {Object} { isValid: boolean, errors: string[] }
 */
export function validateQuotation(quotation) {
  const errors = [];

  if (!quotation.company || !quotation.company.name || !quotation.company.email || !quotation.company.address) {
    errors.push('Company name, email, and address are required.');
  }

  if (quotation.company && quotation.company.logo) {
    try {
      new URL(quotation.company.logo);
    } catch (e) {
      errors.push('Company logo must be a valid URL.');
    }
  } else {
    errors.push('Company logo URL is required.');
  }

  if (!quotation.customer || !quotation.customer.name) {
    errors.push('Customer name is required.');
  }

  if (!quotation.lineItems || quotation.lineItems.length === 0) {
    errors.push('At least one line item is required.');
  } else {
    quotation.lineItems.forEach((item, index) => {
      if (!item.description) errors.push(`Line item ${index + 1} description is required.`);
      if (item.qty <= 0) errors.push(`Line item ${index + 1} quantity must be greater than 0.`);
      if (item.unitPrice < 0) errors.push(`Line item ${index + 1} unit price cannot be negative.`);
    });
  }

  if (quotation.date && !/^\d{2}\/\d{2}\/\d{4}$/.test(quotation.date)) {
    errors.push('Date must be in DD/MM/YYYY format.');
  } else if (!quotation.date) {
    errors.push('Quotation date is required.');
  }

  if (quotation.taxRate !== undefined && (typeof quotation.taxRate !== 'number' || quotation.taxRate < 0)) {
    errors.push('Tax rate must be a non-negative number.');
  }

  if (quotation.discount !== undefined && (typeof quotation.discount !== 'number' || quotation.discount < 0)) {
    errors.push('Discount must be a non-negative number.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Main entry point for performing operations on quotations.
 * @param {import('./types').Quotation} quotation
 * @param {'A' | 'B' | 'C'} mode - Operation mode.
 * @param {Object} [options] - Options for the operation.
 * @returns {Promise<any>}
 */
export async function quotlyManager(quotation, mode, options = {}) {
  // Always recalculate totals first for consistency
  const updatedQuotation = calculateDetailedTotals(quotation);

  switch (mode) {
    case 'A': // Mode A: Debug JSON
      return updatedQuotation;

    case 'B': // Mode B: Generate PDF
      const validation = validateQuotation(updatedQuotation);
      if (!validation.isValid) {
        throw new Error('Validation failed: ' + validation.errors.join(' '));
      }
      return await generatePDF(updatedQuotation, options);

    case 'C': // Mode C: Validate & Review
      const validationResult = validateQuotation(updatedQuotation);

      // Integrity check: compare original grandTotal with recalculated one
      const integrityCheck = {
        passed: quotation.grandTotal === updatedQuotation.grandTotal,
        original: quotation.grandTotal,
        recalculated: updatedQuotation.grandTotal,
      };

      return {
        ...validationResult,
        integrityCheck,
        quotation: updatedQuotation,
      };

    default:
      throw new Error(`Invalid mode: ${mode}. Use 'A', 'B', or 'C'.`);
  }
}
