import {
  updateLineItemsTotals,
  calculateGrandTotal,
  validateQuotation,
  quotlyManager
} from "./src/index.js";

const sampleCompany = {
  logo: "https://example.com/logo.png",
  name: "Tech Corp",
  email: "contact@techcorp.com",
  address: "123 Silicon Valley",
  mobiles: ["+1234567890"],
  landline: "+1098765432",
};

const sampleCustomer = {
  name: "John Doe",
};

let lineItems = [
  {
    qty: 2,
    unit: "UNIT",
    unitPrice: 50.00,
    description: "Web Development",
  },
  {
    qty: 1,
    unit: "UNIT",
    unitPrice: 100.00,
    description: "SEO Optimization",
  }
];

// 1. Update line items
lineItems = updateLineItemsTotals(lineItems);
console.log("Updated Line Items:", lineItems);

// 2. Calculate grand total
const grandTotal = calculateGrandTotal(lineItems);
console.log("Grand Total:", grandTotal);

const quotation = {
  date: "25/12/2023",
  company: sampleCompany,
  customer: sampleCustomer,
  lineItems,
  grandTotal,
};

// 3. Validate
const validation = validateQuotation(quotation);
console.log("Validation Result:", validation);

if (validation.isValid) {
  console.log("SUCCESS: Quotation is valid.");
} else {
  console.error("FAILURE: Quotation is invalid.", validation.errors);
  process.exit(1);
}

// 4. Test Manager Mode A
quotlyManager(quotation, "A").then(res => {
  console.log("Mode A Result:", res.status === "success" ? "PASS" : "FAIL");
});

// 5. Test Manager Mode C
quotlyManager(quotation, "C").then(res => {
  console.log("Mode C Result:", res.isValid ? "PASS" : "FAIL");
});

console.log("All local tests completed!");
