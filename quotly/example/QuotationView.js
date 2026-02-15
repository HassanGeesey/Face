import React, { useState } from 'react';
import { View, Text, Button, ScrollView, Alert } from 'react-native';
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
      { qty: 1, unit: "UNIT", unitPrice: 100, description: "Consulting Fee" }
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
      Alert.alert("Success", "PDF Generated!");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to generate PDF");
    }
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Quotly</Text>

      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontWeight: 'bold' }}>From:</Text>
        <Text>{quotation.company.name}</Text>
        <Text>{quotation.company.email}</Text>
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontWeight: 'bold' }}>Bill To:</Text>
        <Text>{quotation.customer.name}</Text>
      </View>

      <View style={{ marginVertical: 10 }}>
        <Text style={{ fontWeight: 'bold', borderBottomWidth: 1, marginBottom: 5 }}>Line Items:</Text>
        {quotation.lineItems.map((item, i) => (
          <Text key={i}>
            {item.description}: {item.qty} x {item.unitPrice} = {item.total || (item.qty * item.unitPrice).toFixed(2)}
          </Text>
        ))}
      </View>

      <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 10 }}>
        Grand Total: {quotation.grandTotal}
      </Text>

      <View style={{ marginTop: 20, gap: 10 }}>
        <Button title="Recalculate Totals" onPress={handleCalculate} />
        <Button title="Generate PDF" onPress={handleGeneratePDF} color="#2196F3" />
      </View>
    </ScrollView>
  );
};

export default QuotationView;
