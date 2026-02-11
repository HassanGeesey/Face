import React, { useState } from 'react';
import { View, Text, Button, ScrollView, StyleSheet, Alert } from 'react-native';
import {
  EMPTY_QUOTATION,
  updateLineItemsTotals,
  calculateGrandTotal,
  quotlyManager
} from '../src/index.js';

const QuotationView = () => {
  const [quotation, setQuotation] = useState({
    ...EMPTY_QUOTATION,
    date: '20/05/2024',
    company: {
      name: 'Quotly AI Services',
      email: 'hello@quotly.ai',
      address: '123 Tech Lane, Silicon Valley',
      logo: 'https://pdfgen.app/sample-logo.png',
      mobiles: ['+1 234 567 890'],
      landline: '011-2345678',
    },
    customer: {
      name: 'John Doe',
    },
    lineItems: [
      { qty: 2, unitPrice: 50, description: 'Consulting Session', unit: 'HRS' },
      { qty: 1, unitPrice: 1500, description: 'Mobile App Development', unit: 'JOB' },
    ],
  });

  const handleGenerate = async () => {
    try {
      // 1. Update line item totals and numbering
      const updatedItems = updateLineItemsTotals(quotation.lineItems);

      // 2. Calculate grand total
      const grandTotal = calculateGrandTotal(updatedItems);

      const finalQuotation = {
        ...quotation,
        lineItems: updatedItems,
        grandTotal,
      };

      // 3. Mode B: Generate PDF
      Alert.alert("Generating...", "Please wait while we generate your PDF.");
      const pdfBlob = await quotlyManager(finalQuotation, 'B');

      Alert.alert("Success", "PDF Generated successfully! (In a real app, you would save/share this blob)");
      console.log("PDF Blob received:", pdfBlob);

    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleValidate = async () => {
    const result = await quotlyManager(quotation, 'C');
    if (result.isValid) {
      Alert.alert("Valid", "Quotation is ready for generation.");
    } else {
      Alert.alert("Invalid", result.errors.join('\n'));
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
        <Text style={styles.sectionTitle}>Line Items</Text>
        {quotation.lineItems.map((item, index) => (
          <View key={index} style={styles.item}>
            <Text>{item.description} - {item.qty} {item.unit} @ ${item.unitPrice}</Text>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <Button title="Validate Quotation" onPress={handleValidate} color="#666" />
        <View style={{ height: 10 }} />
        <Button title="Generate PDF (Mode B)" onPress={handleGenerate} color="#007AFF" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  section: { marginBottom: 20, padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  label: { fontSize: 16, marginBottom: 5 },
  item: { marginBottom: 5 },
  actions: { marginTop: 20 },
});

export default QuotationView;
