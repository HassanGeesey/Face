/**
 * @typedef {Object} Company
 * @property {string} logo - Image URL for the company logo.
 * @property {string} name - Name of the company.
 * @property {string} email - Email address of the company.
 * @property {string} address - Physical address of the company.
 * @property {string[]} [mobiles] - List of mobile numbers.
 * @property {string} [landline] - Landline number.
 */

/**
 * @typedef {Object} Customer
 * @property {string} name - Name of the customer.
 */

/**
 * @typedef {Object} LineItem
 * @property {number} no - Item number.
 * @property {number} qty - Quantity of the item.
 * @property {string} unit - Unit of measurement (e.g., UNIT, PCS, HRS).
 * @property {number} unitPrice - Price per unit.
 * @property {string} description - Description of the item.
 * @property {string} total - Total price for the item (qty * unitPrice), as a string with 2 decimals.
 */

/**
 * @typedef {Object} Quotation
 * @property {string} date - Date of the quotation in DD/MM/YYYY format.
 * @property {Company} company - Company information.
 * @property {Customer} customer - Customer information.
 * @property {LineItem[]} lineItems - List of line items.
 * @property {number} [taxRate] - Tax rate as a percentage (0-100).
 * @property {number} [discount] - Discount amount.
 * @property {string} [subTotal] - Sub-total before tax and discount, as a string with 2 decimals.
 * @property {string} [taxAmount] - Tax amount, as a string with 2 decimals.
 * @property {string} grandTotal - Grand total after tax and discount, as a string with 2 decimals.
 * @property {string} [templateId] - Optional template ID override.
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
  taxRate: 0,
  discount: 0,
  subTotal: "0.00",
  taxAmount: "0.00",
  grandTotal: "0.00",
};
