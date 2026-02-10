# Quotly Library

A modular library for managing quotations and generating PDFs via [pdfgen.app](https://pdfgen.app) for React Native applications.

## Features

- Modular state structures for quotations.
- Business logic for total calculations.
- Validation for company, customer, and line item data.
- PDF generation service.
- Multi-mode operation (Debug, Generate, Validate).

## Directory Structure

```
quotly/
├── src/
│   ├── types/         # Data structures and JSDoc typedefs
│   ├── services/      # API services (PDF generation)
│   ├── utils/         # Calculations and validation
│   ├── modes.js       # Operation mode manager
│   ├── config.js      # Configuration constants
│   └── index.js       # Main entry point
├── example/           # React Native usage example
├── test.js            # Test script
└── package.json
```

## Usage

```javascript
import {
  updateLineItemsTotals,
  calculateGrandTotal,
  quotlyManager
} from 'quotly';

// 1. Prepare data
const lineItems = [
  { qty: 2, unitPrice: 50, description: "Service A" }
];

// 2. Update totals
const itemsWithTotals = updateLineItemsTotals(lineItems);
const grandTotal = calculateGrandTotal(itemsWithTotals);

const quotation = {
  date: "25/05/2024",
  company: { ... },
  customer: { ... },
  lineItems: itemsWithTotals,
  grandTotal
};

// 3. Generate PDF
const pdfBlob = await quotlyManager(quotation, 'B');
```

## Running Tests

```bash
cd quotly
npm test
```
