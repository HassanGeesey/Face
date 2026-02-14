import React, { useState } from 'react';
import { View, Text, Button, ScrollView, StyleSheet, Alert } from 'react-native';
import { quotlyManager, EMPTY_QUOTATION, updateLineItemsTotals, calculateGrandTotal } from '../src/index';

const QuotationView = () => {
  const [quotation, setQuotation] = useState({
    ...EMPTY_QUOTATION,
    date: '01/01/2024',
    company: {
      name: 'My Tech Store',
      email: 'sales@techstore.com',
      address: '123 Innovation Drive',
      logo: 'https://example.com/logo.png',
      mobiles: ['+1234567890'],
      landline: '011-223344'
    },
    customer: {
      name: 'John Doe'
    },
    lineItems: updateLineItemsTotals([
      { qty: 1, unit: 'UNIT', unitPrice: 1200, description: 'Laptop Pro' },
      { qty: 2, unit: 'UNIT', unitPrice: 25, description: 'Wireless Mouse' }
    ])
  });

  // Calculate grand total on init or when items change
  const grandTotal = calculateGrandTotal(quotation.lineItems);
  if (quotation.grandTotal !== grandTotal) {
    setQuotation(prev => ({ ...prev, grandTotal }));
  }

  const handleGeneratePDF = async () => {
    try {
      Alert.alert('Generating...', 'Please wait while we prepare your PDF.');
      const result = await quotlyManager(quotation, 'B');
      Alert.alert('Success', 'PDF generated successfully!');
      // In a real app, use react-native-fs to save the blob
      console.log('PDF Blob received:', result);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleValidate = async () => {
    const result = await quotlyManager(quotation, 'C');
    if (result.isValid) {
      Alert.alert('Valid', 'Quotation data is valid.');
    } else {
      Alert.alert('Invalid', result.errors.join('\n'));
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Quotation Preview</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Company: {quotation.company.name}</Text>
        <Text style={styles.label}>Customer: {quotation.customer.name}</Text>
        <Text style={styles.label}>Date: {quotation.date}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Items:</Text>
        {quotation.lineItems.map((item) => (
          <View key={item.no} style={styles.itemRow}>
            <Text>{item.no}. {item.description}</Text>
            <Text>{item.qty} x ${item.unitPrice} = ${item.total}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.grandTotal}>Grand Total: ${quotation.grandTotal}</Text>

      <View style={styles.buttonContainer}>
        <Button title="Validate Data" onPress={handleValidate} />
        <View style={{ height: 10 }} />
        <Button title="Generate PDF" onPress={handleGeneratePDF} color="#2196F3" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginTop: 10 },
  section: { marginBottom: 20, padding: 10, borderWidth: 1, borderColor: '#eee' },
  label: { fontSize: 16, marginBottom: 5 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  grandTotal: { fontSize: 20, fontWeight: 'bold', textAlign: 'right', marginTop: 20 },
  buttonContainer: { marginTop: 30 }
});

export default QuotationView;
