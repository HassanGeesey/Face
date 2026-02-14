# Quotly Library

Quotly is a modular React Native utility for managing quotation data and generating PDFs via [pdfgen.app](https://pdfgen.app).

## Features

- **Modular Data Structure**: Clean separation of company, customer, and line items.
- **Business Logic**: Automated total calculations for line items and grand totals.
- **Validation**: Built-in validation for required fields, URL formats, and date formats.
- **PDF Generation**: Direct integration with pdfgen.app API.
- **Multiple Modes**: Support for debugging, generation, and validation.

## Directory Structure

- `src/types/`: JSDoc type definitions and initial states.
- `src/utils/`: Calculation and validation logic.
- `src/services/`: API communication (fetch-based).
- `src/modes.js`: Operation manager (Mode A, B, C).
- `src/index.js`: Main entry point.

## Usage

### 1. Initialize Quotation
```javascript
import { EMPTY_QUOTATION, updateLineItemsTotals, calculateGrandTotal } from 'quotly';

let myQuotation = { ...EMPTY_QUOTATION, date: '25/12/2023' };
```

### 2. Update Totals
```javascript
myQuotation.lineItems = updateLineItemsTotals([
  { qty: 2, unitPrice: 50, description: 'Service A' }
]);
myQuotation.grandTotal = calculateGrandTotal(myQuotation.lineItems);
```

### 3. Generate PDF
```javascript
import { quotlyManager } from 'quotly';

// Mode B: Generate PDF
try {
  const pdfBlob = await quotlyManager(myQuotation, 'B');
  // Handle blob (save to file or share)
} catch (error) {
  console.error(error);
}
```

## Configuration

Environment variables can be used to override defaults:
- `QUOTLY_TEMPLATE_ID` (Default: `fa5790d`)
- `QUOTLY_API_KEY` (Default: `lCi76rUCD3onQBnGIifE7`)
- `QUOTLY_BASE_URL` (Default: `https://pdfgen.app/api/generate`)
