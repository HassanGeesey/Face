import { validateQuotation } from '../src/utils/validation.js';

function testValidationFailures() {
  console.log("--- Testing Validation Failures ---");

  const invalidQuotation = {
    date: "2025-02-04", // Wrong format
    company: { name: "", email: "" },
    customer: { name: "" },
    lineItems: [
      { qty: 0, unitPrice: -10 }
    ],
  };

  const result = validateQuotation(invalidQuotation);
  console.log("Validation Errors Found:", result.errors.length);
  result.errors.forEach(err => console.log(" - " + err));

  if (result.errors.length >= 5) {
    console.log("Validation Failure Test: SUCCESS");
  } else {
    console.error("Validation Failure Test: FAILED (Expected at least 5 errors)");
    process.exit(1);
  }
}

testValidationFailures();
