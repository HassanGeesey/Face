import assert from 'node:assert';
import {
  calculateLineTotal,
  updateLineItemsTotals,
  calculateGrandTotal,
  validateQuotation,
  EMPTY_QUOTATION,
  quotlyManager
} from './src/index.js';

async function runTests() {
  console.log("🚀 Running Quotly integration tests...");

  // 1. Test calculations
  console.log("   Testing calculations...");
  const item = { qty: 2, unitPrice: 10.5 };
  assert.strictEqual(calculateLineTotal(item), "21.00");

  const items = [
    { qty: 1, unitPrice: 10, description: "Test Item 1" },
    { qty: 2, unitPrice: 5, description: "Test Item 2" }
  ];
  const updatedItems = updateLineItemsTotals(items);
  assert.strictEqual(updatedItems[0].total, "10.00");
  assert.strictEqual(updatedItems[0].no, 1);
  assert.strictEqual(updatedItems[1].total, "10.00");
  assert.strictEqual(updatedItems[1].no, 2);

  assert.strictEqual(calculateGrandTotal(updatedItems), "20.00");

  // 2. Test validation
  console.log("   Testing validation...");
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
  assert.strictEqual(validation.valid, true, "Quotation should be valid");

  const invalidQuotation = { ...validQuotation, date: "2024-01-01" };
  const invalidValidation = validateQuotation(invalidQuotation);
  assert.strictEqual(invalidValidation.valid, false, "Quotation should be invalid due to date format");
  assert.ok(invalidValidation.errors.includes("Date must be in DD/MM/YYYY format"));

  // 3. Test integrity check
  console.log("   Testing integrity check...");
  const mismatchedQuotation = { ...validQuotation, grandTotal: "100.00" };
  const integrityValidation = validateQuotation(mismatchedQuotation);
  assert.strictEqual(integrityValidation.valid, false);
  assert.ok(integrityValidation.errors.some(e => e.includes("Grand total mismatch")));

  // 4. Test Modes
  console.log("   Testing operation modes...");
  const jsonMode = await quotlyManager(validQuotation, 'A');
  assert.strictEqual(typeof jsonMode, 'string');
  assert.ok(jsonMode.includes("Acme Corp"));

  const validateMode = await quotlyManager(validQuotation, 'C');
  assert.strictEqual(validateMode.valid, true);

  console.log("✅ All tests passed successfully!");
}

runTests().catch(err => {
  console.error("❌ Tests failed:", err);
  process.exit(1);
});
