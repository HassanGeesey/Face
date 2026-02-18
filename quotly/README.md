# Quotly

Quotly is a lightweight React Native utility library for generating professional quotation PDFs via the [pdfgen.app](https://pdfgen.app) API.

## Features

- **Modular Data Structures**: Easy-to-use types for companies, customers, and line items.
- **Business Logic**: Built-in calculations for line totals and grand totals.
- **Validation**: Ensures all data is API-ready before submission.
- **Modes**:
  - `Mode A`: Debug JSON.
  - `Mode B`: Generate PDF (returns a Blob).
  - `Mode C`: Validate and review.

## Installation

```bash
# This is a local library, you can import it directly
import { quotlyManager } from './path/to/quotly/src/index.js';
```

## Usage

```javascript
import { quotlyManager } from 'quotly';

const quotation = {
  date: "18/02/2025",
  company: { ... },
  customer: { ... },
  lineItems: [ ... ]
};

// Generate PDF
const pdfBlob = await quotlyManager(quotation, 'B');
```

## Configuration

You can configure the API via environment variables:

- `QUOTLY_TEMPLATE_ID` (Default: `fa5790d`)
- `QUOTLY_API_KEY` (Default: `lCi76rUCD3onQBnGIifE7`)
- `QUOTLY_BASE_URL` (Default: `https://pdfgen.app/api/generate`)

## License

MIT
