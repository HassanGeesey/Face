# Quotly Library

Quotly is a modular React Native utility library for generating quotation PDFs via the [pdfgen.app](https://pdfgen.app) API.

## Features

- **Modular State Management**: Predfined data structures for Companies, Customers, and Line Items.
- **Automatic Calculations**: Automatically syncs line item totals and grand totals.
- **Validation**: Built-in validation for required fields, URLs, dates, and mathematical integrity.
- **Operation Modes**:
  - **Mode A (Debug)**: Returns the synchronized JSON object.
  - **Mode B (PDF)**: Generates and returns a PDF Blob.
  - **Mode C (Validate)**: Performs a full validation check.

## Directory Structure

```
quotly/
├── src/
│   ├── types/        # JSDoc types and constants
│   ├── services/     # API service layer (fetch)
│   ├── utils/        # Calculations and Validation
│   ├── config.js     # Centralized configuration
│   ├── modes.js      # Operation modes (quotlyManager)
│   └── index.js      # Main entry point
├── example/          # React Native usage example
├── package.json      # Library configuration (ES Modules)
└── test.js           # Integration test suite
```

## Usage

```javascript
import { quotlyManager } from './quotly/src/index.js';

const myQuotation = {
  date: "25/12/2023",
  company: { name: "My Corp", ... },
  customer: { name: "John Doe" },
  lineItems: [
    { qty: 2, unitPrice: 50, description: "Widget" }
  ]
};

// Generate PDF
const pdfBlob = await quotlyManager(myQuotation, 'B');
```

## Testing

Run the test suite using Node.js:

```bash
npm test
```
