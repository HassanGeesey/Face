// Company Info
export const defaultCompany = {
  logo: "",
  name: "",
  email: "",
  address: "",
  mobiles: [],
  landline: "",
};

// Customer Info
export const defaultCustomer = {
  name: "",
};

// Line Item
export const defaultLineItem = {
  no: 1,
  qty: 0,
  unit: "UNIT",
  unitPrice: 0,
  description: "",
  total: "0.00",
};

// Quotation
export const defaultQuotation = {
  date: "", // DD/MM/YYYY
  company: defaultCompany,
  customer: defaultCustomer,
  lineItems: [],
  grandTotal: "0.00",
};
