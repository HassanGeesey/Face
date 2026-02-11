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
 * @property {number} no - Item number
 * @property {number} qty - Quantity
 * @property {string} unit - Unit (e.g., "UNIT")
 * @property {number} unitPrice - Price per unit
 * @property {string} description - Item description
 * @property {string} total - Total price as string with 2 decimals
 */

/**
 * @typedef {Object} Quotation
 * @property {string} date - Date in DD/MM/YYYY format
 * @property {Company} company - Company information
 * @property {Customer} customer - Customer information
 * @property {LineItem[]} lineItems - List of items
 * @property {string} grandTotal - Grand total as string with 2 decimals
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
