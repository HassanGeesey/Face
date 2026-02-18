/**
 * Calculate total for a line item
 * @param {Object} item
 * @returns {string}
 */
export function calculateLineTotal(item) {
  return (item.qty * item.unitPrice).toFixed(2);
}

/**
 * Update all line items totals and numbering
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
