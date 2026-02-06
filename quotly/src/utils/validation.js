export function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

export function isValidDate(dateString) {
  const regEx = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!dateString.match(regEx)) return false; // Invalid format
  const d = new Date(dateString.split('/').reverse().join('-'));
  const dNum = d.getTime();
  if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
  return d.toISOString().slice(0, 10) === dateString.split('/').reverse().join('-');
}

export function validateQuotation(quotation) {
  const errors = [];

  // Company validation
  if (!quotation.company) {
    errors.push("Company info is missing");
  } else {
    const { name, logo, email, address, mobiles, landline } = quotation.company;
    if (!name) errors.push("Company name is required");
    if (!logo) errors.push("Company logo is required");
    else if (!isValidUrl(logo)) errors.push("Invalid company logo URL");
    if (!email) errors.push("Company email is required");
    if (!address) errors.push("Company address is required");
    if (!mobiles || mobiles.length === 0) errors.push("At least one mobile number is required");
    if (!landline) errors.push("Company landline is required");
  }

  // Customer validation
  if (!quotation.customer) {
    errors.push("Customer info is missing");
  } else {
    if (!quotation.customer.name) errors.push("Customer name is required");
  }

  // Line Items validation
  if (!quotation.lineItems || quotation.lineItems.length === 0) {
    errors.push("At least one line item is required");
  } else {
    quotation.lineItems.forEach((item, index) => {
      if (item.qty <= 0) errors.push(`Line item ${index + 1}: Quantity must be greater than 0`);
      if (item.unitPrice < 0) errors.push(`Line item ${index + 1}: Unit price must be 0 or greater`);
      if (!item.description) errors.push(`Line item ${index + 1}: Description is required`);
    });
  }

  // Date validation
  if (!quotation.date) {
    errors.push("Date is required");
  } else if (!isValidDate(quotation.date)) {
    errors.push("Date must be in DD/MM/YYYY format");
  }

  // Grand Total Integrity Check (from memory)
  const calculatedGrandTotal = quotation.lineItems.reduce((sum, item) => sum + parseFloat(item.total || 0), 0).toFixed(2);
  if (quotation.grandTotal !== calculatedGrandTotal) {
    errors.push(`Grand total integrity check failed. Expected ${calculatedGrandTotal}, got ${quotation.grandTotal}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
