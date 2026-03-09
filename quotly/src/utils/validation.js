/**
 * Simple validation for URLs.
 * @param {string} string - String to validate as URL.
 * @returns {boolean} - True if valid URL.
 */
export function isValidURL(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * Validates the date format (DD/MM/YYYY).
 * @param {string} date - Date string.
 * @returns {boolean} - True if valid.
 */
export function isValidDate(date) {
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  if (!regex.test(date)) return false;

  const [_, day, month, year] = date.match(regex).map(Number);
  const dateObj = new Date(year, month - 1, day);

  return (
    dateObj.getFullYear() === year &&
    dateObj.getMonth() === month - 1 &&
    dateObj.getDate() === day
  );
}

/**
 * Performs full validation of a Quotation object according to Module 4 rules.
 * @param {Object} quotation - Quotation object.
 * @returns {string[]} - Array of error messages.
 */
export function validateQuotation(quotation) {
  const errors = [];

  // Company Validation
  if (!quotation.company) {
    errors.push("Company information is missing.");
  } else {
    const { name, email, address, logo, landline, mobiles } = quotation.company;
    if (!name?.trim()) errors.push("Company name is required.");
    if (!email?.trim()) errors.push("Company email is required.");
    if (!address?.trim()) errors.push("Company address is required.");
    if (!landline || typeof landline !== 'string' || !landline.trim()) {
      errors.push("Company landline is required.");
    }
    if (!Array.isArray(mobiles) || mobiles.length === 0) {
      errors.push("Company must have at least one mobile number.");
    }
    if (!logo?.trim()) {
      errors.push("Company logo URL is required.");
    } else if (!isValidURL(logo)) {
      errors.push("Company logo URL is invalid.");
    }
  }

  // Customer Validation
  if (!quotation.customer?.name?.trim()) {
    errors.push("Customer name is required.");
  }

  // Date Validation
  if (!quotation.date) {
    errors.push("Quotation date is missing.");
  } else if (!isValidDate(quotation.date)) {
    errors.push("Date must be in DD/MM/YYYY format.");
  }

  // Line Items Validation
  if (!Array.isArray(quotation.lineItems) || quotation.lineItems.length === 0) {
    errors.push("Quotation must have at least one line item.");
  } else {
    quotation.lineItems.forEach((item, index) => {
      const idxLabel = index + 1;
      if (!item.description?.trim()) errors.push(`Item #${idxLabel} missing description.`);
      if (item.qty <= 0) errors.push(`Item #${idxLabel} must have quantity > 0.`);
      if (item.unitPrice < 0) errors.push(`Item #${idxLabel} must have unitPrice >= 0.`);
    });
  }

  // Financial Breakdown Validation
  if (quotation.taxRate !== undefined && (typeof quotation.taxRate !== 'number' || quotation.taxRate < 0)) {
    errors.push("Tax rate must be a non-negative number.");
  }
  if (quotation.discount !== undefined && (typeof quotation.discount !== 'number' || quotation.discount < 0)) {
    errors.push("Discount must be a non-negative number.");
  }

  // Currency Validation
  if (quotation.currency !== undefined && typeof quotation.currency !== 'string') {
    errors.push("Currency must be a string if provided.");
  }

  return errors;
}
