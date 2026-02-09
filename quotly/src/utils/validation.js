import { calculateGrandTotal } from "./calculations.js";

/**
 * Validate quotation data
 * @param {Object} quotation
 * @returns {Object} { isValid: boolean, errors: string[] }
 */
export function validateQuotation(quotation) {
  const errors = [];
  const urlRegex = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|svg))$/i;

  if (!quotation.company || !quotation.company.name) {
    errors.push("Company name is required");
  }
  if (!quotation.company || !quotation.company.email) {
    errors.push("Company email is required");
  }
  if (!quotation.company || !quotation.company.address) {
    errors.push("Company address is required");
  }
  if (!quotation.company || !quotation.company.logo) {
    errors.push("Company logo URL is required");
  } else if (!urlRegex.test(quotation.company.logo)) {
    errors.push("Company logo must be a valid image URL");
  }

  if (!quotation.customer || !quotation.customer.name) {
    errors.push("Customer name is required");
  }

  if (!quotation.lineItems || quotation.lineItems.length === 0) {
    errors.push("At least one line item is required");
  } else {
    quotation.lineItems.forEach((item, index) => {
      if (item.qty <= 0) {
        errors.push(`Line item ${index + 1}: Quantity must be greater than 0`);
      }
      if (item.unitPrice < 0) {
        errors.push(`Line item ${index + 1}: Unit price must be 0 or greater`);
      }
    });
  }

  if (!quotation.date || !/^\d{2}\/\d{2}\/\d{4}$/.test(quotation.date)) {
    errors.push("Date must be in DD/MM/YYYY format");
  }

  // Integrity check for grandTotal
  const calculatedGrandTotal = quotation.lineItems ?
    calculateGrandTotal(quotation.lineItems) :
    "0.00";

  if (quotation.grandTotal !== calculatedGrandTotal) {
    errors.push(`Grand total mismatch: expected ${calculatedGrandTotal}, got ${quotation.grandTotal}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
