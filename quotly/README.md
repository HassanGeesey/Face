# Quotly Library

Quotly is a React Native modular library for managing quotations and generating PDF reports via [pdfgen.app](https://pdfgen.app).

## Features

- **Modular State Management**: Clean data structures for companies, customers, and line items.
- **Automated Calculations**: Easy functions to update line item totals and grand totals.
- **Validation**: Built-in validation for required fields, date formats, and financial integrity.
- **PDF Generation**: Direct integration with pdfgen.app API.
- **Offline Ready**: Business logic is separated from network calls.

## Directory Structure

- `src/types/`: JSDoc typedefs and initial states.
- `src/services/`: Asynchronous services (API calls).
- `src/utils/`: Pure business logic (calculations, validation).
- `src/modes.js`: Operation modes (Debug, Generate, Validate).
- `src/config.js`: Centralized configuration.

## Usage

### 1. Update Totals
```javascript
import { updateLineItemsTotals, calculateGrandTotal } from 'quotly';

const updatedItems = updateLineItemsTotals(quotation.lineItems);
const grandTotal = calculateGrandTotal(updatedItems);
```

### 2. Generate PDF (Mode B)
```javascript
import { quotlyManager } from 'quotly';

const pdfBlob = await quotlyManager(quotation, 'B');
```

## Testing

Run tests using:
```bash
npm test
```
or
```bash
node test.js
```
