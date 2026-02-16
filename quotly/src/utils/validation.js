import { calculateGrandTotal } from './calculations.js';

/**
 * Validate quotation data
 * @param {import('../types').Quotation} quotation
 * @returns {{isValid: boolean, errors: string[]}}
 */
export function validateQuotation(quotation) {
  const errors = [];

  // Company validation
  if (!quotation.company.name) errors.push("Company name is required.");
  if (!quotation.company.email) errors.push("Company email is required.");
  if (!quotation.company.address) errors.push("Company address is required.");
  if (!quotation.company.logo || !quotation.company.logo.startsWith("http")) {
    errors.push("A valid company logo URL is required.");
  }

  // Customer validation
  if (!quotation.customer.name) errors.push("Customer name is required.");

  // Date validation
  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!quotation.date || !dateRegex.test(quotation.date)) {
    errors.push("Date must be in DD/MM/YYYY format.");
  }

  // Line items validation
  if (!quotation.lineItems || quotation.lineItems.length === 0) {
    errors.push("At least one line item is required.");
  } else {
    quotation.lineItems.forEach((item, index) => {
      if (!item.description) errors.push(`Line item ${index + 1} description is required.`);
      if (item.qty <= 0) errors.push(`Line item ${index + 1} quantity must be greater than 0.`);
      if (item.unitPrice < 0) errors.push(`Line item ${index + 1} unit price cannot be negative.`);
    });
  }

  // Integrity check: grandTotal must match calculated sum
  const calculatedTotal = calculateGrandTotal(quotation.lineItems);
  if (quotation.grandTotal !== calculatedTotal) {
    errors.push(`Grand total mismatch: expected ${calculatedTotal}, got ${quotation.grandTotal}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
