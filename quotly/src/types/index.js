/**
 * @typedef {Object} Company
 * @property {string} logo - URL to the company logo image
 * @property {string} name - Company name
 * @property {string} email - Company email address
 * @property {string} address - Company physical address
 * @property {string[]} mobiles - List of mobile phone numbers
 * @property {string} landline - Landline phone number
 */

/**
 * @typedef {Object} Customer
 * @property {string} name - Customer name
 */

/**
 * @typedef {Object} LineItem
 * @property {number} no - Item sequence number
 * @property {number} qty - Quantity
 * @property {string} unit - Unit of measurement (e.g., UNIT, KG, etc.)
 * @property {number} unitPrice - Price per unit
 * @property {string} description - Item description
 * @property {string} total - Calculated total for the item (qty * unitPrice) as a string with 2 decimals
 */

/**
 * @typedef {Object} Quotation
 * @property {string} date - Date in DD/MM/YYYY format
 * @property {Company} company - Company information
 * @property {Customer} customer - Customer information
 * @property {LineItem[]} lineItems - List of items in the quotation
 * @property {string} grandTotal - Sum of all line item totals as a string with 2 decimals
 */

/**
 * Initial empty quotation state
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
