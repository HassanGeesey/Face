import { calculateGrandTotal } from "./calculations.js";

export function validateQuotation(quotation) {
  const errors = [];

  if (!quotation) {
    return {
      valid: false,
      errors: ["Quotation data is completely missing."],
    };
  }

  // Validate Company
  if (!quotation.company) {
    errors.push("Company information is missing.");
  } else {
    const { name, logo, email, address, landline, mobiles } = quotation.company;
    if (!name) errors.push("Company name is required.");
    if (!logo) errors.push("Company logo URL is required.");
    else if (!isValidUrl(logo)) errors.push("Invalid company logo URL.");
    if (!email) errors.push("Company email is required.");
    if (!address) errors.push("Company address is required.");
    if (!landline) errors.push("Company landline is required.");
    if (!mobiles || !Array.isArray(mobiles) || mobiles.length === 0) {
      errors.push("At least one company mobile number is required.");
    }
  }

  // Validate Customer
  if (!quotation.customer) {
    errors.push("Customer information is missing.");
  } else {
    if (!quotation.customer.name) errors.push("Customer name is required.");
  }

  // Validate Date
  if (!quotation.date) {
    errors.push("Quotation date is required.");
  } else if (!isValidDate(quotation.date)) {
    errors.push("Invalid date format. Expected DD/MM/YYYY.");
  }

  // Validate Line Items
  if (!quotation.lineItems || !Array.isArray(quotation.lineItems) || quotation.lineItems.length === 0) {
    errors.push("At least one line item is required.");
  } else {
    quotation.lineItems.forEach((item, index) => {
      if (item.qty <= 0) errors.push(`Line item ${index + 1}: Quantity must be greater than 0.`);
      if (item.unitPrice < 0) errors.push(`Line item ${index + 1}: Unit price must be 0 or greater.`);
      if (!item.description) errors.push(`Line item ${index + 1}: Description is required.`);
    });
  }

  // Integrity Check
  if (quotation.lineItems && quotation.grandTotal) {
    const calculatedGrandTotal = calculateGrandTotal(quotation.lineItems);
    if (quotation.grandTotal !== calculatedGrandTotal) {
      errors.push(`Integrity check failed: grandTotal (${quotation.grandTotal}) does not match sum of line items (${calculatedGrandTotal}).`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

function isValidDate(dateString) {
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!regex.test(dateString)) return false;
  const [day, month, year] = dateString.split("/").map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}
