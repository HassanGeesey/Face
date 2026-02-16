import React, { useState } from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';
import {
  updateLineItemsTotals,
  calculateGrandTotal,
  quotlyManager,
  EMPTY_QUOTATION
} from '../src/index.js';

const QuotationView = () => {
  const [quotation, setQuotation] = useState({
    ...EMPTY_QUOTATION,
    date: "25/05/2024",
    company: {
      name: "My Awesome Company",
      email: "hello@awesome.com",
      address: "123 Awesome St",
      logo: "https://example.com/logo.png",
      mobiles: ["+123456789"],
      landline: "",
    },
    customer: { name: "Valued Customer" },
    lineItems: [
      { qty: 1, unit: "UNIT", unitPrice: 100, description: "Awesome Service" }
    ]
  });

  const handleProcess = async () => {
    // 1. Update totals
    const updatedItems = updateLineItemsTotals(quotation.lineItems);
    const grandTotal = calculateGrandTotal(updatedItems);

    const updatedQuotation = {
      ...quotation,
      lineItems: updatedItems,
      grandTotal: grandTotal
    };

    setQuotation(updatedQuotation);

    // 2. Run Mode C (Validate)
    const validation = await quotlyManager(updatedQuotation, 'C');
    if (!validation.isValid) {
      alert("Errors: " + validation.errors.join("\n"));
      return;
    }

    // 3. Run Mode B (Generate)
    try {
      console.log("Generating PDF...");
      // In a real app, you'd handle the blob and save it
      // const blob = await quotlyManager(updatedQuotation, 'B');
      alert("Quotation is valid and ready to generate!");
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Quotation Preview</Text>
      <View style={styles.section}>
        <Text>Company: {quotation.company.name}</Text>
        <Text>Customer: {quotation.customer.name}</Text>
        <Text>Date: {quotation.date}</Text>
      </View>

      {quotation.lineItems.map((item, idx) => (
        <View key={idx} style={styles.item}>
          <Text>{item.description} x {item.qty} (@{item.unitPrice})</Text>
          <Text>Total: {item.total || "0.00"}</Text>
        </View>
      ))}

      <Text style={styles.grandTotal}>Grand Total: {quotation.grandTotal}</Text>

      <Button title="Process Quotation" onPress={handleProcess} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  section: { marginBottom: 20 },
  item: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  grandTotal: { fontSize: 20, fontWeight: 'bold', marginVertical: 20, textAlign: 'right' }
});

export default QuotationView;
