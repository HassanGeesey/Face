import React, { useState } from 'react';
import { View, Text, Button, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { quotlyManager, EMPTY_QUOTATION } from '../src/index.js';

/**
 * Example React Native component for Quotly
 */
const QuotationView = () => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);

  const sampleQuotation = {
    ...EMPTY_QUOTATION,
    date: '25/05/2024',
    company: {
      name: 'Quotly AI Services',
      email: 'ai@quotly.app',
      address: 'Cloud City, Orbit 7',
      logo: 'https://pdfgen.app/sample-logo.png',
    },
    customer: { name: 'Valued Client' },
    lineItems: [
      { qty: 10, unitPrice: 125.50, description: 'AI Integration Lab', unit: 'HRS' },
      { qty: 1, unitPrice: 500.00, description: 'Cloud Setup Fee', unit: 'FIXED' },
    ],
    taxRate: 18,
    discount: 50.00,
  };

  const handleGeneratePDF = async () => {
    setLoading(true);
    try {
      // For demonstration, we use Mode C to validate first
      const validationReport = await quotlyManager(sampleQuotation, 'C');
      setReport(validationReport);

      if (validationReport.isValid) {
        // Mode B would call the API
        console.log('Validation passed, ready to generate PDF');
        // const blob = await quotlyManager(sampleQuotation, 'B');
        // Handle blob...
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Quotly RN Example</Text>

      <View style={styles.card}>
        <Text>Client: {sampleQuotation.customer.name}</Text>
        <Text>Date: {sampleQuotation.date}</Text>
        <Text>Items: {sampleQuotation.lineItems.length}</Text>
      </View>

      <Button title="Validate & Generate" onPress={handleGeneratePDF} disabled={loading} />

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {report && (
        <View style={styles.report}>
          <Text style={styles.subtitle}>Report (Mode C)</Text>
          <Text>Valid: {report.isValid ? '✅' : '❌'}</Text>
          <Text>Integrity: {report.integrityCheck.passed ? '✅' : '❌'}</Text>
          <Text>Subtotal: ${report.quotation.subTotal}</Text>
          <Text>Tax: ${report.quotation.taxAmount}</Text>
          <Text style={styles.bold}>Total: ${report.quotation.grandTotal}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  card: { padding: 15, backgroundColor: '#fff', borderRadius: 8, marginBottom: 20 },
  report: { marginTop: 30, padding: 15, backgroundColor: '#e8e8e8', borderRadius: 8 },
  bold: { fontWeight: 'bold', fontSize: 16 },
});

export default QuotationView;
