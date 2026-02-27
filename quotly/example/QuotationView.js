import React, { useState } from 'react';
import { View, Text, Button, Alert, ScrollView } from 'react-native';
import { quotlyManager, EMPTY_QUOTATION } from '../src/index.js';

/**
 * Example React Native component demonstrating how to use the Quotly library.
 */
const QuotationView = () => {
  const [quotation, setQuotation] = useState({
    ...EMPTY_QUOTATION,
    date: '25/12/2023',
    company: {
      name: 'Acme Corp',
      email: 'contact@acme.com',
      address: '123 Business Rd',
      logo: 'https://example.com/logo.png',
      mobiles: ['+123456789'],
    },
    customer: { name: 'Jane Smith' },
    lineItems: [
      { qty: 2, unitPrice: 100, description: 'Service A' },
      { qty: 1, unitPrice: 50, description: 'Product B' },
    ],
  });

  const handleGeneratePDF = async () => {
    try {
      // Use Mode B to validate and generate PDF
      const pdfBlob = await quotlyManager(quotation, 'B');
      Alert.alert('Success', 'PDF generated successfully!');
      console.log('PDF Blob received:', pdfBlob);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleDebug = async () => {
    // Use Mode A to see the calculated JSON
    const debugData = await quotlyManager(quotation, 'A');
    console.log('Quotation JSON:', JSON.stringify(debugData, null, 2));
    Alert.alert('Debug', `Grand Total: ${debugData.grandTotal} ${debugData.currency}`);
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Quotly Demo</Text>
      <View style={{ marginVertical: 20 }}>
        <Text>Company: {quotation.company.name}</Text>
        <Text>Customer: {quotation.customer.name}</Text>
        <Text>Items: {quotation.lineItems.length}</Text>
      </View>
      <Button title="Debug JSON (Mode A)" onPress={handleDebug} />
      <View style={{ height: 10 }} />
      <Button title="Generate PDF (Mode B)" onPress={handleGeneratePDF} />
    </ScrollView>
  );
};

export default QuotationView;
