/**
 * Calculate total for a line item
 * @param {import('../types').LineItem} item
 * @returns {string}
 */
export function calculateLineTotal(item) {
  return (item.qty * item.unitPrice).toFixed(2);
}

/**
 * Update all line items with correct numbers and totals
 * @param {import('../types').LineItem[]} items
 * @returns {import('../types').LineItem[]}
 */
export function updateLineItemsTotals(items) {
  return items.map((item, index) => ({
    ...item,
    no: index + 1,
    total: calculateLineTotal(item),
  }));
}

/**
 * Calculate the full financial breakdown including tax and discounts
 * @param {import('../types').LineItem[]} items
 * @param {number} [taxRate=0]
 * @param {number} [discount=0]
 * @returns {{ subTotal: string, taxAmount: string, grandTotal: string }}
 */
export function calculateDetailedTotals(items, taxRate = 0, discount = 0) {
  const subTotalNum = items.reduce((sum, item) => sum + parseFloat(item.total || 0), 0);
  const taxableAmount = Math.max(0, subTotalNum - discount);
  const taxAmountNum = taxableAmount * (taxRate / 100);
  const grandTotalNum = taxableAmount + taxAmountNum;

  return {
    subTotal: subTotalNum.toFixed(2),
    taxAmount: taxAmountNum.toFixed(2),
    grandTotal: grandTotalNum.toFixed(2),
  };
}

/**
 * Calculate grand total from line items (backwards compatible)
 * @param {import('../types').LineItem[]} items
 * @returns {string}
 */
export function calculateGrandTotal(items) {
  return calculateDetailedTotals(items).grandTotal;
}
