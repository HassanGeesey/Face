import React, { useState } from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';
import { quotlyManager, EMPTY_QUOTATION } from '../src/index.js';

const QuotationView = () => {
  const [quotation, setQuotation] = useState({
    ...EMPTY_QUOTATION,
    date: '01/01/2024',
    company: {
      name: 'My Company',
      email: 'contact@mycompany.com',
      address: 'Business Park, City',
      logo: 'https://via.placeholder.com/150',
      mobiles: ['1234567890'],
      landline: '011-2345678'
    },
    customer: {
      name: 'Valued Customer'
    },
    lineItems: [
      { qty: 1, unitPrice: 100, description: 'Service A', unit: 'UNIT' }
    ]
  });

  const [status, setStatus] = useState('');

  const handleGeneratePDF = async () => {
    try {
      setStatus('Generating PDF...');
      const result = await quotlyManager(quotation, 'B');
      setStatus('PDF Generated Successfully!');
      console.log('PDF Blob:', result);
    } catch (error) {
      setStatus('Error: ' + error.message);
      console.error(error);
    }
  };

  const handleValidate = async () => {
    const result = await quotlyManager(quotation, 'C');
    if (result.valid) {
      setStatus('Quotation is Valid');
    } else {
      setStatus('Errors: ' + result.errors.join(', '));
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Quotly Example</Text>

      <View style={styles.section}>
        <Text>Company: {quotation.company.name}</Text>
        <Text>Customer: {quotation.customer.name}</Text>
        <Text>Date: {quotation.date}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Line Items:</Text>
        {quotation.lineItems.map((item, index) => (
          <Text key={index}>{item.description} - {item.qty} x {item.unitPrice}</Text>
        ))}
        <Text style={styles.total}>Grand Total: {quotation.grandTotal}</Text>
      </View>

      <View style={styles.actions}>
        <Button title="Validate" onPress={handleValidate} />
        <Button title="Generate PDF" onPress={handleGeneratePDF} />
      </View>

      {status ? <Text style={styles.status}>{status}</Text> : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  subtitle: { fontSize: 18, fontWeight: 'bold' },
  section: { marginBottom: 20 },
  total: { marginTop: 10, fontWeight: 'bold', fontSize: 16 },
  actions: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 },
  status: { marginTop: 20, color: 'blue', textAlign: 'center' }
});

export default QuotationView;
