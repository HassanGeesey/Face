export function validateQuotation(quotation) {
  const errors = [];

  if (!quotation.company.name) errors.push("Company name is required");
  if (!quotation.company.email) errors.push("Company email is required");
  if (!quotation.company.address) errors.push("Company address is required");
  if (!quotation.company.logo || !quotation.company.logo.startsWith("http")) {
    errors.push("Valid company logo URL is required");
  }

  if (!quotation.customer.name) errors.push("Customer name is required");

  if (!quotation.lineItems || quotation.lineItems.length === 0) {
    errors.push("At least one line item is required");
  } else {
    quotation.lineItems.forEach((item, index) => {
      if (item.qty <= 0) errors.push(`Item ${index + 1}: Qty must be greater than 0`);
      if (item.unitPrice < 0) errors.push(`Item ${index + 1}: Unit price cannot be negative`);
      if (!item.description) errors.push(`Item ${index + 1}: Description is required`);
    });
  }

  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!dateRegex.test(quotation.date)) {
    errors.push("Date must be in DD/MM/YYYY format");
  }

  // Integrity check
  const calculatedGrandTotal = (quotation.lineItems || []).reduce((sum, item) => sum + parseFloat(item.total || 0), 0).toFixed(2);
  if (calculatedGrandTotal !== quotation.grandTotal) {
      errors.push(`Grand total mismatch: calculated ${calculatedGrandTotal}, found ${quotation.grandTotal}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
