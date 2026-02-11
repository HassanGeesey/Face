import { calculateGrandTotal } from './calculations.js';

/**
 * Validates a quotation object
 * @param {Object} quotation
 * @returns {Object} { isValid: boolean, errors: string[] }
 */
export function validateQuotation(quotation) {
  const errors = [];

  // Company validation
  if (!quotation.company) {
    errors.push("Company information is missing.");
  } else {
    if (!quotation.company.name) errors.push("Company name is required.");
    if (!quotation.company.email) errors.push("Company email is required.");
    if (!quotation.company.address) errors.push("Company address is required.");

    const urlRegex = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|svg))$/i;
    if (quotation.company.logo && !urlRegex.test(quotation.company.logo)) {
      errors.push("Invalid company logo URL.");
    }
  }

  // Customer validation
  if (!quotation.customer) {
    errors.push("Customer information is missing.");
  } else {
    if (!quotation.customer.name) errors.push("Customer name is required.");
  }

  // Date validation
  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!quotation.date || !dateRegex.test(quotation.date)) {
    errors.push("Date must be in DD/MM/YYYY format.");
  }

  // Line Items validation
  if (!quotation.lineItems || quotation.lineItems.length === 0) {
    errors.push("At least one line item is required.");
  } else {
    quotation.lineItems.forEach((item, index) => {
      if (item.qty <= 0) {
        errors.push(`Line item ${index + 1} must have a quantity greater than 0.`);
      }
      if (item.unitPrice < 0) {
        errors.push(`Line item ${index + 1} must have a unit price greater than or equal to 0.`);
      }
    });
  }

  // Grand Total integrity check
  const calculatedGrandTotal = calculateGrandTotal(quotation.lineItems || []);
  if (quotation.grandTotal !== calculatedGrandTotal) {
    errors.push(`Grand total mismatch. Expected ${calculatedGrandTotal}, got ${quotation.grandTotal}.`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
