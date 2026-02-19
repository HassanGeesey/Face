/**
 * @typedef {Object} Company
 * @property {string} logo - IMAGE_URL
 * @property {string} name - COMPANY_NAME
 * @property {string} email - EMAIL
 * @property {string} address - ADDRESS
 * @property {string[]} mobiles - ["PHONE_1", "PHONE_2"]
 * @property {string} landline - LANDLINE
 */

/**
 * @typedef {Object} Customer
 * @property {string} name - CUSTOMER_NAME
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
