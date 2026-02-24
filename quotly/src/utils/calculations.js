/**
 * Calculate total for a single line item.
 * @param {import('../types').LineItem} item
 * @returns {string} Total as a string with 2 decimals.
 */
export function calculateLineTotal(item) {
  const qty = item.qty || 0;
  const unitPrice = item.unitPrice || 0;
  return (qty * unitPrice).toFixed(2);
}

/**
 * Update all line items with correct sequence numbers and totals.
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
 * Calculate detailed totals for the quotation.
 * @param {import('../types').Quotation} quotation
 * @returns {import('../types').Quotation} Updated quotation with all totals.
 */
export function calculateDetailedTotals(quotation) {
  const lineItems = updateLineItemsTotals(quotation.lineItems || []);

  const subTotalValue = lineItems.reduce((sum, item) => sum + parseFloat(item.total), 0);
  const subTotal = subTotalValue.toFixed(2);

  const discount = quotation.discount || 0;
  const taxRate = quotation.taxRate || 0;

  const taxableAmount = Math.max(0, subTotalValue - discount);
  const taxAmountValue = taxableAmount * (taxRate / 100);
  const taxAmount = taxAmountValue.toFixed(2);

  const grandTotal = (taxableAmount + taxAmountValue).toFixed(2);

  return {
    ...quotation,
    lineItems,
    subTotal,
    taxAmount,
    grandTotal,
  };
}
