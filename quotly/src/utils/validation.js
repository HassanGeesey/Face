/**
 * Validate quotation data.
 * @param {import('../types').Quotation} quotation
 * @returns {string[]} Array of error messages. Empty if valid.
 */
export function validateQuotation(quotation) {
  const errors = [];

  // Company validation
  if (!quotation.company) {
    errors.push('Company information is missing.');
  } else {
    if (!quotation.company.name) errors.push('Company name is required.');
    if (!quotation.company.email) errors.push('Company email is required.');
    if (!quotation.company.address) errors.push('Company address is required.');
    if (!quotation.company.logo) {
      errors.push('Company logo URL is required.');
    } else if (!/^https?:\/\/.+/.test(quotation.company.logo)) {
      errors.push('Company logo must be a valid URL.');
    }
  }

  // Customer validation
  if (!quotation.customer || !quotation.customer.name) {
    errors.push('Customer name is required.');
  }

  // Date validation
  if (!quotation.date) {
    errors.push('Quotation date is required.');
  } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(quotation.date)) {
    errors.push('Date must be in DD/MM/YYYY format.');
  }

  // Line items validation
  if (!quotation.lineItems || quotation.lineItems.length === 0) {
    errors.push('At least one line item is required.');
  } else {
    quotation.lineItems.forEach((item, index) => {
      if (item.qty <= 0) errors.push(`Line item ${index + 1}: Quantity must be greater than 0.`);
      if (item.unitPrice < 0) errors.push(`Line item ${index + 1}: Unit price cannot be negative.`);
      if (!item.description) errors.push(`Line item ${index + 1}: Description is required.`);
    });
  }

  // Financials validation
  if (quotation.taxRate < 0) errors.push('Tax rate cannot be negative.');
  if (quotation.discount < 0) errors.push('Discount cannot be negative.');

  return errors;
}
