/**
 * @typedef {Object} Company
 * @property {string} logo - Image URL for the company logo.
 * @property {string} name - Company name.
 * @property {string} email - Company email address.
 * @property {string} address - Company physical address.
 * @property {string[]} mobiles - List of mobile phone numbers.
 * @property {string} [landline] - Landline phone number.
 */

/**
 * @typedef {Object} Customer
 * @property {string} name - Customer name.
 */

/**
 * @typedef {Object} LineItem
 * @property {number} no - Item number (1-based).
 * @property {number} qty - Quantity.
 * @property {string} unit - Unit of measure (e.g., "UNIT").
 * @property {number} unitPrice - Price per unit.
 * @property {string} description - Item description.
 * @property {string} total - Total price for the item (qty * unitPrice), formatted as a string with 2 decimals.
 */

/**
 * @typedef {Object} Quotation
 * @property {string} date - Date in DD/MM/YYYY format.
 * @property {Company} company - Company information.
 * @property {Customer} customer - Customer information.
 * @property {LineItem[]} lineItems - List of line items.
 * @property {string} grandTotal - Sum of all line item totals, formatted as a string with 2 decimals.
 */

/** @type {Quotation} */
export const EMPTY_QUOTATION = {
  date: "",
  company: {
    logo: "",
    name: "",
    email: "",
    address: "",
    mobiles: [],
    landline: "",
  },
  customer: {
    name: "",
  },
  lineItems: [
    {
      no: 1,
      qty: 0,
      unit: "UNIT",
      unitPrice: 0,
      description: "",
      total: "0.00",
    },
  ],
  grandTotal: "0.00",
};
