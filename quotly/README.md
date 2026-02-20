# Quotly

Quotly is a React Native library for generating quotation PDFs via the [pdfgen.app](https://pdfgen.app) API.

## Features

- Modular data structures for quotations.
- Automatic calculation of line item totals and grand totals.
- Built-in validation for quotation data.
- PDF generation service.
- Multiple operation modes (Debug, Generate, Validate).

## Directory Structure

- `src/types/`: JSDoc typedefs and initial state.
- `src/services/`: API integration services.
- `src/utils/`: Business logic for calculations and validation.
- `src/modes.js`: Operation modes manager.
- `example/`: React Native usage example.

## Configuration

The library can be configured via environment variables:

- `QUOTLY_TEMPLATE_ID`: Your pdfgen.app template ID (default: `fa5790d`).
- `QUOTLY_API_KEY`: Your pdfgen.app API key (default: `lCi76rUCD3onQBnGIifE7`).
- `QUOTLY_BASE_URL`: The API base URL.

## Usage

```javascript
import { quotlyManager } from 'quotly';

const quotation = {
  date: "15/10/2023",
  company: {
    logo: "https://example.com/logo.png",
    name: "My Company",
    email: "info@example.com",
    address: "123 Street, City",
    mobiles: ["+123456789"],
  },
  customer: {
    name: "John Doe",
  },
  lineItems: [
    {
      qty: 2,
      unit: "UNIT",
      unitPrice: 50.00,
      description: "Service A",
    },
  ],
};

// Mode A: Debug JSON
const debugJson = await quotlyManager(quotation, 'A');

// Mode B: Generate PDF
const pdfBlob = await quotlyManager(quotation, 'B');

// Mode C: Validate
const validation = await quotlyManager(quotation, 'C');
```
