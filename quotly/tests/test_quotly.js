import { defaultQuotation } from '../src/types/quotation.js';
import { updateLineItemsTotals, calculateGrandTotal } from '../src/utils/calculations.js';
import { validateQuotation } from '../src/utils/validation.js';

async function runTest() {
  console.log("--- Starting Quotly Test ---");

  // 1. Setup sample data
  const quotation = {
    ...defaultQuotation,
    date: "04/02/2025",
    company: {
      name: "Acme Corp",
      email: "info@acme.com",
      logo: "https://example.com/logo.png",
      address: "123 Main St",
      mobiles: ["555-0101"],
      landline: "555-0202",
    },
    customer: {
      name: "John Doe",
    },
    lineItems: [
      { qty: 2, unitPrice: 50.00, description: "Widget A" },
      { qty: 1, unitPrice: 150.00, description: "Gadget B" },
    ],
  };

  console.log("Initial Quotation set.");

  // 2. Update line items and grand total
  quotation.lineItems = updateLineItemsTotals(quotation.lineItems);
  quotation.grandTotal = calculateGrandTotal(quotation.lineItems);

  console.log("Totals calculated:");
  quotation.lineItems.forEach(item => {
    console.log(`  Item ${item.no}: Qty ${item.qty}, Price ${item.unitPrice}, Total ${item.total}`);
  });
  console.log(`  Grand Total: ${quotation.grandTotal}`);

  // 3. Validate
  const validationResult = validateQuotation(quotation);
  if (validationResult.valid) {
    console.log("Validation: SUCCESS");
  } else {
    console.error("Validation: FAILED", validationResult.errors);
    process.exit(1);
  }

  // 4. Output JSON (Mode A)
  console.log("--- Final Quotation JSON (Mode A) ---");
  console.log(JSON.stringify({ data: quotation }, null, 2));

  console.log("--- Test Completed Successfully ---");
}

runTest().catch(err => {
  console.error("Test failed with error:", err);
  process.exit(1);
});
