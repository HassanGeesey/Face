import { updateLineItemsTotals, calculateGrandTotal } from './src/utils/calculations.js';
import { validateQuotation } from './src/utils/validation.js';
import { generatePDF } from './src/services/pdfService.js';

async function runTest() {
  console.log("Starting Quotly Implementation Test...");

  const company = {
    logo: "https://example.com/logo.png",
    name: "Quotly Tech Solutions",
    email: "contact@quotlytech.com",
    address: "123 Innovation Drive, Tech City",
    mobiles: ["+1234567890", "+0987654321"],
    landline: "011-2345678",
  };

  const customer = {
    name: "John Doe",
  };

  const initialLineItems = [
    {
      qty: 2,
      unit: "HOUR",
      unitPrice: 50.00,
      description: "Consulting Services",
    },
    {
      qty: 1,
      unit: "UNIT",
      unitPrice: 1200.00,
      description: "Website Development",
    }
  ];

  console.log("Updating line item totals...");
  const lineItems = updateLineItemsTotals(initialLineItems);
  console.log("Line Items:", JSON.stringify(lineItems, null, 2));

  console.log("Calculating grand total...");
  const grandTotal = calculateGrandTotal(lineItems);
  console.log("Grand Total:", grandTotal);

  const quotation = {
    date: "25/10/2023",
    company,
    customer,
    lineItems,
    grandTotal,
  };

  try {
    console.log("Validating quotation...");
    validateQuotation(quotation);
    console.log("Validation successful.");
  } catch (error) {
    console.error("Validation failed:", error.message);
    process.exit(1);
  }

  console.log("Mode A: Debug JSON output:");
  console.log(JSON.stringify({ data: quotation }, null, 2));

  // Mode B: Call API
  console.log("Attempting to call PDF generation API...");
  try {
    const blob = await generatePDF(quotation);
    console.log("PDF generation successful. Blob size:", blob.size);
    console.log("Test passed!");
  } catch (error) {
    console.error("PDF generation failed:", error.message);
    // We don't necessarily want to fail the whole test if the API is down or keys are limited,
    // but we should know why.
  }
}

runTest().catch(err => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
