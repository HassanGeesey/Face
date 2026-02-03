/**
 * Calculate total for a line item
 * @param {Object} item - The line item object
 * @returns {string} - The total formatted to 2 decimal places
 */
export function calculateLineTotal(item) {
  return (item.qty * item.unitPrice).toFixed(2);
}

/**
 * Update all line items with correct 'no' and 'total'
 * @param {Array} items - Array of line items
 * @returns {Array} - Updated array of line items
 */
export function updateLineItemsTotals(items) {
  if (!items) return [];
  return items.map((item, index) => ({
    ...item,
    no: index + 1,
    total: calculateLineTotal(item),
  }));
}

/**
 * Calculate grand total from line items
 * @param {Array} items - Array of line items
 * @returns {string} - The grand total formatted to 2 decimal places
 */
export function calculateGrandTotal(items) {
  if (!items) return "0.00";
  return items.reduce((sum, item) => sum + parseFloat(item.total || 0), 0).toFixed(2);
}
