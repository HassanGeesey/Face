/**
 * Calculates the total for a single line item.
 * @param {Object} item - Line item with qty and unitPrice.
 * @returns {string} - Total as a string with 2 decimals.
 */
export function calculateLineTotal(item) {
  const qty = parseFloat(item.qty) || 0;
  const unitPrice = parseFloat(item.unitPrice) || 0;
  return (qty * unitPrice).toFixed(2);
}

/**
 * Updates all line items with correct item numbers and totals.
 * @param {Array} items - Array of line items.
 * @returns {Array} - Updated array of line items.
 */
export function updateLineItemsTotals(items) {
  return items.map((item, index) => ({
    ...item,
    no: index + 1,
    total: calculateLineTotal(item),
  }));
}

/**
 * Calculates the sum of all line item totals.
 * @param {Array} items - Array of line items with 'total' property.
 * @returns {string} - Grand total as a string with 2 decimals.
 */
export function calculateGrandTotal(items) {
  return items
    .reduce((sum, item) => sum + parseFloat(item.total || 0), 0)
    .toFixed(2);
}

/**
 * Calculates a detailed financial breakdown including subtotal, tax, and discount.
 * @param {Object} quotation - Quotation object.
 * @returns {Object} - Breakdown: { subTotal, taxAmount, grandTotal }
 */
export function calculateDetailedTotals(quotation) {
  // Use pre-calculated line totals to ensure consistency with displayed values
  const subTotalValue = quotation.lineItems.reduce(
    (sum, item) => sum + parseFloat(calculateLineTotal(item)),
    0
  );

  const discount = parseFloat(quotation.discount) || 0;
  const taxRate = parseFloat(quotation.taxRate) || 0;

  const discountedSubTotal = Math.max(0, subTotalValue - discount);
  const taxAmountValue = (discountedSubTotal * taxRate) / 100;
  const grandTotalValue = discountedSubTotal + taxAmountValue;

  return {
    subTotal: subTotalValue.toFixed(2),
    taxAmount: taxAmountValue.toFixed(2),
    grandTotal: grandTotalValue.toFixed(2),
  };
}
