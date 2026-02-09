import React, { useState } from 'react';
import { View, Text, Button, ScrollView, Alert } from 'react-native';
import {
  updateLineItemsTotals,
  calculateGrandTotal,
  quotlyManager
} from '../src/index.js';

const QuotationView = () => {
  const [quotation, setQuotation] = useState({
    date: "25/12/2023",
    company: {
      logo: "https://example.com/logo.png",
      name: "Tech Corp",
      email: "contact@techcorp.com",
      address: "123 Silicon Valley",
      mobiles: ["+1234567890"],
      landline: "+1098765432",
    },
    customer: {
      name: "John Doe",
    },
    lineItems: [
      { qty: 2, unit: "UNIT", unitPrice: 50.00, description: "Web Development" },
    ],
    grandTotal: "0.00",
  });

  const handleGeneratePDF = async () => {
    try {
      // 1. Prepare data
      const updatedItems = updateLineItemsTotals(quotation.lineItems);
      const grandTotal = calculateGrandTotal(updatedItems);

      const finalQuotation = {
        ...quotation,
        lineItems: updatedItems,
        grandTotal: grandTotal,
      };

      // 2. Generate
      const result = await quotlyManager(finalQuotation, 'B');

      if (result.status === 'success') {
        Alert.alert("Success", "PDF Generated successfully!");
        // Here you would use react-native-fs or similar to save result.data (Blob)
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Quotation Generator</Text>
      <Text>Company: {quotation.company.name}</Text>
      <Text>Customer: {quotation.customer.name}</Text>

      {quotation.lineItems.map((item, index) => (
        <View key={index} style={{ marginVertical: 10 }}>
          <Text>{item.description} - {item.qty} x {item.unitPrice}</Text>
        </View>
      ))}

      <Button title="Generate PDF" onPress={handleGeneratePDF} />
    </ScrollView>
  );
};

export default QuotationView;
