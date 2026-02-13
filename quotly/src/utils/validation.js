import { calculateGrandTotal } from "./calculations.js";

/**
 * Validate if a string is a valid URL
 * @param {string} url
 * @returns {boolean}
 */
export function validateURL(url) {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(url);
}

/**
 * Validate date format DD/MM/YYYY
 * @param {string} date
 * @returns {boolean}
 */
export function validateDate(date) {
  const pattern = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!pattern.test(date)) return false;

  const [day, month, year] = date.split("/").map(Number);
  const d = new Date(year, month - 1, day);
  return (
    d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day
  );
}

/**
 * Validate the entire quotation object
 * @param {Object} quotation
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export function validateQuotation(quotation) {
  const errors = [];

  if (!quotation) {
    return { valid: false, errors: ["Quotation data is missing"] };
  }

  // Company validation
  const company = quotation.company || {};
  if (!company.name) errors.push("Company name is required");
  if (!company.email) errors.push("Company email is required");
  if (!company.address) errors.push("Company address is required");
  if (!company.logo || !validateURL(company.logo)) {
    errors.push("Valid company logo URL is required");
  }

  // Customer validation
  const customer = quotation.customer || {};
  if (!customer.name) errors.push("Customer name is required");

  // Date validation
  if (!validateDate(quotation.date)) {
    errors.push("Date must be in DD/MM/YYYY format");
  }

  // Line Items validation
  const lineItems = quotation.lineItems || [];
  if (lineItems.length === 0) {
    errors.push("At least one line item is required");
  } else {
    lineItems.forEach((item, index) => {
      const itemNo = item.no || index + 1;
      if (item.qty <= 0) {
        errors.push(`Line item ${itemNo}: quantity must be greater than 0`);
      }
      if (item.unitPrice < 0) {
        errors.push(
          `Line item ${itemNo}: unit price must be 0 or greater`
        );
      }
      if (!item.description) {
        errors.push(`Line item ${itemNo}: description is required`);
      }
    });
  }

  // Integrity check
  const calculatedTotal = calculateGrandTotal(lineItems);
  if (calculatedTotal !== quotation.grandTotal) {
    errors.push(
      `Grand total mismatch: expected ${calculatedTotal}, got ${quotation.grandTotal}`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
