import { validateQuotation } from "./utils/validation.js";
import { generatePDF } from "./services/pdfService.js";

/**
 * Manage Quotly operations based on modes
 * @param {Object} quotation
 * @param {string} mode 'A' (Debug JSON), 'B' (Generate PDF), 'C' (Validate)
 */
export async function quotlyManager(quotation, mode = "C") {
  switch (mode) {
    case "A":
      return {
        status: "success",
        data: quotation,
      };
    case "B":
      const validationB = validateQuotation(quotation);
      if (!validationB.isValid) {
        throw new Error(`Validation failed: ${validationB.errors.join(", ")}`);
      }
      const pdfBlob = await generatePDF(quotation);
      return {
        status: "success",
        data: pdfBlob,
      };
    case "C":
      const validationC = validateQuotation(quotation);
      return {
        status: validationC.isValid ? "success" : "error",
        isValid: validationC.isValid,
        errors: validationC.errors,
      };
    default:
      throw new Error(`Invalid mode: ${mode}`);
  }
}
