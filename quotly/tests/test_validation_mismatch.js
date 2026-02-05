import { validateQuotation } from './src/utils/validation.js';

const quotation = {
  date: "25/10/2023",
  company: {
    logo: "https://example.com/logo.png",
    name: "Test",
    email: "test@test.com",
    address: "Test",
    mobiles: ["123"],
    landline: "123",
  },
  customer: { name: "Test" },
  lineItems: [{ qty: 1, unitPrice: 100, total: "100.00", description: "Test" }],
  grandTotal: "200.00", // Wrong total
};

try {
  validateQuotation(quotation);
  console.log("Validation should have failed!");
  process.exit(1);
} catch (error) {
  console.log("Validation failed as expected:", error.message);
}
