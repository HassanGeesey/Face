# Quotly Library

Quotly is a modular React Native library for managing quotation data and generating PDFs via the [pdfgen.app](https://pdfgen.app) API.

## Features

- **Modular State Management**: Well-defined data structures for companies, customers, and line items.
- **Automatic Calculations**: Automatically calculates line item totals and grand totals.
- **Validation**: Robust validation for all input fields, including dates and URLs.
- **Offline-Ready**: Core business logic is separated from API services.
- **Operation Modes**: Supports debug JSON output, PDF generation, and pure validation.

## Directory Structure

- `src/types`: JSDoc type definitions and initial states.
- `src/utils`: Business logic for calculations and validation.
- `src/services`: API interaction services.
- `src/modes`: High-level operation modes via `quotlyManager`.
- `example`: React Native usage examples.

## Usage

```javascript
import { quotlyManager } from 'quotly';

const quotation = {
  date: "25/12/2023",
  company: {
    name: "Acme Corp",
    email: "info@acme.com",
    address: "123 Main St",
    logo: "https://example.com/logo.png"
  },
  customer: {
    name: "John Doe"
  },
  lineItems: [
    { qty: 2, unitPrice: 50, description: "Widget A" }
  ]
};

// Generate PDF (Mode B)
const pdfBlob = await quotlyManager(quotation, 'B');
```

## Testing

Run tests with:
```bash
npm test
```
or
```bash
node quotly/test.js
```
