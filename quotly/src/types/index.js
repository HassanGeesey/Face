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
 * @property {string} grandTotal - String with 2 decimals
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
  grandTotal: '0.00',
};
