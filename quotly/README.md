# Quotly Library

A modular React Native library for managing quotations and generating PDFs via [pdfgen.app](https://pdfgen.app).

## Features

- **Data Management**: Defined structures for Companies, Customers, and Line Items.
- **Business Logic**: Automated total calculations.
- **Validation**: Robust validation for dates, URLs, and financial integrity.
- **PDF Generation**: Direct integration with pdfgen.app API.
- **Multiple Modes**: Support for debugging (JSON), generation (PDF), and validation.

## Directory Structure

```
quotly/
├── example/          # React Native usage examples
├── src/
│   ├── services/     # API service layer
│   ├── types/        # JSDoc type definitions
│   ├── utils/        # Calculations and validation
│   ├── config.js     # Library configuration
│   ├── index.js      # Main entry point
│   └── modes.js      # Operation mode manager
├── package.json
├── README.md
└── test.js           # Integration test suite
```

## Usage

### 1. Installation

This library is designed to be used within a React Native project.

### 2. Basic Example

```javascript
import {
  updateLineItemsTotals,
  calculateGrandTotal,
  quotlyManager
} from './quotly/src';

const quotation = {
  date: "25/12/2024",
  company: { /* ... */ },
  customer: { /* ... */ },
  lineItems: [
    { qty: 2, unitPrice: 50, description: "Consulting" }
  ]
};

// Update totals
quotation.lineItems = updateLineItemsTotals(quotation.lineItems);
quotation.grandTotal = calculateGrandTotal(quotation.lineItems);

// Generate PDF
const pdfBlob = await quotlyManager(quotation, 'B');
```

## Testing

Run the local test suite using Node.js:

```bash
cd quotly
npm test
```

## Environment Variables

- `QUOTLY_TEMPLATE_ID`: Your pdfgen.app template ID.
- `QUOTLY_API_KEY`: Your pdfgen.app API key.
- `QUOTLY_BASE_URL`: API base URL (default: https://pdfgen.app).
