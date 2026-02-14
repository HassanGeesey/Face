/**
 * Calculate total for a single line item
 * @param {Object} item - Line item object
 * @returns {string} - Total as string with 2 decimals
 */
export function calculateLineTotal(item) {
  const qty = parseFloat(item.qty) || 0;
  const unitPrice = parseFloat(item.unitPrice) || 0;
  return (qty * unitPrice).toFixed(2);
}

/**
 * Update all line items with correct sequence numbers and totals
 * @param {Array} items - List of line items
 * @returns {Array} - Updated list of line items
 */
export function updateLineItemsTotals(items) {
  return items.map((item, index) => ({
    ...item,
    no: index + 1,
    total: calculateLineTotal(item),
  }));
}

/**
 * Calculate grand total for all line items
 * @param {Array} items - List of line items
 * @returns {string} - Grand total as string with 2 decimals
 */
export function calculateGrandTotal(items) {
  const total = items.reduce((sum, item) => {
    const itemTotal = parseFloat(item.total) || 0;
    return sum + itemTotal;
  }, 0);
  return total.toFixed(2);
}
