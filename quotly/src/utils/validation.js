export function validateQuotation(quotation) {
  const errors = [];

  // Company validation
  if (!quotation.company.name) errors.push("Company name is required.");
  if (!quotation.company.email) errors.push("Company email is required.");
  if (!quotation.company.address) errors.push("Company address is required.");
  if (!quotation.company.landline) errors.push("Company landline is required.");
  if (!quotation.company.mobiles || quotation.company.mobiles.length === 0) {
    errors.push("At least one company mobile number is required.");
  }

  // Customer validation
  if (!quotation.customer.name) errors.push("Customer name is required.");

  // Date validation (DD/MM/YYYY)
  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!dateRegex.test(quotation.date)) {
    errors.push("Date must be in DD/MM/YYYY format.");
  }

  // Line Items validation
  if (quotation.lineItems.length === 0) {
    errors.push("At least one line item is required.");
  } else {
    quotation.lineItems.forEach((item, index) => {
      if (item.qty <= 0) errors.push(`Line item ${index + 1} must have qty > 0.`);
      if (item.unitPrice < 0) errors.push(`Line item ${index + 1} must have unitPrice >= 0.`);
    });
  }

  // Logo URL validation (required as per "No empty fields")
  if (!quotation.company.logo) {
    errors.push("Company logo URL is required.");
  } else {
    try {
      new URL(quotation.company.logo);
    } catch (_) {
      errors.push("Invalid company logo URL.");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
