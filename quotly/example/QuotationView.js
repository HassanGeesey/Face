import React, { useState } from 'react';
import { View, Text, Button, ScrollView } from 'react-native';
import { updateLineItemsTotals, calculateGrandTotal, generatePDF } from '../src/index';

const QuotationView = () => {
  const [quotation, setQuotation] = useState({
    date: "25/10/2023",
    company: {
      logo: "https://via.placeholder.com/150",
      name: "Quotly Inc",
      email: "hello@quotly.app",
      address: "123 Tech Avenue, Silicon Valley",
      mobiles: ["+1 555 0123"],
    },
    customer: { name: "Valued Client" },
    lineItems: [
      { qty: 1, unit: "UNIT", unitPrice: 100, description: "Consulting Fee", total: "100.00" }
    ],
    grandTotal: "100.00"
  });

  const handleCalculate = () => {
    const updatedItems = updateLineItemsTotals(quotation.lineItems);
    const total = calculateGrandTotal(updatedItems);
    setQuotation({ ...quotation, lineItems: updatedItems, grandTotal: total });
  };

  const handleGeneratePDF = async () => {
    try {
      const blob = await generatePDF(quotation);
      console.log("PDF generated successfully", blob);
      alert("PDF Generated!");
    } catch (error) {
      console.error(error);
      alert("Error generating PDF");
    }
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Quotly</Text>
      <Text>Company: {quotation.company.name}</Text>
      <Text>Customer: {quotation.customer.name}</Text>
      <View style={{ marginVertical: 10 }}>
        {quotation.lineItems.map((item, i) => (
          <Text key={i}>{item.description} - {item.qty} x {item.unitPrice} = {item.total}</Text>
        ))}
      </View>
      <Text style={{ fontWeight: 'bold' }}>Grand Total: {quotation.grandTotal}</Text>
      <Button title="Calculate" onPress={handleCalculate} />
      <Button title="Generate PDF" onPress={handleGeneratePDF} />
    </ScrollView>
  );
};

export default QuotationView;
