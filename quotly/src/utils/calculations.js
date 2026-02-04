// Calculate total for a line item
export function calculateLineTotal(item) {
  return (item.qty * item.unitPrice).toFixed(2);
}

// Update all line items with correct 'no' and 'total'
export function updateLineItemsTotals(items) {
  return items.map((item, index) => ({
    ...item,
    no: index + 1,
    total: calculateLineTotal(item),
  }));
}

// Calculate grand total from line items
export function calculateGrandTotal(items) {
  return items.reduce((sum, item) => sum + parseFloat(item.total), 0).toFixed(2);
}
