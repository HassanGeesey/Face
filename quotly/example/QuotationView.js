import React, { useState } from 'react';
import { View, Text, Button, Alert, ScrollView } from 'react-native';
import { quotlyManager, EMPTY_QUOTATION } from '../src/index.js';

const QuotationView = () => {
  const [quotation, setQuotation] = useState({
    ...EMPTY_QUOTATION,
    date: '25/05/2024',
    company: {
      name: 'Acme Corp',
      email: 'contact@acme.com',
      address: '123 Business Rd',
      logo: 'https://example.com/logo.png',
      mobiles: ['+1234567890'],
    },
    customer: {
      name: 'John Doe',
    },
    lineItems: [
      {
        qty: 2,
        unit: 'UNIT',
        unitPrice: 50.0,
        description: 'Consulting Service',
      },
    ],
    taxRate: 15,
  });

  const handlePreview = async () => {
    const debugJson = await quotlyManager(quotation, 'A');
    console.log('Quotation JSON:', debugJson);
    Alert.alert('Success', `Grand Total: ${debugJson.grandTotal}`);
  };

  const handleGeneratePDF = async () => {
    try {
      const pdfBlob = await quotlyManager(quotation, 'B');
      Alert.alert('Success', 'PDF generated successfully!');
      // In a real app, use react-native-fs to save the blob
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleValidate = async () => {
    const result = await quotlyManager(quotation, 'C');
    if (result.valid) {
      Alert.alert('Valid', 'Quotation is valid and consistent.');
    } else {
      Alert.alert('Invalid', result.errors.join('\n'));
    }
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Quotly Manager</Text>
      <View style={{ marginVertical: 20 }}>
        <Text>Company: {quotation.company.name}</Text>
        <Text>Customer: {quotation.customer.name}</Text>
        <Text>Items: {quotation.lineItems.length}</Text>
      </View>
      <Button title="Debug JSON (Mode A)" onPress={handlePreview} />
      <View style={{ height: 10 }} />
      <Button title="Generate PDF (Mode B)" onPress={handleGeneratePDF} />
      <View style={{ height: 10 }} />
      <Button title="Validate (Mode C)" onPress={handleValidate} />
    </ScrollView>
  );
};

export default QuotationView;
