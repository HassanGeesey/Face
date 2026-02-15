export function calculateLineTotal(item) {
  return (item.qty * item.unitPrice).toFixed(2);
}

export function updateLineItemsTotals(items) {
  return items.map((item, index) => ({
    ...item,
    no: index + 1,
    total: calculateLineTotal(item),
  }));
}

export function calculateGrandTotal(items) {
  return items.reduce((sum, item) => sum + parseFloat(item.total || 0), 0).toFixed(2);
}
