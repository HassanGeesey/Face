import assert from "node:assert";
import {
  calculateLineTotal,
  updateLineItemsTotals,
  calculateGrandTotal,
  validateQuotation,
  quotlyManager,
} from "./src/index.js";

async function runTests() {
  console.log("Running Quotly tests...");

  // Test calculations
  const item = { qty: 2, unitPrice: 10.5 };
  assert.strictEqual(calculateLineTotal(item), "21.00");

  const items = [
    { qty: 1, unitPrice: 10, description: "Item 1" },
    { qty: 2, unitPrice: 20, description: "Item 2" },
  ];
  const updated = updateLineItemsTotals(items);
  assert.strictEqual(updated[0].total, "10.00");
  assert.strictEqual(updated[1].total, "40.00");
  assert.strictEqual(updated[0].no, 1);
  assert.strictEqual(updated[1].no, 2);

  const grandTotal = calculateGrandTotal(updated);
  assert.strictEqual(grandTotal, "50.00");

  // Test validation
  const validQuotation = {
    date: "01/01/2024",
    company: {
      name: "Test Co",
      email: "test@test.com",
      address: "Test Addr",
      logo: "https://test.com/logo.png",
    },
    customer: { name: "Test Cust" },
    lineItems: updated,
    grandTotal: "50.00",
  };

  const validation = validateQuotation(validQuotation);
  assert.strictEqual(validation.valid, true);

  const invalidQuotation = { ...validQuotation, grandTotal: "0.00" };
  const invalidValidation = validateQuotation(invalidQuotation);
  assert.strictEqual(invalidValidation.valid, false);
  assert.ok(
    invalidValidation.errors.some((e) => e.includes("Grand total mismatch"))
  );

  // Test Mode A
  const jsonOutput = await quotlyManager(validQuotation, "A");
  assert.strictEqual(typeof jsonOutput, "string");
  assert.ok(JSON.parse(jsonOutput));

  console.log("All tests passed!");
}

runTests().catch((err) => {
  console.error("Tests failed!", err);
  process.exit(1);
});
