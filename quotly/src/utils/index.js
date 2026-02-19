/**
 * Calculate total for a line item
 * @param {Object} item
 * @returns {string}
 */
export function calculateLineTotal(item) {
  const qty = parseFloat(item.qty) || 0;
  const unitPrice = parseFloat(item.unitPrice) || 0;
  return (qty * unitPrice).toFixed(2);
}

/**
 * Update all line items with correct 'no' and 'total'
 * @param {Array} items
 * @returns {Array}
 */
export function updateLineItemsTotals(items) {
  return items.map((item, index) => ({
    ...item,
    no: index + 1,
    total: calculateLineTotal(item),
  }));
}

/**
 * Calculate grand total from line items
 * @param {Array} items
 * @returns {string}
 */
export function calculateGrandTotal(items) {
  return items
    .reduce((sum, item) => sum + parseFloat(item.total || 0), 0)
    .toFixed(2);
}

/**
 * Validate quotation data
 * @param {Object} quotation
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export function validateQuotation(quotation) {
  const errors = [];

  // Date validation
  if (!quotation.date || !/^\d{2}\/\d{2}\/\d{4}$/.test(quotation.date)) {
    errors.push("Date must be in DD/MM/YYYY format.");
  }

  // Company validation
  if (!quotation.company) {
    errors.push("Company information is missing.");
  } else {
    if (!quotation.company.name) errors.push("Company name is required.");
    if (!quotation.company.email) errors.push("Company email is required.");
    if (!quotation.company.address) errors.push("Company address is required.");
    if (!quotation.company.logo) {
      errors.push("Company logo URL is required.");
    } else {
      try {
        new URL(quotation.company.logo);
      } catch (e) {
        errors.push("Company logo must be a valid URL.");
      }
    }
  }

  // Customer validation
  if (!quotation.customer || !quotation.customer.name) {
    errors.push("Customer name is required.");
  }

  // Line Items validation
  if (!quotation.lineItems || quotation.lineItems.length === 0) {
    errors.push("At least one line item is required.");
  } else {
    quotation.lineItems.forEach((item, index) => {
      if (!item.description) errors.push(`Line item ${index + 1}: Description is required.`);
      if (item.qty <= 0) errors.push(`Line item ${index + 1}: Quantity must be greater than 0.`);
      if (item.unitPrice < 0) errors.push(`Line item ${index + 1}: Unit price cannot be negative.`);
    });
  }

  // Integrity check: grandTotal should match calculated sum
  const calculatedGrandTotal = calculateGrandTotal(quotation.lineItems || []);
  if (quotation.grandTotal !== calculatedGrandTotal) {
    errors.push(`Grand total integrity check failed. Expected ${calculatedGrandTotal}, got ${quotation.grandTotal}.`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
