import assert from 'node:assert';
import {
  calculateLineTotal,
  updateLineItemsTotals,
  calculateGrandTotal,
  validateQuotation,
  quotlyManager
} from './src/index.js';

const mockItems = [
  { qty: 2, unitPrice: 10.5, description: 'Item 1' },
  { qty: 1, unitPrice: 5.0, description: 'Item 2' },
];

async function runTests() {
  console.log('Running Quotly Tests...');

  // Test 1: calculateLineTotal
  console.log('- Testing calculateLineTotal');
  assert.strictEqual(calculateLineTotal({ qty: 2, unitPrice: 15.25 }), '30.50');
  assert.strictEqual(calculateLineTotal({ qty: 0, unitPrice: 10 }), '0.00');

  // Test 2: updateLineItemsTotals
  console.log('- Testing updateLineItemsTotals');
  const updatedItems = updateLineItemsTotals(mockItems);
  assert.strictEqual(updatedItems[0].no, 1);
  assert.strictEqual(updatedItems[0].total, '21.00');
  assert.strictEqual(updatedItems[1].no, 2);
  assert.strictEqual(updatedItems[1].total, '5.00');

  // Test 3: calculateGrandTotal
  console.log('- Testing calculateGrandTotal');
  assert.strictEqual(calculateGrandTotal(updatedItems), '26.00');

  // Test 4: validateQuotation
  console.log('- Testing validateQuotation');
  const validQuotation = {
    date: '01/01/2024',
    company: {
      name: 'Test Co',
      email: 'test@example.com',
      address: '123 St',
      logo: 'https://example.com/logo.png',
      mobiles: ['123456']
    },
    customer: { name: 'Cust' },
    lineItems: updatedItems,
    grandTotal: '26.00'
  };
  const validation = validateQuotation(validQuotation);
  assert.strictEqual(validation.valid, true);

  const invalidQuotation = { ...validQuotation, date: '2024-01-01' };
  const invalidValidation = validateQuotation(invalidQuotation);
  assert.strictEqual(invalidValidation.valid, false);
  assert.ok(invalidValidation.errors.some(e => e.includes('format')));

  // Test 5: quotlyManager Mode A
  console.log('- Testing quotlyManager Mode A (JSON)');
  const modeAResult = await quotlyManager(validQuotation, 'A');
  assert.strictEqual(modeAResult.grandTotal, '26.00');
  assert.strictEqual(modeAResult.lineItems.length, 2);

  // Test 6: quotlyManager Mode C
  console.log('- Testing quotlyManager Mode C (Validate)');
  const modeCResult = await quotlyManager(validQuotation, 'C');
  assert.strictEqual(modeCResult.valid, true);
  assert.strictEqual(modeCResult.integrityCheck.match, true);

  console.log('All tests passed!');
}

runTests().catch(err => {
  console.error('Tests failed:', err);
  process.exit(1);
});
