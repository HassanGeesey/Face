import assert from 'assert';
import {
  updateLineItemsTotals,
  calculateGrandTotal,
  validateQuotation,
  quotlyManager
} from './src/index.js';

async function runTests() {
  console.log("Starting tests...");

  const mockLineItems = [
    { qty: 2, unit: "UNIT", unitPrice: 100, description: "Item 1" },
    { qty: 1, unit: "UNIT", unitPrice: 50, description: "Item 2" }
  ];

  // Test 1: updateLineItemsTotals
  const updatedItems = updateLineItemsTotals(mockLineItems);
  assert.strictEqual(updatedItems[0].total, "200.00");
  assert.strictEqual(updatedItems[1].total, "50.00");
  assert.strictEqual(updatedItems[0].no, 1);
  assert.strictEqual(updatedItems[1].no, 2);
  console.log("✅ updateLineItemsTotals passed");

  // Test 2: calculateGrandTotal
  const grandTotal = calculateGrandTotal(updatedItems);
  assert.strictEqual(grandTotal, "250.00");
  console.log("✅ calculateGrandTotal passed");

  // Test 3: validateQuotation (Valid)
  const validQuotation = {
    date: "01/01/2024",
    company: {
      name: "Test Co",
      email: "test@test.com",
      address: "123 Test St",
      logo: "https://test.com/logo.png"
    },
    customer: { name: "John Doe" },
    lineItems: updatedItems,
    grandTotal: grandTotal
  };
  const validationResult = validateQuotation(validQuotation);
  assert.strictEqual(validationResult.valid, true);
  assert.strictEqual(validationResult.errors.length, 0);
  console.log("✅ validateQuotation (Valid) passed");

  // Test 4: validateQuotation (Invalid)
  const invalidQuotation = {
    ...validQuotation,
    date: "2024-01-01", // Wrong format
    grandTotal: "100.00" // Wrong total
  };
  const invalidResult = validateQuotation(invalidQuotation);
  assert.strictEqual(invalidResult.valid, false);
  assert.ok(invalidResult.errors.includes("Date must be in DD/MM/YYYY format"));
  assert.ok(invalidResult.errors.some(e => e.includes("Grand total mismatch")));
  console.log("✅ validateQuotation (Invalid) passed");

  // Test 5: quotlyManager Mode A (JSON)
  const jsonOutput = await quotlyManager(validQuotation, 'A');
  const parsed = JSON.parse(jsonOutput);
  assert.deepStrictEqual(parsed.data, validQuotation);
  console.log("✅ quotlyManager Mode A passed");

  console.log("All tests passed successfully!");
}

runTests().catch(err => {
  console.error("Tests failed:", err);
  process.exit(1);
});
