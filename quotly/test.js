import assert from 'node:assert';
import {
  calculateLineTotal,
  updateLineItemsTotals,
  calculateGrandTotal,
  calculateDetailedTotals
} from './src/utils/calculations.js';
import { validateQuotation, isValidDate } from './src/utils/validation.js';
import { quotlyManager } from './src/modes.js';
import { storageService, setStorageEngine } from './src/services/storageService.js';

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

  console.log("Testing New Validation Rules...");
  // Test: Logo is now required
  const noLogoQuotation = { ...mockQuotation, company: { ...mockQuotation.company, logo: "" } };
  const noLogoErrors = validateQuotation(noLogoQuotation);
  assert.ok(noLogoErrors.includes("Company logo is required."));

  // Test: Tax rate must be non-negative
  const negTaxQuotation = { ...mockQuotation, taxRate: -5 };
  const negTaxErrors = validateQuotation(negTaxQuotation);
  assert.ok(negTaxErrors.includes("Tax rate must be a non-negative number."));

  // Test: Discount must be non-negative
  const negDiscountQuotation = { ...mockQuotation, discount: -10 };
  const negDiscountErrors = validateQuotation(negDiscountQuotation);
  assert.ok(negDiscountErrors.includes("Discount must be a non-negative number."));

  // Test: Currency must be a string
  const invalidCurrencyQuotation = { ...mockQuotation, currency: 123 };
  const invalidCurrencyErrors = validateQuotation(invalidCurrencyQuotation);
  assert.ok(invalidCurrencyErrors.includes("Currency must be a string."));

  // 3. Storage Service
  console.log("Testing Storage Service...");
  // Use default memory fallback
  await storageService.saveQuotation("test_1", mockQuotation);
  const retrieved = await storageService.getQuotation("test_1");
  assert.strictEqual(retrieved.grandTotal, mockQuotation.grandTotal);

  const all = await storageService.getAllQuotations();
  assert.ok(all.length >= 1);
  assert.ok(all.some(q => q.customer.name === "John Doe"));

  await storageService.deleteQuotation("test_1");
  const deleted = await storageService.getQuotation("test_1");
  assert.strictEqual(deleted, null);

  // Test Dependency Injection
  let mockEngineCalled = false;
  const mockEngine = {
    async setItem(key, val) { mockEngineCalled = true; },
    async getItem(key) { return null; },
    async removeItem(key) {},
    async getAllKeys() { return []; }
  };
  setStorageEngine(mockEngine);
  await storageService.saveQuotation("test_inject", mockQuotation);
  assert.strictEqual(mockEngineCalled, true, "Custom storage engine should have been called");

  // 4. Mode Orchestration (Manager)
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

  console.log("✅ All tests passed successfully!");
}

runTests().catch(err => {
  console.error("❌ Test suite failed:", err);
  process.exit(1);
});
