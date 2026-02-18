import assert from "node:assert";
import {
  calculateLineTotal,
  updateLineItemsTotals,
  calculateGrandTotal,
  validateQuotation,
  quotlyManager
} from "./src/index.js";

async function runTests() {
  console.log("Running Quotly tests...");

  // 1. Test Calculations
  const item = { qty: 2, unitPrice: 10.5 };
  assert.strictEqual(calculateLineTotal(item), "21.00", "Line total calculation failed");

  const items = [
    { description: "Item 1", qty: 2, unitPrice: 10 },
    { description: "Item 2", qty: 1, unitPrice: 5.5 },
  ];
  const updatedItems = updateLineItemsTotals(items);
  assert.strictEqual(updatedItems[0].total, "20.00");
  assert.strictEqual(updatedItems[1].total, "5.50");
  assert.strictEqual(updatedItems[0].no, 1);
  assert.strictEqual(updatedItems[1].no, 2);

  const grandTotal = calculateGrandTotal(updatedItems);
  assert.strictEqual(grandTotal, "25.50", "Grand total calculation failed");

  // 2. Test Validation
  const validQuotation = {
    date: "18/02/2025",
    company: {
      name: "Test Co",
      email: "test@example.com",
      address: "123 Street",
      logo: "https://example.com/logo.png"
    },
    customer: { name: "John Doe" },
    lineItems: updatedItems,
    grandTotal: "25.50"
  };

  const errors = validateQuotation(validQuotation);
  assert.strictEqual(errors.length, 0, `Valid quotation should have no errors: ${errors.join(", ")}`);

  const invalidQuotation = { ...validQuotation, date: "2025-02-18", company: { ...validQuotation.company, name: "" } };
  const errors2 = validateQuotation(invalidQuotation);
  assert.ok(errors2.includes("Company name is required."));
  assert.ok(errors2.includes("Date must be in DD/MM/YYYY format."));

  // 3. Test Modes
  // Mode A
  const modeAResult = await quotlyManager(validQuotation, 'A');
  assert.strictEqual(modeAResult.grandTotal, "25.50");

  // Mode C
  const modeCResult = await quotlyManager(validQuotation, 'C');
  assert.strictEqual(modeCResult.isValid, true);

  console.log("All tests passed!");
}

runTests().catch(err => {
  console.error("Tests failed:", err);
  process.exit(1);
});
