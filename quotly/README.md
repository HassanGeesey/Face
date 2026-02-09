# Quotly Utility Library

A modular JavaScript library for managing quotation data, calculating totals, validating inputs, and generating PDFs via the pdfgen.app API. Designed for React Native environments.

## Directory Structure

- `src/utils/calculations.js`: Business logic for line item and grand totals.
- `src/utils/validation.js`: Validation rules for quotation data integrity.
- `src/services/pdfService.js`: API service for PDF generation.
- `src/modes.js`: Manager for different operation modes (Debug, Generate, Validate).
- `src/config.js`: Centralized configuration.

## Features

- **Total Calculations**: Automatically updates line item totals and grand totals.
- **Validation**: Ensures all required fields are present and totals are mathematically correct.
- **API Integration**: Ready-to-use service for pdfgen.app.
- **Operation Modes**:
  - Mode A: Debug JSON
  - Mode B: Generate PDF (returns Blob)
  - Mode C: Validate only

## Usage

```javascript
import {
  updateLineItemsTotals,
  calculateGrandTotal,
  quotlyManager
} from './src/index.js';

let quotation = { ... };
quotation.lineItems = updateLineItemsTotals(quotation.lineItems);
quotation.grandTotal = calculateGrandTotal(quotation.lineItems);

const result = await quotlyManager(quotation, 'B');
// result.data will be the PDF Blob
```

## Testing

Run `npm test` from the `quotly` directory.
