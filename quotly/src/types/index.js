/**
 * @typedef {Object} Company
 * @property {string} logo - URL of the company logo
 * @property {string} name - Name of the company
 * @property {string} email - Contact email
 * @property {string} address - Physical address
 * @property {string[]} mobiles - Mobile phone numbers
 * @property {string} [landline] - Landline phone number
 */

/**
 * @typedef {Object} Customer
 * @property {string} name - Name of the customer
 * @property {string} [email] - Customer email
 * @property {string} [address] - Customer address
 */

/**
 * @typedef {Object} LineItem
 * @property {number} no - Item number
 * @property {number} qty - Quantity
 * @property {string} unit - Unit of measurement (e.g., 'UNIT', 'KG')
 * @property {number} unitPrice - Price per unit
 * @property {string} description - Item description
 * @property {string} total - Total price for this item (qty * unitPrice), as a string with 2 decimals
 */

/**
 * @typedef {Object} Quotation
 * @property {string} date - Date in DD/MM/YYYY format
 * @property {Company} company - Company details
 * @property {Customer} customer - Customer details
 * @property {LineItem[]} lineItems - List of line items
 * @property {number} [taxRate] - Tax rate as a percentage (e.g., 15 for 15%)
 * @property {string} [taxAmount] - Calculated tax amount
 * @property {number} [discount] - Discount amount
 * @property {string} [subTotal] - Sum of line items before tax/discount
 * @property {string} grandTotal - Final total amount
 * @property {string} [templateId] - Optional template ID override
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
  taxAmount: "0.00",
  discount: 0,
  subTotal: "0.00",
  grandTotal: "0.00",
};
