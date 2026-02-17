import assert from 'node:assert';
import {
  calculateLineTotal,
  updateLineItemsTotals,
  calculateGrandTotal,
  validateQuotation,
  EMPTY_QUOTATION
} from './src/index.js';

async function runTests() {
  console.log("Running Quotly tests...");

  // Test calculations
  const item = { qty: 2, unitPrice: 10.5 };
  assert.strictEqual(calculateLineTotal(item), "21.00");

  const items = [
    { qty: 1, unitPrice: 10, description: "Test 1" },
    { qty: 2, unitPrice: 5, description: "Test 2" }
  ];
  const updatedItems = updateLineItemsTotals(items);
  assert.strictEqual(updatedItems[0].total, "10.00");
  assert.strictEqual(updatedItems[0].no, 1);
  assert.strictEqual(updatedItems[1].total, "10.00");
  assert.strictEqual(updatedItems[1].no, 2);

  assert.strictEqual(calculateGrandTotal(updatedItems), "20.00");

  // Test validation
  const validQuotation = {
    date: "01/01/2024",
    company: {
      name: "Acme Corp",
      email: "info@acme.com",
      address: "123 Street",
      logo: "https://acme.com/logo.png",
      mobiles: ["1234567890"]
    },
    customer: { name: "John Doe" },
    lineItems: updatedItems,
    grandTotal: "20.00"
  };

  const validation = validateQuotation(validQuotation);
  assert.strictEqual(validation.valid, true, `Validation failed: ${validation.errors.join(", ")}`);

  const invalidQuotation = { ...validQuotation, date: "2024-01-01" };
  const invalidValidation = validateQuotation(invalidQuotation);
  assert.strictEqual(invalidValidation.valid, false);
  assert.ok(invalidValidation.errors.includes("Date must be in DD/MM/YYYY format"));

  // Test integrity check
  const tamperedQuotation = { ...validQuotation, grandTotal: "100.00" };
  const tamperedValidation = validateQuotation(tamperedQuotation);
  assert.strictEqual(tamperedValidation.valid, false);
  assert.ok(tamperedValidation.errors.some(e => e.includes("Grand total mismatch")));

  console.log("All tests passed!");
}

runTests().catch(err => {
  console.error("Tests failed:", err);
  process.exit(1);
});
