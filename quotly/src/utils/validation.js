import { calculateGrandTotal } from './calculations.js';

/**
 * Validates if a string is a valid URL
 * @param {string} url
 * @returns {boolean}
 */
export function isValidURL(url) {
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
  if (!regex.test(dateString)) return false;

  const [day, month, year] = dateString.split('/').map(Number);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

/**
 * Validates a quotation object
 * @param {Object} quotation
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
export function validateQuotation(quotation) {
  const errors = [];

  // Company validation
  if (!quotation.company.name) errors.push("Company name is required");
  if (!quotation.company.email) errors.push("Company email is required");
  if (!quotation.company.address) errors.push("Company address is required");
  if (quotation.company.logo && !isValidURL(quotation.company.logo)) {
    errors.push("Invalid company logo URL");
  }

  // Customer validation
  if (!quotation.customer.name) errors.push("Customer name is required");

  // Date validation
  if (!quotation.date) {
    errors.push("Quotation date is required");
  } else if (!isValidDate(quotation.date)) {
    errors.push("Invalid date format. Expected DD/MM/YYYY");
  }

  // Line Items validation
  if (!quotation.lineItems || quotation.lineItems.length === 0) {
    errors.push("At least one line item is required");
  } else {
    quotation.lineItems.forEach((item, index) => {
      if (item.qty <= 0) errors.push(`Line item ${index + 1}: quantity must be greater than 0`);
      if (item.unitPrice < 0) errors.push(`Line item ${index + 1}: unit price cannot be negative`);
      if (!item.description) errors.push(`Line item ${index + 1}: description is required`);
    });
  }

  // Integrity check: match grandTotal
  const calculatedGrandTotal = calculateGrandTotal(quotation.lineItems || []);
  if (quotation.grandTotal !== calculatedGrandTotal) {
    errors.push(`Grand total mismatch: expected ${calculatedGrandTotal}, got ${quotation.grandTotal}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
