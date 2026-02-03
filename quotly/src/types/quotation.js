export const initialCompany = {
  logo: "IMAGE_URL",
  name: "COMPANY_NAME",
  email: "EMAIL",
  address: "ADDRESS",
  mobiles: ["PHONE_1", "PHONE_2"],
  landline: "LANDLINE",
};

export const initialCustomer = {
  name: "CUSTOMER_NAME",
};

export const initialLineItem = {
  no: 1,
  qty: 0,
  unit: "UNIT",
  unitPrice: 0,
  description: "DESCRIPTION",
  total: "0.00",
};

export const initialQuotation = {
  date: "DD/MM/YYYY",
  company: initialCompany,
  customer: initialCustomer,
  lineItems: [initialLineItem],
  grandTotal: "0.00",
};
