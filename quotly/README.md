# Quotly

A modular React Native library for generating quotation PDFs via [pdfgen.app](https://pdfgen.app).

## Features

- **Modular State**: Defined structures for Companies, Customers, and Line Items.
- **Business Logic**: Automated total calculations and item numbering.
- **Validation**: Built-in rules for data integrity, URLs, and date formats.
- **API Ready**: Easy-to-use service for PDF generation.
- **Multi-mode**: Supports Debug, Generation, and Validation modes.

## Directory Structure

- `src/types`: JSDoc type definitions and constants.
- `src/utils`: Calculation and validation logic.
- `src/services`: API service for pdfgen.app.
- `src/modes.js`: Operation mode manager.
- `example/`: React Native usage example.

## Usage

```javascript
import { quotlyManager, updateLineItemsTotals, calculateGrandTotal } from 'quotly';

const quotation = {
  // ... your quotation data
};

// Generate PDF
const pdfBlob = await quotlyManager(quotation, 'B');
```

## Configuration

Set the following environment variables if needed:
- `QUOTLY_API_KEY`
- `QUOTLY_TEMPLATE_ID`
- `QUOTLY_BASE_URL`
