# Quotly Library

Quotly is a React Native-compatible library for managing quotations and generating PDFs via the [pdfgen.app](https://pdfgen.app) API.

## Features

- Modular data structures for quotations.
- Financial calculation utilities (subtotals, tax, discounts).
- Data validation (integrity checks, format validation).
- Direct API integration for PDF generation.
- Support for multiple operation modes (Debug, Generate, Validate).

## Directory Structure

- `src/types`: JSDoc type definitions and constants.
- `src/utils`: Business logic for calculations and validation.
- `src/services`: API service for PDF generation.
- `src/modes`: High-level operation manager.
- `src/config`: Configuration management.

## Usage

### 1. Basic Calculation

```javascript
import { calculateDetailedTotals } from 'quotly';

const quotation = {
  // ... company, customer, lineItems
  taxRate: 15,
  discount: 10,
};

const updatedQuotation = calculateDetailedTotals(quotation);
console.log(updatedQuotation.grandTotal);
```

### 2. PDF Generation

```javascript
import { quotlyManager } from 'quotly';

const quotation = { ... };

// Mode B: Generate PDF
const pdfBlob = await quotlyManager(quotation, 'B');
```

### 3. Validation

```javascript
import { quotlyManager } from 'quotly';

const result = await quotlyManager(quotation, 'C');
if (result.valid) {
  console.log("Ready to send!");
} else {
  console.error("Errors:", result.errors);
}
```

## Configuration

You can configure the library via environment variables:

- `QUOTLY_TEMPLATE_ID`: Default pdfgen.app template ID.
- `QUOTLY_API_KEY`: Your pdfgen.app API key.
