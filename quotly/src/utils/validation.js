import { calculateGrandTotal } from './calculations.js';

/**
 * Validate quotation data
 * @param {Object} quotation
 * @throws {Error} if validation fails
 */
export function validateQuotation(quotation) {
  const { company, customer, lineItems, date, grandTotal } = quotation;

  // Company validation
  if (!company || !company.name || !company.address || !company.logo || !company.email) {
    throw new Error("Company info is incomplete. Name, address, logo, and email are required.");
  }
  if (!company.mobiles || !Array.isArray(company.mobiles) || company.mobiles.length === 0) {
    throw new Error("At least one mobile number is required for company.");
  }
  if (!company.landline) {
    throw new Error("Landline is required for company.");
  }

  // Customer validation
  if (!customer || !customer.name) {
    throw new Error("Customer name is required.");
  }

  // Line items validation
  if (!lineItems || !Array.isArray(lineItems) || lineItems.length === 0) {
    throw new Error("At least one line item is required.");
  }

  lineItems.forEach((item, index) => {
    if (item.qty <= 0) {
      throw new Error(`Line item ${index + 1} must have qty > 0.`);
    }
    if (item.unitPrice < 0) {
      throw new Error(`Line item ${index + 1} must have unitPrice >= 0.`);
    }
    if (!item.description) {
      throw new Error(`Line item ${index + 1} must have a description.`);
    }
  });

  // Verify grandTotal matches sum of line items
  const expectedGrandTotal = calculateGrandTotal(lineItems);
  if (grandTotal !== expectedGrandTotal) {
    throw new Error(`Grand total mismatch. Expected ${expectedGrandTotal}, got ${grandTotal}.`);
  }

  // URL validation for logo
  try {
    new URL(company.logo);
  } catch (_) {
    throw new Error("Company logo must be a valid URL.");
  }

  // Date validation (DD/MM/YYYY)
  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!dateRegex.test(date)) {
    throw new Error("Date must be in DD/MM/YYYY format.");
  }
}
