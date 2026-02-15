# Quotly

Quotation generation library for React Native.

## Features
- **Modular Data Structure**: Defined types for Company, Customer, and Line Items.
- **Automatic Calculations**: Utilities to update totals and calculate grand totals.
- **API Integration**: Ready-to-use service for `pdfgen.app`.
- **Validation**: Robust validation including date formats and total integrity checks.
- **Operation Modes**:
  - **Mode A**: Debug JSON.
  - **Mode B**: Generate PDF via API.
  - **Mode C**: Validate and Review.

## Directory Structure
- `src/types`: JSDoc typedefs and constants.
- `src/services`: API service logic.
- `src/utils`: Pure functions for logic and validation.
- `src/modes.js`: Manager for different library operations.
- `example/`: React Native example component.

## Usage
Refer to `quotly/example/QuotationView.js` for a complete implementation example.

### Quick Start
```javascript
import { updateLineItemsTotals, calculateGrandTotal, quotlyManager } from 'quotly';

const quotation = { ... };
const updatedQuotation = {
  ...quotation,
  lineItems: updateLineItemsTotals(quotation.lineItems),
  grandTotal: calculateGrandTotal(quotation.lineItems)
};

// Generate PDF
const pdfBlob = await quotlyManager(updatedQuotation, 'B');
```

## Testing
Run the local test suite:
```bash
cd quotly
npm test
```
