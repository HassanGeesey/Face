import assert from 'node:assert';
import {
  calculateLineTotal,
  updateLineItemsTotals,
  calculateGrandTotal,
  calculateDetailedTotals
} from './src/utils/calculations.js';
import { validateQuotation, isValidDate } from './src/utils/validation.js';
import {
  saveQuotation,
  getQuotation,
  deleteQuotation,
  getAllQuotations,
  setStorageEngine
} from './src/services/storageService.js';
import { quotlyManager } from './src/modes.js';

// Mock data for testing
const mockQuotation = {
  date: "25/12/2023",
  company: {
    logo: "https://example.com/logo.png",
    name: "Test Company",
    email: "test@example.com",
    address: "123 Test St",
    mobiles: ["1234567890"],
    landline: "0987654321",
  },
  customer: {
    name: "John Doe",
  },
  lineItems: [
    { qty: 2, unitPrice: 50.00, description: "Item 1" },
    { qty: 1, unitPrice: 100.00, description: "Item 2" }
  ],
  taxRate: 10,
  discount: 20,
  grandTotal: "198.00" // (200 - 20) * 1.1 = 180 * 1.1 = 198
};

async function runTests() {
  console.log("🚀 Starting Quotly Integration Tests...");

  // 1. Calculations Utility
  console.log("Testing Calculations...");
  assert.strictEqual(calculateLineTotal({ qty: 5, unitPrice: 10.5 }), "52.50");
  assert.strictEqual(calculateLineTotal({ qty: 0, unitPrice: 10 }), "0.00");

  const updatedItems = updateLineItemsTotals([{ qty: 2, unitPrice: 25, description: "Test" }]);
  assert.strictEqual(updatedItems[0].no, 1);
  assert.strictEqual(updatedItems[0].total, "50.00");

  assert.strictEqual(calculateGrandTotal(updatedItems), "50.00");

  const detailed = calculateDetailedTotals(mockQuotation);
  assert.strictEqual(detailed.subTotal, "200.00");
  assert.strictEqual(detailed.taxAmount, "18.00");
  assert.strictEqual(detailed.grandTotal, "198.00");

  // 2. Validation Utility
  console.log("Testing Validation...");
  assert.strictEqual(isValidDate("25/12/2023"), true);
  assert.strictEqual(isValidDate("31/02/2023"), false); // Invalid day for February
  assert.strictEqual(isValidDate("abcd"), false);

  const errors = validateQuotation(mockQuotation);
  assert.strictEqual(errors.length, 0, "Valid quotation should have no errors");

  const invalidQuotation = { ...mockQuotation, date: "2023-12-25" };
  const invalidErrors = validateQuotation(invalidQuotation);
  assert.ok(invalidErrors.length > 0, "Invalid date format should trigger error");

  // 3. Mode Orchestration (Manager)
  console.log("Testing Quotly Manager Modes...");

  // Mode A: Debug JSON
  const modeA = await quotlyManager(mockQuotation, 'A');
  assert.strictEqual(modeA.grandTotal, "198.00");
  assert.strictEqual(modeA.lineItems.length, 2);
  assert.strictEqual(modeA.subTotal, "200.00");

  // Mode C: Validate & Review
  const modeC = await quotlyManager(mockQuotation, 'C');
  assert.strictEqual(modeC.isValid, true);
  assert.strictEqual(modeC.integrityCheck, true);
  assert.strictEqual(modeC.recalculatedTotals.grandTotal, "198.00");

  // Integrity Failure Case
  const tamperedQuotation = { ...mockQuotation, grandTotal: "500.00" };
  const tamperedResult = await quotlyManager(tamperedQuotation, 'C');
  assert.strictEqual(tamperedResult.integrityCheck, false, "Integrity check should fail if totals don't match");

  // 4. Storage Service Tests
  console.log("Testing Storage Service (Volatile Default)...");
  const testId = "test-123";
  await saveQuotation(testId, mockQuotation);
  const retrieved = await getQuotation(testId);
  assert.deepStrictEqual(retrieved, mockQuotation);

  const all = await getAllQuotations();
  assert.ok(all.some(q => q.customer.name === mockQuotation.customer.name));

  await deleteQuotation(testId);
  const deleted = await getQuotation(testId);
  assert.strictEqual(deleted, null);

  console.log("Testing Storage Service Dependency Injection...");
  const mockStorage = {
    data: {},
    async getItem(key) { return this.data[key]; },
    async setItem(key, val) { this.data[key] = val; },
    async removeItem(key) { delete this.data[key]; },
    async getAllKeys() { return Object.keys(this.data); }
  };

  setStorageEngine(mockStorage);
  await saveQuotation("di-test", { title: "DI Work" });
  assert.ok(mockStorage.data["@quotly_quotation_di-test"]);

  console.log("Testing New Validation Rules...");
  const invalidTax = { ...mockQuotation, taxRate: -5 };
  assert.ok(validateQuotation(invalidTax).includes("Tax rate must be a non-negative number."));

  const invalidDiscount = { ...mockQuotation, discount: "not-a-number" };
  assert.ok(validateQuotation(invalidDiscount).includes("Discount must be a non-negative number."));

  const invalidCurrency = { ...mockQuotation, currency: 123 };
  assert.ok(validateQuotation(invalidCurrency).includes("Currency must be a string."));

  console.log("✅ All tests passed successfully!");
}

runTests().catch(err => {
  console.error("❌ Test suite failed:", err);
  process.exit(1);
});
