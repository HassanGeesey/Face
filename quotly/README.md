# Quotly — React Native PDF Generator

Quotly is a lightweight, modular library for managing quotations and generating PDF documents via the [pdfgen.app](https://pdfgen.app) API in React Native applications.

## Features
- **Modular Data Structures**: Well-defined types for Companies, Customers, Line Items, and Quotations.
- **Financial Calculations**: Automatic calculation of line item totals, subtotals, tax, and grand totals.
- **Validation**: Built-in rules for ensuring data integrity (URLs, dates, required fields, and logo presence).
- **Multiple Modes**: Support for debugging JSON, PDF generation, and detailed validation reviews.
- **Offline Storage**: Built-in service for saving and managing quotations locally with Dependency Injection support.
- **React Native Ready**: Safe environment variable handling, compatible with standard fetch API, and includes a React Native example component.

## Project Structure
- `src/types/index.js`: JSDoc type definitions and constants.
- `src/utils/calculations.js`: Business logic for financial totals.
- `src/utils/validation.js`: Input validation rules.
- `src/services/pdfService.js`: API integration for PDF generation.
- `src/modes.js`: Operation mode orchestrator (`quotlyManager`).
- `src/config.js`: Centralized configuration.

## Usage

### 1. Basic Calculation
```javascript
import { updateLineItemsTotals, calculateGrandTotal } from 'quotly';

const items = [
  { qty: 2, unitPrice: 50, description: "Item 1" }
];

const updatedItems = updateLineItemsTotals(items);
const grandTotal = calculateGrandTotal(updatedItems);
// grandTotal: "100.00"
```

### 2. Using the Manager (Modes)
```javascript
import { quotlyManager } from 'quotly';

const quotation = { /* ... your quotation data ... */ };

// Mode A: Debug JSON
const debugData = await quotlyManager(quotation, 'A');

// Mode B: Generate PDF (returns Blob)
const pdfBlob = await quotlyManager(quotation, 'B');

// Mode C: Validate & Review
const report = await quotlyManager(quotation, 'C');
```

### 3. Offline Storage
```javascript
import { storageService, setStorageEngine } from 'quotly';

// Optional: Inject AsyncStorage (React Native)
// setStorageEngine(AsyncStorage);

await storageService.saveQuotation(quotation);
const allQuotations = await storageService.getAllQuotations();
```

## Configuration
You can override the default API Key and Template ID via environment variables or runtime options:
- `QUOTLY_API_KEY`
- `QUOTLY_TEMPLATE_ID`

## Testing
Run the integrated test suite:
```bash
npm test
```
