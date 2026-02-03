import { Quotly } from './src/index.js';

async function runTest() {
  console.log("--- Testing Quotly Module (Improved) ---\n");

  // 1. Partial Initialization
  console.log("Step 1: Partial Initialization (Ensuring no crash and deep merge)");
  const quotly = new Quotly({ customer: { name: "Alice" } });
  console.log("Customer Name:", quotly.quotation.customer.name);
  console.log("Company Name (should be default):", quotly.quotation.company.name);
  console.log("\n");

  // 2. Deep Update
  console.log("Step 2: Deep Update (Updating only company name)");
  quotly.updateData({ company: { name: "New Company" } });
  console.log("Company Name:", quotly.quotation.company.name);
  console.log("Company Email (should still be default):", quotly.quotation.company.email);
  console.log("\n");

  // 3. Mode C: Validation with partial data
  console.log("Step 3: Validation with partial data (Mode C)");
  const validation = quotly.validate();
  console.log("Valid:", validation.valid);
  console.log("Errors count:", validation.errors.length);
  console.log("\n");

  // 4. Mode A: JSON
  console.log("Step 4: JSON Output (Mode A)");
  // console.log(quotly.getJSON()); // Commented out to reduce output verbosity in logs unless needed
  console.log("JSON generated successfully.");
  console.log("\n");

  // 5. Full Data Update
  console.log("Step 5: Updating with full valid data...");
  quotly.updateData({
    date: "20/05/2024",
    company: {
      logo: "https://example.com/logo.png",
      name: "Acme Corp",
      email: "contact@acme.com",
      address: "456 Oak St",
    },
    lineItems: [
      { qty: 5, unitPrice: 20, description: "Product A" }
    ]
  });

  const finalValidation = quotly.validate();
  console.log("Final Validation Valid:", finalValidation.valid);
  console.log("Grand Total:", quotly.quotation.grandTotal);
  console.log("\n");

  // 6. Mode B: API Call
  console.log("Step 6: Generate PDF (Mode B)");
  try {
    const blob = await quotly.generate();
    console.log("Successfully generated PDF Blob!");
  } catch (error) {
    console.error("PDF generation failed:", error.message);
  }
}

runTest().catch(err => console.error("Test failed:", err));
