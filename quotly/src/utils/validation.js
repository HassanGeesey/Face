import { calculateGrandTotal } from './calculations.js';

/**
 * Validates a URL
 * @param {string} url
 * @returns {boolean}
 */
export function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Validates date format DD/MM/YYYY
 * @param {string} dateString
 * @returns {boolean}
 */
export function isValidDate(dateString) {
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  return regex.test(dateString);
}

/**
 * Validates a quotation object
 * @param {Object} quotation
 * @returns {Object} { isValid: boolean, errors: string[] }
 */
export function validateQuotation(quotation) {
  const errors = [];

  // Company validation
  if (!quotation.company.name) errors.push("Company name is required");
  if (!quotation.company.email) errors.push("Company email is required");
  if (!quotation.company.address) errors.push("Company address is required");
  if (quotation.company.logo && !isValidUrl(quotation.company.logo)) {
    errors.push("Invalid company logo URL");
  }

  // Customer validation
  if (!quotation.customer.name) errors.push("Customer name is required");

  // Date validation
  if (!isValidDate(quotation.date)) {
    errors.push("Date must be in DD/MM/YYYY format");
  }

  // Line items validation
  if (!quotation.lineItems || quotation.lineItems.length === 0) {
    errors.push("At least one line item is required");
  } else {
    quotation.lineItems.forEach((item, index) => {
      if (!item.description) errors.push(`Line item ${index + 1}: Description is required`);
      if (item.qty <= 0) errors.push(`Line item ${index + 1}: Quantity must be greater than 0`);
      if (item.unitPrice < 0) errors.push(`Line item ${index + 1}: Unit price cannot be negative`);
    });
  }

  // Integrity check
  const computedGrandTotal = calculateGrandTotal(quotation.lineItems);
  if (quotation.grandTotal !== computedGrandTotal) {
    errors.push(`Grand total mismatch: expected ${computedGrandTotal}, got ${quotation.grandTotal}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
