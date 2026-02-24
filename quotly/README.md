# Quotly

Quotly is a modular React Native library for generating professional quotation PDFs via the [pdfgen.app](https://pdfgen.app) API.

## Features

- **Modular Architecture**: Separated types, business logic, and API services.
- **Offline-Ready**: Pure business logic for calculations and validation.
- **Data Integrity**: Automatic recalculation of totals to ensure consistency.
- **Multi-Mode Operation**:
  - **Mode A (Debug JSON)**: Review the final quotation data before sending.
  - **Mode B (Generate PDF)**: Send data to the API and receive a PDF blob.
  - **Mode C (Validate)**: Perform integrity checks and validation.

## Directory Structure

```text
quotly/
├── src/
│   ├── types/         # JSDoc typedefs and constants
│   ├── utils/         # Calculation logic
│   ├── services/      # API communication
│   ├── config.js      # Environment configuration
│   ├── modes.js       # Operation mode manager
│   └── index.js       # Library entry point
├── example/           # React Native usage example
└── test.js            # Integration tests
```

## Usage

```javascript
import { quotlyManager } from 'quotly';

const quotation = {
  date: "25/05/2024",
  company: {
    name: "My Company",
    email: "info@mycompany.com",
    address: "123 Business Rd",
    logo: "https://example.com/logo.png"
  },
  customer: { name: "John Doe" },
  lineItems: [
    { qty: 2, unitPrice: 50, description: "Consulting", unit: "HRS" }
  ],
  taxRate: 15
};

// Mode A: Get recalculated JSON
const debugData = await quotlyManager(quotation, 'A');

// Mode B: Generate PDF
const pdfBlob = await quotlyManager(quotation, 'B');

// Mode C: Validate integrity
const report = await quotlyManager(quotation, 'C');
```

## Configuration

You can configure the API Key and Template ID via environment variables or options:

- `QUOTLY_API_KEY`
- `QUOTLY_TEMPLATE_ID`

Or pass them in the options object:
```javascript
await quotlyManager(quotation, 'B', { apiKey: '...', templateId: '...' });
```
