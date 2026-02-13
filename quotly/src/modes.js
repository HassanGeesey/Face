import { validateQuotation } from "./utils/validation.js";
import { generatePDF } from "./services/pdfService.js";

/**
 * Main manager for Quotly operations
 * @param {Object} quotation
 * @param {string} mode - 'A' (Debug JSON), 'B' (Generate PDF), 'C' (Validate)
 * @returns {Promise<any>}
 */
export async function quotlyManager(quotation, mode = "C") {
  switch (mode) {
    case "A": // Mode A: Return JSON for debugging.
      return JSON.stringify(quotation, null, 2);

    case "B": // Mode B: Call API to generate PDF and return file.
      const validation = validateQuotation(quotation);
      if (!validation.valid) {
        throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
      }
      return await generatePDF(quotation);

    case "C": // Mode C: Validate & review totals, line items, errors.
    default:
      return validateQuotation(quotation);
  }
}
