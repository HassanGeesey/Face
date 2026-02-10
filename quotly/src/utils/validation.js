import { calculateGrandTotal } from './calculations.js';

/**
 * Validate quotation data
 * @param {import('../types').Quotation} quotation
 * @returns {{valid: boolean, errors: string[]}}
 */
export function validateQuotation(quotation) {
  const errors = [];

  // Company validation
  if (!quotation.company) {
    errors.push("Company info is missing");
  } else {
    if (!quotation.company.name) errors.push("Company name is required");
    if (!quotation.company.email) errors.push("Company email is required");
    if (!quotation.company.address) errors.push("Company address is required");
    if (quotation.company.logo && !isValidURL(quotation.company.logo)) {
      errors.push("Invalid logo URL");
    }
  }

  // Customer validation
  if (!quotation.customer || !quotation.customer.name) {
    errors.push("Customer name is required");
  }

  // Line items validation
  if (!quotation.lineItems || quotation.lineItems.length === 0) {
    errors.push("At least one line item is required");
  } else {
    quotation.lineItems.forEach((item, index) => {
      if (item.qty <= 0) errors.push(`Line item ${index + 1} must have qty > 0`);
      if (item.unitPrice < 0) errors.push(`Line item ${index + 1} must have unitPrice >= 0`);
    });
  }

  // Date validation (DD/MM/YYYY)
  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!quotation.date || !dateRegex.test(quotation.date)) {
    errors.push("Date must be in DD/MM/YYYY format");
  }

  // Integrity check: grandTotal should match sum of line items
  const calculatedTotal = calculateGrandTotal(quotation.lineItems);
  if (quotation.grandTotal !== calculatedTotal) {
    errors.push(`Grand total mismatch: expected ${calculatedTotal}, got ${quotation.grandTotal}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

function isValidURL(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}
