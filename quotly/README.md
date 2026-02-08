# Quotly Utility Library

A modular utility library for managing quotations and generating PDFs via [pdfgen.app](https://pdfgen.app).

## Features

- Modular data structures for quotations.
- Business logic for calculating line item totals and grand totals.
- Comprehensive validation for quotation data.
- API service for PDF generation.
- **Operation Modes** (Debug, Generate, Validate).
- ES Modules support.

## Directory Structure

```
quotly/
├── src/
│   ├── services/      # API services (PDF generation)
│   ├── utils/         # Calculations and Validation
│   ├── config.js      # Configuration (API Keys, Template IDs)
│   ├── modes.js       # Operation Modes Manager
│   └── index.js       # Main entry point
├── package.json
└── README.md
```

## Usage

### Using the Quotly Manager (Recommended)

The `quotlyManager` provides a high-level interface for different operations.

```javascript
import { quotlyManager } from './src/index.js';

const quotation = { ... };

// Mode A: Debug JSON (returns updated quotation with totals)
const debugJson = await quotlyManager('A', quotation);

// Mode B: Generate PDF (validates and returns a Blob)
const pdfBlob = await quotlyManager('B', quotation);

// Mode C: Validate (returns validation object)
const validation = await quotlyManager('C', quotation);
```

### Manual Usage

#### Calculations

```javascript
import { updateLineItemsTotals, calculateGrandTotal } from './src/index.js';

let lineItems = [
  { qty: 2, unitPrice: 50, description: "Item 1" }
];

lineItems = updateLineItemsTotals(lineItems);
const grandTotal = calculateGrandTotal(lineItems);
```

#### Validation

```javascript
import { validateQuotation } from './src/index.js';

const result = validateQuotation(quotation);
if (!result.valid) {
  console.error(result.errors);
}
```

#### PDF Generation

```javascript
import { generatePDF } from './src/index.js';

const pdfBlob = await generatePDF(quotation);
```

## Configuration

Credentials are located in `src/config.js`. It is recommended to use environment variables for sensitive keys:

- `QUOTLY_TEMPLATE_ID`
- `QUOTLY_API_KEY`
- `QUOTLY_BASE_URL`

## Testing

Run tests using:

```bash
npm test
```
or
```bash
node quotly/test.js
```
