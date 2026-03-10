import assert from 'node:assert';
import {
  calculateLineTotal,
  updateLineItemsTotals,
  calculateGrandTotal,
  calculateDetailedTotals
} from './src/utils/calculations.js';
import { validateQuotation, isValidDate } from './src/utils/validation.js';
import { quotlyManager } from './src/modes.js';
import {
  saveQuotation,
  getQuotation,
  getAllQuotations,
  deleteQuotation,
  setStorageEngine
} from './src/services/storageService.js';

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

  // Additional Stricter Validation Tests
  console.log("Testing Stricter Validation Rules...");
  const noLogo = { ...mockQuotation, company: { ...mockQuotation.company, logo: "" } };
  assert.ok(validateQuotation(noLogo).includes("Company logo URL is required."), "Logo should be required");

  const invalidLogo = { ...mockQuotation, company: { ...mockQuotation.company, logo: "not-a-url" } };
  assert.ok(validateQuotation(invalidLogo).includes("Company logo URL is invalid."), "Logo must be a valid URL");

  const negTax = { ...mockQuotation, taxRate: -5 };
  assert.ok(validateQuotation(negTax).includes("Tax rate must be a non-negative number."), "Tax rate must be non-negative");

  const negDisc = { ...mockQuotation, discount: -10 };
  assert.ok(validateQuotation(negDisc).includes("Discount must be a non-negative number."), "Discount must be non-negative");

  const badCurrency = { ...mockQuotation, currency: 123 };
  assert.ok(validateQuotation(badCurrency).includes("Currency must be a string if provided."), "Currency must be a string");

  const noMobiles = { ...mockQuotation, company: { ...mockQuotation.company, mobiles: [] } };
  assert.ok(validateQuotation(noMobiles).includes("Company must have at least one mobile number."), "Mobiles should be required");

  const noLandline = { ...mockQuotation, company: { ...mockQuotation.company, landline: "" } };
  assert.ok(validateQuotation(noLandline).includes("Company landline is required."), "Landline should be required");

  // Rounding Consistency Test
  console.log("Testing Financial Rounding Consistency...");
  const roundingQuotation = {
    ...mockQuotation,
    lineItems: [
      { qty: 1, unitPrice: 1.004, description: "Item 1" }, // Total "1.00"
      { qty: 1, unitPrice: 1.004, description: "Item 2" }  // Total "1.00"
    ],
    taxRate: 0,
    discount: 0
  };
  const roundingDetailed = calculateDetailedTotals(roundingQuotation);
  assert.strictEqual(roundingDetailed.subTotal, "2.00", "Subtotal should be sum of rounded line totals (1.00 + 1.00)");

  // 3. Storage Service
  console.log("Testing Storage Service...");
  const testId = "test-123";
  await saveQuotation(testId, mockQuotation);

  const retrieved = await getQuotation(testId);
  assert.strictEqual(retrieved.customer.name, mockQuotation.customer.name, "Retrieved quotation should match saved one");

  const all = await getAllQuotations();
  assert.ok(all.length >= 1, "getAllQuotations should return at least one item");

  await deleteQuotation(testId);
  const afterDelete = await getQuotation(testId);
  assert.strictEqual(afterDelete, null, "Quotation should be null after deletion");

  // Dependency Injection Test
  console.log("Testing Storage Engine DI...");
  let customGetCalled = false;
  const customEngine = {
    getItem: async () => { customGetCalled = true; return null; },
    setItem: async () => {},
    removeItem: async () => {},
    getAllKeys: async () => []
  };
  setStorageEngine(customEngine);
  await getQuotation("any-id");
  assert.strictEqual(customGetCalled, true, "Custom storage engine should be used after setStorageEngine");

  // Restore default for subsequent tests if any
  setStorageEngine({
    getItem: async () => null,
    setItem: async () => {},
    removeItem: async () => {},
    getAllKeys: async () => []
  });

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
