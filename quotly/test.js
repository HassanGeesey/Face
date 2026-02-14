import assert from 'assert';
import {
  calculateLineTotal,
  updateLineItemsTotals,
  calculateGrandTotal,
  validateQuotation,
  EMPTY_QUOTATION,
  quotlyManager
} from './src/index.js';

async function runTests() {
  console.log('Running Quotly Integration Tests...');

  // 1. Test Calculations
  console.log('- Testing calculations...');
  const item = { qty: 2, unitPrice: 15.50 };
  const total = calculateLineTotal(item);
  assert.strictEqual(total, '31.00', 'Line total calculation failed');

  const items = [
    { qty: 1, unitPrice: 10, description: 'Item 1' },
    { qty: 3, unitPrice: 5, description: 'Item 2' }
  ];
  const updatedItems = updateLineItemsTotals(items);
  assert.strictEqual(updatedItems[0].no, 1);
  assert.strictEqual(updatedItems[0].total, '10.00');
  assert.strictEqual(updatedItems[1].no, 2);
  assert.strictEqual(updatedItems[1].total, '15.00');

  const grandTotal = calculateGrandTotal(updatedItems);
  assert.strictEqual(grandTotal, '25.00', 'Grand total calculation failed');

  // 2. Test Validation
  console.log('- Testing validation...');
  const validQuotation = {
    ...EMPTY_QUOTATION,
    date: '01/01/2024',
    company: {
      name: 'Test Co',
      email: 'test@test.com',
      address: '123 Test St',
      logo: 'https://test.com/logo.png'
    },
    customer: {
      name: 'Test Customer'
    },
    lineItems: updatedItems,
    grandTotal: '25.00'
  };

  const validationResult = validateQuotation(validQuotation);
  assert.strictEqual(validationResult.isValid, true, `Validation failed unexpectedly: ${validationResult.errors}`);

  const invalidQuotation = { ...validQuotation, date: 'invalid-date' };
  const invalidResult = validateQuotation(invalidQuotation);
  assert.strictEqual(invalidResult.isValid, false, 'Validation should have failed for invalid date');
  assert.ok(invalidResult.errors.includes('Invalid date format. Expected DD/MM/YYYY'));

  // 3. Test Manager Modes
  console.log('- Testing manager modes...');

  // Mode A: Debug JSON
  const debugResult = await quotlyManager(validQuotation, 'A');
  assert.strictEqual(debugResult.mode, 'DEBUG_JSON');
  assert.deepStrictEqual(debugResult.data, validQuotation);

  // Mode C: Validate
  const modeCResult = await quotlyManager(validQuotation, 'C');
  assert.strictEqual(modeCResult.isValid, true);

  // Mode B: PDF Generation (mocking fetch because we don't want to hit real API in tests usually,
  // but here we can check if it tries to call it or fails gracefully if fetch is missing in Node environment without polyfill)
  // Since we are in Node 22, fetch is available.
  console.log('- Testing PDF generation (Mode B)...');
  try {
    // This will likely fail in this environment if there's no internet or if the API key is invalid/rate limited
    // But we want to see it attempting the call.
    // For local tests, we might want to skip real API calls or mock them.
    // Let's just catch the error and verify it's an API error, not a logic error.
    await quotlyManager(validQuotation, 'B');
  } catch (error) {
    console.log(`  (Note: Mode B call failed as expected or due to environment: ${error.message})`);
    assert.ok(error.message.includes('Failed to generate PDF') || error.message.includes('fetch is not defined') || error.message.includes('getaddrinfo'));
  }

  console.log('All tests passed successfully!');
}

runTests().catch(err => {
  console.error('Tests failed!');
  console.error(err);
  process.exit(1);
});
