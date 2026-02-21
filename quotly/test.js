import assert from 'node:assert';
import {
  calculateLineTotal,
  updateLineItemsTotals,
  calculateGrandTotal,
  validateQuotation,
  quotlyManager
} from './src/index.js';

console.log("Starting Quotly Integration Tests...");

// 1. Test Calculations
const item = { qty: 2, unitPrice: 10.5 };
assert.strictEqual(calculateLineTotal(item), "21.00", "calculateLineTotal failed");

const items = [
  { qty: 1, unitPrice: 100 },
  { qty: 3, unitPrice: 50 }
];
const updatedItems = updateLineItemsTotals(items);
assert.strictEqual(updatedItems[0].total, "100.00");
assert.strictEqual(updatedItems[1].total, "150.00");
assert.strictEqual(updatedItems[0].no, 1);
assert.strictEqual(updatedItems[1].no, 2);

const grandTotal = calculateGrandTotal(updatedItems);
assert.strictEqual(grandTotal, "250.00", "calculateGrandTotal failed");

// 2. Test Validation
const validQuotation = {
  date: "01/01/2024",
  company: {
    name: "Test Co",
    email: "test@test.com",
    address: "123 St",
    logo: "https://example.com/logo.png"
  },
  customer: { name: "Client A" },
  lineItems: [{ description: "Work", qty: 1, unitPrice: 100, total: "100.00" }],
  grandTotal: "100.00"
};

const validationResult = validateQuotation(validQuotation);
assert.strictEqual(validationResult.isValid, true, `Validation failed: ${validationResult.errors.join(', ')}`);

const invalidQuotation = { ...validQuotation, date: "2024-01-01" };
const invalidResult = validateQuotation(invalidQuotation);
assert.strictEqual(invalidResult.isValid, false, "Validation should have failed for wrong date format");

// 3. Test Operation Modes
async function testModes() {
  console.log("Testing Operation Modes...");

  // Mode A: Debug JSON (should sync totals automatically)
  const rawQuotation = {
    date: "01/01/2024",
    company: { name: "Test Co", email: "test@test.com", address: "123 St" },
    customer: { name: "Client A" },
    lineItems: [{ description: "Work", qty: 2, unitPrice: 50 }] // total and grandTotal missing/wrong
  };

  const syncedJson = await quotlyManager(rawQuotation, 'A');
  assert.strictEqual(syncedJson.lineItems[0].total, "100.00");
  assert.strictEqual(syncedJson.grandTotal, "100.00");
  console.log("Mode A passed.");

  // Mode C: Validate
  const validationC = await quotlyManager(rawQuotation, 'C');
  assert.strictEqual(validationC.isValid, true);
  console.log("Mode C passed.");

  console.log("All tests passed!");
}

testModes().catch(err => {
  console.error("Tests failed:", err);
  process.exit(1);
});
