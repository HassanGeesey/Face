import assert from 'node:assert';
import { quotlyManager, EMPTY_QUOTATION } from './src/index.js';

async function runTests() {
  console.log('🚀 Starting Quotly Integration Tests...');

  const sampleQuotation = {
    ...EMPTY_QUOTATION,
    date: '25/05/2024',
    company: {
      name: 'Test Co',
      email: 'test@co.com',
      address: '123 Street',
      logo: 'https://example.com/logo.png'
    },
    customer: { name: 'Test Customer' },
    lineItems: [
      { qty: 2, unitPrice: 100, description: 'Item 1', unit: 'UNIT' }, // 200
      { qty: 1, unitPrice: 50, description: 'Item 2', unit: 'UNIT' },  // 50
    ],
    taxRate: 10,
    discount: 50,
    grandTotal: "0.00" // Intentional wrong total to test sync/integrity
  };

  // Test Mode A: Recalculation logic
  console.log('Testing Mode A (Debug JSON)...');
  const debugData = await quotlyManager(sampleQuotation, 'A');

  // subTotal should be 200 + 50 = 250
  assert.strictEqual(debugData.subTotal, '250.00', 'Subtotal should be 250.00');

  // taxable = 250 - 50 = 200
  // tax = 200 * 0.10 = 20
  assert.strictEqual(debugData.taxAmount, '20.00', 'Tax amount should be 20.00');

  // grandTotal = 200 + 20 = 220
  assert.strictEqual(debugData.grandTotal, '220.00', 'Grand total should be 220.00');
  assert.strictEqual(debugData.lineItems[0].no, 1);
  assert.strictEqual(debugData.lineItems[1].no, 2);
  console.log('✅ Mode A Passed.');

  // Test Mode C: Validation & Integrity
  console.log('Testing Mode C (Validation)...');
  const report = await quotlyManager(sampleQuotation, 'C');
  assert.strictEqual(report.isValid, true, 'Quotation should be valid');
  assert.strictEqual(report.integrityCheck.passed, false, 'Integrity check should fail due to wrong initial grandTotal');
  assert.strictEqual(report.integrityCheck.original, '0.00');
  assert.strictEqual(report.integrityCheck.recalculated, '220.00');
  console.log('✅ Mode C Passed.');

  // Test Validation Errors
  console.log('Testing Validation Errors...');
  const invalidQuotation = { ...sampleQuotation, date: 'invalid-date', company: { ...sampleQuotation.company, name: '' } };
  const errorReport = await quotlyManager(invalidQuotation, 'C');
  assert.strictEqual(errorReport.isValid, false, 'Should be invalid');
  assert.ok(errorReport.errors.length >= 2, 'Should have multiple errors');
  console.log('✅ Validation Error Handling Passed.');

  console.log('\n🎉 All local logic tests passed successfully!');
}

runTests().catch(err => {
  console.error('❌ Tests failed:', err);
  process.exit(1);
});
