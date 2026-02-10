import React, { useState } from 'react';
import { View, Text, Button, ScrollView, Alert } from 'react-native';
import {
  EMPTY_QUOTATION,
  updateLineItemsTotals,
  calculateGrandTotal,
  quotlyManager
} from '../src/index';

const QuotationView = () => {
  const [quotation, setQuotation] = useState({
    ...EMPTY_QUOTATION,
    date: "25/05/2024",
    company: {
      name: "Tech Solutions Inc.",
      email: "info@techsolutions.com",
      address: "123 Innovation Way, Tech City",
      logo: "https://example.com/logo.png",
      mobiles: ["+1234567890"],
      landline: "011-22334455"
    },
    customer: {
      name: "John Doe"
    },
    lineItems: [
      { qty: 2, unit: "UNIT", unitPrice: 500, description: "Web Development" },
      { qty: 1, unit: "UNIT", unitPrice: 200, description: "Consulting" }
    ]
  });

  const handleGeneratePDF = async () => {
    try {
      // 1. Update totals
      const updatedItems = updateLineItemsTotals(quotation.lineItems);
      const grandTotal = calculateGrandTotal(updatedItems);

      const finalQuotation = {
        ...quotation,
        lineItems: updatedItems,
        grandTotal
      };

      // 2. Generate PDF (Mode B)
      // Note: in a real RN app, you'd handle the blob and save it using react-native-fs
      const pdfBlob = await quotlyManager(finalQuotation, 'B');
      Alert.alert("Success", "PDF generated successfully!");
      console.log("PDF Blob received", pdfBlob);

    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Quotation Preview</Text>
      <Text>Company: {quotation.company.name}</Text>
      <Text>Customer: {quotation.customer.name}</Text>
      <View style={{ marginVertical: 20 }}>
        {quotation.lineItems.map((item, index) => (
          <View key={index} style={{ marginBottom: 10 }}>
            <Text>{item.description} - {item.qty} x ${item.unitPrice}</Text>
          </View>
        ))}
      </View>
      <Button title="Generate PDF" onPress={handleGeneratePDF} />
    </ScrollView>
  );
};

export default QuotationView;
