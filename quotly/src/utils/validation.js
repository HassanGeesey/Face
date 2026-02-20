import { calculateGrandTotal } from './calculations.js';

/**
 * Validates if a string is a valid URL.
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
 * Validates if a date string is in DD/MM/YYYY format.
 * @param {string} dateStr
 * @returns {boolean}
 */
export function isValidDate(dateStr) {
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!regex.test(dateStr)) return false;

  const [day, month, year] = dateStr.split('/').map(Number);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

/**
 * Validates the quotation data.
 * @param {Object} quotation
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export function validateQuotation(quotation) {
  const errors = [];

  if (!quotation) {
    return { valid: false, errors: ['Quotation data is missing'] };
  }

  // Company validation
  const { company, customer, lineItems, date, grandTotal } = quotation;

  if (!company) {
    errors.push('Company information is required');
  } else {
    if (!company.name) errors.push('Company name is required');
    if (!company.email) errors.push('Company email is required');
    if (!company.address) errors.push('Company address is required');
    if (!company.logo || !isValidUrl(company.logo)) {
      errors.push('A valid company logo URL is required');
    }
  }

  // Customer validation
  if (!customer) {
    errors.push('Customer information is required');
  } else {
    if (!customer.name) errors.push('Customer name is required');
  }

  // Date validation
  if (!date || !isValidDate(date)) {
    errors.push('Date must be in DD/MM/YYYY format');
  }

  // Line Items validation
  if (!lineItems || !Array.isArray(lineItems) || lineItems.length === 0) {
    errors.push('At least one line item is required');
  } else {
    lineItems.forEach((item, index) => {
      if (!item.description) errors.push(`Line item ${index + 1} description is required`);
      if (item.qty <= 0) errors.push(`Line item ${index + 1} quantity must be greater than 0`);
      if (item.unitPrice < 0) errors.push(`Line item ${index + 1} unit price cannot be negative`);
    });
  }

  // Integrity Check
  if (lineItems && Array.isArray(lineItems)) {
    const calculatedTotal = calculateGrandTotal(lineItems);
    if (calculatedTotal !== grandTotal) {
      errors.push(`Grand total integrity check failed: expected ${calculatedTotal}, got ${grandTotal}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
