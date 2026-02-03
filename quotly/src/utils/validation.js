/**
 * Validates the quotation data
 * @param {Object} quotation - The quotation object to validate
 * @returns {Object} - Object containing 'valid' boolean and 'errors' array
 */
export function validateQuotation(quotation) {
  const errors = [];

  // Company validation
  if (!quotation.company || !quotation.company.name || quotation.company.name === "COMPANY_NAME") errors.push("Company name is required");
  if (!quotation.company || !quotation.company.email || quotation.company.email === "EMAIL") errors.push("Company email is required");
  if (!quotation.company || !quotation.company.address || quotation.company.address === "ADDRESS") errors.push("Company address is required");
  if (quotation.company && quotation.company.logo && quotation.company.logo !== "IMAGE_URL" && !isValidURL(quotation.company.logo)) {
    errors.push("Invalid logo URL");
  }

  // Customer validation
  if (!quotation.customer || !quotation.customer.name || quotation.customer.name === "CUSTOMER_NAME") errors.push("Customer name is required");

  // Date validation
  if (!isValidDate(quotation.date)) {
    errors.push("Invalid date format. Expected DD/MM/YYYY");
  }

  // Line Items validation
  if (!quotation.lineItems || quotation.lineItems.length === 0) {
    errors.push("At least one line item is required");
  } else {
    quotation.lineItems.forEach((item, index) => {
      if (item.qty <= 0) errors.push(`Line item ${index + 1}: Quantity must be greater than 0`);
      if (item.unitPrice < 0) errors.push(`Line item ${index + 1}: Unit price must be 0 or greater`);
      if (!item.description || item.description === "DESCRIPTION") errors.push(`Line item ${index + 1}: Description is required`);
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Basic URL validation
 * @param {string} string - The URL string to validate
 * @returns {boolean}
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
 * Validate date in DD/MM/YYYY format
 * @param {string} dateString - The date string
 * @returns {boolean}
 */
export function isValidDate(dateString) {
  const regEx = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!dateString || !dateString.match(regEx)) return false;
  const parts = dateString.split('/');
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);

  if (month < 1 || month > 12) return false;

  const d = new Date(year, month - 1, day);
  return d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day;
}
