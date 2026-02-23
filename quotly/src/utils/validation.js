/**
 * Validate quotation data
 * @param {import('../types').Quotation} quotation
 * @returns {{valid: boolean, errors: string[]}}
 */
export function validateQuotation(quotation) {
  const errors = [];

  // Company validation
  if (!quotation.company) {
    errors.push('Company information is missing');
  } else {
    if (!quotation.company.name) errors.push('Company name is required');
    if (!quotation.company.email) errors.push('Company email is required');
    if (!quotation.company.address) errors.push('Company address is required');
    if (!quotation.company.logo) {
      errors.push('Company logo URL is required');
    } else {
      try {
        new URL(quotation.company.logo);
      } catch (e) {
        errors.push('Invalid company logo URL');
      }
    }
  }

  // Customer validation
  if (!quotation.customer || !quotation.customer.name) {
    errors.push('Customer name is required');
  }

  // Date validation (DD/MM/YYYY)
  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!quotation.date || !dateRegex.test(quotation.date)) {
    errors.push('Date must be in DD/MM/YYYY format');
  }

  // Line items validation
  if (!quotation.lineItems || quotation.lineItems.length === 0) {
    errors.push('At least one line item is required');
  } else {
    quotation.lineItems.forEach((item, index) => {
      if (!item.description) errors.push(`Line item ${index + 1}: Description is required`);
      if (item.qty <= 0) errors.push(`Line item ${index + 1}: Quantity must be greater than 0`);
      if (item.unitPrice < 0) errors.push(`Line item ${index + 1}: Unit price must be 0 or greater`);
    });
  }

  // Tax and Discount validation
  if (quotation.taxRate !== undefined && (typeof quotation.taxRate !== 'number' || quotation.taxRate < 0)) {
    errors.push('Tax rate must be a non-negative number');
  }
  if (quotation.discount !== undefined && (typeof quotation.discount !== 'number' || quotation.discount < 0)) {
    errors.push('Discount must be a non-negative number');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
