import assert from 'node:assert';
import {
  calculateLineTotal,
  updateLineItemsTotals,
  calculateGrandTotal,
  validateQuotation,
  quotlyManager,
  EMPTY_QUOTATION
} from './src/index.js';

async function runTests() {
  console.log('Running Quotly Tests...\n');

  // Test 1: calculateLineTotal
  console.log('Test 1: calculateLineTotal');
  assert.strictEqual(calculateLineTotal({ qty: 2, unitPrice: 10.5 }), '21.00');
  assert.strictEqual(calculateLineTotal({ qty: 0, unitPrice: 10.5 }), '0.00');
  assert.strictEqual(calculateLineTotal({ qty: 3, unitPrice: 0 }), '0.00');
  console.log('✅ Passed');

  // Test 2: updateLineItemsTotals
  console.log('Test 2: updateLineItemsTotals');
  const items = [
    { qty: 1, unitPrice: 10, description: 'Item 1' },
    { qty: 2, unitPrice: 20, description: 'Item 2' }
  ];
  const updatedItems = updateLineItemsTotals(items);
  assert.strictEqual(updatedItems[0].no, 1);
  assert.strictEqual(updatedItems[0].total, '10.00');
  assert.strictEqual(updatedItems[1].no, 2);
  assert.strictEqual(updatedItems[1].total, '40.00');
  console.log('✅ Passed');

  // Test 3: calculateGrandTotal
  console.log('Test 3: calculateGrandTotal');
  assert.strictEqual(calculateGrandTotal(updatedItems), '50.00');
  console.log('✅ Passed');

  // Test 4: validateQuotation (valid)
  console.log('Test 4: validateQuotation (valid)');
  const validQuotation = {
    date: '01/01/2024',
    company: {
      name: 'Acme',
      email: 'acme@example.com',
      address: '123 Road',
      logo: 'https://example.com/logo.png'
    },
    customer: { name: 'John' },
    lineItems: updatedItems,
    grandTotal: '50.00'
  };
  const validResult = validateQuotation(validQuotation);
  assert.strictEqual(validResult.valid, true);
  assert.strictEqual(validResult.errors.length, 0);
  console.log('✅ Passed');

  // Test 5: validateQuotation (invalid)
  console.log('Test 5: validateQuotation (invalid)');
  const invalidQuotation = {
    ...validQuotation,
    date: '2024-01-01', // wrong format
    grandTotal: '100.00' // integrity fail
  };
  const invalidResult = validateQuotation(invalidQuotation);
  assert.strictEqual(invalidResult.valid, false);
  assert.ok(invalidResult.errors.some(e => e.includes('Date')));
  assert.ok(invalidResult.errors.some(e => e.includes('integrity check failed')));
  console.log('✅ Passed');

  // Test 6: quotlyManager Mode A
  console.log('Test 6: quotlyManager Mode A (Debug JSON)');
  const resultA = await quotlyManager(validQuotation, 'A');
  assert.strictEqual(resultA.grandTotal, '50.00');
  assert.strictEqual(resultA.lineItems[0].total, '10.00');
  console.log('✅ Passed');

  // Test 7: quotlyManager Mode C
  console.log('Test 7: quotlyManager Mode C (Validate)');
  const resultC = await quotlyManager(validQuotation, 'C');
  assert.strictEqual(resultC.valid, true);
  console.log('✅ Passed');

  console.log('\nAll tests passed successfully!');
}

runTests().catch(err => {
  console.error('Tests failed!');
  console.error(err);
  process.exit(1);
});
