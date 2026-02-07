/**
 * Validates the quotation object
 * @param {Object} quotation
 * @returns {Object} { isValid: boolean, errors: string[] }
 */
export function validateQuotation(quotation) {
  const errors = [];

  if (!quotation) {
    errors.push("Quotation object is required.");
    return { isValid: false, errors };
  }

  // Company Validation
  if (!quotation.company) {
    errors.push("Company information is required.");
  } else {
    if (!quotation.company.name) errors.push("Company name is required.");
    if (!quotation.company.logo) errors.push("Company logo is required.");
    if (!quotation.company.email) errors.push("Company email is required.");
    if (!quotation.company.address) errors.push("Company address is required.");
    if (!quotation.company.landline) errors.push("Company landline is required.");
    if (!quotation.company.mobiles || quotation.company.mobiles.length === 0) {
      errors.push("At least one company mobile number is required.");
    }
  }

  // Customer Validation
  if (!quotation.customer || !quotation.customer.name) {
    errors.push("Customer name is required.");
  }

  // Line Items Validation
  if (!quotation.lineItems || quotation.lineItems.length === 0) {
    errors.push("At least one line item is required.");
  } else {
    quotation.lineItems.forEach((item, index) => {
      if (item.qty <= 0) errors.push(`Line item ${index + 1} must have qty > 0.`);
      if (item.unitPrice < 0) errors.push(`Line item ${index + 1} must have unitPrice >= 0.`);
    });
  }

  // Date Validation (DD/MM/YYYY)
  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!dateRegex.test(quotation.date)) {
    errors.push("Date must be in DD/MM/YYYY format.");
  }

  // Logo URL validation
  if (quotation.company && quotation.company.logo) {
    try {
      new URL(quotation.company.logo);
    } catch (_) {
      errors.push("Company logo must be a valid URL.");
    }
  }

  // Integrity check: grandTotal must match sum of line items
  if (quotation.lineItems && quotation.lineItems.length > 0) {
    const expectedGrandTotal = quotation.lineItems
      .reduce((sum, item) => sum + parseFloat(item.total), 0)
      .toFixed(2);

    if (quotation.grandTotal !== expectedGrandTotal) {
      errors.push(`Grand total mismatch. Expected ${expectedGrandTotal}, got ${quotation.grandTotal}.`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
