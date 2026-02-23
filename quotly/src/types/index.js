/**
 * @typedef {Object} Company
 * @property {string} logo - URL to company logo
 * @property {string} name
 * @property {string} email
 * @property {string} address
 * @property {string[]} mobiles
 * @property {string} [landline]
 */

/**
 * @typedef {Object} Customer
 * @property {string} name
 */

/**
 * @typedef {Object} LineItem
 * @property {number} no
 * @property {number} qty
 * @property {string} unit
 * @property {number} unitPrice
 * @property {string} description
 * @property {string} total - String with 2 decimals
 */

/**
 * @typedef {Object} Quotation
 * @property {string} date - DD/MM/YYYY
 * @property {Company} company
 * @property {Customer} customer
 * @property {LineItem[]} lineItems
 * @property {number} [taxRate] - Percentage (e.g., 15 for 15%)
 * @property {number} [discount] - Fixed amount to subtract
 * @property {string} [subTotal] - Sum of line items before tax/discount
 * @property {string} [taxAmount] - Calculated tax amount
 * @property {string} grandTotal - String with 2 decimals
 * @property {string} [templateId] - Optional template override for PDF generation
 */

export const EMPTY_QUOTATION = {
  date: '',
  company: {
    logo: '',
    name: '',
    email: '',
    address: '',
    mobiles: [],
    landline: '',
  },
  customer: {
    name: '',
  },
  lineItems: [],
  taxRate: 0,
  discount: 0,
  subTotal: '0.00',
  taxAmount: '0.00',
  grandTotal: '0.00',
};
