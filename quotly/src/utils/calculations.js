// Calculate total for a line item
export function calculateLineTotal(item) {
  const qty = parseFloat(item.qty) || 0;
  const unitPrice = parseFloat(item.unitPrice) || 0;
  return (qty * unitPrice).toFixed(2);
}

// Update all line items
export function updateLineItemsTotals(items) {
  return items.map((item, index) => ({
    ...item,
    no: index + 1,
    total: calculateLineTotal(item),
  }));
}

// Calculate grand total
export function calculateGrandTotal(items) {
  return items.reduce((sum, item) => sum + parseFloat(item.total || 0), 0).toFixed(2);
}
