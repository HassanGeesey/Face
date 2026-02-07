import {
  updateLineItemsTotals,
  calculateGrandTotal,
  validateQuotation
} from "./src/index.js";

const sampleQuotation = {
  date: "25/05/2024",
  company: {
    logo: "https://example.com/logo.png",
    name: "Tech Corp",
    email: "info@techcorp.com",
    address: "123 Tech Lane, Silicon Valley",
    mobiles: ["+1234567890"],
    landline: "+1098765432",
  },
  customer: {
    name: "John Doe",
  },
  lineItems: [
    {
      qty: 2,
      unit: "UNIT",
      unitPrice: 100.00,
      description: "Service A",
    },
    {
      qty: 1,
      unit: "UNIT",
      unitPrice: 50.00,
      description: "Service B",
    },
  ],
};

console.log("--- Running Quotly Tests ---");

// 1. Test Calculations
console.log("1. Testing calculations...");
const updatedItems = updateLineItemsTotals(sampleQuotation.lineItems);
const grandTotal = calculateGrandTotal(updatedItems);

if (updatedItems[0].total === "200.00" && updatedItems[1].total === "50.00" && grandTotal === "250.00") {
  console.log("✅ Calculations passed.");
} else {
  console.error("❌ Calculations failed.");
  console.error("Results:", { updatedItems, grandTotal });
  process.exit(1);
}

// 2. Test Validation
console.log("2. Testing validation...");
const quotationToValidate = {
  ...sampleQuotation,
  lineItems: updatedItems,
  grandTotal: grandTotal,
};

const validationResult = validateQuotation(quotationToValidate);
if (validationResult.isValid) {
  console.log("✅ Validation passed for valid quotation.");
} else {
  console.error("❌ Validation failed for valid quotation.");
  console.error("Errors:", validationResult.errors);
  process.exit(1);
}

// 3. Test Validation Errors
console.log("3. Testing validation errors...");
const invalidQuotation = {
  ...quotationToValidate,
  date: "2024-05-25", // Invalid format
  company: { ...quotationToValidate.company, name: "" }, // Empty name
};

const invalidResult = validateQuotation(invalidQuotation);
if (!invalidResult.isValid && invalidResult.errors.length >= 2) {
  console.log("✅ Validation correctly identified errors.");
} else {
  console.error("❌ Validation failed to identify errors.");
  console.error("Errors:", invalidResult.errors);
  process.exit(1);
}

// 4. Test Robustness (Empty/Missing objects)
console.log("4. Testing robustness...");
const emptyResult = validateQuotation({});
if (!emptyResult.isValid && emptyResult.errors.includes("Company information is required.")) {
  console.log("✅ Robustness test passed.");
} else {
  console.error("❌ Validation failed to identify errors.");
  console.error("Errors:", invalidResult.errors);
  process.exit(1);
}

console.log("--- All Tests Passed! ---");
