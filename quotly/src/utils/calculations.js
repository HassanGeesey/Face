/**
 * Calculate total for a single line item.
 * @param {import('../types').LineItem} item
 * @returns {string}
 */
export function calculateLineTotal(item) {
  return (item.qty * item.unitPrice).toFixed(2);
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
 * Calculate full financial breakdown for a quotation.
 * @param {import('../types').Quotation} quotation
 * @returns {import('../types').Quotation}
 */
export function calculateDetailedTotals(quotation) {
  const updatedItems = updateLineItemsTotals(quotation.lineItems);

  const subTotalNum = updatedItems.reduce(
    (sum, item) => sum + parseFloat(item.total),
    0
  );

  const discount = quotation.discount || 0;
  const taxableAmount = Math.max(0, subTotalNum - discount);
  const taxRate = quotation.taxRate || 0;
  const taxAmountNum = taxableAmount * (taxRate / 100);

  const grandTotalNum = subTotalNum - discount + taxAmountNum;

  return {
    ...quotation,
    lineItems: updatedItems,
    subTotal: subTotalNum.toFixed(2),
    taxAmount: taxAmountNum.toFixed(2),
    grandTotal: grandTotalNum.toFixed(2),
  };
}
