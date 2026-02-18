/**
 * Validates a quotation object
 * @param {Object} quotation
 * @returns {string[]} Array of error messages
 */
export function validateQuotation(quotation) {
  const errors = [];

  // Company Validation
  if (!quotation.company.name) errors.push("Company name is required.");
  if (!quotation.company.email) errors.push("Company email is required.");
  if (!quotation.company.address) errors.push("Company address is required.");
  if (quotation.company.logo && !isValidUrl(quotation.company.logo)) {
    errors.push("Invalid company logo URL.");
  }

  // Customer Validation
  if (!quotation.customer.name) errors.push("Customer name is required.");

  // Line Items Validation
  if (!quotation.lineItems || quotation.lineItems.length === 0) {
    errors.push("At least one line item is required.");
  } else {
    quotation.lineItems.forEach((item, index) => {
      if (!item.description) errors.push(`Line item ${index + 1} description is required.`);
      if (item.qty <= 0) errors.push(`Line item ${index + 1} qty must be greater than 0.`);
      if (item.unitPrice < 0) errors.push(`Line item ${index + 1} unit price cannot be negative.`);
    });
  }

  // Date Validation (DD/MM/YYYY)
  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!quotation.date || !dateRegex.test(quotation.date)) {
    errors.push("Date must be in DD/MM/YYYY format.");
  }

  return errors;
}

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}
