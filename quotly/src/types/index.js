/**
 * @typedef {Object} Company
 * @property {string} logo - Image URL
 * @property {string} name
 * @property {string} email
 * @property {string} address
 * @property {string[]} mobiles
 * @property {string} landline
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
 * @property {string} total
 */

/**
 * @typedef {Object} Quotation
 * @property {string} date - DD/MM/YYYY
 * @property {Company} company
 * @property {Customer} customer
 * @property {LineItem[]} lineItems
 * @property {string} grandTotal
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
