import React, { useState } from 'react';
import { View, Text, Button, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { quotlyManager, EMPTY_QUOTATION } from '../src/index.js';

const QuotationView = () => {
  const [quotation, setQuotation] = useState({
    ...EMPTY_QUOTATION,
    date: '25/10/2023',
    company: {
      name: 'Quotly Services',
      email: 'hello@quotly.app',
      address: 'Cloud City, Sky',
      logo: 'https://pdfgen.app/logo.png',
      mobiles: ['+1 234 567 890'],
    },
    customer: {
      name: 'John Doe',
    },
    lineItems: [
      { qty: 1, unit: 'UNIT', unitPrice: 150.00, description: 'Software Development' },
      { qty: 2, unit: 'HOURS', unitPrice: 75.00, description: 'Consulting' },
    ],
    taxRate: 15,
    discount: 50,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleModeA = async () => {
    const json = await quotlyManager(quotation, 'A');
    setResult(JSON.stringify(json, null, 2));
  };

  const handleModeC = async () => {
    const validation = await quotlyManager(quotation, 'C');
    setResult(JSON.stringify(validation, null, 2));
  };

  const handleGeneratePDF = async () => {
    setLoading(true);
    try {
      const blob = await quotlyManager(quotation, 'B');
      setResult('PDF Blob generated successfully. Size: ' + blob.size);
      // In a real app, you would use react-native-fs to save this blob
    } catch (error) {
      setResult('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Quotly Example</Text>

      <View style={styles.buttonContainer}>
        <Button title="View JSON (Mode A)" onPress={handleModeA} />
        <Button title="Validate (Mode C)" onPress={handleModeC} color="green" />
        <Button title="Generate PDF (Mode B)" onPress={handleGeneratePDF} color="orange" />
        <Button
          title="Switch Template (Debug Mode A)"
          onPress={() => quotlyManager(quotation, 'A', { templateId: 'alt-template-123' }).then(json => setResult(JSON.stringify(json, null, 2)))}
          color="purple"
        />
      </View>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {result && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Output:</Text>
          <Text style={styles.resultText}>{result}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  buttonContainer: { gap: 10, marginBottom: 20 },
  resultContainer: { padding: 10, backgroundColor: '#f0f0f0', borderRadius: 5 },
  resultTitle: { fontWeight: 'bold', marginBottom: 5 },
  resultText: { fontFamily: 'monospace', fontSize: 12 },
});

export default QuotationView;
