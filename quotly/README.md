# Quotly Library

Quotly is a React Native-ready library for managing quotation data and generating PDFs via the [pdfgen.app](https://pdfgen.app) API.

## Features

- **Modular State Management**: Clean data structures for companies, customers, and line items.
- **Auto-Calculations**: Automatic synchronization of line item totals and grand totals.
- **Validation**: Strict validation for required fields, date formats, and numeric constraints.
- **Multiple Modes**:
  - **Mode A (Debug)**: Returns the processed JSON.
  - **Mode B (Production)**: Generates and returns the PDF file (as a Blob).
  - **Mode C (Review)**: Comprehensive validation and integrity check.
- **Offline Ready**: Core logic is pure JavaScript and works offline.

## Directory Structure

```text
quotly/
├── src/
│   ├── types/         # JSDoc definitions & constants
│   ├── utils/         # Calculations & validation logic
│   ├── services/      # API integration (pdfgen.app)
│   ├── config.js      # Global configuration
│   ├── modes.js       # Operation mode manager
│   └── index.js       # Library entry point
├── example/           # React Native example component
├── test.js            # Integration test suite
└── package.json
```

## Usage

```javascript
import { quotlyManager } from './quotly/src/index.js';

const quotation = {
  date: '25/10/2023',
  company: { ... },
  customer: { ... },
  lineItems: [ ... ],
};

// Generate PDF
const pdfBlob = await quotlyManager(quotation, 'B');
```

## Configuration

Set the following environment variables if you want to override the defaults:

- `QUOTLY_TEMPLATE_ID`: Your pdfgen.app template ID.
- `QUOTLY_API_KEY`: Your pdfgen.app API key.
- `QUOTLY_BASE_URL`: API endpoint (default: https://pdfgen.app/api/generate).

## Development

Run tests:
```bash
cd quotly
npm test
```
