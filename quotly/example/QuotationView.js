import React, { useState } from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';
import { quotlyManager, EMPTY_QUOTATION } from '../src/index.js';

const QuotationView = () => {
  const [quotation, setQuotation] = useState({
    ...EMPTY_QUOTATION,
    date: "24/05/2024",
    company: {
      name: "Quotly Tech",
      email: "hello@quotly.test",
      address: "123 App Street",
      logo: "https://pdfgen.app/logo.png"
    },
    customer: { name: "Happy Client" },
    lineItems: [
      { qty: 1, unitPrice: 250.00, description: "Mobile App Development", unit: "UNIT" }
    ]
  });

  const handleGeneratePDF = async () => {
    try {
      const result = await quotlyManager(quotation, 'B');
      console.log("PDF Blob generated successfully", result);
      alert("PDF Generated!");
    } catch (error) {
      console.error(error);
      alert("Error: " + error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Quotation Preview</Text>
      <View style={styles.card}>
        <Text>From: {quotation.company.name}</Text>
        <Text>To: {quotation.customer.name}</Text>
        <Text>Date: {quotation.date}</Text>
      </View>

      <Text style={styles.subtitle}>Items</Text>
      {quotation.lineItems.map((item, i) => (
        <View key={i} style={styles.item}>
          <Text>{item.description}</Text>
          <Text>{item.qty} x ${item.unitPrice.toFixed(2)}</Text>
        </View>
      ))}

      <Button title="Generate PDF" onPress={handleGeneratePDF} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  card: { padding: 15, backgroundColor: '#f0f0f0', borderRadius: 8 },
  item: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }
});

export default QuotationView;
