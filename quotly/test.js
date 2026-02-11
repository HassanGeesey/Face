import {
  updateLineItemsTotals,
  calculateGrandTotal,
  validateQuotation,
  quotlyManager,
  EMPTY_QUOTATION
} from './src/index.js';
import assert from 'assert';

async function runTests() {
  console.log("Starting Quotly Tests...");

  // 1. Test Calculations
  const items = [
    { qty: 2, unitPrice: 10, description: 'Item 1' },
    { qty: 5, unitPrice: 20, description: 'Item 2' },
  ];

  const updatedItems = updateLineItemsTotals(items);
  assert.strictEqual(updatedItems[0].total, "20.00");
  assert.strictEqual(updatedItems[1].total, "100.00");
  assert.strictEqual(updatedItems[0].no, 1);
  assert.strictEqual(updatedItems[1].no, 2);

  const grandTotal = calculateGrandTotal(updatedItems);
  assert.strictEqual(grandTotal, "120.00");
  console.log("✅ Calculations pass");

  // 2. Test Validation
  const validQuotation = {
    date: '20/05/2024',
    company: {
      name: 'Test Co',
      email: 'test@co.com',
      address: '123 St',
      logo: 'https://example.com/logo.png',
    },
    customer: { name: 'Customer A' },
    lineItems: updatedItems,
    grandTotal: grandTotal,
  };

  const validation = validateQuotation(validQuotation);
  assert.strictEqual(validation.isValid, true);
  console.log("✅ Validation pass (valid data)");

  const invalidQuotation = { ...validQuotation, date: 'invalid-date' };
  const invalidValidation = validateQuotation(invalidQuotation);
  assert.strictEqual(invalidValidation.isValid, false);
  assert.ok(invalidValidation.errors.includes("Date must be in DD/MM/YYYY format."));
  console.log("✅ Validation pass (invalid data)");

  // 3. Test Mode A (Debug JSON)
  const modeAResult = await quotlyManager(validQuotation, 'A');
  assert.strictEqual(modeAResult.mode, 'Debug JSON');
  assert.deepStrictEqual(modeAResult.data, validQuotation);
  console.log("✅ Mode A pass");

  // 4. Test Mode C (Validate)
  const modeCResult = await quotlyManager(validQuotation, 'C');
  assert.strictEqual(modeCResult.mode, 'Validate & Review');
  assert.strictEqual(modeCResult.isValid, true);
  console.log("✅ Mode C pass");

  console.log("All local tests passed!");
}

runTests().catch(err => {
  console.error("Tests failed!");
  console.error(err);
  process.exit(1);
});
