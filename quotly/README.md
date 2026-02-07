# Quotly Utility Library

Modular utility library for the Quotly React Native app.

## Features

- **Calculations**: Automatically update line item totals and calculate grand totals.
- **Validation**: Ensure all required fields are present and data integrity is maintained.
- **PDF Generation**: Interface with `pdfgen.app` API to generate quotation PDFs.

## Directory Structure

- `src/config.js`: API configuration (Template ID, API Key).
- `src/utils/calculations.js`: Business logic for totals.
- `src/utils/validation.js`: Validation rules for quotations.
- `src/services/pdfService.js`: API communication service.
- `src/index.js`: Main entry point.

## Usage

```javascript
import {
  updateLineItemsTotals,
  calculateGrandTotal,
  validateQuotation,
  generatePDF
} from './src/index.js';

// 1. Prepare quotation data
let quotation = { ... };

// 2. Update totals
quotation.lineItems = updateLineItemsTotals(quotation.lineItems);
quotation.grandTotal = calculateGrandTotal(quotation.lineItems);

// 3. Validate
const validation = validateQuotation(quotation);
if (!validation.isValid) {
  console.error(validation.errors);
} else {
  // 4. Generate PDF
  const pdfBlob = await generatePDF(quotation);
}
```

## Testing

Run tests using:
```bash
npm test
```
