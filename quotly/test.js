import {
  calculateLineTotal,
  updateLineItemsTotals,
  calculateGrandTotal,
  validateQuotation,
} from "./src/index.js";

const mockCompany = {
  logo: "https://example.com/logo.png",
  name: "Test Company",
  email: "test@example.com",
  address: "123 Test St",
  mobiles: ["1234567890"],
  landline: "0987654321",
};

const mockCustomer = {
  name: "Test Customer",
};

const mockLineItems = [
  {
    qty: 2,
    unitPrice: 50,
    description: "Item 1",
  },
  {
    qty: 1,
    unitPrice: 100,
    description: "Item 2",
  },
];

function testCalculations() {
  console.log("Testing calculations...");
  const updatedItems = updateLineItemsTotals(mockLineItems);

  if (updatedItems[0].total !== "100.00") throw new Error(`Item 1 total failed: expected 100.00, got ${updatedItems[0].total}`);
  if (updatedItems[1].total !== "100.00") throw new Error(`Item 2 total failed: expected 100.00, got ${updatedItems[1].total}`);
  if (updatedItems[0].no !== 1) throw new Error(`Item 1 index failed`);

  const grandTotal = calculateGrandTotal(updatedItems);
  if (grandTotal !== "200.00") throw new Error(`Grand total failed: expected 200.00, got ${grandTotal}`);

  console.log("Calculations pass!");
  return { updatedItems, grandTotal };
}

function testValidation() {
  console.log("Testing validation...");

  const { updatedItems, grandTotal } = testCalculations();

  const quotation = {
    date: "25/12/2023",
    company: mockCompany,
    customer: mockCustomer,
    lineItems: updatedItems,
    grandTotal,
  };

  const result = validateQuotation(quotation);
  if (!result.valid) {
    console.error("Validation failed with errors:", result.errors);
    throw new Error("Validation should have passed");
  }

  // Test failure case
  const invalidQuotation = { ...quotation, date: "invalid-date" };
  const invalidResult = validateQuotation(invalidQuotation);
  if (invalidResult.valid) {
    throw new Error("Validation should have failed for invalid date");
  }
  console.log("Validation failure case detected correctly:", invalidResult.errors[0]);

  // Test integrity check failure
  const integrityFailQuotation = { ...quotation, grandTotal: "999.99" };
  const integrityResult = validateQuotation(integrityFailQuotation);
  if (integrityResult.valid || !integrityResult.errors.some(e => e.includes("integrity check failed"))) {
    throw new Error("Validation should have failed for integrity check");
  }
  console.log("Integrity check failure detected correctly:", integrityResult.errors[0]);

  console.log("Validation pass!");
}

try {
  testCalculations();
  testValidation();
  console.log("All local tests passed!");
} catch (error) {
  console.error("Test failed:", error.message);
  process.exit(1);
}
