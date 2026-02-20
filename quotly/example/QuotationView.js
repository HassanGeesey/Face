import React, { useState } from 'react';
import { View, Text, Button, ScrollView, Alert } from 'react-native';
import { quotlyManager, EMPTY_QUOTATION } from '../src/index.js';

const QuotationView = () => {
  const [quotation, setQuotation] = useState({
    ...EMPTY_QUOTATION,
    date: '25/05/2024',
    company: {
      ...EMPTY_QUOTATION.company,
      name: 'Quotly Services',
      email: 'hello@quotly.app',
      address: 'Tech Park, Bangalore',
      logo: 'https://pdfgen.app/logo.png',
      mobiles: ['+91 9876543210'],
    },
    customer: {
      name: 'Valued Customer',
    },
    lineItems: [
      {
        no: 1,
        qty: 1,
        unit: 'UNIT',
        unitPrice: 1500.00,
        description: 'Premium Consultation',
        total: '1500.00',
      },
      {
        no: 2,
        qty: 2,
        unit: 'UNIT',
        unitPrice: 500.00,
        description: 'Support Hours',
        total: '1000.00',
      }
    ],
    grandTotal: '2500.00',
  });

  const handleGeneratePDF = async () => {
    try {
      const blob = await quotlyManager(quotation, 'B');
      Alert.alert('Success', 'PDF Generated successfully!');
      // Further logic to save/share the blob
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleValidate = async () => {
    const result = await quotlyManager(quotation, 'C');
    if (result.valid) {
      Alert.alert('Validation', 'Quotation is valid!');
    } else {
      Alert.alert('Validation Errors', result.errors.join('\n'));
    }
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Quotation Preview</Text>
      <View style={{ marginVertical: 20 }}>
        <Text>Company: {quotation.company.name}</Text>
        <Text>Customer: {quotation.customer.name}</Text>
        <Text>Date: {quotation.date}</Text>
        <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Items:</Text>
        {quotation.lineItems.map((item, index) => (
          <Text key={index}>
            {item.no}. {item.description} - {item.qty} x {item.unitPrice} = {item.total}
          </Text>
        ))}
        <Text style={{ marginTop: 10, fontSize: 18, fontWeight: 'bold' }}>
          Grand Total: {quotation.grandTotal}
        </Text>
      </View>
      <Button title="Validate Quotation" onPress={handleValidate} />
      <View style={{ height: 10 }} />
      <Button title="Generate PDF" onPress={handleGeneratePDF} />
    </ScrollView>
  );
};

export default QuotationView;
