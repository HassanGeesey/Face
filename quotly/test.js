import assert from 'assert';
import {
  calculateDetailedTotals,
  validateQuotation,
  quotlyManager,
  EMPTY_QUOTATION
} from './src/index.js';

async function runTests() {
  console.log('Running Quotly Tests...');

  // 1. Test Calculations
  console.log('- Testing Calculations...');
  const q1 = {
    ...EMPTY_QUOTATION,
    lineItems: [
      { qty: 2, unitPrice: 50.0, description: 'Item 1' }, // 100.00
      { qty: 1, unitPrice: 200.0, description: 'Item 2' }, // 200.00
    ],
    taxRate: 10,
    discount: 50,
  };
  // subTotal = 300
  // discount = 50
  // taxableAmount = 250
  // taxAmount = 25
  // grandTotal = 300 - 50 + 25 = 275

  const res1 = calculateDetailedTotals(q1);
  assert.strictEqual(res1.subTotal, '300.00');
  assert.strictEqual(res1.taxAmount, '25.00');
  assert.strictEqual(res1.grandTotal, '275.00');
  assert.strictEqual(res1.lineItems[0].total, '100.00');
  assert.strictEqual(res1.lineItems[0].no, 1);
  console.log('  ✓ Calculations passed');

  // 2. Test Validation
  console.log('- Testing Validation...');
  const invalidQ = { ...EMPTY_QUOTATION };
  const errors = validateQuotation(invalidQ);
  assert.ok(errors.length > 0, 'Should have errors for empty quotation');
  assert.ok(errors.some(e => e.includes('Company name')), 'Should flag missing company name');

  const validQ = {
    ...EMPTY_QUOTATION,
    grandTotal: "10.00", // Match expected
    date: '25/05/2024',
    company: {
      name: 'Acme',
      email: 'a@b.com',
      address: 'Addr',
      logo: 'https://logo.com/img.png',
      mobiles: ['123'],
    },
    customer: { name: 'Customer' },
    lineItems: [{ qty: 1, unitPrice: 10, description: 'Item' }]
  };
  const errors2 = validateQuotation(validQ);
  assert.strictEqual(errors2.length, 0, `Should be valid, but got: ${errors2.join(', ')}`);
  console.log('  ✓ Validation passed');

  // 3. Test Manager Mode A (JSON)
  console.log('- Testing Mode A (JSON)...');
  const modeA = await quotlyManager(q1, 'A');
  assert.strictEqual(modeA.grandTotal, '275.00');
  console.log('  ✓ Mode A passed');

  // 4. Test Manager Mode C (Validation & Integrity)
  console.log('- Testing Mode C (Validation & Integrity)...');
  const modeC = await quotlyManager(validQ, 'C');
  assert.strictEqual(modeC.valid, true);

  const inconsistentQ = { ...validQ, grandTotal: '123.45' };
  const modeC2 = await quotlyManager(inconsistentQ, 'C');
  assert.strictEqual(modeC2.valid, false);
  assert.ok(modeC2.integrityIssues.some(i => i.includes('Grand total mismatch')));
  console.log('  ✓ Mode C passed');

  console.log('\nAll tests passed successfully!');
}

runTests().catch(err => {
  console.error('Tests failed:', err);
  process.exit(1);
});
