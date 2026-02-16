import assert from 'node:assert';
import {
  calculateLineTotal,
  updateLineItemsTotals,
  calculateGrandTotal,
  validateQuotation,
  quotlyManager
} from './src/index.js';

const mockQuotation = {
  date: "12/05/2024",
  company: {
    logo: "https://example.com/logo.png",
    name: "Acme Corp",
    email: "info@acme.com",
    address: "123 Main St",
    mobiles: ["555-0101"],
    landline: "555-0102",
  },
  customer: {
    name: "John Doe",
  },
  lineItems: [
    {
      no: 1,
      qty: 2,
      unit: "UNIT",
      unitPrice: 50,
      description: "Service A",
      total: "100.00",
    },
    {
      no: 2,
      qty: 1,
      unit: "UNIT",
      unitPrice: 25.50,
      description: "Service B",
      total: "25.50",
    }
  ],
  grandTotal: "125.50",
};

async function runTests() {
  console.log("Running Quotly tests...");

  // Test calculations
  const item = { qty: 3, unitPrice: 10 };
  assert.strictEqual(calculateLineTotal(item), "30.00", "calculateLineTotal failed");

  const updatedItems = updateLineItemsTotals([{ qty: 2, unitPrice: 20 }, { qty: 1, unitPrice: 5 }]);
  assert.strictEqual(updatedItems[0].total, "40.00");
  assert.strictEqual(updatedItems[0].no, 1);
  assert.strictEqual(updatedItems[1].total, "5.00");
  assert.strictEqual(updatedItems[1].no, 2);

  assert.strictEqual(calculateGrandTotal(updatedItems), "45.00", "calculateGrandTotal failed");

  // Test validation
  const validResult = validateQuotation(mockQuotation);
  assert.strictEqual(validResult.isValid, true, "Valid quotation failed validation: " + validResult.errors.join(", "));

  const invalidQuotation = { ...mockQuotation, date: "2024-05-12", grandTotal: "0.00" };
  const invalidResult = validateQuotation(invalidQuotation);
  assert.strictEqual(invalidResult.isValid, false, "Invalid quotation passed validation");
  assert.ok(invalidResult.errors.some(e => e.includes("Date must be")), "Missing date error");
  assert.ok(invalidResult.errors.some(e => e.includes("Grand total mismatch")), "Missing total mismatch error");

  // Test modes
  const modeAResult = await quotlyManager(mockQuotation, 'A');
  assert.deepStrictEqual(modeAResult, mockQuotation, "Mode A failed");

  const modeCResult = await quotlyManager(mockQuotation, 'C');
  assert.strictEqual(modeCResult.isValid, true, "Mode C failed");

  console.log("All tests passed!");
}

runTests().catch(err => {
  console.error("Tests failed:", err);
  process.exit(1);
});
