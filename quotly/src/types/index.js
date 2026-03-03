/**
 * @typedef {Object} Company
 * @property {string} logo - URL for the company logo.
 * @property {string} name - Name of the company.
 * @property {string} email - Email address.
 * @property {string} address - Physical address.
 * @property {string[]} mobiles - List of mobile phone numbers.
 * @property {string} landline - Landline phone number.
 */

/**
 * @typedef {Object} Customer
 * @property {string} name - Name of the customer.
 */

/**
 * @typedef {Object} LineItem
 * @property {number} no - Item number (index + 1).
 * @property {number} qty - Quantity.
 * @property {string} unit - Unit of measurement (e.g., 'UNIT').
 * @property {number} unitPrice - Price per unit.
 * @property {string} description - Item description.
 * @property {string} total - Calculated total for this item (qty * unitPrice).
 */

/**
 * @typedef {Object} Quotation
 * @property {string} date - Date in DD/MM/YYYY format.
 * @property {Company} company - Company info.
 * @property {Customer} customer - Customer info.
 * @property {LineItem[]} lineItems - List of items.
 * @property {string} grandTotal - Sum of all lineItems.total.
 * @property {number} [taxRate] - Optional tax rate (percentage).
 * @property {string} [taxAmount] - Optional calculated tax amount.
 * @property {number} [discount] - Optional fixed discount amount.
 * @property {string} [subTotal] - Optional subtotal before tax and discount.
 * @property {string} [templateId] - Optional template override.
 * @property {string} [currency] - Optional currency (e.g., 'USD').
 */

/**
 * Constant for an empty quotation.
 * @type {Quotation}
 */
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
  lineItems: [],
  grandTotal: "0.00",
};
