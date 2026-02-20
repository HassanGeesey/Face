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
  console.log('Running Quotly Tests...');

  // 1. Test Calculations
  console.log('- Testing Calculations...');
  const item = { qty: 2, unitPrice: 10.5 };
  assert.strictEqual(calculateLineTotal(item), '21.00');

  const items = [
    { qty: 1, unitPrice: 10, description: 'A' },
    { qty: 2, unitPrice: 5.5, description: 'B' }
  ];
  const updatedItems = updateLineItemsTotals(items);
  assert.strictEqual(updatedItems[0].total, '10.00');
  assert.strictEqual(updatedItems[0].no, 1);
  assert.strictEqual(updatedItems[1].total, '11.00');
  assert.strictEqual(updatedItems[1].no, 2);

  const grandTotal = calculateGrandTotal(updatedItems);
  assert.strictEqual(grandTotal, '21.00');

  // 2. Test Validation
  console.log('- Testing Validation...');
  const invalidQuotation = { ...EMPTY_QUOTATION, date: 'invalid-date' };
  const validation1 = validateQuotation(invalidQuotation);
  assert.strictEqual(validation1.valid, false);
  assert(validation1.errors.length > 0);

  const validQuotation = {
    date: '25/05/2024',
    company: {
      name: 'Test Co',
      email: 'test@example.com',
      address: '123 Test St',
      logo: 'https://example.com/logo.png',
      mobiles: ['1234567890']
    },
    customer: {
      name: 'John Doe'
    },
    lineItems: [
      {
        no: 1,
        qty: 1,
        unit: 'UNIT',
        unitPrice: 100,
        description: 'Test Item',
        total: '100.00'
      }
    ],
    grandTotal: '100.00'
  };
  const validation2 = validateQuotation(validQuotation);
  assert.strictEqual(validation2.valid, true, `Validation failed: ${validation2.errors.join(', ')}`);

  // 3. Test Modes
  console.log('- Testing Modes...');

  // Mode A: Debug
  const modeAData = await quotlyManager(validQuotation, 'A');
  assert.strictEqual(modeAData.grandTotal, '100.00');
  assert.strictEqual(modeAData.lineItems[0].total, '100.00');

  // Mode C: Validate
  const modeCData = await quotlyManager(validQuotation, 'C');
  assert.strictEqual(modeCData.valid, true);

  // Mode B: PDF Generation (Mocking fetch)
  console.log('- Testing Mode B (PDF Generation) with mock...');
  const originalFetch = global.fetch;
  global.fetch = async () => ({
    ok: true,
    blob: async () => ({ size: 1234, type: 'application/pdf' })
  });

  try {
    const pdfBlob = await quotlyManager(validQuotation, 'B');
    assert.strictEqual(pdfBlob.size, 1234);
  } finally {
    global.fetch = originalFetch;
  }

  console.log('All tests passed successfully!');
}

runTests().catch(err => {
  console.error('Tests failed!');
  console.error(err);
  process.exit(1);
});
